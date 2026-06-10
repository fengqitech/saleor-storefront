import "server-only";

import { headers } from "next/headers";
import { getTenantBrandingFromHeaders, type TenantBranding } from "./tenant-branding";

export async function getTenantBranding(): Promise<TenantBranding> {
	// Intentionally do NOT swallow missing request context errors.
	// If we silently fall back at build time, Next can prerender the storefront
	// and "bake in" the default tenant's branding. Multi-tenant by domain
	// requires request headers to influence rendering.
	const h = await headers();
	const forwardedHost = h.get("x-forwarded-host");
	const host = forwardedHost || h.get("host");
	return getTenantBrandingFromHeaders(host, {
		siteName: h.get("x-tenant-site-name"),
		themePreset: h.get("x-tenant-theme-preset"),
		themeOverrides: h.get("x-tenant-theme-overrides"),
		seoDefaultTitle: h.get("x-tenant-seo-default-title"),
		seoDefaultDescription: h.get("x-tenant-seo-default-description"),
		seoDefaultImage: h.get("x-tenant-seo-default-image"),
	});
}
