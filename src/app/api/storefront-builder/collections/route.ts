import { NextRequest } from "next/server";
import { executeRawGraphQL, type GraphQLResult } from "@/lib/graphql";
import { getSaleorApiUrl } from "@/lib/saleor-api-url.server";
import { authorizeStorefrontBuilderRequest } from "../_lib/auth";

type CollectionsQueryResponse = {
	collections?: {
		pageInfo?: {
			hasNextPage?: boolean | null;
			endCursor?: string | null;
		} | null;
		edges?: Array<{
			node?: {
				id?: string | null;
				slug?: string | null;
				name?: string | null;
			} | null;
		} | null> | null;
	} | null;
};

type CollectionsConnection = NonNullable<CollectionsQueryResponse["collections"]>;
type CollectionsPageInfo = CollectionsConnection["pageInfo"];

function toChannel(value: string | null): string {
	const trimmed = (value || "").trim();
	if (trimmed) {
		return trimmed;
	}
	return process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "default-channel";
}

const COLLECTIONS_QUERY = `
	query StorefrontBuilderCollections($channel: String!, $first: Int!, $after: String) {
		collections(channel: $channel, first: $first, after: $after) {
			pageInfo {
				hasNextPage
				endCursor
			}
			edges {
				node {
					id
					slug
					name
				}
			}
		}
	}
`;

const SALEOR_COLLECTIONS_FIRST_LIMIT = 100;
const DEFAULT_COLLECTIONS_TARGET = 200;

export async function GET(request: NextRequest) {
	const auth = authorizeStorefrontBuilderRequest(request);
	if (!auth.ok) {
		return Response.json(
			{ error: auth.error || "Unauthorized" },
			{
				status: auth.status,
				headers: {
					"Cache-Control": "no-store",
				},
			},
		);
	}

	const saleorApiUrl = await getSaleorApiUrl();
	if (!saleorApiUrl) {
		return Response.json(
			{ error: "Missing Saleor API URL" },
			{
				status: 500,
				headers: {
					"Cache-Control": "no-store",
				},
			},
		);
	}

	const channel = toChannel(request.nextUrl.searchParams.get("channel"));

	const targetCount = Number.isFinite(Number.parseInt(request.nextUrl.searchParams.get("limit") || "", 10))
		? Math.max(1, Number.parseInt(request.nextUrl.searchParams.get("limit") || "0", 10))
		: DEFAULT_COLLECTIONS_TARGET;
	const maxCount = Math.min(targetCount, DEFAULT_COLLECTIONS_TARGET);

	const nodes: Array<{ id?: string | null; slug?: string | null; name?: string | null }> = [];
	let after: string | null = null;
	let hasNextPage = true;

	while (hasNextPage && nodes.length < maxCount) {
		const remaining = maxCount - nodes.length;
		const first = Math.min(SALEOR_COLLECTIONS_FIRST_LIMIT, remaining);

		const graphqlResult: GraphQLResult<CollectionsQueryResponse> =
			await executeRawGraphQL<CollectionsQueryResponse>({
				query: COLLECTIONS_QUERY,
				variables: {
					channel,
					first,
					after,
				},
				saleorApiUrl,
			});

		if (!graphqlResult.ok) {
			return Response.json(
				{ error: `Failed to load collections: ${graphqlResult.error.message}` },
				{
					status: 502,
					headers: {
						"Cache-Control": "no-store",
					},
				},
			);
		}

		const edges = graphqlResult.data.collections?.edges || [];
		for (const edge of edges) {
			const node = edge?.node;
			if (node) nodes.push(node);
		}

		const pageInfo: CollectionsPageInfo = graphqlResult.data.collections?.pageInfo;
		hasNextPage = !!pageInfo?.hasNextPage;
		after = pageInfo?.endCursor || null;
		if (!after) break;
	}

	const collections = nodes
		.map((node) => ({
			id: node.id || "",
			slug: (node.slug || "").trim(),
			name: (node.name || "").trim(),
		}))
		.filter((node) => node.slug)
		.sort((a, b) => {
			const byName = a.name.localeCompare(b.name);
			if (byName !== 0) return byName;
			return a.slug.localeCompare(b.slug);
		});

	return Response.json(
		{
			channel,
			count: collections.length,
			collections,
		},
		{
			headers: {
				"Cache-Control": "no-store",
			},
		},
	);
}
