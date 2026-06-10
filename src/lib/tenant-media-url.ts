export type MediaLike = {
	id?: string | null;
	url?: string | null;
};

export type TenantFriendlyMediaSources = {
	primary: string;
	fallback?: string;
};

function isRelativeUrl(url: string): boolean {
	return url.startsWith("/") || !url.includes("://");
}

function isAlreadyTenantServedUrl(url: string): boolean {
	return url.startsWith("/thumbnail/") || url.startsWith("/media/");
}

function safeIdForPathSegment(rawId: string): string {
	// Keep URLs readable (preserve "=") while still handling uncommon unsafe chars.
	// Saleor global IDs are typically base64-ish and safe in a path segment.
	return rawId.includes("/") ? encodeURIComponent(rawId) : rawId;
}

export function buildThumbnailPath(mediaId: string, size: number): string {
	return `/thumbnail/${safeIdForPathSegment(mediaId)}/${size}/`;
}

export function tryRewriteObjectStorageUrlToMediaPath(url: string): string | null {
	// We only attempt rewriting for absolute object-storage URLs. Relative URLs are already tenant-served.
	if (!url || isRelativeUrl(url)) return null;

	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		return null;
	}

	const host = parsed.hostname.toLowerCase();
	const isGcs =
		host === "storage.googleapis.com" ||
		host.endsWith(".storage.googleapis.com") ||
		host.endsWith(".googleapis.com");

	if (!isGcs) return null;

	const rawParts = parsed.pathname.split("/").filter(Boolean);
	if (rawParts.length === 0) return null;

	// `storage.googleapis.com/<bucket>/<path...>`
	// `<bucket>.storage.googleapis.com/<path...>`
	const parts = [...rawParts];
	if (host === "storage.googleapis.com") {
		// Drop bucket segment.
		parts.shift();
	}

	// Drop env prefix if present.
	const env = parts[0]?.toLowerCase();
	if (env && ["dev", "prod", "staging", "production"].includes(env)) {
		parts.shift();
	}

	// Drop tenant-scoping prefix if present.
	// Example:
	//   tenants/<tenantCode>/thumbnails/products/...
	//   shared/thumbnails/products/...
	if (parts[0] === "tenants") {
		parts.shift();
		if (parts.length > 0) parts.shift(); // tenantCode
	} else if (parts[0] === "shared") {
		parts.shift();
	}

	if (parts.length === 0) return null;
	return `/media/${parts.join("/")}`;
}

export function getTenantFriendlyMediaSources(
	media: MediaLike | null | undefined,
	size: number,
): TenantFriendlyMediaSources | null {
	if (!media?.url) return null;

	// If already served under tenant domain, don't rewrite.
	if (isRelativeUrl(media.url) && isAlreadyTenantServedUrl(media.url)) {
		return { primary: media.url };
	}

	// Prefer `/thumbnail/<id>/<size>/` when we have a media ID.
	if (media.id) {
		const primary = buildThumbnailPath(media.id, size);
		const mediaPathFallback = tryRewriteObjectStorageUrlToMediaPath(media.url);
		return {
			primary,
			fallback: mediaPathFallback && mediaPathFallback !== primary ? mediaPathFallback : media.url,
		};
	}

	// No ID: best-effort rewrite to `/media/...` to avoid leaking object storage URLs.
	const mediaPath = tryRewriteObjectStorageUrlToMediaPath(media.url);
	if (mediaPath) {
		return { primary: mediaPath, fallback: media.url };
	}

	return { primary: media.url };
}
