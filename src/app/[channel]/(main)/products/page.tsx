import { Suspense } from "react";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { CategoriesListDocument, ProductListPaginatedDocument } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";
import { getSaleorApiUrl } from "@/lib/saleor-api-url.server";
import { getTenantGraphQLHeaders } from "@/lib/tenant-graphql-headers.server";
import { getTenantCommerceLayout } from "@/config/commerce-layout.server";
import { getPaginatedListVariables } from "@/lib/utils";
import { buildTenantRouteMetadata } from "@/lib/seo/route-metadata.server";
import { CategoryHero, transformToProductCard } from "@/ui/components/plp";
import { buildSortVariables, buildFilterVariables } from "@/ui/components/plp/filter-utils";
import {
	resolveAttributeFilterCatalog,
	resolveCategorySlugsToIds,
	resolveGlobalAttributeFilterCounts,
} from "@/ui/components/plp/filter-utils.server";
import { ProductsPageClient } from "./products-client";

type PageProps = {
	params: Promise<{ channel: string }>;
	searchParams: Promise<{
		cursor?: string | string[];
		direction?: string | string[];
		sort?: string;
		price?: string;
		colors?: string;
		sizes?: string;
		categories?: string;
	}>;
};

export async function generateMetadata(props: { params: Promise<{ channel: string }> }): Promise<Metadata> {
	const { channel } = await props.params;
	return buildTenantRouteMetadata({
		title: "Products",
		description: "Browse all products",
		canonicalPath: `/${channel}/products`,
	});
}

/**
 * Products page with Cache Components.
 * Static shell (hero) renders immediately, product grid streams in.
 */
export default async function Page(props: PageProps) {
	const params = await props.params;

	const breadcrumbs = [
		{ label: "Home", href: `/${params.channel}` },
		{ label: "Products", href: `/${params.channel}/products` },
	];

	return (
		<>
			{/* Static shell - renders immediately */}
			<CategoryHero
				title="All Products"
				description="Discover our full collection of premium products."
				breadcrumbs={breadcrumbs}
			/>
			{/* Dynamic content - streams in via Suspense */}
			<Suspense fallback={<ProductsGridSkeleton />}>
				<ProductsContent params={props.params} searchParams={props.searchParams} />
			</Suspense>
		</>
	);
}

/**
 * Dynamic products content - reads searchParams at request time.
 */
async function ProductsContent({
	params: paramsPromise,
	searchParams: searchParamsPromise,
}: {
	params: Promise<{ channel: string }>;
	searchParams: PageProps["searchParams"];
}) {
	const [params, searchParams] = await Promise.all([paramsPromise, searchParamsPromise]);
	const commerceLayout = await getTenantCommerceLayout();
	const plpSettings = commerceLayout.plp;

	const paginationVariables = getPaginatedListVariables({ params: searchParams });
	const sortBy = buildSortVariables(searchParams.sort ?? plpSettings.defaultSort);

	const saleorApiUrl = await getSaleorApiUrl();
	if (!saleorApiUrl) {
		notFound();
	}
	const tenantGraphQLHeaders = await getTenantGraphQLHeaders();

	// Parse category slugs from URL and resolve to IDs for server-side filtering
	const categorySlugs = searchParams.categories?.split(",").filter(Boolean) || [];
	const categoryMap = await resolveCategorySlugsToIds(saleorApiUrl, categorySlugs, tenantGraphQLHeaders);
	const categoryIds = Array.from(categoryMap.values()).map((c) => c.id);
	const selectedColors = searchParams.colors?.split(",").filter(Boolean) || [];
	const selectedSizes = searchParams.sizes?.split(",").filter(Boolean) || [];
	const attributeCatalog = await resolveAttributeFilterCatalog(
		saleorApiUrl,
		params.channel,
		selectedColors,
		selectedSizes,
		tenantGraphQLHeaders,
	);
	const globalAttributeCounts = await resolveGlobalAttributeFilterCounts(
		saleorApiUrl,
		params.channel,
		attributeCatalog,
		tenantGraphQLHeaders,
	);

	const filter = buildFilterVariables({
		priceRange: searchParams.price,
		categoryIds,
		colorValues: selectedColors,
		sizeValues: selectedSizes,
		colorAttributeSlug: attributeCatalog.colorSlug,
		sizeAttributeSlug: attributeCatalog.sizeSlug,
	});

	const result = await executePublicGraphQL(ProductListPaginatedDocument, {
		variables: {
			...paginationVariables,
			channel: params.channel,
			sortBy,
			filter,
		},
		revalidate: 300,
		headers: tenantGraphQLHeaders,
		saleorApiUrl,
	});

	if (!result.ok || !result.data.products) {
		notFound();
	}

	const products = result.data.products;
	const productCards = products.edges.map((e) => transformToProductCard(e.node, params.channel));

	// Build resolved categories array for the client (for active filter display)
	const resolvedCategories = categorySlugs
		.map((slug) => {
			const cat = categoryMap.get(slug);
			return cat ? { slug, id: cat.id, name: cat.name } : null;
		})
		.filter(Boolean) as { slug: string; id: string; name: string }[];

	const categoriesListResult = await executePublicGraphQL(CategoriesListDocument, {
		variables: { first: 200 },
		revalidate: 3600,
		headers: tenantGraphQLHeaders,
		saleorApiUrl,
	});
	const allCategories = categoriesListResult.ok
		? categoriesListResult.data.categories?.edges
				.map((e) => e.node)
				.filter((c) => c?.id && c.slug && c.name)
				.map((c) => ({ id: c.id, slug: c.slug, name: c.name })) ?? []
		: [];

	return (
		<ProductsPageClient
			products={productCards}
			pageInfo={products.pageInfo}
			totalCount={products.totalCount ?? productCards.length}
			resolvedCategories={resolvedCategories}
			allCategories={allCategories}
			allColors={globalAttributeCounts.allColors}
			allSizes={globalAttributeCounts.allSizes}
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
