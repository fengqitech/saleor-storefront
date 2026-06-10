import "server-only";

import { headers } from "next/headers";
import { getRequestOrigin } from "./request-origin.server";

export async function getSaleorApiUrlFromRequest(): Promise<string | null> {
	// Prefer an internal service URL (Docker network) when available.
	// This avoids routing server-side GraphQL traffic through Cloudflare and prevents
	// intermittent "Connection closed" failures during Server Components rendering.
	try {
		const h = await headers();
		const hasTenantContext = !!(
			h.get("x-tenant-code") ||
			h.get("x-tenant-domain") ||
			h.get("x-forwarded-host")
		);
		if (hasTenantContext && process.env.SALEOR_INTERNAL_API_URL) {
			return process.env.SALEOR_INTERNAL_API_URL;
		}
	} catch {
		// No request context (build-time / non-request)
	}

	const origin = await getRequestOrigin();
	if (!origin) {
		return null;
	}
	return `${origin}/graphql/`;
}

export async function getSaleorApiUrl(): Promise<string | null> {
	return (await getSaleorApiUrlFromRequest()) || process.env.NEXT_PUBLIC_SALEOR_API_URL || null;
}
