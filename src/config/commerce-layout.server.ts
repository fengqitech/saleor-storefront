import "server-only";

import { headers } from "next/headers";
import { getCommerceLayoutFromHeaders, type TenantCommerceLayout } from "./commerce-layout";

export async function getTenantCommerceLayout(): Promise<TenantCommerceLayout> {
	const h = await headers();
	const forwardedHost = h.get("x-forwarded-host");
	const host = forwardedHost || h.get("host");
	return getCommerceLayoutFromHeaders(host, {
		commerceLayout: h.get("x-tenant-commerce-layout"),
	});
}
