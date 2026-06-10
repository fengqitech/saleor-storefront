import "server-only";

import { getRequestOrigin } from "@/lib/request-origin.server";
import { getBaseUrl } from "./config";

function normalizePath(pathname: string): string {
	if (!pathname) {
		return "/";
	}
	if (/^https?:\/\//i.test(pathname)) {
		return pathname;
	}
	return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export async function getTenantBaseUrl(): Promise<string> {
	return (await getRequestOrigin()) || getBaseUrl();
}

export async function getTenantAbsoluteUrl(pathname: string): Promise<string> {
	const normalizedPath = normalizePath(pathname);
	if (/^https?:\/\//i.test(normalizedPath)) {
		return normalizedPath;
	}
	return new URL(normalizedPath, await getTenantBaseUrl()).toString();
}
