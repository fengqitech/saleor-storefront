function isPrivateIpv4(host: string): boolean {
	// Very small allow/deny list; we only need to block obvious internal hosts.
	// This storefront should not render internal links from CMS data.
	const m = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
	if (!m) return false;
	const octets = m.slice(1).map((x) => Number(x));
	if (octets.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return false;

	const [a, b] = octets;
	if (a === 10) return true;
	if (a === 127) return true;
	if (a === 0) return true;
	if (a === 192 && b === 168) return true;
	if (a === 172 && b >= 16 && b <= 31) return true;
	return false;
}

function isUnsafeHost(host: string): boolean {
	const lower = host.toLowerCase();
	if (lower === "localhost") return true;
	if (lower === "::1") return true;
	if (lower.endsWith(".local")) return true;
	if (isPrivateIpv4(lower)) return true;
	return false;
}

export function sanitizeHref(rawHref: string): string | null {
	const href = (rawHref || "").trim();
	if (!href) return null;

	// Internal links are always allowed.
	if (href.startsWith("/")) return href;

	let url: URL;
	try {
		url = new URL(href);
	} catch {
		return null;
	}

	if (url.protocol !== "https:" && url.protocol !== "http:") return null;
	if (isUnsafeHost(url.hostname)) return null;

	return href;
}

export function isExternalHref(href: string): boolean {
	return /^https?:\/\//i.test(href);
}
