import { NextRequest } from "next/server";
import { getPublicRequestOrigin, proxyStorefrontBuilderRequest } from "../_lib/upstream";
import { authorizeStorefrontBuilderRequest } from "../_lib/auth";
import { logStorefrontBuilderApiEvent } from "../_lib/observability";

function getThemeWritePermissions(): string[] {
	// Theme config is storefront-owned configuration (not Saleor Pages).
	// Default: staff-only writes; tighten via `STOREFRONT_BUILDER_THEME_WRITE_PERMISSIONS`.
	return (process.env.STOREFRONT_BUILDER_THEME_WRITE_PERMISSIONS || "")
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
		requiredPermissions: method === "GET" ? undefined : getThemeWritePermissions(),
	});
	if (!auth.ok) {
		logStorefrontBuilderApiEvent({
			endpoint: "theme",
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
		path: "/internal/storefront-builder/theme",
		method,
		bodyText,
	});
	logStorefrontBuilderApiEvent({
		endpoint: "theme",
		method,
		status: result.status,
		durationMs: Date.now() - startedAt,
		outcome: result.ok ? "ok" : "upstream_error",
		tenantCode: request.headers.get("x-tenant-code") || undefined,
		channel:
			(method === "GET" ? request.nextUrl.searchParams.get("channel") : null) ||
			request.nextUrl.searchParams.get("tenantChannel") ||
			undefined,
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
