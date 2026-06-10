import { type MetadataRoute } from "next";
import { DefaultChannelSlug } from "@/app/config";
import { seoConfig } from "@/lib/seo/config";
import { getTenantBaseUrl } from "@/lib/seo/url.server";

function unique(values: string[]): string[] {
	return Array.from(new Set(values.filter(Boolean)));
}

export default async function robots(): Promise<MetadataRoute.Robots> {
	const baseUrl = await getTenantBaseUrl();
	const channelScopedNoIndexPaths = DefaultChannelSlug
		? seoConfig.noIndexPaths.map((path) => `/${DefaultChannelSlug}${path}`)
		: [];
	const wildcardChannelNoIndexPaths = seoConfig.noIndexPaths.map((path) => `/*${path}`);
	const disallow = unique([
		...seoConfig.noIndexPaths,
		...channelScopedNoIndexPaths,
		...wildcardChannelNoIndexPaths,
	]);

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow,
			},
		],
		sitemap: [`${baseUrl}/sitemap.xml`],
		host: new URL(baseUrl).host,
	};
}
