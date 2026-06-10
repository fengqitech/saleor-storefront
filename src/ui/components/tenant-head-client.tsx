"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
	getTenantThemeCssVariables,
	getTenantBrandingForHost,
	resolveTenantBranding,
	type TenantBranding,
} from "@/config/tenant-branding";

type TenantConfigResponse = Partial<TenantBranding> & {
	siteName?: string;
};

function upsertMeta(selector: string, attributes: Record<string, string>) {
	let el = document.head.querySelector(selector) as HTMLMetaElement | null;
	if (!el) {
		el = document.createElement("meta");
		document.head.appendChild(el);
	}
	for (const [key, value] of Object.entries(attributes)) {
		el.setAttribute(key, value);
	}
}

function setTitleWithTenantSuffix(rawTitle: string, tenantSuffix: string): string {
	const sep = " | ";
	const title = (rawTitle || "").trim();
	if (!title) return tenantSuffix;
	const base = title.includes(sep) ? title.split(sep)[0]?.trim() || title : title;
	return `${base}${sep}${tenantSuffix}`;
}

export function TenantHeadClient() {
	const pathname = usePathname();
	const [branding, setBranding] = useState<TenantBranding>(() =>
		getTenantBrandingForHost(typeof window === "undefined" ? null : window.location.host),
	);

	useEffect(() => {
		// Long-term path: tenant config served by the edge worker.
		// This lets you personalize tenants without rebuilding the storefront.
		(async () => {
			try {
				const res = await fetch("/__tenant", { cache: "no-store" });
				if (!res.ok) return;
				const json = (await res.json()) as TenantConfigResponse;
				if (!json.siteName) return;
				setBranding((prev) => resolveTenantBranding(prev, json));
			} catch {
				// Ignore – local mapping already applied.
			}
		})();
	}, []);

	useEffect(() => {
		if (!branding?.siteName) return;

		// Keep page-specific title (left side) but replace the site suffix with tenant name.
		document.title = setTitleWithTenantSuffix(document.title, branding.siteName);

		upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: branding.siteName });
		upsertMeta('meta[property="og:title"]', { property: "og:title", content: document.title });
		upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: document.title });
		upsertMeta('meta[name="application-name"]', { name: "application-name", content: branding.siteName });
		upsertMeta('meta[name="apple-mobile-web-app-title"]', {
			name: "apple-mobile-web-app-title",
			content: branding.siteName,
		});
		if (branding.seoDefaultDescription) {
			upsertMeta('meta[name="description"]', {
				name: "description",
				content: branding.seoDefaultDescription,
			});
			upsertMeta('meta[property="og:description"]', {
				property: "og:description",
				content: branding.seoDefaultDescription,
			});
			upsertMeta('meta[name="twitter:description"]', {
				name: "twitter:description",
				content: branding.seoDefaultDescription,
			});
		}
		if (branding.seoDefaultImage) {
			upsertMeta('meta[property="og:image"]', { property: "og:image", content: branding.seoDefaultImage });
			upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: branding.seoDefaultImage });
		}

		if (branding.themeColor) {
			upsertMeta('meta[name="theme-color"]', { name: "theme-color", content: branding.themeColor });
		}

		const vars = getTenantThemeCssVariables(branding);
		if (vars) {
			for (const [key, value] of Object.entries(vars)) {
				document.documentElement.style.setProperty(key, value);
			}
		}
	}, [branding, pathname]);

	return null;
}
