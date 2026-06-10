import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { NavLink } from "./nav-link";
import { executePublicGraphQL } from "@/lib/graphql";
import { MenuGetBySlugDocument } from "@/gql/graphql";
import { getTenantCacheKeyFromTenantGraphQLHeaders, menuCacheTag } from "@/lib/cache-tags";
import type { TenantGraphQLHeaders } from "@/lib/tenant-graphql-headers.server";
import { isExternalHref, sanitizeHref } from "@/lib/safe-href";

export const NavLinks = async ({
	channel,
	saleorApiUrl,
	tenantGraphQLHeaders,
}: {
	channel: string;
	saleorApiUrl: string;
	tenantGraphQLHeaders?: TenantGraphQLHeaders;
}) => {
	"use cache";
	cacheLife("hours"); // 1 hour cache - navigation rarely changes
	const tenantKey = tenantGraphQLHeaders
		? getTenantCacheKeyFromTenantGraphQLHeaders(tenantGraphQLHeaders)
		: "unknown";
	cacheTag(menuCacheTag(tenantKey, channel, "navbar")); // Tag for on-demand revalidation

	const result = await executePublicGraphQL(MenuGetBySlugDocument, {
		variables: { slug: "navbar", channel },
		revalidate: 60 * 60, // 1 hour
		headers: tenantGraphQLHeaders,
		saleorApiUrl,
	});

	if (!result.ok) {
		// During build, if the API is unreachable, render minimal nav.
		// The page will re-fetch when a user visits.
		console.warn(`[NavLinks] Failed to fetch navigation for ${channel}:`, result.error.message);
		return <NavLink href="/products">All</NavLink>;
	}

	return (
		<>
			<NavLink href="/products">All</NavLink>
			{result.data.menu?.items?.map((item) => {
				if (item.category) {
					return (
						<NavLink key={item.id} href={`/categories/${item.category.slug}`}>
							{item.category.name}
						</NavLink>
					);
				}
				if (item.collection) {
					return (
						<NavLink key={item.id} href={`/collections/${item.collection.slug}`}>
							{item.collection.name}
						</NavLink>
					);
				}
				if (item.page) {
					return (
						<NavLink key={item.id} href={`/pages/${item.page.slug}`}>
							{item.page.title}
						</NavLink>
					);
				}
				if (item.url) {
					const href = sanitizeHref(item.url);
					if (!href) return null;
					const external = isExternalHref(href);
					return (
						<Link
							key={item.id}
							href={href}
							target={external ? "_blank" : undefined}
							rel={external ? "noreferrer noopener" : undefined}
						>
							{item.name}
						</Link>
					);
				}
				return null;
			})}
		</>
	);
};
