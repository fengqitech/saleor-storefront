import { createAppRegisterHandler } from "@saleor/app-sdk/handlers/next-app-router";
import { type NextRequest } from "next/server";
import { saleorApp } from "@/lib/saleor-app";

function getAllowedSaleorOrigins(): string[] {
	const raw = process.env.STOREFRONT_BUILDER_ALLOWED_SALEOR_ORIGINS || "";
	return raw
		.split(",")
		.map((value) => value.trim())
		.filter(Boolean);
}

const registerHandler = createAppRegisterHandler({
	apl: saleorApp.apl,
	allowedSaleorUrls: [
		(url) => {
			const allowedOrigins = getAllowedSaleorOrigins();
			if (!allowedOrigins.length) {
				return true;
			}
			try {
				return allowedOrigins.includes(new URL(url).origin);
			} catch {
				return false;
			}
		},
	],
});

export async function POST(request: NextRequest) {
	return registerHandler(request);
}
