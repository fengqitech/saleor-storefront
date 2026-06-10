import "server-only";

import type { TenantGraphQLHeaders } from "@/lib/tenant-graphql-headers.server";
import { normalizeHost } from "@/config/tenant-branding";

export function getTenantCacheKeyFromTenantGraphQLHeaders(
	tenantGraphQLHeaders: TenantGraphQLHeaders,
): string {
	const raw =
		tenantGraphQLHeaders["X-Tenant-Code"] ||
		tenantGraphQLHeaders["X-Tenant-Domain"] ||
		tenantGraphQLHeaders["X-Forwarded-Host"] ||
		"";

	const normalized = normalizeHost(raw);
	return normalized || "unknown";
}

export function getTenantCacheKeyFromRequestHeaders(headers: Headers): string {
	const raw =
		headers.get("x-tenant-code") ||
		headers.get("x-tenant-domain") ||
		headers.get("x-forwarded-host") ||
		headers.get("host");
	const normalized = normalizeHost(raw || "");
	return normalized || "unknown";
}

export function productCacheTag(tenantKey: string, channel: string, slug: string): string {
	return `tenant:${tenantKey}:product:${channel}:${slug}`;
}

export function categoryCacheTag(tenantKey: string, channel: string, slug: string): string {
	return `tenant:${tenantKey}:category:${channel}:${slug}`;
}

export function collectionCacheTag(tenantKey: string, channel: string, slug: string): string {
	return `tenant:${tenantKey}:collection:${channel}:${slug}`;
}

export function featuredProductsCacheTag(tenantKey: string, channel: string): string {
	return `tenant:${tenantKey}:collection:${channel}:featured-products`;
}

export function channelsCacheTag(tenantKey: string): string {
	return `tenant:${tenantKey}:channels`;
}

export function menuCacheTag(tenantKey: string, channel: string, slug: string): string {
	return `tenant:${tenantKey}:menu:${channel}:${slug}`;
}

export function pageCacheTag(tenantKey: string, channel: string, slug: string): string {
	return `tenant:${tenantKey}:page:${channel}:${slug}`;
}
