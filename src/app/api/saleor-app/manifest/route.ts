import { type AppManifest, type AppPermission } from "@saleor/app-sdk/types";
import { type NextRequest } from "next/server";
import packageJson from "../../../../../package.json";

function trimTrailingSlash(value: string): string {
	return value.endsWith("/") ? value.slice(0, -1) : value;
}

function firstHeaderValue(value: string | null): string | null {
	if (!value) {
		return null;
	}
	// Headers can be a comma-separated list in some proxy setups.
	const first = value.split(",")[0]?.trim();
	return first || null;
}

function getAppPublicBaseUrl(request: NextRequest): string {
	// In this repo, tenant domains are fronted by a Worker + origin nginx.
	// The request origin seen by Next.js can be the origin host (e.g. `dev-sg-origin...`),
	// but the public app URLs must use the tenant domain so Saleor can embed it correctly
	// and call `tokenTargetUrl` on the reachable public host.
	const tenantDomain =
		firstHeaderValue(request.headers.get("x-tenant-domain")) ||
		firstHeaderValue(request.headers.get("x-forwarded-host"));
	const proto =
		firstHeaderValue(request.headers.get("x-forwarded-proto")) || request.nextUrl.protocol.replace(":", "");

	if (tenantDomain) {
		// Accept either a bare host or a full URL.
		if (tenantDomain.includes("://")) {
			return new URL(tenantDomain).origin;
		}
		return `${proto}://${tenantDomain}`;
	}

	return request.nextUrl.origin;
}

export async function GET(request: NextRequest) {
	const baseUrl = trimTrailingSlash(getAppPublicBaseUrl(request));
	const permissions = (process.env.STOREFRONT_BUILDER_WRITE_PERMISSIONS || "MANAGE_PAGES")
		.split(",")
		.map((value) => value.trim())
		.filter(Boolean) as AppPermission[];

	const manifest: AppManifest = {
		id: process.env.STOREFRONT_BUILDER_APP_ID || "saleor.app.fengqi.storefront-builder",
		name: process.env.STOREFRONT_BUILDER_APP_NAME || "FengQi Storefront Builder",
		version: packageJson.version,
		about: "Tenant storefront builder app for theme + homepage layout management.",
		appUrl: `${baseUrl}/saleor-app/storefront-builder`,
		tokenTargetUrl: `${baseUrl}/api/saleor-app/register`,
		permissions,
		author: "FengQi",
		homepageUrl: "https://github.com/fengqitech",
		supportUrl: "https://github.com/fengqitech",
		requiredSaleorVersion: ">=3.20 <4",
		extensions: [],
	};

	return Response.json(manifest);
}
