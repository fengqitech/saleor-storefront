"use client";

import { Puck } from "@puckeditor/core";
import { Hammer, Layers, RectangleEllipsis } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { tryRewriteObjectStorageUrlToMediaPath } from "@/lib/tenant-media-url";

type TenantPayload = {
	code?: string | null;
	domain?: string | null;
	channel?: string | null;
};

type VersionedState<T> = {
	activeVersion?: number | null;
	draft?: T | null;
	published?: T | null;
	historyCount?: number;
};

type ProvisionScope = {
	menus: boolean;
	pages: boolean;
};

type RestoreConflictPolicy = "skip-existing" | "error-on-existing";

type ProvisioningRollbackPreviewSection = {
	wouldDelete?: string[];
	missing?: string[];
	skipped?: string[];
	errors?: Array<{ key: string; message: string }>;
};

type ProvisioningRestorePreviewSection = {
	wouldCreate?: string[];
	existing?: string[];
	skipped?: string[];
	conflicts?: string[];
	errors?: Array<{ key: string; message: string }>;
};

type ThemeDraft = {
	siteName?: string;
	themePreset?: string;
	themeOverrides?: Record<string, unknown>;
	seoDefaultTitle?: string;
	seoDefaultDescription?: string;
	seoDefaultImage?: string;
};

type ThemePayload = {
	tenant?: TenantPayload;
	theme?: VersionedState<ThemeDraft>;
	error?: string;
};

type HomepageLayoutDraft = {
	schemaVersion?: number;
	sections?: Array<Record<string, unknown>>;
};

type HomepageLayoutPayload = {
	tenant?: TenantPayload;
	homepageLayout?: VersionedState<HomepageLayoutDraft>;
	error?: string;
};

type CommercePlpPreset = "standard-grid" | "dense-grid" | "editorial";
type CommercePdpPreset = "classic" | "tabs" | "accordion";
type CommerceSortOption = "featured" | "newest" | "price_asc" | "price_desc" | "bestselling";
type CommercePlpFilterLayout = "sidebar" | "topbar";
type CommercePlpCardDensity = "compact" | "standard" | "large";

type CommerceLayoutDraft = {
	schemaVersion?: number;
	plp?: {
		preset?: CommercePlpPreset;
		defaultSort?: CommerceSortOption;
		filterLayout?: CommercePlpFilterLayout;
		cardDensity?: CommercePlpCardDensity;
		slots?: {
			topBanner?: boolean;
			descriptionBlock?: boolean;
			subCategoryNav?: boolean;
			seoText?: boolean;
		};
		flags?: {
			showFilters?: boolean;
			showSort?: boolean;
			showCardDensitySwitcher?: boolean;
		};
	};
	pdp?: {
		preset?: CommercePdpPreset;
		slots?: {
			trustBadges?: boolean;
			shippingInfo?: boolean;
			returnsSnippet?: boolean;
			faq?: boolean;
			relatedProducts?: boolean;
			contactCta?: boolean;
		};
		flags?: {
			stickyAddToCart?: boolean;
		};
	};
};

type CommerceLayoutPayload = {
	tenant?: TenantPayload;
	commerceLayout?: VersionedState<CommerceLayoutDraft>;
	error?: string;
};

type HomepageBuilderFieldType =
	| "text"
	| "textarea"
	| "url"
	| "number"
	| "collectionSlug"
	| "select"
	| "color"
	| "imageUpload";

type HomepageBuilderField = {
	key: string;
	label: string;
	type: HomepageBuilderFieldType;
	tier?: "must-have" | "secondary" | "advanced";
	required?: boolean;
	placeholder?: string;
	helpText?: string;
	min?: number;
	max?: number;
	options?: Array<{ label: string; value: string }>;
};

type HomepageSectionRegistryItem = {
	type: string;
	title: string;
	description?: string;
	group?: "layout" | "content" | "commerce" | "utility";
	tier?: "must-have" | "secondary" | "advanced";
	rolloutOrder?: number;
	puckComponent: string;
	defaults?: Record<string, unknown>;
	fields?: HomepageBuilderField[];
};

type HomepageSchemaPayload = {
	builder?: {
		preferredEditor?: string;
		schemaVersion?: number;
		sectionRegistry?: HomepageSectionRegistryItem[];
	};
};

type CollectionPickerOption = {
	id: string;
	slug: string;
	name: string;
};

type CollectionsPayload = {
	channel?: string;
	count?: number;
	collections?: CollectionPickerOption[];
	error?: string;
};

type BuilderAssetItem = {
	id: string;
	mediaUrl: string;
	url?: string;
	name?: string;
	alt?: string;
	mimeType?: string;
	size?: number;
	tags?: string[];
	createdAt?: string;
	updatedAt?: string;
};

type BuilderAssetUsageReference = {
	mode?: string;
	sectionIndex?: number;
	sectionType?: string;
	fields?: string[];
};

type BuilderAssetsPayload = {
	tenant?: TenantPayload;
	asset?: BuilderAssetItem;
	deletedId?: string;
	forced?: boolean;
	assets?: {
		items?: BuilderAssetItem[];
		count?: number;
		totalCount?: number;
		page?: number;
		limit?: number;
		hasMore?: boolean;
		query?: {
			q?: string;
			tag?: string;
		};
		updatedAt?: string | null;
	};
	error?: string;
	errorCode?: string;
	usage?: BuilderAssetUsageReference[];
};

type StarterKitSummary = {
	id: string;
	name: string;
	description?: string;
	tags?: string[];
	saleorRefs?: {
		suggestedMenus?: string[];
		suggestedPages?: string[];
	} | null;
};

type StarterKitAuditEntry = {
	id: string;
	type: string;
	createdAt?: string;
	kitId?: string;
	mode?: string;
	changed?: boolean;
	idempotent?: boolean;
	targetAuditId?: string;
	saleorProvisioning?: {
		menus?: { created?: string[] };
		pages?: { created?: string[] };
	};
	rollbackProvisioning?: {
		menus?: { deleted?: string[]; errors?: Array<{ key: string; message: string }> };
		pages?: { deleted?: string[]; errors?: Array<{ key: string; message: string }> };
	};
	restoreProvisioning?: {
		menus?: { created?: string[]; errors?: Array<{ key: string; message: string }> };
		pages?: { created?: string[]; errors?: Array<{ key: string; message: string }> };
	};
	rollbackGuardrail?: {
		maxEntities?: number;
		targetCount?: number;
		confirmationProvided?: boolean;
		bypassRequested?: boolean;
		bypassEligible?: boolean;
		bypassUsed?: boolean;
	};
	restoreGuardrail?: {
		maxEntities?: number;
		targetCount?: number;
		confirmationProvided?: boolean;
		bypassRequested?: boolean;
		bypassEligible?: boolean;
		bypassUsed?: boolean;
	};
	proposalId?: string;
	restoreSource?: "before" | "after";
	beforeGuardrailPolicy?: StarterKitGuardrailPolicy;
	afterGuardrailPolicy?: StarterKitGuardrailPolicy;
	dualControl?: {
		required?: boolean;
		proposerId?: string;
		approverId?: string;
		sameApproverAndProposer?: boolean;
		overrideUsed?: boolean;
		overrideAllowed?: boolean;
	};
	notification?: GuardrailNotificationSummary;
	notificationRetry?: GuardrailNotificationRetryResult;
};

type StarterKitGuardrailPolicy = {
	maxEntities?: number;
	bypass?: {
		superuser?: boolean;
		permissions?: string[];
	};
	updatedAt?: string;
	updatedBy?: string;
};

type StarterKitGuardrailPolicyPending = {
	proposalId?: string;
	createdAt?: string;
	actor?: string;
	actorId?: string;
	note?: string;
	status?: string;
	beforeGuardrailPolicy?: StarterKitGuardrailPolicy;
	proposedGuardrailPolicy?: StarterKitGuardrailPolicy;
};

type GuardrailNotificationSummary = {
	attempted?: number;
	delivered?: number;
	failed?: number;
	retryAttempts?: number;
	deadLetters?: number;
	deadLetterIds?: string[];
	channels?: string[];
	errors?: string[];
};

type GuardrailNotificationDeadLetter = {
	id?: string;
	createdAt?: string;
	updatedAt?: string;
	proposalId?: string;
	actor?: string;
	actorId?: string;
	kind?: string;
	label?: string;
	targetUrl?: string;
	attempts?: number;
	retryAttempts?: number;
	maxRetries?: number;
	lastError?: string;
};

type GuardrailNotificationRetryResult = {
	deadLetterId?: string;
	proposalId?: string;
	label?: string;
	kind?: string;
	targetUrl?: string;
	successful?: boolean;
	attempts?: number;
	retryAttempts?: number;
	maxRetries?: number;
	retriedAt?: string;
	error?: string;
};

type GuardrailNotificationDeadLetterStatus = {
	deadLetterCount?: number;
	staleCount?: number;
	oldestStaleAgeSeconds?: number;
	staleAfterSeconds?: number;
	alert?: {
		triggered?: boolean;
		minStaleCount?: number;
		staleAgeThresholdSeconds?: number;
	};
};

type StarterKitsPayload = {
	tenant?: TenantPayload;
	kits?: StarterKitSummary[];
	saleorRefs?: {
		suggestedMenus?: string[];
		suggestedPages?: string[];
	};
	audit?: {
		count?: number;
		recent?: StarterKitAuditEntry[];
		entries?: StarterKitAuditEntry[];
	};
	guardrailPolicy?: StarterKitGuardrailPolicy;
	guardrailPolicyPending?: StarterKitGuardrailPolicyPending | null;
	guardrailNotificationDeadLetters?: GuardrailNotificationDeadLetter[];
	guardrailNotificationDeadLetterStatus?: GuardrailNotificationDeadLetterStatus;
	notification?: GuardrailNotificationSummary;
	notificationRetry?: GuardrailNotificationRetryResult;
	deadLetterSweep?: {
		dryRun?: boolean;
		processedCount?: number;
		deliveredCount?: number;
		failedCount?: number;
		discoveredStaleCount?: number;
		retryAttempts?: number;
	};
	action?: string;
	mode?: string;
	kitId?: string;
	changed?: boolean;
	idempotent?: boolean;
	targetAuditId?: string;
	provisioning?: {
		enabled?: boolean;
		changed?: boolean;
		warnings?: string[];
		menus?: {
			created?: string[];
			existing?: string[];
			errors?: Array<{ key: string; message: string }>;
		};
		pages?: {
			created?: string[];
			existing?: string[];
			errors?: Array<{ key: string; message: string }>;
		};
	};
	provisioningRollback?: {
		enabled?: boolean;
		changed?: boolean;
		warnings?: string[];
		menus?: {
			deleted?: string[];
			skipped?: string[];
			errors?: Array<{ key: string; message: string }>;
		};
		pages?: {
			deleted?: string[];
			skipped?: string[];
			errors?: Array<{ key: string; message: string }>;
		};
	};
	provisioningRestore?: {
		enabled?: boolean;
		changed?: boolean;
		source?: string;
		conflictPolicy?: RestoreConflictPolicy;
		warnings?: string[];
		menus?: {
			created?: string[];
			existing?: string[];
			skipped?: string[];
			errors?: Array<{ key: string; message: string }>;
		};
		pages?: {
			created?: string[];
			existing?: string[];
			skipped?: string[];
			errors?: Array<{ key: string; message: string }>;
		};
	};
	rollbackDryRun?: {
		targetAuditId?: string;
		hasSnapshot?: boolean;
		provisioningRollbackEnabled?: boolean;
		provisioningRollbackDryRun?: {
			enabled?: boolean;
			changed?: boolean;
			warnings?: string[];
			scope?: ProvisionScope;
			guardrail?: {
				maxEntities?: number;
				selectedCount?: number;
				confirmationRequired?: boolean;
				bypassEligible?: boolean;
			};
			menus?: ProvisioningRollbackPreviewSection;
			pages?: ProvisioningRollbackPreviewSection;
		};
	};
	provisioningRestoreDryRun?: {
		enabled?: boolean;
		changed?: boolean;
		source?: string;
		conflictPolicy?: RestoreConflictPolicy;
		warnings?: string[];
		scope?: ProvisionScope;
		guardrail?: {
			maxEntities?: number;
			selectedCount?: number;
			confirmationRequired?: boolean;
			bypassEligible?: boolean;
		};
		menus?: ProvisioningRestorePreviewSection;
		pages?: ProvisioningRestorePreviewSection;
	};
	theme?: VersionedState<ThemeDraft>;
	homepageLayout?: VersionedState<HomepageLayoutDraft>;
	error?: string;
};

type PuckContentItem = {
	type: string;
	props: Record<string, unknown> & { id: string };
};

type PuckDataShape = {
	root?: Record<string, unknown>;
	content?: PuckContentItem[];
};

type StyleControlTier = "must-have" | "secondary" | "advanced";

type RollbackPreviewState = {
	menus: string[];
	pages: string[];
	selectedMenus: string[];
	selectedPages: string[];
	missingMenus: string[];
	missingPages: string[];
	warnings: string[];
	maxEntities: number;
	largeOperationConfirmed: boolean;
	bypassEligible: boolean;
	bypassRequested: boolean;
};

type RestorePreviewState = {
	menus: string[];
	pages: string[];
	selectedMenus: string[];
	selectedPages: string[];
	existingMenus: string[];
	existingPages: string[];
	conflictMenus: string[];
	conflictPages: string[];
	warnings: string[];
	conflictPolicy: RestoreConflictPolicy;
	maxEntities: number;
	largeOperationConfirmed: boolean;
	bypassEligible: boolean;
	bypassRequested: boolean;
};

const THEME_PRESET_OPTIONS = ["minimal", "ocean", "sunset", "forest"];
const DEFAULT_LARGE_OPERATION_THRESHOLD = 20;

type ThemeTokenInputType = "color" | "text" | "number" | "select";
type ThemeTokenOption = { label: string; value: string };
type ThemeTokenDefinition = {
	key: string;
	label: string;
	description?: string;
	inputType: ThemeTokenInputType;
	placeholder?: string;
	min?: number;
	max?: number;
	step?: number;
	options?: ThemeTokenOption[];
};

const THEME_TOKEN_DEFINITIONS: ThemeTokenDefinition[] = [
	{
		key: "primary",
		label: "主色",
		description: "按钮/主要强调色",
		inputType: "color",
		placeholder: "#111827",
	},
	{
		key: "primaryForeground",
		label: "主色文字",
		description: "主按钮上的文字颜色",
		inputType: "color",
		placeholder: "#ffffff",
	},
	{
		key: "accent",
		label: "强调底色",
		description: "次级强调区域背景色",
		inputType: "color",
		placeholder: "#f5f5f5",
	},
	{
		key: "accentForeground",
		label: "强调文字",
		description: "强调区域上的文字颜色",
		inputType: "color",
		placeholder: "#111827",
	},
	{ key: "background", label: "页面背景", inputType: "color", placeholder: "#fafafa" },
	{ key: "foreground", label: "正文颜色", inputType: "color", placeholder: "#111827" },
	{ key: "card", label: "卡片背景", inputType: "color", placeholder: "#ffffff" },
	{ key: "cardForeground", label: "卡片文字", inputType: "color", placeholder: "#111827" },
	{ key: "border", label: "边框色", inputType: "color", placeholder: "#e5e7eb" },
	{ key: "muted", label: "弱化底色", inputType: "color", placeholder: "#f3f4f6" },
	{ key: "mutedForeground", label: "弱化文字", inputType: "color", placeholder: "#6b7280" },
	{
		key: "radius",
		label: "圆角",
		description: "例如 0.5rem / 8px",
		inputType: "text",
		placeholder: "0.5rem",
	},
	{
		key: "textScale",
		label: "字号比例",
		description: "整体字号缩放（0.85-1.2）",
		inputType: "number",
		min: 0.85,
		max: 1.2,
		step: 0.01,
	},
	{
		key: "sectionSpacingY",
		label: "区块垂直间距",
		description: "例如 3rem / 48px",
		inputType: "text",
		placeholder: "3rem",
	},
	{
		key: "cardPadding",
		label: "卡片内边距",
		description: "例如 1.25rem / 20px",
		inputType: "text",
		placeholder: "1.25rem",
	},
	{
		key: "gridGap",
		label: "网格间距",
		description: "例如 1.25rem / 20px",
		inputType: "text",
		placeholder: "1.25rem",
	},
	{
		key: "buttonDensity",
		label: "按钮密度",
		description: "决定按钮高度与紧凑程度",
		inputType: "select",
		options: [
			{ value: "compact", label: "紧凑" },
			{ value: "normal", label: "标准" },
			{ value: "airy", label: "宽松" },
		],
	},
	{
		key: "inputDensity",
		label: "输入框密度",
		description: "决定输入框高度与紧凑程度",
		inputType: "select",
		options: [
			{ value: "compact", label: "紧凑" },
			{ value: "normal", label: "标准" },
			{ value: "airy", label: "宽松" },
		],
	},
];

const THEME_TOKEN_KEY_SET = new Set(THEME_TOKEN_DEFINITIONS.map((definition) => definition.key));

const COMMERCE_PLP_PRESET_OPTIONS: Array<{ value: CommercePlpPreset; label: string }> = [
	{ value: "standard-grid", label: "标准网格（推荐）" },
	{ value: "dense-grid", label: "密集网格" },
	{ value: "editorial", label: "杂志风" },
];
const COMMERCE_PLP_SORT_OPTIONS: Array<{ value: CommerceSortOption; label: string }> = [
	{ value: "featured", label: "推荐" },
	{ value: "newest", label: "最新" },
	{ value: "price_asc", label: "价格从低到高" },
	{ value: "price_desc", label: "价格从高到低" },
	{ value: "bestselling", label: "最畅销" },
];
const COMMERCE_PLP_FILTER_LAYOUT_OPTIONS: Array<{ value: CommercePlpFilterLayout; label: string }> = [
	{ value: "sidebar", label: "侧边筛选" },
	{ value: "topbar", label: "顶部筛选" },
];
const COMMERCE_PLP_CARD_DENSITY_OPTIONS: Array<{ value: CommercePlpCardDensity; label: string }> = [
	{ value: "compact", label: "紧凑" },
	{ value: "standard", label: "标准" },
	{ value: "large", label: "大卡片" },
];
const COMMERCE_PDP_PRESET_OPTIONS: Array<{ value: CommercePdpPreset; label: string }> = [
	{ value: "classic", label: "经典详情页" },
	{ value: "tabs", label: "标签页详情" },
	{ value: "accordion", label: "折叠面板详情" },
];
const STYLE_CONTROL_TIER_OPTIONS: Array<{ value: StyleControlTier; label: string }> = [
	{ value: "must-have", label: "基础（推荐）" },
	{ value: "secondary", label: "标准（含次级）" },
	{ value: "advanced", label: "高级（全部）" },
];
const SECTION_GROUP_LABELS: Record<NonNullable<HomepageSectionRegistryItem["group"]>, string> = {
	layout: "布局容器",
	content: "内容营销",
	commerce: "电商模块",
	utility: "工具辅助",
};
const SECTION_TIER_LABELS: Record<NonNullable<HomepageSectionRegistryItem["tier"]>, string> = {
	"must-have": "必做",
	secondary: "次级",
	advanced: "高级",
};

const DEFAULT_COMMERCE_LAYOUT_DRAFT: CommerceLayoutDraft = {
	schemaVersion: 1,
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

function normalizeCommerceLayoutDraft(
	input: CommerceLayoutDraft | Record<string, unknown> | null | undefined,
): CommerceLayoutDraft {
	const source = isRecord(input) ? input : {};
	const sourcePlp = isRecord(source.plp) ? source.plp : {};
	const sourcePlpSlots = isRecord(sourcePlp.slots) ? sourcePlp.slots : {};
	const sourcePlpFlags = isRecord(sourcePlp.flags) ? sourcePlp.flags : {};
	const sourcePdp = isRecord(source.pdp) ? source.pdp : {};
	const sourcePdpSlots = isRecord(sourcePdp.slots) ? sourcePdp.slots : {};
	const sourcePdpFlags = isRecord(sourcePdp.flags) ? sourcePdp.flags : {};

	const pickEnum = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T => {
		return typeof value === "string" && (allowed as readonly string[]).includes(value)
			? (value as T)
			: fallback;
	};
	const pickBoolean = (value: unknown, fallback: boolean): boolean =>
		typeof value === "boolean" ? value : fallback;

	return {
		schemaVersion: 1,
		plp: {
			preset: pickEnum(
				sourcePlp.preset,
				COMMERCE_PLP_PRESET_OPTIONS.map((option) => option.value),
				DEFAULT_COMMERCE_LAYOUT_DRAFT.plp?.preset || "standard-grid",
			),
			defaultSort: pickEnum(
				sourcePlp.defaultSort,
				COMMERCE_PLP_SORT_OPTIONS.map((option) => option.value),
				DEFAULT_COMMERCE_LAYOUT_DRAFT.plp?.defaultSort || "newest",
			),
			filterLayout: pickEnum(
				sourcePlp.filterLayout,
				COMMERCE_PLP_FILTER_LAYOUT_OPTIONS.map((option) => option.value),
				DEFAULT_COMMERCE_LAYOUT_DRAFT.plp?.filterLayout || "sidebar",
			),
			cardDensity: pickEnum(
				sourcePlp.cardDensity,
				COMMERCE_PLP_CARD_DENSITY_OPTIONS.map((option) => option.value),
				DEFAULT_COMMERCE_LAYOUT_DRAFT.plp?.cardDensity || "standard",
			),
			slots: {
				topBanner: pickBoolean(
					sourcePlpSlots.topBanner,
					DEFAULT_COMMERCE_LAYOUT_DRAFT.plp?.slots?.topBanner || false,
				),
				descriptionBlock: pickBoolean(
					sourcePlpSlots.descriptionBlock,
					DEFAULT_COMMERCE_LAYOUT_DRAFT.plp?.slots?.descriptionBlock || true,
				),
				subCategoryNav: pickBoolean(
					sourcePlpSlots.subCategoryNav,
					DEFAULT_COMMERCE_LAYOUT_DRAFT.plp?.slots?.subCategoryNav || true,
				),
				seoText: pickBoolean(
					sourcePlpSlots.seoText,
					DEFAULT_COMMERCE_LAYOUT_DRAFT.plp?.slots?.seoText || true,
				),
			},
			flags: {
				showFilters: pickBoolean(
					sourcePlpFlags.showFilters,
					DEFAULT_COMMERCE_LAYOUT_DRAFT.plp?.flags?.showFilters || true,
				),
				showSort: pickBoolean(
					sourcePlpFlags.showSort,
					DEFAULT_COMMERCE_LAYOUT_DRAFT.plp?.flags?.showSort || true,
				),
				showCardDensitySwitcher: pickBoolean(
					sourcePlpFlags.showCardDensitySwitcher,
					DEFAULT_COMMERCE_LAYOUT_DRAFT.plp?.flags?.showCardDensitySwitcher || true,
				),
			},
		},
		pdp: {
			preset: pickEnum(
				sourcePdp.preset,
				COMMERCE_PDP_PRESET_OPTIONS.map((option) => option.value),
				DEFAULT_COMMERCE_LAYOUT_DRAFT.pdp?.preset || "classic",
			),
			slots: {
				trustBadges: pickBoolean(
					sourcePdpSlots.trustBadges,
					DEFAULT_COMMERCE_LAYOUT_DRAFT.pdp?.slots?.trustBadges || true,
				),
				shippingInfo: pickBoolean(
					sourcePdpSlots.shippingInfo,
					DEFAULT_COMMERCE_LAYOUT_DRAFT.pdp?.slots?.shippingInfo || true,
				),
				returnsSnippet: pickBoolean(
					sourcePdpSlots.returnsSnippet,
					DEFAULT_COMMERCE_LAYOUT_DRAFT.pdp?.slots?.returnsSnippet || true,
				),
				faq: pickBoolean(sourcePdpSlots.faq, DEFAULT_COMMERCE_LAYOUT_DRAFT.pdp?.slots?.faq || true),
				relatedProducts: pickBoolean(
					sourcePdpSlots.relatedProducts,
					DEFAULT_COMMERCE_LAYOUT_DRAFT.pdp?.slots?.relatedProducts || true,
				),
				contactCta: pickBoolean(
					sourcePdpSlots.contactCta,
					DEFAULT_COMMERCE_LAYOUT_DRAFT.pdp?.slots?.contactCta || true,
				),
			},
			flags: {
				stickyAddToCart: pickBoolean(
					sourcePdpFlags.stickyAddToCart,
					DEFAULT_COMMERCE_LAYOUT_DRAFT.pdp?.flags?.stickyAddToCart || false,
				),
			},
		},
	};
}

function isHexColor(value: string): boolean {
	return /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value.trim());
}

function splitThemeOverrides(themeOverrides: unknown): {
	tokenOverrides: Record<string, string>;
	extraOverrides: Record<string, unknown>;
} {
	if (!isRecord(themeOverrides)) {
		return {
			tokenOverrides: {},
			extraOverrides: {},
		};
	}
	const tokenOverrides: Record<string, string> = {};
	const extraOverrides: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(themeOverrides)) {
		if (THEME_TOKEN_KEY_SET.has(key) && typeof value === "string" && value.trim()) {
			tokenOverrides[key] = value.trim();
			continue;
		}
		extraOverrides[key] = value;
	}
	return {
		tokenOverrides,
		extraOverrides,
	};
}

function formatNotificationSummary(summary: GuardrailNotificationSummary | undefined): string {
	if (!summary) return "";
	const attempted = summary.attempted || 0;
	const delivered = summary.delivered || 0;
	const failed = summary.failed || 0;
	const retries = summary.retryAttempts || 0;
	const deadLetters = summary.deadLetters || 0;
	const errorText = summary.errors?.length ? ` Errors: ${summary.errors.join(" | ")}` : "";
	return ` Notifications attempted: ${attempted}, delivered: ${delivered}, failed: ${failed}, retries: ${retries}, dead-lettered: ${deadLetters}.${errorText}`;
}

function formatAgeSeconds(value: number | undefined): string {
	if (!value || value <= 0) return "0s";
	if (value < 60) return `${value}s`;
	const minutes = Math.floor(value / 60);
	if (minutes < 60) return `${minutes}m`;
	const hours = Math.floor(minutes / 60);
	const remMinutes = minutes % 60;
	return remMinutes ? `${hours}h ${remMinutes}m` : `${hours}h`;
}

function formatBytes(value: number | undefined): string {
	if (!Number.isFinite(value || 0) || (value || 0) <= 0) return "0 B";
	const units = ["B", "KB", "MB", "GB"];
	let size = value || 0;
	let unitIndex = 0;
	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex += 1;
	}
	return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function stripTypeField(value: Record<string, unknown> | undefined): Record<string, unknown> {
	if (!value) {
		return {};
	}
	const next = { ...value };
	delete next.type;
	return next;
}

function extractFeaturedCollectionSlugs(layout?: HomepageLayoutDraft | null): string[] {
	if (!layout?.sections || !Array.isArray(layout.sections)) {
		return [];
	}
	return layout.sections
		.flatMap((section) => {
			if (!isRecord(section)) return [];
			if (section.type === "featured-products") {
				const slug = section.collectionSlug;
				return typeof slug === "string" ? [slug.trim()] : [];
			}
			if (section.type === "featured-collections") {
				const slugs = [
					section.collectionSlug1,
					section.collectionSlug2,
					section.collectionSlug3,
					section.collectionSlug4,
				]
					.map((value) => (typeof value === "string" ? value.trim() : ""))
					.filter(Boolean);
				return slugs;
			}
			if (section.type === "collection-hero") {
				const slug = section.collectionSlug;
				return typeof slug === "string" ? [slug.trim()] : [];
			}
			return [];
		})
		.filter(Boolean);
}

function getTitleClass(size: unknown, fallback: "hero" | "container" = "hero") {
	if (fallback === "container") {
		if (size === "md") return "text-2xl lg:text-3xl";
		if (size === "xl") return "text-4xl lg:text-5xl";
		return "text-3xl lg:text-4xl";
	}
	if (size === "lg") return "text-2xl lg:text-3xl";
	if (size === "2xl") return "text-5xl lg:text-6xl";
	return "text-3xl lg:text-4xl";
}

function getBodyClass(size: unknown) {
	if (size === "sm") return "text-sm";
	if (size === "lg") return "text-lg";
	return "text-base";
}

function getButtonClass(variant: unknown, size: unknown) {
	const variantClass =
		variant === "outline"
			? "border border-current bg-transparent text-current"
			: "bg-primary text-primary-foreground";
	const sizeClass =
		size === "sm" ? "px-3 py-1.5 text-xs" : size === "lg" ? "px-6 py-3 text-base" : "px-4 py-2 text-sm";
	return `inline-flex items-center rounded-md font-medium ${variantClass} ${sizeClass}`;
}

function normalizeColumnCount(value: unknown): 2 | 3 | 4 {
	const parsed =
		typeof value === "number" ? value : typeof value === "string" ? Number.parseInt(value, 10) : NaN;
	if (parsed === 2 || parsed === 4) return parsed;
	return 3;
}

function toHexColorOrEmpty(value: string): string {
	const normalized = value.trim().toLowerCase();
	if (!normalized) return "";
	return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/.test(normalized) ? normalized : "";
}

function resolveBuilderBackgroundImageUrl(value: unknown): string {
	const normalized = typeof value === "string" ? value.trim() : "";
	if (!normalized) return "";
	if (normalized.startsWith("/")) return normalized;
	return tryRewriteObjectStorageUrlToMediaPath(normalized) || normalized;
}

type PuckCustomFieldProps<Value> = {
	field?: {
		label?: string;
		placeholder?: string;
		helpText?: string;
	};
	value: Value;
	onChange: (next: Value) => void;
	readOnly?: boolean;
};

function ColorPickerField(props: PuckCustomFieldProps<string>) {
	const value = typeof props.value === "string" ? props.value : "";
	const normalizedHex = toHexColorOrEmpty(value) || "#000000";

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				<input
					type="color"
					value={normalizedHex}
					disabled={props.readOnly}
					onChange={(event) => props.onChange(event.target.value)}
					className="h-9 w-12 cursor-pointer rounded border border-border bg-background p-1 disabled:cursor-not-allowed disabled:opacity-60"
				/>
				<input
					type="text"
					value={value}
					disabled={props.readOnly}
					onChange={(event) => props.onChange(event.target.value)}
					placeholder={props.field?.placeholder || "#0f172a"}
					className="h-9 w-full rounded border border-border bg-background px-2 text-sm"
				/>
			</div>
			{props.field?.helpText ? <p className="text-xs text-muted-foreground">{props.field.helpText}</p> : null}
		</div>
	);
}

type ImageUploadFieldProps = PuckCustomFieldProps<string> & {
	uploadImage: (file: File) => Promise<string>;
	assets: BuilderAssetItem[];
};

function ImageUploadField(props: ImageUploadFieldProps) {
	const [uploading, setUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);

	const value = typeof props.value === "string" ? props.value : "";
	const normalizedAssets = props.assets
		.filter((asset) => typeof asset.mediaUrl === "string" && asset.mediaUrl.trim())
		.slice(0, 200);

	const handleFileChange = useCallback(
		async (event: ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			event.currentTarget.value = "";
			if (!file) return;
			if (props.readOnly) return;

			setUploading(true);
			setUploadError(null);
			try {
				const uploadedUrl = await props.uploadImage(file);
				props.onChange(uploadedUrl);
			} catch (error) {
				setUploadError(error instanceof Error ? error.message : "图片上传失败");
			} finally {
				setUploading(false);
			}
		},
		[props],
	);

	return (
		<div className="space-y-2">
			<input
				type="text"
				value={value}
				disabled={props.readOnly}
				onChange={(event) => props.onChange(event.target.value)}
				placeholder={props.field?.placeholder || "点击上传，或粘贴图片 URL"}
				className="h-9 w-full rounded border border-border bg-background px-2 text-sm"
			/>
			<div className="flex flex-wrap items-center gap-2">
				<label className="inline-flex cursor-pointer items-center rounded border border-border px-2 py-1 text-xs font-medium">
					<input
						type="file"
						accept="image/*"
						disabled={props.readOnly || uploading}
						onChange={handleFileChange}
						className="hidden"
					/>
					{uploading ? "上传中..." : "上传图片"}
				</label>
				{value ? (
					<a href={value} target="_blank" rel="noreferrer" className="text-xs text-primary underline">
						查看
					</a>
				) : null}
			</div>
			{normalizedAssets.length ? (
				<div className="space-y-1">
					<p className="text-xs text-muted-foreground">从素材库选择</p>
					<select
						className="h-9 w-full rounded border border-border bg-background px-2 text-sm"
						disabled={props.readOnly}
						value={value}
						onChange={(event) => props.onChange(event.target.value)}
					>
						<option value="">-- 请选择素材 --</option>
						{normalizedAssets.map((asset) => {
							const optionLabel = `${asset.name || "未命名素材"} (${asset.mediaUrl})`;
							return (
								<option key={asset.id} value={asset.mediaUrl}>
									{optionLabel}
								</option>
							);
						})}
					</select>
				</div>
			) : null}
			{props.field?.helpText ? <p className="text-xs text-muted-foreground">{props.field.helpText}</p> : null}
			{uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}
		</div>
	);
}

function buildPuckConfig(
	sectionRegistry: HomepageSectionRegistryItem[],
	collectionFieldOptions: Array<{ label: string; value: string }>,
	uploadImage: (file: File) => Promise<string>,
	assets: BuilderAssetItem[],
	styleControlTier: StyleControlTier,
) {
	const components: Record<string, unknown> = {};
	const tierOrder: Record<StyleControlTier, number> = {
		"must-have": 1,
		secondary: 2,
		advanced: 3,
	};
	const inferFieldTier = (field: HomepageBuilderField): StyleControlTier => {
		if (field.tier) return field.tier;
		if (field.key === "minHeight" || field.key === "paddingX" || field.key === "paddingY") return "advanced";
		if (
			field.key === "widthMode" ||
			field.key === "titleSize" ||
			field.key === "bodySize" ||
			field.key === "buttonVariant" ||
			field.key === "buttonSize" ||
			field.key === "height" ||
			field.key === "limit"
		) {
			return "secondary";
		}
		return "must-have";
	};
	const isFieldVisible = (field: HomepageBuilderField): boolean =>
		tierOrder[inferFieldTier(field)] <= tierOrder[styleControlTier];

	for (const section of sectionRegistry) {
		const fields: Record<string, unknown> = {};
		for (const field of section.fields || []) {
			if (!isFieldVisible(field)) {
				continue;
			}
			if (field.type === "collectionSlug") {
				if (collectionFieldOptions.length > 0) {
					fields[field.key] = {
						type: "select",
						label: field.label,
						options: collectionFieldOptions,
					};
				} else {
					fields[field.key] = {
						type: "text",
						label: field.label,
						placeholder: field.placeholder || "featured-products",
					};
				}
				continue;
			}

			if (field.type === "select") {
				fields[field.key] = {
					type: "select",
					label: field.label,
					options: field.options || [],
				};
				continue;
			}

			if (field.type === "color") {
				fields[field.key] = {
					type: "custom",
					label: field.label,
					render: (props: PuckCustomFieldProps<string>) => <ColorPickerField {...props} />,
				};
				continue;
			}

			if (field.type === "imageUpload") {
				fields[field.key] = {
					type: "custom",
					label: field.label,
					render: (props: PuckCustomFieldProps<string>) => (
						<ImageUploadField {...props} uploadImage={uploadImage} assets={assets} />
					),
				};
				continue;
			}

			const mappedType = field.type === "textarea" ? "textarea" : field.type === "number" ? "number" : "text";
			fields[field.key] = {
				type: mappedType,
				label: field.label,
				placeholder: field.placeholder,
				min: field.min,
				max: field.max,
				helpText: field.helpText,
			};
		}

		components[section.puckComponent] = {
			label: section.title,
			// Puck's DnD layer expects every component instance to have `props.id`.
			// When dragging from the drawer, Puck starts from `defaultProps`, so we must
			// include an `id` seed here. We normalize IDs on change to keep them unique.
			defaultProps: {
				id: `${section.puckComponent}-template`,
				...stripTypeField(section.defaults),
			},
			fields,
			render: (props: Record<string, unknown>) => {
				if (section.type === "hero") {
					const eyebrow = typeof props.eyebrow === "string" ? props.eyebrow : "";
					const title = typeof props.title === "string" ? props.title : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					const backgroundColor = typeof props.backgroundColor === "string" ? props.backgroundColor : "";
					const backgroundImageUrl = resolveBuilderBackgroundImageUrl(props.backgroundImageUrl);
					const textColor = typeof props.textColor === "string" ? props.textColor : "";
					const contentAlign = props.contentAlign === "center" ? "center" : "left";
					const titleClass = getTitleClass(props.titleSize, "hero");
					const buttonClass = getButtonClass(props.buttonVariant, props.buttonSize);
					const heroStyle = {
						...(backgroundColor ? { backgroundColor } : {}),
						...(backgroundImageUrl
							? {
									backgroundImage: `url(${backgroundImageUrl})`,
									backgroundSize: "cover",
									backgroundPosition: "center",
								}
							: {}),
						...(textColor ? { color: textColor } : {}),
					};
					const alignClass = contentAlign === "center" ? "items-center text-center" : "items-start text-left";
					return (
						<section className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-8">
							<div className={`flex flex-col ${alignClass}`} style={heroStyle}>
								{eyebrow ? (
									<p
										className="mb-2 text-sm text-muted-foreground"
										style={textColor ? { color: textColor, opacity: 0.85 } : undefined}
									>
										{eyebrow}
									</p>
								) : null}
								<h2 className={`${titleClass} font-semibold tracking-tight`}>{title || "主视觉标题"}</h2>
								{subtitle ? (
									<p
										className={`mt-4 max-w-2xl ${getBodyClass("md")} text-muted-foreground`}
										style={textColor ? { color: textColor, opacity: 0.9 } : undefined}
									>
										{subtitle}
									</p>
								) : null}
								{ctaLabel ? (
									<div className="mt-6">
										<span className={buttonClass}>
											{ctaLabel}
											{ctaHref ? <span className="ml-2 text-xs opacity-80">({ctaHref})</span> : null}
										</span>
									</div>
								) : null}
							</div>
						</section>
					);
				}

				if (section.type === "rich-text") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const body = typeof props.body === "string" ? props.body : "";
					const paragraphs = body
						.split(/\n{2,}/g)
						.map((part) => part.trim())
						.filter(Boolean)
						.slice(0, 3);

					return (
						<section className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{paragraphs.length ? (
								<div className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground">
									{paragraphs.map((paragraph) => (
										<p key={paragraph}>{paragraph}</p>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">尚未配置富文本内容。</p>
							)}
						</section>
					);
				}

				if (section.type === "heading") {
					const eyebrow = typeof props.eyebrow === "string" ? props.eyebrow : "";
					const title = typeof props.title === "string" ? props.title : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					const titleClass = getTitleClass(props.titleSize, "container");
					const textColor = typeof props.textColor === "string" ? props.textColor : "";
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							<div className="flex flex-col items-start text-left">
								{eyebrow ? (
									<p
										className="mb-2 text-sm text-muted-foreground"
										style={textColor ? { color: textColor, opacity: 0.85 } : undefined}
									>
										{eyebrow}
									</p>
								) : null}
								<h3 className={`${titleClass} font-semibold tracking-tight`}>{title || "标题区块"}</h3>
								{subtitle ? <p className="mt-3 max-w-3xl text-muted-foreground">{subtitle}</p> : null}
								{ctaLabel ? (
									<div className="mt-5">
										<span className={getButtonClass("solid", "md")}>
											{ctaLabel}
											{ctaHref ? <span className="ml-2 text-xs opacity-80">({ctaHref})</span> : null}
										</span>
									</div>
								) : null}
							</div>
						</section>
					);
				}

				if (section.type === "image-banner") {
					const eyebrow = typeof props.eyebrow === "string" ? props.eyebrow : "";
					const heading = typeof props.heading === "string" ? props.heading : "";
					const body = typeof props.body === "string" ? props.body : "";
					const imageUrl = resolveBuilderBackgroundImageUrl(props.imageUrl);
					const imageAlt = typeof props.imageAlt === "string" ? props.imageAlt : "";
					const imageFit = props.imageFit === "contain" ? "object-contain bg-muted/30" : "object-cover";
					const imagePosition =
						props.imagePosition === "left" || props.imagePosition === "top" ? props.imagePosition : "right";
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					const isTopImage = imagePosition === "top";
					const isImageFirst = imagePosition === "left" || imagePosition === "top";
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							<div
								className={isTopImage ? "flex flex-col gap-4" : "grid gap-4 md:grid-cols-2 md:items-center"}
							>
								{isImageFirst ? (
									<div className="overflow-hidden rounded-xl border border-border bg-background">
										{imageUrl ? (
											<img
												src={imageUrl}
												alt={imageAlt || heading || "banner"}
												className={`h-52 w-full ${imageFit}`}
												loading="lazy"
											/>
										) : (
											<div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
												请上传横幅图片
											</div>
										)}
									</div>
								) : null}
								<div className="flex flex-col items-start text-left">
									{eyebrow ? <p className="mb-2 text-sm text-muted-foreground">{eyebrow}</p> : null}
									{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
									{body ? <p className="mt-3 text-sm text-muted-foreground">{body}</p> : null}
									{ctaLabel ? (
										<div className="mt-5">
											<span className={getButtonClass("solid", "md")}>
												{ctaLabel}
												{ctaHref ? <span className="ml-2 text-xs opacity-80">({ctaHref})</span> : null}
											</span>
										</div>
									) : null}
								</div>
								{!isImageFirst ? (
									<div className="overflow-hidden rounded-xl border border-border bg-background">
										{imageUrl ? (
											<img
												src={imageUrl}
												alt={imageAlt || heading || "banner"}
												className={`h-52 w-full ${imageFit}`}
												loading="lazy"
											/>
										) : (
											<div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
												请上传横幅图片
											</div>
										)}
									</div>
								) : null}
							</div>
						</section>
					);
				}

				if (section.type === "icon-list") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = normalizeColumnCount(props.columns);
					const gridClass =
						columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
					const items = [
						{
							icon: typeof props.item1Icon === "string" ? props.item1Icon : "",
							title: typeof props.item1Title === "string" ? props.item1Title : "",
							description: typeof props.item1Description === "string" ? props.item1Description : "",
						},
						{
							icon: typeof props.item2Icon === "string" ? props.item2Icon : "",
							title: typeof props.item2Title === "string" ? props.item2Title : "",
							description: typeof props.item2Description === "string" ? props.item2Description : "",
						},
						{
							icon: typeof props.item3Icon === "string" ? props.item3Icon : "",
							title: typeof props.item3Title === "string" ? props.item3Title : "",
							description: typeof props.item3Description === "string" ? props.item3Description : "",
						},
						{
							icon: typeof props.item4Icon === "string" ? props.item4Icon : "",
							title: typeof props.item4Title === "string" ? props.item4Title : "",
							description: typeof props.item4Description === "string" ? props.item4Description : "",
						},
					].filter((item) => item.title || item.description || item.icon);

					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{items.length ? (
								<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
									{items.map((item, index) => (
										<div
											key={`${item.title}-${index}`}
											className="rounded-xl border border-border bg-background p-4"
										>
											<div className="text-2xl">{item.icon || "⭐"}</div>
											{item.title ? <p className="mt-2 font-medium">{item.title}</p> : null}
											{item.description ? (
												<p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
											) : null}
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个卖点标题。</p>
							)}
						</section>
					);
				}

				if (section.type === "faq-accordion") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const pairs = [
						{
							question: typeof props.q1Question === "string" ? props.q1Question : "",
							answer: typeof props.q1Answer === "string" ? props.q1Answer : "",
						},
						{
							question: typeof props.q2Question === "string" ? props.q2Question : "",
							answer: typeof props.q2Answer === "string" ? props.q2Answer : "",
						},
						{
							question: typeof props.q3Question === "string" ? props.q3Question : "",
							answer: typeof props.q3Answer === "string" ? props.q3Answer : "",
						},
						{
							question: typeof props.q4Question === "string" ? props.q4Question : "",
							answer: typeof props.q4Answer === "string" ? props.q4Answer : "",
						},
						{
							question: typeof props.q5Question === "string" ? props.q5Question : "",
							answer: typeof props.q5Answer === "string" ? props.q5Answer : "",
						},
					].filter((item) => item.question || item.answer);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{pairs.length ? (
								<div className="mt-5 space-y-3">
									{pairs.map((pair, index) => (
										<details
											key={`${pair.question}-${index}`}
											className="rounded-lg border border-border bg-background px-4 py-3"
										>
											<summary className="cursor-pointer font-medium">
												{pair.question || `问题 ${index + 1}`}
											</summary>
											{pair.answer ? (
												<p className="mt-2 text-sm text-muted-foreground">{pair.answer}</p>
											) : null}
										</details>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请先填写至少一组问题/回答。</p>
							)}
						</section>
					);
				}

				if (section.type === "featured-collections") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = normalizeColumnCount(props.columns);
					const gridClass =
						columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
					const slugs = [
						typeof props.collectionSlug1 === "string" ? props.collectionSlug1.trim() : "",
						typeof props.collectionSlug2 === "string" ? props.collectionSlug2.trim() : "",
						typeof props.collectionSlug3 === "string" ? props.collectionSlug3.trim() : "",
						typeof props.collectionSlug4 === "string" ? props.collectionSlug4.trim() : "",
					].filter(Boolean);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{slugs.length ? (
								<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
									{slugs.map((slug) => (
										<div key={slug} className="rounded-xl border border-border bg-background p-4">
											<p className="text-sm text-muted-foreground">Collection</p>
											<p className="mt-1 font-medium">{slug}</p>
											<p className="mt-2 text-xs text-muted-foreground">/{slug}</p>
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少选择 1 个集合。</p>
							)}
						</section>
					);
				}

				if (section.type === "promo-banner") {
					const eyebrow = typeof props.eyebrow === "string" ? props.eyebrow : "";
					const title = typeof props.title === "string" ? props.title : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const badgeText = typeof props.badgeText === "string" ? props.badgeText : "";
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					const secondaryCtaLabel =
						typeof props.secondaryCtaLabel === "string" ? props.secondaryCtaLabel : "";
					const secondaryCtaHref = typeof props.secondaryCtaHref === "string" ? props.secondaryCtaHref : "";
					const scheduleMode = props.scheduleMode === "window" ? "window" : "always";
					const scheduleStartIso = typeof props.scheduleStartIso === "string" ? props.scheduleStartIso : "";
					const scheduleEndIso = typeof props.scheduleEndIso === "string" ? props.scheduleEndIso : "";
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							<div className="flex items-center justify-between gap-4">
								<div className="flex-1">
									{eyebrow ? <p className="text-sm text-muted-foreground">{eyebrow}</p> : null}
									{title ? <h3 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h3> : null}
									{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
								</div>
								{badgeText ? (
									<span className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
										{badgeText}
									</span>
								) : null}
							</div>
							<div className="mt-4 flex flex-wrap gap-3">
								{ctaLabel ? (
									<span className={getButtonClass("solid", "md")}>
										{ctaLabel}
										{ctaHref ? <span className="ml-2 text-xs opacity-80">({ctaHref})</span> : null}
									</span>
								) : null}
								{secondaryCtaLabel ? (
									<span className={getButtonClass("outline", "md")}>
										{secondaryCtaLabel}
										{secondaryCtaHref ? (
											<span className="ml-2 text-xs opacity-80">({secondaryCtaHref})</span>
										) : null}
									</span>
								) : null}
							</div>
							<p className="mt-4 text-xs text-muted-foreground">
								展示时段：{scheduleMode === "window" ? "按时间窗口" : "总是显示"}
								{scheduleMode === "window" && (scheduleStartIso || scheduleEndIso)
									? `（${scheduleStartIso || "未设置开始"} ~ ${scheduleEndIso || "未设置结束"}）`
									: ""}
							</p>
						</section>
					);
				}

				if (section.type === "testimonials") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = normalizeColumnCount(props.columns);
					const gridClass =
						columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
					const items = [
						{
							quote: typeof props.item1Quote === "string" ? props.item1Quote : "",
							author: typeof props.item1Author === "string" ? props.item1Author : "",
							role: typeof props.item1Role === "string" ? props.item1Role : "",
							avatarUrl: resolveBuilderBackgroundImageUrl(props.item1AvatarUrl),
						},
						{
							quote: typeof props.item2Quote === "string" ? props.item2Quote : "",
							author: typeof props.item2Author === "string" ? props.item2Author : "",
							role: typeof props.item2Role === "string" ? props.item2Role : "",
							avatarUrl: resolveBuilderBackgroundImageUrl(props.item2AvatarUrl),
						},
						{
							quote: typeof props.item3Quote === "string" ? props.item3Quote : "",
							author: typeof props.item3Author === "string" ? props.item3Author : "",
							role: typeof props.item3Role === "string" ? props.item3Role : "",
							avatarUrl: resolveBuilderBackgroundImageUrl(props.item3AvatarUrl),
						},
					].filter((item) => item.quote || item.author || item.role);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{items.length ? (
								<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
									{items.map((item, index) => (
										<div
											key={`${item.author}-${index}`}
											className="rounded-xl border border-border bg-background p-4"
										>
											<p className="text-sm leading-6 text-muted-foreground">
												“{item.quote || "客户评价内容"}”
											</p>
											<div className="mt-4 flex items-center gap-3">
												<div className="h-9 w-9 overflow-hidden rounded-full border border-border bg-muted">
													{item.avatarUrl ? (
														<img
															src={item.avatarUrl}
															alt={item.author || "avatar"}
															className="h-full w-full object-cover"
															loading="lazy"
														/>
													) : null}
												</div>
												<div>
													<p className="text-sm font-medium">{item.author || "匿名客户"}</p>
													{item.role ? <p className="text-xs text-muted-foreground">{item.role}</p> : null}
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 条评价。</p>
							)}
						</section>
					);
				}

				if (section.type === "store-policies") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = normalizeColumnCount(props.columns);
					const gridClass =
						columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
					const items = [
						{
							label: typeof props.policy1Label === "string" ? props.policy1Label : "",
							href: typeof props.policy1Href === "string" ? props.policy1Href : "",
							description: typeof props.policy1Description === "string" ? props.policy1Description : "",
						},
						{
							label: typeof props.policy2Label === "string" ? props.policy2Label : "",
							href: typeof props.policy2Href === "string" ? props.policy2Href : "",
							description: typeof props.policy2Description === "string" ? props.policy2Description : "",
						},
						{
							label: typeof props.policy3Label === "string" ? props.policy3Label : "",
							href: typeof props.policy3Href === "string" ? props.policy3Href : "",
							description: typeof props.policy3Description === "string" ? props.policy3Description : "",
						},
						{
							label: typeof props.policy4Label === "string" ? props.policy4Label : "",
							href: typeof props.policy4Href === "string" ? props.policy4Href : "",
							description: typeof props.policy4Description === "string" ? props.policy4Description : "",
						},
					].filter((item) => item.label || item.description || item.href);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{items.length ? (
								<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
									{items.map((item, index) => (
										<div
											key={`${item.label}-${index}`}
											className="rounded-xl border border-border bg-background p-4"
										>
											<p className="font-medium">{item.label || `政策 ${index + 1}`}</p>
											{item.description ? (
												<p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
											) : null}
											{item.href ? <p className="mt-2 text-xs text-muted-foreground">{item.href}</p> : null}
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个政策入口。</p>
							)}
						</section>
					);
				}

				if (section.type === "category-grid") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = normalizeColumnCount(props.columns);
					const gridClass =
						columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
					const entries = [
						{
							slug: typeof props.categorySlug1 === "string" ? props.categorySlug1.trim() : "",
							label: typeof props.categoryLabel1 === "string" ? props.categoryLabel1 : "",
						},
						{
							slug: typeof props.categorySlug2 === "string" ? props.categorySlug2.trim() : "",
							label: typeof props.categoryLabel2 === "string" ? props.categoryLabel2 : "",
						},
						{
							slug: typeof props.categorySlug3 === "string" ? props.categorySlug3.trim() : "",
							label: typeof props.categoryLabel3 === "string" ? props.categoryLabel3 : "",
						},
						{
							slug: typeof props.categorySlug4 === "string" ? props.categorySlug4.trim() : "",
							label: typeof props.categoryLabel4 === "string" ? props.categoryLabel4 : "",
						},
						{
							slug: typeof props.categorySlug5 === "string" ? props.categorySlug5.trim() : "",
							label: typeof props.categoryLabel5 === "string" ? props.categoryLabel5 : "",
						},
						{
							slug: typeof props.categorySlug6 === "string" ? props.categorySlug6.trim() : "",
							label: typeof props.categoryLabel6 === "string" ? props.categoryLabel6 : "",
						},
					].filter((item) => item.slug || item.label);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{entries.length ? (
								<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
									{entries.map((entry, index) => (
										<div
											key={`${entry.slug}-${index}`}
											className="rounded-xl border border-border bg-background p-4"
										>
											<p className="text-xs uppercase tracking-wide text-muted-foreground">Category</p>
											<p className="mt-1 font-medium">{entry.label || entry.slug}</p>
											{entry.slug ? (
												<p className="mt-2 text-xs text-muted-foreground">/{entry.slug}</p>
											) : null}
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个分类入口。</p>
							)}
						</section>
					);
				}

				if (section.type === "product-spotlight") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const badgeText = typeof props.badgeText === "string" ? props.badgeText : "";
					const productSlug = typeof props.productSlug === "string" ? props.productSlug : "";
					const productName = typeof props.productName === "string" ? props.productName : "";
					const priceText = typeof props.priceText === "string" ? props.priceText : "";
					const imageUrl = resolveBuilderBackgroundImageUrl(props.imageUrl);
					const imageAlt = typeof props.imageAlt === "string" ? props.imageAlt : "";
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-5 grid gap-4 md:grid-cols-2 md:items-center">
								<div className="overflow-hidden rounded-xl border border-border bg-background">
									{imageUrl ? (
										<img
											src={imageUrl}
											alt={imageAlt || productName || "spotlight"}
											className="h-64 w-full object-cover"
											loading="lazy"
										/>
									) : (
										<div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
											请上传主推商品图片
										</div>
									)}
								</div>
								<div>
									{badgeText ? (
										<span className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
											{badgeText}
										</span>
									) : null}
									<p className="mt-3 text-xl font-semibold">{productName || "主推商品名称"}</p>
									{priceText ? <p className="mt-2 text-sm text-muted-foreground">{priceText}</p> : null}
									{productSlug ? (
										<p className="mt-2 text-xs text-muted-foreground">slug: {productSlug}</p>
									) : null}
									{ctaLabel ? (
										<div className="mt-5">
											<span className={getButtonClass("solid", "md")}>
												{ctaLabel}
												{ctaHref ? <span className="ml-2 text-xs opacity-80">({ctaHref})</span> : null}
											</span>
										</div>
									) : null}
								</div>
							</div>
						</section>
					);
				}

				if (section.type === "countdown") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const targetIso = typeof props.targetIso === "string" ? props.targetIso : "";
					const timezoneLabel = typeof props.timezoneLabel === "string" ? props.timezoneLabel : "";
					const expiredMessage =
						typeof props.expiredMessage === "string" ? props.expiredMessage : "活动已结束";
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					const now = Date.now();
					const target = Date.parse(targetIso);
					const validTarget = Number.isFinite(target);
					const diff = validTarget ? Math.max(0, target - now) : 0;
					const totalSeconds = Math.floor(diff / 1000);
					const days = Math.floor(totalSeconds / 86400);
					const hours = Math.floor((totalSeconds % 86400) / 3600);
					const minutes = Math.floor((totalSeconds % 3600) / 60);
					const isExpired = validTarget ? target <= now : false;
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-5 rounded-xl border border-border bg-background p-5 text-center">
								{validTarget ? (
									isExpired ? (
										<p className="text-xl font-medium">{expiredMessage}</p>
									) : (
										<p className="text-2xl font-semibold tabular-nums">
											{days}天 {hours}小时 {minutes}分钟
										</p>
									)
								) : (
									<p className="text-sm text-muted-foreground">请填写有效的目标时间（ISO 格式）</p>
								)}
								{timezoneLabel ? (
									<p className="mt-2 text-xs text-muted-foreground">时区：{timezoneLabel}</p>
								) : null}
							</div>
							{ctaLabel ? (
								<div className="mt-5">
									<span className={getButtonClass("solid", "md")}>
										{ctaLabel}
										{ctaHref ? <span className="ml-2 text-xs opacity-80">({ctaHref})</span> : null}
									</span>
								</div>
							) : null}
						</section>
					);
				}

				if (section.type === "featured-categories-auto") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const mode = props.mode === "manual" ? "manual" : "auto";
					const autoLimitRaw =
						typeof props.autoLimit === "number" ? props.autoLimit : Number(props.autoLimit || 6);
					const autoLimit = Number.isFinite(autoLimitRaw)
						? Math.max(2, Math.min(12, Math.floor(autoLimitRaw)))
						: 6;
					const columns = normalizeColumnCount(props.columns);
					const gridClass =
						columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
					const manualEntries = [
						{
							slug: typeof props.manualCategorySlug1 === "string" ? props.manualCategorySlug1.trim() : "",
							label: typeof props.manualCategoryLabel1 === "string" ? props.manualCategoryLabel1 : "",
						},
						{
							slug: typeof props.manualCategorySlug2 === "string" ? props.manualCategorySlug2.trim() : "",
							label: typeof props.manualCategoryLabel2 === "string" ? props.manualCategoryLabel2 : "",
						},
						{
							slug: typeof props.manualCategorySlug3 === "string" ? props.manualCategorySlug3.trim() : "",
							label: typeof props.manualCategoryLabel3 === "string" ? props.manualCategoryLabel3 : "",
						},
						{
							slug: typeof props.manualCategorySlug4 === "string" ? props.manualCategorySlug4.trim() : "",
							label: typeof props.manualCategoryLabel4 === "string" ? props.manualCategoryLabel4 : "",
						},
						{
							slug: typeof props.manualCategorySlug5 === "string" ? props.manualCategorySlug5.trim() : "",
							label: typeof props.manualCategoryLabel5 === "string" ? props.manualCategoryLabel5 : "",
						},
						{
							slug: typeof props.manualCategorySlug6 === "string" ? props.manualCategorySlug6.trim() : "",
							label: typeof props.manualCategoryLabel6 === "string" ? props.manualCategoryLabel6 : "",
						},
					].filter((item) => item.slug || item.label);
					const displayEntries =
						mode === "manual"
							? manualEntries
							: Array.from({ length: autoLimit }).map((_, index) => ({
									slug: `auto-category-${index + 1}`,
									label: `自动分类 ${index + 1}`,
								}));
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<p className="mt-3 text-xs text-muted-foreground">
								模式：{mode === "manual" ? "手动" : "自动"}（数量：
								{mode === "manual" ? manualEntries.length : autoLimit}）
							</p>
							<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
								{displayEntries.map((entry, index) => (
									<div
										key={`${entry.slug}-${index}`}
										className="rounded-xl border border-border bg-background p-4"
									>
										<p className="font-medium">{entry.label || entry.slug}</p>
										<p className="mt-1 text-xs text-muted-foreground">{entry.slug}</p>
									</div>
								))}
							</div>
						</section>
					);
				}

				if (section.type === "logo-cloud") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = normalizeColumnCount(props.columns);
					const gridClass =
						columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
					const logos = [
						{
							url: resolveBuilderBackgroundImageUrl(props.logo1Url),
							alt: typeof props.logo1Alt === "string" ? props.logo1Alt : "logo1",
						},
						{
							url: resolveBuilderBackgroundImageUrl(props.logo2Url),
							alt: typeof props.logo2Alt === "string" ? props.logo2Alt : "logo2",
						},
						{
							url: resolveBuilderBackgroundImageUrl(props.logo3Url),
							alt: typeof props.logo3Alt === "string" ? props.logo3Alt : "logo3",
						},
						{
							url: resolveBuilderBackgroundImageUrl(props.logo4Url),
							alt: typeof props.logo4Alt === "string" ? props.logo4Alt : "logo4",
						},
						{
							url: resolveBuilderBackgroundImageUrl(props.logo5Url),
							alt: typeof props.logo5Alt === "string" ? props.logo5Alt : "logo5",
						},
						{
							url: resolveBuilderBackgroundImageUrl(props.logo6Url),
							alt: typeof props.logo6Alt === "string" ? props.logo6Alt : "logo6",
						},
					].filter((item) => item.url);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{logos.length ? (
								<div className={`mt-5 grid grid-cols-2 gap-4 ${gridClass}`}>
									{logos.map((logo, index) => (
										<div
											key={`${logo.alt}-${index}`}
											className="flex items-center justify-center rounded-xl border border-border bg-background p-4"
										>
											<img
												src={logo.url}
												alt={logo.alt || "logo"}
												className="h-12 w-auto object-contain"
												loading="lazy"
											/>
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少上传 1 张 Logo 图片。</p>
							)}
						</section>
					);
				}

				if (section.type === "timeline-steps") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const steps = [
						{
							title: typeof props.step1Title === "string" ? props.step1Title : "",
							description: typeof props.step1Description === "string" ? props.step1Description : "",
						},
						{
							title: typeof props.step2Title === "string" ? props.step2Title : "",
							description: typeof props.step2Description === "string" ? props.step2Description : "",
						},
						{
							title: typeof props.step3Title === "string" ? props.step3Title : "",
							description: typeof props.step3Description === "string" ? props.step3Description : "",
						},
						{
							title: typeof props.step4Title === "string" ? props.step4Title : "",
							description: typeof props.step4Description === "string" ? props.step4Description : "",
						},
					].filter((step) => step.title || step.description);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{steps.length ? (
								<ol className="mt-5 space-y-3">
									{steps.map((step, index) => (
										<li
											key={`${step.title}-${index}`}
											className="rounded-xl border border-border bg-background px-4 py-3"
										>
											<p className="text-xs text-muted-foreground">步骤 {index + 1}</p>
											<p className="mt-1 font-medium">{step.title || `步骤 ${index + 1}`}</p>
											{step.description ? (
												<p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
											) : null}
										</li>
									))}
								</ol>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个步骤。</p>
							)}
						</section>
					);
				}

				if (section.type === "collection-hero") {
					const eyebrow = typeof props.eyebrow === "string" ? props.eyebrow : "";
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const collectionSlug = typeof props.collectionSlug === "string" ? props.collectionSlug : "";
					const collectionLabel = typeof props.collectionLabel === "string" ? props.collectionLabel : "";
					const backgroundImageUrl = resolveBuilderBackgroundImageUrl(props.backgroundImageUrl);
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							<div
								className="rounded-xl border border-border p-6"
								style={
									backgroundImageUrl
										? {
												backgroundImage: `url(${backgroundImageUrl})`,
												backgroundSize: "cover",
												backgroundPosition: "center",
											}
										: undefined
								}
							>
								{eyebrow ? <p className="text-sm text-muted-foreground">{eyebrow}</p> : null}
								{heading ? <h3 className="mt-1 text-2xl font-semibold tracking-tight">{heading}</h3> : null}
								{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
								<p className="mt-3 text-xs text-muted-foreground">
									合集：{collectionLabel || collectionSlug || "未设置"}
								</p>
								{ctaLabel ? (
									<div className="mt-5">
										<span className={getButtonClass("solid", "md")}>
											{ctaLabel}
											{ctaHref ? <span className="ml-2 text-xs opacity-80">({ctaHref})</span> : null}
										</span>
									</div>
								) : null}
							</div>
						</section>
					);
				}

				if (section.type === "contact-quick-actions") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = normalizeColumnCount(props.columns);
					const gridClass =
						columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
					const actions = [
						{
							label: typeof props.action1Label === "string" ? props.action1Label : "",
							value: typeof props.action1Value === "string" ? props.action1Value : "",
							href: typeof props.action1Href === "string" ? props.action1Href : "",
							description: typeof props.action1Description === "string" ? props.action1Description : "",
						},
						{
							label: typeof props.action2Label === "string" ? props.action2Label : "",
							value: typeof props.action2Value === "string" ? props.action2Value : "",
							href: typeof props.action2Href === "string" ? props.action2Href : "",
							description: typeof props.action2Description === "string" ? props.action2Description : "",
						},
						{
							label: typeof props.action3Label === "string" ? props.action3Label : "",
							value: typeof props.action3Value === "string" ? props.action3Value : "",
							href: typeof props.action3Href === "string" ? props.action3Href : "",
							description: typeof props.action3Description === "string" ? props.action3Description : "",
						},
						{
							label: typeof props.action4Label === "string" ? props.action4Label : "",
							value: typeof props.action4Value === "string" ? props.action4Value : "",
							href: typeof props.action4Href === "string" ? props.action4Href : "",
							description: typeof props.action4Description === "string" ? props.action4Description : "",
						},
					].filter((action) => action.label || action.value || action.href || action.description);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{actions.length ? (
								<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
									{actions.map((action, index) => (
										<div
											key={`${action.label}-${index}`}
											className="rounded-xl border border-border bg-background p-4"
										>
											<p className="font-medium">{action.label || `入口 ${index + 1}`}</p>
											{action.value ? (
												<p className="mt-1 text-sm text-muted-foreground">{action.value}</p>
											) : null}
											{action.description ? (
												<p className="mt-1 text-xs text-muted-foreground">{action.description}</p>
											) : null}
											{action.href ? (
												<p className="mt-2 text-xs text-muted-foreground">{action.href}</p>
											) : null}
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个联系入口。</p>
							)}
						</section>
					);
				}

				if (section.type === "stats-counter") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = normalizeColumnCount(props.columns);
					const gridClass =
						columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
					const stats = [
						{
							label: typeof props.item1Label === "string" ? props.item1Label : "",
							value: typeof props.item1Value === "string" ? props.item1Value : "",
							suffix: typeof props.item1Suffix === "string" ? props.item1Suffix : "",
						},
						{
							label: typeof props.item2Label === "string" ? props.item2Label : "",
							value: typeof props.item2Value === "string" ? props.item2Value : "",
							suffix: typeof props.item2Suffix === "string" ? props.item2Suffix : "",
						},
						{
							label: typeof props.item3Label === "string" ? props.item3Label : "",
							value: typeof props.item3Value === "string" ? props.item3Value : "",
							suffix: typeof props.item3Suffix === "string" ? props.item3Suffix : "",
						},
						{
							label: typeof props.item4Label === "string" ? props.item4Label : "",
							value: typeof props.item4Value === "string" ? props.item4Value : "",
							suffix: typeof props.item4Suffix === "string" ? props.item4Suffix : "",
						},
					].filter((item) => item.label || item.value || item.suffix);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{stats.length ? (
								<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
									{stats.map((item, index) => (
										<div
											key={`${item.label}-${index}`}
											className="rounded-xl border border-border bg-background p-4 text-center"
										>
											<p className="text-2xl font-semibold tabular-nums">
												{item.value || "0"}
												{item.suffix || ""}
											</p>
											<p className="mt-1 text-xs text-muted-foreground">
												{item.label || `指标 ${index + 1}`}
											</p>
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个指标。</p>
							)}
						</section>
					);
				}

				if (section.type === "featured-products") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const collectionSlug = typeof props.collectionSlug === "string" ? props.collectionSlug : "";
					const limit = typeof props.limit === "number" ? props.limit : Number(props.limit || 0) || 12;

					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							<div className="flex flex-wrap items-baseline justify-between gap-2">
								<h3 className="text-2xl font-semibold tracking-tight">{heading || "精选商品"}</h3>
								<p className="text-xs text-muted-foreground">
									合集：<span className="font-medium">{collectionSlug || "featured-products"}</span> ·
									数量上限： <span className="font-medium">{Math.max(1, Math.min(48, limit))}</span>
								</p>
							</div>
							<div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
								{Array.from({ length: 6 }).map((_, index) => (
									<div key={index} className="rounded-xl border border-border bg-background p-4">
										<div className="mb-3 aspect-[3/4] w-full rounded-lg bg-muted" />
										<div className="h-4 w-3/4 rounded bg-muted" />
										<div className="mt-2 h-4 w-1/2 rounded bg-muted" />
									</div>
								))}
							</div>
							<p className="mt-4 text-xs text-muted-foreground">
								仅为编辑预览。请使用<span className="font-medium">“打开草稿预览”</span>查看真实 Saleor 数据。
							</p>
						</section>
					);
				}

				if (section.type === "card-grid") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = normalizeColumnCount(props.columns);
					const gridClass =
						columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
					const cards = [
						{
							title: typeof props.card1Title === "string" ? props.card1Title : "",
							body: typeof props.card1Body === "string" ? props.card1Body : "",
							ctaLabel: typeof props.card1CtaLabel === "string" ? props.card1CtaLabel : "",
							ctaHref: typeof props.card1CtaHref === "string" ? props.card1CtaHref : "",
						},
						{
							title: typeof props.card2Title === "string" ? props.card2Title : "",
							body: typeof props.card2Body === "string" ? props.card2Body : "",
							ctaLabel: typeof props.card2CtaLabel === "string" ? props.card2CtaLabel : "",
							ctaHref: typeof props.card2CtaHref === "string" ? props.card2CtaHref : "",
						},
						{
							title: typeof props.card3Title === "string" ? props.card3Title : "",
							body: typeof props.card3Body === "string" ? props.card3Body : "",
							ctaLabel: typeof props.card3CtaLabel === "string" ? props.card3CtaLabel : "",
							ctaHref: typeof props.card3CtaHref === "string" ? props.card3CtaHref : "",
						},
						{
							title: typeof props.card4Title === "string" ? props.card4Title : "",
							body: typeof props.card4Body === "string" ? props.card4Body : "",
							ctaLabel: typeof props.card4CtaLabel === "string" ? props.card4CtaLabel : "",
							ctaHref: typeof props.card4CtaHref === "string" ? props.card4CtaHref : "",
						},
						{
							title: typeof props.card5Title === "string" ? props.card5Title : "",
							body: typeof props.card5Body === "string" ? props.card5Body : "",
							ctaLabel: typeof props.card5CtaLabel === "string" ? props.card5CtaLabel : "",
							ctaHref: typeof props.card5CtaHref === "string" ? props.card5CtaHref : "",
						},
						{
							title: typeof props.card6Title === "string" ? props.card6Title : "",
							body: typeof props.card6Body === "string" ? props.card6Body : "",
							ctaLabel: typeof props.card6CtaLabel === "string" ? props.card6CtaLabel : "",
							ctaHref: typeof props.card6CtaHref === "string" ? props.card6CtaHref : "",
						},
					].filter((item) => item.title || item.body || item.ctaLabel || item.ctaHref);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{cards.length ? (
								<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
									{cards.map((item, index) => (
										<div
											key={`${item.title}-${index}`}
											className="rounded-xl border border-border bg-background p-4"
										>
											<p className="font-medium">{item.title || `卡片 ${index + 1}`}</p>
											{item.body ? <p className="mt-2 text-sm text-muted-foreground">{item.body}</p> : null}
											{item.ctaLabel ? (
												<p className="mt-3 text-xs font-medium text-primary">
													{item.ctaLabel}
													{item.ctaHref ? <span className="ml-1 opacity-80">({item.ctaHref})</span> : null}
												</p>
											) : null}
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 张卡片。</p>
							)}
						</section>
					);
				}

				if (section.type === "newsletter-signup") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const inputPlaceholder = typeof props.inputPlaceholder === "string" ? props.inputPlaceholder : "";
					const buttonLabel = typeof props.buttonLabel === "string" ? props.buttonLabel : "";
					const privacyNote = typeof props.privacyNote === "string" ? props.privacyNote : "";
					const actionHref = typeof props.actionHref === "string" ? props.actionHref : "";
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-5 flex flex-col gap-3 md:flex-row">
								<input
									type="email"
									disabled
									value=""
									placeholder={inputPlaceholder || "请输入邮箱地址"}
									className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground"
								/>
								<span className={`${getButtonClass("solid", "md")} whitespace-nowrap`}>
									{buttonLabel || "立即订阅"}
								</span>
							</div>
							{privacyNote ? <p className="mt-3 text-xs text-muted-foreground">{privacyNote}</p> : null}
							{actionHref ? (
								<p className="mt-1 text-xs text-muted-foreground">提交后跳转：{actionHref}</p>
							) : null}
						</section>
					);
				}

				if (section.type === "video-embed") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const videoUrl = typeof props.videoUrl === "string" ? props.videoUrl : "";
					const posterImageUrl = resolveBuilderBackgroundImageUrl(props.posterImageUrl);
					const aspectRatio =
						props.aspectRatio === "4-3" || props.aspectRatio === "1-1" ? props.aspectRatio : "16-9";
					const ratioClass =
						aspectRatio === "4-3" ? "aspect-[4/3]" : aspectRatio === "1-1" ? "aspect-square" : "aspect-video";
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div
								className={`mt-5 overflow-hidden rounded-xl border border-border bg-background ${ratioClass}`}
							>
								{videoUrl ? (
									<video
										className="h-full w-full object-cover"
										controls
										poster={posterImageUrl || undefined}
										src={videoUrl}
									/>
								) : posterImageUrl ? (
									<img
										src={posterImageUrl}
										alt="video poster"
										className="h-full w-full object-cover"
										loading="lazy"
									/>
								) : (
									<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
										请填写视频链接或上传封面图
									</div>
								)}
							</div>
						</section>
					);
				}

				if (section.type === "announcement-bar") {
					const message = typeof props.message === "string" ? props.message : "";
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					const scheduleMode = props.scheduleMode === "window" ? "window" : "always";
					const dismissMode = props.dismissMode === "fixed" ? "fixed" : "dismissible";
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-4">
							<div className="flex flex-wrap items-center justify-center gap-3 rounded-lg border border-border bg-accent px-4 py-3 text-sm">
								<span>{message || "请填写公告内容"}</span>
								{ctaLabel ? (
									<span className="inline-flex rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground">
										{ctaLabel}
										{ctaHref ? <span className="ml-1 opacity-80">({ctaHref})</span> : null}
									</span>
								) : null}
								{dismissMode === "dismissible" ? (
									<span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-border text-xs">
										×
									</span>
								) : null}
							</div>
							<p className="mt-2 text-xs text-muted-foreground">
								模式：{scheduleMode === "window" ? "时间窗口" : "一直显示"}
							</p>
						</section>
					);
				}

				if (section.type === "trust-badges") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = normalizeColumnCount(props.columns);
					const gridClass =
						columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
					const badges = [
						{
							icon: typeof props.badge1Icon === "string" ? props.badge1Icon : "",
							title: typeof props.badge1Title === "string" ? props.badge1Title : "",
							description: typeof props.badge1Description === "string" ? props.badge1Description : "",
						},
						{
							icon: typeof props.badge2Icon === "string" ? props.badge2Icon : "",
							title: typeof props.badge2Title === "string" ? props.badge2Title : "",
							description: typeof props.badge2Description === "string" ? props.badge2Description : "",
						},
						{
							icon: typeof props.badge3Icon === "string" ? props.badge3Icon : "",
							title: typeof props.badge3Title === "string" ? props.badge3Title : "",
							description: typeof props.badge3Description === "string" ? props.badge3Description : "",
						},
						{
							icon: typeof props.badge4Icon === "string" ? props.badge4Icon : "",
							title: typeof props.badge4Title === "string" ? props.badge4Title : "",
							description: typeof props.badge4Description === "string" ? props.badge4Description : "",
						},
						{
							icon: typeof props.badge5Icon === "string" ? props.badge5Icon : "",
							title: typeof props.badge5Title === "string" ? props.badge5Title : "",
							description: typeof props.badge5Description === "string" ? props.badge5Description : "",
						},
						{
							icon: typeof props.badge6Icon === "string" ? props.badge6Icon : "",
							title: typeof props.badge6Title === "string" ? props.badge6Title : "",
							description: typeof props.badge6Description === "string" ? props.badge6Description : "",
						},
					].filter((item) => item.icon || item.title || item.description);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{badges.length ? (
								<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
									{badges.map((badge, index) => (
										<div
											key={`${badge.title}-${index}`}
											className="rounded-xl border border-border bg-background p-4 text-center"
										>
											<p className="text-2xl">{badge.icon || "✅"}</p>
											<p className="mt-2 font-medium">{badge.title || `徽章 ${index + 1}`}</p>
											{badge.description ? (
												<p className="mt-1 text-sm text-muted-foreground">{badge.description}</p>
											) : null}
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个信任徽章。</p>
							)}
						</section>
					);
				}

				if (section.type === "contact-form-lite") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const namePlaceholder = typeof props.namePlaceholder === "string" ? props.namePlaceholder : "";
					const emailPlaceholder = typeof props.emailPlaceholder === "string" ? props.emailPlaceholder : "";
					const messagePlaceholder =
						typeof props.messagePlaceholder === "string" ? props.messagePlaceholder : "";
					const submitLabel = typeof props.submitLabel === "string" ? props.submitLabel : "";
					const actionHref = typeof props.actionHref === "string" ? props.actionHref : "";
					const privacyNote = typeof props.privacyNote === "string" ? props.privacyNote : "";
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-5 grid gap-3">
								<input
									type="text"
									disabled
									value=""
									placeholder={namePlaceholder || "你的姓名"}
									className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground"
								/>
								<input
									type="email"
									disabled
									value=""
									placeholder={emailPlaceholder || "你的邮箱"}
									className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground"
								/>
								<textarea
									disabled
									value=""
									placeholder={messagePlaceholder || "请描述你的需求..."}
									className="min-h-28 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
								/>
								<div className="inline-flex w-fit items-center">
									<span className={getButtonClass("solid", "md")}>{submitLabel || "提交咨询"}</span>
								</div>
							</div>
							{privacyNote ? <p className="mt-3 text-xs text-muted-foreground">{privacyNote}</p> : null}
							{actionHref ? (
								<p className="mt-1 text-xs text-muted-foreground">提交后跳转：{actionHref}</p>
							) : null}
						</section>
					);
				}

				if (section.type === "tabs-content") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const defaultTabRaw =
						typeof props.defaultTab === "number"
							? props.defaultTab
							: Number.parseInt(String(props.defaultTab ?? ""), 10);
					const defaultTab =
						defaultTabRaw === 2 || defaultTabRaw === 3 || defaultTabRaw === 4 ? defaultTabRaw : 1;
					const tabs = [
						{
							label: typeof props.tab1Label === "string" ? props.tab1Label : "",
							body: typeof props.tab1Body === "string" ? props.tab1Body : "",
						},
						{
							label: typeof props.tab2Label === "string" ? props.tab2Label : "",
							body: typeof props.tab2Body === "string" ? props.tab2Body : "",
						},
						{
							label: typeof props.tab3Label === "string" ? props.tab3Label : "",
							body: typeof props.tab3Body === "string" ? props.tab3Body : "",
						},
						{
							label: typeof props.tab4Label === "string" ? props.tab4Label : "",
							body: typeof props.tab4Body === "string" ? props.tab4Body : "",
						},
					].filter((item) => item.label || item.body);
					const active = tabs[Math.min(defaultTab - 1, Math.max(0, tabs.length - 1))];
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{tabs.length ? (
								<div className="mt-5 space-y-3">
									<div className="flex flex-wrap gap-2">
										{tabs.map((tab, tabIndex) => (
											<span
												key={`${tab.label || "tab"}-${tabIndex}`}
												className={`rounded-md px-3 py-1 text-sm ${
													tabIndex === Math.min(defaultTab - 1, tabs.length - 1)
														? "bg-primary text-primary-foreground"
														: "border border-border bg-background"
												}`}
											>
												{tab.label || `标签 ${tabIndex + 1}`}
											</span>
										))}
									</div>
									<div className="rounded-xl border border-border bg-background p-4">
										<p className="text-sm text-muted-foreground">{active?.body || "请填写标签内容。"}</p>
									</div>
									<p className="text-xs text-muted-foreground">移动端将自动以手风琴形式展示。</p>
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个标签内容。</p>
							)}
						</section>
					);
				}

				if (section.type === "before-after") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const layout = props.layout === "vertical" ? "vertical" : "horizontal";
					const beforeLabel = typeof props.beforeLabel === "string" ? props.beforeLabel : "";
					const beforeImageUrl = resolveBuilderBackgroundImageUrl(props.beforeImageUrl);
					const afterLabel = typeof props.afterLabel === "string" ? props.afterLabel : "";
					const afterImageUrl = resolveBuilderBackgroundImageUrl(props.afterImageUrl);
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div
								className={`mt-5 grid gap-4 ${
									layout === "vertical" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
								}`}
							>
								<div className="rounded-xl border border-border bg-background p-3">
									<p className="text-xs text-muted-foreground">{beforeLabel || "前"}</p>
									{beforeImageUrl ? (
										<img
											src={beforeImageUrl}
											alt="before"
											className="mt-2 h-48 w-full rounded-lg object-cover"
											loading="lazy"
										/>
									) : (
										<div className="mt-2 flex h-48 items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
											请上传前图
										</div>
									)}
								</div>
								<div className="rounded-xl border border-border bg-background p-3">
									<p className="text-xs text-muted-foreground">{afterLabel || "后"}</p>
									{afterImageUrl ? (
										<img
											src={afterImageUrl}
											alt="after"
											className="mt-2 h-48 w-full rounded-lg object-cover"
											loading="lazy"
										/>
									) : (
										<div className="mt-2 flex h-48 items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
											请上传后图
										</div>
									)}
								</div>
							</div>
							{ctaLabel ? (
								<p className="mt-4 text-xs font-medium text-primary">
									{ctaLabel}
									{ctaHref ? <span className="ml-1 opacity-80">({ctaHref})</span> : null}
								</p>
							) : null}
						</section>
					);
				}

				if (section.type === "social-proof-feed") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = normalizeColumnCount(props.columns);
					const gridClass =
						columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
					const items = [
						{
							quote: typeof props.item1Quote === "string" ? props.item1Quote : "",
							author: typeof props.item1Author === "string" ? props.item1Author : "",
							meta: typeof props.item1Meta === "string" ? props.item1Meta : "",
							imageUrl: resolveBuilderBackgroundImageUrl(props.item1ImageUrl),
						},
						{
							quote: typeof props.item2Quote === "string" ? props.item2Quote : "",
							author: typeof props.item2Author === "string" ? props.item2Author : "",
							meta: typeof props.item2Meta === "string" ? props.item2Meta : "",
							imageUrl: resolveBuilderBackgroundImageUrl(props.item2ImageUrl),
						},
						{
							quote: typeof props.item3Quote === "string" ? props.item3Quote : "",
							author: typeof props.item3Author === "string" ? props.item3Author : "",
							meta: typeof props.item3Meta === "string" ? props.item3Meta : "",
							imageUrl: resolveBuilderBackgroundImageUrl(props.item3ImageUrl),
						},
						{
							quote: typeof props.item4Quote === "string" ? props.item4Quote : "",
							author: typeof props.item4Author === "string" ? props.item4Author : "",
							meta: typeof props.item4Meta === "string" ? props.item4Meta : "",
							imageUrl: resolveBuilderBackgroundImageUrl(props.item4ImageUrl),
						},
					].filter((item) => item.quote || item.author || item.meta || item.imageUrl);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{items.length ? (
								<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
									{items.map((item, index) => (
										<div
											key={`${item.author}-${index}`}
											className="rounded-xl border border-border bg-background p-4"
										>
											<p className="text-sm">“{item.quote || "请填写评价内容"}”</p>
											<div className="mt-3 flex items-center gap-2">
												{item.imageUrl ? (
													<img
														src={item.imageUrl}
														alt={item.author || "avatar"}
														className="h-8 w-8 rounded-full object-cover"
														loading="lazy"
													/>
												) : (
													<div className="h-8 w-8 rounded-full bg-muted" />
												)}
												<div>
													<p className="text-xs font-medium">{item.author || `客户 ${index + 1}`}</p>
													{item.meta ? <p className="text-xs text-muted-foreground">{item.meta}</p> : null}
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 条客户评价。</p>
							)}
						</section>
					);
				}

				if (section.type === "faq-compact") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const faqItems = [
						{
							q: typeof props.q1 === "string" ? props.q1 : "",
							a: typeof props.a1 === "string" ? props.a1 : "",
						},
						{
							q: typeof props.q2 === "string" ? props.q2 : "",
							a: typeof props.a2 === "string" ? props.a2 : "",
						},
						{
							q: typeof props.q3 === "string" ? props.q3 : "",
							a: typeof props.a3 === "string" ? props.a3 : "",
						},
						{
							q: typeof props.q4 === "string" ? props.q4 : "",
							a: typeof props.a4 === "string" ? props.a4 : "",
						},
						{
							q: typeof props.q5 === "string" ? props.q5 : "",
							a: typeof props.a5 === "string" ? props.a5 : "",
						},
						{
							q: typeof props.q6 === "string" ? props.q6 : "",
							a: typeof props.a6 === "string" ? props.a6 : "",
						},
					].filter((item) => item.q || item.a);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{faqItems.length ? (
								<div className="mt-5 space-y-2">
									{faqItems.map((item, idx) => (
										<details
											key={`${item.q || "faq"}-${idx}`}
											className="rounded-lg border border-border bg-background"
										>
											<summary className="cursor-pointer px-3 py-2 text-sm font-medium">
												{item.q || `问题 ${idx + 1}`}
											</summary>
											<p className="px-3 pb-3 text-sm text-muted-foreground">
												{item.a || "请填写回答内容。"}
											</p>
										</details>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 条 FAQ。</p>
							)}
						</section>
					);
				}

				if (section.type === "metric-cards") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = normalizeColumnCount(props.columns);
					const gridClass =
						columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
					const metrics = [
						{
							icon: typeof props.item1Icon === "string" ? props.item1Icon : "",
							label: typeof props.item1Label === "string" ? props.item1Label : "",
							value: typeof props.item1Value === "string" ? props.item1Value : "",
							delta: typeof props.item1Delta === "string" ? props.item1Delta : "",
						},
						{
							icon: typeof props.item2Icon === "string" ? props.item2Icon : "",
							label: typeof props.item2Label === "string" ? props.item2Label : "",
							value: typeof props.item2Value === "string" ? props.item2Value : "",
							delta: typeof props.item2Delta === "string" ? props.item2Delta : "",
						},
						{
							icon: typeof props.item3Icon === "string" ? props.item3Icon : "",
							label: typeof props.item3Label === "string" ? props.item3Label : "",
							value: typeof props.item3Value === "string" ? props.item3Value : "",
							delta: typeof props.item3Delta === "string" ? props.item3Delta : "",
						},
						{
							icon: typeof props.item4Icon === "string" ? props.item4Icon : "",
							label: typeof props.item4Label === "string" ? props.item4Label : "",
							value: typeof props.item4Value === "string" ? props.item4Value : "",
							delta: typeof props.item4Delta === "string" ? props.item4Delta : "",
						},
						{
							icon: typeof props.item5Icon === "string" ? props.item5Icon : "",
							label: typeof props.item5Label === "string" ? props.item5Label : "",
							value: typeof props.item5Value === "string" ? props.item5Value : "",
							delta: typeof props.item5Delta === "string" ? props.item5Delta : "",
						},
						{
							icon: typeof props.item6Icon === "string" ? props.item6Icon : "",
							label: typeof props.item6Label === "string" ? props.item6Label : "",
							value: typeof props.item6Value === "string" ? props.item6Value : "",
							delta: typeof props.item6Delta === "string" ? props.item6Delta : "",
						},
					].filter((item) => item.icon || item.label || item.value || item.delta);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{metrics.length ? (
								<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
									{metrics.map((item, idx) => (
										<div
											key={`${item.label || "metric"}-${idx}`}
											className="rounded-xl border border-border bg-background p-4"
										>
											<p className="text-lg">{item.icon || "📈"}</p>
											<p className="mt-2 text-xs text-muted-foreground">{item.label || `指标 ${idx + 1}`}</p>
											<p className="mt-1 text-2xl font-semibold">{item.value || "-"}</p>
											{item.delta ? <p className="mt-1 text-xs text-primary">{item.delta}</p> : null}
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个指标。</p>
							)}
						</section>
					);
				}

				if (section.type === "media-text-split") {
					const eyebrow = typeof props.eyebrow === "string" ? props.eyebrow : "";
					const heading = typeof props.heading === "string" ? props.heading : "";
					const body = typeof props.body === "string" ? props.body : "";
					const layout = props.layout === "media-right" ? "media-right" : "media-left";
					const mediaType = props.mediaType === "video" ? "video" : "image";
					const imageUrl = resolveBuilderBackgroundImageUrl(props.imageUrl);
					const videoUrl = typeof props.videoUrl === "string" ? props.videoUrl : "";
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							<div
								className={`grid gap-4 ${
									layout === "media-right" ? "md:grid-cols-[1fr_1.1fr]" : "md:grid-cols-[1.1fr_1fr]"
								}`}
							>
								<div
									className={`${
										layout === "media-right" ? "md:order-2" : ""
									} rounded-xl border border-border bg-background p-3`}
								>
									{mediaType === "video" && videoUrl ? (
										<video className="aspect-video w-full rounded-lg object-cover" controls src={videoUrl} />
									) : imageUrl ? (
										<img
											src={imageUrl}
											alt="media"
											className="aspect-video w-full rounded-lg object-cover"
											loading="lazy"
										/>
									) : (
										<div className="flex aspect-video items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
											请上传图片或填写视频链接
										</div>
									)}
								</div>
								<div
									className={`${layout === "media-right" ? "md:order-1" : ""} flex flex-col justify-center`}
								>
									{eyebrow ? <p className="text-xs text-muted-foreground">{eyebrow}</p> : null}
									{heading ? <h3 className="mt-1 text-2xl font-semibold tracking-tight">{heading}</h3> : null}
									{body ? <p className="mt-2 text-sm text-muted-foreground">{body}</p> : null}
									{ctaLabel ? (
										<p className="mt-4 text-xs font-medium text-primary">
											{ctaLabel}
											{ctaHref ? <span className="ml-1 opacity-80">({ctaHref})</span> : null}
										</p>
									) : null}
								</div>
							</div>
						</section>
					);
				}

				if (section.type === "quote-highlight") {
					const quoteText = typeof props.quoteText === "string" ? props.quoteText : "";
					const authorName = typeof props.authorName === "string" ? props.authorName : "";
					const authorTitle = typeof props.authorTitle === "string" ? props.authorTitle : "";
					const backgroundImageUrl = resolveBuilderBackgroundImageUrl(props.backgroundImageUrl);
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					return (
						<section
							className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6"
							style={
								backgroundImageUrl
									? {
											backgroundImage: `url(${backgroundImageUrl})`,
											backgroundSize: "cover",
											backgroundPosition: "center",
										}
									: undefined
							}
						>
							<p className="text-xl font-semibold leading-relaxed">“{quoteText || "请填写引用内容"}”</p>
							<div className="mt-4">
								<p className="text-sm font-medium">{authorName || "作者名称"}</p>
								{authorTitle ? <p className="text-xs text-muted-foreground">{authorTitle}</p> : null}
							</div>
							{ctaLabel ? (
								<p className="mt-4 text-xs font-medium text-primary">
									{ctaLabel}
									{ctaHref ? <span className="ml-1 opacity-80">({ctaHref})</span> : null}
								</p>
							) : null}
						</section>
					);
				}

				if (section.type === "feature-comparison") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = normalizeColumnCount(props.columns);
					const plansRaw = [
						typeof props.plan1Name === "string" ? props.plan1Name : "",
						typeof props.plan2Name === "string" ? props.plan2Name : "",
						typeof props.plan3Name === "string" ? props.plan3Name : "",
						typeof props.plan4Name === "string" ? props.plan4Name : "",
					];
					const planCount = columns;
					const plans = plansRaw.slice(0, planCount);
					const rows = [
						{
							label: typeof props.row1Label === "string" ? props.row1Label : "",
							values: [
								typeof props.row1Plan1 === "string" ? props.row1Plan1 : "",
								typeof props.row1Plan2 === "string" ? props.row1Plan2 : "",
								typeof props.row1Plan3 === "string" ? props.row1Plan3 : "",
								typeof props.row1Plan4 === "string" ? props.row1Plan4 : "",
							],
						},
						{
							label: typeof props.row2Label === "string" ? props.row2Label : "",
							values: [
								typeof props.row2Plan1 === "string" ? props.row2Plan1 : "",
								typeof props.row2Plan2 === "string" ? props.row2Plan2 : "",
								typeof props.row2Plan3 === "string" ? props.row2Plan3 : "",
								typeof props.row2Plan4 === "string" ? props.row2Plan4 : "",
							],
						},
						{
							label: typeof props.row3Label === "string" ? props.row3Label : "",
							values: [
								typeof props.row3Plan1 === "string" ? props.row3Plan1 : "",
								typeof props.row3Plan2 === "string" ? props.row3Plan2 : "",
								typeof props.row3Plan3 === "string" ? props.row3Plan3 : "",
								typeof props.row3Plan4 === "string" ? props.row3Plan4 : "",
							],
						},
						{
							label: typeof props.row4Label === "string" ? props.row4Label : "",
							values: [
								typeof props.row4Plan1 === "string" ? props.row4Plan1 : "",
								typeof props.row4Plan2 === "string" ? props.row4Plan2 : "",
								typeof props.row4Plan3 === "string" ? props.row4Plan3 : "",
								typeof props.row4Plan4 === "string" ? props.row4Plan4 : "",
							],
						},
					].filter((row) => row.label || row.values.some(Boolean));
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-5 overflow-x-auto">
								<table className="w-full min-w-[520px] border-collapse text-sm">
									<thead>
										<tr>
											<th className="bg-muted/30 border border-border px-3 py-2 text-left">特性</th>
											{plans.map((plan, idx) => (
												<th
													key={`${plan}-${idx}`}
													className="bg-muted/30 border border-border px-3 py-2 text-left"
												>
													{plan || `方案 ${idx + 1}`}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{rows.map((row, rowIndex) => (
											<tr key={`${row.label}-${rowIndex}`}>
												<td className="border border-border px-3 py-2 font-medium">
													{row.label || `特性 ${rowIndex + 1}`}
												</td>
												{row.values.slice(0, planCount).map((value, cellIndex) => (
													<td key={`${value}-${cellIndex}`} className="border border-border px-3 py-2">
														{value || "-"}
													</td>
												))}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</section>
					);
				}

				if (section.type === "inline-cta-banner") {
					const message = typeof props.message === "string" ? props.message : "";
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					const secondaryCtaLabel =
						typeof props.secondaryCtaLabel === "string" ? props.secondaryCtaLabel : "";
					const secondaryCtaHref = typeof props.secondaryCtaHref === "string" ? props.secondaryCtaHref : "";
					const compact = props.compactMode !== "off";
					return (
						<section
							className={`mx-auto max-w-5xl rounded-2xl border border-border bg-accent ${
								compact ? "p-3" : "p-6"
							}`}
						>
							<div className="flex flex-wrap items-center gap-3">
								<p className="text-sm font-medium">{message || "请填写 CTA 文案"}</p>
								{ctaLabel ? (
									<span className={getButtonClass("solid", compact ? "sm" : "md")}>
										{ctaLabel}
										{ctaHref ? <span className="ml-1 text-[10px] opacity-80">({ctaHref})</span> : null}
									</span>
								) : null}
								{secondaryCtaLabel ? (
									<span className={getButtonClass("outline", compact ? "sm" : "md")}>
										{secondaryCtaLabel}
										{secondaryCtaHref ? (
											<span className="ml-1 text-[10px] opacity-80">({secondaryCtaHref})</span>
										) : null}
									</span>
								) : null}
							</div>
						</section>
					);
				}

				if (section.type === "logo-strip-compact") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const logos = [
						{
							url: resolveBuilderBackgroundImageUrl(props.logo1Url),
							alt: typeof props.logo1Alt === "string" ? props.logo1Alt : "logo1",
							href: typeof props.logo1Href === "string" ? props.logo1Href : "",
						},
						{
							url: resolveBuilderBackgroundImageUrl(props.logo2Url),
							alt: typeof props.logo2Alt === "string" ? props.logo2Alt : "logo2",
							href: typeof props.logo2Href === "string" ? props.logo2Href : "",
						},
						{
							url: resolveBuilderBackgroundImageUrl(props.logo3Url),
							alt: typeof props.logo3Alt === "string" ? props.logo3Alt : "logo3",
							href: typeof props.logo3Href === "string" ? props.logo3Href : "",
						},
						{
							url: resolveBuilderBackgroundImageUrl(props.logo4Url),
							alt: typeof props.logo4Alt === "string" ? props.logo4Alt : "logo4",
							href: typeof props.logo4Href === "string" ? props.logo4Href : "",
						},
						{
							url: resolveBuilderBackgroundImageUrl(props.logo5Url),
							alt: typeof props.logo5Alt === "string" ? props.logo5Alt : "logo5",
							href: typeof props.logo5Href === "string" ? props.logo5Href : "",
						},
						{
							url: resolveBuilderBackgroundImageUrl(props.logo6Url),
							alt: typeof props.logo6Alt === "string" ? props.logo6Alt : "logo6",
							href: typeof props.logo6Href === "string" ? props.logo6Href : "",
						},
					].filter((item) => item.url);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{logos.length ? (
								<div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
									{logos.map((logo, idx) => (
										<div
											key={`${logo.alt}-${idx}`}
											className="flex items-center justify-center rounded-lg border border-border bg-background p-3"
										>
											<img
												src={logo.url}
												alt={logo.alt || "logo"}
												className="h-10 w-auto object-contain"
												loading="lazy"
											/>
											{logo.href ? <span className="ml-2 text-[10px] text-muted-foreground">↗</span> : null}
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少上传 1 张 Logo。</p>
							)}
						</section>
					);
				}

				if (section.type === "event-highlights") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const layout = props.layout === "cards" ? "cards" : "timeline";
					const events = [
						{
							date: typeof props.event1Date === "string" ? props.event1Date : "",
							title: typeof props.event1Title === "string" ? props.event1Title : "",
							description: typeof props.event1Description === "string" ? props.event1Description : "",
						},
						{
							date: typeof props.event2Date === "string" ? props.event2Date : "",
							title: typeof props.event2Title === "string" ? props.event2Title : "",
							description: typeof props.event2Description === "string" ? props.event2Description : "",
						},
						{
							date: typeof props.event3Date === "string" ? props.event3Date : "",
							title: typeof props.event3Title === "string" ? props.event3Title : "",
							description: typeof props.event3Description === "string" ? props.event3Description : "",
						},
						{
							date: typeof props.event4Date === "string" ? props.event4Date : "",
							title: typeof props.event4Title === "string" ? props.event4Title : "",
							description: typeof props.event4Description === "string" ? props.event4Description : "",
						},
					].filter((item) => item.date || item.title || item.description);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{events.length ? (
								layout === "cards" ? (
									<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
										{events.map((event, idx) => (
											<div
												key={`${event.title}-${idx}`}
												className="rounded-lg border border-border bg-background p-3"
											>
												<p className="text-xs text-muted-foreground">{event.date || `事件 ${idx + 1}`}</p>
												<p className="mt-1 font-medium">{event.title || `标题 ${idx + 1}`}</p>
												{event.description ? (
													<p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
												) : null}
											</div>
										))}
									</div>
								) : (
									<ol className="mt-4 space-y-2">
										{events.map((event, idx) => (
											<li
												key={`${event.title}-${idx}`}
												className="rounded-lg border border-border bg-background p-3"
											>
												<p className="text-xs text-muted-foreground">{event.date || `事件 ${idx + 1}`}</p>
												<p className="mt-1 font-medium">{event.title || `标题 ${idx + 1}`}</p>
												{event.description ? (
													<p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
												) : null}
											</li>
										))}
									</ol>
								)
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个事件。</p>
							)}
						</section>
					);
				}

				if (section.type === "cta-card-pair") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const cards = [
						{
							title: typeof props.card1Title === "string" ? props.card1Title : "",
							body: typeof props.card1Body === "string" ? props.card1Body : "",
							ctaLabel: typeof props.card1CtaLabel === "string" ? props.card1CtaLabel : "",
							ctaHref: typeof props.card1CtaHref === "string" ? props.card1CtaHref : "",
							imageUrl: resolveBuilderBackgroundImageUrl(props.card1ImageUrl),
						},
						{
							title: typeof props.card2Title === "string" ? props.card2Title : "",
							body: typeof props.card2Body === "string" ? props.card2Body : "",
							ctaLabel: typeof props.card2CtaLabel === "string" ? props.card2CtaLabel : "",
							ctaHref: typeof props.card2CtaHref === "string" ? props.card2CtaHref : "",
							imageUrl: resolveBuilderBackgroundImageUrl(props.card2ImageUrl),
						},
					].filter((item) => item.title || item.body || item.ctaLabel || item.imageUrl);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{cards.length ? (
								<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
									{cards.map((card, idx) => (
										<div
											key={`${card.title}-${idx}`}
											className="rounded-lg border border-border bg-background p-4"
										>
											{card.imageUrl ? (
												<img
													src={card.imageUrl}
													alt={card.title || "cta"}
													className="mb-3 h-28 w-full rounded object-cover"
													loading="lazy"
												/>
											) : null}
											<p className="font-medium">{card.title || `入口 ${idx + 1}`}</p>
											{card.body ? <p className="mt-1 text-sm text-muted-foreground">{card.body}</p> : null}
											{card.ctaLabel ? (
												<p className="mt-3 text-xs font-medium text-primary">
													{card.ctaLabel}
													{card.ctaHref ? <span className="ml-1 opacity-80">({card.ctaHref})</span> : null}
												</p>
											) : null}
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 张 CTA 卡片。</p>
							)}
						</section>
					);
				}

				if (section.type === "faq-with-cta") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const faqs = [
						{
							q: typeof props.q1 === "string" ? props.q1 : "",
							a: typeof props.a1 === "string" ? props.a1 : "",
						},
						{
							q: typeof props.q2 === "string" ? props.q2 : "",
							a: typeof props.a2 === "string" ? props.a2 : "",
						},
						{
							q: typeof props.q3 === "string" ? props.q3 : "",
							a: typeof props.a3 === "string" ? props.a3 : "",
						},
						{
							q: typeof props.q4 === "string" ? props.q4 : "",
							a: typeof props.a4 === "string" ? props.a4 : "",
						},
					].filter((item) => item.q || item.a);
					const ctaTitle = typeof props.ctaTitle === "string" ? props.ctaTitle : "";
					const ctaBody = typeof props.ctaBody === "string" ? props.ctaBody : "";
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					const ctaImageUrl = resolveBuilderBackgroundImageUrl(props.ctaImageUrl);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
								<div className="space-y-3">
									{faqs.length ? (
										faqs.map((faq, idx) => (
											<div
												key={`${faq.q}-${idx}`}
												className="rounded-lg border border-border bg-background p-3"
											>
												<p className="font-medium">{faq.q || `问题 ${idx + 1}`}</p>
												{faq.a ? <p className="mt-1 text-sm text-muted-foreground">{faq.a}</p> : null}
											</div>
										))
									) : (
										<p className="text-sm text-muted-foreground">请至少填写 1 条 FAQ。</p>
									)}
								</div>
								<div className="rounded-lg border border-border bg-background p-4">
									{ctaImageUrl ? (
										<img
											src={ctaImageUrl}
											alt={ctaTitle || "cta"}
											className="mb-3 h-28 w-full rounded object-cover"
											loading="lazy"
										/>
									) : null}
									<p className="font-medium">{ctaTitle || "CTA 标题"}</p>
									{ctaBody ? <p className="mt-1 text-sm text-muted-foreground">{ctaBody}</p> : null}
									{ctaLabel ? (
										<p className="mt-3 text-xs font-medium text-primary">
											{ctaLabel}
											{ctaHref ? <span className="ml-1 opacity-80">({ctaHref})</span> : null}
										</p>
									) : null}
								</div>
							</div>
						</section>
					);
				}

				if (section.type === "partner-metrics") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = normalizeColumnCount(props.columns);
					const gridClass =
						columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
					const items = [
						{
							logoUrl: resolveBuilderBackgroundImageUrl(props.item1LogoUrl),
							logoAlt: typeof props.item1LogoAlt === "string" ? props.item1LogoAlt : "item1",
							metric: typeof props.item1Metric === "string" ? props.item1Metric : "",
							label: typeof props.item1Label === "string" ? props.item1Label : "",
						},
						{
							logoUrl: resolveBuilderBackgroundImageUrl(props.item2LogoUrl),
							logoAlt: typeof props.item2LogoAlt === "string" ? props.item2LogoAlt : "item2",
							metric: typeof props.item2Metric === "string" ? props.item2Metric : "",
							label: typeof props.item2Label === "string" ? props.item2Label : "",
						},
						{
							logoUrl: resolveBuilderBackgroundImageUrl(props.item3LogoUrl),
							logoAlt: typeof props.item3LogoAlt === "string" ? props.item3LogoAlt : "item3",
							metric: typeof props.item3Metric === "string" ? props.item3Metric : "",
							label: typeof props.item3Label === "string" ? props.item3Label : "",
						},
						{
							logoUrl: resolveBuilderBackgroundImageUrl(props.item4LogoUrl),
							logoAlt: typeof props.item4LogoAlt === "string" ? props.item4LogoAlt : "item4",
							metric: typeof props.item4Metric === "string" ? props.item4Metric : "",
							label: typeof props.item4Label === "string" ? props.item4Label : "",
						},
					]
						.slice(0, columns)
						.filter((item) => item.logoUrl || item.metric || item.label);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{items.length ? (
								<div className={`mt-4 grid grid-cols-1 gap-3 ${gridClass}`}>
									{items.map((item, idx) => (
										<div
											key={`${item.label}-${idx}`}
											className="rounded-lg border border-border bg-background p-4 text-center"
										>
											{item.logoUrl ? (
												<img
													src={item.logoUrl}
													alt={item.logoAlt || "logo"}
													className="mx-auto mb-2 h-10 w-auto object-contain"
													loading="lazy"
												/>
											) : null}
											<p className="text-2xl font-semibold tracking-tight">{item.metric || "—"}</p>
											<p className="mt-1 text-sm text-muted-foreground">{item.label || `指标 ${idx + 1}`}</p>
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 组伙伴数据。</p>
							)}
						</section>
					);
				}

				if (section.type === "story-steps") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const layout = props.layout === "timeline" ? "timeline" : "cards";
					const steps = [
						{
							title: typeof props.step1Title === "string" ? props.step1Title : "",
							body: typeof props.step1Body === "string" ? props.step1Body : "",
							imageUrl: resolveBuilderBackgroundImageUrl(props.step1ImageUrl),
						},
						{
							title: typeof props.step2Title === "string" ? props.step2Title : "",
							body: typeof props.step2Body === "string" ? props.step2Body : "",
							imageUrl: resolveBuilderBackgroundImageUrl(props.step2ImageUrl),
						},
						{
							title: typeof props.step3Title === "string" ? props.step3Title : "",
							body: typeof props.step3Body === "string" ? props.step3Body : "",
							imageUrl: resolveBuilderBackgroundImageUrl(props.step3ImageUrl),
						},
						{
							title: typeof props.step4Title === "string" ? props.step4Title : "",
							body: typeof props.step4Body === "string" ? props.step4Body : "",
							imageUrl: resolveBuilderBackgroundImageUrl(props.step4ImageUrl),
						},
					].filter((item) => item.title || item.body || item.imageUrl);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{steps.length ? (
								layout === "timeline" ? (
									<ol className="mt-4 space-y-3">
										{steps.map((step, idx) => (
											<li
												key={`${step.title}-${idx}`}
												className="rounded-lg border border-border bg-background p-3"
											>
												<p className="text-xs text-muted-foreground">步骤 {idx + 1}</p>
												<p className="mt-1 font-medium">{step.title || `步骤 ${idx + 1}`}</p>
												{step.body ? <p className="mt-1 text-sm text-muted-foreground">{step.body}</p> : null}
											</li>
										))}
									</ol>
								) : (
									<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
										{steps.map((step, idx) => (
											<div
												key={`${step.title}-${idx}`}
												className="rounded-lg border border-border bg-background p-3"
											>
												{step.imageUrl ? (
													<img
														src={step.imageUrl}
														alt={step.title || "step"}
														className="mb-3 h-24 w-full rounded object-cover"
														loading="lazy"
													/>
												) : null}
												<p className="text-xs text-muted-foreground">步骤 {idx + 1}</p>
												<p className="mt-1 font-medium">{step.title || `步骤 ${idx + 1}`}</p>
												{step.body ? <p className="mt-1 text-sm text-muted-foreground">{step.body}</p> : null}
											</div>
										))}
									</div>
								)
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个步骤。</p>
							)}
						</section>
					);
				}

				if (section.type === "media-carousel") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const autoplay = props.autoplay !== "off";
					const slides = [
						{
							imageUrl: resolveBuilderBackgroundImageUrl(props.slide1ImageUrl),
							title: typeof props.slide1Title === "string" ? props.slide1Title : "",
							body: typeof props.slide1Body === "string" ? props.slide1Body : "",
							ctaLabel: typeof props.slide1CtaLabel === "string" ? props.slide1CtaLabel : "",
							ctaHref: typeof props.slide1CtaHref === "string" ? props.slide1CtaHref : "",
						},
						{
							imageUrl: resolveBuilderBackgroundImageUrl(props.slide2ImageUrl),
							title: typeof props.slide2Title === "string" ? props.slide2Title : "",
							body: typeof props.slide2Body === "string" ? props.slide2Body : "",
							ctaLabel: typeof props.slide2CtaLabel === "string" ? props.slide2CtaLabel : "",
							ctaHref: typeof props.slide2CtaHref === "string" ? props.slide2CtaHref : "",
						},
						{
							imageUrl: resolveBuilderBackgroundImageUrl(props.slide3ImageUrl),
							title: typeof props.slide3Title === "string" ? props.slide3Title : "",
							body: typeof props.slide3Body === "string" ? props.slide3Body : "",
							ctaLabel: typeof props.slide3CtaLabel === "string" ? props.slide3CtaLabel : "",
							ctaHref: typeof props.slide3CtaHref === "string" ? props.slide3CtaHref : "",
						},
					].filter((item) => item.imageUrl || item.title || item.body || item.ctaLabel);
					const activeSlide = slides[0];
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<p className="mt-1 text-xs text-muted-foreground">
								{autoplay ? "自动轮播：开启（预览显示第一张）" : "自动轮播：关闭"}
							</p>
							{activeSlide ? (
								<div className="mt-4 rounded-lg border border-border bg-background p-3">
									{activeSlide.imageUrl ? (
										<img
											src={activeSlide.imageUrl}
											alt={activeSlide.title || "slide"}
											className="h-44 w-full rounded object-cover"
											loading="lazy"
										/>
									) : null}
									<div className="mt-3">
										<p className="font-medium">{activeSlide.title || "轮播标题"}</p>
										{activeSlide.body ? (
											<p className="mt-1 text-sm text-muted-foreground">{activeSlide.body}</p>
										) : null}
										{activeSlide.ctaLabel ? (
											<p className="mt-2 text-xs font-medium text-primary">
												{activeSlide.ctaLabel}
												{activeSlide.ctaHref ? (
													<span className="ml-1 opacity-80">({activeSlide.ctaHref})</span>
												) : null}
											</p>
										) : null}
									</div>
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个轮播项。</p>
							)}
						</section>
					);
				}

				if (section.type === "feature-checklist") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const items = [
						typeof props.item1 === "string" ? props.item1 : "",
						typeof props.item2 === "string" ? props.item2 : "",
						typeof props.item3 === "string" ? props.item3 : "",
						typeof props.item4 === "string" ? props.item4 : "",
						typeof props.item5 === "string" ? props.item5 : "",
						typeof props.item6 === "string" ? props.item6 : "",
						typeof props.item7 === "string" ? props.item7 : "",
						typeof props.item8 === "string" ? props.item8 : "",
					].filter(Boolean);
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{items.length ? (
								<ul className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
									{items.map((item, idx) => (
										<li
											key={`${item}-${idx}`}
											className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
										>
											<span className="mr-2 text-primary">✓</span>
											{item}
										</li>
									))}
								</ul>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 条功能清单。</p>
							)}
							{ctaLabel ? (
								<p className="mt-3 text-xs font-medium text-primary">
									{ctaLabel}
									{ctaHref ? <span className="ml-1 opacity-80">({ctaHref})</span> : null}
								</p>
							) : null}
						</section>
					);
				}

				if (section.type === "mini-blog-cards") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const cards = [
						{
							title: typeof props.card1Title === "string" ? props.card1Title : "",
							excerpt: typeof props.card1Excerpt === "string" ? props.card1Excerpt : "",
							href: typeof props.card1Href === "string" ? props.card1Href : "",
							imageUrl: resolveBuilderBackgroundImageUrl(props.card1ImageUrl),
						},
						{
							title: typeof props.card2Title === "string" ? props.card2Title : "",
							excerpt: typeof props.card2Excerpt === "string" ? props.card2Excerpt : "",
							href: typeof props.card2Href === "string" ? props.card2Href : "",
							imageUrl: resolveBuilderBackgroundImageUrl(props.card2ImageUrl),
						},
						{
							title: typeof props.card3Title === "string" ? props.card3Title : "",
							excerpt: typeof props.card3Excerpt === "string" ? props.card3Excerpt : "",
							href: typeof props.card3Href === "string" ? props.card3Href : "",
							imageUrl: resolveBuilderBackgroundImageUrl(props.card3ImageUrl),
						},
					].filter((item) => item.title || item.excerpt || item.href || item.imageUrl);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{cards.length ? (
								<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
									{cards.map((card, idx) => (
										<div
											key={`${card.title}-${idx}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											{card.imageUrl ? (
												<img
													src={card.imageUrl}
													alt={card.title || "card"}
													className="mb-3 h-28 w-full rounded object-cover"
													loading="lazy"
												/>
											) : null}
											<p className="font-medium">{card.title || `内容 ${idx + 1}`}</p>
											{card.excerpt ? (
												<p className="mt-1 text-sm text-muted-foreground">{card.excerpt}</p>
											) : null}
											{card.href ? (
												<p className="mt-2 text-xs font-medium text-primary">{card.href}</p>
											) : null}
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 张内容卡片。</p>
							)}
						</section>
					);
				}

				if (section.type === "trust-logo-wall") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const groupLabel = typeof props.groupLabel === "string" ? props.groupLabel : "";
					const dense = props.density !== "normal";
					const logos = [
						{
							url: resolveBuilderBackgroundImageUrl(props.logo1Url),
							alt: typeof props.logo1Alt === "string" ? props.logo1Alt : "logo1",
							href: typeof props.logo1Href === "string" ? props.logo1Href : "",
						},
						{
							url: resolveBuilderBackgroundImageUrl(props.logo2Url),
							alt: typeof props.logo2Alt === "string" ? props.logo2Alt : "logo2",
							href: typeof props.logo2Href === "string" ? props.logo2Href : "",
						},
						{
							url: resolveBuilderBackgroundImageUrl(props.logo3Url),
							alt: typeof props.logo3Alt === "string" ? props.logo3Alt : "logo3",
							href: typeof props.logo3Href === "string" ? props.logo3Href : "",
						},
						{
							url: resolveBuilderBackgroundImageUrl(props.logo4Url),
							alt: typeof props.logo4Alt === "string" ? props.logo4Alt : "logo4",
							href: typeof props.logo4Href === "string" ? props.logo4Href : "",
						},
						{
							url: resolveBuilderBackgroundImageUrl(props.logo5Url),
							alt: typeof props.logo5Alt === "string" ? props.logo5Alt : "logo5",
							href: typeof props.logo5Href === "string" ? props.logo5Href : "",
						},
						{
							url: resolveBuilderBackgroundImageUrl(props.logo6Url),
							alt: typeof props.logo6Alt === "string" ? props.logo6Alt : "logo6",
							href: typeof props.logo6Href === "string" ? props.logo6Href : "",
						},
						{
							url: resolveBuilderBackgroundImageUrl(props.logo7Url),
							alt: typeof props.logo7Alt === "string" ? props.logo7Alt : "logo7",
							href: typeof props.logo7Href === "string" ? props.logo7Href : "",
						},
						{
							url: resolveBuilderBackgroundImageUrl(props.logo8Url),
							alt: typeof props.logo8Alt === "string" ? props.logo8Alt : "logo8",
							href: typeof props.logo8Href === "string" ? props.logo8Href : "",
						},
					].filter((item) => item.url);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{groupLabel ? (
								<p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">{groupLabel}</p>
							) : null}
							{logos.length ? (
								<div className={`mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 ${dense ? "" : "md:gap-3"}`}>
									{logos.map((logo, idx) => (
										<div
											key={`${logo.alt}-${idx}`}
											className={`flex items-center justify-center rounded-lg border border-border bg-background ${
												dense ? "p-2" : "p-3"
											}`}
										>
											<img
												src={logo.url}
												alt={logo.alt || "logo"}
												className={`w-auto object-contain ${dense ? "h-8" : "h-10"}`}
												loading="lazy"
											/>
											{logo.href ? <span className="ml-1 text-[10px] text-muted-foreground">↗</span> : null}
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少上传 1 张 Logo。</p>
							)}
						</section>
					);
				}

				if (section.type === "dual-hero-split") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const leftImageUrl = resolveBuilderBackgroundImageUrl(props.leftImageUrl);
					const rightImageUrl = resolveBuilderBackgroundImageUrl(props.rightImageUrl);
					const leftBackgroundColor =
						typeof props.leftBackgroundColor === "string" ? props.leftBackgroundColor : "";
					const rightBackgroundColor =
						typeof props.rightBackgroundColor === "string" ? props.rightBackgroundColor : "";
					const leftTitle = typeof props.leftTitle === "string" ? props.leftTitle : "";
					const rightTitle = typeof props.rightTitle === "string" ? props.rightTitle : "";
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
								<div
									className="rounded-lg border border-border p-4"
									style={{
										...(leftBackgroundColor ? { backgroundColor: leftBackgroundColor } : {}),
										...(leftImageUrl
											? {
													backgroundImage: `url(${leftImageUrl})`,
													backgroundSize: "cover",
													backgroundPosition: "center",
												}
											: {}),
									}}
								>
									{typeof props.leftEyebrow === "string" && props.leftEyebrow ? (
										<p className="text-xs uppercase tracking-wide text-muted-foreground">
											{props.leftEyebrow}
										</p>
									) : null}
									<p className="mt-1 text-lg font-semibold">{leftTitle || "左区标题"}</p>
									{typeof props.leftBody === "string" && props.leftBody ? (
										<p className="mt-2 text-sm text-muted-foreground">{props.leftBody}</p>
									) : null}
									{typeof props.leftCtaLabel === "string" && props.leftCtaLabel ? (
										<p className="mt-3 text-xs font-medium text-primary">
											{props.leftCtaLabel}
											{typeof props.leftCtaHref === "string" && props.leftCtaHref ? (
												<span className="ml-1 opacity-80">({props.leftCtaHref})</span>
											) : null}
										</p>
									) : null}
								</div>
								<div
									className="rounded-lg border border-border p-4"
									style={{
										...(rightBackgroundColor ? { backgroundColor: rightBackgroundColor } : {}),
										...(rightImageUrl
											? {
													backgroundImage: `url(${rightImageUrl})`,
													backgroundSize: "cover",
													backgroundPosition: "center",
												}
											: {}),
									}}
								>
									{typeof props.rightEyebrow === "string" && props.rightEyebrow ? (
										<p className="text-xs uppercase tracking-wide text-muted-foreground">
											{props.rightEyebrow}
										</p>
									) : null}
									<p className="mt-1 text-lg font-semibold">{rightTitle || "右区标题"}</p>
									{typeof props.rightBody === "string" && props.rightBody ? (
										<p className="mt-2 text-sm text-muted-foreground">{props.rightBody}</p>
									) : null}
									{typeof props.rightCtaLabel === "string" && props.rightCtaLabel ? (
										<p className="mt-3 text-xs font-medium text-primary">
											{props.rightCtaLabel}
											{typeof props.rightCtaHref === "string" && props.rightCtaHref ? (
												<span className="ml-1 opacity-80">({props.rightCtaHref})</span>
											) : null}
										</p>
									) : null}
								</div>
							</div>
						</section>
					);
				}

				if (section.type === "quick-links-grid") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = normalizeColumnCount(props.columns);
					const gridClass =
						columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
					const links = [
						{
							label: typeof props.link1Label === "string" ? props.link1Label : "",
							href: typeof props.link1Href === "string" ? props.link1Href : "",
							icon: typeof props.link1Icon === "string" ? props.link1Icon : "",
						},
						{
							label: typeof props.link2Label === "string" ? props.link2Label : "",
							href: typeof props.link2Href === "string" ? props.link2Href : "",
							icon: typeof props.link2Icon === "string" ? props.link2Icon : "",
						},
						{
							label: typeof props.link3Label === "string" ? props.link3Label : "",
							href: typeof props.link3Href === "string" ? props.link3Href : "",
							icon: typeof props.link3Icon === "string" ? props.link3Icon : "",
						},
						{
							label: typeof props.link4Label === "string" ? props.link4Label : "",
							href: typeof props.link4Href === "string" ? props.link4Href : "",
							icon: typeof props.link4Icon === "string" ? props.link4Icon : "",
						},
						{
							label: typeof props.link5Label === "string" ? props.link5Label : "",
							href: typeof props.link5Href === "string" ? props.link5Href : "",
							icon: typeof props.link5Icon === "string" ? props.link5Icon : "",
						},
						{
							label: typeof props.link6Label === "string" ? props.link6Label : "",
							href: typeof props.link6Href === "string" ? props.link6Href : "",
							icon: typeof props.link6Icon === "string" ? props.link6Icon : "",
						},
						{
							label: typeof props.link7Label === "string" ? props.link7Label : "",
							href: typeof props.link7Href === "string" ? props.link7Href : "",
							icon: typeof props.link7Icon === "string" ? props.link7Icon : "",
						},
						{
							label: typeof props.link8Label === "string" ? props.link8Label : "",
							href: typeof props.link8Href === "string" ? props.link8Href : "",
							icon: typeof props.link8Icon === "string" ? props.link8Icon : "",
						},
					].filter((item) => item.label || item.href || item.icon);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{links.length ? (
								<div className={`mt-4 grid grid-cols-1 gap-3 ${gridClass}`}>
									{links.map((link, idx) => (
										<div
											key={`${link.label}-${idx}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="font-medium">
												{link.icon ? <span className="mr-1">{link.icon}</span> : null}
												{link.label || `链接 ${idx + 1}`}
											</p>
											{link.href ? <p className="mt-1 text-xs text-muted-foreground">{link.href}</p> : null}
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个快捷链接。</p>
							)}
						</section>
					);
				}

				if (section.type === "store-locator-lite") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const cards = [
						{
							name: typeof props.card1Name === "string" ? props.card1Name : "",
							address: typeof props.card1Address === "string" ? props.card1Address : "",
							phone: typeof props.card1Phone === "string" ? props.card1Phone : "",
							hours: typeof props.card1Hours === "string" ? props.card1Hours : "",
							mapHref: typeof props.card1MapHref === "string" ? props.card1MapHref : "",
						},
						{
							name: typeof props.card2Name === "string" ? props.card2Name : "",
							address: typeof props.card2Address === "string" ? props.card2Address : "",
							phone: typeof props.card2Phone === "string" ? props.card2Phone : "",
							hours: typeof props.card2Hours === "string" ? props.card2Hours : "",
							mapHref: typeof props.card2MapHref === "string" ? props.card2MapHref : "",
						},
						{
							name: typeof props.card3Name === "string" ? props.card3Name : "",
							address: typeof props.card3Address === "string" ? props.card3Address : "",
							phone: typeof props.card3Phone === "string" ? props.card3Phone : "",
							hours: typeof props.card3Hours === "string" ? props.card3Hours : "",
							mapHref: typeof props.card3MapHref === "string" ? props.card3MapHref : "",
						},
					].filter((item) => item.name || item.address || item.phone || item.hours || item.mapHref);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{cards.length ? (
								<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
									{cards.map((card, idx) => (
										<div
											key={`${card.name}-${idx}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="font-medium">{card.name || `门店 ${idx + 1}`}</p>
											{card.address ? (
												<p className="mt-1 text-sm text-muted-foreground">{card.address}</p>
											) : null}
											{card.phone ? (
												<p className="mt-1 text-xs text-muted-foreground">☎ {card.phone}</p>
											) : null}
											{card.hours ? (
												<p className="mt-1 text-xs text-muted-foreground">🕒 {card.hours}</p>
											) : null}
											{card.mapHref ? (
												<p className="mt-2 text-xs font-medium text-primary">{card.mapHref}</p>
											) : null}
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个门店卡片。</p>
							)}
						</section>
					);
				}

				if (section.type === "timeline-compact") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const items = [
						{
							date: typeof props.item1Date === "string" ? props.item1Date : "",
							title: typeof props.item1Title === "string" ? props.item1Title : "",
							body: typeof props.item1Body === "string" ? props.item1Body : "",
						},
						{
							date: typeof props.item2Date === "string" ? props.item2Date : "",
							title: typeof props.item2Title === "string" ? props.item2Title : "",
							body: typeof props.item2Body === "string" ? props.item2Body : "",
						},
						{
							date: typeof props.item3Date === "string" ? props.item3Date : "",
							title: typeof props.item3Title === "string" ? props.item3Title : "",
							body: typeof props.item3Body === "string" ? props.item3Body : "",
						},
						{
							date: typeof props.item4Date === "string" ? props.item4Date : "",
							title: typeof props.item4Title === "string" ? props.item4Title : "",
							body: typeof props.item4Body === "string" ? props.item4Body : "",
						},
					].filter((item) => item.date || item.title || item.body);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{items.length ? (
								<ol className="mt-4 space-y-2">
									{items.map((item, idx) => (
										<li
											key={`${item.title}-${idx}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="text-xs text-muted-foreground">{item.date || `节点 ${idx + 1}`}</p>
											<p className="mt-1 font-medium">{item.title || `标题 ${idx + 1}`}</p>
											{item.body ? <p className="mt-1 text-sm text-muted-foreground">{item.body}</p> : null}
										</li>
									))}
								</ol>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个时间线节点。</p>
							)}
						</section>
					);
				}

				if (section.type === "faq-cards") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = normalizeColumnCount(props.columns);
					const gridClass =
						columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
					const faqs = [
						{
							q: typeof props.q1 === "string" ? props.q1 : "",
							a: typeof props.a1 === "string" ? props.a1 : "",
						},
						{
							q: typeof props.q2 === "string" ? props.q2 : "",
							a: typeof props.a2 === "string" ? props.a2 : "",
						},
						{
							q: typeof props.q3 === "string" ? props.q3 : "",
							a: typeof props.a3 === "string" ? props.a3 : "",
						},
						{
							q: typeof props.q4 === "string" ? props.q4 : "",
							a: typeof props.a4 === "string" ? props.a4 : "",
						},
						{
							q: typeof props.q5 === "string" ? props.q5 : "",
							a: typeof props.a5 === "string" ? props.a5 : "",
						},
						{
							q: typeof props.q6 === "string" ? props.q6 : "",
							a: typeof props.a6 === "string" ? props.a6 : "",
						},
					].filter((item) => item.q || item.a);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{faqs.length ? (
								<div className={`mt-4 grid grid-cols-1 gap-3 ${gridClass}`}>
									{faqs.map((faq, idx) => (
										<div
											key={`${faq.q}-${idx}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="font-medium">{faq.q || `问题 ${idx + 1}`}</p>
											{faq.a ? <p className="mt-1 text-sm text-muted-foreground">{faq.a}</p> : null}
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 条 FAQ。</p>
							)}
						</section>
					);
				}

				if (section.type === "product-comparison-lite") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = normalizeColumnCount(props.columns);
					const gridClass =
						columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
					const items = [
						{
							name: typeof props.item1Name === "string" ? props.item1Name : "",
							price: typeof props.item1Price === "string" ? props.item1Price : "",
							feature: typeof props.item1Feature === "string" ? props.item1Feature : "",
							ctaLabel: typeof props.item1CtaLabel === "string" ? props.item1CtaLabel : "",
							ctaHref: typeof props.item1CtaHref === "string" ? props.item1CtaHref : "",
						},
						{
							name: typeof props.item2Name === "string" ? props.item2Name : "",
							price: typeof props.item2Price === "string" ? props.item2Price : "",
							feature: typeof props.item2Feature === "string" ? props.item2Feature : "",
							ctaLabel: typeof props.item2CtaLabel === "string" ? props.item2CtaLabel : "",
							ctaHref: typeof props.item2CtaHref === "string" ? props.item2CtaHref : "",
						},
						{
							name: typeof props.item3Name === "string" ? props.item3Name : "",
							price: typeof props.item3Price === "string" ? props.item3Price : "",
							feature: typeof props.item3Feature === "string" ? props.item3Feature : "",
							ctaLabel: typeof props.item3CtaLabel === "string" ? props.item3CtaLabel : "",
							ctaHref: typeof props.item3CtaHref === "string" ? props.item3CtaHref : "",
						},
						{
							name: typeof props.item4Name === "string" ? props.item4Name : "",
							price: typeof props.item4Price === "string" ? props.item4Price : "",
							feature: typeof props.item4Feature === "string" ? props.item4Feature : "",
							ctaLabel: typeof props.item4CtaLabel === "string" ? props.item4CtaLabel : "",
							ctaHref: typeof props.item4CtaHref === "string" ? props.item4CtaHref : "",
						},
					].filter((item) => item.name || item.price || item.feature || item.ctaLabel || item.ctaHref);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{items.length ? (
								<div className={`mt-4 grid grid-cols-1 gap-3 ${gridClass}`}>
									{items.map((item, idx) => (
										<div
											key={`${item.name}-${idx}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="font-medium">{item.name || `产品 ${idx + 1}`}</p>
											{item.price ? <p className="mt-1 text-sm text-muted-foreground">{item.price}</p> : null}
											{item.feature ? (
												<p className="mt-1 text-xs text-muted-foreground">{item.feature}</p>
											) : null}
											{item.ctaLabel ? (
												<p className="mt-2 text-xs font-medium text-primary">
													{item.ctaLabel}
													{item.ctaHref ? <span className="ml-1 opacity-80">({item.ctaHref})</span> : null}
												</p>
											) : null}
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个对比产品。</p>
							)}
						</section>
					);
				}

				if (section.type === "cta-marquee") {
					const message = typeof props.message === "string" ? props.message : "";
					const secondaryMessage = typeof props.secondaryMessage === "string" ? props.secondaryMessage : "";
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					const speed = props.speed === "slow" || props.speed === "fast" ? props.speed : "normal";
					const speedLabel = speed === "slow" ? "慢速" : speed === "fast" ? "快速" : "标准";
					const pauseOnHover = props.pauseOnHover === "off" ? "关闭" : "开启";
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							<div className="border-primary/40 bg-background/70 rounded-lg border border-dashed p-4">
								<p className="text-sm font-medium text-primary">{message || "滚动促销主文案"}</p>
								{secondaryMessage ? (
									<p className="mt-1 text-sm text-muted-foreground">{secondaryMessage}</p>
								) : null}
								<div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
									<span>速度：{speedLabel}</span>
									<span>悬停暂停：{pauseOnHover}</span>
								</div>
								{ctaLabel ? (
									<p className="mt-3 text-xs font-medium text-primary">
										{ctaLabel}
										{ctaHref ? <span className="ml-1 opacity-80">({ctaHref})</span> : null}
									</p>
								) : null}
							</div>
						</section>
					);
				}

				if (section.type === "faq-accordion-plus") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const groups = [
						{
							title: typeof props.group1Title === "string" ? props.group1Title : "",
							items: [
								{
									q: typeof props.q1 === "string" ? props.q1 : "",
									a: typeof props.a1 === "string" ? props.a1 : "",
								},
								{
									q: typeof props.q2 === "string" ? props.q2 : "",
									a: typeof props.a2 === "string" ? props.a2 : "",
								},
							],
						},
						{
							title: typeof props.group2Title === "string" ? props.group2Title : "",
							items: [
								{
									q: typeof props.q3 === "string" ? props.q3 : "",
									a: typeof props.a3 === "string" ? props.a3 : "",
								},
								{
									q: typeof props.q4 === "string" ? props.q4 : "",
									a: typeof props.a4 === "string" ? props.a4 : "",
								},
							],
						},
						{
							title: typeof props.group3Title === "string" ? props.group3Title : "",
							items: [
								{
									q: typeof props.q5 === "string" ? props.q5 : "",
									a: typeof props.a5 === "string" ? props.a5 : "",
								},
								{
									q: typeof props.q6 === "string" ? props.q6 : "",
									a: typeof props.a6 === "string" ? props.a6 : "",
								},
							],
						},
					]
						.map((group) => ({
							title: group.title,
							items: group.items.filter((item) => item.q || item.a),
						}))
						.filter((group) => group.title || group.items.length > 0);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{groups.length ? (
								<div className="mt-4 space-y-3">
									{groups.map((group, groupIdx) => (
										<div
											key={`${group.title}-${groupIdx}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="text-sm font-semibold">{group.title || `分组 ${groupIdx + 1}`}</p>
											<div className="mt-2 space-y-2">
												{group.items.map((item, itemIdx) => (
													<div
														key={`${item.q}-${itemIdx}`}
														className="border-border/70 rounded-md border p-2"
													>
														<p className="text-sm font-medium">{item.q || `问题 ${itemIdx + 1}`}</p>
														{item.a ? <p className="mt-1 text-xs text-muted-foreground">{item.a}</p> : null}
													</div>
												))}
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个 FAQ 分组或问题。</p>
							)}
						</section>
					);
				}

				if (section.type === "usp-pill-row") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = normalizeColumnCount(props.columns);
					const gridClass =
						columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
					const items = [
						{
							icon: typeof props.item1Icon === "string" ? props.item1Icon : "",
							label: typeof props.item1Label === "string" ? props.item1Label : "",
						},
						{
							icon: typeof props.item2Icon === "string" ? props.item2Icon : "",
							label: typeof props.item2Label === "string" ? props.item2Label : "",
						},
						{
							icon: typeof props.item3Icon === "string" ? props.item3Icon : "",
							label: typeof props.item3Label === "string" ? props.item3Label : "",
						},
						{
							icon: typeof props.item4Icon === "string" ? props.item4Icon : "",
							label: typeof props.item4Label === "string" ? props.item4Label : "",
						},
						{
							icon: typeof props.item5Icon === "string" ? props.item5Icon : "",
							label: typeof props.item5Label === "string" ? props.item5Label : "",
						},
						{
							icon: typeof props.item6Icon === "string" ? props.item6Icon : "",
							label: typeof props.item6Label === "string" ? props.item6Label : "",
						},
					].filter((item) => item.icon || item.label);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{items.length ? (
								<div className={`mt-4 grid grid-cols-1 gap-3 ${gridClass}`}>
									{items.map((item, idx) => (
										<div
											key={`${item.label}-${idx}`}
											className="rounded-full border border-border bg-background px-4 py-2"
										>
											<p className="text-sm font-medium">
												{item.icon ? <span className="mr-2">{item.icon}</span> : null}
												{item.label || `卖点 ${idx + 1}`}
											</p>
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个 USP 项。</p>
							)}
						</section>
					);
				}

				if (section.type === "pricing-card-lite") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = normalizeColumnCount(props.columns);
					const gridClass =
						columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
					const plans = [
						{
							name: typeof props.plan1Name === "string" ? props.plan1Name : "",
							price: typeof props.plan1Price === "string" ? props.plan1Price : "",
							feature: typeof props.plan1Feature === "string" ? props.plan1Feature : "",
							ctaLabel: typeof props.plan1CtaLabel === "string" ? props.plan1CtaLabel : "",
							ctaHref: typeof props.plan1CtaHref === "string" ? props.plan1CtaHref : "",
						},
						{
							name: typeof props.plan2Name === "string" ? props.plan2Name : "",
							price: typeof props.plan2Price === "string" ? props.plan2Price : "",
							feature: typeof props.plan2Feature === "string" ? props.plan2Feature : "",
							ctaLabel: typeof props.plan2CtaLabel === "string" ? props.plan2CtaLabel : "",
							ctaHref: typeof props.plan2CtaHref === "string" ? props.plan2CtaHref : "",
						},
						{
							name: typeof props.plan3Name === "string" ? props.plan3Name : "",
							price: typeof props.plan3Price === "string" ? props.plan3Price : "",
							feature: typeof props.plan3Feature === "string" ? props.plan3Feature : "",
							ctaLabel: typeof props.plan3CtaLabel === "string" ? props.plan3CtaLabel : "",
							ctaHref: typeof props.plan3CtaHref === "string" ? props.plan3CtaHref : "",
						},
						{
							name: typeof props.plan4Name === "string" ? props.plan4Name : "",
							price: typeof props.plan4Price === "string" ? props.plan4Price : "",
							feature: typeof props.plan4Feature === "string" ? props.plan4Feature : "",
							ctaLabel: typeof props.plan4CtaLabel === "string" ? props.plan4CtaLabel : "",
							ctaHref: typeof props.plan4CtaHref === "string" ? props.plan4CtaHref : "",
						},
					].filter((item) => item.name || item.price || item.feature || item.ctaLabel || item.ctaHref);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{plans.length ? (
								<div className={`mt-4 grid grid-cols-1 gap-3 ${gridClass}`}>
									{plans.map((plan, idx) => (
										<div
											key={`${plan.name}-${idx}`}
											className="rounded-xl border border-border bg-background p-4"
										>
											<p className="font-semibold">{plan.name || `方案 ${idx + 1}`}</p>
											{plan.price ? <p className="mt-1 text-sm text-muted-foreground">{plan.price}</p> : null}
											{plan.feature ? (
												<p className="mt-2 text-xs text-muted-foreground">{plan.feature}</p>
											) : null}
											{plan.ctaLabel ? (
												<p className="mt-3 text-xs font-medium text-primary">
													{plan.ctaLabel}
													{plan.ctaHref ? <span className="ml-1 opacity-80">({plan.ctaHref})</span> : null}
												</p>
											) : null}
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个方案卡片。</p>
							)}
						</section>
					);
				}

				if (section.type === "brand-story-timeline") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const milestones = [
						{
							date: typeof props.milestone1Date === "string" ? props.milestone1Date : "",
							title: typeof props.milestone1Title === "string" ? props.milestone1Title : "",
							body: typeof props.milestone1Body === "string" ? props.milestone1Body : "",
							imageUrl: resolveBuilderBackgroundImageUrl(props.milestone1ImageUrl),
						},
						{
							date: typeof props.milestone2Date === "string" ? props.milestone2Date : "",
							title: typeof props.milestone2Title === "string" ? props.milestone2Title : "",
							body: typeof props.milestone2Body === "string" ? props.milestone2Body : "",
							imageUrl: resolveBuilderBackgroundImageUrl(props.milestone2ImageUrl),
						},
						{
							date: typeof props.milestone3Date === "string" ? props.milestone3Date : "",
							title: typeof props.milestone3Title === "string" ? props.milestone3Title : "",
							body: typeof props.milestone3Body === "string" ? props.milestone3Body : "",
							imageUrl: resolveBuilderBackgroundImageUrl(props.milestone3ImageUrl),
						},
						{
							date: typeof props.milestone4Date === "string" ? props.milestone4Date : "",
							title: typeof props.milestone4Title === "string" ? props.milestone4Title : "",
							body: typeof props.milestone4Body === "string" ? props.milestone4Body : "",
							imageUrl: resolveBuilderBackgroundImageUrl(props.milestone4ImageUrl),
						},
					].filter((item) => item.date || item.title || item.body || item.imageUrl);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{milestones.length ? (
								<ol className="mt-4 space-y-3">
									{milestones.map((milestone, idx) => (
										<li
											key={`${milestone.title}-${idx}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="text-xs text-muted-foreground">{milestone.date || `阶段 ${idx + 1}`}</p>
											<p className="mt-1 font-medium">{milestone.title || `里程碑 ${idx + 1}`}</p>
											{milestone.body ? (
												<p className="mt-1 text-sm text-muted-foreground">{milestone.body}</p>
											) : null}
											{milestone.imageUrl ? (
												<p className="mt-2 text-xs text-muted-foreground">{milestone.imageUrl}</p>
											) : null}
										</li>
									))}
								</ol>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个品牌里程碑。</p>
							)}
						</section>
					);
				}

				if (section.type === "social-links-bar") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = normalizeColumnCount(props.columns);
					const gridClass =
						columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
					const links = [
						{
							label: typeof props.link1Label === "string" ? props.link1Label : "",
							href: typeof props.link1Href === "string" ? props.link1Href : "",
							icon: typeof props.link1Icon === "string" ? props.link1Icon : "",
						},
						{
							label: typeof props.link2Label === "string" ? props.link2Label : "",
							href: typeof props.link2Href === "string" ? props.link2Href : "",
							icon: typeof props.link2Icon === "string" ? props.link2Icon : "",
						},
						{
							label: typeof props.link3Label === "string" ? props.link3Label : "",
							href: typeof props.link3Href === "string" ? props.link3Href : "",
							icon: typeof props.link3Icon === "string" ? props.link3Icon : "",
						},
						{
							label: typeof props.link4Label === "string" ? props.link4Label : "",
							href: typeof props.link4Href === "string" ? props.link4Href : "",
							icon: typeof props.link4Icon === "string" ? props.link4Icon : "",
						},
						{
							label: typeof props.link5Label === "string" ? props.link5Label : "",
							href: typeof props.link5Href === "string" ? props.link5Href : "",
							icon: typeof props.link5Icon === "string" ? props.link5Icon : "",
						},
						{
							label: typeof props.link6Label === "string" ? props.link6Label : "",
							href: typeof props.link6Href === "string" ? props.link6Href : "",
							icon: typeof props.link6Icon === "string" ? props.link6Icon : "",
						},
					].filter((item) => item.label || item.href || item.icon);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{links.length ? (
								<div className={`mt-4 grid grid-cols-1 gap-3 ${gridClass}`}>
									{links.map((link, idx) => (
										<div
											key={`${link.label}-${idx}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="font-medium">
												{link.icon ? <span className="mr-2">{link.icon}</span> : null}
												{link.label || `链接 ${idx + 1}`}
											</p>
											{link.href ? <p className="mt-1 text-xs text-muted-foreground">{link.href}</p> : null}
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 条社媒/联系链接。</p>
							)}
						</section>
					);
				}

				if (section.type === "feature-table-lite") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = [
						typeof props.col1Name === "string" ? props.col1Name : "",
						typeof props.col2Name === "string" ? props.col2Name : "",
						typeof props.col3Name === "string" ? props.col3Name : "",
						typeof props.col4Name === "string" ? props.col4Name : "",
					].filter(Boolean);
					const rows = [
						{
							label: typeof props.row1Label === "string" ? props.row1Label : "",
							values: [
								typeof props.row1Col1 === "string" ? props.row1Col1 : "",
								typeof props.row1Col2 === "string" ? props.row1Col2 : "",
								typeof props.row1Col3 === "string" ? props.row1Col3 : "",
								typeof props.row1Col4 === "string" ? props.row1Col4 : "",
							],
						},
						{
							label: typeof props.row2Label === "string" ? props.row2Label : "",
							values: [
								typeof props.row2Col1 === "string" ? props.row2Col1 : "",
								typeof props.row2Col2 === "string" ? props.row2Col2 : "",
								typeof props.row2Col3 === "string" ? props.row2Col3 : "",
								typeof props.row2Col4 === "string" ? props.row2Col4 : "",
							],
						},
						{
							label: typeof props.row3Label === "string" ? props.row3Label : "",
							values: [
								typeof props.row3Col1 === "string" ? props.row3Col1 : "",
								typeof props.row3Col2 === "string" ? props.row3Col2 : "",
								typeof props.row3Col3 === "string" ? props.row3Col3 : "",
								typeof props.row3Col4 === "string" ? props.row3Col4 : "",
							],
						},
						{
							label: typeof props.row4Label === "string" ? props.row4Label : "",
							values: [
								typeof props.row4Col1 === "string" ? props.row4Col1 : "",
								typeof props.row4Col2 === "string" ? props.row4Col2 : "",
								typeof props.row4Col3 === "string" ? props.row4Col3 : "",
								typeof props.row4Col4 === "string" ? props.row4Col4 : "",
							],
						},
					].filter((row) => row.label || row.values.some(Boolean));
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{columns.length && rows.length ? (
								<div className="mt-4 overflow-x-auto">
									<table className="w-full border-collapse text-sm">
										<thead>
											<tr>
												<th className="bg-muted/40 border border-border px-3 py-2 text-left">特性</th>
												{columns.map((column, idx) => (
													<th
														key={`${column}-${idx}`}
														className="bg-muted/40 border border-border px-3 py-2 text-left"
													>
														{column}
													</th>
												))}
											</tr>
										</thead>
										<tbody>
											{rows.map((row, rowIdx) => (
												<tr key={`${row.label}-${rowIdx}`}>
													<td className="border border-border px-3 py-2 font-medium">
														{row.label || `行 ${rowIdx + 1}`}
													</td>
													{columns.map((_, colIdx) => (
														<td
															key={`${row.label}-${rowIdx}-${colIdx}`}
															className="border border-border px-3 py-2"
														>
															{row.values[colIdx] || "-"}
														</td>
													))}
												</tr>
											))}
										</tbody>
									</table>
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 列方案和 1 行特性。</p>
							)}
						</section>
					);
				}

				if (section.type === "team-intro-cards") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = normalizeColumnCount(props.columns);
					const gridClass =
						columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
					const members = [
						{
							name: typeof props.member1Name === "string" ? props.member1Name : "",
							role: typeof props.member1Role === "string" ? props.member1Role : "",
							bio: typeof props.member1Bio === "string" ? props.member1Bio : "",
							imageUrl: resolveBuilderBackgroundImageUrl(props.member1ImageUrl),
							profileHref: typeof props.member1ProfileHref === "string" ? props.member1ProfileHref : "",
						},
						{
							name: typeof props.member2Name === "string" ? props.member2Name : "",
							role: typeof props.member2Role === "string" ? props.member2Role : "",
							bio: typeof props.member2Bio === "string" ? props.member2Bio : "",
							imageUrl: resolveBuilderBackgroundImageUrl(props.member2ImageUrl),
							profileHref: typeof props.member2ProfileHref === "string" ? props.member2ProfileHref : "",
						},
						{
							name: typeof props.member3Name === "string" ? props.member3Name : "",
							role: typeof props.member3Role === "string" ? props.member3Role : "",
							bio: typeof props.member3Bio === "string" ? props.member3Bio : "",
							imageUrl: resolveBuilderBackgroundImageUrl(props.member3ImageUrl),
							profileHref: typeof props.member3ProfileHref === "string" ? props.member3ProfileHref : "",
						},
						{
							name: typeof props.member4Name === "string" ? props.member4Name : "",
							role: typeof props.member4Role === "string" ? props.member4Role : "",
							bio: typeof props.member4Bio === "string" ? props.member4Bio : "",
							imageUrl: resolveBuilderBackgroundImageUrl(props.member4ImageUrl),
							profileHref: typeof props.member4ProfileHref === "string" ? props.member4ProfileHref : "",
						},
					].filter(
						(member) => member.name || member.role || member.bio || member.imageUrl || member.profileHref,
					);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{members.length ? (
								<div className={`mt-4 grid grid-cols-1 gap-3 ${gridClass}`}>
									{members.map((member, idx) => (
										<div
											key={`${member.name}-${idx}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="font-medium">{member.name || `成员 ${idx + 1}`}</p>
											{member.role ? (
												<p className="mt-1 text-xs text-muted-foreground">{member.role}</p>
											) : null}
											{member.bio ? <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p> : null}
											{member.imageUrl ? (
												<p className="mt-2 text-xs text-muted-foreground">{member.imageUrl}</p>
											) : null}
											{member.profileHref ? (
												<p className="mt-2 text-xs font-medium text-primary">{member.profileHref}</p>
											) : null}
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 张团队成员卡片。</p>
							)}
						</section>
					);
				}

				if (section.type === "logo-with-cta-strip") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const logoText = typeof props.logoText === "string" ? props.logoText : "";
					const logoImageUrl = resolveBuilderBackgroundImageUrl(props.logoImageUrl);
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					const secondaryCtaLabel =
						typeof props.secondaryCtaLabel === "string" ? props.secondaryCtaLabel : "";
					const secondaryCtaHref = typeof props.secondaryCtaHref === "string" ? props.secondaryCtaHref : "";
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-lg border border-border bg-background p-4 md:flex-row md:items-center">
								<div>
									<p className="text-sm font-medium">{logoText || "品牌名称"}</p>
									{logoImageUrl ? <p className="mt-1 text-xs text-muted-foreground">{logoImageUrl}</p> : null}
								</div>
								<div className="flex flex-wrap gap-2">
									{ctaLabel ? (
										<span className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
											{ctaLabel}
											{ctaHref ? <span className="ml-1 opacity-80">({ctaHref})</span> : null}
										</span>
									) : null}
									{secondaryCtaLabel ? (
										<span className="rounded-md border border-border px-3 py-1.5 text-xs font-medium">
											{secondaryCtaLabel}
											{secondaryCtaHref ? (
												<span className="ml-1 opacity-80">({secondaryCtaHref})</span>
											) : null}
										</span>
									) : null}
								</div>
							</div>
						</section>
					);
				}

				if (section.type === "testimonial-marquee-lite") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const speed = props.speed === "slow" || props.speed === "fast" ? props.speed : "normal";
					const speedLabel = speed === "slow" ? "慢速" : speed === "fast" ? "快速" : "标准";
					const hoverLabel = props.pauseOnHover === "off" ? "关闭" : "开启";
					const items = [
						{
							quote: typeof props.item1Quote === "string" ? props.item1Quote : "",
							author: typeof props.item1Author === "string" ? props.item1Author : "",
						},
						{
							quote: typeof props.item2Quote === "string" ? props.item2Quote : "",
							author: typeof props.item2Author === "string" ? props.item2Author : "",
						},
						{
							quote: typeof props.item3Quote === "string" ? props.item3Quote : "",
							author: typeof props.item3Author === "string" ? props.item3Author : "",
						},
						{
							quote: typeof props.item4Quote === "string" ? props.item4Quote : "",
							author: typeof props.item4Author === "string" ? props.item4Author : "",
						},
						{
							quote: typeof props.item5Quote === "string" ? props.item5Quote : "",
							author: typeof props.item5Author === "string" ? props.item5Author : "",
						},
						{
							quote: typeof props.item6Quote === "string" ? props.item6Quote : "",
							author: typeof props.item6Author === "string" ? props.item6Author : "",
						},
					].filter((item) => item.quote || item.author);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
								<span>滚动速度：{speedLabel}</span>
								<span>悬停暂停：{hoverLabel}</span>
							</div>
							{items.length ? (
								<div className="mt-4 flex flex-wrap gap-2">
									{items.map((item, idx) => (
										<div
											key={`${item.quote}-${idx}`}
											className="rounded-full border border-border bg-background px-3 py-1.5 text-xs"
										>
											“{item.quote || `评价 ${idx + 1}`}”
											{item.author ? (
												<span className="ml-1 text-muted-foreground">— {item.author}</span>
											) : null}
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 条评价内容。</p>
							)}
						</section>
					);
				}

				if (section.type === "feature-icon-table") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = [
						typeof props.col1Name === "string" ? props.col1Name : "",
						typeof props.col2Name === "string" ? props.col2Name : "",
						typeof props.col3Name === "string" ? props.col3Name : "",
						typeof props.col4Name === "string" ? props.col4Name : "",
					].filter(Boolean);
					const rows = [
						{
							icon: typeof props.row1Icon === "string" ? props.row1Icon : "",
							label: typeof props.row1Label === "string" ? props.row1Label : "",
							values: [
								typeof props.row1Col1 === "string" ? props.row1Col1 : "",
								typeof props.row1Col2 === "string" ? props.row1Col2 : "",
								typeof props.row1Col3 === "string" ? props.row1Col3 : "",
								typeof props.row1Col4 === "string" ? props.row1Col4 : "",
							],
						},
						{
							icon: typeof props.row2Icon === "string" ? props.row2Icon : "",
							label: typeof props.row2Label === "string" ? props.row2Label : "",
							values: [
								typeof props.row2Col1 === "string" ? props.row2Col1 : "",
								typeof props.row2Col2 === "string" ? props.row2Col2 : "",
								typeof props.row2Col3 === "string" ? props.row2Col3 : "",
								typeof props.row2Col4 === "string" ? props.row2Col4 : "",
							],
						},
						{
							icon: typeof props.row3Icon === "string" ? props.row3Icon : "",
							label: typeof props.row3Label === "string" ? props.row3Label : "",
							values: [
								typeof props.row3Col1 === "string" ? props.row3Col1 : "",
								typeof props.row3Col2 === "string" ? props.row3Col2 : "",
								typeof props.row3Col3 === "string" ? props.row3Col3 : "",
								typeof props.row3Col4 === "string" ? props.row3Col4 : "",
							],
						},
						{
							icon: typeof props.row4Icon === "string" ? props.row4Icon : "",
							label: typeof props.row4Label === "string" ? props.row4Label : "",
							values: [
								typeof props.row4Col1 === "string" ? props.row4Col1 : "",
								typeof props.row4Col2 === "string" ? props.row4Col2 : "",
								typeof props.row4Col3 === "string" ? props.row4Col3 : "",
								typeof props.row4Col4 === "string" ? props.row4Col4 : "",
							],
						},
					].filter((row) => row.label || row.icon || row.values.some(Boolean));
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{columns.length && rows.length ? (
								<div className="mt-4 overflow-x-auto">
									<table className="w-full border-collapse text-sm">
										<thead>
											<tr>
												<th className="bg-muted/40 border border-border px-3 py-2 text-left">特性</th>
												{columns.map((column, idx) => (
													<th
														key={`${column}-${idx}`}
														className="bg-muted/40 border border-border px-3 py-2 text-left"
													>
														{column}
													</th>
												))}
											</tr>
										</thead>
										<tbody>
											{rows.map((row, rowIdx) => (
												<tr key={`${row.label}-${rowIdx}`}>
													<td className="border border-border px-3 py-2 font-medium">
														{row.icon ? <span className="mr-1">{row.icon}</span> : null}
														{row.label || `行 ${rowIdx + 1}`}
													</td>
													{columns.map((_, colIdx) => (
														<td
															key={`${row.label}-${rowIdx}-${colIdx}`}
															className="border border-border px-3 py-2"
														>
															{row.values[colIdx] || "-"}
														</td>
													))}
												</tr>
											))}
										</tbody>
									</table>
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 列方案和 1 行特性。</p>
							)}
						</section>
					);
				}

				if (section.type === "faq-two-column") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const helpTitle = typeof props.helpTitle === "string" ? props.helpTitle : "";
					const helpBody = typeof props.helpBody === "string" ? props.helpBody : "";
					const helpCtaLabel = typeof props.helpCtaLabel === "string" ? props.helpCtaLabel : "";
					const helpCtaHref = typeof props.helpCtaHref === "string" ? props.helpCtaHref : "";
					const faqs = [
						{
							question: typeof props.q1Question === "string" ? props.q1Question : "",
							answer: typeof props.q1Answer === "string" ? props.q1Answer : "",
						},
						{
							question: typeof props.q2Question === "string" ? props.q2Question : "",
							answer: typeof props.q2Answer === "string" ? props.q2Answer : "",
						},
						{
							question: typeof props.q3Question === "string" ? props.q3Question : "",
							answer: typeof props.q3Answer === "string" ? props.q3Answer : "",
						},
						{
							question: typeof props.q4Question === "string" ? props.q4Question : "",
							answer: typeof props.q4Answer === "string" ? props.q4Answer : "",
						},
					].filter((item) => item.question || item.answer);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
								<div className="space-y-3 md:col-span-2">
									{faqs.length ? (
										faqs.map((item, idx) => (
											<div
												key={`${item.question}-${idx}`}
												className="rounded-lg border border-border bg-background p-3"
											>
												<p className="text-sm font-medium">{item.question || `问题 ${idx + 1}`}</p>
												{item.answer ? (
													<p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
												) : null}
											</div>
										))
									) : (
										<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
											请至少填写 1 组问答。
										</p>
									)}
								</div>
								<div className="rounded-lg border border-border bg-background p-4">
									<p className="text-sm font-semibold">{helpTitle || "需要帮助？"}</p>
									{helpBody ? <p className="mt-2 text-sm text-muted-foreground">{helpBody}</p> : null}
									{helpCtaLabel ? (
										<p className="mt-3 text-xs font-medium text-primary">
											{helpCtaLabel}
											{helpCtaHref ? <span className="ml-1 opacity-80">({helpCtaHref})</span> : null}
										</p>
									) : null}
								</div>
							</div>
						</section>
					);
				}

				if (section.type === "product-bundle-lite") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const bundleName = typeof props.bundleName === "string" ? props.bundleName : "";
					const bundleItems =
						typeof props.bundleItems === "string"
							? props.bundleItems
									.split(/\r?\n|,/)
									.map((item) => item.trim())
									.filter(Boolean)
							: [];
					const bundlePrice = typeof props.bundlePrice === "string" ? props.bundlePrice : "";
					const bundleCompareAt = typeof props.bundleCompareAt === "string" ? props.bundleCompareAt : "";
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					const note = typeof props.note === "string" ? props.note : "";
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-4 rounded-xl border border-border bg-background p-4">
								<p className="text-sm font-semibold">{bundleName || "套餐名称"}</p>
								{bundleItems.length ? (
									<ul className="mt-3 space-y-1 text-sm text-muted-foreground">
										{bundleItems.map((item, idx) => (
											<li key={`${item}-${idx}`}>• {item}</li>
										))}
									</ul>
								) : null}
								<div className="mt-3 flex items-center gap-2">
									{bundlePrice ? <span className="text-lg font-semibold">{bundlePrice}</span> : null}
									{bundleCompareAt ? (
										<span className="text-sm text-muted-foreground line-through">{bundleCompareAt}</span>
									) : null}
								</div>
								{ctaLabel ? (
									<p className="mt-3 text-xs font-medium text-primary">
										{ctaLabel}
										{ctaHref ? <span className="ml-1 opacity-80">({ctaHref})</span> : null}
									</p>
								) : null}
								{note ? <p className="mt-2 text-xs text-muted-foreground">{note}</p> : null}
							</div>
						</section>
					);
				}

				if (section.type === "announcement-stack") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const levelMeta: Record<string, { label: string; className: string; icon: string }> = {
						info: { label: "信息", className: "bg-sky-100 text-sky-700", icon: "ℹ️" },
						success: { label: "成功", className: "bg-emerald-100 text-emerald-700", icon: "✅" },
						warning: { label: "警告", className: "bg-amber-100 text-amber-700", icon: "⚠️" },
						error: { label: "错误", className: "bg-rose-100 text-rose-700", icon: "⛔" },
					};
					const items = [
						{
							level:
								props.item1Level === "success" ||
								props.item1Level === "warning" ||
								props.item1Level === "error"
									? props.item1Level
									: "info",
							title: typeof props.item1Title === "string" ? props.item1Title : "",
							body: typeof props.item1Body === "string" ? props.item1Body : "",
						},
						{
							level:
								props.item2Level === "success" ||
								props.item2Level === "warning" ||
								props.item2Level === "error"
									? props.item2Level
									: "info",
							title: typeof props.item2Title === "string" ? props.item2Title : "",
							body: typeof props.item2Body === "string" ? props.item2Body : "",
						},
						{
							level:
								props.item3Level === "success" ||
								props.item3Level === "warning" ||
								props.item3Level === "error"
									? props.item3Level
									: "info",
							title: typeof props.item3Title === "string" ? props.item3Title : "",
							body: typeof props.item3Body === "string" ? props.item3Body : "",
						},
						{
							level:
								props.item4Level === "success" ||
								props.item4Level === "warning" ||
								props.item4Level === "error"
									? props.item4Level
									: "info",
							title: typeof props.item4Title === "string" ? props.item4Title : "",
							body: typeof props.item4Body === "string" ? props.item4Body : "",
						},
					].filter((item) => item.title || item.body);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-4 space-y-2">
								{items.length ? (
									items.map((item, idx) => {
										const meta = levelMeta[item.level];
										return (
											<div
												key={`${item.title}-${idx}`}
												className="rounded-lg border border-border bg-background p-3"
											>
												<div className="flex items-center gap-2">
													<span
														className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${meta.className}`}
													>
														{meta.icon} {meta.label}
													</span>
													<p className="text-sm font-medium">{item.title || `公告 ${idx + 1}`}</p>
												</div>
												{item.body ? <p className="mt-2 text-sm text-muted-foreground">{item.body}</p> : null}
											</div>
										);
									})
								) : (
									<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
										请至少填写 1 条公告。
									</p>
								)}
							</div>
						</section>
					);
				}

				if (section.type === "product-feature-tabs") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					const tabs = [
						{
							title: typeof props.tab1Title === "string" ? props.tab1Title : "",
							body: typeof props.tab1Body === "string" ? props.tab1Body : "",
						},
						{
							title: typeof props.tab2Title === "string" ? props.tab2Title : "",
							body: typeof props.tab2Body === "string" ? props.tab2Body : "",
						},
						{
							title: typeof props.tab3Title === "string" ? props.tab3Title : "",
							body: typeof props.tab3Body === "string" ? props.tab3Body : "",
						},
						{
							title: typeof props.tab4Title === "string" ? props.tab4Title : "",
							body: typeof props.tab4Body === "string" ? props.tab4Body : "",
						},
					].filter((item) => item.title || item.body);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{tabs.length ? (
								<div className="mt-4 space-y-2">
									<div className="flex flex-wrap gap-2">
										{tabs.map((tab, idx) => (
											<span
												key={`${tab.title}-${idx}`}
												className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium"
											>
												{tab.title || `标签 ${idx + 1}`}
											</span>
										))}
									</div>
									<div className="rounded-lg border border-border bg-background p-4">
										<p className="text-sm font-medium">{tabs[0]?.title || "标签内容"}</p>
										{tabs[0]?.body ? (
											<p className="mt-2 text-sm text-muted-foreground">{tabs[0].body}</p>
										) : null}
									</div>
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个标签。</p>
							)}
							{ctaLabel ? (
								<p className="mt-3 text-xs font-medium text-primary">
									{ctaLabel}
									{ctaHref ? <span className="ml-1 opacity-80">({ctaHref})</span> : null}
								</p>
							) : null}
						</section>
					);
				}

				if (section.type === "benefit-cards-grid") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const columns = normalizeColumnCount(props.columns);
					const gridClass =
						columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
					const cards = [
						{
							icon: typeof props.card1Icon === "string" ? props.card1Icon : "",
							title: typeof props.card1Title === "string" ? props.card1Title : "",
							body: typeof props.card1Body === "string" ? props.card1Body : "",
							ctaLabel: typeof props.card1CtaLabel === "string" ? props.card1CtaLabel : "",
							ctaHref: typeof props.card1CtaHref === "string" ? props.card1CtaHref : "",
						},
						{
							icon: typeof props.card2Icon === "string" ? props.card2Icon : "",
							title: typeof props.card2Title === "string" ? props.card2Title : "",
							body: typeof props.card2Body === "string" ? props.card2Body : "",
							ctaLabel: typeof props.card2CtaLabel === "string" ? props.card2CtaLabel : "",
							ctaHref: typeof props.card2CtaHref === "string" ? props.card2CtaHref : "",
						},
						{
							icon: typeof props.card3Icon === "string" ? props.card3Icon : "",
							title: typeof props.card3Title === "string" ? props.card3Title : "",
							body: typeof props.card3Body === "string" ? props.card3Body : "",
							ctaLabel: typeof props.card3CtaLabel === "string" ? props.card3CtaLabel : "",
							ctaHref: typeof props.card3CtaHref === "string" ? props.card3CtaHref : "",
						},
						{
							icon: typeof props.card4Icon === "string" ? props.card4Icon : "",
							title: typeof props.card4Title === "string" ? props.card4Title : "",
							body: typeof props.card4Body === "string" ? props.card4Body : "",
							ctaLabel: typeof props.card4CtaLabel === "string" ? props.card4CtaLabel : "",
							ctaHref: typeof props.card4CtaHref === "string" ? props.card4CtaHref : "",
						},
					].filter((card) => card.icon || card.title || card.body || card.ctaLabel || card.ctaHref);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{cards.length ? (
								<div className={`mt-4 grid grid-cols-1 gap-3 ${gridClass}`}>
									{cards.map((card, idx) => (
										<div
											key={`${card.title}-${idx}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											{card.icon ? <p className="text-lg">{card.icon}</p> : null}
											<p className="mt-1 font-medium">{card.title || `卡片 ${idx + 1}`}</p>
											{card.body ? <p className="mt-2 text-sm text-muted-foreground">{card.body}</p> : null}
											{card.ctaLabel ? (
												<p className="mt-2 text-xs font-medium text-primary">
													{card.ctaLabel}
													{card.ctaHref ? <span className="ml-1 opacity-80">({card.ctaHref})</span> : null}
												</p>
											) : null}
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 张利益点卡片。</p>
							)}
						</section>
					);
				}

				if (section.type === "shipping-returns-panel") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const primaryCtaLabel = typeof props.primaryCtaLabel === "string" ? props.primaryCtaLabel : "";
					const primaryCtaHref = typeof props.primaryCtaHref === "string" ? props.primaryCtaHref : "";
					const secondaryCtaLabel =
						typeof props.secondaryCtaLabel === "string" ? props.secondaryCtaLabel : "";
					const secondaryCtaHref = typeof props.secondaryCtaHref === "string" ? props.secondaryCtaHref : "";
					const panels = [
						{
							title: typeof props.shippingTitle === "string" ? props.shippingTitle : "",
							body: typeof props.shippingBody === "string" ? props.shippingBody : "",
						},
						{
							title: typeof props.returnsTitle === "string" ? props.returnsTitle : "",
							body: typeof props.returnsBody === "string" ? props.returnsBody : "",
						},
						{
							title: typeof props.paymentTitle === "string" ? props.paymentTitle : "",
							body: typeof props.paymentBody === "string" ? props.paymentBody : "",
						},
						{
							title: typeof props.supportTitle === "string" ? props.supportTitle : "",
							body: typeof props.supportBody === "string" ? props.supportBody : "",
						},
					].filter((panel) => panel.title || panel.body);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{panels.length ? (
								<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
									{panels.map((panel, idx) => (
										<div
											key={`${panel.title}-${idx}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="text-sm font-medium">{panel.title || `面板 ${idx + 1}`}</p>
											{panel.body ? <p className="mt-2 text-sm text-muted-foreground">{panel.body}</p> : null}
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写发货或退换信息。</p>
							)}
							<div className="mt-3 flex flex-wrap gap-2">
								{primaryCtaLabel ? (
									<p className="text-xs font-medium text-primary">
										{primaryCtaLabel}
										{primaryCtaHref ? <span className="ml-1 opacity-80">({primaryCtaHref})</span> : null}
									</p>
								) : null}
								{secondaryCtaLabel ? (
									<p className="text-xs font-medium text-primary">
										{secondaryCtaLabel}
										{secondaryCtaHref ? <span className="ml-1 opacity-80">({secondaryCtaHref})</span> : null}
									</p>
								) : null}
							</div>
						</section>
					);
				}

				if (section.type === "support-contact-split") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const leftTitle = typeof props.leftTitle === "string" ? props.leftTitle : "";
					const leftBody = typeof props.leftBody === "string" ? props.leftBody : "";
					const slaTitle = typeof props.slaTitle === "string" ? props.slaTitle : "";
					const slaBody = typeof props.slaBody === "string" ? props.slaBody : "";
					const slaBadge = typeof props.slaBadge === "string" ? props.slaBadge : "";
					const primaryCtaLabel = typeof props.primaryCtaLabel === "string" ? props.primaryCtaLabel : "";
					const primaryCtaHref = typeof props.primaryCtaHref === "string" ? props.primaryCtaHref : "";
					const secondaryCtaLabel =
						typeof props.secondaryCtaLabel === "string" ? props.secondaryCtaLabel : "";
					const secondaryCtaHref = typeof props.secondaryCtaHref === "string" ? props.secondaryCtaHref : "";
					const channels = [
						{
							label: typeof props.channel1Label === "string" ? props.channel1Label : "",
							value: typeof props.channel1Value === "string" ? props.channel1Value : "",
							href: typeof props.channel1Href === "string" ? props.channel1Href : "",
						},
						{
							label: typeof props.channel2Label === "string" ? props.channel2Label : "",
							value: typeof props.channel2Value === "string" ? props.channel2Value : "",
							href: typeof props.channel2Href === "string" ? props.channel2Href : "",
						},
						{
							label: typeof props.channel3Label === "string" ? props.channel3Label : "",
							value: typeof props.channel3Value === "string" ? props.channel3Value : "",
							href: typeof props.channel3Href === "string" ? props.channel3Href : "",
						},
					].filter((channel) => channel.label || channel.value || channel.href);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="rounded-lg border border-border bg-background p-4">
									<p className="text-sm font-semibold">{leftTitle || "联系渠道"}</p>
									{leftBody ? <p className="mt-2 text-sm text-muted-foreground">{leftBody}</p> : null}
									{channels.length ? (
										<div className="mt-3 space-y-2">
											{channels.map((channel, idx) => (
												<div
													key={`${channel.label}-${idx}`}
													className="rounded-md border border-border px-3 py-2"
												>
													<p className="text-xs font-medium">{channel.label || `渠道 ${idx + 1}`}</p>
													{channel.value ? (
														<p className="mt-1 text-xs text-muted-foreground">{channel.value}</p>
													) : null}
													{channel.href ? <p className="mt-1 text-xs text-primary">{channel.href}</p> : null}
												</div>
											))}
										</div>
									) : null}
								</div>
								<div className="rounded-lg border border-border bg-background p-4">
									<div className="flex items-center gap-2">
										<p className="text-sm font-semibold">{slaTitle || "服务承诺"}</p>
										{slaBadge ? (
											<span className="bg-primary/10 rounded-full px-2 py-0.5 text-[11px] font-medium text-primary">
												{slaBadge}
											</span>
										) : null}
									</div>
									{slaBody ? <p className="mt-2 text-sm text-muted-foreground">{slaBody}</p> : null}
									<div className="mt-3 flex flex-wrap gap-2">
										{primaryCtaLabel ? (
											<p className="text-xs font-medium text-primary">
												{primaryCtaLabel}
												{primaryCtaHref ? <span className="ml-1 opacity-80">({primaryCtaHref})</span> : null}
											</p>
										) : null}
										{secondaryCtaLabel ? (
											<p className="text-xs font-medium text-primary">
												{secondaryCtaLabel}
												{secondaryCtaHref ? (
													<span className="ml-1 opacity-80">({secondaryCtaHref})</span>
												) : null}
											</p>
										) : null}
									</div>
								</div>
							</div>
						</section>
					);
				}

				if (section.type === "faq-category-pills") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const defaultCategory =
						props.defaultCategory === "category2" || props.defaultCategory === "category3"
							? props.defaultCategory
							: "category1";
					const helpCtaLabel = typeof props.helpCtaLabel === "string" ? props.helpCtaLabel : "";
					const helpCtaHref = typeof props.helpCtaHref === "string" ? props.helpCtaHref : "";
					const categories = [
						{
							key: "category1",
							name: typeof props.category1Name === "string" ? props.category1Name : "",
							qa: [
								{
									q: typeof props.category1Q1 === "string" ? props.category1Q1 : "",
									a: typeof props.category1A1 === "string" ? props.category1A1 : "",
								},
								{
									q: typeof props.category1Q2 === "string" ? props.category1Q2 : "",
									a: typeof props.category1A2 === "string" ? props.category1A2 : "",
								},
							].filter((item) => item.q || item.a),
						},
						{
							key: "category2",
							name: typeof props.category2Name === "string" ? props.category2Name : "",
							qa: [
								{
									q: typeof props.category2Q1 === "string" ? props.category2Q1 : "",
									a: typeof props.category2A1 === "string" ? props.category2A1 : "",
								},
								{
									q: typeof props.category2Q2 === "string" ? props.category2Q2 : "",
									a: typeof props.category2A2 === "string" ? props.category2A2 : "",
								},
							].filter((item) => item.q || item.a),
						},
						{
							key: "category3",
							name: typeof props.category3Name === "string" ? props.category3Name : "",
							qa: [
								{
									q: typeof props.category3Q1 === "string" ? props.category3Q1 : "",
									a: typeof props.category3A1 === "string" ? props.category3A1 : "",
								},
								{
									q: typeof props.category3Q2 === "string" ? props.category3Q2 : "",
									a: typeof props.category3A2 === "string" ? props.category3A2 : "",
								},
							].filter((item) => item.q || item.a),
						},
					].filter((category) => category.name || category.qa.length);
					const activeCategory =
						categories.find((category) => category.key === defaultCategory) || categories[0];
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{categories.length ? (
								<>
									<div className="mt-4 flex flex-wrap gap-2">
										{categories.map((category, idx) => (
											<span
												key={`${category.name}-${idx}`}
												className={`rounded-full border px-3 py-1 text-xs font-medium ${
													category.key === (activeCategory?.key || "")
														? "border-primary text-primary"
														: "border-border"
												}`}
											>
												{category.name || `分类 ${idx + 1}`}
											</span>
										))}
									</div>
									<div className="mt-3 space-y-2">
										{(activeCategory?.qa || []).map((item, idx) => (
											<div
												key={`${item.q}-${idx}`}
												className="rounded-lg border border-border bg-background p-3"
											>
												<p className="text-sm font-medium">{item.q || `问题 ${idx + 1}`}</p>
												{item.a ? <p className="mt-2 text-sm text-muted-foreground">{item.a}</p> : null}
											</div>
										))}
									</div>
								</>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个 FAQ 分类。</p>
							)}
							{helpCtaLabel ? (
								<p className="mt-3 text-xs font-medium text-primary">
									{helpCtaLabel}
									{helpCtaHref ? <span className="ml-1 opacity-80">({helpCtaHref})</span> : null}
								</p>
							) : null}
						</section>
					);
				}

				if (section.type === "promo-tile-mosaic") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const tiles = [
						{
							badge: typeof props.tile1Badge === "string" ? props.tile1Badge : "",
							title: typeof props.tile1Title === "string" ? props.tile1Title : "",
							body: typeof props.tile1Body === "string" ? props.tile1Body : "",
							ctaLabel: typeof props.tile1CtaLabel === "string" ? props.tile1CtaLabel : "",
							ctaHref: typeof props.tile1CtaHref === "string" ? props.tile1CtaHref : "",
						},
						{
							badge: typeof props.tile2Badge === "string" ? props.tile2Badge : "",
							title: typeof props.tile2Title === "string" ? props.tile2Title : "",
							body: typeof props.tile2Body === "string" ? props.tile2Body : "",
							ctaLabel: typeof props.tile2CtaLabel === "string" ? props.tile2CtaLabel : "",
							ctaHref: typeof props.tile2CtaHref === "string" ? props.tile2CtaHref : "",
						},
						{
							badge: typeof props.tile3Badge === "string" ? props.tile3Badge : "",
							title: typeof props.tile3Title === "string" ? props.tile3Title : "",
							body: typeof props.tile3Body === "string" ? props.tile3Body : "",
							ctaLabel: typeof props.tile3CtaLabel === "string" ? props.tile3CtaLabel : "",
							ctaHref: typeof props.tile3CtaHref === "string" ? props.tile3CtaHref : "",
						},
						{
							badge: typeof props.tile4Badge === "string" ? props.tile4Badge : "",
							title: typeof props.tile4Title === "string" ? props.tile4Title : "",
							body: typeof props.tile4Body === "string" ? props.tile4Body : "",
							ctaLabel: typeof props.tile4CtaLabel === "string" ? props.tile4CtaLabel : "",
							ctaHref: typeof props.tile4CtaHref === "string" ? props.tile4CtaHref : "",
						},
					].filter((tile) => tile.badge || tile.title || tile.body || tile.ctaLabel || tile.ctaHref);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							{tiles.length ? (
								<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
									{tiles.map((tile, idx) => (
										<div
											key={`${tile.title}-${idx}`}
											className="rounded-lg border border-border bg-background p-4"
										>
											{tile.badge ? (
												<span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
													{tile.badge}
												</span>
											) : null}
											<p className="mt-2 text-sm font-medium">{tile.title || `促销 ${idx + 1}`}</p>
											{tile.body ? <p className="mt-2 text-sm text-muted-foreground">{tile.body}</p> : null}
											{tile.ctaLabel ? (
												<p className="mt-2 text-xs font-medium text-primary">
													{tile.ctaLabel}
													{tile.ctaHref ? <span className="ml-1 opacity-80">({tile.ctaHref})</span> : null}
												</p>
											) : null}
										</div>
									))}
								</div>
							) : (
								<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 张促销卡片。</p>
							)}
						</section>
					);
				}

				if (section.type === "bundle-price-breakdown") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const planName = typeof props.planName === "string" ? props.planName : "";
					const totalLabel = typeof props.totalLabel === "string" ? props.totalLabel : "";
					const totalPrice = typeof props.totalPrice === "string" ? props.totalPrice : "";
					const saveLabel = typeof props.saveLabel === "string" ? props.saveLabel : "";
					const saveValue = typeof props.saveValue === "string" ? props.saveValue : "";
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					const note = typeof props.note === "string" ? props.note : "";
					const items = [
						{
							label: typeof props.item1Label === "string" ? props.item1Label : "",
							price: typeof props.item1Price === "string" ? props.item1Price : "",
						},
						{
							label: typeof props.item2Label === "string" ? props.item2Label : "",
							price: typeof props.item2Price === "string" ? props.item2Price : "",
						},
						{
							label: typeof props.item3Label === "string" ? props.item3Label : "",
							price: typeof props.item3Price === "string" ? props.item3Price : "",
						},
					].filter((item) => item.label || item.price);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-4 rounded-lg border border-border bg-background p-4">
								<p className="text-sm font-semibold">{planName || "套餐名称"}</p>
								{items.length ? (
									<div className="mt-3 space-y-2">
										{items.map((item, idx) => (
											<div key={`${item.label}-${idx}`} className="flex items-center justify-between text-sm">
												<span>{item.label || `条目 ${idx + 1}`}</span>
												<span className="font-medium">{item.price || "-"}</span>
											</div>
										))}
									</div>
								) : null}
								<div className="mt-3 flex flex-wrap items-center gap-3">
									{totalLabel ? <span className="text-sm">{totalLabel}</span> : null}
									{totalPrice ? <span className="text-lg font-semibold">{totalPrice}</span> : null}
									{saveLabel || saveValue ? (
										<span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
											{saveLabel || "节省"} {saveValue || ""}
										</span>
									) : null}
								</div>
								{ctaLabel ? (
									<p className="mt-2 text-xs font-medium text-primary">
										{ctaLabel}
										{ctaHref ? <span className="ml-1 opacity-80">({ctaHref})</span> : null}
									</p>
								) : null}
								{note ? <p className="mt-2 text-xs text-muted-foreground">{note}</p> : null}
							</div>
						</section>
					);
				}

				if (section.type === "store-hours-status") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const timezoneLabel = typeof props.timezoneLabel === "string" ? props.timezoneLabel : "";
					const statusMode =
						props.statusMode === "closed" || props.statusMode === "notice" ? props.statusMode : "open";
					const statusText = typeof props.statusText === "string" ? props.statusText : "";
					const weekdayHours = typeof props.weekdayHours === "string" ? props.weekdayHours : "";
					const weekendHours = typeof props.weekendHours === "string" ? props.weekendHours : "";
					const holidayHours = typeof props.holidayHours === "string" ? props.holidayHours : "";
					const noticeText = typeof props.noticeText === "string" ? props.noticeText : "";
					const primaryCtaLabel = typeof props.primaryCtaLabel === "string" ? props.primaryCtaLabel : "";
					const primaryCtaHref = typeof props.primaryCtaHref === "string" ? props.primaryCtaHref : "";
					const secondaryCtaLabel =
						typeof props.secondaryCtaLabel === "string" ? props.secondaryCtaLabel : "";
					const secondaryCtaHref = typeof props.secondaryCtaHref === "string" ? props.secondaryCtaHref : "";
					const statusMeta =
						statusMode === "closed"
							? { text: "已打烊", className: "bg-slate-100 text-slate-700" }
							: statusMode === "notice"
								? { text: "公告", className: "bg-amber-100 text-amber-700" }
								: { text: "营业中", className: "bg-emerald-100 text-emerald-700" };
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-4 rounded-lg border border-border bg-background p-4">
								<div className="flex flex-wrap items-center gap-2">
									<span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusMeta.className}`}>
										{statusMeta.text}
									</span>
									{statusText ? <span className="text-sm font-medium">{statusText}</span> : null}
									{timezoneLabel ? (
										<span className="text-xs text-muted-foreground">({timezoneLabel})</span>
									) : null}
								</div>
								<div className="mt-3 space-y-1 text-sm text-muted-foreground">
									{weekdayHours ? <p>工作日：{weekdayHours}</p> : null}
									{weekendHours ? <p>周末：{weekendHours}</p> : null}
									{holidayHours ? <p>节假日：{holidayHours}</p> : null}
								</div>
								{noticeText ? <p className="mt-2 text-sm text-muted-foreground">{noticeText}</p> : null}
								<div className="mt-2 flex flex-wrap gap-2">
									{primaryCtaLabel ? (
										<p className="text-xs font-medium text-primary">
											{primaryCtaLabel}
											{primaryCtaHref ? <span className="ml-1 opacity-80">({primaryCtaHref})</span> : null}
										</p>
									) : null}
									{secondaryCtaLabel ? (
										<p className="text-xs font-medium text-primary">
											{secondaryCtaLabel}
											{secondaryCtaHref ? (
												<span className="ml-1 opacity-80">({secondaryCtaHref})</span>
											) : null}
										</p>
									) : null}
								</div>
							</div>
						</section>
					);
				}

				if (section.type === "trust-faq-strip") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					const trusts = [
						{
							icon: typeof props.trust1Icon === "string" ? props.trust1Icon : "",
							label: typeof props.trust1Label === "string" ? props.trust1Label : "",
						},
						{
							icon: typeof props.trust2Icon === "string" ? props.trust2Icon : "",
							label: typeof props.trust2Label === "string" ? props.trust2Label : "",
						},
						{
							icon: typeof props.trust3Icon === "string" ? props.trust3Icon : "",
							label: typeof props.trust3Label === "string" ? props.trust3Label : "",
						},
					].filter((item) => item.icon || item.label);
					const faqs = [
						{
							q: typeof props.faq1Q === "string" ? props.faq1Q : "",
							a: typeof props.faq1A === "string" ? props.faq1A : "",
						},
						{
							q: typeof props.faq2Q === "string" ? props.faq2Q : "",
							a: typeof props.faq2A === "string" ? props.faq2A : "",
						},
						{
							q: typeof props.faq3Q === "string" ? props.faq3Q : "",
							a: typeof props.faq3A === "string" ? props.faq3A : "",
						},
					].filter((item) => item.q || item.a);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
								<div className="space-y-2">
									{trusts.length ? (
										trusts.map((item, idx) => (
											<div
												key={`${item.label}-${idx}`}
												className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
											>
												{item.icon ? <span className="mr-1">{item.icon}</span> : null}
												{item.label || `保障 ${idx + 1}`}
											</div>
										))
									) : (
										<p className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
											请填写至少 1 条信任信息。
										</p>
									)}
								</div>
								<div className="space-y-2 md:col-span-2">
									{faqs.length ? (
										faqs.map((item, idx) => (
											<div
												key={`${item.q}-${idx}`}
												className="rounded-lg border border-border bg-background p-3"
											>
												<p className="text-sm font-medium">{item.q || `问题 ${idx + 1}`}</p>
												{item.a ? <p className="mt-1 text-sm text-muted-foreground">{item.a}</p> : null}
											</div>
										))
									) : (
										<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
											请填写至少 1 条 FAQ。
										</p>
									)}
								</div>
							</div>
							{ctaLabel ? (
								<p className="mt-3 text-xs font-medium text-primary">
									{ctaLabel}
									{ctaHref ? <span className="ml-1 opacity-80">({ctaHref})</span> : null}
								</p>
							) : null}
						</section>
					);
				}

				if (section.type === "usp-metrics-split") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					const usps = [
						{
							title: typeof props.usp1Title === "string" ? props.usp1Title : "",
							body: typeof props.usp1Body === "string" ? props.usp1Body : "",
						},
						{
							title: typeof props.usp2Title === "string" ? props.usp2Title : "",
							body: typeof props.usp2Body === "string" ? props.usp2Body : "",
						},
						{
							title: typeof props.usp3Title === "string" ? props.usp3Title : "",
							body: typeof props.usp3Body === "string" ? props.usp3Body : "",
						},
					].filter((item) => item.title || item.body);
					const metrics = [
						{
							label: typeof props.metric1Label === "string" ? props.metric1Label : "",
							value: typeof props.metric1Value === "string" ? props.metric1Value : "",
							note: typeof props.metric1Note === "string" ? props.metric1Note : "",
						},
						{
							label: typeof props.metric2Label === "string" ? props.metric2Label : "",
							value: typeof props.metric2Value === "string" ? props.metric2Value : "",
							note: typeof props.metric2Note === "string" ? props.metric2Note : "",
						},
						{
							label: typeof props.metric3Label === "string" ? props.metric3Label : "",
							value: typeof props.metric3Value === "string" ? props.metric3Value : "",
							note: typeof props.metric3Note === "string" ? props.metric3Note : "",
						},
					].filter((item) => item.label || item.value || item.note);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									{usps.length ? (
										usps.map((item, idx) => (
											<div
												key={`${item.title}-${idx}`}
												className="rounded-lg border border-border bg-background p-3"
											>
												<p className="text-sm font-medium">{item.title || `卖点 ${idx + 1}`}</p>
												{item.body ? <p className="mt-1 text-sm text-muted-foreground">{item.body}</p> : null}
											</div>
										))
									) : (
										<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
											请填写至少 1 个卖点。
										</p>
									)}
								</div>
								<div className="space-y-2">
									{metrics.length ? (
										metrics.map((item, idx) => (
											<div
												key={`${item.label}-${idx}`}
												className="rounded-lg border border-border bg-background p-3"
											>
												<p className="text-xs text-muted-foreground">{item.label || `指标 ${idx + 1}`}</p>
												{item.value ? <p className="text-lg font-semibold">{item.value}</p> : null}
												{item.note ? <p className="text-xs text-muted-foreground">{item.note}</p> : null}
											</div>
										))
									) : (
										<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
											请填写至少 1 个指标。
										</p>
									)}
								</div>
							</div>
							{ctaLabel ? (
								<p className="mt-3 text-xs font-medium text-primary">
									{ctaLabel}
									{ctaHref ? <span className="ml-1 opacity-80">({ctaHref})</span> : null}
								</p>
							) : null}
						</section>
					);
				}

				if (section.type === "category-promo-rail") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const categories = [
						{
							name: typeof props.category1Name === "string" ? props.category1Name : "",
							href: typeof props.category1Href === "string" ? props.category1Href : "",
						},
						{
							name: typeof props.category2Name === "string" ? props.category2Name : "",
							href: typeof props.category2Href === "string" ? props.category2Href : "",
						},
						{
							name: typeof props.category3Name === "string" ? props.category3Name : "",
							href: typeof props.category3Href === "string" ? props.category3Href : "",
						},
					].filter((item) => item.name || item.href);
					const promos = [
						{
							badge: typeof props.promo1Badge === "string" ? props.promo1Badge : "",
							title: typeof props.promo1Title === "string" ? props.promo1Title : "",
							body: typeof props.promo1Body === "string" ? props.promo1Body : "",
							ctaLabel: typeof props.promo1CtaLabel === "string" ? props.promo1CtaLabel : "",
							ctaHref: typeof props.promo1CtaHref === "string" ? props.promo1CtaHref : "",
						},
						{
							badge: typeof props.promo2Badge === "string" ? props.promo2Badge : "",
							title: typeof props.promo2Title === "string" ? props.promo2Title : "",
							body: typeof props.promo2Body === "string" ? props.promo2Body : "",
							ctaLabel: typeof props.promo2CtaLabel === "string" ? props.promo2CtaLabel : "",
							ctaHref: typeof props.promo2CtaHref === "string" ? props.promo2CtaHref : "",
						},
					].filter((item) => item.badge || item.title || item.body || item.ctaLabel || item.ctaHref);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
								<div className="space-y-2">
									{categories.length ? (
										categories.map((item, idx) => (
											<div
												key={`${item.name}-${idx}`}
												className="rounded-lg border border-border bg-background px-3 py-2"
											>
												<p className="text-sm font-medium">{item.name || `分类 ${idx + 1}`}</p>
												{item.href ? <p className="text-xs text-muted-foreground">{item.href}</p> : null}
											</div>
										))
									) : (
										<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
											请填写至少 1 个分类入口。
										</p>
									)}
								</div>
								<div className="space-y-2 md:col-span-2">
									{promos.length ? (
										promos.map((item, idx) => (
											<div
												key={`${item.title}-${idx}`}
												className="rounded-lg border border-border bg-background p-3"
											>
												{item.badge ? (
													<span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
														{item.badge}
													</span>
												) : null}
												<p className="mt-2 text-sm font-medium">{item.title || `促销 ${idx + 1}`}</p>
												{item.body ? <p className="mt-1 text-sm text-muted-foreground">{item.body}</p> : null}
												{item.ctaLabel ? (
													<p className="mt-2 text-xs font-medium text-primary">
														{item.ctaLabel}
														{item.ctaHref ? <span className="ml-1 opacity-80">({item.ctaHref})</span> : null}
													</p>
												) : null}
											</div>
										))
									) : (
										<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
											请填写至少 1 个促销卡片。
										</p>
									)}
								</div>
							</div>
						</section>
					);
				}

				if (section.type === "helpdesk-quick-faq") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const faqs = [
						{
							q: typeof props.faq1Q === "string" ? props.faq1Q : "",
							a: typeof props.faq1A === "string" ? props.faq1A : "",
						},
						{
							q: typeof props.faq2Q === "string" ? props.faq2Q : "",
							a: typeof props.faq2A === "string" ? props.faq2A : "",
						},
						{
							q: typeof props.faq3Q === "string" ? props.faq3Q : "",
							a: typeof props.faq3A === "string" ? props.faq3A : "",
						},
					].filter((item) => item.q || item.a);
					const channels = [
						{
							label: typeof props.channel1Label === "string" ? props.channel1Label : "",
							value: typeof props.channel1Value === "string" ? props.channel1Value : "",
							href: typeof props.channel1Href === "string" ? props.channel1Href : "",
						},
						{
							label: typeof props.channel2Label === "string" ? props.channel2Label : "",
							value: typeof props.channel2Value === "string" ? props.channel2Value : "",
							href: typeof props.channel2Href === "string" ? props.channel2Href : "",
						},
					].filter((item) => item.label || item.value || item.href);
					const primaryCtaLabel = typeof props.primaryCtaLabel === "string" ? props.primaryCtaLabel : "";
					const primaryCtaHref = typeof props.primaryCtaHref === "string" ? props.primaryCtaHref : "";
					const secondaryCtaLabel =
						typeof props.secondaryCtaLabel === "string" ? props.secondaryCtaLabel : "";
					const secondaryCtaHref = typeof props.secondaryCtaHref === "string" ? props.secondaryCtaHref : "";
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									{faqs.length ? (
										faqs.map((item, idx) => (
											<div
												key={`${item.q}-${idx}`}
												className="rounded-lg border border-border bg-background p-3"
											>
												<p className="text-sm font-medium">{item.q || `问题 ${idx + 1}`}</p>
												{item.a ? <p className="mt-1 text-sm text-muted-foreground">{item.a}</p> : null}
											</div>
										))
									) : (
										<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
											请填写至少 1 条 FAQ。
										</p>
									)}
								</div>
								<div className="space-y-2">
									{channels.length
										? channels.map((item, idx) => (
												<div
													key={`${item.label}-${idx}`}
													className="rounded-lg border border-border bg-background p-3"
												>
													<p className="text-sm font-medium">{item.label || `渠道 ${idx + 1}`}</p>
													{item.value ? (
														<p className="mt-1 text-sm text-muted-foreground">{item.value}</p>
													) : null}
													{item.href ? (
														<p className="mt-1 text-xs text-muted-foreground">{item.href}</p>
													) : null}
												</div>
											))
										: null}
									{primaryCtaLabel ? (
										<p className="text-xs font-medium text-primary">
											{primaryCtaLabel}
											{primaryCtaHref ? <span className="ml-1 opacity-80">({primaryCtaHref})</span> : null}
										</p>
									) : null}
									{secondaryCtaLabel ? (
										<p className="text-xs font-medium text-primary">
											{secondaryCtaLabel}
											{secondaryCtaHref ? (
												<span className="ml-1 opacity-80">({secondaryCtaHref})</span>
											) : null}
										</p>
									) : null}
								</div>
							</div>
						</section>
					);
				}

				if (section.type === "sticky-announcement-queue") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const autoRotateSeconds = typeof props.autoRotateSeconds === "number" ? props.autoRotateSeconds : 5;
					const announcements = [
						{
							text: typeof props.announce1Text === "string" ? props.announce1Text : "",
							level:
								props.announce1Level === "success" || props.announce1Level === "warning"
									? props.announce1Level
									: "info",
							href: typeof props.announce1Href === "string" ? props.announce1Href : "",
						},
						{
							text: typeof props.announce2Text === "string" ? props.announce2Text : "",
							level:
								props.announce2Level === "success" || props.announce2Level === "warning"
									? props.announce2Level
									: "info",
							href: typeof props.announce2Href === "string" ? props.announce2Href : "",
						},
						{
							text: typeof props.announce3Text === "string" ? props.announce3Text : "",
							level:
								props.announce3Level === "success" || props.announce3Level === "warning"
									? props.announce3Level
									: "info",
							href: typeof props.announce3Href === "string" ? props.announce3Href : "",
						},
					].filter((item) => item.text || item.href);
					const levelClass = (level: string) =>
						level === "success"
							? "bg-emerald-100 text-emerald-700"
							: level === "warning"
								? "bg-amber-100 text-amber-700"
								: "bg-slate-100 text-slate-700";
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							<p className="mt-2 text-xs text-muted-foreground">
								自动轮播：{autoRotateSeconds}s（预览为静态列表）
							</p>
							<div className="mt-3 space-y-2">
								{announcements.length ? (
									announcements.map((item, idx) => (
										<div
											key={`${item.text}-${idx}`}
											className="rounded-lg border border-border bg-background px-3 py-2"
										>
											<span
												className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${levelClass(
													item.level,
												)}`}
											>
												{item.level === "success" ? "成功" : item.level === "warning" ? "提醒" : "信息"}
											</span>
											<p className="mt-1 text-sm">{item.text || `公告 ${idx + 1}`}</p>
											{item.href ? <p className="text-xs text-muted-foreground">{item.href}</p> : null}
										</div>
									))
								) : (
									<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
										请至少填写 1 条公告。
									</p>
								)}
							</div>
						</section>
					);
				}

				if (section.type === "tiered-pricing-table") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const highlightTier =
						props.highlightTier === "tier1" || props.highlightTier === "tier3"
							? props.highlightTier
							: "tier2";
					const tiers = [
						{
							key: "tier1",
							name: typeof props.tier1Name === "string" ? props.tier1Name : "",
							price: typeof props.tier1Price === "string" ? props.tier1Price : "",
							features: typeof props.tier1Features === "string" ? props.tier1Features : "",
							ctaLabel: typeof props.tier1CtaLabel === "string" ? props.tier1CtaLabel : "",
							ctaHref: typeof props.tier1CtaHref === "string" ? props.tier1CtaHref : "",
						},
						{
							key: "tier2",
							name: typeof props.tier2Name === "string" ? props.tier2Name : "",
							price: typeof props.tier2Price === "string" ? props.tier2Price : "",
							features: typeof props.tier2Features === "string" ? props.tier2Features : "",
							ctaLabel: typeof props.tier2CtaLabel === "string" ? props.tier2CtaLabel : "",
							ctaHref: typeof props.tier2CtaHref === "string" ? props.tier2CtaHref : "",
						},
						{
							key: "tier3",
							name: typeof props.tier3Name === "string" ? props.tier3Name : "",
							price: typeof props.tier3Price === "string" ? props.tier3Price : "",
							features: typeof props.tier3Features === "string" ? props.tier3Features : "",
							ctaLabel: typeof props.tier3CtaLabel === "string" ? props.tier3CtaLabel : "",
							ctaHref: typeof props.tier3CtaHref === "string" ? props.tier3CtaHref : "",
						},
					].filter((item) => item.name || item.price || item.features || item.ctaLabel || item.ctaHref);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
								{tiers.length ? (
									tiers.map((tier, idx) => (
										<div
											key={`${tier.key}-${idx}`}
											className={`rounded-lg border p-3 ${
												tier.key === highlightTier
													? "bg-primary/5 border-primary"
													: "border-border bg-background"
											}`}
										>
											<p className="text-sm font-semibold">{tier.name || `方案 ${idx + 1}`}</p>
											{tier.price ? <p className="mt-1 text-lg font-semibold">{tier.price}</p> : null}
											{tier.features ? (
												<p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
													{tier.features}
												</p>
											) : null}
											{tier.ctaLabel ? (
												<p className="mt-2 text-xs font-medium text-primary">
													{tier.ctaLabel}
													{tier.ctaHref ? <span className="ml-1 opacity-80">({tier.ctaHref})</span> : null}
												</p>
											) : null}
										</div>
									))
								) : (
									<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
										请至少填写 1 个方案。
									</p>
								)}
							</div>
						</section>
					);
				}

				if (section.type === "service-process-steps") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const note = typeof props.note === "string" ? props.note : "";
					const primaryCtaLabel = typeof props.primaryCtaLabel === "string" ? props.primaryCtaLabel : "";
					const primaryCtaHref = typeof props.primaryCtaHref === "string" ? props.primaryCtaHref : "";
					const secondaryCtaLabel =
						typeof props.secondaryCtaLabel === "string" ? props.secondaryCtaLabel : "";
					const secondaryCtaHref = typeof props.secondaryCtaHref === "string" ? props.secondaryCtaHref : "";
					const steps = [
						{
							title: typeof props.step1Title === "string" ? props.step1Title : "",
							body: typeof props.step1Body === "string" ? props.step1Body : "",
						},
						{
							title: typeof props.step2Title === "string" ? props.step2Title : "",
							body: typeof props.step2Body === "string" ? props.step2Body : "",
						},
						{
							title: typeof props.step3Title === "string" ? props.step3Title : "",
							body: typeof props.step3Body === "string" ? props.step3Body : "",
						},
						{
							title: typeof props.step4Title === "string" ? props.step4Title : "",
							body: typeof props.step4Body === "string" ? props.step4Body : "",
						},
					].filter((item) => item.title || item.body);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
								{steps.length ? (
									steps.map((step, idx) => (
										<div
											key={`${step.title}-${idx}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="text-xs text-muted-foreground">步骤 {idx + 1}</p>
											<p className="text-sm font-medium">{step.title || `步骤 ${idx + 1}`}</p>
											{step.body ? <p className="mt-1 text-sm text-muted-foreground">{step.body}</p> : null}
										</div>
									))
								) : (
									<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
										请至少填写 1 个步骤。
									</p>
								)}
							</div>
							{note ? <p className="mt-2 text-xs text-muted-foreground">{note}</p> : null}
							<div className="mt-2 space-y-1">
								{primaryCtaLabel ? (
									<p className="text-xs font-medium text-primary">
										{primaryCtaLabel}
										{primaryCtaHref ? <span className="ml-1 opacity-80">({primaryCtaHref})</span> : null}
									</p>
								) : null}
								{secondaryCtaLabel ? (
									<p className="text-xs font-medium text-primary">
										{secondaryCtaLabel}
										{secondaryCtaHref ? <span className="ml-1 opacity-80">({secondaryCtaHref})</span> : null}
									</p>
								) : null}
							</div>
						</section>
					);
				}

				if (section.type === "inventory-availability-matrix") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const warehouseNote = typeof props.warehouseNote === "string" ? props.warehouseNote : "";
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					const items = [
						{
							name: typeof props.item1Name === "string" ? props.item1Name : "",
							stock: typeof props.item1Stock === "string" ? props.item1Stock : "",
							eta: typeof props.item1Eta === "string" ? props.item1Eta : "",
						},
						{
							name: typeof props.item2Name === "string" ? props.item2Name : "",
							stock: typeof props.item2Stock === "string" ? props.item2Stock : "",
							eta: typeof props.item2Eta === "string" ? props.item2Eta : "",
						},
						{
							name: typeof props.item3Name === "string" ? props.item3Name : "",
							stock: typeof props.item3Stock === "string" ? props.item3Stock : "",
							eta: typeof props.item3Eta === "string" ? props.item3Eta : "",
						},
					].filter((item) => item.name || item.stock || item.eta);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-4 overflow-hidden rounded-lg border border-border">
								<div className="bg-muted/30 grid grid-cols-3 gap-0 px-3 py-2 text-xs font-medium text-muted-foreground">
									<span>SKU</span>
									<span>库存状态</span>
									<span>到货/发货</span>
								</div>
								{items.length ? (
									items.map((item, idx) => (
										<div
											key={`${item.name}-${idx}`}
											className="grid grid-cols-3 gap-0 border-t border-border bg-background px-3 py-2 text-sm"
										>
											<span>{item.name || `条目 ${idx + 1}`}</span>
											<span>{item.stock || "-"}</span>
											<span>{item.eta || "-"}</span>
										</div>
									))
								) : (
									<div className="border-t border-border bg-background px-3 py-3 text-sm text-muted-foreground">
										请至少填写 1 个库存条目。
									</div>
								)}
							</div>
							{warehouseNote ? <p className="mt-2 text-xs text-muted-foreground">{warehouseNote}</p> : null}
							{ctaLabel ? (
								<p className="mt-2 text-xs font-medium text-primary">
									{ctaLabel}
									{ctaHref ? <span className="ml-1 opacity-80">({ctaHref})</span> : null}
								</p>
							) : null}
						</section>
					);
				}

				if (section.type === "cross-border-shipping-notice") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const policyNote = typeof props.policyNote === "string" ? props.policyNote : "";
					const primaryCtaLabel = typeof props.primaryCtaLabel === "string" ? props.primaryCtaLabel : "";
					const primaryCtaHref = typeof props.primaryCtaHref === "string" ? props.primaryCtaHref : "";
					const secondaryCtaLabel =
						typeof props.secondaryCtaLabel === "string" ? props.secondaryCtaLabel : "";
					const secondaryCtaHref = typeof props.secondaryCtaHref === "string" ? props.secondaryCtaHref : "";
					const regions = [
						{
							name: typeof props.region1Name === "string" ? props.region1Name : "",
							eta: typeof props.region1Eta === "string" ? props.region1Eta : "",
							duty: typeof props.region1Duty === "string" ? props.region1Duty : "",
						},
						{
							name: typeof props.region2Name === "string" ? props.region2Name : "",
							eta: typeof props.region2Eta === "string" ? props.region2Eta : "",
							duty: typeof props.region2Duty === "string" ? props.region2Duty : "",
						},
						{
							name: typeof props.region3Name === "string" ? props.region3Name : "",
							eta: typeof props.region3Eta === "string" ? props.region3Eta : "",
							duty: typeof props.region3Duty === "string" ? props.region3Duty : "",
						},
					].filter((item) => item.name || item.eta || item.duty);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
								{regions.length ? (
									regions.map((region, idx) => (
										<div
											key={`${region.name}-${idx}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="text-sm font-semibold">{region.name || `区域 ${idx + 1}`}</p>
											{region.eta ? (
												<p className="mt-1 text-sm text-muted-foreground">时效：{region.eta}</p>
											) : null}
											{region.duty ? (
												<p className="mt-1 text-xs text-muted-foreground">税费：{region.duty}</p>
											) : null}
										</div>
									))
								) : (
									<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
										请至少填写 1 个区域物流信息。
									</p>
								)}
							</div>
							{policyNote ? <p className="mt-2 text-xs text-muted-foreground">{policyNote}</p> : null}
							<div className="mt-2 space-y-1">
								{primaryCtaLabel ? (
									<p className="text-xs font-medium text-primary">
										{primaryCtaLabel}
										{primaryCtaHref ? <span className="ml-1 opacity-80">({primaryCtaHref})</span> : null}
									</p>
								) : null}
								{secondaryCtaLabel ? (
									<p className="text-xs font-medium text-primary">
										{secondaryCtaLabel}
										{secondaryCtaHref ? <span className="ml-1 opacity-80">({secondaryCtaHref})</span> : null}
									</p>
								) : null}
							</div>
						</section>
					);
				}

				if (section.type === "returns-policy-quick-cards") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					const cards = [
						{
							title: typeof props.card1Title === "string" ? props.card1Title : "",
							body: typeof props.card1Body === "string" ? props.card1Body : "",
							limit: typeof props.card1Limit === "string" ? props.card1Limit : "",
						},
						{
							title: typeof props.card2Title === "string" ? props.card2Title : "",
							body: typeof props.card2Body === "string" ? props.card2Body : "",
							limit: typeof props.card2Limit === "string" ? props.card2Limit : "",
						},
						{
							title: typeof props.card3Title === "string" ? props.card3Title : "",
							body: typeof props.card3Body === "string" ? props.card3Body : "",
							limit: typeof props.card3Limit === "string" ? props.card3Limit : "",
						},
					].filter((item) => item.title || item.body || item.limit);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
								{cards.length ? (
									cards.map((card, idx) => (
										<div
											key={`${card.title}-${idx}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="text-sm font-medium">{card.title || `政策 ${idx + 1}`}</p>
											{card.body ? <p className="mt-1 text-sm text-muted-foreground">{card.body}</p> : null}
											{card.limit ? <p className="mt-2 text-xs text-amber-700">{card.limit}</p> : null}
										</div>
									))
								) : (
									<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
										请至少填写 1 张政策卡片。
									</p>
								)}
							</div>
							{ctaLabel ? (
								<p className="mt-2 text-xs font-medium text-primary">
									{ctaLabel}
									{ctaHref ? <span className="ml-1 opacity-80">({ctaHref})</span> : null}
								</p>
							) : null}
						</section>
					);
				}

				if (section.type === "compliance-certificates-grid") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const note = typeof props.note === "string" ? props.note : "";
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					const certs = [
						{
							title: typeof props.cert1Title === "string" ? props.cert1Title : "",
							code: typeof props.cert1Code === "string" ? props.cert1Code : "",
							issuer: typeof props.cert1Issuer === "string" ? props.cert1Issuer : "",
						},
						{
							title: typeof props.cert2Title === "string" ? props.cert2Title : "",
							code: typeof props.cert2Code === "string" ? props.cert2Code : "",
							issuer: typeof props.cert2Issuer === "string" ? props.cert2Issuer : "",
						},
						{
							title: typeof props.cert3Title === "string" ? props.cert3Title : "",
							code: typeof props.cert3Code === "string" ? props.cert3Code : "",
							issuer: typeof props.cert3Issuer === "string" ? props.cert3Issuer : "",
						},
						{
							title: typeof props.cert4Title === "string" ? props.cert4Title : "",
							code: typeof props.cert4Code === "string" ? props.cert4Code : "",
							issuer: typeof props.cert4Issuer === "string" ? props.cert4Issuer : "",
						},
					].filter((item) => item.title || item.code || item.issuer);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
								{certs.length ? (
									certs.map((cert, idx) => (
										<div
											key={`${cert.title}-${idx}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="text-sm font-semibold">{cert.title || `证书 ${idx + 1}`}</p>
											{cert.code ? (
												<p className="mt-1 text-xs text-muted-foreground">编号：{cert.code}</p>
											) : null}
											{cert.issuer ? (
												<p className="text-xs text-muted-foreground">机构：{cert.issuer}</p>
											) : null}
										</div>
									))
								) : (
									<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
										请至少填写 1 条证书信息。
									</p>
								)}
							</div>
							{note ? <p className="mt-2 text-xs text-muted-foreground">{note}</p> : null}
							{ctaLabel ? (
								<p className="mt-2 text-xs font-medium text-primary">
									{ctaLabel}
									{ctaHref ? <span className="ml-1 opacity-80">({ctaHref})</span> : null}
								</p>
							) : null}
						</section>
					);
				}

				if (section.type === "bulk-order-inquiry-strip") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const primaryCtaLabel = typeof props.primaryCtaLabel === "string" ? props.primaryCtaLabel : "";
					const primaryCtaHref = typeof props.primaryCtaHref === "string" ? props.primaryCtaHref : "";
					const secondaryCtaLabel =
						typeof props.secondaryCtaLabel === "string" ? props.secondaryCtaLabel : "";
					const secondaryCtaHref = typeof props.secondaryCtaHref === "string" ? props.secondaryCtaHref : "";
					const rows = [
						{
							label: typeof props.minOrderLabel === "string" ? props.minOrderLabel : "",
							value: typeof props.minOrderValue === "string" ? props.minOrderValue : "",
						},
						{
							label: typeof props.leadTimeLabel === "string" ? props.leadTimeLabel : "",
							value: typeof props.leadTimeValue === "string" ? props.leadTimeValue : "",
						},
						{
							label: typeof props.customizationLabel === "string" ? props.customizationLabel : "",
							value: typeof props.customizationValue === "string" ? props.customizationValue : "",
						},
						{
							label: typeof props.contactLabel === "string" ? props.contactLabel : "",
							value: typeof props.contactValue === "string" ? props.contactValue : "",
						},
					].filter((item) => item.label || item.value);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
								{rows.length ? (
									rows.map((item, idx) => (
										<div
											key={`${item.label}-${idx}`}
											className="rounded-lg border border-border bg-background px-3 py-2"
										>
											<p className="text-xs text-muted-foreground">{item.label || `字段 ${idx + 1}`}</p>
											<p className="text-sm font-medium">{item.value || "-"}</p>
										</div>
									))
								) : (
									<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
										请至少填写 1 组询盘信息。
									</p>
								)}
							</div>
							<div className="mt-2 space-y-1">
								{primaryCtaLabel ? (
									<p className="text-xs font-medium text-primary">
										{primaryCtaLabel}
										{primaryCtaHref ? <span className="ml-1 opacity-80">({primaryCtaHref})</span> : null}
									</p>
								) : null}
								{secondaryCtaLabel ? (
									<p className="text-xs font-medium text-primary">
										{secondaryCtaLabel}
										{secondaryCtaHref ? <span className="ml-1 opacity-80">({secondaryCtaHref})</span> : null}
									</p>
								) : null}
							</div>
						</section>
					);
				}

				if (section.type === "regional-service-map-lite") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const note = typeof props.note === "string" ? props.note : "";
					const ctaLabel = typeof props.ctaLabel === "string" ? props.ctaLabel : "";
					const ctaHref = typeof props.ctaHref === "string" ? props.ctaHref : "";
					const regions = [
						{
							name: typeof props.region1Name === "string" ? props.region1Name : "",
							coverage: typeof props.region1Coverage === "string" ? props.region1Coverage : "",
							sla: typeof props.region1Sla === "string" ? props.region1Sla : "",
						},
						{
							name: typeof props.region2Name === "string" ? props.region2Name : "",
							coverage: typeof props.region2Coverage === "string" ? props.region2Coverage : "",
							sla: typeof props.region2Sla === "string" ? props.region2Sla : "",
						},
						{
							name: typeof props.region3Name === "string" ? props.region3Name : "",
							coverage: typeof props.region3Coverage === "string" ? props.region3Coverage : "",
							sla: typeof props.region3Sla === "string" ? props.region3Sla : "",
						},
						{
							name: typeof props.region4Name === "string" ? props.region4Name : "",
							coverage: typeof props.region4Coverage === "string" ? props.region4Coverage : "",
							sla: typeof props.region4Sla === "string" ? props.region4Sla : "",
						},
					].filter((item) => item.name || item.coverage || item.sla);
					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							{heading ? <h3 className="text-xl font-semibold tracking-tight">{heading}</h3> : null}
							{subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
							<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
								{regions.length ? (
									regions.map((region, idx) => (
										<div
											key={`${region.name}-${idx}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="text-sm font-semibold">{region.name || `区域 ${idx + 1}`}</p>
											{region.coverage ? (
												<p className="mt-1 text-sm text-muted-foreground">覆盖：{region.coverage}</p>
											) : null}
											{region.sla ? <p className="text-xs text-muted-foreground">SLA：{region.sla}</p> : null}
										</div>
									))
								) : (
									<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
										请至少填写 1 个区域覆盖信息。
									</p>
								)}
							</div>
							{note ? <p className="mt-2 text-xs text-muted-foreground">{note}</p> : null}
							{ctaLabel ? (
								<p className="mt-2 text-xs font-medium text-primary">
									{ctaLabel}
									{ctaHref ? <span className="ml-1 opacity-80">({ctaHref})</span> : null}
								</p>
							) : null}
						</section>
					);
				}

				if (section.type === "container") {
					const eyebrow = typeof props.eyebrow === "string" ? props.eyebrow : "";
					const heading = typeof props.heading === "string" ? props.heading : "";
					const body = typeof props.body === "string" ? props.body : "";
					const buttonLabel = typeof props.buttonLabel === "string" ? props.buttonLabel : "";
					const buttonHref = typeof props.buttonHref === "string" ? props.buttonHref : "";
					const backgroundColor = typeof props.backgroundColor === "string" ? props.backgroundColor : "";
					const backgroundImageUrl = resolveBuilderBackgroundImageUrl(props.backgroundImageUrl);
					const textColor = typeof props.textColor === "string" ? props.textColor : "";
					const contentAlign = props.contentAlign === "center" ? "center" : "left";
					const titleClass = getTitleClass(props.titleSize, "container");
					const bodyClass = getBodyClass(props.bodySize);
					const buttonClass = getButtonClass(props.buttonVariant, props.buttonSize);
					const sectionStyle = {
						...(backgroundColor ? { backgroundColor } : {}),
						...(backgroundImageUrl
							? {
									backgroundImage: `url(${backgroundImageUrl})`,
									backgroundSize: "cover",
									backgroundPosition: "center",
								}
							: {}),
						...(textColor ? { color: textColor } : {}),
					};
					const alignClass = contentAlign === "center" ? "items-center text-center" : "items-start text-left";

					return (
						<section
							className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-8"
							style={sectionStyle}
						>
							<div className={`flex flex-col ${alignClass}`}>
								{eyebrow ? <p className="mb-2 text-sm opacity-80">{eyebrow}</p> : null}
								{heading ? <h3 className={`${titleClass} font-semibold tracking-tight`}>{heading}</h3> : null}
								{body ? <p className={`mt-4 max-w-3xl ${bodyClass} opacity-90`}>{body}</p> : null}
								{buttonLabel ? (
									<div className="mt-6">
										<span className={buttonClass}>
											{buttonLabel}
											{buttonHref ? <span className="ml-2 text-xs opacity-80">({buttonHref})</span> : null}
										</span>
									</div>
								) : null}
							</div>
						</section>
					);
				}

				if (section.type === "button-row") {
					const heading = typeof props.heading === "string" ? props.heading : "";
					const subtitle = typeof props.subtitle === "string" ? props.subtitle : "";
					const primaryLabel = typeof props.primaryLabel === "string" ? props.primaryLabel : "";
					const primaryHref = typeof props.primaryHref === "string" ? props.primaryHref : "";
					const secondaryLabel = typeof props.secondaryLabel === "string" ? props.secondaryLabel : "";
					const secondaryHref = typeof props.secondaryHref === "string" ? props.secondaryHref : "";
					const align = props.align === "center" ? "center" : "left";
					const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";
					const buttonClass = getButtonClass("solid", props.buttonSize);
					const buttonOutlineClass = getButtonClass("outline", props.buttonSize);

					return (
						<section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6">
							<div className={`flex flex-col ${alignClass}`}>
								{heading ? <h3 className="text-2xl font-semibold tracking-tight">{heading}</h3> : null}
								{subtitle ? <p className="mt-2 text-muted-foreground">{subtitle}</p> : null}
								<div className="mt-5 flex flex-wrap gap-3">
									{primaryLabel ? (
										<span className={buttonClass}>
											{primaryLabel}
											{primaryHref ? <span className="ml-2 text-xs opacity-80">({primaryHref})</span> : null}
										</span>
									) : null}
									{secondaryLabel ? (
										<span className={buttonOutlineClass}>
											{secondaryLabel}
											{secondaryHref ? (
												<span className="ml-2 text-xs opacity-80">({secondaryHref})</span>
											) : null}
										</span>
									) : null}
								</div>
							</div>
						</section>
					);
				}

				if (section.type === "spacer") {
					const heightRaw = typeof props.height === "number" ? props.height : Number(props.height || 48);
					const height = Math.max(8, Math.min(240, Number.isFinite(heightRaw) ? heightRaw : 48));
					return (
						<section
							className="bg-card/40 mx-auto max-w-5xl rounded-2xl border border-dashed border-border"
							style={{ height }}
						>
							<div className="flex h-full items-center justify-center text-xs text-muted-foreground">
								间距块（{height}px）
							</div>
						</section>
					);
				}

				const visibleFields: Array<{ label: string; value: string }> = [];
				for (const field of section.fields || []) {
					const rawValue = props[field.key];
					if (rawValue === undefined || rawValue === null || rawValue === "") {
						continue;
					}
					visibleFields.push({
						label: field.label,
						value: typeof rawValue === "string" ? rawValue : JSON.stringify(rawValue),
					});
				}

				return (
					<section className="bg-card/60 rounded-md border border-dashed border-border p-4">
						<p className="text-xs uppercase tracking-wide text-muted-foreground">{section.title}</p>
						{visibleFields.length ? (
							<div className="mt-2 space-y-1 text-sm">
								{visibleFields.map((item) => (
									<p key={item.label}>
										<span className="font-medium">{item.label}:</span> {item.value}
									</p>
								))}
							</div>
						) : (
							<p className="mt-2 text-sm text-muted-foreground">尚未配置字段值。</p>
						)}
					</section>
				);
			},
		};
	}

	return {
		root: {
			label: "页面",
			fields: {
				title: {
					type: "text",
					label: "页面标题",
					placeholder: "请输入页面标题",
				},
			},
		},
		components,
	};
}

const PUCK_UI_TEXT_MAP: Record<string, string> = {
	Blocks: "区块",
	Outline: "结构",
	Fields: "字段",
	Publish: "发布",
	Page: "页面",
	undo: "撤销",
	redo: "重做",
	maximize: "最大化",
	"Toggle left sidebar": "切换左侧栏",
	"Toggle right sidebar": "切换右侧栏",
	"Toggle menu bar": "切换菜单栏",
	"Switch to Small viewport": "切换到手机视图",
	"Switch to Medium viewport": "切换到平板视图",
	"Switch to Large viewport": "切换到桌面视图",
	"Switch to Full-width viewport": "切换到全宽视图",
	"Zoom viewport out": "缩小画布",
	"Zoom viewport in": "放大画布",
	title: "页面标题",
};

function localizePuckUiText(root: HTMLElement) {
	const attrs = ["title", "aria-label", "placeholder"] as const;
	const all = root.querySelectorAll<HTMLElement>("*");
	for (const el of all) {
		for (const attr of attrs) {
			const value = el.getAttribute(attr);
			if (!value) continue;
			const translated = PUCK_UI_TEXT_MAP[value.trim()];
			if (translated && translated !== value) {
				el.setAttribute(attr, translated);
			}
		}
		if (el.childNodes.length === 1 && el.childNodes[0]?.nodeType === Node.TEXT_NODE) {
			const value = el.textContent?.trim();
			if (!value) continue;
			const translated = PUCK_UI_TEXT_MAP[value];
			if (translated && translated !== value) {
				el.textContent = translated;
			}
		}
	}
}

function layoutToPuckData(
	layout: HomepageLayoutDraft,
	sectionRegistry: HomepageSectionRegistryItem[],
): PuckDataShape {
	const byType = new Map(sectionRegistry.map((item) => [item.type, item]));
	const sections = Array.isArray(layout.sections) ? layout.sections : [];
	const content: PuckContentItem[] = [];
	for (const section of sections) {
		if (!isRecord(section)) {
			continue;
		}
		const sectionType = typeof section.type === "string" ? section.type : "";
		const matched = byType.get(sectionType);
		if (!matched) {
			continue;
		}
		content.push({
			type: matched.puckComponent,
			props: {
				id: `${matched.puckComponent}-${content.length + 1}`,
				...stripTypeField(matched.defaults),
				...stripTypeField(section),
			},
		});
	}

	return {
		root: {},
		content,
	};
}

function puckDataToLayout(
	data: PuckDataShape,
	sectionRegistry: HomepageSectionRegistryItem[],
	schemaVersion = 1,
): HomepageLayoutDraft {
	const byComponent = new Map(sectionRegistry.map((item) => [item.puckComponent, item]));
	const contentItems = Array.isArray(data.content) ? data.content : [];
	const sections: Record<string, unknown>[] = [];
	for (const item of contentItems) {
		if (!isRecord(item)) {
			continue;
		}
		const componentType = typeof item.type === "string" ? item.type : "";
		const matched = byComponent.get(componentType);
		if (!matched) {
			continue;
		}
		const props: Record<string, unknown> = isRecord(item.props) ? { ...item.props } : {};
		delete props["id"];
		sections.push({
			type: matched.type,
			...props,
		});
	}

	if (!sections.length && sectionRegistry.length > 0) {
		sections.push({ ...(sectionRegistry[0].defaults || {}), type: sectionRegistry[0].type });
	}

	return {
		schemaVersion: Number.isInteger(schemaVersion) && schemaVersion > 0 ? schemaVersion : 1,
		sections,
	};
}

function generatePuckItemId(prefix: string) {
	if (typeof globalThis.crypto?.randomUUID === "function") {
		return `${prefix}-${globalThis.crypto.randomUUID()}`;
	}
	return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizePuckData(data: PuckDataShape): PuckDataShape {
	const usedIds = new Set<string>();
	const content: PuckContentItem[] = [];
	const input = Array.isArray(data.content) ? data.content : [];
	for (const item of input) {
		if (!isRecord(item)) {
			continue;
		}
		const type = typeof item.type === "string" ? item.type : "section";
		const props: Record<string, unknown> = isRecord(item.props) ? { ...item.props } : {};
		let id = typeof props.id === "string" ? props.id.trim() : "";
		if (!id || usedIds.has(id)) {
			id = generatePuckItemId(type);
		}
		usedIds.add(id);
		const propsWithId = { ...props, id } as Record<string, unknown> & { id: string };
		content.push({ ...(item as PuckContentItem), type, props: propsWithId });
	}

	return {
		root: isRecord(data.root) ? data.root : {},
		content,
	};
}

function HelpTip({ text }: { text: string }) {
	return (
		<span
			className="ml-1 inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-border text-[10px] font-semibold text-muted-foreground"
			title={text}
			aria-label={text}
		>
			?
		</span>
	);
}

type StorefrontBuilderClientProps = {
	editorOnly?: boolean;
};

export function StorefrontBuilderClient({ editorOnly = false }: StorefrontBuilderClientProps) {
	const searchParams = useSearchParams();
	const isEmbedded = searchParams.get("embedded") === "1";
	const fullEditorHref = "/storefront-builder/editor";

	const [loading, setLoading] = useState(true);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [statusMessage, setStatusMessage] = useState<string | null>(null);
	const [layoutAutosaveEnabled, setLayoutAutosaveEnabled] = useState(true);
	const [styleControlTier, setStyleControlTier] = useState<StyleControlTier>("must-have");
	const [lastAutosavedAt, setLastAutosavedAt] = useState<number | null>(null);
	const autosaveSkipNextRef = useRef(true);
	const autosaveInFlightRef = useRef(false);
	const puckShellRef = useRef<HTMLDivElement | null>(null);

	const [tenant, setTenant] = useState<TenantPayload | null>(null);
	const [themeState, setThemeState] = useState<ThemePayload["theme"] | null>(null);
	const [layoutState, setLayoutState] = useState<HomepageLayoutPayload["homepageLayout"] | null>(null);
	const [commerceState, setCommerceState] = useState<CommerceLayoutPayload["commerceLayout"] | null>(null);
	const [commerceDraft, setCommerceDraft] = useState<CommerceLayoutDraft>(DEFAULT_COMMERCE_LAYOUT_DRAFT);
	const [schemaPayload, setSchemaPayload] = useState<HomepageSchemaPayload | null>(null);
	const [starterKits, setStarterKits] = useState<StarterKitSummary[]>([]);
	const [starterKitAudit, setStarterKitAudit] = useState<StarterKitAuditEntry[]>([]);
	const [selectedStarterKitId, setSelectedStarterKitId] = useState("");
	const [applySaleorProvisioning, setApplySaleorProvisioning] = useState(true);
	const [rollbackProvisionedSaleor, setRollbackProvisionedSaleor] = useState(false);
	const [rollbackProvisionScope, setRollbackProvisionScope] = useState<ProvisionScope>({
		menus: true,
		pages: true,
	});
	const [restoreProvisionScope, setRestoreProvisionScope] = useState<ProvisionScope>({
		menus: true,
		pages: true,
	});
	const [restoreConflictPolicy, setRestoreConflictPolicy] = useState<RestoreConflictPolicy>("skip-existing");
	const [rollbackPreviews, setRollbackPreviews] = useState<Record<string, RollbackPreviewState>>({});
	const [restorePreviews, setRestorePreviews] = useState<Record<string, RestorePreviewState>>({});
	const [collectionOptions, setCollectionOptions] = useState<CollectionPickerOption[]>([]);
	const [assetLibrary, setAssetLibrary] = useState<BuilderAssetItem[]>([]);
	const [assetBrowserItems, setAssetBrowserItems] = useState<BuilderAssetItem[]>([]);
	const [assetBrowserTotalCount, setAssetBrowserTotalCount] = useState(0);
	const [assetBrowserPage, setAssetBrowserPage] = useState(1);
	const [assetBrowserPageSize, setAssetBrowserPageSize] = useState(20);
	const [assetBrowserHasMore, setAssetBrowserHasMore] = useState(false);
	const [assetSearchInput, setAssetSearchInput] = useState("");
	const [assetSearchApplied, setAssetSearchApplied] = useState("");
	const [assetTagFilter, setAssetTagFilter] = useState("");
	const [assetTagDrafts, setAssetTagDrafts] = useState<Record<string, string>>({});
	const [guardrailPolicy, setGuardrailPolicy] = useState<StarterKitGuardrailPolicy | null>(null);
	const [guardrailPolicyPending, setGuardrailPolicyPending] =
		useState<StarterKitGuardrailPolicyPending | null>(null);
	const [guardrailNotificationDeadLetters, setGuardrailNotificationDeadLetters] = useState<
		GuardrailNotificationDeadLetter[]
	>([]);
	const [guardrailNotificationDeadLetterStatus, setGuardrailNotificationDeadLetterStatus] =
		useState<GuardrailNotificationDeadLetterStatus | null>(null);
	const [guardrailApproveSelfOverride, setGuardrailApproveSelfOverride] = useState(false);
	const [guardrailMaxEntitiesInput, setGuardrailMaxEntitiesInput] = useState("20");
	const [guardrailBypassSuperuser, setGuardrailBypassSuperuser] = useState(true);
	const [guardrailBypassPermissionsText, setGuardrailBypassPermissionsText] = useState("MANAGE_PAGES");

	const [siteName, setSiteName] = useState("");
	const [themePreset, setThemePreset] = useState("minimal");
	const [themeTokens, setThemeTokens] = useState<Record<string, string>>({});
	const [themeOverridesText, setThemeOverridesText] = useState("{}");
	const [seoDefaultTitle, setSeoDefaultTitle] = useState("");
	const [seoDefaultDescription, setSeoDefaultDescription] = useState("");
	const [seoDefaultImage, setSeoDefaultImage] = useState("");
	const [layoutDraftText, setLayoutDraftText] = useState("{}");
	const [puckData, setPuckData] = useState<PuckDataShape>({ root: {}, content: [] });

	const sectionRegistry = useMemo(
		() => schemaPayload?.builder?.sectionRegistry || [],
		[schemaPayload?.builder?.sectionRegistry],
	);
	const sectionCatalogSummary = useMemo(() => {
		const grouped = new Map<string, { label: string; items: HomepageSectionRegistryItem[] }>();
		const sortedSections = [...sectionRegistry].sort((left, right) => {
			const leftOrder = left.rolloutOrder ?? Number.MAX_SAFE_INTEGER;
			const rightOrder = right.rolloutOrder ?? Number.MAX_SAFE_INTEGER;
			if (leftOrder !== rightOrder) return leftOrder - rightOrder;
			return left.title.localeCompare(right.title, "zh-CN");
		});
		for (const section of sortedSections) {
			const sectionGroup = section.group || "utility";
			const label = SECTION_GROUP_LABELS[sectionGroup] || sectionGroup;
			if (!grouped.has(sectionGroup)) {
				grouped.set(sectionGroup, { label, items: [] });
			}
			grouped.get(sectionGroup)?.items.push(section);
		}
		return Array.from(grouped.values());
	}, [sectionRegistry]);
	const puckPreferred = (schemaPayload?.builder?.preferredEditor || "").toLowerCase() === "puck";
	const canUsePuck = puckPreferred && sectionRegistry.length > 0;
	const showHomepageEditor = editorOnly || !isEmbedded;
	const showAdvancedControlPanel = !editorOnly && !isEmbedded;
	const selectedStarterKit = useMemo(
		() => starterKits.find((starterKit) => starterKit.id === selectedStarterKitId) || null,
		[selectedStarterKitId, starterKits],
	);
	const assetTagOptions = useMemo(() => {
		const tagSet = new Set<string>();
		for (const asset of assetLibrary) {
			for (const tag of asset.tags || []) {
				const normalized = typeof tag === "string" ? tag.trim() : "";
				if (normalized) {
					tagSet.add(normalized);
				}
			}
		}
		return Array.from(tagSet).sort((left, right) => left.localeCompare(right, "zh-CN"));
	}, [assetLibrary]);

	const previewHref = useMemo(() => {
		const channel = tenant?.channel || "default-channel";
		return `/${channel}?preview=1`;
	}, [tenant?.channel]);
	const publishedHref = useMemo(() => {
		const channel = tenant?.channel || "default-channel";
		return `/${channel}`;
	}, [tenant?.channel]);

	const applyThemeDraftToForm = useCallback(
		(draftTheme: ThemeDraft | Record<string, unknown> | null | undefined) => {
			const nextThemeDraft = isRecord(draftTheme) ? draftTheme : {};
			const { tokenOverrides, extraOverrides } = splitThemeOverrides(nextThemeDraft.themeOverrides);
			setSiteName(typeof nextThemeDraft.siteName === "string" ? nextThemeDraft.siteName : "");
			setThemePreset(typeof nextThemeDraft.themePreset === "string" ? nextThemeDraft.themePreset : "minimal");
			setThemeTokens(tokenOverrides);
			setThemeOverridesText(JSON.stringify(extraOverrides, null, 2));
			setSeoDefaultTitle(
				typeof nextThemeDraft.seoDefaultTitle === "string" ? nextThemeDraft.seoDefaultTitle : "",
			);
			setSeoDefaultDescription(
				typeof nextThemeDraft.seoDefaultDescription === "string" ? nextThemeDraft.seoDefaultDescription : "",
			);
			setSeoDefaultImage(
				typeof nextThemeDraft.seoDefaultImage === "string" ? nextThemeDraft.seoDefaultImage : "",
			);
		},
		[],
	);

	const uploadBuilderImage = useCallback(async (file: File): Promise<string> => {
		const formData = new FormData();
		formData.append("file", file);

		const response = await fetch("/api/storefront-builder/media-upload", {
			method: "POST",
			body: formData,
		});

		type UploadResponse = {
			url?: string;
			mediaUrl?: string;
			asset?: BuilderAssetItem;
			assets?: { items?: BuilderAssetItem[] };
			error?: string;
		};
		const payload = (await response.json().catch(() => null)) as UploadResponse | null;
		if (!response.ok) {
			throw new Error(payload?.error || "图片上传失败");
		}
		if (Array.isArray(payload?.assets?.items)) {
			setAssetLibrary(payload.assets.items.filter((asset) => !!asset?.mediaUrl));
		} else if (payload?.asset?.mediaUrl) {
			setAssetLibrary((current) => {
				const deduped = current.filter(
					(item) => item.id !== payload.asset?.id && item.mediaUrl !== payload.asset?.mediaUrl,
				);
				return [payload.asset as BuilderAssetItem, ...deduped].slice(0, 300);
			});
		}

		const nextUrl = payload?.mediaUrl || payload?.url;
		if (!nextUrl) {
			throw new Error("图片上传成功，但未返回可用地址");
		}
		return nextUrl;
	}, []);

	const deleteAssetFromLibrary = useCallback(
		async (assetId: string) => {
			if (!assetId) return;
			setBusy(true);
			setError(null);
			try {
				const sendDeleteRequest = async (force: boolean) => {
					const response = await fetch("/api/storefront-builder/assets", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							action: "delete",
							assetId,
							force,
						}),
					});
					const payload = (await response.json().catch(() => null)) as BuilderAssetsPayload | null;
					return { response, payload };
				};

				let { response, payload } = await sendDeleteRequest(false);
				if (response.status === 409 && payload?.errorCode === "ASSET_IN_USE") {
					const usageLines = (payload.usage || []).slice(0, 6).map((reference) => {
						const modeText = reference.mode === "published" ? "已发布" : "草稿";
						const sectionType = typeof reference.sectionType === "string" ? reference.sectionType : "unknown";
						const sectionIndex =
							typeof reference.sectionIndex === "number" ? reference.sectionIndex + 1 : "?";
						const fields = Array.isArray(reference.fields) ? reference.fields.slice(0, 3).join(", ") : "";
						return `- ${modeText} · #${sectionIndex} · ${sectionType}${fields ? ` · ${fields}` : ""}`;
					});
					const hiddenCount = Math.max(0, (payload.usage?.length || 0) - usageLines.length);
					const confirmMessage = [
						"该素材正在被首页区块引用。",
						...usageLines,
						hiddenCount > 0 ? `... 另外 ${hiddenCount} 处引用未展示` : "",
						"",
						"继续删除会导致这些区块丢失图片。是否强制删除？",
					]
						.filter(Boolean)
						.join("\n");
					if (!window.confirm(confirmMessage)) {
						setStatusMessage("已取消删除（素材仍被区块使用）");
						return;
					}
					({ response, payload } = await sendDeleteRequest(true));
				}

				if (!response.ok) {
					throw new Error(payload?.error || "删除素材失败");
				}
				setAssetLibrary(payload?.assets?.items?.filter((item) => !!item?.mediaUrl) || []);
				setAssetBrowserItems((current) => current.filter((item) => item.id !== assetId));
				setAssetBrowserTotalCount((current) => Math.max(0, current - 1));
				setStatusMessage(payload?.forced ? "素材已强制删除（存在引用）" : "素材已删除");
			} catch (error) {
				setError(error instanceof Error ? error.message : "删除素材失败");
			} finally {
				setBusy(false);
			}
		},
		[setBusy, setError, setStatusMessage],
	);

	const loadAssetBrowser = useCallback(
		async (options?: { page?: number; q?: string; tag?: string; pageSize?: number }) => {
			const page = Math.max(1, options?.page || assetBrowserPage || 1);
			const pageSize = Math.max(1, Math.min(100, options?.pageSize || assetBrowserPageSize || 20));
			const q = typeof options?.q === "string" ? options.q : assetSearchApplied;
			const tag = typeof options?.tag === "string" ? options.tag : assetTagFilter;
			const query = new URLSearchParams();
			query.set("page", String(page));
			query.set("limit", String(pageSize));
			if (q.trim()) {
				query.set("q", q.trim());
			}
			if (tag.trim()) {
				query.set("tag", tag.trim());
			}

			const response = await fetch(`/api/storefront-builder/assets?${query.toString()}`, {
				cache: "no-store",
			});
			const payload = (await response.json().catch(() => null)) as BuilderAssetsPayload | null;
			if (!response.ok) {
				throw new Error(payload?.error || "加载素材列表失败");
			}
			const items = payload?.assets?.items?.filter((item) => !!item?.mediaUrl) || [];
			setAssetBrowserItems(items);
			setAssetBrowserTotalCount(payload?.assets?.totalCount || payload?.assets?.count || items.length);
			setAssetBrowserHasMore(payload?.assets?.hasMore === true);
			setAssetBrowserPage(payload?.assets?.page || page);
			setAssetBrowserPageSize(payload?.assets?.limit || pageSize);
			setAssetTagDrafts((current) => {
				const next = { ...current };
				for (const item of items) {
					next[item.id] = (item.tags || []).join(", ");
				}
				return next;
			});
		},
		[assetBrowserPage, assetBrowserPageSize, assetSearchApplied, assetTagFilter],
	);

	const updateAssetTags = useCallback(
		async (assetId: string) => {
			const tagsRaw = assetTagDrafts[assetId] || "";
			const tags = tagsRaw
				.split(",")
				.map((value) => value.trim())
				.filter(Boolean)
				.slice(0, 20);
			setBusy(true);
			setError(null);
			try {
				const response = await fetch("/api/storefront-builder/assets", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						action: "update-tags",
						assetId,
						tags,
					}),
				});
				const payload = (await response.json().catch(() => null)) as BuilderAssetsPayload | null;
				if (!response.ok) {
					throw new Error(payload?.error || "更新标签失败");
				}
				if (Array.isArray(payload?.assets?.items)) {
					setAssetLibrary(payload.assets.items.filter((item) => !!item?.mediaUrl));
				}
				await loadAssetBrowser();
				setStatusMessage("素材标签已更新");
			} catch (error) {
				setError(error instanceof Error ? error.message : "更新标签失败");
			} finally {
				setBusy(false);
			}
		},
		[assetTagDrafts, loadAssetBrowser],
	);

	const collectionFieldOptions = useMemo(() => {
		const optionsMap = new Map<string, { label: string; value: string }>();
		for (const collection of collectionOptions) {
			const slug = collection.slug.trim();
			if (!slug) continue;
			const labelName = collection.name.trim() || slug;
			optionsMap.set(slug, {
				label: `${labelName} (${slug})`,
				value: slug,
			});
		}

		const knownLayoutSlugs = [
			...extractFeaturedCollectionSlugs(layoutState?.draft),
			...extractFeaturedCollectionSlugs(layoutState?.published),
		];
		for (const slug of knownLayoutSlugs) {
			if (!optionsMap.has(slug)) {
				optionsMap.set(slug, {
					label: `${slug}（当前）`,
					value: slug,
				});
			}
		}

		if (!optionsMap.size) {
			optionsMap.set("featured-products", {
				label: "精选商品（featured-products）",
				value: "featured-products",
			});
		}

		return Array.from(optionsMap.values()).sort((a, b) => a.label.localeCompare(b.label));
	}, [collectionOptions, layoutState?.draft, layoutState?.published]);

	const puckConfig = useMemo(() => {
		if (!canUsePuck) {
			return { components: {} };
		}
		return buildPuckConfig(
			sectionRegistry,
			collectionFieldOptions,
			uploadBuilderImage,
			assetLibrary,
			styleControlTier,
		);
	}, [
		canUsePuck,
		sectionRegistry,
		collectionFieldOptions,
		uploadBuilderImage,
		assetLibrary,
		styleControlTier,
	]);

	const layoutFromPuck = useMemo(() => {
		const schemaVersion =
			layoutState?.draft?.schemaVersion ||
			layoutState?.published?.schemaVersion ||
			schemaPayload?.builder?.schemaVersion ||
			1;
		return puckDataToLayout(puckData, sectionRegistry, schemaVersion);
	}, [
		layoutState?.draft?.schemaVersion,
		layoutState?.published?.schemaVersion,
		puckData,
		schemaPayload?.builder?.schemaVersion,
		sectionRegistry,
	]);
	const placedSectionCount = layoutFromPuck.sections?.length || 0;

	const puckPlugins = useMemo(
		() => [
			{
				name: "blocks",
				label: "区块",
				icon: <Hammer />,
				render: () => <Puck.Components />,
			},
			{
				name: "outline",
				label: "结构",
				icon: <Layers />,
				render: () => <Puck.Outline />,
			},
			{
				name: "fields",
				label: "字段",
				icon: <RectangleEllipsis />,
				mobileOnly: true,
				render: () => <Puck.Fields />,
			},
		],
		[],
	);

	useEffect(() => {
		if (!canUsePuck) return;
		const shell = puckShellRef.current;
		if (!shell) return;

		let rafId = 0;
		const run = () => {
			rafId = 0;
			localizePuckUiText(shell);
		};
		const schedule = () => {
			if (rafId) return;
			rafId = window.requestAnimationFrame(run);
		};

		schedule();
		const observer = new MutationObserver(schedule);
		observer.observe(shell, {
			subtree: true,
			childList: true,
			characterData: true,
			attributes: true,
			attributeFilter: ["title", "aria-label", "placeholder"],
		});

		return () => {
			observer.disconnect();
			if (rafId) {
				window.cancelAnimationFrame(rafId);
			}
		};
	}, [canUsePuck]);

	const syncGuardrailStateFromPayload = useCallback(
		(payload: StarterKitsPayload) => {
			if (payload.guardrailPolicy !== undefined) {
				setGuardrailPolicy(payload.guardrailPolicy || null);
				const maxEntities = payload.guardrailPolicy?.maxEntities || DEFAULT_LARGE_OPERATION_THRESHOLD;
				setGuardrailMaxEntitiesInput(String(maxEntities));
				setGuardrailBypassSuperuser(payload.guardrailPolicy?.bypass?.superuser === true);
				setGuardrailBypassPermissionsText(
					(payload.guardrailPolicy?.bypass?.permissions || ["MANAGE_PAGES"]).join(", "),
				);
			}
			if (payload.guardrailPolicyPending !== undefined) {
				setGuardrailPolicyPending(payload.guardrailPolicyPending || null);
				if (!payload.guardrailPolicyPending) {
					setGuardrailApproveSelfOverride(false);
				}
			}
			if (payload.guardrailNotificationDeadLetters !== undefined) {
				setGuardrailNotificationDeadLetters(payload.guardrailNotificationDeadLetters || []);
			}
			if (payload.guardrailNotificationDeadLetterStatus !== undefined) {
				setGuardrailNotificationDeadLetterStatus(payload.guardrailNotificationDeadLetterStatus || null);
			}
		},
		[
			setGuardrailPolicy,
			setGuardrailPolicyPending,
			setGuardrailNotificationDeadLetters,
			setGuardrailNotificationDeadLetterStatus,
		],
	);

	const loadState = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [themeRes, layoutRes, commerceRes, schemaRes, starterKitsRes, assetsRes] = await Promise.all([
				fetch("/api/storefront-builder/theme", { cache: "no-store" }),
				fetch("/api/storefront-builder/homepage-layout", { cache: "no-store" }),
				fetch("/api/storefront-builder/commerce-layout", { cache: "no-store" }),
				fetch("/api/storefront-builder/homepage-schema", { cache: "no-store" }),
				fetch("/api/storefront-builder/starter-kits", { cache: "no-store" }),
				fetch("/api/storefront-builder/assets", { cache: "no-store" }),
			]);

			const themeJson = (await themeRes.json()) as ThemePayload;
			const layoutJson = (await layoutRes.json()) as HomepageLayoutPayload;
			const commerceJson = (await commerceRes.json()) as CommerceLayoutPayload;
			const schemaJson = (await schemaRes.json()) as HomepageSchemaPayload;
			const starterKitsJson = (await starterKitsRes.json()) as StarterKitsPayload;
			const assetsJson = (await assetsRes.json()) as BuilderAssetsPayload;

			if (!themeRes.ok) {
				throw new Error(themeJson.error || "Failed to load theme state");
			}
			if (!layoutRes.ok) {
				throw new Error(layoutJson.error || "Failed to load homepage layout state");
			}
			if (!commerceRes.ok) {
				throw new Error(commerceJson.error || "Failed to load commerce layout state");
			}
			if (!starterKitsRes.ok) {
				throw new Error(starterKitsJson.error || "Failed to load starter kits");
			}
			if (!assetsRes.ok) {
				throw new Error(assetsJson.error || "Failed to load asset library");
			}

			const schemaRegistry = schemaJson.builder?.sectionRegistry || [];
			const draftLayout = layoutJson.homepageLayout?.draft ||
				layoutJson.homepageLayout?.published || {
					schemaVersion: schemaJson.builder?.schemaVersion || 1,
					sections: [],
				};
			const tenantPayload = themeJson.tenant || layoutJson.tenant || null;
			const channel = tenantPayload?.channel || "default-channel";
			const collectionsRes = await fetch(
				`/api/storefront-builder/collections?channel=${encodeURIComponent(channel)}`,
				{
					cache: "no-store",
				},
			);
			const collectionsJson = (await collectionsRes.json().catch(() => null)) as CollectionsPayload | null;
			if (!collectionsRes.ok) {
				throw new Error(collectionsJson?.error || "Failed to load collections for builder");
			}

			setTenant(tenantPayload);
			setThemeState(themeJson.theme || null);
			setLayoutState(layoutJson.homepageLayout || null);
			setCommerceState(commerceJson.commerceLayout || null);
			setCommerceDraft(
				normalizeCommerceLayoutDraft(
					commerceJson.commerceLayout?.draft || commerceJson.commerceLayout?.published,
				),
			);
			setSchemaPayload(schemaJson || null);
			setStarterKits(starterKitsJson.kits || []);
			setStarterKitAudit(starterKitsJson.audit?.recent || []);
			syncGuardrailStateFromPayload(starterKitsJson);
			setCollectionOptions(collectionsJson?.collections || []);
			setAssetLibrary(assetsJson.assets?.items?.filter((item) => !!item?.mediaUrl) || []);
			setAssetSearchInput("");
			setAssetSearchApplied("");
			setAssetTagFilter("");
			await loadAssetBrowser({ page: 1, q: "", tag: "", pageSize: assetBrowserPageSize });
			if (Array.isArray(starterKitsJson.kits) && starterKitsJson.kits.length > 0) {
				setSelectedStarterKitId((current) => current || starterKitsJson.kits?.[0]?.id || "");
			}
			setLayoutDraftText(JSON.stringify(draftLayout, null, 2));
			autosaveSkipNextRef.current = true;
			setPuckData(layoutToPuckData(draftLayout, schemaRegistry));

			applyThemeDraftToForm(themeJson.theme?.draft || themeJson.theme?.published || {});
		} catch (e) {
			const message = e instanceof Error ? e.message : "加载搭建器状态失败";
			setError(message);
		} finally {
			setLoading(false);
		}
	}, [applyThemeDraftToForm, assetBrowserPageSize, loadAssetBrowser, syncGuardrailStateFromPayload]);

	useEffect(() => {
		void loadState();
	}, [loadState]);

	const saveLayoutDraftSilently = useCallback(
		async (draft: HomepageLayoutDraft) => {
			if (autosaveInFlightRef.current) return;
			autosaveInFlightRef.current = true;
			try {
				const res = await fetch("/api/storefront-builder/homepage-layout", {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ draft }),
				});
				const json = (await res.json()) as HomepageLayoutPayload;
				if (!res.ok) {
					if (res.status === 403) {
						setLayoutAutosaveEnabled(false);
					}
					throw new Error(json.error || "自动保存首页布局草稿失败");
				}
				setLayoutState(json.homepageLayout || null);
				setLastAutosavedAt(Date.now());
			} catch (e) {
				setError(e instanceof Error ? e.message : "自动保存首页布局草稿失败");
			} finally {
				autosaveInFlightRef.current = false;
			}
		},
		[setLayoutState],
	);

	useEffect(() => {
		if (!canUsePuck) return;
		if (!layoutAutosaveEnabled) return;
		if (busy) return;

		if (autosaveSkipNextRef.current) {
			autosaveSkipNextRef.current = false;
			return;
		}

		const handle = window.setTimeout(() => {
			void saveLayoutDraftSilently(layoutFromPuck);
		}, 900);

		return () => {
			window.clearTimeout(handle);
		};
	}, [busy, canUsePuck, layoutAutosaveEnabled, layoutFromPuck, puckData, saveLayoutDraftSilently]);

	const saveThemeDraft = async () => {
		setBusy(true);
		setStatusMessage(null);
		setError(null);
		try {
			const parsedOverrides = JSON.parse(themeOverridesText || "{}") as unknown;
			if (!isRecord(parsedOverrides)) {
				throw new Error("高级覆盖项必须是 JSON 对象");
			}
			const normalizedTokenOverrides: Record<string, string> = {};
			for (const definition of THEME_TOKEN_DEFINITIONS) {
				const rawValue = themeTokens[definition.key];
				if (typeof rawValue !== "string") continue;
				const value = rawValue.trim();
				if (!value) continue;

				if (definition.inputType === "number") {
					const numericValue = Number.parseFloat(value);
					if (!Number.isFinite(numericValue)) {
						throw new Error(`${definition.label} 必须是数字`);
					}
					if (typeof definition.min === "number" && numericValue < definition.min) {
						throw new Error(`${definition.label} 不能小于 ${definition.min}`);
					}
					if (typeof definition.max === "number" && numericValue > definition.max) {
						throw new Error(`${definition.label} 不能大于 ${definition.max}`);
					}
				}
				if (definition.inputType === "select" && definition.options?.length) {
					const allowed = new Set(definition.options.map((option) => option.value));
					if (!allowed.has(value)) {
						throw new Error(`${definition.label} 取值无效`);
					}
				}
				normalizedTokenOverrides[definition.key] = value;
			}

			const extraOverrides: Record<string, unknown> = {};
			for (const [key, value] of Object.entries(parsedOverrides)) {
				if (THEME_TOKEN_KEY_SET.has(key)) continue;
				extraOverrides[key] = value;
			}
			const mergedOverrides = {
				...extraOverrides,
				...normalizedTokenOverrides,
			};
			const res = await fetch("/api/storefront-builder/theme", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					draft: {
						siteName,
						themePreset,
						themeOverrides: mergedOverrides,
						seoDefaultTitle,
						seoDefaultDescription,
						seoDefaultImage,
					},
				}),
			});
			const json = (await res.json()) as ThemePayload;
			if (!res.ok) {
				throw new Error(json.error || "保存主题草稿失败");
			}
			setThemeState(json.theme || null);
			applyThemeDraftToForm(json.theme?.draft || json.theme?.published || {});
			setStatusMessage("主题草稿已保存。");
		} catch (e) {
			setError(e instanceof Error ? e.message : "保存主题草稿失败");
		} finally {
			setBusy(false);
		}
	};

	const publishTheme = async () => {
		setBusy(true);
		setStatusMessage(null);
		setError(null);
		try {
			const res = await fetch("/api/storefront-builder/theme", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "publish",
					note: "Published from Storefront Builder UI",
				}),
			});
			const json = (await res.json()) as ThemePayload;
			if (!res.ok) {
				throw new Error(json.error || "发布主题失败");
			}
			setThemeState(json.theme || null);
			applyThemeDraftToForm(json.theme?.draft || json.theme?.published || {});
			setStatusMessage("主题已发布。");
		} catch (e) {
			setError(e instanceof Error ? e.message : "发布主题失败");
		} finally {
			setBusy(false);
		}
	};

	const saveLayoutDraft = async () => {
		setBusy(true);
		setStatusMessage(null);
		setError(null);
		try {
			const parsedDraft = canUsePuck
				? layoutFromPuck
				: (JSON.parse(layoutDraftText || "{}") as HomepageLayoutDraft);
			const res = await fetch("/api/storefront-builder/homepage-layout", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ draft: parsedDraft }),
			});
			const json = (await res.json()) as HomepageLayoutPayload;
			if (!res.ok) {
				throw new Error(json.error || "保存首页草稿失败");
			}
			const nextDraft = json.homepageLayout?.draft || json.homepageLayout?.published || parsedDraft;
			setLayoutState(json.homepageLayout || null);
			setLayoutDraftText(JSON.stringify(nextDraft, null, 2));
			autosaveSkipNextRef.current = true;
			setPuckData(layoutToPuckData(nextDraft, sectionRegistry));
			setStatusMessage("首页布局草稿已保存。");
		} catch (e) {
			setError(e instanceof Error ? e.message : "保存首页布局草稿失败");
		} finally {
			setBusy(false);
		}
	};

	const publishLayout = async () => {
		setBusy(true);
		setStatusMessage(null);
		setError(null);
		try {
			const res = await fetch("/api/storefront-builder/homepage-layout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "publish",
					note: "Published from Storefront Builder UI",
				}),
			});
			const json = (await res.json()) as HomepageLayoutPayload;
			if (!res.ok) {
				throw new Error(json.error || "发布首页布局失败");
			}
			setLayoutState(json.homepageLayout || null);
			setStatusMessage("首页布局已发布。");
		} catch (e) {
			setError(e instanceof Error ? e.message : "发布首页布局失败");
		} finally {
			setBusy(false);
		}
	};

	const saveCommerceDraft = async () => {
		setBusy(true);
		setStatusMessage(null);
		setError(null);
		try {
			const normalizedDraft = normalizeCommerceLayoutDraft(commerceDraft);
			const res = await fetch("/api/storefront-builder/commerce-layout", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ draft: normalizedDraft }),
			});
			const json = (await res.json()) as CommerceLayoutPayload;
			if (!res.ok) {
				throw new Error(json.error || "保存商品页配置草稿失败");
			}
			setCommerceState(json.commerceLayout || null);
			setCommerceDraft(
				normalizeCommerceLayoutDraft(json.commerceLayout?.draft || json.commerceLayout?.published),
			);
			setStatusMessage("商品页配置草稿已保存。");
		} catch (e) {
			setError(e instanceof Error ? e.message : "保存商品页配置草稿失败");
		} finally {
			setBusy(false);
		}
	};

	const publishCommerceLayout = async () => {
		setBusy(true);
		setStatusMessage(null);
		setError(null);
		try {
			const res = await fetch("/api/storefront-builder/commerce-layout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "publish",
					note: "Published from Storefront Builder UI",
				}),
			});
			const json = (await res.json()) as CommerceLayoutPayload;
			if (!res.ok) {
				throw new Error(json.error || "发布商品页配置失败");
			}
			setCommerceState(json.commerceLayout || null);
			setCommerceDraft(
				normalizeCommerceLayoutDraft(json.commerceLayout?.draft || json.commerceLayout?.published),
			);
			setStatusMessage("商品页配置已发布。");
		} catch (e) {
			setError(e instanceof Error ? e.message : "发布商品页配置失败");
		} finally {
			setBusy(false);
		}
	};

	const loadStarterKitHistory = async () => {
		try {
			const res = await fetch("/api/storefront-builder/starter-kits", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "history", limit: 10 }),
			});
			const json = (await res.json()) as StarterKitsPayload;
			if (!res.ok) {
				throw new Error(json.error || "Failed to load starter-kit history");
			}
			setStarterKitAudit(json.audit?.entries || []);
			syncGuardrailStateFromPayload(json);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to load starter-kit history");
		}
	};

	const proposeGuardrailPolicy = async () => {
		setBusy(true);
		setStatusMessage(null);
		setError(null);
		try {
			const parsedMax = Number.parseInt(guardrailMaxEntitiesInput, 10);
			if (!Number.isFinite(parsedMax) || parsedMax <= 0) {
				throw new Error("Guardrail max entities must be a positive integer.");
			}
			const parsedPermissions = guardrailBypassPermissionsText
				.split(",")
				.map((value) => value.trim())
				.filter(Boolean);
			const res = await fetch("/api/storefront-builder/starter-kits", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "propose-guardrail-policy",
					policy: {
						maxEntities: parsedMax,
						bypass: {
							superuser: guardrailBypassSuperuser,
							permissions: parsedPermissions,
						},
					},
					note: "Proposed from storefront builder UI",
					actor: "builder-ui",
				}),
			});
			const json = (await res.json()) as StarterKitsPayload;
			if (!res.ok) {
				throw new Error(json.error || "Failed to propose guardrail policy");
			}
			syncGuardrailStateFromPayload(json);
			await loadStarterKitHistory();
			setStatusMessage(
				`Starter-kit guardrail policy proposal created.${formatNotificationSummary(json.notification)}`,
			);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to propose guardrail policy");
		} finally {
			setBusy(false);
		}
	};

	const approveGuardrailPolicy = async () => {
		if (!guardrailPolicyPending?.proposalId) {
			setError("No pending guardrail policy proposal to approve.");
			return;
		}
		setBusy(true);
		setStatusMessage(null);
		setError(null);
		try {
			const res = await fetch("/api/storefront-builder/starter-kits", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "approve-guardrail-policy",
					proposalId: guardrailPolicyPending.proposalId,
					allowSelfApprovalOverride: guardrailApproveSelfOverride,
					note: "Approved from storefront builder UI",
					actor: "builder-ui",
				}),
			});
			const json = (await res.json()) as StarterKitsPayload;
			if (!res.ok) {
				throw new Error(json.error || "Failed to approve guardrail policy");
			}
			syncGuardrailStateFromPayload(json);
			await loadStarterKitHistory();
			setStatusMessage("Starter-kit guardrail policy proposal approved.");
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to approve guardrail policy");
		} finally {
			setBusy(false);
		}
	};

	const rejectGuardrailPolicy = async () => {
		if (!guardrailPolicyPending?.proposalId) {
			setError("No pending guardrail policy proposal to reject.");
			return;
		}
		setBusy(true);
		setStatusMessage(null);
		setError(null);
		try {
			const res = await fetch("/api/storefront-builder/starter-kits", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "reject-guardrail-policy",
					proposalId: guardrailPolicyPending.proposalId,
					note: "Rejected from storefront builder UI",
					actor: "builder-ui",
				}),
			});
			const json = (await res.json()) as StarterKitsPayload;
			if (!res.ok) {
				throw new Error(json.error || "Failed to reject guardrail policy");
			}
			syncGuardrailStateFromPayload(json);
			await loadStarterKitHistory();
			setStatusMessage("Starter-kit guardrail policy proposal rejected.");
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to reject guardrail policy");
		} finally {
			setBusy(false);
		}
	};

	const restoreGuardrailPolicyFromAudit = async (
		auditId: string,
		restoreSource: "before" | "after" = "before",
	) => {
		setBusy(true);
		setStatusMessage(null);
		setError(null);
		try {
			const res = await fetch("/api/storefront-builder/starter-kits", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "restore-guardrail-policy",
					auditId,
					restoreSource,
					note: `Restored guardrail policy (${restoreSource}) from audit ${auditId}`,
					actor: "builder-ui",
				}),
			});
			const json = (await res.json()) as StarterKitsPayload;
			if (!res.ok) {
				throw new Error(json.error || "Failed to restore guardrail policy");
			}
			syncGuardrailStateFromPayload(json);
			await loadStarterKitHistory();
			setStatusMessage(`Starter-kit guardrail policy restored from audit ${auditId} (${restoreSource}).`);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to restore guardrail policy");
		} finally {
			setBusy(false);
		}
	};

	const retryGuardrailNotificationDeadLetter = async (deadLetterId: string) => {
		if (!deadLetterId) {
			setError("deadLetterId is required.");
			return;
		}
		setBusy(true);
		setStatusMessage(null);
		setError(null);
		try {
			const res = await fetch("/api/storefront-builder/starter-kits", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "retry-guardrail-notification-dead-letter",
					deadLetterId,
					note: `Manual dead-letter retry from storefront builder UI (${deadLetterId})`,
					actor: "builder-ui",
				}),
			});
			const json = (await res.json()) as StarterKitsPayload;
			if (!res.ok) {
				throw new Error(json.error || "Failed to retry dead-letter notification");
			}
			syncGuardrailStateFromPayload(json);
			await loadStarterKitHistory();
			const retry = json.notificationRetry;
			const retryLabel = retry?.label || retry?.targetUrl || deadLetterId;
			const retryResult = retry?.successful ? "delivered" : "still failing";
			const retryError = retry?.error ? ` Error: ${retry.error}` : "";
			setStatusMessage(`Dead-letter retry ${retryResult} for ${retryLabel}.${retryError}`);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to retry dead-letter notification");
		} finally {
			setBusy(false);
		}
	};

	const sweepGuardrailNotificationDeadLetters = async (dryRun = false) => {
		setBusy(true);
		setStatusMessage(null);
		setError(null);
		try {
			const res = await fetch("/api/storefront-builder/starter-kits", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "sweep-guardrail-notification-dead-letters",
					dryRun,
					note: dryRun
						? "Dead-letter sweep dry-run from storefront builder UI"
						: "Dead-letter sweep from storefront builder UI",
					actor: "builder-ui",
				}),
			});
			const json = (await res.json()) as StarterKitsPayload;
			if (!res.ok) {
				throw new Error(json.error || "Failed to sweep dead-letter notifications");
			}
			syncGuardrailStateFromPayload(json);
			await loadStarterKitHistory();
			const sweep = json.deadLetterSweep;
			setStatusMessage(
				`Dead-letter sweep (${dryRun ? "dry-run" : "execute"}): stale ${
					sweep?.discoveredStaleCount || 0
				}, processed ${sweep?.processedCount || 0}, delivered ${sweep?.deliveredCount || 0}, failed ${
					sweep?.failedCount || 0
				}, retries ${sweep?.retryAttempts || 0}.`,
			);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to sweep dead-letter notifications");
		} finally {
			setBusy(false);
		}
	};

	const toggleSelection = (items: string[], value: string, checked: boolean): string[] => {
		if (checked) {
			if (items.includes(value)) return items;
			return [...items, value];
		}
		return items.filter((item) => item !== value);
	};

	const selectedCount = (preview: { selectedMenus: string[]; selectedPages: string[] }): number =>
		preview.selectedMenus.length + preview.selectedPages.length;

	const requiresLargeConfirmation = (preview: {
		maxEntities: number;
		selectedMenus: string[];
		selectedPages: string[];
	}) => selectedCount(preview) > preview.maxEntities;

	const guardrailSatisfied = (preview: {
		maxEntities: number;
		selectedMenus: string[];
		selectedPages: string[];
		largeOperationConfirmed: boolean;
		bypassEligible: boolean;
		bypassRequested: boolean;
	}) =>
		!requiresLargeConfirmation(preview) ||
		preview.largeOperationConfirmed ||
		(preview.bypassEligible && preview.bypassRequested);

	const applyStarterKit = async (mode: "draft" | "publish") => {
		if (!selectedStarterKitId) {
			setError("Select a starter kit first.");
			return;
		}
		setBusy(true);
		setStatusMessage(null);
		setError(null);
		try {
			const res = await fetch("/api/storefront-builder/starter-kits", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "apply",
					kitId: selectedStarterKitId,
					mode,
					provisionSaleor: applySaleorProvisioning,
					note: `Applied from storefront builder (${mode})`,
					actor: "builder-ui",
				}),
			});
			const json = (await res.json()) as StarterKitsPayload;
			if (!res.ok) {
				throw new Error(json.error || "Failed to apply starter kit");
			}
			const nextThemeState = json.theme || themeState || null;
			const nextLayoutState = json.homepageLayout || layoutState || null;
			setThemeState(nextThemeState);
			setLayoutState(nextLayoutState);

			applyThemeDraftToForm(nextThemeState?.draft || nextThemeState?.published || {});

			const nextLayoutDraft = nextLayoutState?.draft ||
				nextLayoutState?.published || {
					schemaVersion: schemaPayload?.builder?.schemaVersion || 1,
					sections: [],
				};
			setLayoutDraftText(JSON.stringify(nextLayoutDraft, null, 2));
			setPuckData(layoutToPuckData(nextLayoutDraft, sectionRegistry));
			await loadStarterKitHistory();
			const changedText = json.changed ? "with changes" : "with no changes (idempotent)";
			const provisioningSummary = json.provisioning
				? ` Provisioning created menus: ${(json.provisioning.menus?.created || []).length}, pages: ${
						(json.provisioning.pages?.created || []).length
					}.`
				: "";
			const warningSummary = json.provisioning?.warnings?.length
				? ` Warnings: ${json.provisioning.warnings.join(" | ")}`
				: "";
			setStatusMessage(
				`Starter kit ${selectedStarterKitId} applied in ${mode} mode ${changedText}.${provisioningSummary}${warningSummary}`,
			);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to apply starter kit");
		} finally {
			setBusy(false);
		}
	};

	const rollbackStarterKit = async (auditId: string) => {
		setBusy(true);
		setStatusMessage(null);
		setError(null);
		try {
			const rollbackPreview = rollbackPreviews[auditId];
			const res = await fetch("/api/storefront-builder/starter-kits", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "rollback",
					auditId,
					rollbackProvisionedSaleor,
					rollbackProvisionScope,
					rollbackProvisionSelection: rollbackPreview
						? {
								menus: rollbackPreview.selectedMenus,
								pages: rollbackPreview.selectedPages,
							}
						: undefined,
					confirmLargeProvisionOperation:
						rollbackPreview && requiresLargeConfirmation(rollbackPreview)
							? rollbackPreview.largeOperationConfirmed === true
							: false,
					guardrailBypassRequested:
						rollbackPreview && requiresLargeConfirmation(rollbackPreview)
							? rollbackPreview.bypassEligible && rollbackPreview.bypassRequested
							: false,
					note: "Rollback from storefront builder UI",
					actor: "builder-ui",
				}),
			});
			const json = (await res.json()) as StarterKitsPayload;
			if (!res.ok) {
				throw new Error(json.error || "Failed to rollback starter kit");
			}
			const nextThemeState = json.theme || themeState || null;
			const nextLayoutState = json.homepageLayout || layoutState || null;
			setThemeState(nextThemeState);
			setLayoutState(nextLayoutState);

			applyThemeDraftToForm(nextThemeState?.draft || nextThemeState?.published || {});

			const nextLayoutDraft = nextLayoutState?.draft ||
				nextLayoutState?.published || {
					schemaVersion: schemaPayload?.builder?.schemaVersion || 1,
					sections: [],
				};
			setLayoutDraftText(JSON.stringify(nextLayoutDraft, null, 2));
			setPuckData(layoutToPuckData(nextLayoutDraft, sectionRegistry));
			await loadStarterKitHistory();
			setRollbackPreviews((current) => {
				if (!current[auditId]) return current;
				const next = { ...current };
				delete next[auditId];
				return next;
			});
			const rollbackSummary = json.provisioningRollback
				? ` Saleor rollback deleted menus: ${
						(json.provisioningRollback.menus?.deleted || []).length
					}, pages: ${(json.provisioningRollback.pages?.deleted || []).length}.`
				: "";
			const rollbackWarnings = json.provisioningRollback?.warnings?.length
				? ` Warnings: ${json.provisioningRollback.warnings.join(" | ")}`
				: "";
			setStatusMessage(
				`Rolled back starter-kit apply from audit ${auditId}.${rollbackSummary}${rollbackWarnings}`,
			);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to rollback starter kit");
		} finally {
			setBusy(false);
		}
	};

	const previewRollbackStarterKit = async (auditId: string) => {
		setBusy(true);
		setStatusMessage(null);
		setError(null);
		try {
			const res = await fetch("/api/storefront-builder/starter-kits", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "rollback-dry-run",
					auditId,
					rollbackProvisionedSaleor,
					rollbackProvisionScope,
				}),
			});
			const json = (await res.json()) as StarterKitsPayload;
			if (!res.ok) {
				throw new Error(json.error || "Failed to preview starter-kit rollback impact");
			}
			const rollbackDryRun = json.rollbackDryRun;
			const provisioningPreview = rollbackDryRun?.provisioningRollbackDryRun;
			const previewMenus = provisioningPreview?.menus?.wouldDelete || [];
			const previewPages = provisioningPreview?.pages?.wouldDelete || [];
			setRollbackPreviews((current) => ({
				...current,
				[auditId]: {
					menus: previewMenus,
					pages: previewPages,
					selectedMenus: [...previewMenus],
					selectedPages: [...previewPages],
					missingMenus: provisioningPreview?.menus?.missing || [],
					missingPages: provisioningPreview?.pages?.missing || [],
					warnings: provisioningPreview?.warnings || [],
					maxEntities: provisioningPreview?.guardrail?.maxEntities || DEFAULT_LARGE_OPERATION_THRESHOLD,
					largeOperationConfirmed: false,
					bypassEligible: provisioningPreview?.guardrail?.bypassEligible === true,
					bypassRequested: false,
				},
			}));
			const summary = rollbackDryRun
				? ` Snapshot available: ${rollbackDryRun.hasSnapshot ? "yes" : "no"}.`
				: "";
			const provisioningSummary = provisioningPreview
				? ` Would delete menus: ${(provisioningPreview.menus?.wouldDelete || []).length}, pages: ${
						(provisioningPreview.pages?.wouldDelete || []).length
					}. Missing menus: ${(provisioningPreview.menus?.missing || []).length}, pages: ${
						(provisioningPreview.pages?.missing || []).length
					}.`
				: ` Provision rollback disabled for this preview.`;
			const guardrailSummary = provisioningPreview?.guardrail?.confirmationRequired
				? ` Large operation confirmation required (${provisioningPreview.guardrail.selectedCount} > ${provisioningPreview.guardrail.maxEntities}).`
				: "";
			const warnings = provisioningPreview?.warnings?.length
				? ` Warnings: ${provisioningPreview.warnings.join(" | ")}`
				: "";
			setStatusMessage(
				`Dry-run rollback preview for audit ${auditId}.${summary}${provisioningSummary}${guardrailSummary}${warnings}`,
			);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to preview starter-kit rollback impact");
		} finally {
			setBusy(false);
		}
	};

	const restoreStarterKitProvisioning = async (auditId: string) => {
		setBusy(true);
		setStatusMessage(null);
		setError(null);
		try {
			const restorePreview = restorePreviews[auditId];
			const res = await fetch("/api/storefront-builder/starter-kits", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "restore-provisioned",
					auditId,
					restoreProvisionedSaleor: true,
					restoreProvisionScope,
					restoreConflictPolicy,
					restoreProvisionSelection: restorePreview
						? {
								menus: restorePreview.selectedMenus,
								pages: restorePreview.selectedPages,
							}
						: undefined,
					confirmLargeProvisionOperation:
						restorePreview && requiresLargeConfirmation(restorePreview)
							? restorePreview.largeOperationConfirmed === true
							: false,
					guardrailBypassRequested:
						restorePreview && requiresLargeConfirmation(restorePreview)
							? restorePreview.bypassEligible && restorePreview.bypassRequested
							: false,
					note: "Restore Saleor entities deleted by starter-kit rollback",
					actor: "builder-ui",
				}),
			});
			const json = (await res.json()) as StarterKitsPayload;
			if (!res.ok) {
				throw new Error(json.error || "Failed to restore Saleor entities from rollback");
			}
			await loadStarterKitHistory();
			setRestorePreviews((current) => {
				if (!current[auditId]) return current;
				const next = { ...current };
				delete next[auditId];
				return next;
			});
			const restoreSummary = json.provisioningRestore
				? ` Restored menus: ${(json.provisioningRestore.menus?.created || []).length}, pages: ${
						(json.provisioningRestore.pages?.created || []).length
					}. Existing menus: ${(json.provisioningRestore.menus?.existing || []).length}, pages: ${
						(json.provisioningRestore.pages?.existing || []).length
					}.`
				: "";
			const restoreConflicts = json.provisioningRestore
				? ` Conflict policy: ${
						json.provisioningRestore.conflictPolicy || restoreConflictPolicy
					}. Conflicts menus: ${(json.provisioningRestore.menus?.errors || []).length}, pages: ${
						(json.provisioningRestore.pages?.errors || []).length
					}.`
				: "";
			const restoreWarnings = json.provisioningRestore?.warnings?.length
				? ` Warnings: ${json.provisioningRestore.warnings.join(" | ")}`
				: "";
			setStatusMessage(
				`Restored rollback-provisioned Saleor entities for audit ${auditId}.${restoreSummary}${restoreConflicts}${restoreWarnings}`,
			);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to restore Saleor entities from rollback");
		} finally {
			setBusy(false);
		}
	};

	const previewRestoreStarterKitProvisioning = async (auditId: string) => {
		setBusy(true);
		setStatusMessage(null);
		setError(null);
		try {
			const res = await fetch("/api/storefront-builder/starter-kits", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "restore-provisioned-dry-run",
					auditId,
					restoreProvisionScope,
					restoreConflictPolicy,
				}),
			});
			const json = (await res.json()) as StarterKitsPayload;
			if (!res.ok) {
				throw new Error(json.error || "Failed to preview restore impact");
			}
			const preview = json.provisioningRestoreDryRun;
			const previewMenus = preview?.menus?.wouldCreate || [];
			const previewPages = preview?.pages?.wouldCreate || [];
			setRestorePreviews((current) => ({
				...current,
				[auditId]: {
					menus: previewMenus,
					pages: previewPages,
					selectedMenus: [...previewMenus],
					selectedPages: [...previewPages],
					existingMenus: preview?.menus?.existing || [],
					existingPages: preview?.pages?.existing || [],
					conflictMenus: preview?.menus?.conflicts || [],
					conflictPages: preview?.pages?.conflicts || [],
					warnings: preview?.warnings || [],
					conflictPolicy: preview?.conflictPolicy || restoreConflictPolicy,
					maxEntities: preview?.guardrail?.maxEntities || DEFAULT_LARGE_OPERATION_THRESHOLD,
					largeOperationConfirmed: false,
					bypassEligible: preview?.guardrail?.bypassEligible === true,
					bypassRequested: false,
				},
			}));
			const summary = preview
				? ` Would create menus: ${(preview.menus?.wouldCreate || []).length}, pages: ${
						(preview.pages?.wouldCreate || []).length
					}. Existing menus: ${(preview.menus?.existing || []).length}, pages: ${
						(preview.pages?.existing || []).length
					}. Conflicts menus: ${(preview.menus?.conflicts || []).length}, pages: ${
						(preview.pages?.conflicts || []).length
					}.`
				: "";
			const policySummary = preview
				? ` Conflict policy: ${preview.conflictPolicy || restoreConflictPolicy}.`
				: "";
			const guardrailSummary = preview?.guardrail?.confirmationRequired
				? ` Large operation confirmation required (${preview.guardrail.selectedCount} > ${preview.guardrail.maxEntities}).`
				: "";
			const warnings = preview?.warnings?.length ? ` Warnings: ${preview.warnings.join(" | ")}` : "";
			setStatusMessage(
				`Dry-run restore preview for audit ${auditId}.${summary}${policySummary}${guardrailSummary}${warnings}`,
			);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to preview restore impact");
		} finally {
			setBusy(false);
		}
	};

	if (loading) {
		return (
			<p className="text-sm text-muted-foreground">
				{isEmbedded ? "正在加载店铺搭建信息..." : "正在加载搭建器状态..."}
			</p>
		);
	}

	return (
		<div className="space-y-8">
			{isEmbedded ? (
				<section className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
					<p>
						可视化编辑器已移到独立页面（避免 Dashboard 内嵌窗口太窄）。请在新标签页打开：{" "}
						<a className="font-medium underline" href={fullEditorHref} target="_blank" rel="noreferrer">
							{fullEditorHref}
						</a>
					</p>
				</section>
			) : null}
			{isEmbedded && !editorOnly ? (
				<>
					<section className="rounded-lg border border-border bg-card p-4">
						<h2 className="text-lg font-semibold">
							店铺信息
							<HelpTip text="当前正在编辑的店铺租户信息。遇到数据不一致时，先核对这里的租户和渠道。" />
						</h2>
						<p className="mt-2 text-sm text-muted-foreground">
							域名：<span className="font-medium text-foreground">{tenant?.domain || "未知"}</span> ｜
							租户代码：
							<span className="font-medium text-foreground">{tenant?.code || "未知"}</span> ｜ 渠道：
							<span className="font-medium text-foreground">{tenant?.channel || "default-channel"}</span>
						</p>
					</section>

					<section className="rounded-lg border border-border bg-card p-4">
						<h2 className="text-lg font-semibold">
							快速操作
							<HelpTip text="建议按顺序：先打开编辑器修改内容 -> 保存草稿 -> 打开草稿预览检查 -> 发布。" />
						</h2>
						<div className="mt-3 flex flex-wrap gap-3">
							<a
								className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
								href={fullEditorHref}
								target="_blank"
								rel="noreferrer"
							>
								🛠️ 打开可视化编辑器
							</a>
							<a
								className="rounded border border-border px-4 py-2 text-sm font-medium"
								href={previewHref}
								target="_blank"
								rel="noreferrer"
							>
								👀 打开草稿预览
							</a>
							<a
								className="rounded border border-border px-4 py-2 text-sm font-medium"
								href={publishedHref}
								target="_blank"
								rel="noreferrer"
							>
								🚀 打开已发布页面
							</a>
						</div>
						<ul className="mt-3 space-y-1 text-xs text-muted-foreground">
							<li>• “草稿预览”用于检查未发布修改（URL 带 `?preview=1`）。</li>
							<li>• “已发布页面”是租户真实可访问页面。</li>
							<li>• 如需让修改生效给客户，请在编辑器中点击“Publish”。</li>
						</ul>
					</section>
				</>
			) : null}
			{showAdvancedControlPanel ? (
				<section className="rounded-lg border border-border bg-card p-4">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div>
							<h2 className="text-lg font-semibold">Workspace Mode</h2>
							<p className="mt-1 text-sm text-muted-foreground">
								Use the dedicated editor page for maximum canvas width and faster visual editing.
							</p>
						</div>
						<a
							className="rounded border border-border px-3 py-2 text-sm font-medium"
							href={fullEditorHref}
							target="_blank"
							rel="noreferrer"
						>
							Open Fullscreen Editor
						</a>
					</div>
				</section>
			) : null}
			{showAdvancedControlPanel ? (
				<>
					<section className="rounded-lg border border-border bg-card p-4">
						<h2 className="text-lg font-semibold">Tenant Context</h2>
						<p className="mt-2 text-sm text-muted-foreground">
							Domain: <span className="font-medium text-foreground">{tenant?.domain || "unknown"}</span> |
							Tenant code: <span className="font-medium text-foreground">{tenant?.code || "unknown"}</span> |
							Channel:{" "}
							<span className="font-medium text-foreground">{tenant?.channel || "default-channel"}</span>
						</p>
					</section>

					<section className="rounded-lg border border-border bg-card p-4">
						<h2 className="text-lg font-semibold">Starter Kits (Theme + Homepage)</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Apply a predefined starter kit in draft mode first, then publish after review.
						</p>
						<div className="mt-4 grid gap-4 lg:grid-cols-2">
							<label className="space-y-1 text-sm">
								<span className="font-medium">Starter kit</span>
								<select
									className="w-full rounded border border-border bg-background px-3 py-2"
									value={selectedStarterKitId}
									onChange={(event) => setSelectedStarterKitId(event.target.value)}
								>
									<option value="">Select starter kit</option>
									{starterKits.map((starterKit) => (
										<option key={starterKit.id} value={starterKit.id}>
											{starterKit.name}
										</option>
									))}
								</select>
							</label>
							<div className="text-sm text-muted-foreground">
								<p className="font-medium text-foreground">
									{selectedStarterKit?.description || "No starter kit selected."}
								</p>
								{selectedStarterKit?.tags?.length ? (
									<p className="mt-1">Tags: {selectedStarterKit.tags.join(", ")}</p>
								) : null}
								{selectedStarterKit?.saleorRefs?.suggestedMenus?.length ? (
									<p className="mt-1">
										Suggested menus: {selectedStarterKit.saleorRefs.suggestedMenus.join(", ")}
									</p>
								) : null}
							</div>
						</div>
						<div className="mt-4 flex flex-wrap gap-3">
							<button
								type="button"
								className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
								onClick={() => applyStarterKit("draft")}
								disabled={busy || !selectedStarterKitId}
							>
								Apply Kit as Draft
							</button>
							<button
								type="button"
								className="rounded border border-border px-4 py-2 text-sm font-medium disabled:opacity-50"
								onClick={() => applyStarterKit("publish")}
								disabled={busy || !selectedStarterKitId}
							>
								Apply Kit + Publish
							</button>
						</div>
						<label className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
							<input
								type="checkbox"
								checked={applySaleorProvisioning}
								onChange={(event) => setApplySaleorProvisioning(event.target.checked)}
							/>
							<span>Also provision Saleor menus/pages from starter-kit refs (idempotent).</span>
						</label>
						<label className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
							<input
								type="checkbox"
								checked={rollbackProvisionedSaleor}
								onChange={(event) => setRollbackProvisionedSaleor(event.target.checked)}
							/>
							<span>On rollback, also delete Saleor menus/pages that were created by that apply.</span>
						</label>
						{rollbackProvisionedSaleor ? (
							<div className="ml-6 mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
								<label className="flex items-center gap-2">
									<input
										type="checkbox"
										checked={rollbackProvisionScope.menus}
										onChange={(event) =>
											setRollbackProvisionScope((current) => ({ ...current, menus: event.target.checked }))
										}
									/>
									<span>Rollback menus</span>
								</label>
								<label className="flex items-center gap-2">
									<input
										type="checkbox"
										checked={rollbackProvisionScope.pages}
										onChange={(event) =>
											setRollbackProvisionScope((current) => ({ ...current, pages: event.target.checked }))
										}
									/>
									<span>Rollback pages</span>
								</label>
							</div>
						) : null}
						<div className="ml-6 mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
							<span className="font-medium text-foreground">Restore defaults:</span>
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={restoreProvisionScope.menus}
									onChange={(event) =>
										setRestoreProvisionScope((current) => ({ ...current, menus: event.target.checked }))
									}
								/>
								<span>Restore menus</span>
							</label>
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={restoreProvisionScope.pages}
									onChange={(event) =>
										setRestoreProvisionScope((current) => ({ ...current, pages: event.target.checked }))
									}
								/>
								<span>Restore pages</span>
							</label>
							<label className="flex items-center gap-2">
								<span>Conflict policy</span>
								<select
									className="rounded border border-border bg-background px-2 py-1"
									value={restoreConflictPolicy}
									onChange={(event) => setRestoreConflictPolicy(event.target.value as RestoreConflictPolicy)}
								>
									<option value="skip-existing">skip-existing</option>
									<option value="error-on-existing">error-on-existing</option>
								</select>
							</label>
						</div>
						<div className="mt-4 rounded border border-border bg-background p-3 text-sm">
							<p className="font-medium text-foreground">Rollback/Restore Guardrail Policy</p>
							<p className="mt-1 text-xs text-muted-foreground">
								Per-tenant policy for large starter-kit provisioning operations.
							</p>
							<div className="mt-3 grid gap-3 lg:grid-cols-3">
								<label className="space-y-1 text-xs">
									<span className="font-medium">Max entities</span>
									<input
										className="w-full rounded border border-border bg-background px-2 py-1"
										value={guardrailMaxEntitiesInput}
										onChange={(event) => setGuardrailMaxEntitiesInput(event.target.value)}
										placeholder="20"
									/>
								</label>
								<label className="space-y-1 text-xs lg:col-span-2">
									<span className="font-medium">Bypass permissions (comma-separated)</span>
									<input
										className="w-full rounded border border-border bg-background px-2 py-1"
										value={guardrailBypassPermissionsText}
										onChange={(event) => setGuardrailBypassPermissionsText(event.target.value)}
										placeholder="MANAGE_PAGES"
									/>
								</label>
							</div>
							<label className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
								<input
									type="checkbox"
									checked={guardrailBypassSuperuser}
									onChange={(event) => setGuardrailBypassSuperuser(event.target.checked)}
								/>
								<span>Allow superuser bypass for large operations.</span>
							</label>
							{guardrailPolicy ? (
								<p className="mt-2 text-xs text-muted-foreground">
									Current policy: max {guardrailPolicy.maxEntities || DEFAULT_LARGE_OPERATION_THRESHOLD},
									superuser bypass {guardrailPolicy.bypass?.superuser ? "enabled" : "disabled"}, permissions:{" "}
									{(guardrailPolicy.bypass?.permissions || []).join(", ") || "(none)"}. Updated by{" "}
									{guardrailPolicy.updatedBy || "unknown"} at {guardrailPolicy.updatedAt || "unknown"}.
								</p>
							) : null}
							{guardrailPolicyPending ? (
								<div className="mt-2 rounded border border-amber-300 bg-amber-50 p-2 text-xs text-amber-900">
									<p>
										Pending proposal `{guardrailPolicyPending.proposalId || "unknown"}` by{" "}
										{guardrailPolicyPending.actor || "unknown"} at{" "}
										{guardrailPolicyPending.createdAt || "unknown"}.
									</p>
									{guardrailPolicyPending.actorId ? (
										<p className="mt-1">Proposer ID: {guardrailPolicyPending.actorId}</p>
									) : null}
									<p className="mt-1">
										Proposed max {guardrailPolicyPending.proposedGuardrailPolicy?.maxEntities || "n/a"},
										superuser bypass{" "}
										{guardrailPolicyPending.proposedGuardrailPolicy?.bypass?.superuser
											? "enabled"
											: "disabled"}
										, permissions:{" "}
										{(guardrailPolicyPending.proposedGuardrailPolicy?.bypass?.permissions || []).join(", ") ||
											"(none)"}
										.
									</p>
									{guardrailPolicyPending.note ? (
										<p className="mt-1">Note: {guardrailPolicyPending.note}</p>
									) : null}
								</div>
							) : null}
							{guardrailPolicyPending ? (
								<label className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
									<input
										type="checkbox"
										checked={guardrailApproveSelfOverride}
										onChange={(event) => setGuardrailApproveSelfOverride(event.target.checked)}
									/>
									<span>Allow superuser self-approval override (only if you are superuser).</span>
								</label>
							) : null}
							<div className="mt-2 flex flex-wrap gap-2">
								<button
									type="button"
									className="rounded border border-border px-3 py-1 text-xs font-medium disabled:opacity-50"
									onClick={proposeGuardrailPolicy}
									disabled={busy}
								>
									Propose Guardrail Policy
								</button>
								<button
									type="button"
									className="rounded border border-border px-3 py-1 text-xs font-medium disabled:opacity-50"
									onClick={approveGuardrailPolicy}
									disabled={busy || !guardrailPolicyPending}
								>
									Approve Proposal
								</button>
								<button
									type="button"
									className="rounded border border-border px-3 py-1 text-xs font-medium disabled:opacity-50"
									onClick={rejectGuardrailPolicy}
									disabled={busy || !guardrailPolicyPending}
								>
									Reject Proposal
								</button>
							</div>
						</div>

						{guardrailNotificationDeadLetters.length || guardrailNotificationDeadLetterStatus ? (
							<div className="mt-4 rounded border border-amber-300 bg-amber-50 p-3 text-sm">
								<p className="font-medium text-amber-900">Notification dead letters</p>
								<p className="mt-1 text-xs text-amber-800">
									These notification deliveries failed after retry/backoff and require manual retry.
								</p>
								{guardrailNotificationDeadLetterStatus ? (
									<p
										className={`mt-1 text-xs ${
											guardrailNotificationDeadLetterStatus.alert?.triggered
												? "text-red-700"
												: "text-amber-800"
										}`}
									>
										Status: {guardrailNotificationDeadLetterStatus.deadLetterCount || 0} dead letters,{" "}
										{guardrailNotificationDeadLetterStatus.staleCount || 0} stale (stale-after{" "}
										{formatAgeSeconds(guardrailNotificationDeadLetterStatus.staleAfterSeconds)}), oldest stale
										age {formatAgeSeconds(guardrailNotificationDeadLetterStatus.oldestStaleAgeSeconds)}.
										{guardrailNotificationDeadLetterStatus.alert?.triggered
											? " Alert threshold reached."
											: " Alert threshold not reached."}
									</p>
								) : null}
								<div className="mt-2 flex flex-wrap gap-2">
									<button
										type="button"
										className="rounded border border-amber-400 px-2 py-1 text-xs font-medium text-amber-900 disabled:opacity-50"
										onClick={() => sweepGuardrailNotificationDeadLetters(false)}
										disabled={busy}
									>
										Sweep Stale Now
									</button>
									<button
										type="button"
										className="rounded border border-amber-400 px-2 py-1 text-xs font-medium text-amber-900 disabled:opacity-50"
										onClick={() => sweepGuardrailNotificationDeadLetters(true)}
										disabled={busy}
									>
										Dry-run Sweep
									</button>
								</div>
								<ul className="mt-2 space-y-2">
									{guardrailNotificationDeadLetters.map((deadLetter) => (
										<li
											key={deadLetter.id || deadLetter.targetUrl}
											className="rounded border border-amber-200 bg-white p-2 text-xs"
										>
											<p className="text-amber-900">
												{deadLetter.label || deadLetter.targetUrl || "unknown target"} | proposal{" "}
												{deadLetter.proposalId || "unknown"} | attempts {deadLetter.attempts || 0} (retries:{" "}
												{deadLetter.retryAttempts || 0}/{deadLetter.maxRetries || 0})
											</p>
											<p className="mt-1 text-amber-800">
												Last error: {deadLetter.lastError || "unknown"} | updated{" "}
												{deadLetter.updatedAt || deadLetter.createdAt || "unknown"}
											</p>
											<div className="mt-2">
												<button
													type="button"
													className="rounded border border-amber-400 px-2 py-1 text-xs font-medium text-amber-900 disabled:opacity-50"
													onClick={() => retryGuardrailNotificationDeadLetter(deadLetter.id || "")}
													disabled={busy || !deadLetter.id}
												>
													Retry Delivery
												</button>
											</div>
										</li>
									))}
								</ul>
							</div>
						) : null}

						{starterKitAudit.length ? (
							<details className="mt-4 rounded border border-border bg-background p-3 text-sm">
								<summary className="cursor-pointer font-medium">Starter kit audit history</summary>
								<ul className="mt-2 space-y-2">
									{starterKitAudit.map((entry) => (
										<li key={entry.id} className="rounded border border-border p-2">
											<p className="text-xs text-muted-foreground">
												{entry.createdAt || "unknown time"} | {entry.type} | kit: {entry.kitId || "-"} | mode:{" "}
												{entry.mode || "-"} | changed: {entry.changed ? "yes" : "no"}
											</p>
											{entry.saleorProvisioning ? (
												<p className="mt-1 text-xs text-muted-foreground">
													Saleor created menus: {(entry.saleorProvisioning.menus?.created || []).length},
													pages: {(entry.saleorProvisioning.pages?.created || []).length}
												</p>
											) : null}
											{entry.rollbackProvisioning ? (
												<p className="mt-1 text-xs text-muted-foreground">
													Rollback deleted menus: {(entry.rollbackProvisioning.menus?.deleted || []).length},
													pages: {(entry.rollbackProvisioning.pages?.deleted || []).length}
												</p>
											) : null}
											{entry.restoreProvisioning ? (
												<p className="mt-1 text-xs text-muted-foreground">
													Restore created menus: {(entry.restoreProvisioning.menus?.created || []).length},
													pages: {(entry.restoreProvisioning.pages?.created || []).length}
												</p>
											) : null}
											{entry.rollbackGuardrail ? (
												<p className="mt-1 text-xs text-muted-foreground">
													Rollback guardrail: {entry.rollbackGuardrail.targetCount || 0}/
													{entry.rollbackGuardrail.maxEntities || DEFAULT_LARGE_OPERATION_THRESHOLD} |
													confirmed: {entry.rollbackGuardrail.confirmationProvided ? "yes" : "no"} | bypass
													used: {entry.rollbackGuardrail.bypassUsed ? "yes" : "no"}
												</p>
											) : null}
											{entry.restoreGuardrail ? (
												<p className="mt-1 text-xs text-muted-foreground">
													Restore guardrail: {entry.restoreGuardrail.targetCount || 0}/
													{entry.restoreGuardrail.maxEntities || DEFAULT_LARGE_OPERATION_THRESHOLD} |
													confirmed: {entry.restoreGuardrail.confirmationProvided ? "yes" : "no"} | bypass
													used: {entry.restoreGuardrail.bypassUsed ? "yes" : "no"}
												</p>
											) : null}
											{entry.type === "starter-kit-guardrail-policy" ||
											entry.type === "starter-kit-guardrail-policy-approved" ||
											entry.type === "starter-kit-guardrail-policy-restored" ? (
												<p className="mt-1 text-xs text-muted-foreground">
													Guardrail policy changed. Max entities:{" "}
													{entry.afterGuardrailPolicy?.maxEntities || "n/a"}.
												</p>
											) : null}
											{entry.type === "starter-kit-guardrail-policy-proposed" ? (
												<p className="mt-1 text-xs text-muted-foreground">
													Guardrail policy proposed (proposal: {entry.proposalId || "unknown"}). Proposed max
													entities: {entry.afterGuardrailPolicy?.maxEntities || "n/a"}.
												</p>
											) : null}
											{entry.notification ? (
												<p className="mt-1 text-xs text-muted-foreground">
													Notifications attempted: {entry.notification.attempted || 0}, delivered:{" "}
													{entry.notification.delivered || 0}, failed: {entry.notification.failed || 0}.
												</p>
											) : null}
											{entry.notification?.errors?.length ? (
												<p className="mt-1 text-xs text-amber-700">
													Notification errors: {entry.notification.errors.join(" | ")}
												</p>
											) : null}
											{entry.notificationRetry ? (
												<p className="mt-1 text-xs text-muted-foreground">
													Notification retry: {entry.notificationRetry.successful ? "delivered" : "failed"} |
													target{" "}
													{entry.notificationRetry.label || entry.notificationRetry.targetUrl || "unknown"} |
													attempts {entry.notificationRetry.attempts || 0} (retries:{" "}
													{entry.notificationRetry.retryAttempts || 0}/
													{entry.notificationRetry.maxRetries || 0})
													{entry.notificationRetry.error ? ` | error: ${entry.notificationRetry.error}` : ""}
												</p>
											) : null}
											{entry.dualControl ? (
												<p className="mt-1 text-xs text-muted-foreground">
													Dual-control: proposer {entry.dualControl.proposerId || "unknown"}, approver{" "}
													{entry.dualControl.approverId || "unknown"}, same actor{" "}
													{entry.dualControl.sameApproverAndProposer ? "yes" : "no"}, override used{" "}
													{entry.dualControl.overrideUsed ? "yes" : "no"}.
												</p>
											) : null}
											{entry.type === "starter-kit-guardrail-policy-rejected" ? (
												<p className="mt-1 text-xs text-muted-foreground">
													Guardrail policy proposal rejected (proposal: {entry.proposalId || "unknown"}).
												</p>
											) : null}
											{entry.beforeGuardrailPolicy || entry.afterGuardrailPolicy ? (
												<div className="mt-2 flex flex-wrap gap-2">
													{entry.beforeGuardrailPolicy ? (
														<button
															type="button"
															className="rounded border border-border px-2 py-1 text-xs font-medium disabled:opacity-50"
															onClick={() => restoreGuardrailPolicyFromAudit(entry.id, "before")}
															disabled={busy}
														>
															Restore Before Policy
														</button>
													) : null}
													{entry.afterGuardrailPolicy ? (
														<button
															type="button"
															className="rounded border border-border px-2 py-1 text-xs font-medium disabled:opacity-50"
															onClick={() => restoreGuardrailPolicyFromAudit(entry.id, "after")}
															disabled={busy}
														>
															Restore After Policy
														</button>
													) : null}
												</div>
											) : null}
											{entry.type === "starter-kit-apply" ? (
												<div className="mt-2 flex flex-wrap gap-2">
													<button
														type="button"
														className="rounded border border-border px-2 py-1 text-xs font-medium disabled:opacity-50"
														onClick={() => previewRollbackStarterKit(entry.id)}
														disabled={
															busy ||
															(rollbackProvisionedSaleor &&
																!rollbackProvisionScope.menus &&
																!rollbackProvisionScope.pages)
														}
													>
														Preview Rollback Impact
													</button>
													<button
														type="button"
														className="rounded border border-border px-2 py-1 text-xs font-medium disabled:opacity-50"
														onClick={() => rollbackStarterKit(entry.id)}
														disabled={
															busy ||
															(rollbackProvisionedSaleor &&
																!rollbackProvisionScope.menus &&
																!rollbackProvisionScope.pages) ||
															(!!rollbackPreviews[entry.id] &&
																rollbackPreviews[entry.id].selectedMenus.length === 0 &&
																rollbackPreviews[entry.id].selectedPages.length === 0) ||
															(!!rollbackPreviews[entry.id] &&
																!guardrailSatisfied(rollbackPreviews[entry.id]))
														}
													>
														Rollback to Before This Apply
													</button>
												</div>
											) : null}
											{entry.type === "starter-kit-apply" && rollbackPreviews[entry.id] ? (
												<div className="mt-2 rounded border border-border bg-card p-2 text-xs text-muted-foreground">
													<p className="font-medium text-foreground">Rollback selection</p>
													{rollbackPreviews[entry.id].menus.length > 0 ? (
														<div className="mt-1">
															<p className="font-medium">Menus to delete</p>
															<div className="mt-1 flex flex-wrap gap-2">
																{rollbackPreviews[entry.id].menus.map((menuSlug) => (
																	<label
																		key={`${entry.id}-rollback-menu-${menuSlug}`}
																		className="flex items-center gap-1"
																	>
																		<input
																			type="checkbox"
																			checked={rollbackPreviews[entry.id].selectedMenus.includes(menuSlug)}
																			onChange={(event) =>
																				setRollbackPreviews((current) => ({
																					...current,
																					[entry.id]: {
																						...(current[entry.id] || {
																							menus: [],
																							pages: [],
																							selectedMenus: [],
																							selectedPages: [],
																							missingMenus: [],
																							missingPages: [],
																							warnings: [],
																							maxEntities: DEFAULT_LARGE_OPERATION_THRESHOLD,
																							largeOperationConfirmed: false,
																							bypassEligible: false,
																							bypassRequested: false,
																						}),
																						selectedMenus: toggleSelection(
																							current[entry.id]?.selectedMenus || [],
																							menuSlug,
																							event.target.checked,
																						),
																					},
																				}))
																			}
																		/>
																		<span>{menuSlug}</span>
																	</label>
																))}
															</div>
														</div>
													) : null}
													{rollbackPreviews[entry.id].pages.length > 0 ? (
														<div className="mt-1">
															<p className="font-medium">Pages to delete</p>
															<div className="mt-1 flex flex-wrap gap-2">
																{rollbackPreviews[entry.id].pages.map((pageSlug) => (
																	<label
																		key={`${entry.id}-rollback-page-${pageSlug}`}
																		className="flex items-center gap-1"
																	>
																		<input
																			type="checkbox"
																			checked={rollbackPreviews[entry.id].selectedPages.includes(pageSlug)}
																			onChange={(event) =>
																				setRollbackPreviews((current) => ({
																					...current,
																					[entry.id]: {
																						...(current[entry.id] || {
																							menus: [],
																							pages: [],
																							selectedMenus: [],
																							selectedPages: [],
																							missingMenus: [],
																							missingPages: [],
																							warnings: [],
																							maxEntities: DEFAULT_LARGE_OPERATION_THRESHOLD,
																							largeOperationConfirmed: false,
																							bypassEligible: false,
																							bypassRequested: false,
																						}),
																						selectedPages: toggleSelection(
																							current[entry.id]?.selectedPages || [],
																							pageSlug,
																							event.target.checked,
																						),
																					},
																				}))
																			}
																		/>
																		<span>{pageSlug}</span>
																	</label>
																))}
															</div>
														</div>
													) : null}
													{rollbackPreviews[entry.id].missingMenus.length ||
													rollbackPreviews[entry.id].missingPages.length ? (
														<p className="mt-1">
															Missing entities (already absent) menus:{" "}
															{rollbackPreviews[entry.id].missingMenus.length}, pages:{" "}
															{rollbackPreviews[entry.id].missingPages.length}.
														</p>
													) : null}
													{rollbackPreviews[entry.id].warnings.length ? (
														<p className="mt-1">
															Warnings: {rollbackPreviews[entry.id].warnings.join(" | ")}
														</p>
													) : null}
													{requiresLargeConfirmation(rollbackPreviews[entry.id]) ? (
														<label className="mt-2 flex items-center gap-2">
															<input
																type="checkbox"
																checked={rollbackPreviews[entry.id].largeOperationConfirmed}
																onChange={(event) =>
																	setRollbackPreviews((current) => ({
																		...current,
																		[entry.id]: {
																			...(current[entry.id] || {
																				menus: [],
																				pages: [],
																				selectedMenus: [],
																				selectedPages: [],
																				missingMenus: [],
																				missingPages: [],
																				warnings: [],
																				maxEntities: DEFAULT_LARGE_OPERATION_THRESHOLD,
																				largeOperationConfirmed: false,
																				bypassEligible: false,
																				bypassRequested: false,
																			}),
																			largeOperationConfirmed: event.target.checked,
																		},
																	}))
																}
															/>
															<span>
																Confirm large rollback ({selectedCount(rollbackPreviews[entry.id])} entities
																&gt; threshold {rollbackPreviews[entry.id].maxEntities}).
															</span>
														</label>
													) : null}
													{requiresLargeConfirmation(rollbackPreviews[entry.id]) &&
													rollbackPreviews[entry.id].bypassEligible ? (
														<label className="mt-2 flex items-center gap-2">
															<input
																type="checkbox"
																checked={rollbackPreviews[entry.id].bypassRequested}
																onChange={(event) =>
																	setRollbackPreviews((current) => ({
																		...current,
																		[entry.id]: {
																			...(current[entry.id] || {
																				menus: [],
																				pages: [],
																				selectedMenus: [],
																				selectedPages: [],
																				missingMenus: [],
																				missingPages: [],
																				warnings: [],
																				maxEntities: DEFAULT_LARGE_OPERATION_THRESHOLD,
																				largeOperationConfirmed: false,
																				bypassEligible: false,
																				bypassRequested: false,
																			}),
																			bypassRequested: event.target.checked,
																		},
																	}))
																}
															/>
															<span>Use role-based bypass policy for this rollback.</span>
														</label>
													) : null}
												</div>
											) : null}
											{entry.type === "starter-kit-rollback" ? (
												<div className="mt-2 flex flex-wrap gap-2">
													<button
														type="button"
														className="rounded border border-border px-2 py-1 text-xs font-medium disabled:opacity-50"
														onClick={() => previewRestoreStarterKitProvisioning(entry.id)}
														disabled={busy || (!restoreProvisionScope.menus && !restoreProvisionScope.pages)}
													>
														Preview Restore Impact
													</button>
													<button
														type="button"
														className="rounded border border-border px-2 py-1 text-xs font-medium disabled:opacity-50"
														onClick={() => restoreStarterKitProvisioning(entry.id)}
														disabled={
															busy ||
															(!restoreProvisionScope.menus && !restoreProvisionScope.pages) ||
															(!!restorePreviews[entry.id] &&
																restorePreviews[entry.id].selectedMenus.length === 0 &&
																restorePreviews[entry.id].selectedPages.length === 0) ||
															(!!restorePreviews[entry.id] &&
																!guardrailSatisfied(restorePreviews[entry.id])) ||
															((entry.rollbackProvisioning?.menus?.deleted || []).length === 0 &&
																(entry.rollbackProvisioning?.pages?.deleted || []).length === 0)
														}
													>
														Restore Deleted Saleor Entities
													</button>
												</div>
											) : null}
											{entry.type === "starter-kit-rollback" && restorePreviews[entry.id] ? (
												<div className="mt-2 rounded border border-border bg-card p-2 text-xs text-muted-foreground">
													<p className="font-medium text-foreground">
														Restore selection (policy: {restorePreviews[entry.id].conflictPolicy})
													</p>
													{restorePreviews[entry.id].menus.length > 0 ? (
														<div className="mt-1">
															<p className="font-medium">Menus to create</p>
															<div className="mt-1 flex flex-wrap gap-2">
																{restorePreviews[entry.id].menus.map((menuSlug) => (
																	<label
																		key={`${entry.id}-restore-menu-${menuSlug}`}
																		className="flex items-center gap-1"
																	>
																		<input
																			type="checkbox"
																			checked={restorePreviews[entry.id].selectedMenus.includes(menuSlug)}
																			onChange={(event) =>
																				setRestorePreviews((current) => ({
																					...current,
																					[entry.id]: {
																						...(current[entry.id] || {
																							menus: [],
																							pages: [],
																							selectedMenus: [],
																							selectedPages: [],
																							existingMenus: [],
																							existingPages: [],
																							conflictMenus: [],
																							conflictPages: [],
																							warnings: [],
																							conflictPolicy: restoreConflictPolicy,
																							maxEntities: DEFAULT_LARGE_OPERATION_THRESHOLD,
																							largeOperationConfirmed: false,
																							bypassEligible: false,
																							bypassRequested: false,
																						}),
																						selectedMenus: toggleSelection(
																							current[entry.id]?.selectedMenus || [],
																							menuSlug,
																							event.target.checked,
																						),
																					},
																				}))
																			}
																		/>
																		<span>{menuSlug}</span>
																	</label>
																))}
															</div>
														</div>
													) : null}
													{restorePreviews[entry.id].pages.length > 0 ? (
														<div className="mt-1">
															<p className="font-medium">Pages to create</p>
															<div className="mt-1 flex flex-wrap gap-2">
																{restorePreviews[entry.id].pages.map((pageSlug) => (
																	<label
																		key={`${entry.id}-restore-page-${pageSlug}`}
																		className="flex items-center gap-1"
																	>
																		<input
																			type="checkbox"
																			checked={restorePreviews[entry.id].selectedPages.includes(pageSlug)}
																			onChange={(event) =>
																				setRestorePreviews((current) => ({
																					...current,
																					[entry.id]: {
																						...(current[entry.id] || {
																							menus: [],
																							pages: [],
																							selectedMenus: [],
																							selectedPages: [],
																							existingMenus: [],
																							existingPages: [],
																							conflictMenus: [],
																							conflictPages: [],
																							warnings: [],
																							conflictPolicy: restoreConflictPolicy,
																							maxEntities: DEFAULT_LARGE_OPERATION_THRESHOLD,
																							largeOperationConfirmed: false,
																							bypassEligible: false,
																							bypassRequested: false,
																						}),
																						selectedPages: toggleSelection(
																							current[entry.id]?.selectedPages || [],
																							pageSlug,
																							event.target.checked,
																						),
																					},
																				}))
																			}
																		/>
																		<span>{pageSlug}</span>
																	</label>
																))}
															</div>
														</div>
													) : null}
													{restorePreviews[entry.id].existingMenus.length ||
													restorePreviews[entry.id].existingPages.length ? (
														<p className="mt-1">
															Existing entities menus: {restorePreviews[entry.id].existingMenus.length},
															pages: {restorePreviews[entry.id].existingPages.length}.
														</p>
													) : null}
													{restorePreviews[entry.id].conflictMenus.length ||
													restorePreviews[entry.id].conflictPages.length ? (
														<p className="mt-1">
															Conflicts menus: {restorePreviews[entry.id].conflictMenus.length}, pages:{" "}
															{restorePreviews[entry.id].conflictPages.length}.
														</p>
													) : null}
													{restorePreviews[entry.id].warnings.length ? (
														<p className="mt-1">Warnings: {restorePreviews[entry.id].warnings.join(" | ")}</p>
													) : null}
													{requiresLargeConfirmation(restorePreviews[entry.id]) ? (
														<label className="mt-2 flex items-center gap-2">
															<input
																type="checkbox"
																checked={restorePreviews[entry.id].largeOperationConfirmed}
																onChange={(event) =>
																	setRestorePreviews((current) => ({
																		...current,
																		[entry.id]: {
																			...(current[entry.id] || {
																				menus: [],
																				pages: [],
																				selectedMenus: [],
																				selectedPages: [],
																				existingMenus: [],
																				existingPages: [],
																				conflictMenus: [],
																				conflictPages: [],
																				warnings: [],
																				conflictPolicy: restoreConflictPolicy,
																				maxEntities: DEFAULT_LARGE_OPERATION_THRESHOLD,
																				largeOperationConfirmed: false,
																				bypassEligible: false,
																				bypassRequested: false,
																			}),
																			largeOperationConfirmed: event.target.checked,
																		},
																	}))
																}
															/>
															<span>
																Confirm large restore ({selectedCount(restorePreviews[entry.id])} entities
																&gt; threshold {restorePreviews[entry.id].maxEntities}).
															</span>
														</label>
													) : null}
													{requiresLargeConfirmation(restorePreviews[entry.id]) &&
													restorePreviews[entry.id].bypassEligible ? (
														<label className="mt-2 flex items-center gap-2">
															<input
																type="checkbox"
																checked={restorePreviews[entry.id].bypassRequested}
																onChange={(event) =>
																	setRestorePreviews((current) => ({
																		...current,
																		[entry.id]: {
																			...(current[entry.id] || {
																				menus: [],
																				pages: [],
																				selectedMenus: [],
																				selectedPages: [],
																				existingMenus: [],
																				existingPages: [],
																				conflictMenus: [],
																				conflictPages: [],
																				warnings: [],
																				conflictPolicy: restoreConflictPolicy,
																				maxEntities: DEFAULT_LARGE_OPERATION_THRESHOLD,
																				largeOperationConfirmed: false,
																				bypassEligible: false,
																				bypassRequested: false,
																			}),
																			bypassRequested: event.target.checked,
																		},
																	}))
																}
															/>
															<span>Use role-based bypass policy for this restore.</span>
														</label>
													) : null}
												</div>
											) : null}
										</li>
									))}
								</ul>
							</details>
						) : null}
					</section>

					<section className="rounded-lg border border-border bg-card p-4">
						<h2 className="text-lg font-semibold">主题草稿 / 发布</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							当前版本：{themeState?.activeVersion || 0} | 草稿：{themeState?.draft ? "是" : "否"} | 已发布：
							{themeState?.published ? "是" : "否"} | 历史记录：{themeState?.historyCount || 0}
						</p>
						<div className="mt-4 grid gap-4 lg:grid-cols-2">
							<label className="space-y-1 text-sm">
								<span className="font-medium">
									店铺名称
									<HelpTip text="显示在浏览器标题和部分页面抬头。" />
								</span>
								<input
									className="w-full rounded border border-border bg-background px-3 py-2"
									value={siteName}
									onChange={(event) => setSiteName(event.target.value)}
									placeholder="Dev Store 01"
								/>
							</label>
							<label className="space-y-1 text-sm">
								<span className="font-medium">
									主题预设
									<HelpTip text="先选预设，再按需微调 Token。预设会提供一组基础视觉风格。" />
								</span>
								<select
									className="w-full rounded border border-border bg-background px-3 py-2"
									value={themePreset}
									onChange={(event) => setThemePreset(event.target.value)}
								>
									{THEME_PRESET_OPTIONS.map((option) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</select>
							</label>
						</div>
						<div className="mt-4 rounded border border-border bg-background p-3">
							<p className="text-sm font-medium">
								主题 Token（推荐）
								<HelpTip text="优先在这里调整颜色/密度/间距；保证全站一致。支持 HEX 或 CSS 颜色值（如 oklch）。" />
							</p>
							<p className="mt-1 text-xs text-muted-foreground">
								这是 Layer A（全站风格）配置。建议先使用预设，再做少量调整。
							</p>
							<div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
								{THEME_TOKEN_DEFINITIONS.map((definition) => {
									const value = themeTokens[definition.key] || "";
									const colorPickerEnabled = definition.inputType === "color" && isHexColor(value);
									const colorPickerValue = colorPickerEnabled ? value : "#111111";
									return (
										<label key={definition.key} className="space-y-1 text-sm">
											<span className="font-medium">
												{definition.label}
												{definition.description ? <HelpTip text={definition.description} /> : null}
											</span>
											{definition.inputType === "select" ? (
												<select
													className="w-full rounded border border-border bg-background px-3 py-2"
													value={value}
													onChange={(event) =>
														setThemeTokens((current) => ({
															...current,
															[definition.key]: event.target.value,
														}))
													}
												>
													<option value="">未设置（跟随预设）</option>
													{definition.options?.map((option) => (
														<option key={option.value} value={option.value}>
															{option.label}
														</option>
													))}
												</select>
											) : definition.inputType === "number" ? (
												<input
													type="number"
													className="w-full rounded border border-border bg-background px-3 py-2"
													value={value}
													min={definition.min}
													max={definition.max}
													step={definition.step}
													placeholder={
														typeof definition.min === "number" && typeof definition.max === "number"
															? `${definition.min} - ${definition.max}`
															: undefined
													}
													onChange={(event) =>
														setThemeTokens((current) => ({
															...current,
															[definition.key]: event.target.value,
														}))
													}
												/>
											) : (
												<div className="flex items-center gap-2">
													<input
														type="text"
														className="w-full rounded border border-border bg-background px-3 py-2 font-mono text-xs"
														value={value}
														placeholder={definition.placeholder}
														onChange={(event) =>
															setThemeTokens((current) => ({
																...current,
																[definition.key]: event.target.value,
															}))
														}
													/>
													{definition.inputType === "color" ? (
														<input
															type="color"
															className="h-9 w-10 cursor-pointer rounded border border-border bg-background p-1 disabled:cursor-not-allowed disabled:opacity-50"
															value={colorPickerValue}
															disabled={!colorPickerEnabled}
															title={
																colorPickerEnabled ? "颜色选择器" : "仅当值为 HEX 颜色时可用（例如 #1f2937）"
															}
															onChange={(event) =>
																setThemeTokens((current) => ({
																	...current,
																	[definition.key]: event.target.value,
																}))
															}
														/>
													) : null}
												</div>
											)}
										</label>
									);
								})}
							</div>
						</div>
						<div className="mt-4 grid gap-4 lg:grid-cols-2">
							<label className="space-y-1 text-sm">
								<span className="font-medium">SEO 默认标题</span>
								<input
									className="w-full rounded border border-border bg-background px-3 py-2"
									value={seoDefaultTitle}
									onChange={(event) => setSeoDefaultTitle(event.target.value)}
									placeholder="Dev Store 01"
								/>
							</label>
							<label className="space-y-1 text-sm">
								<span className="font-medium">SEO 默认分享图 URL</span>
								<input
									className="w-full rounded border border-border bg-background px-3 py-2"
									value={seoDefaultImage}
									onChange={(event) => setSeoDefaultImage(event.target.value)}
									placeholder="/opengraph-image.png"
								/>
							</label>
						</div>
						<label className="mt-4 block space-y-1 text-sm">
							<span className="font-medium">SEO 默认描述</span>
							<textarea
								className="min-h-24 w-full rounded border border-border bg-background px-3 py-2"
								value={seoDefaultDescription}
								onChange={(event) => setSeoDefaultDescription(event.target.value)}
								placeholder="当页面未单独设置描述时，使用此默认描述。"
							/>
						</label>
						<details className="mt-4 rounded border border-border bg-background p-3">
							<summary className="cursor-pointer text-sm font-medium">
								高级覆盖（JSON，可选）
								<HelpTip text="仅建议高级用户使用。这里适合放非标准字段；已在 Token 表单中的字段请优先在上方编辑。" />
							</summary>
							<textarea
								className="mt-3 min-h-36 w-full rounded border border-border bg-background px-3 py-2 font-mono text-xs"
								value={themeOverridesText}
								onChange={(event) => setThemeOverridesText(event.target.value)}
							/>
						</details>
						<div className="mt-4 flex flex-wrap gap-3">
							<button
								type="button"
								className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
								onClick={saveThemeDraft}
								disabled={busy}
							>
								保存主题草稿
							</button>
							<button
								type="button"
								className="rounded border border-border px-4 py-2 text-sm font-medium disabled:opacity-50"
								onClick={publishTheme}
								disabled={busy}
							>
								发布主题
							</button>
						</div>
					</section>

					<section className="rounded-lg border border-border bg-card p-4">
						<h2 className="text-lg font-semibold">商品页配置（PDP / PLP）</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							当前版本：{commerceState?.activeVersion || 0} | 草稿：{commerceState?.draft ? "是" : "否"} |
							已发布：
							{commerceState?.published ? "是" : "否"} | 历史记录：{commerceState?.historyCount || 0}
						</p>
						<div className="mt-4 grid gap-4 xl:grid-cols-2">
							<div className="rounded border border-border bg-background p-3">
								<p className="text-sm font-medium">PLP（列表页）</p>
								<div className="mt-3 grid gap-3 md:grid-cols-2">
									<label className="space-y-1 text-sm">
										<span className="font-medium">页面预设</span>
										<select
											className="w-full rounded border border-border bg-background px-3 py-2"
											value={commerceDraft.plp?.preset || "standard-grid"}
											onChange={(event) =>
												setCommerceDraft((current) => ({
													...current,
													plp: { ...current.plp, preset: event.target.value as CommercePlpPreset },
												}))
											}
										>
											{COMMERCE_PLP_PRESET_OPTIONS.map((option) => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</select>
									</label>
									<label className="space-y-1 text-sm">
										<span className="font-medium">默认排序</span>
										<select
											className="w-full rounded border border-border bg-background px-3 py-2"
											value={commerceDraft.plp?.defaultSort || "newest"}
											onChange={(event) =>
												setCommerceDraft((current) => ({
													...current,
													plp: { ...current.plp, defaultSort: event.target.value as CommerceSortOption },
												}))
											}
										>
											{COMMERCE_PLP_SORT_OPTIONS.map((option) => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</select>
									</label>
									<label className="space-y-1 text-sm">
										<span className="font-medium">筛选布局</span>
										<select
											className="w-full rounded border border-border bg-background px-3 py-2"
											value={commerceDraft.plp?.filterLayout || "sidebar"}
											onChange={(event) =>
												setCommerceDraft((current) => ({
													...current,
													plp: {
														...current.plp,
														filterLayout: event.target.value as CommercePlpFilterLayout,
													},
												}))
											}
										>
											{COMMERCE_PLP_FILTER_LAYOUT_OPTIONS.map((option) => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</select>
									</label>
									<label className="space-y-1 text-sm">
										<span className="font-medium">卡片密度</span>
										<select
											className="w-full rounded border border-border bg-background px-3 py-2"
											value={commerceDraft.plp?.cardDensity || "standard"}
											onChange={(event) =>
												setCommerceDraft((current) => ({
													...current,
													plp: { ...current.plp, cardDensity: event.target.value as CommercePlpCardDensity },
												}))
											}
										>
											{COMMERCE_PLP_CARD_DENSITY_OPTIONS.map((option) => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</select>
									</label>
								</div>
								<div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={commerceDraft.plp?.flags?.showFilters !== false}
											onChange={(event) =>
												setCommerceDraft((current) => ({
													...current,
													plp: {
														...current.plp,
														flags: { ...current.plp?.flags, showFilters: event.target.checked },
													},
												}))
											}
										/>
										<span>显示筛选控件</span>
									</label>
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={commerceDraft.plp?.flags?.showSort !== false}
											onChange={(event) =>
												setCommerceDraft((current) => ({
													...current,
													plp: {
														...current.plp,
														flags: { ...current.plp?.flags, showSort: event.target.checked },
													},
												}))
											}
										/>
										<span>显示排序控件</span>
									</label>
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={commerceDraft.plp?.slots?.topBanner === true}
											onChange={(event) =>
												setCommerceDraft((current) => ({
													...current,
													plp: {
														...current.plp,
														slots: { ...current.plp?.slots, topBanner: event.target.checked },
													},
												}))
											}
										/>
										<span>顶部横幅插槽</span>
									</label>
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={commerceDraft.plp?.slots?.descriptionBlock !== false}
											onChange={(event) =>
												setCommerceDraft((current) => ({
													...current,
													plp: {
														...current.plp,
														slots: { ...current.plp?.slots, descriptionBlock: event.target.checked },
													},
												}))
											}
										/>
										<span>描述区块插槽</span>
									</label>
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={commerceDraft.plp?.slots?.subCategoryNav !== false}
											onChange={(event) =>
												setCommerceDraft((current) => ({
													...current,
													plp: {
														...current.plp,
														slots: { ...current.plp?.slots, subCategoryNav: event.target.checked },
													},
												}))
											}
										/>
										<span>子分类导航插槽</span>
									</label>
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={commerceDraft.plp?.slots?.seoText !== false}
											onChange={(event) =>
												setCommerceDraft((current) => ({
													...current,
													plp: {
														...current.plp,
														slots: { ...current.plp?.slots, seoText: event.target.checked },
													},
												}))
											}
										/>
										<span>SEO 文本插槽</span>
									</label>
								</div>
							</div>

							<div className="rounded border border-border bg-background p-3">
								<p className="text-sm font-medium">PDP（详情页）</p>
								<div className="mt-3 grid gap-3 md:grid-cols-2">
									<label className="space-y-1 text-sm md:col-span-2">
										<span className="font-medium">详情页预设</span>
										<select
											className="w-full rounded border border-border bg-background px-3 py-2"
											value={commerceDraft.pdp?.preset || "classic"}
											onChange={(event) =>
												setCommerceDraft((current) => ({
													...current,
													pdp: { ...current.pdp, preset: event.target.value as CommercePdpPreset },
												}))
											}
										>
											{COMMERCE_PDP_PRESET_OPTIONS.map((option) => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</select>
									</label>
								</div>
								<div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={commerceDraft.pdp?.slots?.trustBadges !== false}
											onChange={(event) =>
												setCommerceDraft((current) => ({
													...current,
													pdp: {
														...current.pdp,
														slots: { ...current.pdp?.slots, trustBadges: event.target.checked },
													},
												}))
											}
										/>
										<span>信任标识插槽</span>
									</label>
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={commerceDraft.pdp?.slots?.shippingInfo !== false}
											onChange={(event) =>
												setCommerceDraft((current) => ({
													...current,
													pdp: {
														...current.pdp,
														slots: { ...current.pdp?.slots, shippingInfo: event.target.checked },
													},
												}))
											}
										/>
										<span>物流说明插槽</span>
									</label>
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={commerceDraft.pdp?.slots?.returnsSnippet !== false}
											onChange={(event) =>
												setCommerceDraft((current) => ({
													...current,
													pdp: {
														...current.pdp,
														slots: { ...current.pdp?.slots, returnsSnippet: event.target.checked },
													},
												}))
											}
										/>
										<span>退换说明插槽</span>
									</label>
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={commerceDraft.pdp?.slots?.faq !== false}
											onChange={(event) =>
												setCommerceDraft((current) => ({
													...current,
													pdp: {
														...current.pdp,
														slots: { ...current.pdp?.slots, faq: event.target.checked },
													},
												}))
											}
										/>
										<span>FAQ 插槽</span>
									</label>
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={commerceDraft.pdp?.slots?.relatedProducts !== false}
											onChange={(event) =>
												setCommerceDraft((current) => ({
													...current,
													pdp: {
														...current.pdp,
														slots: { ...current.pdp?.slots, relatedProducts: event.target.checked },
													},
												}))
											}
										/>
										<span>关联商品插槽</span>
									</label>
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={commerceDraft.pdp?.slots?.contactCta !== false}
											onChange={(event) =>
												setCommerceDraft((current) => ({
													...current,
													pdp: {
														...current.pdp,
														slots: { ...current.pdp?.slots, contactCta: event.target.checked },
													},
												}))
											}
										/>
										<span>联系 CTA 插槽</span>
									</label>
									<label className="flex items-center gap-2 md:col-span-2">
										<input
											type="checkbox"
											checked={commerceDraft.pdp?.flags?.stickyAddToCart === true}
											onChange={(event) =>
												setCommerceDraft((current) => ({
													...current,
													pdp: {
														...current.pdp,
														flags: { ...current.pdp?.flags, stickyAddToCart: event.target.checked },
													},
												}))
											}
										/>
										<span>启用吸顶加购（Sticky Add to Cart）</span>
									</label>
								</div>
							</div>
						</div>
						<div className="mt-4 flex flex-wrap gap-3">
							<button
								type="button"
								className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
								onClick={saveCommerceDraft}
								disabled={busy}
							>
								保存商品页草稿
							</button>
							<button
								type="button"
								className="rounded border border-border px-4 py-2 text-sm font-medium disabled:opacity-50"
								onClick={publishCommerceLayout}
								disabled={busy}
							>
								发布商品页配置
							</button>
						</div>
					</section>
				</>
			) : null}

			{showHomepageEditor ? (
				<section className="rounded-lg border border-border bg-card p-4">
					<h2 className="text-lg font-semibold">首页布局草稿 / 发布</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						当前版本：{layoutState?.activeVersion || 0} | 草稿：{layoutState?.draft ? "是" : "否"} | 已发布：
						{layoutState?.published ? "是" : "否"} | 历史记录：{layoutState?.historyCount || 0}
					</p>
					<p className="mt-1 text-sm text-muted-foreground">
						Puck 首选编辑器：
						<span className="font-medium text-foreground">
							{schemaPayload?.builder?.preferredEditor || "puck"}
						</span>{" "}
						| 已放置区块：<span className="font-medium text-foreground">{placedSectionCount}</span> |
						可用区块总数：<span className="font-medium text-foreground">{sectionRegistry.length || 0}</span>
					</p>
					<div className="mt-3 flex flex-wrap items-center gap-3 rounded border border-border bg-background px-3 py-2 text-sm">
						<label className="flex items-center gap-2">
							<span className="text-muted-foreground">样式编辑层级</span>
							<select
								className="h-8 rounded border border-border bg-background px-2 text-sm"
								value={styleControlTier}
								onChange={(event) => setStyleControlTier(event.target.value as StyleControlTier)}
							>
								{STYLE_CONTROL_TIER_OPTIONS.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</label>
						<span className="text-xs text-muted-foreground">
							基础仅显示必填常用项；标准增加次级样式；高级显示全部字段（含精细数值）。
						</span>
						<span className="text-xs text-muted-foreground">
							该层级只影响右侧字段显示，不会改变左侧可用区块数量。
						</span>
					</div>
					<details className="mt-3 rounded border border-border bg-background p-3 text-sm">
						<summary className="cursor-pointer font-medium">区块目录 v1（按上线顺序）</summary>
						<div className="mt-2 space-y-3 text-muted-foreground">
							{sectionCatalogSummary.map((group) => (
								<div key={group.label}>
									<p className="text-sm font-medium text-foreground">{group.label}</p>
									<p className="text-xs">
										{group.items
											.map((section) => {
												const sectionTier =
													section.tier && SECTION_TIER_LABELS[section.tier]
														? ` · ${SECTION_TIER_LABELS[section.tier]}`
														: "";
												const orderPrefix =
													typeof section.rolloutOrder === "number" ? `#${section.rolloutOrder} ` : "";
												return `${orderPrefix}${section.title}${sectionTier}`;
											})
											.join("；")}
									</p>
								</div>
							))}
						</div>
					</details>

					{canUsePuck ? (
						<div className="mt-4 space-y-3">
							<div className="flex flex-wrap items-center justify-between gap-3 rounded border border-border bg-background px-3 py-2 text-xs">
								<p className="text-muted-foreground">
									当前为纯可视化编辑模式。请使用{" "}
									<a className="font-medium underline" href={previewHref} target="_blank" rel="noreferrer">
										打开草稿预览
									</a>{" "}
									在独立页面查看真实店铺效果。
								</p>
								<div className="flex items-center gap-3">
									<label className="flex items-center gap-2">
										<span className="text-muted-foreground">自动保存</span>
										<input
											type="checkbox"
											checked={layoutAutosaveEnabled}
											onChange={(event) => setLayoutAutosaveEnabled(event.target.checked)}
										/>
									</label>
									{lastAutosavedAt ? (
										<span className="text-muted-foreground">
											上次保存：{new Date(lastAutosavedAt).toLocaleTimeString()}
										</span>
									) : null}
								</div>
							</div>
							<div ref={puckShellRef} className="overflow-hidden rounded border border-border bg-background">
								<Puck
									config={puckConfig as never}
									data={puckData as never}
									onChange={(nextData) =>
										setPuckData(normalizePuckData(nextData as unknown as PuckDataShape))
									}
									onPublish={() => publishLayout()}
									iframe={{ enabled: false }}
									plugins={puckPlugins as never}
									height={editorOnly ? 820 : 700}
									headerTitle="首页可视化编辑"
								/>
							</div>
						</div>
					) : (
						<label className="mt-4 block space-y-1 text-sm">
							<span className="font-medium">首页草稿 JSON</span>
							<textarea
								className="min-h-72 w-full rounded border border-border bg-background px-3 py-2 font-mono text-xs"
								value={layoutDraftText}
								onChange={(event) => setLayoutDraftText(event.target.value)}
							/>
						</label>
					)}

					{canUsePuck ? (
						<details className="mt-4 rounded border border-border bg-background p-3 text-sm">
							<summary className="cursor-pointer font-medium">草稿 JSON 预览（来自 Puck）</summary>
							<pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-all text-xs text-muted-foreground">
								{JSON.stringify(layoutFromPuck, null, 2)}
							</pre>
						</details>
					) : null}

					<div className="mt-4 flex flex-wrap gap-3">
						<button
							type="button"
							className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
							onClick={saveLayoutDraft}
							disabled={busy}
						>
							保存布局草稿
						</button>
						<button
							type="button"
							className="rounded border border-border px-4 py-2 text-sm font-medium disabled:opacity-50"
							onClick={publishLayout}
							disabled={busy}
						>
							发布布局
						</button>
						<a
							className="rounded border border-border px-4 py-2 text-sm font-medium"
							href={previewHref}
							target="_blank"
							rel="noreferrer"
						>
							打开草稿预览
						</a>
					</div>

					<details className="mt-4 rounded border border-border bg-background p-3 text-sm">
						<summary className="cursor-pointer font-medium">素材库（总计 {assetBrowserTotalCount}）</summary>
						<p className="mt-2 text-xs text-muted-foreground">
							可在区块「背景图片」字段中直接上传，也可以从下方素材库选择复用。
						</p>
						<div className="mt-3 flex flex-wrap items-end gap-2 rounded border border-border bg-card p-2">
							<label className="flex min-w-[220px] flex-1 flex-col gap-1 text-xs">
								<span className="text-muted-foreground">搜索素材</span>
								<input
									type="text"
									value={assetSearchInput}
									onChange={(event) => setAssetSearchInput(event.target.value)}
									placeholder="名称、URL、标签"
									className="h-8 rounded border border-border bg-background px-2 text-sm"
								/>
							</label>
							<label className="flex min-w-[180px] flex-col gap-1 text-xs">
								<span className="text-muted-foreground">标签筛选</span>
								<select
									value={assetTagFilter}
									onChange={(event) => setAssetTagFilter(event.target.value)}
									className="h-8 rounded border border-border bg-background px-2 text-sm"
								>
									<option value="">全部标签</option>
									{assetTagOptions.map((tag) => (
										<option key={tag} value={tag}>
											{tag}
										</option>
									))}
								</select>
							</label>
							<label className="flex min-w-[130px] flex-col gap-1 text-xs">
								<span className="text-muted-foreground">每页数量</span>
								<select
									value={assetBrowserPageSize}
									onChange={async (event) => {
										const nextSize = Number.parseInt(event.target.value, 10) || 20;
										setAssetBrowserPageSize(nextSize);
										try {
											setBusy(true);
											setError(null);
											await loadAssetBrowser({
												page: 1,
												q: assetSearchApplied,
												tag: assetTagFilter,
												pageSize: nextSize,
											});
										} catch (error) {
											setError(error instanceof Error ? error.message : "加载素材列表失败");
										} finally {
											setBusy(false);
										}
									}}
									className="h-8 rounded border border-border bg-background px-2 text-sm"
								>
									{[10, 20, 40, 60].map((size) => (
										<option key={size} value={size}>
											{size}
										</option>
									))}
								</select>
							</label>
							<button
								type="button"
								className="h-8 rounded border border-border px-3 text-xs font-medium disabled:opacity-50"
								disabled={busy}
								onClick={async () => {
									try {
										setBusy(true);
										setError(null);
										setAssetSearchApplied(assetSearchInput.trim());
										await loadAssetBrowser({
											page: 1,
											q: assetSearchInput.trim(),
											tag: assetTagFilter,
											pageSize: assetBrowserPageSize,
										});
									} catch (error) {
										setError(error instanceof Error ? error.message : "加载素材列表失败");
									} finally {
										setBusy(false);
									}
								}}
							>
								查询
							</button>
						</div>
						{assetBrowserItems.length ? (
							<div className="mt-3 grid gap-2">
								{assetBrowserItems.map((asset) => (
									<div key={asset.id} className="rounded border border-border px-3 py-2">
										<div className="flex flex-wrap items-center justify-between gap-2">
											<div className="min-w-0">
												<p className="truncate text-sm font-medium">{asset.name || "未命名素材"}</p>
												<p className="truncate text-xs text-muted-foreground">{asset.mediaUrl}</p>
												<p className="text-xs text-muted-foreground">
													{asset.mimeType || "unknown"} · {formatBytes(asset.size)}
												</p>
												<div className="mt-1 flex flex-wrap gap-1">
													{(asset.tags || []).length ? (
														(asset.tags || []).map((tag) => (
															<span
																key={`${asset.id}-${tag}`}
																className="rounded bg-muted px-2 py-0.5 text-[10px]"
															>
																#{tag}
															</span>
														))
													) : (
														<span className="text-[10px] text-muted-foreground">无标签</span>
													)}
												</div>
											</div>
											<div className="flex items-center gap-2">
												<a
													href={asset.mediaUrl}
													target="_blank"
													rel="noreferrer"
													className="rounded border border-border px-2 py-1 text-xs"
												>
													查看
												</a>
												<button
													type="button"
													className="rounded border border-red-300 px-2 py-1 text-xs text-red-700 disabled:opacity-50"
													onClick={() => deleteAssetFromLibrary(asset.id)}
													disabled={busy}
												>
													删除
												</button>
											</div>
										</div>
										<div className="mt-2 flex flex-wrap items-center gap-2">
											<input
												type="text"
												value={assetTagDrafts[asset.id] ?? (asset.tags || []).join(", ")}
												onChange={(event) =>
													setAssetTagDrafts((current) => ({
														...current,
														[asset.id]: event.target.value,
													}))
												}
												placeholder="标签1, 标签2"
												className="h-8 min-w-[220px] flex-1 rounded border border-border bg-background px-2 text-xs"
											/>
											<button
												type="button"
												className="h-8 rounded border border-border px-2 text-xs font-medium disabled:opacity-50"
												disabled={busy}
												onClick={() => void updateAssetTags(asset.id)}
											>
												保存标签
											</button>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="mt-2 text-xs text-muted-foreground">暂无素材。请在区块图片字段上传后自动入库。</p>
						)}
						<div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
							<span>
								第 {assetBrowserPage} 页 · 每页 {assetBrowserPageSize} 条 · 共 {assetBrowserTotalCount} 条
							</span>
							<div className="flex items-center gap-2">
								<button
									type="button"
									className="rounded border border-border px-2 py-1 disabled:opacity-50"
									disabled={busy || assetBrowserPage <= 1}
									onClick={async () => {
										try {
											setBusy(true);
											setError(null);
											await loadAssetBrowser({ page: assetBrowserPage - 1 });
										} catch (error) {
											setError(error instanceof Error ? error.message : "加载素材列表失败");
										} finally {
											setBusy(false);
										}
									}}
								>
									上一页
								</button>
								<button
									type="button"
									className="rounded border border-border px-2 py-1 disabled:opacity-50"
									disabled={busy || !assetBrowserHasMore}
									onClick={async () => {
										try {
											setBusy(true);
											setError(null);
											await loadAssetBrowser({ page: assetBrowserPage + 1 });
										} catch (error) {
											setError(error instanceof Error ? error.message : "加载素材列表失败");
										} finally {
											setBusy(false);
										}
									}}
								>
									下一页
								</button>
							</div>
						</div>
					</details>
				</section>
			) : (
				<section className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
					<p>
						嵌入式 Dashboard 页面中默认隐藏可视化编辑器。请打开{" "}
						<a className="font-medium underline" href={fullEditorHref} target="_blank" rel="noreferrer">
							{fullEditorHref}
						</a>{" "}
						进行编辑，再在独立标签页预览店铺页面。
					</p>
				</section>
			)}

			{statusMessage ? (
				<p className="rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
					{statusMessage}
				</p>
			) : null}
			{error ? (
				<p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
			) : null}
		</div>
	);
}
