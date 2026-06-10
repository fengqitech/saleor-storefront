export const COMMERCE_LAYOUT_SCHEMA_VERSION = 1;

export const COMMERCE_PLP_PRESETS = ["standard-grid", "dense-grid", "editorial"] as const;
export const COMMERCE_PLP_SORT_OPTIONS = [
	"featured",
	"newest",
	"price_asc",
	"price_desc",
	"bestselling",
] as const;
export const COMMERCE_PLP_FILTER_LAYOUTS = ["sidebar", "topbar"] as const;
export const COMMERCE_PLP_CARD_DENSITIES = ["compact", "standard", "large"] as const;
export const COMMERCE_PDP_PRESETS = ["classic", "tabs", "accordion"] as const;

export type CommercePlpPreset = (typeof COMMERCE_PLP_PRESETS)[number];
export type CommercePlpSort = (typeof COMMERCE_PLP_SORT_OPTIONS)[number];
export type CommercePlpFilterLayout = (typeof COMMERCE_PLP_FILTER_LAYOUTS)[number];
export type CommercePlpCardDensity = (typeof COMMERCE_PLP_CARD_DENSITIES)[number];
export type CommercePdpPreset = (typeof COMMERCE_PDP_PRESETS)[number];

export type CommercePlpSlots = {
	topBanner: boolean;
	descriptionBlock: boolean;
	subCategoryNav: boolean;
	seoText: boolean;
};

export type CommercePlpFlags = {
	showFilters: boolean;
	showSort: boolean;
	showCardDensitySwitcher: boolean;
};

export type CommercePdpSlots = {
	trustBadges: boolean;
	shippingInfo: boolean;
	returnsSnippet: boolean;
	faq: boolean;
	relatedProducts: boolean;
	contactCta: boolean;
};

export type CommercePdpFlags = {
	stickyAddToCart: boolean;
};

export type TenantCommerceLayout = {
	schemaVersion: number;
	plp: {
		preset: CommercePlpPreset;
		defaultSort: CommercePlpSort;
		filterLayout: CommercePlpFilterLayout;
		cardDensity: CommercePlpCardDensity;
		slots: CommercePlpSlots;
		flags: CommercePlpFlags;
	};
	pdp: {
		preset: CommercePdpPreset;
		slots: CommercePdpSlots;
		flags: CommercePdpFlags;
	};
};

const DEFAULT_COMMERCE_LAYOUT: TenantCommerceLayout = {
	schemaVersion: COMMERCE_LAYOUT_SCHEMA_VERSION,
	plp: {
		preset: "standard-grid",
		defaultSort: "newest",
		filterLayout: "sidebar",
		cardDensity: "standard",
		slots: {
			topBanner: false,
			descriptionBlock: true,
			subCategoryNav: true,
			seoText: true,
		},
		flags: {
			showFilters: true,
			showSort: true,
			showCardDensitySwitcher: true,
		},
	},
	pdp: {
		preset: "classic",
		slots: {
			trustBadges: true,
			shippingInfo: true,
			returnsSnippet: true,
			faq: true,
			relatedProducts: true,
			contactCta: true,
		},
		flags: {
			stickyAddToCart: false,
		},
	},
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseJsonHeader(value: string | null): Record<string, unknown> | null {
	if (!value) return null;
	try {
		const parsed = JSON.parse(value);
		return isRecord(parsed) ? parsed : null;
	} catch {
		return null;
	}
}

function pickEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
	if (typeof value !== "string") return fallback;
	return (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

function pickBoolean(source: Record<string, unknown>, key: string, fallback: boolean): boolean {
	const value = source[key];
	return typeof value === "boolean" ? value : fallback;
}

export function normalizeCommerceLayout(input: unknown): TenantCommerceLayout {
	const source = isRecord(input) ? input : {};
	const sourcePlp = isRecord(source.plp) ? source.plp : {};
	const sourcePlpSlots = isRecord(sourcePlp.slots) ? sourcePlp.slots : {};
	const sourcePlpFlags = isRecord(sourcePlp.flags) ? sourcePlp.flags : {};
	const sourcePdp = isRecord(source.pdp) ? source.pdp : {};
	const sourcePdpSlots = isRecord(sourcePdp.slots) ? sourcePdp.slots : {};
	const sourcePdpFlags = isRecord(sourcePdp.flags) ? sourcePdp.flags : {};

	return {
		schemaVersion: COMMERCE_LAYOUT_SCHEMA_VERSION,
		plp: {
			preset: pickEnum(sourcePlp.preset, COMMERCE_PLP_PRESETS, DEFAULT_COMMERCE_LAYOUT.plp.preset),
			defaultSort: pickEnum(
				sourcePlp.defaultSort,
				COMMERCE_PLP_SORT_OPTIONS,
				DEFAULT_COMMERCE_LAYOUT.plp.defaultSort,
			),
			filterLayout: pickEnum(
				sourcePlp.filterLayout,
				COMMERCE_PLP_FILTER_LAYOUTS,
				DEFAULT_COMMERCE_LAYOUT.plp.filterLayout,
			),
			cardDensity: pickEnum(
				sourcePlp.cardDensity,
				COMMERCE_PLP_CARD_DENSITIES,
				DEFAULT_COMMERCE_LAYOUT.plp.cardDensity,
			),
			slots: {
				topBanner: pickBoolean(sourcePlpSlots, "topBanner", DEFAULT_COMMERCE_LAYOUT.plp.slots.topBanner),
				descriptionBlock: pickBoolean(
					sourcePlpSlots,
					"descriptionBlock",
					DEFAULT_COMMERCE_LAYOUT.plp.slots.descriptionBlock,
				),
				subCategoryNav: pickBoolean(
					sourcePlpSlots,
					"subCategoryNav",
					DEFAULT_COMMERCE_LAYOUT.plp.slots.subCategoryNav,
				),
				seoText: pickBoolean(sourcePlpSlots, "seoText", DEFAULT_COMMERCE_LAYOUT.plp.slots.seoText),
			},
			flags: {
				showFilters: pickBoolean(
					sourcePlpFlags,
					"showFilters",
					DEFAULT_COMMERCE_LAYOUT.plp.flags.showFilters,
				),
				showSort: pickBoolean(sourcePlpFlags, "showSort", DEFAULT_COMMERCE_LAYOUT.plp.flags.showSort),
				showCardDensitySwitcher: pickBoolean(
					sourcePlpFlags,
					"showCardDensitySwitcher",
					DEFAULT_COMMERCE_LAYOUT.plp.flags.showCardDensitySwitcher,
				),
			},
		},
		pdp: {
			preset: pickEnum(sourcePdp.preset, COMMERCE_PDP_PRESETS, DEFAULT_COMMERCE_LAYOUT.pdp.preset),
			slots: {
				trustBadges: pickBoolean(
					sourcePdpSlots,
					"trustBadges",
					DEFAULT_COMMERCE_LAYOUT.pdp.slots.trustBadges,
				),
				shippingInfo: pickBoolean(
					sourcePdpSlots,
					"shippingInfo",
					DEFAULT_COMMERCE_LAYOUT.pdp.slots.shippingInfo,
				),
				returnsSnippet: pickBoolean(
					sourcePdpSlots,
					"returnsSnippet",
					DEFAULT_COMMERCE_LAYOUT.pdp.slots.returnsSnippet,
				),
				faq: pickBoolean(sourcePdpSlots, "faq", DEFAULT_COMMERCE_LAYOUT.pdp.slots.faq),
				relatedProducts: pickBoolean(
					sourcePdpSlots,
					"relatedProducts",
					DEFAULT_COMMERCE_LAYOUT.pdp.slots.relatedProducts,
				),
				contactCta: pickBoolean(sourcePdpSlots, "contactCta", DEFAULT_COMMERCE_LAYOUT.pdp.slots.contactCta),
			},
			flags: {
				stickyAddToCart: pickBoolean(
					sourcePdpFlags,
					"stickyAddToCart",
					DEFAULT_COMMERCE_LAYOUT.pdp.flags.stickyAddToCart,
				),
			},
		},
	};
}

export function getCommerceLayoutFromHeaders(
	_hostname: string | null,
	overrides?: { commerceLayout?: string | null },
): TenantCommerceLayout {
	const parsed = parseJsonHeader(overrides?.commerceLayout || null);
	return normalizeCommerceLayout(parsed);
}
