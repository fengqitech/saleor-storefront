import "server-only";

import { CategoriesBySlugDocument } from "@/gql/graphql";
import { executePublicGraphQL, executeRawGraphQL } from "@/lib/graphql";
import type { TenantGraphQLHeaders } from "@/lib/tenant-graphql-headers.server";
import { isColorAttribute, isSizeAttribute } from "@/lib/colors";

/**
 * Resolve category slugs to IDs via Saleor API.
 * Cached for 1 hour.
 *
 * Server-only: Uses executePublicGraphQL which requires server context.
 */
export async function resolveCategorySlugsToIds(
	saleorApiUrl: string,
	slugs: string[],
	tenantGraphQLHeaders?: TenantGraphQLHeaders,
): Promise<Map<string, { id: string; name: string }>> {
	const result = new Map<string, { id: string; name: string }>();
	if (slugs.length === 0) return result;

	const queryResult = await executePublicGraphQL(CategoriesBySlugDocument, {
		variables: { slugs, first: slugs.length },
		revalidate: 3600,
		headers: tenantGraphQLHeaders,
		saleorApiUrl,
	});

	if (queryResult.ok && queryResult.data.categories?.edges) {
		queryResult.data.categories.edges.forEach(({ node }) => {
			result.set(node.slug, { id: node.id, name: node.name });
		});
	} else if (!queryResult.ok) {
		console.error("[filter-utils] Failed to resolve category slugs:", queryResult.error.message);
	}

	return result;
}

type AttributeFilterCatalogResult = {
	colorSlug?: string;
	sizeSlug?: string;
	allColors: string[];
	allSizes: string[];
};

type GlobalFilterOption = {
	name: string;
	count: number;
};

type GlobalAttributeFilterCountsResult = {
	allColors: GlobalFilterOption[];
	allSizes: GlobalFilterOption[];
};

type AttributeListQueryResponse = {
	attributes?: {
		edges?: Array<{
			node?: {
				slug?: string | null;
				choices?: {
					edges?: Array<{
						node?: {
							name?: string | null;
						} | null;
					} | null> | null;
				} | null;
			} | null;
		} | null> | null;
	} | null;
};

const ATTRIBUTE_FILTER_QUERY = `
	query StorefrontFilterAttributes($channel: String, $first: Int!, $slugs: [String!], $valuesFirst: Int!) {
		attributes(
			channel: $channel
			first: $first
			filter: { filterableInStorefront: true, isVariantOnly: true, slugs: $slugs }
		) {
			edges {
				node {
					slug
					choices(first: $valuesFirst) {
						edges {
							node {
								name
							}
						}
					}
				}
			}
		}
	}
`;

function uniqueSorted(values: string[]): string[] {
	return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean))).sort((a, b) =>
		a.localeCompare(b),
	);
}

type CandidateAttribute = {
	slug: string;
	values: string[];
};

function pickBestCandidateBySelection(
	candidates: CandidateAttribute[],
	selectedValues: string[],
): string | undefined {
	if (!candidates.length) return undefined;
	if (!selectedValues.length) return candidates[0]?.slug;

	const selected = new Set(selectedValues.map((value) => value.trim()).filter(Boolean));
	if (!selected.size) return candidates[0]?.slug;

	const scored = candidates.map((candidate) => {
		const valueSet = new Set(candidate.values);
		let matched = 0;
		for (const value of selected) {
			if (valueSet.has(value)) matched += 1;
		}
		return {
			slug: candidate.slug,
			matched,
			total: valueSet.size,
		};
	});
	scored.sort((a, b) => {
		if (b.matched !== a.matched) return b.matched - a.matched;
		return b.total - a.total;
	});
	return scored[0]?.slug;
}

/**
 * Resolve storefront color/size attribute slugs and global filter options.
 *
 * Uses a targeted attributes query (known color/size slug variants) so we can:
 * - apply server-side ProductFilterInput.attributes
 * - present global color/size options (not limited to current product page)
 */
export async function resolveAttributeFilterCatalog(
	saleorApiUrl: string,
	channel: string,
	selectedColors: string[],
	selectedSizes: string[],
	tenantGraphQLHeaders?: TenantGraphQLHeaders,
): Promise<AttributeFilterCatalogResult> {
	const candidateSlugs = ["color", "colour", "size", "shoe-size", "clothing-size"];
	const queryResult = await executeRawGraphQL<AttributeListQueryResponse>({
		query: ATTRIBUTE_FILTER_QUERY,
		variables: {
			channel,
			first: candidateSlugs.length,
			slugs: candidateSlugs,
			valuesFirst: 200,
		},
		headers: tenantGraphQLHeaders,
		saleorApiUrl,
	});

	if (!queryResult.ok) {
		console.error("[filter-utils] Failed to resolve attribute filter catalog:", queryResult.error.message);
		return {
			allColors: [],
			allSizes: [],
		};
	}

	const edges = queryResult.data.attributes?.edges || [];
	const colorCandidates: CandidateAttribute[] = [];
	const sizeCandidates: CandidateAttribute[] = [];
	const allColorValues: string[] = [];
	const allSizeValues: string[] = [];

	for (const edge of edges) {
		const slug = edge?.node?.slug?.trim();
		if (!slug) continue;
		const values = uniqueSorted(
			(edge?.node?.choices?.edges || []).map((choice) => choice?.node?.name || "").filter(Boolean),
		);
		if (isColorAttribute(slug)) {
			colorCandidates.push({ slug, values });
			allColorValues.push(...values);
		}
		if (isSizeAttribute(slug)) {
			sizeCandidates.push({ slug, values });
			allSizeValues.push(...values);
		}
	}

	return {
		colorSlug: pickBestCandidateBySelection(colorCandidates, selectedColors),
		sizeSlug: pickBestCandidateBySelection(sizeCandidates, selectedSizes),
		allColors: uniqueSorted(allColorValues),
		allSizes: uniqueSorted(allSizeValues),
	};
}

type ProductCountQueryResponse = {
	[key: string]: {
		totalCount?: number | null;
	} | null;
};

function buildSingleValueFilterLiteral(attributeSlug: string, valueName: string): string {
	return `{ attributes: [{ slug: ${JSON.stringify(attributeSlug)}, value: { name: { oneOf: [${JSON.stringify(
		valueName,
	)}] } } }] }`;
}

function toBatches(values: string[], batchSize: number): string[][] {
	const batches: string[][] = [];
	for (let index = 0; index < values.length; index += batchSize) {
		batches.push(values.slice(index, index + batchSize));
	}
	return batches;
}

async function resolveSingleAttributeGlobalCounts(params: {
	saleorApiUrl: string;
	channel: string;
	attributeSlug?: string;
	values: string[];
	tenantGraphQLHeaders?: TenantGraphQLHeaders;
}): Promise<GlobalFilterOption[]> {
	const values = uniqueSorted(params.values);
	if (!params.attributeSlug || values.length === 0) {
		return values.map((name) => ({ name, count: 0 }));
	}

	const BATCH_SIZE = 30;
	const batches = toBatches(values, BATCH_SIZE);
	const counts = new Map<string, number>();

	for (const batch of batches) {
		const aliasToValue = new Map<string, string>();
		const lines: string[] = [];
		batch.forEach((valueName, index) => {
			const alias = `v${index}`;
			aliasToValue.set(alias, valueName);
			const filterLiteral = buildSingleValueFilterLiteral(params.attributeSlug!, valueName);
			lines.push(`${alias}: products(first: 1, channel: $channel, filter: ${filterLiteral}) { totalCount }`);
		});

		const query = `
			query StorefrontFilterValueCounts($channel: String!) {
				${lines.join("\n")}
			}
		`;

		const queryResult = await executeRawGraphQL<ProductCountQueryResponse>({
			query,
			variables: {
				channel: params.channel,
			},
			headers: params.tenantGraphQLHeaders,
			saleorApiUrl: params.saleorApiUrl,
		});

		if (!queryResult.ok) {
			console.error("[filter-utils] Failed to resolve global attribute counts:", queryResult.error.message);
			for (const valueName of batch) {
				if (!counts.has(valueName)) {
					counts.set(valueName, 0);
				}
			}
			continue;
		}

		for (const [alias, valueName] of aliasToValue.entries()) {
			const totalCount = queryResult.data[alias]?.totalCount;
			counts.set(valueName, typeof totalCount === "number" ? totalCount : 0);
		}
	}

	return values
		.map((name) => ({ name, count: counts.get(name) ?? 0 }))
		.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/**
 * Resolve accurate global (channel-wide) counts for color/size filter values.
 */
export async function resolveGlobalAttributeFilterCounts(
	saleorApiUrl: string,
	channel: string,
	catalog: AttributeFilterCatalogResult,
	tenantGraphQLHeaders?: TenantGraphQLHeaders,
): Promise<GlobalAttributeFilterCountsResult> {
	const [allColors, allSizes] = await Promise.all([
		resolveSingleAttributeGlobalCounts({
			saleorApiUrl,
			channel,
			attributeSlug: catalog.colorSlug,
			values: catalog.allColors,
			tenantGraphQLHeaders,
		}),
		resolveSingleAttributeGlobalCounts({
			saleorApiUrl,
			channel,
			attributeSlug: catalog.sizeSlug,
			values: catalog.allSizes,
			tenantGraphQLHeaders,
		}),
	]);

	return {
		allColors,
		allSizes,
	};
}
