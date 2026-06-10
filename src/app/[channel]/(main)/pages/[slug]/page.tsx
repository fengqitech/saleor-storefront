import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import edjsHTML from "editorjs-html";
import xss from "xss";
import { PageGetBySlugDocument } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";
import { getSaleorApiUrl } from "@/lib/saleor-api-url.server";
import { getTenantGraphQLHeaders, type TenantGraphQLHeaders } from "@/lib/tenant-graphql-headers.server";
import { getTenantCacheKeyFromTenantGraphQLHeaders, pageCacheTag } from "@/lib/cache-tags";
import { buildTenantRouteMetadata } from "@/lib/seo/route-metadata.server";

const parser = edjsHTML();

async function getPageBySlug(
	saleorApiUrl: string,
	channel: string,
	slug: string,
	tenantGraphQLHeaders: TenantGraphQLHeaders,
	tenantKey: string,
) {
	"use cache";
	cacheLife("hours");
	cacheTag(pageCacheTag(tenantKey, channel, slug));

	const result = await executePublicGraphQL(PageGetBySlugDocument, {
		variables: { slug },
		revalidate: 60 * 60,
		headers: tenantGraphQLHeaders,
		saleorApiUrl,
	});

	return result.ok ? result.data.page : null;
}

export const generateMetadata = async (props: {
	params: Promise<{ channel: string; slug: string }>;
}): Promise<Metadata> => {
	const params = await props.params;
	const saleorApiUrl = await getSaleorApiUrl();
	if (!saleorApiUrl) {
		return {};
	}
	const tenantGraphQLHeaders = await getTenantGraphQLHeaders();
	const tenantKey = getTenantCacheKeyFromTenantGraphQLHeaders(tenantGraphQLHeaders);
	const page = await getPageBySlug(
		saleorApiUrl,
		params.channel,
		params.slug,
		tenantGraphQLHeaders,
		tenantKey,
	);

	return buildTenantRouteMetadata({
		title: page?.seoTitle || page?.title || "Page",
		description: page?.seoDescription || page?.title,
		canonicalPath: `/${params.channel}/pages/${encodeURIComponent(params.slug)}`,
	});
};

export default async function Page(props: { params: Promise<{ channel: string; slug: string }> }) {
	const params = await props.params;
	const saleorApiUrl = await getSaleorApiUrl();
	if (!saleorApiUrl) {
		notFound();
	}
	const tenantGraphQLHeaders = await getTenantGraphQLHeaders();
	const tenantKey = getTenantCacheKeyFromTenantGraphQLHeaders(tenantGraphQLHeaders);
	const page = await getPageBySlug(
		saleorApiUrl,
		params.channel,
		params.slug,
		tenantGraphQLHeaders,
		tenantKey,
	);
	if (!page) {
		notFound();
	}

	const { title, content } = page;

	let contentHtml: string[] | null = null;
	if (content) {
		try {
			contentHtml = parser.parse(JSON.parse(content));
		} catch {
			contentHtml = null;
		}
	}

	return (
		<div className="mx-auto max-w-7xl p-8 pb-16">
			<h1 className="text-3xl font-semibold">{title}</h1>
			{contentHtml && (
				<div className="prose">
					{contentHtml.map((content) => (
						<div key={content} dangerouslySetInnerHTML={{ __html: xss(content) }} />
					))}
				</div>
			)}
		</div>
	);
}
