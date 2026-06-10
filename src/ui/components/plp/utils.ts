import type { ProductListItemFragment } from "@/gql/graphql";
import type { ProductCardData } from "./product-card";
import { getColorHex, isColorAttribute, isSizeAttribute } from "@/lib/colors";
import { sortSizes } from "@/lib/sizes";
import { localeConfig } from "@/config/locale";
import { hasDiscountInPriceRange } from "@/lib/pricing";
import { getTenantFriendlyMediaSources } from "@/lib/tenant-media-url";

function pickPrimaryProductImage(product: ProductListItemFragment): { url: string; alt: string } | null {
	const mediaImages =
		product.media
			?.filter((m) => m.type === "IMAGE" && m.url)
			.slice()
			.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)) ?? [];

	const primary = mediaImages[0];
	if (primary?.url) {
		const sources = getTenantFriendlyMediaSources(primary, 1024);
		const url = sources?.primary ?? primary.url;
		return { url, alt: primary.alt ?? product.name };
	}

	if (product.thumbnail?.url) {
		const sources = getTenantFriendlyMediaSources({ url: product.thumbnail.url }, 1024);
		return { url: sources?.primary ?? product.thumbnail.url, alt: product.thumbnail.alt ?? product.name };
	}

	return null;
}

/**
 * Extract colors from product variants
 */
function extractColorsFromVariants(
	variants: ProductListItemFragment["variants"],
): { name: string; hex: string }[] {
	const colorSet = new Map<string, string>();

	variants?.forEach((variant) => {
		variant.selectionAttributes?.forEach((attr) => {
			if (isColorAttribute(attr.attribute?.slug ?? "")) {
				attr.values?.forEach((value) => {
					const colorName = value.name;
					if (colorName && !colorSet.has(colorName)) {
						const hex = getColorHex(value) ?? "#6b7280"; // Default gray if no match
						colorSet.set(colorName, hex);
					}
				});
			}
		});
	});

	return Array.from(colorSet.entries()).map(([name, hex]) => ({ name, hex }));
}

/**
 * Extract sizes from product variants
 */
function extractSizesFromVariants(variants: ProductListItemFragment["variants"]): string[] {
	const sizeSet = new Set<string>();

	variants?.forEach((variant) => {
		variant.selectionAttributes?.forEach((attr) => {
			if (isSizeAttribute(attr.attribute?.slug ?? "")) {
				attr.values?.forEach((value) => {
					if (value.name) {
						sizeSet.add(value.name);
					}
				});
			}
		});
	});

	// Sort sizes in logical order (S, M, L, XL or numeric)
	return sortSizes(Array.from(sizeSet));
}

/**
 * Transform Saleor product data to ProductCard format
 */
export function transformToProductCard(product: ProductListItemFragment, channel: string): ProductCardData {
	const startPrice = product.pricing?.priceRange?.start?.gross;
	const undiscountedStartPrice = product.pricing?.priceRangeUndiscounted?.start?.gross;

	// Use centralized pricing logic to detect if ANY variant is on sale
	const isSale = hasDiscountInPriceRange(
		product.pricing?.priceRange,
		product.pricing?.priceRangeUndiscounted,
	);

	// Extract colors and sizes from variants
	const colors = extractColorsFromVariants(product.variants);
	const sizes = extractSizesFromVariants(product.variants);
	const image = pickPrimaryProductImage(product);

	return {
		id: product.id,
		name: product.name,
		slug: product.slug,
		brand: product.category?.name ?? null,
		price: startPrice?.amount ?? 0,
		compareAtPrice: isSale ? undiscountedStartPrice?.amount : null,
		currency: startPrice?.currency ?? localeConfig.fallbackCurrency,
		image: image?.url ?? "/placeholder.svg",
		imageAlt: image?.alt ?? product.name,
		hoverImage: null, // Would need additional media in fragment
		href: `/${channel}/products/${product.slug}`,
		badge: isSale ? "Sale" : null,
		colors,
		sizes,
		category: product.category
			? { id: product.category.id, name: product.category.name, slug: product.category.slug }
			: null,
		createdAt: product.created,
		hasVariants: (product.variants?.length ?? 0) > 1,
	};
}

/**
 * Format price with currency
 */
export function formatPrice(amount: number, currency: string): string {
	return new Intl.NumberFormat(localeConfig.default, {
		style: "currency",
		currency: currency,
	}).format(amount);
}
