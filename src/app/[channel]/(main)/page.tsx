import { Suspense, type CSSProperties, type ReactNode } from "react";
import { type Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { CategoriesListDocument, ProductListByCollectionDocument } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";
import { getSaleorApiUrl } from "@/lib/saleor-api-url.server";
import { getTenantGraphQLHeaders, type TenantGraphQLHeaders } from "@/lib/tenant-graphql-headers.server";
import { collectionCacheTag, getTenantCacheKeyFromTenantGraphQLHeaders } from "@/lib/cache-tags";
import { getTenantHomepageLayoutState } from "@/config/homepage-layout.server";
import type { HomepageLayout, HomepageSection, HomepageStyleProps } from "@/config/homepage-layout";
import { buildTenantRouteMetadata } from "@/lib/seo/route-metadata.server";
import { tryRewriteObjectStorageUrlToMediaPath } from "@/lib/tenant-media-url";
import { AnnouncementBar } from "@/ui/components/announcement-bar";
import { ProductList } from "@/ui/components/product-list";

/**
 * Cached function to fetch collection products.
 * With Cache Components, this data becomes part of the static shell,
 * giving users instant page loads while keeping content fresh.
 */
async function getCollectionProducts(
	saleorApiUrl: string,
	channel: string,
	collectionSlug: string,
	limit: number,
	tenantGraphQLHeaders: TenantGraphQLHeaders,
	tenantCacheKey: string,
) {
	"use cache";
	cacheLife("minutes");
	cacheTag(collectionCacheTag(tenantCacheKey, channel, collectionSlug));

	let result;
	try {
		result = await executePublicGraphQL(ProductListByCollectionDocument, {
			variables: {
				slug: collectionSlug,
				channel,
				first: limit,
			},
			revalidate: 300,
			headers: tenantGraphQLHeaders,
			saleorApiUrl,
		});
	} catch (error) {
		console.error(
			`[Homepage] Collection query threw for ${channel}/${collectionSlug} (${saleorApiUrl})`,
			error,
		);
		return null;
	}

	if (!result.ok) {
		console.warn(
			`[Homepage] Failed to fetch collection ${collectionSlug} for ${channel}:`,
			result.error.message,
		);
		return null;
	}

	return result.data.collection?.products?.edges.map(({ node }) => node) ?? null;
}

type HomepageCategoryItem = { slug: string; name: string };

async function getHomepageCategories(
	saleorApiUrl: string,
	tenantGraphQLHeaders: TenantGraphQLHeaders,
): Promise<HomepageCategoryItem[]> {
	"use cache";
	cacheLife("minutes");
	const result = await executePublicGraphQL(CategoriesListDocument, {
		variables: { first: 100 },
		revalidate: 300,
		headers: tenantGraphQLHeaders,
		saleorApiUrl,
	});
	if (!result.ok) {
		console.warn("[Homepage] Failed to fetch categories for featured-categories-auto:", result.error.message);
		return [];
	}
	return (
		result.data.categories?.edges
			.map((edge) => edge.node)
			.filter((node) => !node.parent)
			.map((node) => ({ slug: node.slug, name: node.name })) ?? []
	);
}

function normalizeCtaHref(channel: string, ctaHref: string): string {
	if (/^https?:\/\//i.test(ctaHref)) return ctaHref;
	const normalizedPath = ctaHref.startsWith("/") ? ctaHref : `/${ctaHref}`;
	if (normalizedPath === `/${channel}` || normalizedPath.startsWith(`/${channel}/`)) {
		return normalizedPath;
	}
	return `/${channel}${normalizedPath}`;
}

function normalizeActionHref(channel: string, href: string): string {
	if (/^(https?:|mailto:|tel:|sms:)/i.test(href)) return href;
	return normalizeCtaHref(channel, href);
}

function normalizeAspectRatio(value: unknown): "16-9" | "4-3" | "1-1" {
	return value === "4-3" || value === "1-1" ? value : "16-9";
}

function getAspectRatioClass(value: unknown): string {
	const ratio = normalizeAspectRatio(value);
	if (ratio === "4-3") return "aspect-[4/3]";
	if (ratio === "1-1") return "aspect-square";
	return "aspect-video";
}

function resolveVideoEmbedUrl(value: string | undefined): string | null {
	const raw = value?.trim() || "";
	if (!raw || !/^https?:\/\//i.test(raw)) return null;
	try {
		const parsed = new URL(raw);
		const host = parsed.hostname.toLowerCase();
		if (host.includes("youtube.com")) {
			const id = parsed.searchParams.get("v");
			return id ? `https://www.youtube.com/embed/${id}` : raw;
		}
		if (host.includes("youtu.be")) {
			const id = parsed.pathname.replace(/^\/+/, "");
			return id ? `https://www.youtube.com/embed/${id}` : raw;
		}
		if (host.includes("vimeo.com")) {
			const id = parsed.pathname.replace(/^\/+/, "");
			return id ? `https://player.vimeo.com/video/${id}` : raw;
		}
		return raw;
	} catch {
		return null;
	}
}

function normalizeCollectionSlug(section: HomepageSection): string {
	if (section.type !== "featured-products") return "featured-products";
	return section.collectionSlug || "featured-products";
}

function normalizeCollectionLimit(section: HomepageSection): number {
	if (section.type !== "featured-products") return 12;
	const limit = section.limit || 12;
	return Math.max(1, Math.min(48, limit));
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

function humanizeSlug(slug: string): string {
	return slug
		.split("-")
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function isPromoBannerActive(section: {
	scheduleMode?: "always" | "window";
	scheduleStartIso?: string;
	scheduleEndIso?: string;
}): boolean {
	if (section.scheduleMode !== "window") return true;
	const now = Date.now();
	const start = section.scheduleStartIso ? Date.parse(section.scheduleStartIso) : NaN;
	const end = section.scheduleEndIso ? Date.parse(section.scheduleEndIso) : NaN;
	if (Number.isFinite(start) && now < start) return false;
	if (Number.isFinite(end) && now > end) return false;
	return true;
}

function getCountdownLabel(targetIso: string | undefined): {
	valid: boolean;
	expired: boolean;
	label: string;
} {
	if (!targetIso) return { valid: false, expired: false, label: "" };
	const target = Date.parse(targetIso);
	if (!Number.isFinite(target)) return { valid: false, expired: false, label: "" };
	const now = Date.now();
	if (target <= now) return { valid: true, expired: true, label: "" };
	const totalSeconds = Math.floor((target - now) / 1000);
	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor((totalSeconds % 86400) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	return { valid: true, expired: false, label: `${days}天 ${hours}小时 ${minutes}分钟` };
}

function resolveBackgroundImageUrl(value: string | undefined): string {
	const normalized = value?.trim() || "";
	if (!normalized) return "";
	if (normalized.startsWith("/")) return normalized;
	return tryRewriteObjectStorageUrlToMediaPath(normalized) || normalized;
}

function getLegacyString(section: HomepageSection, key: string): string | undefined {
	const value = (section as unknown as Record<string, unknown>)[key];
	return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getLegacyNumber(section: HomepageSection, key: string): number | undefined {
	const value = (section as unknown as Record<string, unknown>)[key];
	if (typeof value === "number" && Number.isFinite(value)) return value;
	return undefined;
}

function resolveSectionStyle(section: HomepageSection): HomepageStyleProps | undefined {
	const value = (section as unknown as Record<string, unknown>).style;
	return typeof value === "object" && value !== null ? (value as HomepageStyleProps) : undefined;
}

function getOuterContainerClass(section: HomepageSection): string {
	const style = resolveSectionStyle(section);
	const widthMode = getLegacyString(section, "widthMode");
	let widthClass = "max-w-7xl";
	if (style?.container.width === "full" || widthMode === "full") {
		widthClass = "max-w-none";
	} else {
		const maxWidth =
			style?.container.maxWidth || (widthMode === "narrow" ? "md" : widthMode === "wide" ? "xl" : "lg");
		widthClass =
			maxWidth === "sm"
				? "max-w-3xl"
				: maxWidth === "md"
					? "max-w-5xl"
					: maxWidth === "xl"
						? "max-w-[90rem]"
						: "max-w-7xl";
	}
	const topSpacing = style?.spacing.top || "md";
	const bottomSpacing = style?.spacing.bottom || "md";
	const topClass =
		topSpacing === "none" ? "pt-0" : topSpacing === "sm" ? "pt-4" : topSpacing === "lg" ? "pt-12" : "pt-8";
	const bottomClass =
		bottomSpacing === "none"
			? "pb-0"
			: bottomSpacing === "sm"
				? "pb-4"
				: bottomSpacing === "lg"
					? "pb-12"
					: "pb-8";
	return `mx-auto ${widthClass} px-8 ${topClass} ${bottomClass}`;
}

function getInnerShapeClass(section: HomepageSection): string {
	const style = resolveSectionStyle(section);
	const radius = style?.shape.radius || "md";
	const shadow = style?.shape.shadow || "sm";
	const radiusClass =
		radius === "none"
			? "rounded-none"
			: radius === "sm"
				? "rounded-lg"
				: radius === "lg"
					? "rounded-3xl"
					: "rounded-2xl";
	const shadowClass =
		shadow === "none" ? "" : shadow === "sm" ? "shadow-sm" : shadow === "lg" ? "shadow-lg" : "shadow-md";
	return `${radiusClass} ${shadowClass}`.trim();
}

function getBackgroundClass(section: HomepageSection): string {
	const style = resolveSectionStyle(section);
	const mode = style?.background.mode || "none";
	if (mode === "token") {
		const token = style?.background.token || "card";
		if (token === "background") return "bg-background";
		if (token === "muted") return "bg-muted";
		if (token === "secondary") return "bg-secondary";
		if (token === "accent") return "bg-accent";
		return "bg-card";
	}
	return "bg-card";
}

function getSectionBoxStyle(
	section: HomepageSection,
	defaults: { paddingX: number; paddingY: number; minHeight?: number },
): CSSProperties {
	const style = resolveSectionStyle(section);
	const backgroundColor = style?.background.color || getLegacyString(section, "backgroundColor");
	const backgroundImageUrl = resolveBackgroundImageUrl(
		style?.background.imageUrl || getLegacyString(section, "backgroundImageUrl"),
	);
	const textColor = style?.textColor || getLegacyString(section, "textColor");
	const minHeight = style?.minHeight || getLegacyNumber(section, "minHeight") || defaults.minHeight;
	const paddingX = style?.paddingX || getLegacyNumber(section, "paddingX") || defaults.paddingX;
	const paddingY = style?.paddingY || getLegacyNumber(section, "paddingY") || defaults.paddingY;
	return {
		...(backgroundColor && (style?.background.mode === "custom" || !style?.background.mode)
			? { backgroundColor }
			: {}),
		...(backgroundImageUrl && (style?.background.mode === "image" || !style?.background.mode)
			? {
					backgroundImage: `url(${backgroundImageUrl})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}
			: {}),
		...(textColor ? { color: textColor } : {}),
		...(typeof minHeight === "number" ? { minHeight: `${minHeight}px` } : {}),
		paddingLeft: `${paddingX}px`,
		paddingRight: `${paddingX}px`,
		paddingTop: `${paddingY}px`,
		paddingBottom: `${paddingY}px`,
	};
}

function getContentAlignClass(section: HomepageSection): string {
	const style = resolveSectionStyle(section);
	const align =
		style?.alignment ||
		getLegacyString(section, "contentAlign") ||
		getLegacyString(section, "align") ||
		"left";
	return align === "center" ? "items-center text-center" : "items-start text-left";
}

export async function generateMetadata(props: { params: Promise<{ channel: string }> }): Promise<Metadata> {
	const { channel } = await props.params;
	return buildTenantRouteMetadata({
		title: "Home",
		description: "Discover our latest products and featured collections.",
		canonicalPath: `/${channel}`,
	});
}

export default async function Page(props: { params: Promise<{ channel: string }> }) {
	const { channel } = await props.params;
	const tenantGraphQLHeaders = await getTenantGraphQLHeaders();
	return (
		<Suspense fallback={<HomepageSkeleton />}>
			<HomeContent channel={channel} tenantGraphQLHeaders={tenantGraphQLHeaders} />
		</Suspense>
	);
}

async function HomeContent(props: { channel: string; tenantGraphQLHeaders: TenantGraphQLHeaders }) {
	const { channel, tenantGraphQLHeaders } = props;

	const saleorApiUrl = await getSaleorApiUrl().catch((error) => {
		console.error(`[Homepage] Failed to resolve saleorApiUrl for ${channel}:`, error);
		return null;
	});
	if (!saleorApiUrl) return null;

	const tenantCacheKey = getTenantCacheKeyFromTenantGraphQLHeaders(tenantGraphQLHeaders);
	const homepageLayoutState = await getTenantHomepageLayoutState();
	const homepageLayout = homepageLayoutState.layout;
	const sections = await renderHomepageSections({
		layout: homepageLayout,
		channel,
		tenantGraphQLHeaders,
		tenantCacheKey,
		saleorApiUrl,
	});
	if (!sections.length) return null;

	return (
		<div className="space-y-12 pb-16">
			{homepageLayoutState.mode === "draft" ? (
				<section className="mx-auto max-w-7xl px-8 pt-8">
					<div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
						Homepage draft preview active
						{homepageLayoutState.version ? ` (base v${homepageLayoutState.version})` : ""}. Remove
						<code className="mx-1 rounded bg-amber-100 px-1 py-0.5">?preview=1</code>
						to view published layout.
					</div>
				</section>
			) : null}
			{sections}
		</div>
	);
}

function HomepageSkeleton() {
	return (
		<section className="mx-auto max-w-7xl animate-skeleton-delayed p-8 pb-16 opacity-0">
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="animate-pulse">
						<div className="mb-4 aspect-[3/4] rounded-xl bg-muted" />
						<div className="space-y-1.5">
							<div className="h-4 w-3/4 rounded bg-muted" />
							<div className="h-4 w-1/2 rounded bg-muted" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

async function renderHomepageSections(props: {
	layout: HomepageLayout;
	channel: string;
	tenantGraphQLHeaders: TenantGraphQLHeaders;
	tenantCacheKey: string;
	saleorApiUrl: string;
}): Promise<ReactNode[]> {
	const { layout, channel, tenantGraphQLHeaders, tenantCacheKey, saleorApiUrl } = props;
	const renderedSections: ReactNode[] = [];

	for (const [index, section] of layout.sections.entries()) {
		if (section.type === "hero") {
			const href = section.ctaHref ? normalizeCtaHref(channel, section.ctaHref) : undefined;
			const alignClass = getContentAlignClass(section);
			const titleClass = getTitleClass(section.titleSize, "hero");
			const buttonClass = getButtonClass(section.buttonVariant, section.buttonSize);
			const heroStyle = getSectionBoxStyle(section, {
				paddingX: 48,
				paddingY: 48,
				minHeight: 280,
			});
			const textColor = section.style?.textColor || section.textColor;
			renderedSections.push(
				<section key={`hero-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={heroStyle}
					>
						<div className={`flex flex-col ${alignClass}`}>
							{section.eyebrow ? (
								<p
									className="mb-2 text-sm text-muted-foreground"
									style={textColor ? { color: textColor, opacity: 0.85 } : undefined}
								>
									{section.eyebrow}
								</p>
							) : null}
							<h1 className={`${titleClass} font-semibold tracking-tight`}>{section.title}</h1>
							{section.subtitle ? (
								<p
									className="mt-4 max-w-3xl text-muted-foreground"
									style={textColor ? { color: textColor, opacity: 0.9 } : undefined}
								>
									{section.subtitle}
								</p>
							) : null}
							{section.ctaLabel && href ? (
								<a href={href} className={`mt-6 ${buttonClass}`}>
									{section.ctaLabel}
								</a>
							) : null}
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "rich-text") {
			const paragraphs = (section.body || "")
				.split(/\n{2,}/g)
				.map((part) => part.trim())
				.filter(Boolean);
			const textColor = section.style?.textColor;
			renderedSections.push(
				<section key={`rich-text-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 32, paddingY: 32 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{paragraphs.length ? (
							<div
								className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground"
								style={textColor ? { color: textColor } : undefined}
							>
								{paragraphs.map((paragraph) => (
									<p key={`${index}-${paragraph}`}>{paragraph}</p>
								))}
							</div>
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "heading") {
			const href = section.ctaHref ? normalizeCtaHref(channel, section.ctaHref) : undefined;
			const alignClass = getContentAlignClass(section);
			const titleClass = getTitleClass(section.titleSize, "container");
			const buttonClass = getButtonClass("solid", "md");
			const textColor = section.style?.textColor;
			renderedSections.push(
				<section key={`heading-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 32, paddingY: 32 })}
					>
						<div className={`flex flex-col ${alignClass}`}>
							{section.eyebrow ? (
								<p
									className="mb-2 text-sm text-muted-foreground"
									style={textColor ? { color: textColor, opacity: 0.85 } : undefined}
								>
									{section.eyebrow}
								</p>
							) : null}
							<h2 className={`${titleClass} font-semibold tracking-tight`}>{section.title}</h2>
							{section.subtitle ? (
								<p
									className="mt-3 max-w-3xl text-muted-foreground"
									style={textColor ? { color: textColor, opacity: 0.9 } : undefined}
								>
									{section.subtitle}
								</p>
							) : null}
							{section.ctaLabel && href ? (
								<a href={href} className={`mt-6 ${buttonClass}`}>
									{section.ctaLabel}
								</a>
							) : null}
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "image-banner") {
			const href = section.ctaHref ? normalizeCtaHref(channel, section.ctaHref) : undefined;
			const alignClass = getContentAlignClass(section);
			const buttonClass = getButtonClass("solid", "md");
			const textColor = section.style?.textColor;
			const imageUrl = resolveBackgroundImageUrl(section.imageUrl);
			const imageFitClass = section.imageFit === "contain" ? "object-contain bg-muted/30" : "object-cover";
			const imagePosition = section.imagePosition || "right";
			const isTopImage = imagePosition === "top";
			const isImageFirst = imagePosition === "left" || imagePosition === "top";
			renderedSections.push(
				<section key={`image-banner-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, {
							paddingX: 24,
							paddingY: 24,
							minHeight: 260,
						})}
					>
						<div className={isTopImage ? "flex flex-col gap-6" : "grid gap-6 md:grid-cols-2 md:items-center"}>
							{isImageFirst ? (
								<div className="overflow-hidden rounded-xl border border-border bg-background">
									{imageUrl ? (
										<img
											src={imageUrl}
											alt={section.imageAlt || section.heading || "banner image"}
											className={`h-64 w-full ${imageFitClass}`}
											loading="lazy"
										/>
									) : (
										<div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
											请先上传横幅图片
										</div>
									)}
								</div>
							) : null}
							<div className={`flex flex-col ${alignClass}`}>
								{section.eyebrow ? (
									<p
										className="mb-2 text-sm text-muted-foreground"
										style={textColor ? { color: textColor, opacity: 0.85 } : undefined}
									>
										{section.eyebrow}
									</p>
								) : null}
								{section.heading ? (
									<h2 className="text-3xl font-semibold tracking-tight">{section.heading}</h2>
								) : null}
								{section.body ? (
									<p
										className="mt-3 text-muted-foreground"
										style={textColor ? { color: textColor, opacity: 0.9 } : undefined}
									>
										{section.body}
									</p>
								) : null}
								{section.ctaLabel && href ? (
									<a href={href} className={`mt-6 ${buttonClass}`}>
										{section.ctaLabel}
									</a>
								) : null}
							</div>
							{!isImageFirst ? (
								<div className="overflow-hidden rounded-xl border border-border bg-background">
									{imageUrl ? (
										<img
											src={imageUrl}
											alt={section.imageAlt || section.heading || "banner image"}
											className={`h-64 w-full ${imageFitClass}`}
											loading="lazy"
										/>
									) : (
										<div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
											请先上传横幅图片
										</div>
									)}
								</div>
							) : null}
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "icon-list") {
			const columns = normalizeColumnCount(section.columns);
			const gridClass =
				columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
			const textColor = section.style?.textColor;
			const items = [
				{ icon: section.item1Icon, title: section.item1Title, description: section.item1Description },
				{ icon: section.item2Icon, title: section.item2Title, description: section.item2Description },
				{ icon: section.item3Icon, title: section.item3Title, description: section.item3Description },
				{ icon: section.item4Icon, title: section.item4Title, description: section.item4Description },
			].filter((item) => item.icon || item.title || item.description);
			renderedSections.push(
				<section key={`icon-list-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p
								className="mt-2 text-sm text-muted-foreground"
								style={textColor ? { color: textColor, opacity: 0.9 } : undefined}
							>
								{section.subtitle}
							</p>
						) : null}
						{items.length ? (
							<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
								{items.map((item, itemIndex) => (
									<div
										key={`icon-item-${index}-${itemIndex}`}
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
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "faq-accordion") {
			const textColor = section.style?.textColor;
			const pairs = [
				{ question: section.q1Question, answer: section.q1Answer },
				{ question: section.q2Question, answer: section.q2Answer },
				{ question: section.q3Question, answer: section.q3Answer },
				{ question: section.q4Question, answer: section.q4Answer },
				{ question: section.q5Question, answer: section.q5Answer },
			].filter((item) => item.question || item.answer);
			renderedSections.push(
				<section key={`faq-accordion-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p
								className="mt-2 text-sm text-muted-foreground"
								style={textColor ? { color: textColor, opacity: 0.9 } : undefined}
							>
								{section.subtitle}
							</p>
						) : null}
						{pairs.length ? (
							<div className="mt-5 space-y-3">
								{pairs.map((pair, pairIndex) => (
									<details
										key={`faq-${index}-${pairIndex}`}
										className="rounded-lg border border-border bg-background px-4 py-3"
									>
										<summary className="cursor-pointer font-medium">
											{pair.question || `问题 ${pairIndex + 1}`}
										</summary>
										{pair.answer ? <p className="mt-2 text-sm text-muted-foreground">{pair.answer}</p> : null}
									</details>
								))}
							</div>
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "featured-collections") {
			const columns = normalizeColumnCount(section.columns);
			const gridClass =
				columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
			const textColor = section.style?.textColor;
			const slugs = [
				section.collectionSlug1,
				section.collectionSlug2,
				section.collectionSlug3,
				section.collectionSlug4,
			]
				.map((slug) => (typeof slug === "string" ? slug.trim() : ""))
				.filter(Boolean);
			renderedSections.push(
				<section key={`featured-collections-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p
								className="mt-2 text-sm text-muted-foreground"
								style={textColor ? { color: textColor, opacity: 0.9 } : undefined}
							>
								{section.subtitle}
							</p>
						) : null}
						{slugs.length ? (
							<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
								{slugs.map((slug) => {
									const href = normalizeCtaHref(channel, `/collections/${slug}`);
									return (
										<a
											key={`${index}-${slug}`}
											href={href}
											className="hover:bg-muted/20 rounded-xl border border-border bg-background p-4"
										>
											<p className="text-xs uppercase tracking-wide text-muted-foreground">Collection</p>
											<p className="mt-1 font-medium">{humanizeSlug(slug)}</p>
											<p className="mt-2 text-xs text-muted-foreground">/{slug}</p>
										</a>
									);
								})}
							</div>
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "promo-banner") {
			if (!isPromoBannerActive(section)) {
				continue;
			}
			const ctaHref = section.ctaHref ? normalizeCtaHref(channel, section.ctaHref) : undefined;
			const secondaryCtaHref = section.secondaryCtaHref
				? normalizeCtaHref(channel, section.secondaryCtaHref)
				: undefined;
			const alignClass = getContentAlignClass(section);
			renderedSections.push(
				<section key={`promo-banner-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24, minHeight: 200 })}
					>
						<div className={`flex flex-col ${alignClass}`}>
							{section.eyebrow ? (
								<p className="mb-2 text-sm text-muted-foreground">{section.eyebrow}</p>
							) : null}
							{section.title ? (
								<h2 className="text-3xl font-semibold tracking-tight">{section.title}</h2>
							) : null}
							{section.subtitle ? <p className="mt-2 text-muted-foreground">{section.subtitle}</p> : null}
							<div className="mt-5 flex flex-wrap items-center gap-3">
								{section.badgeText ? (
									<span className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
										{section.badgeText}
									</span>
								) : null}
								{section.ctaLabel && ctaHref ? (
									<a href={ctaHref} className={getButtonClass("solid", "md")}>
										{section.ctaLabel}
									</a>
								) : null}
								{section.secondaryCtaLabel && secondaryCtaHref ? (
									<a href={secondaryCtaHref} className={getButtonClass("outline", "md")}>
										{section.secondaryCtaLabel}
									</a>
								) : null}
							</div>
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "testimonials") {
			const columns = normalizeColumnCount(section.columns);
			const gridClass =
				columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
			const items = [
				{
					quote: section.item1Quote,
					author: section.item1Author,
					role: section.item1Role,
					avatarUrl: resolveBackgroundImageUrl(section.item1AvatarUrl),
				},
				{
					quote: section.item2Quote,
					author: section.item2Author,
					role: section.item2Role,
					avatarUrl: resolveBackgroundImageUrl(section.item2AvatarUrl),
				},
				{
					quote: section.item3Quote,
					author: section.item3Author,
					role: section.item3Role,
					avatarUrl: resolveBackgroundImageUrl(section.item3AvatarUrl),
				},
			].filter((item) => item.quote || item.author || item.role);
			renderedSections.push(
				<section key={`testimonials-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{items.length ? (
							<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
								{items.map((item, itemIndex) => (
									<div
										key={`testimonial-${index}-${itemIndex}`}
										className="rounded-xl border border-border bg-background p-4"
									>
										<p className="text-sm leading-6 text-muted-foreground">“{item.quote || "客户评价"}”</p>
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
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "store-policies") {
			const columns = normalizeColumnCount(section.columns);
			const gridClass =
				columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
			const entries = [
				{ label: section.policy1Label, href: section.policy1Href, description: section.policy1Description },
				{ label: section.policy2Label, href: section.policy2Href, description: section.policy2Description },
				{ label: section.policy3Label, href: section.policy3Href, description: section.policy3Description },
				{ label: section.policy4Label, href: section.policy4Href, description: section.policy4Description },
			].filter((item) => item.label || item.href || item.description);
			renderedSections.push(
				<section key={`store-policies-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{entries.length ? (
							<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
								{entries.map((entry, entryIndex) => {
									const href = entry.href ? normalizeCtaHref(channel, entry.href) : undefined;
									const label = entry.label || `政策 ${entryIndex + 1}`;
									return href ? (
										<a
											key={`${label}-${entryIndex}`}
											href={href}
											className="hover:bg-muted/20 rounded-xl border border-border bg-background p-4"
										>
											<p className="font-medium">{label}</p>
											{entry.description ? (
												<p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
											) : null}
										</a>
									) : (
										<div
											key={`${label}-${entryIndex}`}
											className="rounded-xl border border-border bg-background p-4"
										>
											<p className="font-medium">{label}</p>
											{entry.description ? (
												<p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
											) : null}
										</div>
									);
								})}
							</div>
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "category-grid") {
			const columns = normalizeColumnCount(section.columns);
			const gridClass =
				columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
			const textColor = section.style?.textColor;
			const entries = [
				{ slug: section.categorySlug1, label: section.categoryLabel1 },
				{ slug: section.categorySlug2, label: section.categoryLabel2 },
				{ slug: section.categorySlug3, label: section.categoryLabel3 },
				{ slug: section.categorySlug4, label: section.categoryLabel4 },
				{ slug: section.categorySlug5, label: section.categoryLabel5 },
				{ slug: section.categorySlug6, label: section.categoryLabel6 },
			]
				.map((item) => ({
					slug: typeof item.slug === "string" ? item.slug.trim() : "",
					label: typeof item.label === "string" ? item.label.trim() : "",
				}))
				.filter((item) => item.slug || item.label);
			renderedSections.push(
				<section key={`category-grid-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p
								className="mt-2 text-sm text-muted-foreground"
								style={textColor ? { color: textColor, opacity: 0.9 } : undefined}
							>
								{section.subtitle}
							</p>
						) : null}
						{entries.length ? (
							<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
								{entries.map((entry, entryIndex) => {
									const href = entry.slug
										? normalizeCtaHref(channel, `/categories/${entry.slug}`)
										: undefined;
									const label =
										entry.label || (entry.slug ? humanizeSlug(entry.slug) : `分类 ${entryIndex + 1}`);
									return href ? (
										<a
											key={`${entry.slug}-${entryIndex}`}
											href={href}
											className="hover:bg-muted/20 rounded-xl border border-border bg-background p-4"
										>
											<p className="font-medium">{label}</p>
											{entry.slug ? (
												<p className="mt-2 text-xs text-muted-foreground">/{entry.slug}</p>
											) : null}
										</a>
									) : (
										<div
											key={`${label}-${entryIndex}`}
											className="rounded-xl border border-border bg-background p-4"
										>
											<p className="font-medium">{label}</p>
										</div>
									);
								})}
							</div>
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "product-spotlight") {
			const textColor = section.style?.textColor;
			const imageUrl = resolveBackgroundImageUrl(section.imageUrl);
			const ctaHref = section.ctaHref
				? normalizeCtaHref(channel, section.ctaHref)
				: section.productSlug
					? normalizeCtaHref(channel, `/products/${section.productSlug}`)
					: undefined;
			renderedSections.push(
				<section key={`product-spotlight-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24, minHeight: 220 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p
								className="mt-2 text-sm text-muted-foreground"
								style={textColor ? { color: textColor, opacity: 0.9 } : undefined}
							>
								{section.subtitle}
							</p>
						) : null}
						<div className="mt-5 grid gap-4 md:grid-cols-2 md:items-center">
							<div className="overflow-hidden rounded-xl border border-border bg-background">
								{imageUrl ? (
									<img
										src={imageUrl}
										alt={section.imageAlt || section.productName || "spotlight"}
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
								{section.badgeText ? (
									<span className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
										{section.badgeText}
									</span>
								) : null}
								<p className="mt-3 text-xl font-semibold">
									{section.productName ||
										(section.productSlug ? humanizeSlug(section.productSlug) : "主推商品")}
								</p>
								{section.priceText ? (
									<p className="mt-2 text-sm text-muted-foreground">{section.priceText}</p>
								) : null}
								{section.ctaLabel && ctaHref ? (
									<a href={ctaHref} className={`mt-5 inline-flex ${getButtonClass("solid", "md")}`}>
										{section.ctaLabel}
									</a>
								) : null}
							</div>
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "countdown") {
			const countdown = getCountdownLabel(section.targetIso);
			if (countdown.expired && section.mode === "hide-after-expired") {
				continue;
			}
			const ctaHref = section.ctaHref ? normalizeCtaHref(channel, section.ctaHref) : undefined;
			renderedSections.push(
				<section key={`countdown-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24, minHeight: 180 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-5 rounded-xl border border-border bg-background px-4 py-5 text-center">
							{countdown.valid ? (
								countdown.expired ? (
									<p className="text-xl font-medium">{section.expiredMessage || "活动已结束"}</p>
								) : (
									<p className="text-2xl font-semibold tabular-nums">{countdown.label}</p>
								)
							) : (
								<p className="text-sm text-muted-foreground">请填写有效目标时间（ISO 格式）</p>
							)}
							{section.timezoneLabel ? (
								<p className="mt-2 text-xs text-muted-foreground">时区：{section.timezoneLabel}</p>
							) : null}
						</div>
						{section.ctaLabel && ctaHref ? (
							<a href={ctaHref} className={`mt-5 inline-flex ${getButtonClass("solid", "md")}`}>
								{section.ctaLabel}
							</a>
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "featured-categories-auto") {
			const columns = normalizeColumnCount(section.columns);
			const gridClass =
				columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
			const mode = section.mode === "manual" ? "manual" : "auto";
			const autoLimit = Math.max(2, Math.min(12, section.autoLimit || 6));
			const manualEntries = [
				{ slug: section.manualCategorySlug1, label: section.manualCategoryLabel1 },
				{ slug: section.manualCategorySlug2, label: section.manualCategoryLabel2 },
				{ slug: section.manualCategorySlug3, label: section.manualCategoryLabel3 },
				{ slug: section.manualCategorySlug4, label: section.manualCategoryLabel4 },
				{ slug: section.manualCategorySlug5, label: section.manualCategoryLabel5 },
				{ slug: section.manualCategorySlug6, label: section.manualCategoryLabel6 },
			]
				.map((item) => ({
					slug: typeof item.slug === "string" ? item.slug.trim() : "",
					label: typeof item.label === "string" ? item.label.trim() : "",
				}))
				.filter((item) => item.slug || item.label);
			const autoEntries =
				mode === "auto"
					? (await getHomepageCategories(saleorApiUrl, tenantGraphQLHeaders))
							.slice(0, autoLimit)
							.map((item) => ({ slug: item.slug, label: item.name }))
					: [];
			const entries = mode === "manual" ? manualEntries : autoEntries;
			renderedSections.push(
				<section key={`featured-categories-auto-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{entries.length ? (
							<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
								{entries.map((entry, entryIndex) => {
									const slug = entry.slug || "";
									const label = entry.label || (slug ? humanizeSlug(slug) : `分类 ${entryIndex + 1}`);
									const href = slug ? normalizeCtaHref(channel, `/categories/${slug}`) : undefined;
									return href ? (
										<a
											key={`${slug}-${entryIndex}`}
											href={href}
											className="hover:bg-muted/20 rounded-xl border border-border bg-background p-4"
										>
											<p className="font-medium">{label}</p>
											{slug ? <p className="mt-2 text-xs text-muted-foreground">/{slug}</p> : null}
										</a>
									) : (
										<div
											key={`${label}-${entryIndex}`}
											className="rounded-xl border border-border bg-background p-4"
										>
											<p className="font-medium">{label}</p>
										</div>
									);
								})}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">
								暂无分类可展示，请切换手动模式或检查分类数据。
							</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "logo-cloud") {
			const columns = normalizeColumnCount(section.columns);
			const gridClass =
				columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
			const logos = [
				{ url: resolveBackgroundImageUrl(section.logo1Url), alt: section.logo1Alt || "logo 1" },
				{ url: resolveBackgroundImageUrl(section.logo2Url), alt: section.logo2Alt || "logo 2" },
				{ url: resolveBackgroundImageUrl(section.logo3Url), alt: section.logo3Alt || "logo 3" },
				{ url: resolveBackgroundImageUrl(section.logo4Url), alt: section.logo4Alt || "logo 4" },
				{ url: resolveBackgroundImageUrl(section.logo5Url), alt: section.logo5Alt || "logo 5" },
				{ url: resolveBackgroundImageUrl(section.logo6Url), alt: section.logo6Alt || "logo 6" },
			].filter((item) => item.url);
			renderedSections.push(
				<section key={`logo-cloud-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{logos.length ? (
							<div className={`mt-5 grid grid-cols-2 gap-4 ${gridClass}`}>
								{logos.map((logo, logoIndex) => (
									<div
										key={`${logo.alt}-${logoIndex}`}
										className="flex items-center justify-center rounded-xl border border-border bg-background p-4"
									>
										<img
											src={logo.url}
											alt={logo.alt}
											className="h-12 w-auto object-contain"
											loading="lazy"
										/>
									</div>
								))}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少上传 1 张 Logo 图片。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "timeline-steps") {
			const steps = [
				{ title: section.step1Title, description: section.step1Description },
				{ title: section.step2Title, description: section.step2Description },
				{ title: section.step3Title, description: section.step3Description },
				{ title: section.step4Title, description: section.step4Description },
			].filter((step) => step.title || step.description);
			renderedSections.push(
				<section key={`timeline-steps-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{steps.length ? (
							<ol className="mt-5 space-y-3">
								{steps.map((step, stepIndex) => (
									<li
										key={`${step.title}-${stepIndex}`}
										className="rounded-xl border border-border bg-background px-4 py-3"
									>
										<p className="text-xs text-muted-foreground">步骤 {stepIndex + 1}</p>
										<p className="mt-1 font-medium">{step.title || `步骤 ${stepIndex + 1}`}</p>
										{step.description ? (
											<p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
										) : null}
									</li>
								))}
							</ol>
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "collection-hero") {
			const collectionSlug = section.collectionSlug?.trim();
			const collectionLabel =
				section.collectionLabel?.trim() || (collectionSlug ? humanizeSlug(collectionSlug) : "");
			const defaultCollectionHref = collectionSlug
				? normalizeCtaHref(channel, `/collections/${collectionSlug}`)
				: undefined;
			const ctaHref = section.ctaHref ? normalizeActionHref(channel, section.ctaHref) : defaultCollectionHref;
			const backgroundImageUrl = resolveBackgroundImageUrl(section.backgroundImageUrl);
			const sectionStyle = getSectionBoxStyle(section, { paddingX: 24, paddingY: 24, minHeight: 220 });
			const style = resolveSectionStyle(section);
			const mergedStyle: CSSProperties =
				backgroundImageUrl && !style?.background.imageUrl
					? {
							...sectionStyle,
							backgroundImage: `url(${backgroundImageUrl})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
						}
					: sectionStyle;

			renderedSections.push(
				<section key={`collection-hero-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={mergedStyle}
					>
						{section.eyebrow ? <p className="text-sm text-muted-foreground">{section.eyebrow}</p> : null}
						{section.heading ? (
							<h2 className="mt-1 text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{collectionLabel ? (
							<p className="mt-3 text-xs text-muted-foreground">合集：{collectionLabel}</p>
						) : null}
						{section.ctaLabel && ctaHref ? (
							<a href={ctaHref} className={`mt-5 inline-flex ${getButtonClass("solid", "md")}`}>
								{section.ctaLabel}
							</a>
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "contact-quick-actions") {
			const columns = normalizeColumnCount(section.columns);
			const gridClass =
				columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
			const actions = [
				{
					label: section.action1Label,
					value: section.action1Value,
					href: section.action1Href,
					description: section.action1Description,
				},
				{
					label: section.action2Label,
					value: section.action2Value,
					href: section.action2Href,
					description: section.action2Description,
				},
				{
					label: section.action3Label,
					value: section.action3Value,
					href: section.action3Href,
					description: section.action3Description,
				},
				{
					label: section.action4Label,
					value: section.action4Value,
					href: section.action4Href,
					description: section.action4Description,
				},
			]
				.map((item) => ({
					label: item.label?.trim() || "",
					value: item.value?.trim() || "",
					href: item.href?.trim() || "",
					description: item.description?.trim() || "",
				}))
				.filter((item) => item.label || item.value || item.href || item.description);

			renderedSections.push(
				<section key={`contact-quick-actions-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{actions.length ? (
							<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
								{actions.map((action, actionIndex) => {
									const href = action.href ? normalizeActionHref(channel, action.href) : undefined;
									const key = `${action.label || "action"}-${actionIndex}`;
									if (!href) {
										return (
											<div key={key} className="rounded-xl border border-border bg-background p-4">
												<p className="font-medium">{action.label || `入口 ${actionIndex + 1}`}</p>
												{action.value ? (
													<p className="mt-1 text-sm text-muted-foreground">{action.value}</p>
												) : null}
												{action.description ? (
													<p className="mt-1 text-xs text-muted-foreground">{action.description}</p>
												) : null}
											</div>
										);
									}

									return (
										<a
											key={key}
											href={href}
											className="hover:bg-muted/20 rounded-xl border border-border bg-background p-4"
										>
											<p className="font-medium">{action.label || `入口 ${actionIndex + 1}`}</p>
											{action.value ? (
												<p className="mt-1 text-sm text-muted-foreground">{action.value}</p>
											) : null}
											{action.description ? (
												<p className="mt-1 text-xs text-muted-foreground">{action.description}</p>
											) : null}
										</a>
									);
								})}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个联系入口。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "stats-counter") {
			const columns = normalizeColumnCount(section.columns);
			const gridClass =
				columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
			const stats = [
				{ label: section.item1Label, value: section.item1Value, suffix: section.item1Suffix },
				{ label: section.item2Label, value: section.item2Value, suffix: section.item2Suffix },
				{ label: section.item3Label, value: section.item3Value, suffix: section.item3Suffix },
				{ label: section.item4Label, value: section.item4Value, suffix: section.item4Suffix },
			]
				.map((item) => ({
					label: item.label?.trim() || "",
					value: item.value?.trim() || "",
					suffix: item.suffix?.trim() || "",
				}))
				.filter((item) => item.label || item.value || item.suffix);

			renderedSections.push(
				<section key={`stats-counter-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{stats.length ? (
							<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
								{stats.map((item, itemIndex) => (
									<div
										key={`${item.label || "metric"}-${itemIndex}`}
										className="rounded-xl border border-border bg-background p-4 text-center"
									>
										<p className="text-2xl font-semibold tabular-nums">
											{item.value || "0"}
											{item.suffix || ""}
										</p>
										<p className="mt-1 text-xs text-muted-foreground">
											{item.label || `指标 ${itemIndex + 1}`}
										</p>
									</div>
								))}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个指标。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "card-grid") {
			const columns = normalizeColumnCount(section.columns);
			const gridClass =
				columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
			const cards = [
				{
					title: section.card1Title,
					body: section.card1Body,
					ctaLabel: section.card1CtaLabel,
					ctaHref: section.card1CtaHref,
				},
				{
					title: section.card2Title,
					body: section.card2Body,
					ctaLabel: section.card2CtaLabel,
					ctaHref: section.card2CtaHref,
				},
				{
					title: section.card3Title,
					body: section.card3Body,
					ctaLabel: section.card3CtaLabel,
					ctaHref: section.card3CtaHref,
				},
				{
					title: section.card4Title,
					body: section.card4Body,
					ctaLabel: section.card4CtaLabel,
					ctaHref: section.card4CtaHref,
				},
				{
					title: section.card5Title,
					body: section.card5Body,
					ctaLabel: section.card5CtaLabel,
					ctaHref: section.card5CtaHref,
				},
				{
					title: section.card6Title,
					body: section.card6Body,
					ctaLabel: section.card6CtaLabel,
					ctaHref: section.card6CtaHref,
				},
			]
				.map((card) => ({
					title: card.title?.trim() || "",
					body: card.body?.trim() || "",
					ctaLabel: card.ctaLabel?.trim() || "",
					ctaHref: card.ctaHref?.trim() || "",
				}))
				.filter((card) => card.title || card.body || card.ctaLabel || card.ctaHref);

			renderedSections.push(
				<section key={`card-grid-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{cards.length ? (
							<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
								{cards.map((card, cardIndex) => {
									const href = card.ctaHref ? normalizeActionHref(channel, card.ctaHref) : undefined;
									return (
										<div
											key={`${card.title || "card"}-${cardIndex}`}
											className="rounded-xl border border-border bg-background p-4"
										>
											<p className="font-medium">{card.title || `卡片 ${cardIndex + 1}`}</p>
											{card.body ? <p className="mt-2 text-sm text-muted-foreground">{card.body}</p> : null}
											{card.ctaLabel && href ? (
												<a
													href={href}
													className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
												>
													{card.ctaLabel}
												</a>
											) : null}
										</div>
									);
								})}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 张卡片。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "newsletter-signup") {
			const actionHref = section.actionHref ? normalizeActionHref(channel, section.actionHref) : undefined;
			renderedSections.push(
				<section key={`newsletter-signup-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24, minHeight: 180 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-5 flex flex-col gap-3 md:flex-row">
							<input
								type="email"
								placeholder={section.inputPlaceholder || "请输入邮箱地址"}
								className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground"
							/>
							{section.buttonLabel ? (
								actionHref ? (
									<a href={actionHref} className={`${getButtonClass("solid", "md")} whitespace-nowrap`}>
										{section.buttonLabel}
									</a>
								) : (
									<button
										type="button"
										className={`${getButtonClass("solid", "md")} whitespace-nowrap`}
										disabled
									>
										{section.buttonLabel}
									</button>
								)
							) : null}
						</div>
						{section.privacyNote ? (
							<p className="mt-3 text-xs text-muted-foreground">{section.privacyNote}</p>
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "video-embed") {
			const embedUrl = resolveVideoEmbedUrl(section.videoUrl);
			const posterImageUrl = resolveBackgroundImageUrl(section.posterImageUrl);
			const ratioClass = getAspectRatioClass(section.aspectRatio);
			renderedSections.push(
				<section key={`video-embed-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div
							className={`mt-5 overflow-hidden rounded-xl border border-border bg-background ${ratioClass}`}
						>
							{embedUrl ? (
								embedUrl.includes("youtube.com/embed/") || embedUrl.includes("player.vimeo.com/video/") ? (
									<iframe
										src={embedUrl}
										title={section.heading || "video"}
										className="h-full w-full"
										loading="lazy"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
										referrerPolicy="strict-origin-when-cross-origin"
										allowFullScreen
									/>
								) : (
									<video
										className="h-full w-full object-cover"
										controls
										poster={posterImageUrl || undefined}
										src={embedUrl}
									/>
								)
							) : posterImageUrl ? (
								<img
									src={posterImageUrl}
									alt={section.heading || "video poster"}
									className="h-full w-full object-cover"
									loading="lazy"
								/>
							) : (
								<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
									请填写视频链接或上传封面图
								</div>
							)}
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "announcement-bar") {
			if (!isPromoBannerActive(section)) {
				continue;
			}
			const message = section.message?.trim() || "";
			if (!message) continue;
			const ctaHref = section.ctaHref?.trim() ? normalizeActionHref(channel, section.ctaHref) : undefined;
			renderedSections.push(
				<section key={`announcement-bar-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(
							section,
						)} px-4 py-3 text-sm`}
						style={getSectionBoxStyle(section, { paddingX: 16, paddingY: 12, minHeight: 44 })}
					>
						<AnnouncementBar
							message={message}
							ctaLabel={section.ctaLabel?.trim() || undefined}
							ctaHref={ctaHref}
							dismissible={section.dismissMode !== "fixed"}
						/>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "trust-badges") {
			const columns = normalizeColumnCount(section.columns);
			const gridClass =
				columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
			const badges = [
				{ icon: section.badge1Icon, title: section.badge1Title, description: section.badge1Description },
				{ icon: section.badge2Icon, title: section.badge2Title, description: section.badge2Description },
				{ icon: section.badge3Icon, title: section.badge3Title, description: section.badge3Description },
				{ icon: section.badge4Icon, title: section.badge4Title, description: section.badge4Description },
				{ icon: section.badge5Icon, title: section.badge5Title, description: section.badge5Description },
				{ icon: section.badge6Icon, title: section.badge6Title, description: section.badge6Description },
			]
				.map((item) => ({
					icon: item.icon?.trim() || "",
					title: item.title?.trim() || "",
					description: item.description?.trim() || "",
				}))
				.filter((item) => item.icon || item.title || item.description);

			renderedSections.push(
				<section key={`trust-badges-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{badges.length ? (
							<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
								{badges.map((badge, badgeIndex) => (
									<div
										key={`${badge.title || "badge"}-${badgeIndex}`}
										className="rounded-xl border border-border bg-background p-4 text-center"
									>
										<p className="text-2xl">{badge.icon || "✅"}</p>
										<p className="mt-2 font-medium">{badge.title || `徽章 ${badgeIndex + 1}`}</p>
										{badge.description ? (
											<p className="mt-1 text-sm text-muted-foreground">{badge.description}</p>
										) : null}
									</div>
								))}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个信任徽章。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "contact-form-lite") {
			const actionHref = section.actionHref?.trim()
				? normalizeActionHref(channel, section.actionHref)
				: undefined;
			const buttonLabel = section.submitLabel?.trim() || "提交咨询";
			renderedSections.push(
				<section key={`contact-form-lite-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24, minHeight: 220 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-5 grid gap-3">
							<input
								type="text"
								placeholder={section.namePlaceholder || "你的姓名"}
								className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground"
							/>
							<input
								type="email"
								placeholder={section.emailPlaceholder || "你的邮箱"}
								className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground"
							/>
							<textarea
								placeholder={section.messagePlaceholder || "请描述你的需求..."}
								className="min-h-28 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
							/>
							<div>
								{actionHref ? (
									<a href={actionHref} className={getButtonClass("solid", "md")}>
										{buttonLabel}
									</a>
								) : (
									<button type="button" className={getButtonClass("solid", "md")}>
										{buttonLabel}
									</button>
								)}
							</div>
						</div>
						{section.privacyNote ? (
							<p className="mt-3 text-xs text-muted-foreground">{section.privacyNote}</p>
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "tabs-content") {
			const defaultTab =
				section.defaultTab === 2 || section.defaultTab === 3 || section.defaultTab === 4
					? section.defaultTab
					: 1;
			const tabs = [
				{ label: section.tab1Label?.trim() || "", body: section.tab1Body?.trim() || "" },
				{ label: section.tab2Label?.trim() || "", body: section.tab2Body?.trim() || "" },
				{ label: section.tab3Label?.trim() || "", body: section.tab3Body?.trim() || "" },
				{ label: section.tab4Label?.trim() || "", body: section.tab4Body?.trim() || "" },
			].filter((item) => item.label || item.body);
			const activeIndex = Math.min(defaultTab - 1, Math.max(0, tabs.length - 1));
			const activeTab = tabs[activeIndex];
			renderedSections.push(
				<section key={`tabs-content-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{tabs.length ? (
							<div className="mt-5 space-y-3">
								<div className="hidden flex-wrap gap-2 md:flex">
									{tabs.map((tab, tabIndex) => (
										<span
											key={`${tab.label || "tab"}-${tabIndex}`}
											className={`rounded-md px-3 py-1 text-sm ${
												tabIndex === activeIndex
													? "bg-primary text-primary-foreground"
													: "border border-border bg-background"
											}`}
										>
											{tab.label || `标签 ${tabIndex + 1}`}
										</span>
									))}
								</div>
								<div className="hidden rounded-xl border border-border bg-background p-4 md:block">
									<p className="text-sm text-muted-foreground">{activeTab?.body || "请填写标签内容。"}</p>
								</div>
								<div className="space-y-2 md:hidden">
									{tabs.map((tab, tabIndex) => (
										<details
											key={`${tab.label || "mobile-tab"}-${tabIndex}`}
											open={tabIndex === activeIndex}
											className="rounded-lg border border-border bg-background"
										>
											<summary className="cursor-pointer px-3 py-2 text-sm font-medium">
												{tab.label || `标签 ${tabIndex + 1}`}
											</summary>
											<p className="px-3 pb-3 text-sm text-muted-foreground">
												{tab.body || "请填写标签内容。"}
											</p>
										</details>
									))}
								</div>
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个标签内容。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "before-after") {
			const layout = section.layout === "vertical" ? "vertical" : "horizontal";
			const beforeImageUrl = resolveBackgroundImageUrl(section.beforeImageUrl);
			const afterImageUrl = resolveBackgroundImageUrl(section.afterImageUrl);
			const ctaHref = section.ctaHref?.trim() ? normalizeActionHref(channel, section.ctaHref) : undefined;
			renderedSections.push(
				<section key={`before-after-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div
							className={`mt-5 grid gap-4 ${
								layout === "vertical" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
							}`}
						>
							<div className="rounded-xl border border-border bg-background p-3">
								<p className="text-xs text-muted-foreground">{section.beforeLabel || "前"}</p>
								{beforeImageUrl ? (
									<img
										src={beforeImageUrl}
										alt={section.beforeImageAlt || section.beforeLabel || "before"}
										className="mt-2 h-56 w-full rounded-lg object-cover"
										loading="lazy"
									/>
								) : (
									<div className="mt-2 flex h-56 items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
										请上传前图
									</div>
								)}
							</div>
							<div className="rounded-xl border border-border bg-background p-3">
								<p className="text-xs text-muted-foreground">{section.afterLabel || "后"}</p>
								{afterImageUrl ? (
									<img
										src={afterImageUrl}
										alt={section.afterImageAlt || section.afterLabel || "after"}
										className="mt-2 h-56 w-full rounded-lg object-cover"
										loading="lazy"
									/>
								) : (
									<div className="mt-2 flex h-56 items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
										请上传后图
									</div>
								)}
							</div>
						</div>
						{section.ctaLabel && ctaHref ? (
							<a href={ctaHref} className={`mt-5 inline-flex ${getButtonClass("solid", "md")}`}>
								{section.ctaLabel}
							</a>
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "social-proof-feed") {
			const columns = normalizeColumnCount(section.columns);
			const gridClass =
				columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
			const items = [
				{
					quote: section.item1Quote,
					author: section.item1Author,
					meta: section.item1Meta,
					imageUrl: section.item1ImageUrl,
				},
				{
					quote: section.item2Quote,
					author: section.item2Author,
					meta: section.item2Meta,
					imageUrl: section.item2ImageUrl,
				},
				{
					quote: section.item3Quote,
					author: section.item3Author,
					meta: section.item3Meta,
					imageUrl: section.item3ImageUrl,
				},
				{
					quote: section.item4Quote,
					author: section.item4Author,
					meta: section.item4Meta,
					imageUrl: section.item4ImageUrl,
				},
			]
				.map((item) => ({
					quote: item.quote?.trim() || "",
					author: item.author?.trim() || "",
					meta: item.meta?.trim() || "",
					imageUrl: resolveBackgroundImageUrl(item.imageUrl),
				}))
				.filter((item) => item.quote || item.author || item.meta || item.imageUrl);

			renderedSections.push(
				<section key={`social-proof-feed-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{items.length ? (
							<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
								{items.map((item, itemIndex) => (
									<div
										key={`${item.author || "feedback"}-${itemIndex}`}
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
												<p className="text-xs font-medium">{item.author || `客户 ${itemIndex + 1}`}</p>
												{item.meta ? <p className="text-xs text-muted-foreground">{item.meta}</p> : null}
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 条客户评价。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "faq-compact") {
			const faqItems = [
				{ q: section.q1?.trim() || "", a: section.a1?.trim() || "" },
				{ q: section.q2?.trim() || "", a: section.a2?.trim() || "" },
				{ q: section.q3?.trim() || "", a: section.a3?.trim() || "" },
				{ q: section.q4?.trim() || "", a: section.a4?.trim() || "" },
				{ q: section.q5?.trim() || "", a: section.a5?.trim() || "" },
				{ q: section.q6?.trim() || "", a: section.a6?.trim() || "" },
			].filter((item) => item.q || item.a);
			renderedSections.push(
				<section key={`faq-compact-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{faqItems.length ? (
							<div className="mt-5 space-y-2">
								{faqItems.map((item, faqIndex) => (
									<details
										key={`${item.q || "faq"}-${faqIndex}`}
										className="rounded-lg border border-border bg-background"
									>
										<summary className="cursor-pointer px-3 py-2 text-sm font-medium">
											{item.q || `问题 ${faqIndex + 1}`}
										</summary>
										<p className="px-3 pb-3 text-sm text-muted-foreground">{item.a || "请填写回答内容。"}</p>
									</details>
								))}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 条 FAQ。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "metric-cards") {
			const columns = normalizeColumnCount(section.columns);
			const gridClass =
				columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
			const metrics = [
				{
					icon: section.item1Icon,
					label: section.item1Label,
					value: section.item1Value,
					delta: section.item1Delta,
				},
				{
					icon: section.item2Icon,
					label: section.item2Label,
					value: section.item2Value,
					delta: section.item2Delta,
				},
				{
					icon: section.item3Icon,
					label: section.item3Label,
					value: section.item3Value,
					delta: section.item3Delta,
				},
				{
					icon: section.item4Icon,
					label: section.item4Label,
					value: section.item4Value,
					delta: section.item4Delta,
				},
				{
					icon: section.item5Icon,
					label: section.item5Label,
					value: section.item5Value,
					delta: section.item5Delta,
				},
				{
					icon: section.item6Icon,
					label: section.item6Label,
					value: section.item6Value,
					delta: section.item6Delta,
				},
			]
				.map((item) => ({
					icon: item.icon?.trim() || "",
					label: item.label?.trim() || "",
					value: item.value?.trim() || "",
					delta: item.delta?.trim() || "",
				}))
				.filter((item) => item.icon || item.label || item.value || item.delta);

			renderedSections.push(
				<section key={`metric-cards-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{metrics.length ? (
							<div className={`mt-5 grid grid-cols-1 gap-4 ${gridClass}`}>
								{metrics.map((item, metricIndex) => (
									<div
										key={`${item.label || "metric"}-${metricIndex}`}
										className="rounded-xl border border-border bg-background p-4"
									>
										<p className="text-lg">{item.icon || "📈"}</p>
										<p className="mt-2 text-xs text-muted-foreground">
											{item.label || `指标 ${metricIndex + 1}`}
										</p>
										<p className="mt-1 text-2xl font-semibold">{item.value || "-"}</p>
										{item.delta ? <p className="mt-1 text-xs text-primary">{item.delta}</p> : null}
									</div>
								))}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个指标。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "media-text-split") {
			const layout = section.layout === "media-right" ? "media-right" : "media-left";
			const mediaType = section.mediaType === "video" ? "video" : "image";
			const imageUrl = resolveBackgroundImageUrl(section.imageUrl);
			const videoUrl = resolveVideoEmbedUrl(section.videoUrl);
			const ctaHref = section.ctaHref?.trim() ? normalizeActionHref(channel, section.ctaHref) : undefined;

			const mediaNode =
				mediaType === "video" && videoUrl ? (
					videoUrl.includes("youtube.com/embed/") || videoUrl.includes("player.vimeo.com/video/") ? (
						<iframe
							src={videoUrl}
							title={section.heading || "media video"}
							className="aspect-video w-full rounded-lg"
							loading="lazy"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							referrerPolicy="strict-origin-when-cross-origin"
							allowFullScreen
						/>
					) : (
						<video className="aspect-video w-full rounded-lg object-cover" controls src={videoUrl} />
					)
				) : imageUrl ? (
					<img
						src={imageUrl}
						alt={section.imageAlt || "media"}
						className="aspect-video w-full rounded-lg object-cover"
						loading="lazy"
					/>
				) : (
					<div className="flex aspect-video items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
						请上传图片或填写视频链接
					</div>
				);

			renderedSections.push(
				<section key={`media-text-split-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
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
								{mediaNode}
							</div>
							<div className={`${layout === "media-right" ? "md:order-1" : ""} flex flex-col justify-center`}>
								{section.eyebrow ? <p className="text-xs text-muted-foreground">{section.eyebrow}</p> : null}
								{section.heading ? (
									<h2 className="mt-1 text-2xl font-semibold tracking-tight">{section.heading}</h2>
								) : null}
								{section.body ? <p className="mt-2 text-sm text-muted-foreground">{section.body}</p> : null}
								{section.ctaLabel && ctaHref ? (
									<a href={ctaHref} className={`mt-4 inline-flex ${getButtonClass("solid", "md")}`}>
										{section.ctaLabel}
									</a>
								) : null}
							</div>
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "quote-highlight") {
			const quoteText = section.quoteText?.trim() || "";
			if (!quoteText) continue;
			const backgroundImageUrl = resolveBackgroundImageUrl(section.backgroundImageUrl);
			const ctaHref = section.ctaHref?.trim() ? normalizeActionHref(channel, section.ctaHref) : undefined;
			const sectionStyle = getSectionBoxStyle(section, { paddingX: 24, paddingY: 24, minHeight: 180 });
			const style = resolveSectionStyle(section);
			const mergedStyle: CSSProperties =
				backgroundImageUrl && !style?.background.imageUrl
					? {
							...sectionStyle,
							backgroundImage: `url(${backgroundImageUrl})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
						}
					: sectionStyle;
			renderedSections.push(
				<section key={`quote-highlight-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={mergedStyle}
					>
						<p className="text-xl font-semibold leading-relaxed">“{quoteText}”</p>
						<div className="mt-4">
							{section.authorName ? <p className="text-sm font-medium">{section.authorName}</p> : null}
							{section.authorTitle ? (
								<p className="text-xs text-muted-foreground">{section.authorTitle}</p>
							) : null}
						</div>
						{section.ctaLabel && ctaHref ? (
							<a href={ctaHref} className={`mt-4 inline-flex ${getButtonClass("solid", "md")}`}>
								{section.ctaLabel}
							</a>
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "feature-comparison") {
			const planCount = normalizeColumnCount(section.columns);
			const plans = [
				section.plan1Name?.trim() || "方案 1",
				section.plan2Name?.trim() || "方案 2",
				section.plan3Name?.trim() || "方案 3",
				section.plan4Name?.trim() || "方案 4",
			].slice(0, planCount);
			const rows = [
				{
					label: section.row1Label?.trim() || "",
					values: [section.row1Plan1, section.row1Plan2, section.row1Plan3, section.row1Plan4],
				},
				{
					label: section.row2Label?.trim() || "",
					values: [section.row2Plan1, section.row2Plan2, section.row2Plan3, section.row2Plan4],
				},
				{
					label: section.row3Label?.trim() || "",
					values: [section.row3Plan1, section.row3Plan2, section.row3Plan3, section.row3Plan4],
				},
				{
					label: section.row4Label?.trim() || "",
					values: [section.row4Plan1, section.row4Plan2, section.row4Plan3, section.row4Plan4],
				},
			]
				.map((row) => ({
					label: row.label,
					values: row.values.map((value) => value?.trim() || ""),
				}))
				.filter((row) => row.label || row.values.some(Boolean));

			renderedSections.push(
				<section key={`feature-comparison-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-5 overflow-x-auto">
							<table className="w-full min-w-[520px] border-collapse text-sm">
								<thead>
									<tr>
										<th className="bg-muted/30 border border-border px-3 py-2 text-left">特性</th>
										{plans.map((plan, planIndex) => (
											<th
												key={`${plan}-${planIndex}`}
												className="bg-muted/30 border border-border px-3 py-2 text-left"
											>
												{plan}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{rows.map((row, rowIndex) => (
										<tr key={`${row.label || "row"}-${rowIndex}`}>
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
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "inline-cta-banner") {
			const compact = section.compactMode !== "off";
			const ctaHref = section.ctaHref?.trim() ? normalizeActionHref(channel, section.ctaHref) : undefined;
			const secondaryCtaHref = section.secondaryCtaHref?.trim()
				? normalizeActionHref(channel, section.secondaryCtaHref)
				: undefined;
			const message = section.message?.trim() || "";
			if (!message) continue;
			renderedSections.push(
				<section key={`inline-cta-banner-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)} ${
							compact ? "px-4 py-3" : "px-6 py-5"
						}`}
						style={getSectionBoxStyle(section, { paddingX: compact ? 16 : 24, paddingY: compact ? 12 : 20 })}
					>
						<div className="flex flex-wrap items-center gap-3">
							<p className="text-sm font-medium">{message}</p>
							{section.ctaLabel && ctaHref ? (
								<a href={ctaHref} className={getButtonClass("solid", compact ? "sm" : "md")}>
									{section.ctaLabel}
								</a>
							) : null}
							{section.secondaryCtaLabel && secondaryCtaHref ? (
								<a href={secondaryCtaHref} className={getButtonClass("outline", compact ? "sm" : "md")}>
									{section.secondaryCtaLabel}
								</a>
							) : null}
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "logo-strip-compact") {
			const logos = [
				{ url: section.logo1Url, alt: section.logo1Alt, href: section.logo1Href },
				{ url: section.logo2Url, alt: section.logo2Alt, href: section.logo2Href },
				{ url: section.logo3Url, alt: section.logo3Alt, href: section.logo3Href },
				{ url: section.logo4Url, alt: section.logo4Alt, href: section.logo4Href },
				{ url: section.logo5Url, alt: section.logo5Alt, href: section.logo5Href },
				{ url: section.logo6Url, alt: section.logo6Alt, href: section.logo6Href },
			]
				.map((item) => ({
					url: resolveBackgroundImageUrl(item.url),
					alt: item.alt?.trim() || "",
					href: item.href?.trim() ? normalizeActionHref(channel, item.href) : undefined,
				}))
				.filter((item) => item.url);
			renderedSections.push(
				<section key={`logo-strip-compact-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 20, paddingY: 16 })}
					>
						{section.heading ? (
							<h2 className="text-xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{logos.length ? (
							<div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
								{logos.map((logo, logoIndex) => {
									const key = `${logo.alt || "logo"}-${logoIndex}`;
									const content = (
										<img
											src={logo.url}
											alt={logo.alt || "logo"}
											className="h-10 w-auto object-contain"
											loading="lazy"
										/>
									);
									return logo.href ? (
										<a
											key={key}
											href={logo.href}
											className="hover:bg-muted/20 flex items-center justify-center rounded-lg border border-border bg-background p-3"
										>
											{content}
										</a>
									) : (
										<div
											key={key}
											className="flex items-center justify-center rounded-lg border border-border bg-background p-3"
										>
											{content}
										</div>
									);
								})}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少上传 1 张 Logo。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "event-highlights") {
			const layout = section.layout === "cards" ? "cards" : "timeline";
			const events = [
				{ date: section.event1Date, title: section.event1Title, description: section.event1Description },
				{ date: section.event2Date, title: section.event2Title, description: section.event2Description },
				{ date: section.event3Date, title: section.event3Title, description: section.event3Description },
				{ date: section.event4Date, title: section.event4Title, description: section.event4Description },
			]
				.map((item) => ({
					date: item.date?.trim() || "",
					title: item.title?.trim() || "",
					description: item.description?.trim() || "",
				}))
				.filter((item) => item.date || item.title || item.description);
			renderedSections.push(
				<section key={`event-highlights-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{events.length ? (
							layout === "cards" ? (
								<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
									{events.map((event, eventIndex) => (
										<div
											key={`${event.title || "event"}-${eventIndex}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="text-xs text-muted-foreground">
												{event.date || `事件 ${eventIndex + 1}`}
											</p>
											<p className="mt-1 font-medium">{event.title || `标题 ${eventIndex + 1}`}</p>
											{event.description ? (
												<p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
											) : null}
										</div>
									))}
								</div>
							) : (
								<ol className="mt-4 space-y-2">
									{events.map((event, eventIndex) => (
										<li
											key={`${event.title || "event"}-${eventIndex}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="text-xs text-muted-foreground">
												{event.date || `事件 ${eventIndex + 1}`}
											</p>
											<p className="mt-1 font-medium">{event.title || `标题 ${eventIndex + 1}`}</p>
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
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "cta-card-pair") {
			const cards = [
				{
					title: section.card1Title,
					body: section.card1Body,
					ctaLabel: section.card1CtaLabel,
					ctaHref: section.card1CtaHref,
					imageUrl: section.card1ImageUrl,
				},
				{
					title: section.card2Title,
					body: section.card2Body,
					ctaLabel: section.card2CtaLabel,
					ctaHref: section.card2CtaHref,
					imageUrl: section.card2ImageUrl,
				},
			]
				.map((item) => ({
					title: item.title?.trim() || "",
					body: item.body?.trim() || "",
					ctaLabel: item.ctaLabel?.trim() || "",
					ctaHref: item.ctaHref?.trim() ? normalizeActionHref(channel, item.ctaHref) : undefined,
					imageUrl: resolveBackgroundImageUrl(item.imageUrl),
				}))
				.filter((item) => item.title || item.body || item.ctaLabel || item.imageUrl);
			renderedSections.push(
				<section key={`cta-card-pair-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{cards.length ? (
							<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
								{cards.map((card, cardIndex) => (
									<div
										key={`${card.title || "card"}-${cardIndex}`}
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
										<p className="font-medium">{card.title || `入口 ${cardIndex + 1}`}</p>
										{card.body ? <p className="mt-1 text-sm text-muted-foreground">{card.body}</p> : null}
										{card.ctaLabel && card.ctaHref ? (
											<a
												href={card.ctaHref}
												className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
											>
												{card.ctaLabel}
											</a>
										) : null}
									</div>
								))}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 张 CTA 卡片。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "faq-with-cta") {
			const faqs = [
				{ q: section.q1, a: section.a1 },
				{ q: section.q2, a: section.a2 },
				{ q: section.q3, a: section.a3 },
				{ q: section.q4, a: section.a4 },
			]
				.map((item) => ({ q: item.q?.trim() || "", a: item.a?.trim() || "" }))
				.filter((item) => item.q || item.a);
			const ctaHref = section.ctaHref?.trim() ? normalizeActionHref(channel, section.ctaHref) : undefined;
			const ctaImageUrl = resolveBackgroundImageUrl(section.ctaImageUrl);
			renderedSections.push(
				<section key={`faq-with-cta-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
							<div className="space-y-3">
								{faqs.length ? (
									faqs.map((faq, faqIndex) => (
										<div
											key={`${faq.q || "faq"}-${faqIndex}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="font-medium">{faq.q || `问题 ${faqIndex + 1}`}</p>
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
										alt={section.ctaTitle || "cta"}
										className="mb-3 h-28 w-full rounded object-cover"
										loading="lazy"
									/>
								) : null}
								{section.ctaTitle ? <p className="font-medium">{section.ctaTitle}</p> : null}
								{section.ctaBody ? (
									<p className="mt-1 text-sm text-muted-foreground">{section.ctaBody}</p>
								) : null}
								{section.ctaLabel && ctaHref ? (
									<a
										href={ctaHref}
										className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
									>
										{section.ctaLabel}
									</a>
								) : null}
							</div>
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "partner-metrics") {
			const columns = section.columns === 2 ? 2 : section.columns === 4 ? 4 : 3;
			const gridClass =
				columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
			const items = [
				{
					logoUrl: section.item1LogoUrl,
					logoAlt: section.item1LogoAlt,
					metric: section.item1Metric,
					label: section.item1Label,
				},
				{
					logoUrl: section.item2LogoUrl,
					logoAlt: section.item2LogoAlt,
					metric: section.item2Metric,
					label: section.item2Label,
				},
				{
					logoUrl: section.item3LogoUrl,
					logoAlt: section.item3LogoAlt,
					metric: section.item3Metric,
					label: section.item3Label,
				},
				{
					logoUrl: section.item4LogoUrl,
					logoAlt: section.item4LogoAlt,
					metric: section.item4Metric,
					label: section.item4Label,
				},
			]
				.slice(0, columns)
				.map((item) => ({
					logoUrl: resolveBackgroundImageUrl(item.logoUrl),
					logoAlt: item.logoAlt?.trim() || "",
					metric: item.metric?.trim() || "",
					label: item.label?.trim() || "",
				}))
				.filter((item) => item.logoUrl || item.metric || item.label);
			renderedSections.push(
				<section key={`partner-metrics-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 20 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{items.length ? (
							<div className={`mt-4 grid grid-cols-1 gap-3 ${gridClass}`}>
								{items.map((item, itemIndex) => (
									<div
										key={`${item.label || "metric"}-${itemIndex}`}
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
										<p className="mt-1 text-sm text-muted-foreground">
											{item.label || `指标 ${itemIndex + 1}`}
										</p>
									</div>
								))}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 组伙伴数据。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "story-steps") {
			const layout = section.layout === "timeline" ? "timeline" : "cards";
			const steps = [
				{ title: section.step1Title, body: section.step1Body, imageUrl: section.step1ImageUrl },
				{ title: section.step2Title, body: section.step2Body, imageUrl: section.step2ImageUrl },
				{ title: section.step3Title, body: section.step3Body, imageUrl: section.step3ImageUrl },
				{ title: section.step4Title, body: section.step4Body, imageUrl: section.step4ImageUrl },
			]
				.map((item) => ({
					title: item.title?.trim() || "",
					body: item.body?.trim() || "",
					imageUrl: resolveBackgroundImageUrl(item.imageUrl),
				}))
				.filter((item) => item.title || item.body || item.imageUrl);
			renderedSections.push(
				<section key={`story-steps-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{steps.length ? (
							layout === "timeline" ? (
								<ol className="mt-4 space-y-3">
									{steps.map((step, stepIndex) => (
										<li
											key={`${step.title || "step"}-${stepIndex}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="text-xs text-muted-foreground">步骤 {stepIndex + 1}</p>
											<p className="mt-1 font-medium">{step.title || `步骤 ${stepIndex + 1}`}</p>
											{step.body ? <p className="mt-1 text-sm text-muted-foreground">{step.body}</p> : null}
										</li>
									))}
								</ol>
							) : (
								<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
									{steps.map((step, stepIndex) => (
										<div
											key={`${step.title || "step"}-${stepIndex}`}
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
											<p className="text-xs text-muted-foreground">步骤 {stepIndex + 1}</p>
											<p className="mt-1 font-medium">{step.title || `步骤 ${stepIndex + 1}`}</p>
											{step.body ? <p className="mt-1 text-sm text-muted-foreground">{step.body}</p> : null}
										</div>
									))}
								</div>
							)
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个步骤。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "media-carousel") {
			const autoplay = section.autoplay !== "off";
			const slides = [
				{
					imageUrl: resolveBackgroundImageUrl(section.slide1ImageUrl),
					title: section.slide1Title?.trim() || "",
					body: section.slide1Body?.trim() || "",
					ctaLabel: section.slide1CtaLabel?.trim() || "",
					ctaHref: section.slide1CtaHref?.trim()
						? normalizeActionHref(channel, section.slide1CtaHref)
						: undefined,
				},
				{
					imageUrl: resolveBackgroundImageUrl(section.slide2ImageUrl),
					title: section.slide2Title?.trim() || "",
					body: section.slide2Body?.trim() || "",
					ctaLabel: section.slide2CtaLabel?.trim() || "",
					ctaHref: section.slide2CtaHref?.trim()
						? normalizeActionHref(channel, section.slide2CtaHref)
						: undefined,
				},
				{
					imageUrl: resolveBackgroundImageUrl(section.slide3ImageUrl),
					title: section.slide3Title?.trim() || "",
					body: section.slide3Body?.trim() || "",
					ctaLabel: section.slide3CtaLabel?.trim() || "",
					ctaHref: section.slide3CtaHref?.trim()
						? normalizeActionHref(channel, section.slide3CtaHref)
						: undefined,
				},
			].filter((item) => item.imageUrl || item.title || item.body || item.ctaLabel);
			const activeSlide = slides[0];
			renderedSections.push(
				<section key={`media-carousel-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<p className="mt-1 text-xs text-muted-foreground">
							{autoplay ? "自动轮播已开启（当前展示第 1 张）" : "自动轮播已关闭"}
						</p>
						{activeSlide ? (
							<div className="mt-4 rounded-lg border border-border bg-background p-3">
								{activeSlide.imageUrl ? (
									<img
										src={activeSlide.imageUrl}
										alt={activeSlide.title || "slide"}
										className="h-52 w-full rounded object-cover"
										loading="lazy"
									/>
								) : null}
								<div className="mt-3">
									<p className="text-lg font-semibold tracking-tight">{activeSlide.title || "轮播标题"}</p>
									{activeSlide.body ? (
										<p className="mt-1 text-sm text-muted-foreground">{activeSlide.body}</p>
									) : null}
									{activeSlide.ctaLabel && activeSlide.ctaHref ? (
										<a href={activeSlide.ctaHref} className={getButtonClass("solid", "md")}>
											{activeSlide.ctaLabel}
										</a>
									) : null}
								</div>
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个轮播项。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "feature-checklist") {
			const items = [
				section.item1,
				section.item2,
				section.item3,
				section.item4,
				section.item5,
				section.item6,
				section.item7,
				section.item8,
			]
				.map((item) => item?.trim() || "")
				.filter(Boolean);
			const ctaHref = section.ctaHref?.trim() ? normalizeActionHref(channel, section.ctaHref) : undefined;
			renderedSections.push(
				<section key={`feature-checklist-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{items.length ? (
							<ul className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
								{items.map((item, itemIndex) => (
									<li
										key={`${item}-${itemIndex}`}
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
						{section.ctaLabel && ctaHref ? (
							<a href={ctaHref} className={`mt-4 ${getButtonClass("solid", "md")}`}>
								{section.ctaLabel}
							</a>
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "mini-blog-cards") {
			const cards = [
				{
					title: section.card1Title?.trim() || "",
					excerpt: section.card1Excerpt?.trim() || "",
					href: section.card1Href?.trim() ? normalizeActionHref(channel, section.card1Href) : undefined,
					imageUrl: resolveBackgroundImageUrl(section.card1ImageUrl),
				},
				{
					title: section.card2Title?.trim() || "",
					excerpt: section.card2Excerpt?.trim() || "",
					href: section.card2Href?.trim() ? normalizeActionHref(channel, section.card2Href) : undefined,
					imageUrl: resolveBackgroundImageUrl(section.card2ImageUrl),
				},
				{
					title: section.card3Title?.trim() || "",
					excerpt: section.card3Excerpt?.trim() || "",
					href: section.card3Href?.trim() ? normalizeActionHref(channel, section.card3Href) : undefined,
					imageUrl: resolveBackgroundImageUrl(section.card3ImageUrl),
				},
			].filter((item) => item.title || item.excerpt || item.href || item.imageUrl);
			renderedSections.push(
				<section key={`mini-blog-cards-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{cards.length ? (
							<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
								{cards.map((card, cardIndex) => (
									<div
										key={`${card.title || "card"}-${cardIndex}`}
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
										<p className="font-medium">{card.title || `内容 ${cardIndex + 1}`}</p>
										{card.excerpt ? (
											<p className="mt-1 text-sm text-muted-foreground">{card.excerpt}</p>
										) : null}
										{card.href ? (
											<a
												href={card.href}
												className="mt-2 inline-flex text-sm font-medium text-primary hover:underline"
											>
												查看详情
											</a>
										) : null}
									</div>
								))}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 张内容卡片。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "trust-logo-wall") {
			const dense = section.density !== "normal";
			const logos = [
				{ url: section.logo1Url, alt: section.logo1Alt, href: section.logo1Href },
				{ url: section.logo2Url, alt: section.logo2Alt, href: section.logo2Href },
				{ url: section.logo3Url, alt: section.logo3Alt, href: section.logo3Href },
				{ url: section.logo4Url, alt: section.logo4Alt, href: section.logo4Href },
				{ url: section.logo5Url, alt: section.logo5Alt, href: section.logo5Href },
				{ url: section.logo6Url, alt: section.logo6Alt, href: section.logo6Href },
				{ url: section.logo7Url, alt: section.logo7Alt, href: section.logo7Href },
				{ url: section.logo8Url, alt: section.logo8Alt, href: section.logo8Href },
			]
				.map((item) => ({
					url: resolveBackgroundImageUrl(item.url),
					alt: item.alt?.trim() || "",
					href: item.href?.trim() ? normalizeActionHref(channel, item.href) : undefined,
				}))
				.filter((item) => item.url);
			renderedSections.push(
				<section key={`trust-logo-wall-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 20, paddingY: 16 })}
					>
						{section.heading ? (
							<h2 className="text-xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{section.groupLabel ? (
							<p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
								{section.groupLabel}
							</p>
						) : null}
						{logos.length ? (
							<div className={`mt-4 grid grid-cols-2 md:grid-cols-4 ${dense ? "gap-2" : "gap-3"}`}>
								{logos.map((logo, logoIndex) => {
									const key = `${logo.alt || "logo"}-${logoIndex}`;
									const content = (
										<img
											src={logo.url}
											alt={logo.alt || "logo"}
											className={`${dense ? "h-8" : "h-10"} w-auto object-contain`}
											loading="lazy"
										/>
									);
									return logo.href ? (
										<a
											key={key}
											href={logo.href}
											className={`hover:bg-muted/20 flex items-center justify-center rounded-lg border border-border bg-background ${
												dense ? "p-2" : "p-3"
											}`}
										>
											{content}
										</a>
									) : (
										<div
											key={key}
											className={`flex items-center justify-center rounded-lg border border-border bg-background ${
												dense ? "p-2" : "p-3"
											}`}
										>
											{content}
										</div>
									);
								})}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少上传 1 张 Logo。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "dual-hero-split") {
			const leftImageUrl = resolveBackgroundImageUrl(section.leftImageUrl);
			const rightImageUrl = resolveBackgroundImageUrl(section.rightImageUrl);
			const leftCtaHref = section.leftCtaHref?.trim()
				? normalizeActionHref(channel, section.leftCtaHref)
				: undefined;
			const rightCtaHref = section.rightCtaHref?.trim()
				? normalizeActionHref(channel, section.rightCtaHref)
				: undefined;
			renderedSections.push(
				<section key={`dual-hero-split-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
							<div
								className="rounded-lg border border-border p-4"
								style={{
									...(section.leftBackgroundColor ? { backgroundColor: section.leftBackgroundColor } : {}),
									...(leftImageUrl
										? {
												backgroundImage: `url(${leftImageUrl})`,
												backgroundSize: "cover",
												backgroundPosition: "center",
											}
										: {}),
								}}
							>
								{section.leftEyebrow ? (
									<p className="text-xs uppercase tracking-wide text-muted-foreground">
										{section.leftEyebrow}
									</p>
								) : null}
								{section.leftTitle ? <p className="mt-1 text-lg font-semibold">{section.leftTitle}</p> : null}
								{section.leftBody ? (
									<p className="mt-2 text-sm text-muted-foreground">{section.leftBody}</p>
								) : null}
								{section.leftCtaLabel && leftCtaHref ? (
									<a
										href={leftCtaHref}
										className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
									>
										{section.leftCtaLabel}
									</a>
								) : null}
							</div>
							<div
								className="rounded-lg border border-border p-4"
								style={{
									...(section.rightBackgroundColor ? { backgroundColor: section.rightBackgroundColor } : {}),
									...(rightImageUrl
										? {
												backgroundImage: `url(${rightImageUrl})`,
												backgroundSize: "cover",
												backgroundPosition: "center",
											}
										: {}),
								}}
							>
								{section.rightEyebrow ? (
									<p className="text-xs uppercase tracking-wide text-muted-foreground">
										{section.rightEyebrow}
									</p>
								) : null}
								{section.rightTitle ? (
									<p className="mt-1 text-lg font-semibold">{section.rightTitle}</p>
								) : null}
								{section.rightBody ? (
									<p className="mt-2 text-sm text-muted-foreground">{section.rightBody}</p>
								) : null}
								{section.rightCtaLabel && rightCtaHref ? (
									<a
										href={rightCtaHref}
										className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
									>
										{section.rightCtaLabel}
									</a>
								) : null}
							</div>
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "quick-links-grid") {
			const columns = section.columns === 2 ? 2 : section.columns === 4 ? 4 : 3;
			const gridClass =
				columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
			const links = [
				{ label: section.link1Label, href: section.link1Href, icon: section.link1Icon },
				{ label: section.link2Label, href: section.link2Href, icon: section.link2Icon },
				{ label: section.link3Label, href: section.link3Href, icon: section.link3Icon },
				{ label: section.link4Label, href: section.link4Href, icon: section.link4Icon },
				{ label: section.link5Label, href: section.link5Href, icon: section.link5Icon },
				{ label: section.link6Label, href: section.link6Href, icon: section.link6Icon },
				{ label: section.link7Label, href: section.link7Href, icon: section.link7Icon },
				{ label: section.link8Label, href: section.link8Href, icon: section.link8Icon },
			]
				.map((item) => ({
					label: item.label?.trim() || "",
					href: item.href?.trim() ? normalizeActionHref(channel, item.href) : undefined,
					icon: item.icon?.trim() || "",
				}))
				.filter((item) => item.label || item.href || item.icon);
			renderedSections.push(
				<section key={`quick-links-grid-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{links.length ? (
							<div className={`mt-4 grid grid-cols-1 gap-3 ${gridClass}`}>
								{links.map((link, linkIndex) =>
									link.href ? (
										<a
											key={`${link.label || "link"}-${linkIndex}`}
											href={link.href}
											className="hover:bg-muted/20 rounded-lg border border-border bg-background p-3"
										>
											<p className="font-medium">
												{link.icon ? <span className="mr-1">{link.icon}</span> : null}
												{link.label || `链接 ${linkIndex + 1}`}
											</p>
										</a>
									) : (
										<div
											key={`${link.label || "link"}-${linkIndex}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="font-medium">
												{link.icon ? <span className="mr-1">{link.icon}</span> : null}
												{link.label || `链接 ${linkIndex + 1}`}
											</p>
										</div>
									),
								)}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个快捷链接。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "store-locator-lite") {
			const cards = [
				{
					name: section.card1Name?.trim() || "",
					address: section.card1Address?.trim() || "",
					phone: section.card1Phone?.trim() || "",
					hours: section.card1Hours?.trim() || "",
					mapHref: section.card1MapHref?.trim()
						? normalizeActionHref(channel, section.card1MapHref)
						: undefined,
				},
				{
					name: section.card2Name?.trim() || "",
					address: section.card2Address?.trim() || "",
					phone: section.card2Phone?.trim() || "",
					hours: section.card2Hours?.trim() || "",
					mapHref: section.card2MapHref?.trim()
						? normalizeActionHref(channel, section.card2MapHref)
						: undefined,
				},
				{
					name: section.card3Name?.trim() || "",
					address: section.card3Address?.trim() || "",
					phone: section.card3Phone?.trim() || "",
					hours: section.card3Hours?.trim() || "",
					mapHref: section.card3MapHref?.trim()
						? normalizeActionHref(channel, section.card3MapHref)
						: undefined,
				},
			].filter((item) => item.name || item.address || item.phone || item.hours || item.mapHref);
			renderedSections.push(
				<section key={`store-locator-lite-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{cards.length ? (
							<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
								{cards.map((card, cardIndex) => (
									<div
										key={`${card.name || "store"}-${cardIndex}`}
										className="rounded-lg border border-border bg-background p-3"
									>
										<p className="font-medium">{card.name || `门店 ${cardIndex + 1}`}</p>
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
											<a
												href={card.mapHref}
												className="mt-2 inline-flex text-sm font-medium text-primary hover:underline"
											>
												查看地图
											</a>
										) : null}
									</div>
								))}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个门店卡片。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "timeline-compact") {
			const items = [
				{ date: section.item1Date, title: section.item1Title, body: section.item1Body },
				{ date: section.item2Date, title: section.item2Title, body: section.item2Body },
				{ date: section.item3Date, title: section.item3Title, body: section.item3Body },
				{ date: section.item4Date, title: section.item4Title, body: section.item4Body },
			]
				.map((item) => ({
					date: item.date?.trim() || "",
					title: item.title?.trim() || "",
					body: item.body?.trim() || "",
				}))
				.filter((item) => item.date || item.title || item.body);
			renderedSections.push(
				<section key={`timeline-compact-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{items.length ? (
							<ol className="mt-4 space-y-2">
								{items.map((item, itemIndex) => (
									<li
										key={`${item.title || "timeline"}-${itemIndex}`}
										className="rounded-lg border border-border bg-background p-3"
									>
										<p className="text-xs text-muted-foreground">{item.date || `节点 ${itemIndex + 1}`}</p>
										<p className="mt-1 font-medium">{item.title || `标题 ${itemIndex + 1}`}</p>
										{item.body ? <p className="mt-1 text-sm text-muted-foreground">{item.body}</p> : null}
									</li>
								))}
							</ol>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个时间线节点。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "faq-cards") {
			const columns = section.columns === 2 ? 2 : section.columns === 4 ? 4 : 3;
			const gridClass =
				columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
			const faqs = [
				{ q: section.q1, a: section.a1 },
				{ q: section.q2, a: section.a2 },
				{ q: section.q3, a: section.a3 },
				{ q: section.q4, a: section.a4 },
				{ q: section.q5, a: section.a5 },
				{ q: section.q6, a: section.a6 },
			]
				.map((item) => ({ q: item.q?.trim() || "", a: item.a?.trim() || "" }))
				.filter((item) => item.q || item.a);
			renderedSections.push(
				<section key={`faq-cards-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{faqs.length ? (
							<div className={`mt-4 grid grid-cols-1 gap-3 ${gridClass}`}>
								{faqs.map((faq, faqIndex) => (
									<div
										key={`${faq.q || "faq"}-${faqIndex}`}
										className="rounded-lg border border-border bg-background p-3"
									>
										<p className="font-medium">{faq.q || `问题 ${faqIndex + 1}`}</p>
										{faq.a ? <p className="mt-1 text-sm text-muted-foreground">{faq.a}</p> : null}
									</div>
								))}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 条 FAQ。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "product-comparison-lite") {
			const columns = section.columns === 2 ? 2 : section.columns === 4 ? 4 : 3;
			const gridClass =
				columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
			const items = [
				{
					name: section.item1Name,
					price: section.item1Price,
					feature: section.item1Feature,
					ctaLabel: section.item1CtaLabel,
					ctaHref: section.item1CtaHref,
				},
				{
					name: section.item2Name,
					price: section.item2Price,
					feature: section.item2Feature,
					ctaLabel: section.item2CtaLabel,
					ctaHref: section.item2CtaHref,
				},
				{
					name: section.item3Name,
					price: section.item3Price,
					feature: section.item3Feature,
					ctaLabel: section.item3CtaLabel,
					ctaHref: section.item3CtaHref,
				},
				{
					name: section.item4Name,
					price: section.item4Price,
					feature: section.item4Feature,
					ctaLabel: section.item4CtaLabel,
					ctaHref: section.item4CtaHref,
				},
			]
				.map((item) => ({
					name: item.name?.trim() || "",
					price: item.price?.trim() || "",
					feature: item.feature?.trim() || "",
					ctaLabel: item.ctaLabel?.trim() || "",
					ctaHref: item.ctaHref?.trim() ? normalizeCtaHref(channel, item.ctaHref) : undefined,
				}))
				.filter((item) => item.name || item.price || item.feature || item.ctaLabel || item.ctaHref);
			renderedSections.push(
				<section key={`product-comparison-lite-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{items.length ? (
							<div className={`mt-4 grid grid-cols-1 gap-3 ${gridClass}`}>
								{items.map((item, itemIndex) => (
									<div
										key={`${item.name || "product"}-${itemIndex}`}
										className="rounded-lg border border-border bg-background p-3"
									>
										<p className="font-medium">{item.name || `产品 ${itemIndex + 1}`}</p>
										{item.price ? <p className="mt-1 text-sm text-muted-foreground">{item.price}</p> : null}
										{item.feature ? (
											<p className="mt-1 text-xs text-muted-foreground">{item.feature}</p>
										) : null}
										{item.ctaLabel && item.ctaHref ? (
											<a
												href={item.ctaHref}
												className="mt-2 inline-flex text-sm font-medium text-primary hover:underline"
											>
												{item.ctaLabel}
											</a>
										) : null}
									</div>
								))}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个对比产品。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "cta-marquee") {
			const speedLabel = section.speed === "slow" ? "慢速" : section.speed === "fast" ? "快速" : "标准";
			const hoverLabel = section.pauseOnHover === "off" ? "关闭" : "开启";
			const ctaHref = section.ctaHref?.trim() ? normalizeCtaHref(channel, section.ctaHref) : undefined;
			renderedSections.push(
				<section key={`cta-marquee-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						<div className="border-primary/40 bg-background/70 rounded-lg border border-dashed p-4">
							<p className="text-sm font-medium text-primary">
								{section.message?.trim() || "滚动促销主文案"}
							</p>
							{section.secondaryMessage?.trim() ? (
								<p className="mt-1 text-sm text-muted-foreground">{section.secondaryMessage}</p>
							) : null}
							<div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
								<span>速度：{speedLabel}</span>
								<span>悬停暂停：{hoverLabel}</span>
							</div>
							{section.ctaLabel?.trim() && ctaHref ? (
								<a
									href={ctaHref}
									className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
								>
									{section.ctaLabel}
								</a>
							) : null}
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "faq-accordion-plus") {
			const groups = [
				{
					title: section.group1Title,
					items: [
						{ q: section.q1, a: section.a1 },
						{ q: section.q2, a: section.a2 },
					],
				},
				{
					title: section.group2Title,
					items: [
						{ q: section.q3, a: section.a3 },
						{ q: section.q4, a: section.a4 },
					],
				},
				{
					title: section.group3Title,
					items: [
						{ q: section.q5, a: section.a5 },
						{ q: section.q6, a: section.a6 },
					],
				},
			]
				.map((group) => ({
					title: group.title?.trim() || "",
					items: group.items
						.map((item) => ({ q: item.q?.trim() || "", a: item.a?.trim() || "" }))
						.filter((item) => item.q || item.a),
				}))
				.filter((group) => group.title || group.items.length > 0);
			renderedSections.push(
				<section key={`faq-accordion-plus-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{groups.length ? (
							<div className="mt-4 space-y-3">
								{groups.map((group, groupIndex) => (
									<div
										key={`${group.title || "group"}-${groupIndex}`}
										className="rounded-lg border border-border bg-background p-3"
									>
										<p className="text-sm font-semibold">{group.title || `分组 ${groupIndex + 1}`}</p>
										<div className="mt-2 space-y-2">
											{group.items.map((item, itemIndex) => (
												<details
													key={`${item.q || "faq"}-${itemIndex}`}
													className="border-border/70 rounded-md border px-3 py-2"
												>
													<summary className="cursor-pointer text-sm font-medium">
														{item.q || `问题 ${itemIndex + 1}`}
													</summary>
													{item.a ? <p className="mt-2 text-xs text-muted-foreground">{item.a}</p> : null}
												</details>
											))}
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个 FAQ 分组或问题。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "usp-pill-row") {
			const columns = section.columns === 2 ? 2 : section.columns === 4 ? 4 : 3;
			const gridClass =
				columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
			const items = [
				{ icon: section.item1Icon, label: section.item1Label },
				{ icon: section.item2Icon, label: section.item2Label },
				{ icon: section.item3Icon, label: section.item3Label },
				{ icon: section.item4Icon, label: section.item4Label },
				{ icon: section.item5Icon, label: section.item5Label },
				{ icon: section.item6Icon, label: section.item6Label },
			]
				.map((item) => ({ icon: item.icon?.trim() || "", label: item.label?.trim() || "" }))
				.filter((item) => item.icon || item.label);
			renderedSections.push(
				<section key={`usp-pill-row-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{items.length ? (
							<div className={`mt-4 grid grid-cols-1 gap-3 ${gridClass}`}>
								{items.map((item, itemIndex) => (
									<div
										key={`${item.label || "pill"}-${itemIndex}`}
										className="rounded-full border border-border bg-background px-4 py-2"
									>
										<p className="text-sm font-medium">
											{item.icon ? <span className="mr-2">{item.icon}</span> : null}
											{item.label || `卖点 ${itemIndex + 1}`}
										</p>
									</div>
								))}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个 USP 项。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "pricing-card-lite") {
			const columns = section.columns === 2 ? 2 : section.columns === 4 ? 4 : 3;
			const gridClass =
				columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
			const plans = [
				{
					name: section.plan1Name,
					price: section.plan1Price,
					feature: section.plan1Feature,
					ctaLabel: section.plan1CtaLabel,
					ctaHref: section.plan1CtaHref,
				},
				{
					name: section.plan2Name,
					price: section.plan2Price,
					feature: section.plan2Feature,
					ctaLabel: section.plan2CtaLabel,
					ctaHref: section.plan2CtaHref,
				},
				{
					name: section.plan3Name,
					price: section.plan3Price,
					feature: section.plan3Feature,
					ctaLabel: section.plan3CtaLabel,
					ctaHref: section.plan3CtaHref,
				},
				{
					name: section.plan4Name,
					price: section.plan4Price,
					feature: section.plan4Feature,
					ctaLabel: section.plan4CtaLabel,
					ctaHref: section.plan4CtaHref,
				},
			]
				.map((plan) => ({
					name: plan.name?.trim() || "",
					price: plan.price?.trim() || "",
					feature: plan.feature?.trim() || "",
					ctaLabel: plan.ctaLabel?.trim() || "",
					ctaHref: plan.ctaHref?.trim() ? normalizeCtaHref(channel, plan.ctaHref) : undefined,
				}))
				.filter((plan) => plan.name || plan.price || plan.feature || plan.ctaLabel || plan.ctaHref);
			renderedSections.push(
				<section key={`pricing-card-lite-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{plans.length ? (
							<div className={`mt-4 grid grid-cols-1 gap-3 ${gridClass}`}>
								{plans.map((plan, planIndex) => (
									<div
										key={`${plan.name || "plan"}-${planIndex}`}
										className="rounded-xl border border-border bg-background p-4"
									>
										<p className="font-semibold">{plan.name || `方案 ${planIndex + 1}`}</p>
										{plan.price ? <p className="mt-1 text-sm text-muted-foreground">{plan.price}</p> : null}
										{plan.feature ? (
											<p className="mt-2 text-xs text-muted-foreground">{plan.feature}</p>
										) : null}
										{plan.ctaLabel && plan.ctaHref ? (
											<a
												href={plan.ctaHref}
												className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
											>
												{plan.ctaLabel}
											</a>
										) : null}
									</div>
								))}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个方案卡片。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "brand-story-timeline") {
			const milestones = [
				{
					date: section.milestone1Date,
					title: section.milestone1Title,
					body: section.milestone1Body,
					imageUrl: section.milestone1ImageUrl,
				},
				{
					date: section.milestone2Date,
					title: section.milestone2Title,
					body: section.milestone2Body,
					imageUrl: section.milestone2ImageUrl,
				},
				{
					date: section.milestone3Date,
					title: section.milestone3Title,
					body: section.milestone3Body,
					imageUrl: section.milestone3ImageUrl,
				},
				{
					date: section.milestone4Date,
					title: section.milestone4Title,
					body: section.milestone4Body,
					imageUrl: section.milestone4ImageUrl,
				},
			]
				.map((item) => ({
					date: item.date?.trim() || "",
					title: item.title?.trim() || "",
					body: item.body?.trim() || "",
					imageUrl: item.imageUrl?.trim() || "",
				}))
				.filter((item) => item.date || item.title || item.body || item.imageUrl);
			renderedSections.push(
				<section key={`brand-story-timeline-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{milestones.length ? (
							<ol className="mt-4 space-y-3">
								{milestones.map((milestone, milestoneIndex) => (
									<li
										key={`${milestone.title || "milestone"}-${milestoneIndex}`}
										className="rounded-lg border border-border bg-background p-3"
									>
										<p className="text-xs text-muted-foreground">
											{milestone.date || `阶段 ${milestoneIndex + 1}`}
										</p>
										<p className="mt-1 font-medium">{milestone.title || `里程碑 ${milestoneIndex + 1}`}</p>
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
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "social-links-bar") {
			const columns = section.columns === 2 ? 2 : section.columns === 4 ? 4 : 3;
			const gridClass =
				columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
			const links = [
				{ label: section.link1Label, href: section.link1Href, icon: section.link1Icon },
				{ label: section.link2Label, href: section.link2Href, icon: section.link2Icon },
				{ label: section.link3Label, href: section.link3Href, icon: section.link3Icon },
				{ label: section.link4Label, href: section.link4Href, icon: section.link4Icon },
				{ label: section.link5Label, href: section.link5Href, icon: section.link5Icon },
				{ label: section.link6Label, href: section.link6Href, icon: section.link6Icon },
			]
				.map((link) => ({
					label: link.label?.trim() || "",
					href: link.href?.trim() ? normalizeActionHref(channel, link.href) : undefined,
					icon: link.icon?.trim() || "",
				}))
				.filter((link) => link.label || link.href || link.icon);
			renderedSections.push(
				<section key={`social-links-bar-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{links.length ? (
							<div className={`mt-4 grid grid-cols-1 gap-3 ${gridClass}`}>
								{links.map((link, linkIndex) =>
									link.href ? (
										<a
											key={`${link.label || "social"}-${linkIndex}`}
											href={link.href}
											className="hover:bg-muted/20 rounded-lg border border-border bg-background p-3"
										>
											<p className="font-medium">
												{link.icon ? <span className="mr-2">{link.icon}</span> : null}
												{link.label || `链接 ${linkIndex + 1}`}
											</p>
										</a>
									) : (
										<div
											key={`${link.label || "social"}-${linkIndex}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="font-medium">
												{link.icon ? <span className="mr-2">{link.icon}</span> : null}
												{link.label || `链接 ${linkIndex + 1}`}
											</p>
										</div>
									),
								)}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 条社媒/联系链接。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "feature-table-lite") {
			const columns = [section.col1Name, section.col2Name, section.col3Name, section.col4Name]
				.map((col) => col?.trim() || "")
				.filter(Boolean);
			const rows = [
				{
					label: section.row1Label,
					values: [section.row1Col1, section.row1Col2, section.row1Col3, section.row1Col4],
				},
				{
					label: section.row2Label,
					values: [section.row2Col1, section.row2Col2, section.row2Col3, section.row2Col4],
				},
				{
					label: section.row3Label,
					values: [section.row3Col1, section.row3Col2, section.row3Col3, section.row3Col4],
				},
				{
					label: section.row4Label,
					values: [section.row4Col1, section.row4Col2, section.row4Col3, section.row4Col4],
				},
			]
				.map((row) => ({
					label: row.label?.trim() || "",
					values: row.values.map((value) => value?.trim() || ""),
				}))
				.filter((row) => row.label || row.values.some(Boolean));
			renderedSections.push(
				<section key={`feature-table-lite-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{columns.length && rows.length ? (
							<div className="mt-4 overflow-x-auto">
								<table className="w-full border-collapse text-sm">
									<thead>
										<tr>
											<th className="bg-muted/40 border border-border px-3 py-2 text-left">特性</th>
											{columns.map((column, colIndex) => (
												<th
													key={`${column}-${colIndex}`}
													className="bg-muted/40 border border-border px-3 py-2 text-left"
												>
													{column}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{rows.map((row, rowIndex) => (
											<tr key={`${row.label || "row"}-${rowIndex}`}>
												<td className="border border-border px-3 py-2 font-medium">
													{row.label || `行 ${rowIndex + 1}`}
												</td>
												{columns.map((_, colIndex) => (
													<td
														key={`${row.label || "row"}-${rowIndex}-${colIndex}`}
														className="border border-border px-3 py-2"
													>
														{row.values[colIndex] || "-"}
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
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "team-intro-cards") {
			const columns = section.columns === 2 ? 2 : section.columns === 4 ? 4 : 3;
			const gridClass =
				columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
			const members = [
				{
					name: section.member1Name,
					role: section.member1Role,
					bio: section.member1Bio,
					imageUrl: section.member1ImageUrl,
					profileHref: section.member1ProfileHref,
				},
				{
					name: section.member2Name,
					role: section.member2Role,
					bio: section.member2Bio,
					imageUrl: section.member2ImageUrl,
					profileHref: section.member2ProfileHref,
				},
				{
					name: section.member3Name,
					role: section.member3Role,
					bio: section.member3Bio,
					imageUrl: section.member3ImageUrl,
					profileHref: section.member3ProfileHref,
				},
				{
					name: section.member4Name,
					role: section.member4Role,
					bio: section.member4Bio,
					imageUrl: section.member4ImageUrl,
					profileHref: section.member4ProfileHref,
				},
			]
				.map((member) => ({
					name: member.name?.trim() || "",
					role: member.role?.trim() || "",
					bio: member.bio?.trim() || "",
					imageUrl: member.imageUrl?.trim() || "",
					profileHref: member.profileHref?.trim()
						? normalizeActionHref(channel, member.profileHref)
						: undefined,
				}))
				.filter(
					(member) => member.name || member.role || member.bio || member.imageUrl || member.profileHref,
				);
			renderedSections.push(
				<section key={`team-intro-cards-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{members.length ? (
							<div className={`mt-4 grid grid-cols-1 gap-3 ${gridClass}`}>
								{members.map((member, memberIndex) => (
									<div
										key={`${member.name || "member"}-${memberIndex}`}
										className="rounded-lg border border-border bg-background p-3"
									>
										<p className="font-medium">{member.name || `成员 ${memberIndex + 1}`}</p>
										{member.role ? <p className="mt-1 text-xs text-muted-foreground">{member.role}</p> : null}
										{member.bio ? <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p> : null}
										{member.imageUrl ? (
											<p className="mt-2 text-xs text-muted-foreground">{member.imageUrl}</p>
										) : null}
										{member.profileHref ? (
											<a
												href={member.profileHref}
												className="mt-2 inline-flex text-sm font-medium text-primary hover:underline"
											>
												查看资料
											</a>
										) : null}
									</div>
								))}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 张团队成员卡片。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "logo-with-cta-strip") {
			const ctaHref = section.ctaHref?.trim() ? normalizeActionHref(channel, section.ctaHref) : undefined;
			const secondaryCtaHref = section.secondaryCtaHref?.trim()
				? normalizeActionHref(channel, section.secondaryCtaHref)
				: undefined;
			renderedSections.push(
				<section key={`logo-with-cta-strip-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 20 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-lg border border-border bg-background p-4 md:flex-row md:items-center">
							<div>
								<p className="text-sm font-medium">{section.logoText?.trim() || "品牌名称"}</p>
								{section.logoImageUrl?.trim() ? (
									<p className="mt-1 text-xs text-muted-foreground">{section.logoImageUrl}</p>
								) : null}
							</div>
							<div className="flex flex-wrap gap-2">
								{section.ctaLabel?.trim() && ctaHref ? (
									<a
										href={ctaHref}
										className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
									>
										{section.ctaLabel}
									</a>
								) : null}
								{section.secondaryCtaLabel?.trim() && secondaryCtaHref ? (
									<a
										href={secondaryCtaHref}
										className="hover:bg-muted/30 rounded-md border border-border px-3 py-1.5 text-xs font-medium"
									>
										{section.secondaryCtaLabel}
									</a>
								) : null}
							</div>
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "testimonial-marquee-lite") {
			const speedLabel = section.speed === "slow" ? "慢速" : section.speed === "fast" ? "快速" : "标准";
			const hoverLabel = section.pauseOnHover === "off" ? "关闭" : "开启";
			const items = [
				{ quote: section.item1Quote, author: section.item1Author },
				{ quote: section.item2Quote, author: section.item2Author },
				{ quote: section.item3Quote, author: section.item3Author },
				{ quote: section.item4Quote, author: section.item4Author },
				{ quote: section.item5Quote, author: section.item5Author },
				{ quote: section.item6Quote, author: section.item6Author },
			]
				.map((item) => ({ quote: item.quote?.trim() || "", author: item.author?.trim() || "" }))
				.filter((item) => item.quote || item.author);
			renderedSections.push(
				<section key={`testimonial-marquee-lite-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 20 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
							<span>滚动速度：{speedLabel}</span>
							<span>悬停暂停：{hoverLabel}</span>
						</div>
						{items.length ? (
							<div className="mt-4 flex flex-wrap gap-2">
								{items.map((item, itemIndex) => (
									<div
										key={`${item.quote || "quote"}-${itemIndex}`}
										className="rounded-full border border-border bg-background px-3 py-1.5 text-xs"
									>
										“{item.quote || `评价 ${itemIndex + 1}`}”
										{item.author ? <span className="ml-1 text-muted-foreground">— {item.author}</span> : null}
									</div>
								))}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 条评价内容。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "feature-icon-table") {
			const columns = [section.col1Name, section.col2Name, section.col3Name, section.col4Name]
				.map((col) => col?.trim() || "")
				.filter(Boolean);
			const rows = [
				{
					icon: section.row1Icon,
					label: section.row1Label,
					values: [section.row1Col1, section.row1Col2, section.row1Col3, section.row1Col4],
				},
				{
					icon: section.row2Icon,
					label: section.row2Label,
					values: [section.row2Col1, section.row2Col2, section.row2Col3, section.row2Col4],
				},
				{
					icon: section.row3Icon,
					label: section.row3Label,
					values: [section.row3Col1, section.row3Col2, section.row3Col3, section.row3Col4],
				},
				{
					icon: section.row4Icon,
					label: section.row4Label,
					values: [section.row4Col1, section.row4Col2, section.row4Col3, section.row4Col4],
				},
			]
				.map((row) => ({
					icon: row.icon?.trim() || "",
					label: row.label?.trim() || "",
					values: row.values.map((value) => value?.trim() || ""),
				}))
				.filter((row) => row.icon || row.label || row.values.some(Boolean));
			renderedSections.push(
				<section key={`feature-icon-table-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{columns.length && rows.length ? (
							<div className="mt-4 overflow-x-auto">
								<table className="w-full border-collapse text-sm">
									<thead>
										<tr>
											<th className="bg-muted/40 border border-border px-3 py-2 text-left">特性</th>
											{columns.map((column, colIndex) => (
												<th
													key={`${column}-${colIndex}`}
													className="bg-muted/40 border border-border px-3 py-2 text-left"
												>
													{column}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{rows.map((row, rowIndex) => (
											<tr key={`${row.label || "row"}-${rowIndex}`}>
												<td className="border border-border px-3 py-2 font-medium">
													{row.icon ? <span className="mr-1">{row.icon}</span> : null}
													{row.label || `行 ${rowIndex + 1}`}
												</td>
												{columns.map((_, colIndex) => (
													<td
														key={`${row.label || "row"}-${rowIndex}-${colIndex}`}
														className="border border-border px-3 py-2"
													>
														{row.values[colIndex] || "-"}
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
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "faq-two-column") {
			const helpHref = section.helpCtaHref?.trim()
				? normalizeActionHref(channel, section.helpCtaHref)
				: undefined;
			const faqs = [
				{ question: section.q1Question, answer: section.q1Answer },
				{ question: section.q2Question, answer: section.q2Answer },
				{ question: section.q3Question, answer: section.q3Answer },
				{ question: section.q4Question, answer: section.q4Answer },
			]
				.map((item) => ({ question: item.question?.trim() || "", answer: item.answer?.trim() || "" }))
				.filter((item) => item.question || item.answer);
			renderedSections.push(
				<section key={`faq-two-column-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
							<div className="space-y-3 md:col-span-2">
								{faqs.length ? (
									faqs.map((item, itemIndex) => (
										<div
											key={`${item.question || "faq"}-${itemIndex}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="text-sm font-medium">{item.question || `问题 ${itemIndex + 1}`}</p>
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
								<p className="text-sm font-semibold">{section.helpTitle?.trim() || "需要帮助？"}</p>
								{section.helpBody?.trim() ? (
									<p className="mt-2 text-sm text-muted-foreground">{section.helpBody}</p>
								) : null}
								{section.helpCtaLabel?.trim() && helpHref ? (
									<a
										href={helpHref}
										className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
									>
										{section.helpCtaLabel}
									</a>
								) : null}
							</div>
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "product-bundle-lite") {
			const href = section.ctaHref?.trim() ? normalizeActionHref(channel, section.ctaHref) : undefined;
			const items = (section.bundleItems || "")
				.split(/\r?\n|,/)
				.map((item) => item.trim())
				.filter(Boolean);
			renderedSections.push(
				<section key={`product-bundle-lite-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-4 rounded-xl border border-border bg-background p-4">
							<p className="text-sm font-semibold">{section.bundleName?.trim() || "套餐名称"}</p>
							{items.length ? (
								<ul className="mt-3 space-y-1 text-sm text-muted-foreground">
									{items.map((item, itemIndex) => (
										<li key={`${item}-${itemIndex}`}>• {item}</li>
									))}
								</ul>
							) : null}
							<div className="mt-3 flex items-center gap-2">
								{section.bundlePrice?.trim() ? (
									<span className="text-lg font-semibold">{section.bundlePrice}</span>
								) : null}
								{section.bundleCompareAt?.trim() ? (
									<span className="text-sm text-muted-foreground line-through">
										{section.bundleCompareAt}
									</span>
								) : null}
							</div>
							{section.ctaLabel?.trim() && href ? (
								<a
									href={href}
									className="mt-3 inline-flex rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
								>
									{section.ctaLabel}
								</a>
							) : null}
							{section.note?.trim() ? (
								<p className="mt-2 text-xs text-muted-foreground">{section.note}</p>
							) : null}
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "announcement-stack") {
			const levelMeta: Record<string, { label: string; className: string; icon: string }> = {
				info: { label: "信息", className: "bg-sky-100 text-sky-700", icon: "ℹ️" },
				success: { label: "成功", className: "bg-emerald-100 text-emerald-700", icon: "✅" },
				warning: { label: "警告", className: "bg-amber-100 text-amber-700", icon: "⚠️" },
				error: { label: "错误", className: "bg-rose-100 text-rose-700", icon: "⛔" },
			};
			const items = [
				{ level: section.item1Level || "info", title: section.item1Title, body: section.item1Body },
				{ level: section.item2Level || "info", title: section.item2Title, body: section.item2Body },
				{ level: section.item3Level || "info", title: section.item3Title, body: section.item3Body },
				{ level: section.item4Level || "info", title: section.item4Title, body: section.item4Body },
			]
				.map((item) => {
					const level =
						item.level === "success" || item.level === "warning" || item.level === "error"
							? item.level
							: "info";
					return { level, title: item.title?.trim() || "", body: item.body?.trim() || "" };
				})
				.filter((item) => item.title || item.body);
			renderedSections.push(
				<section key={`announcement-stack-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 20 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-4 space-y-2">
							{items.length ? (
								items.map((item, itemIndex) => {
									const meta = levelMeta[item.level];
									return (
										<div
											key={`${item.title || "notice"}-${itemIndex}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<div className="flex items-center gap-2">
												<span
													className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${meta.className}`}
												>
													{meta.icon} {meta.label}
												</span>
												<p className="text-sm font-medium">{item.title || `公告 ${itemIndex + 1}`}</p>
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
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "product-feature-tabs") {
			const href = section.ctaHref?.trim() ? normalizeActionHref(channel, section.ctaHref) : undefined;
			const tabs = [
				{ title: section.tab1Title, body: section.tab1Body },
				{ title: section.tab2Title, body: section.tab2Body },
				{ title: section.tab3Title, body: section.tab3Body },
				{ title: section.tab4Title, body: section.tab4Body },
			]
				.map((tab) => ({ title: tab.title?.trim() || "", body: tab.body?.trim() || "" }))
				.filter((tab) => tab.title || tab.body);
			renderedSections.push(
				<section key={`product-feature-tabs-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{tabs.length ? (
							<div className="mt-4 space-y-2">
								<div className="flex flex-wrap gap-2">
									{tabs.map((tab, tabIndex) => (
										<span
											key={`${tab.title || "tab"}-${tabIndex}`}
											className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium"
										>
											{tab.title || `标签 ${tabIndex + 1}`}
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
						{section.ctaLabel?.trim() && href ? (
							<a href={href} className="mt-3 inline-flex text-sm font-medium text-primary hover:underline">
								{section.ctaLabel}
							</a>
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "benefit-cards-grid") {
			const columns = section.columns === 2 ? 2 : section.columns === 4 ? 4 : 3;
			const gridClass =
				columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
			const cards = [
				{
					icon: section.card1Icon,
					title: section.card1Title,
					body: section.card1Body,
					ctaLabel: section.card1CtaLabel,
					ctaHref: section.card1CtaHref,
				},
				{
					icon: section.card2Icon,
					title: section.card2Title,
					body: section.card2Body,
					ctaLabel: section.card2CtaLabel,
					ctaHref: section.card2CtaHref,
				},
				{
					icon: section.card3Icon,
					title: section.card3Title,
					body: section.card3Body,
					ctaLabel: section.card3CtaLabel,
					ctaHref: section.card3CtaHref,
				},
				{
					icon: section.card4Icon,
					title: section.card4Title,
					body: section.card4Body,
					ctaLabel: section.card4CtaLabel,
					ctaHref: section.card4CtaHref,
				},
			]
				.map((card) => ({
					icon: card.icon?.trim() || "",
					title: card.title?.trim() || "",
					body: card.body?.trim() || "",
					ctaLabel: card.ctaLabel?.trim() || "",
					ctaHref: card.ctaHref?.trim() ? normalizeActionHref(channel, card.ctaHref) : undefined,
				}))
				.filter((card) => card.icon || card.title || card.body || card.ctaLabel || card.ctaHref);
			renderedSections.push(
				<section key={`benefit-cards-grid-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{cards.length ? (
							<div className={`mt-4 grid grid-cols-1 gap-3 ${gridClass}`}>
								{cards.map((card, cardIndex) => (
									<div
										key={`${card.title || "card"}-${cardIndex}`}
										className="rounded-lg border border-border bg-background p-3"
									>
										{card.icon ? <p className="text-lg">{card.icon}</p> : null}
										<p className="mt-1 font-medium">{card.title || `卡片 ${cardIndex + 1}`}</p>
										{card.body ? <p className="mt-2 text-sm text-muted-foreground">{card.body}</p> : null}
										{card.ctaLabel && card.ctaHref ? (
											<a
												href={card.ctaHref}
												className="mt-2 inline-flex text-xs font-medium text-primary hover:underline"
											>
												{card.ctaLabel}
											</a>
										) : null}
									</div>
								))}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 张利益点卡片。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "shipping-returns-panel") {
			const primaryHref = section.primaryCtaHref?.trim()
				? normalizeActionHref(channel, section.primaryCtaHref)
				: undefined;
			const secondaryHref = section.secondaryCtaHref?.trim()
				? normalizeActionHref(channel, section.secondaryCtaHref)
				: undefined;
			const panels = [
				{ title: section.shippingTitle, body: section.shippingBody },
				{ title: section.returnsTitle, body: section.returnsBody },
				{ title: section.paymentTitle, body: section.paymentBody },
				{ title: section.supportTitle, body: section.supportBody },
			]
				.map((panel) => ({ title: panel.title?.trim() || "", body: panel.body?.trim() || "" }))
				.filter((panel) => panel.title || panel.body);
			renderedSections.push(
				<section key={`shipping-returns-panel-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{panels.length ? (
							<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
								{panels.map((panel, panelIndex) => (
									<div
										key={`${panel.title || "panel"}-${panelIndex}`}
										className="rounded-lg border border-border bg-background p-3"
									>
										<p className="text-sm font-medium">{panel.title || `面板 ${panelIndex + 1}`}</p>
										{panel.body ? <p className="mt-2 text-sm text-muted-foreground">{panel.body}</p> : null}
									</div>
								))}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写发货或退换信息。</p>
						)}
						<div className="mt-3 flex flex-wrap gap-3">
							{section.primaryCtaLabel?.trim() && primaryHref ? (
								<a
									href={primaryHref}
									className="inline-flex rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
								>
									{section.primaryCtaLabel}
								</a>
							) : null}
							{section.secondaryCtaLabel?.trim() && secondaryHref ? (
								<a
									href={secondaryHref}
									className="hover:bg-muted/30 inline-flex rounded-md border border-border px-3 py-1.5 text-sm font-medium"
								>
									{section.secondaryCtaLabel}
								</a>
							) : null}
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "support-contact-split") {
			const primaryHref = section.primaryCtaHref?.trim()
				? normalizeActionHref(channel, section.primaryCtaHref)
				: undefined;
			const secondaryHref = section.secondaryCtaHref?.trim()
				? normalizeActionHref(channel, section.secondaryCtaHref)
				: undefined;
			const channels = [
				{ label: section.channel1Label, value: section.channel1Value, href: section.channel1Href },
				{ label: section.channel2Label, value: section.channel2Value, href: section.channel2Href },
				{ label: section.channel3Label, value: section.channel3Value, href: section.channel3Href },
			]
				.map((item) => ({
					label: item.label?.trim() || "",
					value: item.value?.trim() || "",
					href: item.href?.trim() ? normalizeActionHref(channel, item.href) : undefined,
				}))
				.filter((item) => item.label || item.value || item.href);
			renderedSections.push(
				<section key={`support-contact-split-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="rounded-lg border border-border bg-background p-4">
								<p className="text-sm font-semibold">{section.leftTitle?.trim() || "联系渠道"}</p>
								{section.leftBody?.trim() ? (
									<p className="mt-2 text-sm text-muted-foreground">{section.leftBody}</p>
								) : null}
								{channels.length ? (
									<div className="mt-3 space-y-2">
										{channels.map((item, itemIndex) => (
											<div
												key={`${item.label || "channel"}-${itemIndex}`}
												className="rounded-md border border-border px-3 py-2"
											>
												<p className="text-xs font-medium">{item.label || `渠道 ${itemIndex + 1}`}</p>
												{item.value ? (
													<p className="mt-1 text-xs text-muted-foreground">{item.value}</p>
												) : null}
												{item.href ? (
													<a
														href={item.href}
														className="mt-1 inline-flex text-xs font-medium text-primary hover:underline"
													>
														{item.href}
													</a>
												) : null}
											</div>
										))}
									</div>
								) : null}
							</div>
							<div className="rounded-lg border border-border bg-background p-4">
								<div className="flex items-center gap-2">
									<p className="text-sm font-semibold">{section.slaTitle?.trim() || "服务承诺"}</p>
									{section.slaBadge?.trim() ? (
										<span className="bg-primary/10 rounded-full px-2 py-0.5 text-[11px] font-medium text-primary">
											{section.slaBadge}
										</span>
									) : null}
								</div>
								{section.slaBody?.trim() ? (
									<p className="mt-2 text-sm text-muted-foreground">{section.slaBody}</p>
								) : null}
								<div className="mt-3 flex flex-wrap gap-3">
									{section.primaryCtaLabel?.trim() && primaryHref ? (
										<a
											href={primaryHref}
											className="inline-flex rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
										>
											{section.primaryCtaLabel}
										</a>
									) : null}
									{section.secondaryCtaLabel?.trim() && secondaryHref ? (
										<a
											href={secondaryHref}
											className="hover:bg-muted/30 inline-flex rounded-md border border-border px-3 py-1.5 text-sm font-medium"
										>
											{section.secondaryCtaLabel}
										</a>
									) : null}
								</div>
							</div>
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "faq-category-pills") {
			const helpHref = section.helpCtaHref?.trim()
				? normalizeActionHref(channel, section.helpCtaHref)
				: undefined;
			const categories = [
				{
					key: "category1",
					name: section.category1Name,
					qa: [
						{ q: section.category1Q1, a: section.category1A1 },
						{ q: section.category1Q2, a: section.category1A2 },
					],
				},
				{
					key: "category2",
					name: section.category2Name,
					qa: [
						{ q: section.category2Q1, a: section.category2A1 },
						{ q: section.category2Q2, a: section.category2A2 },
					],
				},
				{
					key: "category3",
					name: section.category3Name,
					qa: [
						{ q: section.category3Q1, a: section.category3A1 },
						{ q: section.category3Q2, a: section.category3A2 },
					],
				},
			]
				.map((item) => ({
					key: item.key,
					name: item.name?.trim() || "",
					qa: item.qa
						.map((qa) => ({ q: qa.q?.trim() || "", a: qa.a?.trim() || "" }))
						.filter((qa) => qa.q || qa.a),
				}))
				.filter((item) => item.name || item.qa.length);
			const defaultCategory =
				section.defaultCategory === "category2" || section.defaultCategory === "category3"
					? section.defaultCategory
					: "category1";
			const activeCategory = categories.find((item) => item.key === defaultCategory) || categories[0];
			renderedSections.push(
				<section key={`faq-category-pills-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{categories.length ? (
							<>
								<div className="mt-4 flex flex-wrap gap-2">
									{categories.map((item, itemIndex) => (
										<span
											key={`${item.name || "category"}-${itemIndex}`}
											className={`rounded-full border px-3 py-1 text-xs font-medium ${
												item.key === (activeCategory?.key || "")
													? "border-primary text-primary"
													: "border-border"
											}`}
										>
											{item.name || `分类 ${itemIndex + 1}`}
										</span>
									))}
								</div>
								<div className="mt-3 space-y-2">
									{(activeCategory?.qa || []).map((qa, qaIndex) => (
										<div
											key={`${qa.q || "qa"}-${qaIndex}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="text-sm font-medium">{qa.q || `问题 ${qaIndex + 1}`}</p>
											{qa.a ? <p className="mt-2 text-sm text-muted-foreground">{qa.a}</p> : null}
										</div>
									))}
								</div>
							</>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 个 FAQ 分类。</p>
						)}
						{section.helpCtaLabel?.trim() && helpHref ? (
							<a
								href={helpHref}
								className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
							>
								{section.helpCtaLabel}
							</a>
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "promo-tile-mosaic") {
			const tiles = [
				{
					badge: section.tile1Badge,
					title: section.tile1Title,
					body: section.tile1Body,
					ctaLabel: section.tile1CtaLabel,
					ctaHref: section.tile1CtaHref,
				},
				{
					badge: section.tile2Badge,
					title: section.tile2Title,
					body: section.tile2Body,
					ctaLabel: section.tile2CtaLabel,
					ctaHref: section.tile2CtaHref,
				},
				{
					badge: section.tile3Badge,
					title: section.tile3Title,
					body: section.tile3Body,
					ctaLabel: section.tile3CtaLabel,
					ctaHref: section.tile3CtaHref,
				},
				{
					badge: section.tile4Badge,
					title: section.tile4Title,
					body: section.tile4Body,
					ctaLabel: section.tile4CtaLabel,
					ctaHref: section.tile4CtaHref,
				},
			]
				.map((tile) => ({
					badge: tile.badge?.trim() || "",
					title: tile.title?.trim() || "",
					body: tile.body?.trim() || "",
					ctaLabel: tile.ctaLabel?.trim() || "",
					ctaHref: tile.ctaHref?.trim() ? normalizeActionHref(channel, tile.ctaHref) : undefined,
				}))
				.filter((tile) => tile.badge || tile.title || tile.body || tile.ctaLabel || tile.ctaHref);
			renderedSections.push(
				<section key={`promo-tile-mosaic-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						{tiles.length ? (
							<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
								{tiles.map((tile, tileIndex) => (
									<div
										key={`${tile.title || "tile"}-${tileIndex}`}
										className="rounded-lg border border-border bg-background p-4"
									>
										{tile.badge ? (
											<span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
												{tile.badge}
											</span>
										) : null}
										<p className="mt-2 text-sm font-medium">{tile.title || `促销 ${tileIndex + 1}`}</p>
										{tile.body ? <p className="mt-2 text-sm text-muted-foreground">{tile.body}</p> : null}
										{tile.ctaLabel && tile.ctaHref ? (
											<a
												href={tile.ctaHref}
												className="mt-2 inline-flex text-xs font-medium text-primary hover:underline"
											>
												{tile.ctaLabel}
											</a>
										) : null}
									</div>
								))}
							</div>
						) : (
							<p className="mt-4 text-sm text-muted-foreground">请至少填写 1 张促销卡片。</p>
						)}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "bundle-price-breakdown") {
			const ctaHref = section.ctaHref?.trim() ? normalizeActionHref(channel, section.ctaHref) : undefined;
			const items = [
				{ label: section.item1Label, price: section.item1Price },
				{ label: section.item2Label, price: section.item2Price },
				{ label: section.item3Label, price: section.item3Price },
			]
				.map((item) => ({ label: item.label?.trim() || "", price: item.price?.trim() || "" }))
				.filter((item) => item.label || item.price);
			renderedSections.push(
				<section key={`bundle-price-breakdown-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-4 rounded-lg border border-border bg-background p-4">
							<p className="text-sm font-semibold">{section.planName?.trim() || "套餐名称"}</p>
							{items.length ? (
								<div className="mt-3 space-y-2">
									{items.map((item, itemIndex) => (
										<div
											key={`${item.label || "item"}-${itemIndex}`}
											className="flex items-center justify-between text-sm"
										>
											<span>{item.label || `条目 ${itemIndex + 1}`}</span>
											<span className="font-medium">{item.price || "-"}</span>
										</div>
									))}
								</div>
							) : (
								<p className="mt-3 text-sm text-muted-foreground">请至少填写 1 个价格条目。</p>
							)}
							<div className="mt-3 flex flex-wrap items-center gap-3">
								{section.totalLabel?.trim() ? <span className="text-sm">{section.totalLabel}</span> : null}
								{section.totalPrice?.trim() ? (
									<span className="text-lg font-semibold">{section.totalPrice}</span>
								) : null}
								{section.saveLabel?.trim() || section.saveValue?.trim() ? (
									<span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
										{section.saveLabel?.trim() || "节省"} {section.saveValue?.trim() || ""}
									</span>
								) : null}
							</div>
							{section.ctaLabel?.trim() && ctaHref ? (
								<a
									href={ctaHref}
									className="mt-2 inline-flex text-xs font-medium text-primary hover:underline"
								>
									{section.ctaLabel}
								</a>
							) : null}
							{section.note?.trim() ? (
								<p className="mt-2 text-xs text-muted-foreground">{section.note}</p>
							) : null}
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "store-hours-status") {
			const primaryHref = section.primaryCtaHref?.trim()
				? normalizeActionHref(channel, section.primaryCtaHref)
				: undefined;
			const secondaryHref = section.secondaryCtaHref?.trim()
				? normalizeActionHref(channel, section.secondaryCtaHref)
				: undefined;
			const statusMode =
				section.statusMode === "closed" || section.statusMode === "notice" ? section.statusMode : "open";
			const statusMeta =
				statusMode === "closed"
					? { text: "已打烊", className: "bg-slate-100 text-slate-700" }
					: statusMode === "notice"
						? { text: "公告", className: "bg-amber-100 text-amber-700" }
						: { text: "营业中", className: "bg-emerald-100 text-emerald-700" };
			renderedSections.push(
				<section key={`store-hours-status-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-4 rounded-lg border border-border bg-background p-4">
							<div className="flex flex-wrap items-center gap-2">
								<span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusMeta.className}`}>
									{statusMeta.text}
								</span>
								{section.statusText?.trim() ? (
									<span className="text-sm font-medium">{section.statusText}</span>
								) : null}
								{section.timezoneLabel?.trim() ? (
									<span className="text-xs text-muted-foreground">({section.timezoneLabel})</span>
								) : null}
							</div>
							<div className="mt-3 space-y-1 text-sm text-muted-foreground">
								{section.weekdayHours?.trim() ? <p>工作日：{section.weekdayHours}</p> : null}
								{section.weekendHours?.trim() ? <p>周末：{section.weekendHours}</p> : null}
								{section.holidayHours?.trim() ? <p>节假日：{section.holidayHours}</p> : null}
							</div>
							{section.noticeText?.trim() ? (
								<p className="mt-2 text-sm text-muted-foreground">{section.noticeText}</p>
							) : null}
							<div className="mt-3 flex flex-wrap gap-3">
								{section.primaryCtaLabel?.trim() && primaryHref ? (
									<a
										href={primaryHref}
										className="inline-flex rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
									>
										{section.primaryCtaLabel}
									</a>
								) : null}
								{section.secondaryCtaLabel?.trim() && secondaryHref ? (
									<a
										href={secondaryHref}
										className="hover:bg-muted/30 inline-flex rounded-md border border-border px-3 py-1.5 text-sm font-medium"
									>
										{section.secondaryCtaLabel}
									</a>
								) : null}
							</div>
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "trust-faq-strip") {
			const ctaHref = section.ctaHref?.trim() ? normalizeActionHref(channel, section.ctaHref) : undefined;
			const trusts = [
				{ icon: section.trust1Icon, label: section.trust1Label },
				{ icon: section.trust2Icon, label: section.trust2Label },
				{ icon: section.trust3Icon, label: section.trust3Label },
			]
				.map((item) => ({ icon: item.icon?.trim() || "", label: item.label?.trim() || "" }))
				.filter((item) => item.icon || item.label);
			const faqs = [
				{ q: section.faq1Q, a: section.faq1A },
				{ q: section.faq2Q, a: section.faq2A },
				{ q: section.faq3Q, a: section.faq3A },
			]
				.map((item) => ({ q: item.q?.trim() || "", a: item.a?.trim() || "" }))
				.filter((item) => item.q || item.a);
			renderedSections.push(
				<section key={`trust-faq-strip-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
							<div className="space-y-2">
								{trusts.length ? (
									trusts.map((item, itemIndex) => (
										<div
											key={`${item.label || "trust"}-${itemIndex}`}
											className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
										>
											{item.icon ? <span className="mr-1">{item.icon}</span> : null}
											{item.label || `保障 ${itemIndex + 1}`}
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
									faqs.map((item, itemIndex) => (
										<div
											key={`${item.q || "faq"}-${itemIndex}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="text-sm font-medium">{item.q || `问题 ${itemIndex + 1}`}</p>
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
						{section.ctaLabel?.trim() && ctaHref ? (
							<a href={ctaHref} className="mt-3 inline-flex text-sm font-medium text-primary hover:underline">
								{section.ctaLabel}
							</a>
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "usp-metrics-split") {
			const ctaHref = section.ctaHref?.trim() ? normalizeActionHref(channel, section.ctaHref) : undefined;
			const usps = [
				{ title: section.usp1Title, body: section.usp1Body },
				{ title: section.usp2Title, body: section.usp2Body },
				{ title: section.usp3Title, body: section.usp3Body },
			]
				.map((item) => ({ title: item.title?.trim() || "", body: item.body?.trim() || "" }))
				.filter((item) => item.title || item.body);
			const metrics = [
				{ label: section.metric1Label, value: section.metric1Value, note: section.metric1Note },
				{ label: section.metric2Label, value: section.metric2Value, note: section.metric2Note },
				{ label: section.metric3Label, value: section.metric3Value, note: section.metric3Note },
			]
				.map((item) => ({
					label: item.label?.trim() || "",
					value: item.value?.trim() || "",
					note: item.note?.trim() || "",
				}))
				.filter((item) => item.label || item.value || item.note);
			renderedSections.push(
				<section key={`usp-metrics-split-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="space-y-2">
								{usps.length ? (
									usps.map((item, itemIndex) => (
										<div
											key={`${item.title || "usp"}-${itemIndex}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="text-sm font-medium">{item.title || `卖点 ${itemIndex + 1}`}</p>
											{item.body ? <p className="mt-1 text-sm text-muted-foreground">{item.body}</p> : null}
										</div>
									))
								) : (
									<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
										请至少填写 1 个卖点。
									</p>
								)}
							</div>
							<div className="space-y-2">
								{metrics.length ? (
									metrics.map((item, itemIndex) => (
										<div
											key={`${item.label || "metric"}-${itemIndex}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="text-xs text-muted-foreground">{item.label || `指标 ${itemIndex + 1}`}</p>
											{item.value ? <p className="text-lg font-semibold">{item.value}</p> : null}
											{item.note ? <p className="text-xs text-muted-foreground">{item.note}</p> : null}
										</div>
									))
								) : (
									<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
										请至少填写 1 个指标。
									</p>
								)}
							</div>
						</div>
						{section.ctaLabel?.trim() && ctaHref ? (
							<a href={ctaHref} className="mt-3 inline-flex text-sm font-medium text-primary hover:underline">
								{section.ctaLabel}
							</a>
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "category-promo-rail") {
			const categories = [
				{ name: section.category1Name, href: section.category1Href },
				{ name: section.category2Name, href: section.category2Href },
				{ name: section.category3Name, href: section.category3Href },
			]
				.map((item) => ({
					name: item.name?.trim() || "",
					href: item.href?.trim() ? normalizeActionHref(channel, item.href) : undefined,
				}))
				.filter((item) => item.name || item.href);
			const promos = [
				{
					badge: section.promo1Badge,
					title: section.promo1Title,
					body: section.promo1Body,
					ctaLabel: section.promo1CtaLabel,
					ctaHref: section.promo1CtaHref,
				},
				{
					badge: section.promo2Badge,
					title: section.promo2Title,
					body: section.promo2Body,
					ctaLabel: section.promo2CtaLabel,
					ctaHref: section.promo2CtaHref,
				},
			]
				.map((item) => ({
					badge: item.badge?.trim() || "",
					title: item.title?.trim() || "",
					body: item.body?.trim() || "",
					ctaLabel: item.ctaLabel?.trim() || "",
					ctaHref: item.ctaHref?.trim() ? normalizeActionHref(channel, item.ctaHref) : undefined,
				}))
				.filter((item) => item.badge || item.title || item.body || item.ctaLabel || item.ctaHref);
			renderedSections.push(
				<section key={`category-promo-rail-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
							<div className="space-y-2">
								{categories.length ? (
									categories.map((item, itemIndex) => (
										<div
											key={`${item.name || "category"}-${itemIndex}`}
											className="rounded-lg border border-border bg-background px-3 py-2"
										>
											<p className="text-sm font-medium">{item.name || `分类 ${itemIndex + 1}`}</p>
											{item.href ? (
												<a href={item.href} className="mt-1 inline-flex text-xs text-primary hover:underline">
													{item.href}
												</a>
											) : null}
										</div>
									))
								) : (
									<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
										请至少填写 1 个分类入口。
									</p>
								)}
							</div>
							<div className="space-y-2 md:col-span-2">
								{promos.length ? (
									promos.map((item, itemIndex) => (
										<div
											key={`${item.title || "promo"}-${itemIndex}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											{item.badge ? (
												<span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
													{item.badge}
												</span>
											) : null}
											<p className="mt-2 text-sm font-medium">{item.title || `促销 ${itemIndex + 1}`}</p>
											{item.body ? <p className="mt-1 text-sm text-muted-foreground">{item.body}</p> : null}
											{item.ctaLabel && item.ctaHref ? (
												<a
													href={item.ctaHref}
													className="mt-2 inline-flex text-xs font-medium text-primary hover:underline"
												>
													{item.ctaLabel}
												</a>
											) : null}
										</div>
									))
								) : (
									<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
										请至少填写 1 个促销卡片。
									</p>
								)}
							</div>
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "helpdesk-quick-faq") {
			const primaryHref = section.primaryCtaHref?.trim()
				? normalizeActionHref(channel, section.primaryCtaHref)
				: undefined;
			const secondaryHref = section.secondaryCtaHref?.trim()
				? normalizeActionHref(channel, section.secondaryCtaHref)
				: undefined;
			const faqs = [
				{ q: section.faq1Q, a: section.faq1A },
				{ q: section.faq2Q, a: section.faq2A },
				{ q: section.faq3Q, a: section.faq3A },
			]
				.map((item) => ({ q: item.q?.trim() || "", a: item.a?.trim() || "" }))
				.filter((item) => item.q || item.a);
			const channels = [
				{ label: section.channel1Label, value: section.channel1Value, href: section.channel1Href },
				{ label: section.channel2Label, value: section.channel2Value, href: section.channel2Href },
			]
				.map((item) => ({
					label: item.label?.trim() || "",
					value: item.value?.trim() || "",
					href: item.href?.trim() ? normalizeActionHref(channel, item.href) : undefined,
				}))
				.filter((item) => item.label || item.value || item.href);
			renderedSections.push(
				<section key={`helpdesk-quick-faq-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="space-y-2">
								{faqs.length ? (
									faqs.map((item, itemIndex) => (
										<div
											key={`${item.q || "faq"}-${itemIndex}`}
											className="rounded-lg border border-border bg-background p-3"
										>
											<p className="text-sm font-medium">{item.q || `问题 ${itemIndex + 1}`}</p>
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
									? channels.map((item, itemIndex) => (
											<div
												key={`${item.label || "channel"}-${itemIndex}`}
												className="rounded-lg border border-border bg-background p-3"
											>
												<p className="text-sm font-medium">{item.label || `渠道 ${itemIndex + 1}`}</p>
												{item.value ? (
													<p className="mt-1 text-sm text-muted-foreground">{item.value}</p>
												) : null}
												{item.href ? (
													<a
														href={item.href}
														className="mt-1 inline-flex text-xs text-primary hover:underline"
													>
														{item.href}
													</a>
												) : null}
											</div>
										))
									: null}
								<div className="flex flex-wrap gap-3">
									{section.primaryCtaLabel?.trim() && primaryHref ? (
										<a
											href={primaryHref}
											className="inline-flex rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
										>
											{section.primaryCtaLabel}
										</a>
									) : null}
									{section.secondaryCtaLabel?.trim() && secondaryHref ? (
										<a
											href={secondaryHref}
											className="hover:bg-muted/30 inline-flex rounded-md border border-border px-3 py-1.5 text-sm font-medium"
										>
											{section.secondaryCtaLabel}
										</a>
									) : null}
								</div>
							</div>
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "sticky-announcement-queue") {
			const announcements = [
				{
					text: section.announce1Text,
					level: section.announce1Level,
					href: section.announce1Href,
				},
				{
					text: section.announce2Text,
					level: section.announce2Level,
					href: section.announce2Href,
				},
				{
					text: section.announce3Text,
					level: section.announce3Level,
					href: section.announce3Href,
				},
			]
				.map((item) => ({
					text: item.text?.trim() || "",
					level: (item.level === "success" || item.level === "warning" ? item.level : "info") as
						| "info"
						| "success"
						| "warning",
					href: item.href?.trim() ? normalizeActionHref(channel, item.href) : undefined,
				}))
				.filter((item) => item.text || item.href);
			const autoRotateSeconds =
				section.autoRotateSeconds && section.autoRotateSeconds > 0 ? section.autoRotateSeconds : 5;
			const levelClass = (level: "info" | "success" | "warning") =>
				level === "success"
					? "bg-emerald-100 text-emerald-700"
					: level === "warning"
						? "bg-amber-100 text-amber-700"
						: "bg-slate-100 text-slate-700";
			renderedSections.push(
				<section key={`sticky-announcement-queue-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 18 })}
					>
						{section.heading?.trim() ? (
							<h2 className="text-xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						<p className="mt-1 text-xs text-muted-foreground">
							轮播间隔：{autoRotateSeconds}s（当前以列表展示）
						</p>
						<div className="mt-3 space-y-2">
							{announcements.length ? (
								announcements.map((item, itemIndex) => (
									<div
										key={`${item.text || "announcement"}-${itemIndex}`}
										className="rounded-lg border border-border bg-background px-3 py-2"
									>
										<span
											className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${levelClass(item.level)}`}
										>
											{item.level === "success" ? "成功" : item.level === "warning" ? "提醒" : "信息"}
										</span>
										<p className="mt-1 text-sm">{item.text || `公告 ${itemIndex + 1}`}</p>
										{item.href ? (
											<a href={item.href} className="mt-1 inline-flex text-xs text-primary hover:underline">
												{item.href}
											</a>
										) : null}
									</div>
								))
							) : (
								<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
									请至少填写 1 条公告。
								</p>
							)}
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "tiered-pricing-table") {
			const highlightTier =
				section.highlightTier === "tier1" || section.highlightTier === "tier3"
					? section.highlightTier
					: "tier2";
			const tiers = [
				{
					key: "tier1",
					name: section.tier1Name,
					price: section.tier1Price,
					features: section.tier1Features,
					ctaLabel: section.tier1CtaLabel,
					ctaHref: section.tier1CtaHref,
				},
				{
					key: "tier2",
					name: section.tier2Name,
					price: section.tier2Price,
					features: section.tier2Features,
					ctaLabel: section.tier2CtaLabel,
					ctaHref: section.tier2CtaHref,
				},
				{
					key: "tier3",
					name: section.tier3Name,
					price: section.tier3Price,
					features: section.tier3Features,
					ctaLabel: section.tier3CtaLabel,
					ctaHref: section.tier3CtaHref,
				},
			]
				.map((item) => ({
					key: item.key,
					name: item.name?.trim() || "",
					price: item.price?.trim() || "",
					features: item.features?.trim() || "",
					ctaLabel: item.ctaLabel?.trim() || "",
					ctaHref: item.ctaHref?.trim() ? normalizeActionHref(channel, item.ctaHref) : undefined,
				}))
				.filter((item) => item.name || item.price || item.features || item.ctaLabel || item.ctaHref);
			renderedSections.push(
				<section key={`tiered-pricing-table-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading?.trim() ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle?.trim() ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
							{tiers.length ? (
								tiers.map((tier, tierIndex) => (
									<div
										key={`${tier.key}-${tierIndex}`}
										className={`rounded-lg border p-3 ${
											tier.key === highlightTier
												? "bg-primary/5 border-primary"
												: "border-border bg-background"
										}`}
									>
										<p className="text-sm font-semibold">{tier.name || `方案 ${tierIndex + 1}`}</p>
										{tier.price ? <p className="mt-1 text-lg font-semibold">{tier.price}</p> : null}
										{tier.features ? (
											<p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
												{tier.features}
											</p>
										) : null}
										{tier.ctaLabel && tier.ctaHref ? (
											<a
												href={tier.ctaHref}
												className="mt-2 inline-flex text-xs font-medium text-primary hover:underline"
											>
												{tier.ctaLabel}
											</a>
										) : null}
									</div>
								))
							) : (
								<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
									请至少填写 1 个方案。
								</p>
							)}
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "service-process-steps") {
			const primaryHref = section.primaryCtaHref?.trim()
				? normalizeActionHref(channel, section.primaryCtaHref)
				: undefined;
			const secondaryHref = section.secondaryCtaHref?.trim()
				? normalizeActionHref(channel, section.secondaryCtaHref)
				: undefined;
			const steps = [
				{ title: section.step1Title, body: section.step1Body },
				{ title: section.step2Title, body: section.step2Body },
				{ title: section.step3Title, body: section.step3Body },
				{ title: section.step4Title, body: section.step4Body },
			]
				.map((item) => ({ title: item.title?.trim() || "", body: item.body?.trim() || "" }))
				.filter((item) => item.title || item.body);
			renderedSections.push(
				<section key={`service-process-steps-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading?.trim() ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle?.trim() ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
							{steps.length ? (
								steps.map((step, stepIndex) => (
									<div
										key={`${step.title || "step"}-${stepIndex}`}
										className="rounded-lg border border-border bg-background p-3"
									>
										<p className="text-xs text-muted-foreground">步骤 {stepIndex + 1}</p>
										<p className="text-sm font-medium">{step.title || `步骤 ${stepIndex + 1}`}</p>
										{step.body ? <p className="mt-1 text-sm text-muted-foreground">{step.body}</p> : null}
									</div>
								))
							) : (
								<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
									请至少填写 1 个步骤。
								</p>
							)}
						</div>
						{section.note?.trim() ? (
							<p className="mt-2 text-xs text-muted-foreground">{section.note}</p>
						) : null}
						<div className="mt-3 flex flex-wrap gap-3">
							{section.primaryCtaLabel?.trim() && primaryHref ? (
								<a
									href={primaryHref}
									className="inline-flex rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
								>
									{section.primaryCtaLabel}
								</a>
							) : null}
							{section.secondaryCtaLabel?.trim() && secondaryHref ? (
								<a
									href={secondaryHref}
									className="hover:bg-muted/30 inline-flex rounded-md border border-border px-3 py-1.5 text-sm font-medium"
								>
									{section.secondaryCtaLabel}
								</a>
							) : null}
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "inventory-availability-matrix") {
			const ctaHref = section.ctaHref?.trim() ? normalizeActionHref(channel, section.ctaHref) : undefined;
			const items = [
				{ name: section.item1Name, stock: section.item1Stock, eta: section.item1Eta },
				{ name: section.item2Name, stock: section.item2Stock, eta: section.item2Eta },
				{ name: section.item3Name, stock: section.item3Stock, eta: section.item3Eta },
			]
				.map((item) => ({
					name: item.name?.trim() || "",
					stock: item.stock?.trim() || "",
					eta: item.eta?.trim() || "",
				}))
				.filter((item) => item.name || item.stock || item.eta);
			renderedSections.push(
				<section key={`inventory-availability-matrix-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading?.trim() ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle?.trim() ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-4 overflow-hidden rounded-lg border border-border">
							<div className="bg-muted/30 grid grid-cols-3 px-3 py-2 text-xs font-medium text-muted-foreground">
								<span>SKU</span>
								<span>库存状态</span>
								<span>到货/发货</span>
							</div>
							{items.length ? (
								items.map((item, itemIndex) => (
									<div
										key={`${item.name || "item"}-${itemIndex}`}
										className="grid grid-cols-3 border-t border-border bg-background px-3 py-2 text-sm"
									>
										<span>{item.name || `条目 ${itemIndex + 1}`}</span>
										<span>{item.stock || "-"}</span>
										<span>{item.eta || "-"}</span>
									</div>
								))
							) : (
								<p className="border-t border-border bg-background px-3 py-3 text-sm text-muted-foreground">
									请至少填写 1 个库存条目。
								</p>
							)}
						</div>
						{section.warehouseNote?.trim() ? (
							<p className="mt-2 text-xs text-muted-foreground">{section.warehouseNote}</p>
						) : null}
						{section.ctaLabel?.trim() && ctaHref ? (
							<a href={ctaHref} className="mt-2 inline-flex text-sm font-medium text-primary hover:underline">
								{section.ctaLabel}
							</a>
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "cross-border-shipping-notice") {
			const primaryHref = section.primaryCtaHref?.trim()
				? normalizeActionHref(channel, section.primaryCtaHref)
				: undefined;
			const secondaryHref = section.secondaryCtaHref?.trim()
				? normalizeActionHref(channel, section.secondaryCtaHref)
				: undefined;
			const regions = [
				{ name: section.region1Name, eta: section.region1Eta, duty: section.region1Duty },
				{ name: section.region2Name, eta: section.region2Eta, duty: section.region2Duty },
				{ name: section.region3Name, eta: section.region3Eta, duty: section.region3Duty },
			]
				.map((item) => ({
					name: item.name?.trim() || "",
					eta: item.eta?.trim() || "",
					duty: item.duty?.trim() || "",
				}))
				.filter((item) => item.name || item.eta || item.duty);
			renderedSections.push(
				<section key={`cross-border-shipping-notice-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading?.trim() ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle?.trim() ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
							{regions.length ? (
								regions.map((region, regionIndex) => (
									<div
										key={`${region.name || "region"}-${regionIndex}`}
										className="rounded-lg border border-border bg-background p-3"
									>
										<p className="text-sm font-semibold">{region.name || `区域 ${regionIndex + 1}`}</p>
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
						{section.policyNote?.trim() ? (
							<p className="mt-2 text-xs text-muted-foreground">{section.policyNote}</p>
						) : null}
						<div className="mt-3 flex flex-wrap gap-3">
							{section.primaryCtaLabel?.trim() && primaryHref ? (
								<a
									href={primaryHref}
									className="inline-flex rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
								>
									{section.primaryCtaLabel}
								</a>
							) : null}
							{section.secondaryCtaLabel?.trim() && secondaryHref ? (
								<a
									href={secondaryHref}
									className="hover:bg-muted/30 inline-flex rounded-md border border-border px-3 py-1.5 text-sm font-medium"
								>
									{section.secondaryCtaLabel}
								</a>
							) : null}
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "returns-policy-quick-cards") {
			const ctaHref = section.ctaHref?.trim() ? normalizeActionHref(channel, section.ctaHref) : undefined;
			const cards = [
				{ title: section.card1Title, body: section.card1Body, limit: section.card1Limit },
				{ title: section.card2Title, body: section.card2Body, limit: section.card2Limit },
				{ title: section.card3Title, body: section.card3Body, limit: section.card3Limit },
			]
				.map((item) => ({
					title: item.title?.trim() || "",
					body: item.body?.trim() || "",
					limit: item.limit?.trim() || "",
				}))
				.filter((item) => item.title || item.body || item.limit);
			renderedSections.push(
				<section key={`returns-policy-quick-cards-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading?.trim() ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle?.trim() ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
							{cards.length ? (
								cards.map((card, cardIndex) => (
									<div
										key={`${card.title || "card"}-${cardIndex}`}
										className="rounded-lg border border-border bg-background p-3"
									>
										<p className="text-sm font-medium">{card.title || `政策 ${cardIndex + 1}`}</p>
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
						{section.ctaLabel?.trim() && ctaHref ? (
							<a href={ctaHref} className="mt-2 inline-flex text-sm font-medium text-primary hover:underline">
								{section.ctaLabel}
							</a>
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "compliance-certificates-grid") {
			const ctaHref = section.ctaHref?.trim() ? normalizeActionHref(channel, section.ctaHref) : undefined;
			const certs = [
				{ title: section.cert1Title, code: section.cert1Code, issuer: section.cert1Issuer },
				{ title: section.cert2Title, code: section.cert2Code, issuer: section.cert2Issuer },
				{ title: section.cert3Title, code: section.cert3Code, issuer: section.cert3Issuer },
				{ title: section.cert4Title, code: section.cert4Code, issuer: section.cert4Issuer },
			]
				.map((item) => ({
					title: item.title?.trim() || "",
					code: item.code?.trim() || "",
					issuer: item.issuer?.trim() || "",
				}))
				.filter((item) => item.title || item.code || item.issuer);
			renderedSections.push(
				<section key={`compliance-certificates-grid-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading?.trim() ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle?.trim() ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
							{certs.length ? (
								certs.map((cert, certIndex) => (
									<div
										key={`${cert.title || "cert"}-${certIndex}`}
										className="rounded-lg border border-border bg-background p-3"
									>
										<p className="text-sm font-semibold">{cert.title || `证书 ${certIndex + 1}`}</p>
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
						{section.note?.trim() ? (
							<p className="mt-2 text-xs text-muted-foreground">{section.note}</p>
						) : null}
						{section.ctaLabel?.trim() && ctaHref ? (
							<a href={ctaHref} className="mt-2 inline-flex text-sm font-medium text-primary hover:underline">
								{section.ctaLabel}
							</a>
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "bulk-order-inquiry-strip") {
			const primaryHref = section.primaryCtaHref?.trim()
				? normalizeActionHref(channel, section.primaryCtaHref)
				: undefined;
			const secondaryHref = section.secondaryCtaHref?.trim()
				? normalizeActionHref(channel, section.secondaryCtaHref)
				: undefined;
			const rows = [
				{ label: section.minOrderLabel, value: section.minOrderValue },
				{ label: section.leadTimeLabel, value: section.leadTimeValue },
				{ label: section.customizationLabel, value: section.customizationValue },
				{ label: section.contactLabel, value: section.contactValue },
			]
				.map((item) => ({ label: item.label?.trim() || "", value: item.value?.trim() || "" }))
				.filter((item) => item.label || item.value);
			renderedSections.push(
				<section key={`bulk-order-inquiry-strip-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading?.trim() ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle?.trim() ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
							{rows.length ? (
								rows.map((row, rowIndex) => (
									<div
										key={`${row.label || "row"}-${rowIndex}`}
										className="rounded-lg border border-border bg-background px-3 py-2"
									>
										<p className="text-xs text-muted-foreground">{row.label || `字段 ${rowIndex + 1}`}</p>
										<p className="text-sm font-medium">{row.value || "-"}</p>
									</div>
								))
							) : (
								<p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
									请至少填写 1 组询盘信息。
								</p>
							)}
						</div>
						<div className="mt-3 flex flex-wrap gap-3">
							{section.primaryCtaLabel?.trim() && primaryHref ? (
								<a
									href={primaryHref}
									className="inline-flex rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
								>
									{section.primaryCtaLabel}
								</a>
							) : null}
							{section.secondaryCtaLabel?.trim() && secondaryHref ? (
								<a
									href={secondaryHref}
									className="hover:bg-muted/30 inline-flex rounded-md border border-border px-3 py-1.5 text-sm font-medium"
								>
									{section.secondaryCtaLabel}
								</a>
							) : null}
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "regional-service-map-lite") {
			const ctaHref = section.ctaHref?.trim() ? normalizeActionHref(channel, section.ctaHref) : undefined;
			const regions = [
				{ name: section.region1Name, coverage: section.region1Coverage, sla: section.region1Sla },
				{ name: section.region2Name, coverage: section.region2Coverage, sla: section.region2Sla },
				{ name: section.region3Name, coverage: section.region3Coverage, sla: section.region3Sla },
				{ name: section.region4Name, coverage: section.region4Coverage, sla: section.region4Sla },
			]
				.map((item) => ({
					name: item.name?.trim() || "",
					coverage: item.coverage?.trim() || "",
					sla: item.sla?.trim() || "",
				}))
				.filter((item) => item.name || item.coverage || item.sla);
			renderedSections.push(
				<section key={`regional-service-map-lite-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
					>
						{section.heading?.trim() ? (
							<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
						) : null}
						{section.subtitle?.trim() ? (
							<p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p>
						) : null}
						<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
							{regions.length ? (
								regions.map((region, regionIndex) => (
									<div
										key={`${region.name || "region"}-${regionIndex}`}
										className="rounded-lg border border-border bg-background p-3"
									>
										<p className="text-sm font-semibold">{region.name || `区域 ${regionIndex + 1}`}</p>
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
						{section.note?.trim() ? (
							<p className="mt-2 text-xs text-muted-foreground">{section.note}</p>
						) : null}
						{section.ctaLabel?.trim() && ctaHref ? (
							<a href={ctaHref} className="mt-2 inline-flex text-sm font-medium text-primary hover:underline">
								{section.ctaLabel}
							</a>
						) : null}
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "container") {
			const href = section.buttonHref ? normalizeCtaHref(channel, section.buttonHref) : undefined;
			const alignClass = getContentAlignClass(section);
			const titleClass = getTitleClass(section.titleSize, "container");
			const bodyClass = getBodyClass(section.bodySize);
			const buttonClass = getButtonClass(section.buttonVariant, section.buttonSize);
			const sectionStyle = getSectionBoxStyle(section, {
				paddingX: 32,
				paddingY: 32,
				minHeight: 220,
			});
			const textColor = section.style?.textColor || section.textColor;
			renderedSections.push(
				<section key={`container-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={sectionStyle}
					>
						<div className={`flex flex-col ${alignClass}`}>
							{section.eyebrow ? <p className="mb-2 text-sm opacity-80">{section.eyebrow}</p> : null}
							{section.heading ? (
								<h2 className={`${titleClass} font-semibold tracking-tight`}>{section.heading}</h2>
							) : null}
							{section.body ? (
								<p
									className={`mt-4 max-w-3xl ${bodyClass} opacity-90`}
									style={textColor ? { color: textColor } : undefined}
								>
									{section.body}
								</p>
							) : null}
							{section.buttonLabel && href ? (
								<a href={href} className={`mt-6 ${buttonClass}`}>
									{section.buttonLabel}
								</a>
							) : null}
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "button-row") {
			const alignClass = getContentAlignClass(section);
			const primaryHref = section.primaryHref ? normalizeCtaHref(channel, section.primaryHref) : undefined;
			const secondaryHref = section.secondaryHref
				? normalizeCtaHref(channel, section.secondaryHref)
				: undefined;
			const primaryClass = getButtonClass("solid", section.buttonSize);
			const secondaryClass = getButtonClass("outline", section.buttonSize);
			renderedSections.push(
				<section key={`button-row-${index}`} className={getOuterContainerClass(section)}>
					<div
						className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
						style={getSectionBoxStyle(section, { paddingX: 32, paddingY: 32 })}
					>
						<div className={`flex flex-col ${alignClass}`}>
							{section.heading ? (
								<h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
							) : null}
							{section.subtitle ? <p className="mt-2 text-muted-foreground">{section.subtitle}</p> : null}
							<div className="mt-5 flex flex-wrap gap-3">
								{section.primaryLabel && primaryHref ? (
									<a href={primaryHref} className={primaryClass}>
										{section.primaryLabel}
									</a>
								) : null}
								{section.secondaryLabel && secondaryHref ? (
									<a href={secondaryHref} className={secondaryClass}>
										{section.secondaryLabel}
									</a>
								) : null}
							</div>
						</div>
					</div>
				</section>,
			);
			continue;
		}

		if (section.type === "spacer") {
			const height = Math.max(8, Math.min(240, section.height || 48));
			renderedSections.push(<div key={`spacer-${index}`} style={{ height }} />);
			continue;
		}

		const collectionSlug = normalizeCollectionSlug(section);
		const productLimit = normalizeCollectionLimit(section);
		const products = await getCollectionProducts(
			saleorApiUrl,
			channel,
			collectionSlug,
			productLimit,
			tenantGraphQLHeaders,
			tenantCacheKey,
		).catch((error) => {
			console.error(
				`[Homepage] getCollectionProducts threw for ${channel}/${collectionSlug} (${saleorApiUrl}):`,
				error,
			);
			return null;
		});

		if (!products?.length) {
			continue;
		}

		renderedSections.push(
			<section key={`featured-products-${index}`} className={getOuterContainerClass(section)}>
				<div
					className={`${getInnerShapeClass(section)} border border-border ${getBackgroundClass(section)}`}
					style={getSectionBoxStyle(section, { paddingX: 24, paddingY: 24 })}
				>
					<h2 className="mb-6 text-2xl font-semibold tracking-tight">
						{section.heading || "Featured products"}
					</h2>
					<ProductList products={products} />
				</div>
			</section>,
		);
	}

	return renderedSections;
}
