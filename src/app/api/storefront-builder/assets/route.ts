import { NextRequest } from "next/server";
import { authorizeStorefrontBuilderRequest } from "../_lib/auth";
import { logStorefrontBuilderApiEvent } from "../_lib/observability";
import { getPublicRequestOrigin, proxyStorefrontBuilderRequest } from "../_lib/upstream";

function jsonResponse(data: unknown, status: number) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store",
		},
	});
}

async function proxy(request: NextRequest, method: "GET" | "POST") {
	const startedAt = Date.now();
	const auth = authorizeStorefrontBuilderRequest(request, {
		requireWriteAccess: method === "POST",
		requiredPermissions: method === "POST" ? [] : undefined,
	});
	if (!auth.ok) {
		logStorefrontBuilderApiEvent({
			endpoint: "assets",
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
	const search = request.nextUrl.search || "";
	const result = await proxyStorefrontBuilderRequest({
		origin: getPublicRequestOrigin(request),
		path: `/internal/storefront-builder/assets${search}`,
		method,
		bodyText,
	});

	logStorefrontBuilderApiEvent({
		endpoint: "assets",
		method,
		status: result.status,
		durationMs: Date.now() - startedAt,
		outcome: result.ok ? "ok" : "upstream_error",
		tenantCode: request.headers.get("x-tenant-code") || undefined,
		error: result.ok ? undefined : "assets_upstream_failed",
	});
	return jsonResponse(result.data, result.status);
}

export async function GET(request: NextRequest) {
	return proxy(request, "GET");
}

export async function POST(request: NextRequest) {
	return proxy(request, "POST");
}
