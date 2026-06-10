import { NextRequest } from "next/server";
import {
	getPublicRequestOrigin,
	proxyStorefrontBuilderRequest,
	triggerHomepageRevalidate,
} from "../_lib/upstream";
import { authorizeStorefrontBuilderRequest } from "../_lib/auth";
import { logStorefrontBuilderApiEvent } from "../_lib/observability";

function getLayoutWritePermissions(): string[] {
	// Homepage layout is storefront-owned configuration (not Saleor Pages).
	// By default we only require "isStaff" for writes; operators can tighten this by
	// setting `STOREFRONT_BUILDER_LAYOUT_WRITE_PERMISSIONS=MANAGE_PAGES,...`.
	return (process.env.STOREFRONT_BUILDER_LAYOUT_WRITE_PERMISSIONS || "")
		.split(",")
		.map((value) => value.trim())
		.filter(Boolean);
}

function jsonResponse(data: unknown, status: number) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store",
		},
	});
}

async function proxy(request: NextRequest, method: "GET" | "PUT" | "POST") {
	const startedAt = Date.now();
	const auth = authorizeStorefrontBuilderRequest(request, {
		requireWriteAccess: method !== "GET",
		requiredPermissions: method === "GET" ? undefined : getLayoutWritePermissions(),
	});
	if (!auth.ok) {
		logStorefrontBuilderApiEvent({
			endpoint: "homepage-layout",
			method,
			status: auth.status,
			durationMs: Date.now() - startedAt,
			outcome: "auth_denied",
			tenantCode: request.headers.get("x-tenant-code") || undefined,
			error: auth.error,
		});
		return jsonResponse({ error: auth.error || "Unauthorized" }, auth.status);
	}
	const bodyText = method === "GET" ? undefined : await request.text();
	const result = await proxyStorefrontBuilderRequest({
		origin: getPublicRequestOrigin(request),
		path: "/internal/storefront-builder/homepage-layout",
		method,
		bodyText,
	});
	let revalidateFailed = false;
	let revalidateError = "";
	let resolvedChannel = "";

	if (method === "POST" && result.ok) {
		const payload = result.data as { tenant?: { channel?: string } } | null;
		const channel = payload?.tenant?.channel || "default-channel";
		resolvedChannel = channel;
		const revalidateResult = await triggerHomepageRevalidate(request.nextUrl.origin, channel);
		if (revalidateResult.attempted && !revalidateResult.ok) {
			revalidateFailed = true;
			revalidateError = revalidateResult.error || "Homepage revalidate failed";
		}
	}
	logStorefrontBuilderApiEvent({
		endpoint: "homepage-layout",
		method,
		status: result.status,
		durationMs: Date.now() - startedAt,
		outcome: revalidateFailed ? "revalidate_failed" : result.ok ? "ok" : "upstream_error",
		tenantCode: request.headers.get("x-tenant-code") || undefined,
		channel: resolvedChannel || request.nextUrl.searchParams.get("channel") || undefined,
		error: revalidateError || undefined,
	});

	return jsonResponse(result.data, result.status);
}

export async function GET(request: NextRequest) {
	return proxy(request, "GET");
}

export async function PUT(request: NextRequest) {
	return proxy(request, "PUT");
}

export async function POST(request: NextRequest) {
	return proxy(request, "POST");
}
