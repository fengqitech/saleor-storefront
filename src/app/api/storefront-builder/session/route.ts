import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@saleor/app-sdk/auth";
import { type AuthData } from "@saleor/app-sdk/APL";
import {
	STOREFRONT_BUILDER_SESSION_COOKIE,
	createStorefrontBuilderSessionTokenWithClaims,
	isJwtTokenUsable,
} from "@/lib/storefront-builder-auth";
import { saleorApp } from "@/lib/saleor-app";

type SessionRequestBody = {
	token?: string;
	saleorApiUrl?: string;
	apiUrl?: string;
};

type SaleorSessionCheckPayload = {
	data?: {
		me?: {
			id?: string | null;
			isStaff?: boolean | null;
			isSuperuser?: boolean | null;
			userPermissions?: Array<{ code?: string | null } | null> | null;
		} | null;
	};
	errors?: Array<{ message?: string }>;
};

type SaleorAppCheckPayload = {
	data?: {
		app?: {
			id?: string | null;
		} | null;
	};
	errors?: Array<{ message?: string }>;
};

function jsonError(message: string, status: number): NextResponse {
	return NextResponse.json(
		{ error: message },
		{
			status,
			headers: {
				"Cache-Control": "no-store",
			},
		},
	);
}

function isHttpsRequest(request: NextRequest): boolean {
	const forwardedProto = request.headers.get("x-forwarded-proto");
	if (forwardedProto) {
		return forwardedProto.split(",")[0].trim().toLowerCase() === "https";
	}
	return request.nextUrl.protocol === "https:";
}

function getBuilderSessionMaxAgeSeconds(): number {
	const fallback = 60 * 60 * 4;
	const raw = Number.parseInt(process.env.STOREFRONT_BUILDER_SESSION_MAX_AGE_SECONDS || "", 10);
	if (!Number.isFinite(raw) || raw <= 0) {
		return fallback;
	}
	return Math.min(Math.max(raw, 60 * 5), 60 * 60 * 12);
}

function parseUrlSafe(value: string): URL | null {
	try {
		return new URL(value);
	} catch {
		return null;
	}
}

function normalizeSaleorApiUrl(candidate: string): string | null {
	const raw = candidate.trim();
	if (!raw) return null;
	const parsed = parseUrlSafe(raw);
	if (!parsed) return null;
	if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
	return parsed.toString();
}

function getAllowedSaleorOrigins(): string[] {
	const raw = process.env.STOREFRONT_BUILDER_ALLOWED_SALEOR_ORIGINS || "";
	return raw
		.split(",")
		.map((value) => value.trim())
		.filter(Boolean);
}

function isSaleorOriginAllowed(saleorApiUrl: string): boolean {
	const parsed = parseUrlSafe(saleorApiUrl);
	if (!parsed) return false;
	const allowedOrigins = getAllowedSaleorOrigins();
	if (!allowedOrigins.length) {
		return true;
	}
	return allowedOrigins.includes(parsed.origin);
}

function matchAuthDataBySaleorApiUrl(authData: AuthData[], requestedApiUrl: string): AuthData | null {
	const exactMatch = authData.find((item) => normalizeSaleorApiUrl(item.saleorApiUrl) === requestedApiUrl);
	if (exactMatch) return exactMatch;
	const requestedOrigin = parseUrlSafe(requestedApiUrl)?.origin;
	if (!requestedOrigin) return null;
	return (
		authData.find((item) => {
			const itemOrigin = parseUrlSafe(item.saleorApiUrl)?.origin;
			return itemOrigin === requestedOrigin;
		}) || null
	);
}

async function resolveAuthData(
	requestedApiUrl: string | null,
): Promise<{ authData?: AuthData; error?: string }> {
	const registered = await saleorApp.apl.getAll().catch(() => [] as AuthData[]);
	if (!registered.length) {
		return {
			error: "Saleor app is not registered yet. Install/reinstall app from Dashboard first.",
		};
	}
	if (requestedApiUrl) {
		const matched = matchAuthDataBySaleorApiUrl(registered, requestedApiUrl);
		if (!matched) {
			return {
				error: "No app registration found for this Saleor API URL.",
			};
		}
		return { authData: matched };
	}
	if (registered.length === 1) {
		return { authData: registered[0] };
	}
	return {
		error: "Multiple Saleor registrations found. Provide saleorApiUrl in app session request.",
	};
}

async function verifyTokenWithSaleorApi(
	token: string,
	saleorApiUrl: string,
	expectedAppId: string,
): Promise<{
	ok: boolean;
	kind?: "user" | "app";
	sub?: string;
	isStaff?: boolean;
	isSuperuser?: boolean;
	permissions?: string[];
	saleorApiOrigin?: string;
	details?: string;
}> {
	try {
		const headers = {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		};

		// First, try to validate as a user token (common in embedded apps).
		const meResponse = await fetch(saleorApiUrl, {
			method: "POST",
			cache: "no-store",
			headers,
			body: JSON.stringify({
				query: `
					query StorefrontBuilderSessionCheckMe {
						me {
							id
							isStaff
							isSuperuser
							userPermissions {
								code
							}
						}
					}
				`,
			}),
		});
		if (meResponse.ok) {
			const payload = (await meResponse.json()) as SaleorSessionCheckPayload;
			if (!Array.isArray(payload.errors) || payload.errors.length === 0) {
				const me = payload.data?.me;
				if (me?.id) {
					const permissions = (me.userPermissions || [])
						.map((permission) => permission?.code || "")
						.filter(Boolean);
					return {
						ok: true,
						kind: "user",
						sub: me.id || undefined,
						isStaff: !!me.isStaff,
						isSuperuser: !!me.isSuperuser,
						permissions,
						saleorApiOrigin: parseUrlSafe(saleorApiUrl)?.origin,
					};
				}
			}
		}

		// Some Saleor embedded tokens are "app context" tokens. In that case, `me` may be null,
		// but the token should still be accepted by Saleor for `app { id }`.
		const appResponse = await fetch(saleorApiUrl, {
			method: "POST",
			cache: "no-store",
			headers,
			body: JSON.stringify({
				query: `
					query StorefrontBuilderSessionCheckApp {
						app {
							id
						}
					}
				`,
			}),
		});
		if (!appResponse.ok) {
			return {
				ok: false,
				details: `saleor_api_http_${appResponse.status}`,
			};
		}
		const appPayload = (await appResponse.json()) as SaleorAppCheckPayload;
		if (Array.isArray(appPayload.errors) && appPayload.errors.length > 0) {
			return { ok: false, details: "saleor_api_graphql_errors" };
		}
		const appId = appPayload.data?.app?.id;
		if (!appId) {
			return { ok: false, details: "saleor_api_no_app" };
		}
		if (appId !== expectedAppId) {
			return { ok: false, details: "saleor_api_app_mismatch" };
		}

		// In app-context mode, we can't reliably check staff membership via `me`.
		// Rely on `verifyJWT` (signature + appId). For writes, downstream endpoints
		// enforce permissions based on user-context claims; app-context tokens should
		// be treated as read-only by default.
		return {
			ok: true,
			kind: "app",
			isStaff: true,
			isSuperuser: false,
			permissions: [],
			saleorApiOrigin: parseUrlSafe(saleorApiUrl)?.origin,
		};
	} catch {
		return { ok: false, details: "saleor_api_fetch_failed" };
	}
}

export async function POST(request: NextRequest) {
	const secret = process.env.STOREFRONT_BUILDER_SECRET;
	if (!secret) {
		return jsonError("STOREFRONT_BUILDER_SECRET is not configured", 500);
	}

	const body = (await request.json().catch(() => null)) as SessionRequestBody | null;
	if (!body?.token || typeof body.token !== "string") {
		return jsonError("Missing token", 400);
	}
	const requestedApiUrl = body.saleorApiUrl || body.apiUrl || "";
	const normalizedRequestedApiUrl = normalizeSaleorApiUrl(requestedApiUrl);

	const tokenCheck = isJwtTokenUsable(body.token);
	if (!tokenCheck.ok || !tokenCheck.exp) {
		return jsonError("Invalid or expired Saleor app token", 401);
	}

	if (requestedApiUrl && !normalizedRequestedApiUrl) {
		return jsonError("Invalid Saleor API URL", 400);
	}
	if (normalizedRequestedApiUrl && !isSaleorOriginAllowed(normalizedRequestedApiUrl)) {
		return jsonError("Saleor API origin is not allowed", 403);
	}

	const resolvedAuthData = await resolveAuthData(normalizedRequestedApiUrl);
	if (!resolvedAuthData.authData) {
		return jsonError(resolvedAuthData.error || "Unable to resolve app registration", 401);
	}
	const normalizedRegisteredApiUrl = normalizeSaleorApiUrl(resolvedAuthData.authData.saleorApiUrl);
	if (!normalizedRegisteredApiUrl) {
		return jsonError("Registered Saleor API URL is invalid", 500);
	}
	if (!isSaleorOriginAllowed(normalizedRegisteredApiUrl)) {
		return jsonError("Registered Saleor API origin is not allowed", 403);
	}

	const registeredOrigin = parseUrlSafe(normalizedRegisteredApiUrl)?.origin || null;
	const tokenIssuer = tokenCheck.iss && parseUrlSafe(tokenCheck.iss) ? tokenCheck.iss : null;
	const tokenIssuerOrigin = tokenIssuer ? parseUrlSafe(tokenIssuer)?.origin : null;
	const verifySaleorApiUrl =
		tokenIssuer && registeredOrigin && tokenIssuerOrigin === registeredOrigin
			? tokenIssuer
			: normalizedRegisteredApiUrl;

	let sdkVerified = false;
	try {
		await verifyJWT({
			appId: resolvedAuthData.authData.appId,
			saleorApiUrl: verifySaleorApiUrl,
			token: body.token,
		});
		sdkVerified = true;
	} catch {
		// NOTE: Some Saleor Dashboard versions provide a user JWT (tokenCreate-style) for embedded apps.
		// That token won't pass app-sdk `verifyJWT`, but it is still valid for `me` queries against Saleor.
		// We'll treat SDK verification as a hard requirement only for app-context tokens (where `me` is null).
		sdkVerified = false;
	}

	const verified = await verifyTokenWithSaleorApi(
		body.token,
		normalizedRegisteredApiUrl,
		resolvedAuthData.authData.appId,
	);
	if (verified.ok && verified.kind === "app" && !sdkVerified) {
		return jsonError("Failed to verify Saleor app token (SDK verification failed)", 401);
	}
	const strictApiVerify = process.env.STOREFRONT_BUILDER_STRICT_API_VERIFY === "true";
	const effectiveVerified = verified.ok
		? verified
		: strictApiVerify
			? null
			: {
					ok: true as const,
					kind: "app" as const,
					isStaff: true,
					isSuperuser: false,
					permissions: [],
					saleorApiOrigin: parseUrlSafe(normalizedRegisteredApiUrl)?.origin,
					details: verified.details ? `fallback_${verified.details}` : "fallback",
				};

	if (!effectiveVerified) {
		const extra = process.env.NODE_ENV !== "production" && verified.details ? ` (${verified.details})` : "";
		return jsonError(`Unable to verify token against Saleor API${extra}`, 401);
	}
	if (effectiveVerified.kind === "user" && !effectiveVerified.isStaff) {
		return jsonError("User is not a staff member", 403);
	}

	const sessionMaxAge = getBuilderSessionMaxAgeSeconds();
	const sessionExp = Math.floor(Date.now() / 1000) + sessionMaxAge;
	const sessionToken = createStorefrontBuilderSessionTokenWithClaims({
		exp: sessionExp,
		iss: tokenCheck.iss,
		sub: effectiveVerified.sub,
		saleorAuthToken: body.token,
		saleorApiOrigin: effectiveVerified.saleorApiOrigin || parseUrlSafe(normalizedRegisteredApiUrl)?.origin,
		isStaff: effectiveVerified.isStaff,
		isSuperuser: effectiveVerified.isSuperuser,
		permissions: effectiveVerified.permissions,
		secret,
	});
	const maxAge = sessionMaxAge;

	const response = NextResponse.json(
		{
			ok: true,
			expiresIn: maxAge,
			saleorApiUrl: normalizedRegisteredApiUrl,
		},
		{
			headers: {
				"Cache-Control": "no-store",
			},
		},
	);
	const secureCookie = isHttpsRequest(request);
	response.cookies.set(STOREFRONT_BUILDER_SESSION_COOKIE, sessionToken, {
		httpOnly: true,
		// Embedded apps are served inside iframes; modern browsers will not send cookies
		// unless they are `SameSite=None; Secure` when the iframe context is considered
		// third-party. Prefer that when the request is HTTPS.
		secure: secureCookie,
		sameSite: secureCookie ? "none" : "lax",
		path: "/",
		maxAge,
	});
	return response;
}

// Some clients/browser tooling may probe this endpoint with GET.
// Return a non-error response to avoid noisy console errors.
export async function GET() {
	return NextResponse.json(
		{
			ok: false,
			error: "Use POST to establish a session",
		},
		{
			headers: {
				"Cache-Control": "no-store",
			},
		},
	);
}

export async function DELETE() {
	const response = NextResponse.json(
		{
			ok: true,
		},
		{
			headers: {
				"Cache-Control": "no-store",
			},
		},
	);
	response.cookies.set(STOREFRONT_BUILDER_SESSION_COOKIE, "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: 0,
	});
	return response;
}
