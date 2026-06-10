import { type MetadataRoute } from "next";
import {
	CategoriesListDocument,
	CollectionsListDocument,
	PagesListDocument,
	ProductListPaginatedDocument,
} from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";
import { getSaleorApiUrl } from "@/lib/saleor-api-url.server";
import { getTenantGraphQLHeaders } from "@/lib/tenant-graphql-headers.server";
import { observeSitemapGenerationSummary, observeSitemapSectionStats } from "@/lib/seo/observability.server";
import { getTenantBaseUrl } from "@/lib/seo/url.server";
import { getActiveChannelSlugs } from "@/lib/channels.server";

const SITEMAP_PRODUCTS_PAGE_SIZE = 100;
const SITEMAP_PRODUCTS_MAX_PAGES = 20;
const SITEMAP_CATEGORIES_PAGE_SIZE = 100;
const SITEMAP_CATEGORIES_MAX_PAGES = 20;
const SITEMAP_COLLECTIONS_PAGE_SIZE = 100;
const SITEMAP_COLLECTIONS_MAX_PAGES = 20;
const SITEMAP_PAGES_PAGE_SIZE = 100;
const SITEMAP_PAGES_MAX_PAGES = 20;

type SitemapSectionResult = {
	entries: MetadataRoute.Sitemap;
	pageCount: number;
	truncated: boolean;
	queryFailed: boolean;
};

function toAbsoluteUrl(baseUrl: string, pathname: string): string {
	const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
	return new URL(normalizedPath, baseUrl).toString();
}

async function getProductEntries(params: {
	baseUrl: string;
	channel: string;
	saleorApiUrl: string;
	headers: HeadersInit;
}): Promise<SitemapSectionResult> {
	const entries: MetadataRoute.Sitemap = [];
	let after: string | undefined;
	let pageIndex = 0;
	let pageCount = 0;
	let truncated = false;
	let queryFailed = false;

	while (pageIndex < SITEMAP_PRODUCTS_MAX_PAGES) {
		const result = await executePublicGraphQL(ProductListPaginatedDocument, {
			variables: {
				channel: params.channel,
				first: SITEMAP_PRODUCTS_PAGE_SIZE,
				after,
			},
			revalidate: 300,
			headers: params.headers,
			saleorApiUrl: params.saleorApiUrl,
		});

		if (!result.ok || !result.data.products) {
			queryFailed = true;
			break;
		}
		pageCount += 1;

		for (const edge of result.data.products.edges) {
			const slug = edge.node.slug;
			entries.push({
				url: toAbsoluteUrl(params.baseUrl, `/${params.channel}/products/${encodeURIComponent(slug)}`),
				lastModified: edge.node.created || undefined,
				changeFrequency: "daily",
				priority: 0.7,
			});
		}

		const nextCursor = result.data.products.pageInfo.endCursor || undefined;
		if (!result.data.products.pageInfo.hasNextPage || !nextCursor) {
			break;
		}

		after = nextCursor;
		pageIndex += 1;
		if (pageIndex >= SITEMAP_PRODUCTS_MAX_PAGES) {
			truncated = true;
			break;
		}
	}

	return { entries, pageCount, truncated, queryFailed };
}

async function getCategoryEntries(params: {
	baseUrl: string;
	channel: string;
	saleorApiUrl: string;
	headers: HeadersInit;
}): Promise<SitemapSectionResult> {
	const entries: MetadataRoute.Sitemap = [];
	let after: string | undefined;
	let pageIndex = 0;
	let pageCount = 0;
	let truncated = false;
	let queryFailed = false;

	while (pageIndex < SITEMAP_CATEGORIES_MAX_PAGES) {
		const result = await executePublicGraphQL(CategoriesListDocument, {
			variables: {
				first: SITEMAP_CATEGORIES_PAGE_SIZE,
				after,
			},
			revalidate: 300,
			headers: params.headers,
			saleorApiUrl: params.saleorApiUrl,
		});

		if (!result.ok || !result.data.categories) {
			queryFailed = true;
			break;
		}
		pageCount += 1;

		for (const edge of result.data.categories.edges) {
			if (!edge.node.slug) {
				continue;
			}
			entries.push({
				url: toAbsoluteUrl(
					params.baseUrl,
					`/${params.channel}/categories/${encodeURIComponent(edge.node.slug)}`,
				),
				changeFrequency: "daily",
				priority: 0.6,
			});
		}

		const nextCursor = result.data.categories.pageInfo.endCursor || undefined;
		if (!result.data.categories.pageInfo.hasNextPage || !nextCursor) {
			break;
		}
		after = nextCursor;
		pageIndex += 1;
		if (pageIndex >= SITEMAP_CATEGORIES_MAX_PAGES) {
			truncated = true;
			break;
		}
	}

	return { entries, pageCount, truncated, queryFailed };
}

async function getCollectionEntries(params: {
	baseUrl: string;
	channel: string;
	saleorApiUrl: string;
	headers: HeadersInit;
}): Promise<SitemapSectionResult> {
	const entries: MetadataRoute.Sitemap = [];
	let after: string | undefined;
	let pageIndex = 0;
	let pageCount = 0;
	let truncated = false;
	let queryFailed = false;

	while (pageIndex < SITEMAP_COLLECTIONS_MAX_PAGES) {
		const result = await executePublicGraphQL(CollectionsListDocument, {
			variables: {
				channel: params.channel,
				first: SITEMAP_COLLECTIONS_PAGE_SIZE,
				after,
			},
			revalidate: 300,
			headers: params.headers,
			saleorApiUrl: params.saleorApiUrl,
		});

		if (!result.ok || !result.data.collections) {
			queryFailed = true;
			break;
		}
		pageCount += 1;

		for (const edge of result.data.collections.edges) {
			if (!edge.node.slug) {
				continue;
			}
			entries.push({
				url: toAbsoluteUrl(
					params.baseUrl,
					`/${params.channel}/collections/${encodeURIComponent(edge.node.slug)}`,
				),
				changeFrequency: "daily",
				priority: 0.6,
			});
		}

		const nextCursor = result.data.collections.pageInfo.endCursor || undefined;
		if (!result.data.collections.pageInfo.hasNextPage || !nextCursor) {
			break;
		}
		after = nextCursor;
		pageIndex += 1;
		if (pageIndex >= SITEMAP_COLLECTIONS_MAX_PAGES) {
			truncated = true;
			break;
		}
	}

	return { entries, pageCount, truncated, queryFailed };
}

async function getPageEntries(params: {
	baseUrl: string;
	channel: string;
	saleorApiUrl: string;
	headers: HeadersInit;
}): Promise<SitemapSectionResult> {
	const entries: MetadataRoute.Sitemap = [];
	let after: string | undefined;
	let pageIndex = 0;
	let pageCount = 0;
	let truncated = false;
	let queryFailed = false;

	while (pageIndex < SITEMAP_PAGES_MAX_PAGES) {
		const result = await executePublicGraphQL(PagesListDocument, {
			variables: {
				channel: params.channel,
				first: SITEMAP_PAGES_PAGE_SIZE,
				after,
			},
			revalidate: 300,
			headers: params.headers,
			saleorApiUrl: params.saleorApiUrl,
		});

		if (!result.ok || !result.data.pages) {
			queryFailed = true;
			break;
		}
		pageCount += 1;

		for (const edge of result.data.pages.edges) {
			if (!edge.node.isPublished || !edge.node.slug) {
				continue;
			}
			entries.push({
				url: toAbsoluteUrl(params.baseUrl, `/${params.channel}/pages/${encodeURIComponent(edge.node.slug)}`),
				lastModified: edge.node.publishedAt || edge.node.created || undefined,
				changeFrequency: "weekly",
				priority: 0.5,
			});
		}

		const nextCursor = result.data.pages.pageInfo.endCursor || undefined;
		if (!result.data.pages.pageInfo.hasNextPage || !nextCursor) {
			break;
		}
		after = nextCursor;
		pageIndex += 1;
		if (pageIndex >= SITEMAP_PAGES_MAX_PAGES) {
			truncated = true;
			break;
		}
	}

	return { entries, pageCount, truncated, queryFailed };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = await getTenantBaseUrl();
	const saleorApiUrl = await getSaleorApiUrl();
	const tenantGraphQLHeaders = await getTenantGraphQLHeaders();
	const channels = await getActiveChannelSlugs({
		headers: tenantGraphQLHeaders,
		saleorApiUrl: saleorApiUrl || undefined,
	});

	if (channels.length === 0) {
		return [{ url: baseUrl, changeFrequency: "daily", priority: 0.8 }];
	}

	if (!saleorApiUrl) {
		return channels.flatMap((channel) => [
			{ url: toAbsoluteUrl(baseUrl, `/${channel}`), changeFrequency: "daily", priority: 1 } as const,
			{
				url: toAbsoluteUrl(baseUrl, `/${channel}/products`),
				changeFrequency: "daily",
				priority: 0.9,
			} as const,
		]);
	}

	const entriesByChannel = await Promise.all(
		channels.map(async (channel) => {
			const rootEntries: MetadataRoute.Sitemap = [
				{ url: toAbsoluteUrl(baseUrl, `/${channel}`), changeFrequency: "daily", priority: 1 },
				{ url: toAbsoluteUrl(baseUrl, `/${channel}/products`), changeFrequency: "daily", priority: 0.9 },
			];
			const [productEntries, categoryEntries, collectionEntries, pageEntries] = await Promise.all([
				getProductEntries({
					baseUrl,
					channel,
					saleorApiUrl,
					headers: tenantGraphQLHeaders,
				}),
				getCategoryEntries({
					baseUrl,
					channel,
					saleorApiUrl,
					headers: tenantGraphQLHeaders,
				}),
				getCollectionEntries({
					baseUrl,
					channel,
					saleorApiUrl,
					headers: tenantGraphQLHeaders,
				}),
				getPageEntries({
					baseUrl,
					channel,
					saleorApiUrl,
					headers: tenantGraphQLHeaders,
				}),
			]);
			observeSitemapSectionStats({
				channel,
				section: "products",
				entryCount: productEntries.entries.length,
				pageCount: productEntries.pageCount,
				maxPages: SITEMAP_PRODUCTS_MAX_PAGES,
				truncated: productEntries.truncated,
				queryFailed: productEntries.queryFailed,
			});
			observeSitemapSectionStats({
				channel,
				section: "categories",
				entryCount: categoryEntries.entries.length,
				pageCount: categoryEntries.pageCount,
				maxPages: SITEMAP_CATEGORIES_MAX_PAGES,
				truncated: categoryEntries.truncated,
				queryFailed: categoryEntries.queryFailed,
			});
			observeSitemapSectionStats({
				channel,
				section: "collections",
				entryCount: collectionEntries.entries.length,
				pageCount: collectionEntries.pageCount,
				maxPages: SITEMAP_COLLECTIONS_MAX_PAGES,
				truncated: collectionEntries.truncated,
				queryFailed: collectionEntries.queryFailed,
			});
			observeSitemapSectionStats({
				channel,
				section: "pages",
				entryCount: pageEntries.entries.length,
				pageCount: pageEntries.pageCount,
				maxPages: SITEMAP_PAGES_MAX_PAGES,
				truncated: pageEntries.truncated,
				queryFailed: pageEntries.queryFailed,
			});
			return [
				...rootEntries,
				...productEntries.entries,
				...categoryEntries.entries,
				...collectionEntries.entries,
				...pageEntries.entries,
			];
		}),
	);

	const flattened = entriesByChannel.flat();
	observeSitemapGenerationSummary({
		channelCount: channels.length,
		totalEntries: flattened.length,
		baseUrl,
	});
	return flattened;
}
