export type TenantBranding = {
	/**
	 * Human-readable tenant / storefront name.
	 * Used for titles and accessible labels.
	 */
	siteName: string;

	/**
	 * Optional favicon overrides. When set, `[channel]/(main)/layout.tsx` will
	 * emit per-tenant icon tags server-side (no client flicker).
	 *
	 * Prefer `faviconSvgSrc` when you don't want to manage multi-size PNGs yet.
	 * These should point to files under `/public`.
	 */
	faviconSvgSrc?: string;
	faviconSrc?: string;
	appleTouchIconSrc?: string;

	/**
	 * Optional browser theme color (sRGB), used for meta `theme-color`.
	 * Example: "#111111"
	 */
	themeColor?: string;
	seoDefaultTitle?: string;
	seoDefaultDescription?: string;
	seoDefaultImage?: string;

	/**
	 * Optional logo overrides. If omitted, falls back to `/logo.svg` + `/logo-dark.svg`.
	 * These should point to files under `/public`.
	 */
	logoLightSrc?: string;
	logoDarkSrc?: string;

	/**
	 * Optional design token overrides (CSS variables).
	 * Values should be valid CSS colors (we use OKLCH in the default theme).
	 */
	background?: string;
	foreground?: string;
	card?: string;
	cardForeground?: string;
	secondary?: string;
	secondaryForeground?: string;
	muted?: string;
	mutedForeground?: string;
	border?: string;
	input?: string;
	primary?: string;
	primaryForeground?: string;
	accent?: string;
	accentForeground?: string;
	success?: string;
	successForeground?: string;
	destructive?: string;
	destructiveForeground?: string;
	ring?: string;
	radius?: string;
	fontSans?: string;
	fontHeading?: string;
	textScale?: string;
	headingWeight?: string;
	bodyLineHeight?: string;
	sectionSpacingY?: string;
	cardPadding?: string;
	gridGap?: string;
	buttonDensity?: string;
	inputDensity?: string;
	shadowSm?: string;
	shadowMd?: string;
	shadowLg?: string;
	themePreset?: ThemePresetId;
};

export const THEME_PRESET_IDS = ["minimal", "ocean", "sunset", "forest"] as const;
export type ThemePresetId = (typeof THEME_PRESET_IDS)[number];

type ThemePreset = Pick<
	TenantBranding,
	| "themeColor"
	| "background"
	| "foreground"
	| "card"
	| "cardForeground"
	| "secondary"
	| "secondaryForeground"
	| "muted"
	| "mutedForeground"
	| "border"
	| "input"
	| "primary"
	| "primaryForeground"
	| "accent"
	| "accentForeground"
	| "success"
	| "successForeground"
	| "destructive"
	| "destructiveForeground"
	| "ring"
	| "radius"
	| "textScale"
	| "sectionSpacingY"
	| "cardPadding"
	| "gridGap"
>;

export const TENANT_THEME_PRESETS: Record<ThemePresetId, ThemePreset> = {
	minimal: {
		themeColor: "#0f0f10",
		background: "oklch(0.98 0.005 90)",
		foreground: "oklch(0.12 0 0)",
		card: "oklch(1 0 0)",
		cardForeground: "oklch(0.12 0 0)",
		secondary: "oklch(0.96 0.003 90)",
		secondaryForeground: "oklch(0.12 0 0)",
		muted: "oklch(0.94 0.003 90)",
		mutedForeground: "oklch(0.45 0 0)",
		border: "oklch(0.9 0.003 90)",
		input: "oklch(0.9 0.003 90)",
		primary: "oklch(0.12 0 0)",
		primaryForeground: "oklch(0.98 0 0)",
		accent: "oklch(0.94 0.003 90)",
		accentForeground: "oklch(0.12 0 0)",
		success: "oklch(0.55 0.15 145)",
		successForeground: "oklch(0.98 0 0)",
		destructive: "oklch(0.55 0.2 25)",
		destructiveForeground: "oklch(0.98 0 0)",
		ring: "oklch(0.12 0 0)",
		radius: "0.5rem",
		textScale: "1",
		sectionSpacingY: "3rem",
		cardPadding: "1.25rem",
		gridGap: "1.25rem",
	},
	ocean: {
		themeColor: "#1b2a6e",
		background: "oklch(0.98 0.005 252)",
		foreground: "oklch(0.16 0.02 252)",
		card: "oklch(1 0 0)",
		cardForeground: "oklch(0.16 0.02 252)",
		secondary: "oklch(0.95 0.02 252)",
		secondaryForeground: "oklch(0.16 0.02 252)",
		muted: "oklch(0.95 0.015 252)",
		mutedForeground: "oklch(0.42 0.02 252)",
		border: "oklch(0.9 0.02 252)",
		input: "oklch(0.9 0.02 252)",
		primary: "oklch(0.48 0.18 250)",
		primaryForeground: "oklch(0.98 0 0)",
		accent: "oklch(0.94 0.02 250)",
		accentForeground: "oklch(0.12 0 0)",
		success: "oklch(0.57 0.16 170)",
		successForeground: "oklch(0.98 0 0)",
		destructive: "oklch(0.58 0.21 30)",
		destructiveForeground: "oklch(0.98 0 0)",
		ring: "oklch(0.48 0.18 250)",
		radius: "0.5rem",
		textScale: "1",
		sectionSpacingY: "3rem",
		cardPadding: "1.25rem",
		gridGap: "1.25rem",
	},
	sunset: {
		themeColor: "#8f2b22",
		background: "oklch(0.98 0.01 45)",
		foreground: "oklch(0.18 0.03 35)",
		card: "oklch(1 0 0)",
		cardForeground: "oklch(0.18 0.03 35)",
		secondary: "oklch(0.95 0.03 45)",
		secondaryForeground: "oklch(0.18 0.03 35)",
		muted: "oklch(0.95 0.02 45)",
		mutedForeground: "oklch(0.46 0.03 35)",
		border: "oklch(0.89 0.03 45)",
		input: "oklch(0.89 0.03 45)",
		primary: "oklch(0.56 0.21 35)",
		primaryForeground: "oklch(0.98 0 0)",
		accent: "oklch(0.95 0.03 45)",
		accentForeground: "oklch(0.18 0.03 35)",
		success: "oklch(0.56 0.13 150)",
		successForeground: "oklch(0.98 0 0)",
		destructive: "oklch(0.58 0.23 30)",
		destructiveForeground: "oklch(0.98 0 0)",
		ring: "oklch(0.56 0.21 35)",
		radius: "0.625rem",
		textScale: "1.02",
		sectionSpacingY: "3.25rem",
		cardPadding: "1.25rem",
		gridGap: "1.25rem",
	},
	forest: {
		themeColor: "#1e5a36",
		background: "oklch(0.98 0.01 145)",
		foreground: "oklch(0.17 0.03 150)",
		card: "oklch(1 0 0)",
		cardForeground: "oklch(0.17 0.03 150)",
		secondary: "oklch(0.95 0.02 150)",
		secondaryForeground: "oklch(0.17 0.03 150)",
		muted: "oklch(0.94 0.02 150)",
		mutedForeground: "oklch(0.42 0.02 150)",
		border: "oklch(0.89 0.02 150)",
		input: "oklch(0.89 0.02 150)",
		primary: "oklch(0.52 0.15 150)",
		primaryForeground: "oklch(0.98 0 0)",
		accent: "oklch(0.94 0.02 150)",
		accentForeground: "oklch(0.17 0.03 150)",
		success: "oklch(0.54 0.16 160)",
		successForeground: "oklch(0.98 0 0)",
		destructive: "oklch(0.56 0.2 30)",
		destructiveForeground: "oklch(0.98 0 0)",
		ring: "oklch(0.52 0.15 150)",
		radius: "0.5rem",
		textScale: "1",
		sectionSpacingY: "3rem",
		cardPadding: "1.25rem",
		gridGap: "1.25rem",
	},
};

export const DEFAULT_TENANT_BRANDING: TenantBranding = {
	siteName: "Saleor Store",
	themePreset: "minimal",
};

export function normalizeHost(rawHost: string): string {
	// Remove port if present (e.g. dev-store01.yifeng.io:443)
	return rawHost.split(":")[0]?.trim().toLowerCase() || "";
}

/**
 * Minimal dev tenant branding map.
 *
 * Production approach: store this in a DB or tenant config service and expose it
 * through a signed config endpoint. For now, keep it explicit and predictable.
 */
export const TENANT_BRANDING_BY_DOMAIN: Record<string, TenantBranding> = {
	"dev-store01.yifeng.io": {
		siteName: "Dev Store 01",
		logoLightSrc: "/tenants/dev-store01/logo.svg",
		logoDarkSrc: "/tenants/dev-store01/logo-dark.svg",
		faviconSvgSrc: "/tenants/dev-store01/icon.svg",
		themePreset: "minimal",
		seoDefaultTitle: "Dev Store 01",
		seoDefaultDescription: "Modern multi-tenant storefront powered by Saleor.",
	},
	"dev-store02.yifeng.io": {
		siteName: "Dev Store 02",
		logoLightSrc: "/tenants/dev-store02/logo.svg",
		logoDarkSrc: "/tenants/dev-store02/logo-dark.svg",
		faviconSvgSrc: "/tenants/dev-store02/icon.svg",
		themePreset: "ocean",
		seoDefaultTitle: "Dev Store 02",
		seoDefaultDescription: "Ocean-themed storefront experience powered by Saleor.",
	},
};

function parseThemePreset(value: string | null | undefined): ThemePresetId | undefined {
	if (!value) return undefined;
	const normalized = value.trim().toLowerCase();
	return THEME_PRESET_IDS.find((id) => id === normalized);
}

function parseThemeOverrideTokens(raw: string | null | undefined): Partial<TenantBranding> | undefined {
	if (!raw) return undefined;
	try {
		const data = JSON.parse(raw) as Partial<TenantBranding>;
		return typeof data === "object" && data ? data : undefined;
	} catch {
		return undefined;
	}
}

export function resolveTenantBranding(
	base: TenantBranding,
	overrides?: Partial<TenantBranding>,
): TenantBranding {
	const preferredPreset =
		overrides?.themePreset || base.themePreset || DEFAULT_TENANT_BRANDING.themePreset || "minimal";
	const presetTokens = TENANT_THEME_PRESETS[preferredPreset] || TENANT_THEME_PRESETS.minimal;
	const merged = {
		...DEFAULT_TENANT_BRANDING,
		...base,
		...presetTokens,
		...overrides,
		themePreset: preferredPreset,
	} satisfies TenantBranding;

	return merged;
}

export function getTenantBrandingFromHeaders(
	host: string | null | undefined,
	headerValues?: {
		siteName?: string | null;
		themePreset?: string | null;
		themeOverrides?: string | null;
		seoDefaultTitle?: string | null;
		seoDefaultDescription?: string | null;
		seoDefaultImage?: string | null;
	},
): TenantBranding {
	const fromDomain = host
		? TENANT_BRANDING_BY_DOMAIN[normalizeHost(host)] || DEFAULT_TENANT_BRANDING
		: DEFAULT_TENANT_BRANDING;
	const headerOverrides = {
		siteName: headerValues?.siteName || undefined,
		themePreset: parseThemePreset(headerValues?.themePreset) || undefined,
		seoDefaultTitle: headerValues?.seoDefaultTitle || undefined,
		seoDefaultDescription: headerValues?.seoDefaultDescription || undefined,
		seoDefaultImage: headerValues?.seoDefaultImage || undefined,
		...parseThemeOverrideTokens(headerValues?.themeOverrides),
	} satisfies Partial<TenantBranding>;
	return resolveTenantBranding(fromDomain, headerOverrides);
}

export function getTenantBrandingForHost(host: string | null | undefined): TenantBranding {
	return getTenantBrandingFromHeaders(host);
}

export function getTenantThemeCssVariables(
	branding: TenantBranding | null | undefined,
): Record<string, string> | undefined {
	if (!branding) return undefined;
	const tokenToVar = {
		background: "--background",
		foreground: "--foreground",
		card: "--card",
		cardForeground: "--card-foreground",
		secondary: "--secondary",
		secondaryForeground: "--secondary-foreground",
		muted: "--muted",
		mutedForeground: "--muted-foreground",
		border: "--border",
		input: "--input",
		primary: "--primary",
		primaryForeground: "--primary-foreground",
		accent: "--accent",
		accentForeground: "--accent-foreground",
		success: "--success",
		successForeground: "--success-foreground",
		destructive: "--destructive",
		destructiveForeground: "--destructive-foreground",
		ring: "--ring",
		radius: "--radius",
		fontSans: "--font-sans-custom",
		fontHeading: "--font-heading-custom",
		textScale: "--text-scale",
		headingWeight: "--heading-weight",
		bodyLineHeight: "--body-line-height",
		sectionSpacingY: "--section-spacing-y",
		cardPadding: "--card-padding",
		gridGap: "--grid-gap",
		buttonDensity: "--button-density",
		inputDensity: "--input-density",
		shadowSm: "--shadow-sm",
		shadowMd: "--shadow-md",
		shadowLg: "--shadow-lg",
	} as const satisfies Record<string, string>;
	const vars: Record<string, string> = {};
	for (const [key, cssVarName] of Object.entries(tokenToVar)) {
		const value = branding[key as keyof TenantBranding];
		if (typeof value === "string" && value.trim()) {
			vars[cssVarName] = value.trim();
		}
	}
	return Object.keys(vars).length ? vars : undefined;
}
