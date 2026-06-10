import "server-only";

import { headers } from "next/headers";

/**
 * Best-effort request origin resolver.
 *
 * In FengQi3, the storefront is served through Cloudflare Worker + origin proxy.
 * The real tenant domain is carried in X-Forwarded-Host.
 *
 * During build-time rendering (no request context), headers() throws - callers
 * should fall back to environment variables.
 */
export async function getRequestOrigin(): Promise<string | null> {
	try {
		const h = await headers();
		const proto = h.get("x-forwarded-proto") || "https";
		const host = h.get("x-forwarded-host") || h.get("host");
		if (!host) {
			return null;
		}
		return `${proto}://${host}`;
	} catch {
		return null;
	}
}
