import "server-only";

import { NextRequest } from "next/server";
import {
	STOREFRONT_BUILDER_SESSION_COOKIE,
	StorefrontBuilderSessionPayload,
	verifyStorefrontBuilderSessionToken,
} from "@/lib/storefront-builder-auth";

export type BuilderSessionContext = {
	sub?: string;
	saleorAuthToken?: string;
	isStaff: boolean;
	isSuperuser: boolean;
	permissions: string[];
};

export type BuilderAuthorizationResult = {
	ok: boolean;
	status: number;
	error?: string;
	session?: BuilderSessionContext;
};

type BuilderAuthorizationOptions = {
	requireWriteAccess?: boolean;
	/**
	 * Optional override for required permissions when `requireWriteAccess` is true.
	 *
	 * - `undefined` -> use `STOREFRONT_BUILDER_WRITE_PERMISSIONS` (default: MANAGE_PAGES)
	 * - `[]`        -> staff-only (no permission codes required)
	 */
	requiredPermissions?: string[];
};

function getRequiredWritePermissions(): string[] {
	return (process.env.STOREFRONT_BUILDER_WRITE_PERMISSIONS || "MANAGE_PAGES")
		.split(",")
		.map((value) => value.trim())
		.filter(Boolean);
}

function toSessionContext(payload: StorefrontBuilderSessionPayload): BuilderSessionContext {
	return {
		sub: typeof payload.sub === "string" ? payload.sub : undefined,
		saleorAuthToken: typeof payload.saleorAuthToken === "string" ? payload.saleorAuthToken : undefined,
		isStaff: payload.isStaff === true,
		isSuperuser: payload.isSuperuser === true,
		permissions: Array.isArray(payload.permissions) ? payload.permissions.filter(Boolean) : [],
	};
}

export function authorizeStorefrontBuilderRequest(
	request: NextRequest,
	options: BuilderAuthorizationOptions = {},
): BuilderAuthorizationResult {
	const secret = process.env.STOREFRONT_BUILDER_SECRET;
	if (!secret) {
		return {
			ok: false,
			status: 500,
			error: "STOREFRONT_BUILDER_SECRET is not configured",
		};
	}

	const requireSessionInDev = process.env.STOREFRONT_BUILDER_REQUIRE_SESSION === "true";
	if (process.env.NODE_ENV !== "production" && !requireSessionInDev) {
		return {
			ok: true,
			status: 200,
			session: {
				isStaff: false,
				isSuperuser: false,
				permissions: [],
			},
		};
	}

	const token = request.cookies.get(STOREFRONT_BUILDER_SESSION_COOKIE)?.value || "";
	if (!token) {
		return {
			ok: false,
			status: 401,
			error: "Missing storefront builder session",
		};
	}

	const payload = verifyStorefrontBuilderSessionToken(token, secret);
	if (!payload) {
		return {
			ok: false,
			status: 401,
			error: "Invalid storefront builder session",
		};
	}
	const session = toSessionContext(payload);
	if (options.requireWriteAccess) {
		if (!session.isStaff) {
			return {
				ok: false,
				status: 403,
				error: "Staff membership required for builder writes",
			};
		}
		if (!session.isSuperuser) {
			const requiredPermissions = Array.isArray(options.requiredPermissions)
				? options.requiredPermissions
				: getRequiredWritePermissions();
			if (requiredPermissions.length > 0) {
				const hasPermission = session.permissions.some((code) => requiredPermissions.includes(code));
				if (!hasPermission) {
					return {
						ok: false,
						status: 403,
						error: `Missing required permission (${requiredPermissions.join(", ")})`,
					};
				}
			}
		}
	}

	return {
		ok: true,
		status: 200,
		session,
	};
}
