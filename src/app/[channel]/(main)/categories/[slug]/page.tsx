import { Suspense } from "react";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { ProductListByCategoryDocument } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";
import { getSaleorApiUrl } from "@/lib/saleor-api-url.server";
import { getTenantGraphQLHeaders, type TenantGraphQLHeaders } from "@/lib/tenant-graphql-headers.server";
import { getTenantCommerceLayout } from "@/config/commerce-layout.server";
import { categoryCacheTag, getTenantCacheKeyFromTenantGraphQLHeaders } from "@/lib/cache-tags";
import { getPaginatedListVariables } from "@/lib/utils";
import { parseEditorJSToText } from "@/lib/editorjs";
import { buildTenantRouteMetadata } from "@/lib/seo/route-metadata.server";
import { CategoryHero, transformToProductCard } from "@/ui/components/plp";
import { buildSortVariables, buildFilterVariables } from "@/ui/components/plp/filter-utils";
import { CategoryPageClient } from "./client";

/**
 * Cached category data for hero section and metadata.
 * Part of the static shell with Cache Components.
 */
async function getCategoryData(
	saleorApiUrl: string,
	tenantGraphQLHeaders: TenantGraphQLHeaders,
	tenantCacheKey: string,
	slug: string,
	channel: string,
) {
	"use cache";
	cacheLife("minutes"); // 5 minute cache
	cacheTag(categoryCacheTag(tenantCacheKey, channel, slug)); // Tag for on-demand revalidation

	const result = await executePublicGraphQL(ProductListByCategoryDocument, {
		variables: { slug, channel, first: 1 },
		revalidate: 300,
		headers: tenantGraphQLHeaders,
		saleorApiUrl,
	});

	if (!result.ok) {
		console.error(`[getCategoryData] Failed to fetch category ${slug}:`, result.error.message);
		return null;
	}

	return result.data.category;
}

type PageProps = {
	params: Promise<{ slug: string; channel: string }>;
	searchParams: Promise<{
		cursor?: string;
		direction?: string;
		sort?: string;
		price?: string;
		colors?: string;
		sizes?: string;
	}>;
};

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
	const params = await props.params;
	const saleorApiUrl = await getSaleorApiUrl();
	if (!saleorApiUrl) {
		return {};
	}
	const tenantGraphQLHeaders = await getTenantGraphQLHeaders();
	const tenantCacheKey = getTenantCacheKeyFromTenantGraphQLHeaders(tenantGraphQLHeaders);
	const category = await getCategoryData(
		saleorApiUrl,
		tenantGraphQLHeaders,
		tenantCacheKey,
		params.slug,
		params.channel,
	);
	const plainDescription = parseEditorJSToText(category?.description);

	return buildTenantRouteMetadata({
		title: category?.seoTitle || category?.name || "Category",
		description: category?.seoDescription || plainDescription || category?.name,
		image: category?.backgroundImage?.url,
		canonicalPath: `/${params.channel}/categories/${encodeURIComponent(params.slug)}`,
	});
};

/**
 * Category page with Cache Components.
 * Hero (cached) renders immediately, product grid (dynamic) streams in.
 */
export default async function Page(props: PageProps) {
	const params = await props.params;
	const saleorApiUrl = await getSaleorApiUrl();
	if (!saleorApiUrl) {
		notFound();
	}
	const tenantGraphQLHeaders = await getTenantGraphQLHeaders();
	const tenantCacheKey = getTenantCacheKeyFromTenantGraphQLHeaders(tenantGraphQLHeaders);
	const category = await getCategoryData(
		saleorApiUrl,
		tenantGraphQLHeaders,
		tenantCacheKey,
		params.slug,
		params.channel,
	);

	if (!category) {
		notFound();
	}

	const plainDescription = parseEditorJSToText(category.description);

	const breadcrumbs = [
		{ label: "Home", href: `/${params.channel}` },
		{ label: category.name, href: `/${params.channel}/categories/${params.slug}` },
	];

	return (
		<>
			{/* Static shell - cached category data renders immediately */}
			<CategoryHero
				title={category.name}
				description={plainDescription}
				backgroundImage={category.backgroundImage?.url}
				breadcrumbs={breadcrumbs}
			/>
			{/* Dynamic content - streams in via Suspense */}
			<Suspense fallback={<ProductsGridSkeleton />}>
				<CategoryProducts
					saleorApiUrl={saleorApiUrl}
					tenantGraphQLHeaders={tenantGraphQLHeaders}
					params={props.params}
					searchParams={props.searchParams}
				/>
			</Suspense>
		</>
	);
}

/**
 * Dynamic category products - reads searchParams at request time.
 */
async function CategoryProducts({
	saleorApiUrl,
	tenantGraphQLHeaders,
	params: paramsPromise,
	searchParams: searchParamsPromise,
}: {
	saleorApiUrl: string;
	tenantGraphQLHeaders: TenantGraphQLHeaders;
	params: PageProps["params"];
	searchParams: PageProps["searchParams"];
}) {
	const [params, searchParams] = await Promise.all([paramsPromise, searchParamsPromise]);
	const commerceLayout = await getTenantCommerceLayout();
	const plpSettings = commerceLayout.plp;

	const paginationVariables = getPaginatedListVariables({ params: searchParams });
	const sortBy = buildSortVariables(searchParams.sort ?? plpSettings.defaultSort);
	const filter = buildFilterVariables({ priceRange: searchParams.price });

	const result = await executePublicGraphQL(ProductListByCategoryDocument, {
		variables: {
			slug: params.slug,
			channel: params.channel,
			...paginationVariables,
			sortBy,
			filter,
		},
		revalidate: 300,
		headers: tenantGraphQLHeaders,
		saleorApiUrl,
	});

	const products = result.ok ? result.data.category?.products : null;
	if (!products) {
		notFound();
	}

	const productCards = products.edges.map((e) => transformToProductCard(e.node, params.channel));

	return (
		<CategoryPageClient
			products={productCards}
			pageInfo={products.pageInfo}
			totalCount={products.totalCount ?? productCards.length}
			defaultSort={plpSettings.defaultSort}
			showSortControl={plpSettings.flags.showSort}
			showFilterControls={plpSettings.flags.showFilters}
			cardDensity={plpSettings.cardDensity}
		/>
	);
}

/**
 * Products grid skeleton with delayed visibility.
 * Matches ProductGrid/ProductCard dimensions to prevent layout shift.
 */
function ProductsGridSkeleton() {
	return (
		<div className="mx-auto max-w-7xl animate-skeleton-delayed px-4 py-8 opacity-0 sm:px-6 lg:px-8">
			{/* Matches ProductGrid: grid-cols-2 lg:grid-cols-3 */}
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="animate-pulse">
						{/* Matches ProductCard: aspect-[3/4] rounded-xl */}
						<div className="mb-4 aspect-[3/4] rounded-xl bg-muted" />
						<div className="space-y-1.5">
							<div className="h-4 w-3/4 rounded bg-muted" />
							<div className="h-4 w-1/2 rounded bg-muted" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
