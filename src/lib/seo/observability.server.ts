import "server-only";

type SeoIssueLevel = "info" | "warn";

const SEO_OBSERVABILITY_PREFIX = "[SEO-Observability]";
const ISSUE_DEDUPE_WINDOW_MS = 15 * 60 * 1000;
const MAX_SEEN_ISSUES = 500;

const seenIssueAt = new Map<string, number>();

function pruneSeenIssues(now: number) {
	for (const [key, lastSeenAt] of seenIssueAt) {
		if (now - lastSeenAt > ISSUE_DEDUPE_WINDOW_MS) {
			seenIssueAt.delete(key);
		}
	}

	if (seenIssueAt.size <= MAX_SEEN_ISSUES) {
		return;
	}

	const sortedEntries = [...seenIssueAt.entries()].sort((left, right) => left[1] - right[1]);
	const overflowCount = seenIssueAt.size - MAX_SEEN_ISSUES;
	for (let index = 0; index < overflowCount; index += 1) {
		const candidate = sortedEntries[index];
		if (candidate) {
			seenIssueAt.delete(candidate[0]);
		}
	}
}

function shouldLogIssue(issueKey: string): boolean {
	const now = Date.now();
	const lastSeenAt = seenIssueAt.get(issueKey);

	if (lastSeenAt && now - lastSeenAt < ISSUE_DEDUPE_WINDOW_MS) {
		return false;
	}

	seenIssueAt.set(issueKey, now);
	pruneSeenIssues(now);
	return true;
}

function logSeoIssue(params: {
	level: SeoIssueLevel;
	code: string;
	scope: "route-metadata" | "sitemap";
	target: string;
	message: string;
	details?: Record<string, unknown>;
}) {
	const issueKey = `${params.scope}:${params.code}:${params.target}`;
	if (!shouldLogIssue(issueKey)) {
		return;
	}

	const payload = {
		scope: params.scope,
		code: params.code,
		target: params.target,
		message: params.message,
		...(params.details ? { details: params.details } : {}),
	};

	if (params.level === "warn") {
		console.warn(`${SEO_OBSERVABILITY_PREFIX} ${JSON.stringify(payload)}`);
		return;
	}
	console.log(`${SEO_OBSERVABILITY_PREFIX} ${JSON.stringify(payload)}`);
}

function isLikelyAbsoluteImageUrl(input: string): boolean {
	try {
		const parsed = new URL(input);
		return parsed.protocol === "http:" || parsed.protocol === "https:";
	} catch {
		return false;
	}
}

export function observeRouteMetadataQuality(params: {
	canonicalPath: string;
	title: string;
	description?: string;
	ogImageUrl?: string | null;
	usedDescriptionFallback: boolean;
	usedImageFallback: boolean;
}) {
	const normalizedPath = params.canonicalPath.startsWith("/")
		? params.canonicalPath
		: `/${params.canonicalPath}`;
	const normalizedTitle = params.title.trim();
	const normalizedDescription = params.description?.trim() || "";
	const normalizedImageUrl = params.ogImageUrl?.trim() || "";

	if (!normalizedTitle) {
		logSeoIssue({
			level: "warn",
			scope: "route-metadata",
			code: "missing-title",
			target: normalizedPath,
			message: "Metadata title is empty.",
		});
	}

	if (!normalizedDescription) {
		logSeoIssue({
			level: "warn",
			scope: "route-metadata",
			code: "missing-description",
			target: normalizedPath,
			message: "Metadata description is empty.",
		});
	} else if (params.usedDescriptionFallback) {
		logSeoIssue({
			level: "info",
			scope: "route-metadata",
			code: "description-fallback-used",
			target: normalizedPath,
			message: "Route uses tenant default SEO description.",
			details: { length: normalizedDescription.length },
		});
	}

	if (!normalizedImageUrl) {
		logSeoIssue({
			level: "warn",
			scope: "route-metadata",
			code: "missing-og-image",
			target: normalizedPath,
			message: "OpenGraph image URL is empty.",
		});
	} else if (!isLikelyAbsoluteImageUrl(normalizedImageUrl)) {
		logSeoIssue({
			level: "warn",
			scope: "route-metadata",
			code: "invalid-og-image-url",
			target: normalizedPath,
			message: "OpenGraph image URL is not absolute http(s).",
			details: { ogImageUrl: normalizedImageUrl },
		});
	} else if (params.usedImageFallback) {
		logSeoIssue({
			level: "info",
			scope: "route-metadata",
			code: "image-fallback-used",
			target: normalizedPath,
			message: "Route uses fallback OpenGraph image.",
			details: { ogImageUrl: normalizedImageUrl },
		});
	}
}

export function observeSitemapSectionStats(params: {
	channel: string;
	section: "products" | "categories" | "collections" | "pages";
	entryCount: number;
	pageCount: number;
	maxPages: number;
	truncated: boolean;
	queryFailed: boolean;
}) {
	const target = `${params.channel}/${params.section}`;
	if (params.queryFailed) {
		logSeoIssue({
			level: "warn",
			scope: "sitemap",
			code: "query-failed",
			target,
			message: "Sitemap section query failed; section may be incomplete.",
		});
		return;
	}

	if (params.truncated) {
		logSeoIssue({
			level: "warn",
			scope: "sitemap",
			code: "max-pages-reached",
			target,
			message: "Sitemap section reached max pagination cap and was truncated.",
			details: {
				entryCount: params.entryCount,
				pageCount: params.pageCount,
				maxPages: params.maxPages,
			},
		});
		return;
	}

	logSeoIssue({
		level: "info",
		scope: "sitemap",
		code: "section-generated",
		target,
		message: "Sitemap section generated successfully.",
		details: {
			entryCount: params.entryCount,
			pageCount: params.pageCount,
		},
	});
}

export function observeSitemapGenerationSummary(params: {
	channelCount: number;
	totalEntries: number;
	baseUrl: string;
}) {
	logSeoIssue({
		level: "info",
		scope: "sitemap",
		code: "generation-summary",
		target: params.baseUrl,
		message: "Sitemap generation completed.",
		details: {
			channelCount: params.channelCount,
			totalEntries: params.totalEntries,
		},
	});
}
