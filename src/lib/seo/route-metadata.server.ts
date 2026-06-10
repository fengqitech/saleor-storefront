import "server-only";

import { type Metadata } from "next";
import { getTenantBranding } from "@/config/tenant-branding.server";
import { buildPageMetadata } from "./metadata";
import { observeRouteMetadataQuality } from "./observability.server";
import { getTenantAbsoluteUrl } from "./url.server";

const DEFAULT_OG_IMAGE_PATH = "/opengraph-image.png";

export async function buildTenantRouteMetadata(options: {
	title: string;
	description?: string;
	canonicalPath: string;
	image?: string | null;
	noIndex?: boolean;
	openGraph?: Record<string, string>;
}): Promise<Metadata> {
	const branding = await getTenantBranding();
	const canonicalUrl = await getTenantAbsoluteUrl(options.canonicalPath);
	const resolvedDescription = options.description || branding.seoDefaultDescription;
	const resolvedImagePath = options.image || branding.seoDefaultImage || DEFAULT_OG_IMAGE_PATH;
	const ogImageUrl = await getTenantAbsoluteUrl(resolvedImagePath);

	const metadata = buildPageMetadata({
		title: options.title,
		description: resolvedDescription,
		image: ogImageUrl,
		url: canonicalUrl,
		openGraph: options.openGraph,
	});
	observeRouteMetadataQuality({
		canonicalPath: options.canonicalPath,
		title: options.title,
		description: resolvedDescription,
		ogImageUrl,
		usedDescriptionFallback: !options.description,
		usedImageFallback: !options.image,
	});

	if (!options.noIndex) {
		return metadata;
	}

	return {
		...metadata,
		robots: {
			index: false,
			follow: false,
			googleBot: {
				index: false,
				follow: false,
			},
		},
	};
}
