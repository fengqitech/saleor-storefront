import { NextRequest } from "next/server";
import { getSaleorApiUrl } from "@/lib/saleor-api-url.server";
import { tryRewriteObjectStorageUrlToMediaPath } from "@/lib/tenant-media-url";
import { authorizeStorefrontBuilderRequest } from "../_lib/auth";
import { getPublicRequestOrigin } from "../_lib/upstream";

type FileUploadMutationResult = {
	data?: {
		fileUpload?: {
			uploadedFile?: {
				url?: string | null;
			} | null;
			errors?: Array<{
				field?: string | null;
				message?: string | null;
				code?: string | null;
			}> | null;
		} | null;
	} | null;
	errors?: Array<{
		message?: string | null;
	}> | null;
};

type BuilderAssetItem = {
	id?: string;
	name?: string;
	mediaUrl?: string;
	url?: string;
	mimeType?: string;
	size?: number;
	createdAt?: string;
	updatedAt?: string;
	alt?: string;
	tags?: string[];
};

type BuilderAssetsMutationResult = {
	asset?: BuilderAssetItem;
	assets?: {
		items?: BuilderAssetItem[];
		count?: number;
		updatedAt?: string | null;
	};
	error?: string;
};

const FILE_UPLOAD_MUTATION = `
	mutation StorefrontBuilderUploadImage($file: Upload!) {
		fileUpload(file: $file) {
			uploadedFile {
				url
			}
			errors {
				field
				message
				code
			}
		}
	}
`;

function jsonResponse(data: unknown, status: number) {
	return Response.json(data, {
		status,
		headers: {
			"Cache-Control": "no-store",
		},
	});
}

function getTenantHeaders(request: NextRequest): Headers {
	const headers = new Headers();
	const tenantDomain = request.headers.get("x-tenant-domain");
	const tenantCode = request.headers.get("x-tenant-code");
	const forwardedHost = request.headers.get("x-forwarded-host");

	if (tenantDomain) {
		headers.set("X-Tenant-Domain", tenantDomain);
	}
	if (tenantCode) {
		headers.set("X-Tenant-Code", tenantCode);
	}
	if (forwardedHost) {
		headers.set("X-Forwarded-Host", forwardedHost);
	}
	return headers;
}

function formatUploadErrors(
	errors:
		| Array<{
				field?: string | null;
				message?: string | null;
				code?: string | null;
		  }>
		| null
		| undefined,
): string {
	if (!Array.isArray(errors) || errors.length === 0) {
		return "图片上传失败";
	}
	const first = errors.find((item) => !!item?.message);
	if (!first?.message) {
		return "图片上传失败";
	}
	return first.message;
}

export async function POST(request: NextRequest) {
	const auth = authorizeStorefrontBuilderRequest(request, {
		requireWriteAccess: true,
		requiredPermissions: [],
	});
	if (!auth.ok) {
		return jsonResponse({ error: auth.error || "Unauthorized" }, auth.status);
	}

	const incoming = await request.formData().catch(() => null);
	const file = incoming?.get("file");
	if (!(file instanceof File)) {
		return jsonResponse({ error: "请选择要上传的图片文件" }, 400);
	}
	if (!file.type.startsWith("image/")) {
		return jsonResponse({ error: "仅支持图片文件上传" }, 400);
	}

	const saleorApiUrl = await getSaleorApiUrl();
	if (!saleorApiUrl) {
		return jsonResponse({ error: "Missing Saleor API URL" }, 500);
	}

	const operations = JSON.stringify({
		query: FILE_UPLOAD_MUTATION,
		variables: { file: null },
	});
	const map = JSON.stringify({
		"0": ["variables.file"],
	});

	const body = new FormData();
	body.append("operations", operations);
	body.append("map", map);
	body.append("0", file, file.name);

	const headers = getTenantHeaders(request);
	headers.set("Accept", "application/json");
	const sessionToken = (auth.session?.saleorAuthToken || "").trim();
	const appToken = (process.env.SALEOR_APP_TOKEN || "").trim();
	const effectiveAuthToken = sessionToken || appToken;
	if (!effectiveAuthToken) {
		return jsonResponse({ error: "Missing Saleor auth token for upload" }, 500);
	}
	headers.set("Authorization", `Bearer ${effectiveAuthToken}`);

	let response: Response;
	try {
		response = await fetch(saleorApiUrl, {
			method: "POST",
			headers,
			body,
			cache: "no-store",
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Saleor upload request failed";
		return jsonResponse({ error: message }, 502);
	}

	const payload = (await response.json().catch(() => null)) as FileUploadMutationResult | null;
	if (!response.ok) {
		const gqlError = payload?.errors?.find((errorItem) => !!errorItem?.message)?.message;
		return jsonResponse({ error: gqlError || `Saleor upload failed (HTTP ${response.status})` }, 502);
	}
	if (payload?.errors?.length) {
		return jsonResponse({ error: payload.errors[0]?.message || "Saleor GraphQL upload failed" }, 502);
	}
	if (payload?.data?.fileUpload?.errors?.length) {
		return jsonResponse({ error: formatUploadErrors(payload.data.fileUpload.errors) }, 400);
	}

	const uploadedUrl = payload?.data?.fileUpload?.uploadedFile?.url?.trim();
	if (!uploadedUrl) {
		return jsonResponse({ error: "上传成功，但未返回图片 URL" }, 502);
	}

	const mediaUrl = tryRewriteObjectStorageUrlToMediaPath(uploadedUrl) || uploadedUrl;

	const builderSecret = (process.env.STOREFRONT_BUILDER_SECRET || "").trim();
	let registeredAsset: BuilderAssetItem | undefined;
	let registeredAssetsState: BuilderAssetsMutationResult["assets"] | undefined;
	if (builderSecret) {
		const registerOrigin = getPublicRequestOrigin(request);
		const registerBody = {
			action: "add",
			asset: {
				mediaUrl,
				url: uploadedUrl,
				name: file.name,
				mimeType: file.type,
				size: file.size,
				createdBy: auth.session?.sub || "storefront-builder",
				tags: ["builder-upload"],
			},
		};
		try {
			const registerResponse = await fetch(`${registerOrigin}/internal/storefront-builder/assets`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Storefront-Builder-Secret": builderSecret,
				},
				body: JSON.stringify(registerBody),
				cache: "no-store",
			});
			const registerPayload = (await registerResponse
				.json()
				.catch(() => null)) as BuilderAssetsMutationResult | null;
			if (registerResponse.ok) {
				registeredAsset = registerPayload?.asset;
				registeredAssetsState = registerPayload?.assets;
			}
		} catch {
			// Best-effort registration only. Upload success should not fail on metadata indexing failure.
		}
	}

	return jsonResponse(
		{
			url: uploadedUrl,
			mediaUrl,
			asset: registeredAsset,
			assets: registeredAssetsState,
		},
		200,
	);
}
