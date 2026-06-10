"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterBar, ProductGrid, useProductFilters, type ProductCardData } from "@/ui/components/plp";
import { Pagination } from "@/ui/components/pagination";

interface ProductsPageClientProps {
	products: ProductCardData[];
	pageInfo: {
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		startCursor?: string | null;
		endCursor?: string | null;
	};
	totalCount?: number;
	/** Categories resolved from URL slugs (server-side) for active filter display */
	resolvedCategories?: Array<{ slug: string; id: string; name: string }>;
	/** Full category list for filter options (not limited to current page) */
	allCategories?: Array<{ slug: string; id: string; name: string }>;
	/** Full color list with global counts from storefront attribute catalog */
	allColors?: Array<{ name: string; count: number }>;
	/** Full size list with global counts from storefront attribute catalog */
	allSizes?: Array<{ name: string; count: number }>;
	defaultSort?: "featured" | "newest" | "price_asc" | "price_desc" | "bestselling";
	showSortControl?: boolean;
	showFilterControls?: boolean;
	cardDensity?: "compact" | "standard" | "large";
}

function PaginationSkeleton() {
	return (
		<nav className="flex items-center justify-center gap-x-4 border-neutral-200 px-4 pt-12">
			<span className="h-10 w-24 animate-pulse rounded bg-neutral-200" />
			<span className="h-10 w-24 animate-pulse rounded bg-neutral-200" />
		</nav>
	);
}

export function ProductsPageClient({
	products,
	pageInfo,
	resolvedCategories = [],
	allCategories = [],
	allColors = [],
	allSizes = [],
	defaultSort = "newest",
	showSortControl = true,
	showFilterControls = true,
	cardDensity = "standard",
}: ProductsPageClientProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const perPage = Number.parseInt(searchParams.get("perPage") || "12", 10) || 12;

	const handlePerPageChange = (nextPerPage: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("perPage", String(nextPerPage));
		// Reset pagination cursor when page size changes.
		params.delete("cursor");
		params.delete("direction");
		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	};

	const {
		filteredProducts,
		categoryOptions,
		colorOptions,
		sizeOptions,
		priceRanges,
		selectedCategories,
		selectedColors,
		selectedSizes,
		selectedPriceRange,
		sortValue,
		activeFilters,
		handleCategoryToggle,
		handleColorToggle,
		handleSizeToggle,
		handlePriceRangeChange,
		handleSortChange,
		handleRemoveFilter,
		handleClearFilters,
	} = useProductFilters({
		products,
		resolvedCategories,
		allCategories,
		allColors,
		allSizes,
		enableCategoryFilter: true,
		defaultSort,
	});

	return (
		<>
			<FilterBar
				resultCount={filteredProducts.length}
				sortValue={sortValue}
				onSortChange={handleSortChange}
				showSortControl={showSortControl}
				showFilterControls={showFilterControls}
				perPage={perPage}
				onPerPageChange={handlePerPageChange}
				categoryOptions={categoryOptions}
				colorOptions={colorOptions}
				sizeOptions={sizeOptions}
				priceRanges={priceRanges}
				selectedCategories={selectedCategories}
				selectedColors={selectedColors}
				selectedSizes={selectedSizes}
				selectedPriceRange={selectedPriceRange}
				onCategoryToggle={handleCategoryToggle}
				onColorToggle={handleColorToggle}
				onSizeToggle={handleSizeToggle}
				onPriceRangeChange={handlePriceRangeChange}
				activeFilters={activeFilters}
				onRemoveFilter={handleRemoveFilter}
				onClearFilters={handleClearFilters}
			/>
			<div className="w-full">
				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					{filteredProducts.length > 0 ? (
						<ProductGrid products={filteredProducts} density={cardDensity} />
					) : (
						<div className="py-12 text-center">
							<p className="text-lg text-muted-foreground">No products match your filters.</p>
							<button
								onClick={handleClearFilters}
								className="mt-4 text-sm font-medium text-foreground underline underline-offset-4"
							>
								Clear all filters
							</button>
						</div>
					)}
					<Suspense fallback={<PaginationSkeleton />}>
						<Pagination pageInfo={pageInfo} />
					</Suspense>
				</div>
			</div>
		</>
	);
}
