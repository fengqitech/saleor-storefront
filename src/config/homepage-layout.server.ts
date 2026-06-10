import "server-only";

import { headers } from "next/headers";
import { verifyStorefrontBuilderSessionFromCookies } from "@/lib/storefront-builder-session.server";
import { getHomepageLayoutFromHeaders, type HomepageLayout } from "./homepage-layout";

export type TenantHomepageLayoutMode = "published" | "draft";

export type TenantHomepageLayoutState = {
	layout: HomepageLayout;
	mode: TenantHomepageLayoutMode;
	version?: string;
};

export async function getTenantHomepageLayout(): Promise<HomepageLayout> {
	const state = await getTenantHomepageLayoutState();
	return state.layout;
}

export async function getTenantHomepageLayoutState(): Promise<TenantHomepageLayoutState> {
	const h = await headers();
	const forwardedHost = h.get("x-forwarded-host");
	const host = forwardedHost || h.get("host");
	const modeHeader = (h.get("x-tenant-homepage-layout-mode") || "").trim().toLowerCase();
	const requestedDraftMode = modeHeader === "draft";
	const sessionCheck = requestedDraftMode ? await verifyStorefrontBuilderSessionFromCookies() : null;
	const allowDraftMode = requestedDraftMode && sessionCheck?.authorized === true;
	const activeHomepageLayoutHeader = allowDraftMode
		? h.get("x-tenant-homepage-layout")
		: requestedDraftMode
			? h.get("x-tenant-homepage-layout-published")
			: h.get("x-tenant-homepage-layout");
	const layout = getHomepageLayoutFromHeaders(host, {
		homepageLayout: activeHomepageLayoutHeader,
	});
	const mode: TenantHomepageLayoutMode = allowDraftMode ? "draft" : "published";
	const version = h.get("x-tenant-homepage-layout-version") || undefined;
	return {
		layout,
		mode,
		version,
	};
}
