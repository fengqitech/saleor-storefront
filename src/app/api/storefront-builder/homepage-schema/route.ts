import { NextRequest } from "next/server";
import { getTenantHomepageLayoutState } from "@/config/homepage-layout.server";
import { getHomepageSectionRegistry, HOMEPAGE_LAYOUT_SCHEMA_VERSION } from "@/config/homepage-layout";
import { authorizeStorefrontBuilderRequest } from "../_lib/auth";

export async function GET(_request: NextRequest) {
	const auth = authorizeStorefrontBuilderRequest(_request);
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

	const homepageLayoutState = await getTenantHomepageLayoutState();
	const sectionRegistry = getHomepageSectionRegistry();

	return Response.json(
		{
			builder: {
				preferredEditor: "puck",
				schemaVersion: HOMEPAGE_LAYOUT_SCHEMA_VERSION,
				sectionRegistry,
			},
			layoutState: homepageLayoutState,
		},
		{
			headers: {
				"Cache-Control": "no-store",
			},
		},
	);
}
