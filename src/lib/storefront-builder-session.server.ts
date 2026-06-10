import "server-only";

import { cookies } from "next/headers";
import {
	STOREFRONT_BUILDER_SESSION_COOKIE,
	type StorefrontBuilderSessionPayload,
	verifyStorefrontBuilderSessionToken,
} from "@/lib/storefront-builder-auth";

export type StorefrontBuilderSessionCheck = {
	required: boolean;
	authorized: boolean;
	payload?: StorefrontBuilderSessionPayload;
	reason?: string;
};

export function isStorefrontBuilderSessionRequired(): boolean {
	if (process.env.NODE_ENV === "production") {
		return true;
	}
	return process.env.STOREFRONT_BUILDER_REQUIRE_SESSION === "true";
}

export async function verifyStorefrontBuilderSessionFromCookies(): Promise<StorefrontBuilderSessionCheck> {
	const required = isStorefrontBuilderSessionRequired();
	if (!required) {
		return {
			required: false,
			authorized: true,
			reason: "session-check-bypassed-in-dev",
		};
	}

	const secret = process.env.STOREFRONT_BUILDER_SECRET;
	if (!secret) {
		return {
			required,
			authorized: false,
			reason: "missing-storefront-builder-secret",
		};
	}

	const cookieStore = await cookies();
	const token = cookieStore.get(STOREFRONT_BUILDER_SESSION_COOKIE)?.value || "";
	if (!token) {
		return {
			required,
			authorized: false,
			reason: "missing-builder-session-cookie",
		};
	}

	const payload = verifyStorefrontBuilderSessionToken(token, secret);
	if (!payload) {
		return {
			required,
			authorized: false,
			reason: "invalid-builder-session-cookie",
		};
	}

	return {
		required,
		authorized: true,
		payload,
	};
}
