import Link from "next/link";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import {
	CategoriesListDocument,
	type CategoriesListQuery,
	type CategoriesListQueryVariables,
} from "@/gql/graphql";
import { executePublicGraphQL, type GraphQLResult } from "@/lib/graphql";
import { getSaleorApiUrl } from "@/lib/saleor-api-url.server";
import { buildTenantRouteMetadata } from "@/lib/seo/route-metadata.server";
import { getTenantGraphQLHeaders } from "@/lib/tenant-graphql-headers.server";

type PageProps = {
	params: Promise<{ channel: string }>;
};

type FlatCategory = {
	id: string;
	slug: string;
	name: string;
	parentId: string | null;
};

type CategoryTreeNode = FlatCategory & {
	children: CategoryTreeNode[];
};

const CATEGORY_PAGE_SIZE = 100;
const CATEGORY_PAGE_MAX = 30;

export async function generateMetadata(props: PageProps): Promise<Metadata> {
	const { channel } = await props.params;
	return buildTenantRouteMetadata({
		title: "Categories",
		description: "Browse all product categories.",
		canonicalPath: `/${channel}/categories`,
	});
}

async function fetchAllCategories(
	saleorApiUrl: string,
	headers: HeadersInit,
): Promise<FlatCategory[] | null> {
	const categories: FlatCategory[] = [];
	let after: string | null = null;

	for (let page = 0; page < CATEGORY_PAGE_MAX; page += 1) {
		const result: GraphQLResult<CategoriesListQuery> = await executePublicGraphQL<
			CategoriesListQuery,
			CategoriesListQueryVariables
		>(CategoriesListDocument, {
			variables: {
				first: CATEGORY_PAGE_SIZE,
				after: after || undefined,
			},
			revalidate: 3600,
			headers,
			saleorApiUrl,
		});
		if (!result.ok) {
			return null;
		}

		const edges = result.data.categories?.edges ?? [];
		for (const edge of edges) {
			const node = edge.node;
			if (!node?.id || !node.slug || !node.name) continue;
			categories.push({
				id: node.id,
				slug: node.slug,
				name: node.name,
				parentId: node.parent?.id ?? null,
			});
		}

		const pageInfo = (result.data.categories?.pageInfo ?? null) as {
			hasNextPage?: boolean | null;
			endCursor?: string | null;
		} | null;
		if (!pageInfo?.hasNextPage || !pageInfo.endCursor) {
			break;
		}
		after = pageInfo.endCursor;
	}

	return categories;
}

function buildCategoryTree(items: FlatCategory[]): CategoryTreeNode[] {
	const nodeMap = new Map<string, CategoryTreeNode>();
	const roots: CategoryTreeNode[] = [];

	for (const item of items) {
		nodeMap.set(item.id, { ...item, children: [] });
	}

	for (const item of items) {
		const node = nodeMap.get(item.id);
		if (!node) continue;
		if (item.parentId && nodeMap.has(item.parentId)) {
			nodeMap.get(item.parentId)?.children.push(node);
		} else {
			roots.push(node);
		}
	}

	const sortTree = (nodes: CategoryTreeNode[]) => {
		nodes.sort((left, right) => left.name.localeCompare(right.name));
		for (const node of nodes) {
			sortTree(node.children);
		}
	};
	sortTree(roots);

	return roots;
}

function CategoryTree({
	nodes,
	channel,
	depth = 0,
}: {
	nodes: CategoryTreeNode[];
	channel: string;
	depth?: number;
}) {
	const listClass =
		depth === 0 ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "mt-3 space-y-2 border-l border-border pl-4";
	return (
		<ul className={listClass}>
			{nodes.map((node) => (
				<li key={node.id} className={depth === 0 ? "rounded-lg border border-border p-4" : ""}>
					<Link
						href={`/${channel}/categories/${encodeURIComponent(node.slug)}`}
						className="text-sm font-medium text-foreground transition-colors hover:text-primary"
					>
						{node.name}
					</Link>
					{node.children.length > 0 ? (
						<CategoryTree nodes={node.children} channel={channel} depth={depth + 1} />
					) : null}
				</li>
			))}
		</ul>
	);
}

export default async function CategoriesIndexPage(props: PageProps) {
	const { channel } = await props.params;
	const saleorApiUrl = await getSaleorApiUrl();
	if (!saleorApiUrl) {
		notFound();
	}

	const headers = await getTenantGraphQLHeaders();
	const categories = await fetchAllCategories(saleorApiUrl, headers);
	if (!categories) {
		notFound();
	}

	const tree = buildCategoryTree(categories);

	return (
		<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div className="mb-8">
				<h1 className="text-3xl font-semibold tracking-tight">Categories</h1>
				<p className="mt-2 text-sm text-muted-foreground">Browse all category groups and subcategories.</p>
			</div>
			{tree.length > 0 ? (
				<CategoryTree nodes={tree} channel={channel} />
			) : (
				<div className="rounded-lg border border-dashed border-border p-8 text-sm text-muted-foreground">
					No categories found.
				</div>
			)}
		</div>
	);
}
