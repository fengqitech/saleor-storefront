import "server-only";

import { headers } from "next/headers";

export type TenantGraphQLHeaders = Record<string, string>;

/**
 * Returns stable, tenant-scoping headers for calling the multi-tenant Saleor API.
 *
 * IMPORTANT: Do not call this from inside a `"use cache"` scope. Resolve it in a
 * dynamic boundary and pass the returned object into cached functions.
 */
export async function getTenantGraphQLHeaders(): Promise<TenantGraphQLHeaders> {
	try {
		const h = await headers();
		const tenantDomain = h.get("x-tenant-domain") || h.get("x-forwarded-host") || h.get("host");
		const tenantCode = h.get("x-tenant-code");
		const proto = h.get("x-forwarded-proto") || "https";

		const out: TenantGraphQLHeaders = {};
		if (tenantDomain) {
			out["X-Tenant-Domain"] = tenantDomain;
			out["X-Forwarded-Host"] = tenantDomain;
			out["X-Forwarded-Proto"] = proto;
		}
		if (tenantCode) {
			out["X-Tenant-Code"] = tenantCode;
		}
		return out;
	} catch {
		// No request context (build-time / non-request).
		return {};
	}
}
