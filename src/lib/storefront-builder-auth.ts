import { createHmac, timingSafeEqual } from "crypto";

export const STOREFRONT_BUILDER_SESSION_COOKIE = "fq_sb_session";

export type StorefrontBuilderSessionPayload = {
	exp: number;
	iat: number;
	iss?: string;
	sub?: string;
	saleorAuthToken?: string;
	saleorApiOrigin?: string;
	isStaff?: boolean;
	isSuperuser?: boolean;
	permissions?: string[];
};

function toBase64Url(input: Buffer | string): string {
	return Buffer.from(input).toString("base64url");
}

function fromBase64Url(input: string): Buffer {
	return Buffer.from(input, "base64url");
}

function safeJsonParse<T>(value: string): T | null {
	try {
		return JSON.parse(value) as T;
	} catch {
		return null;
	}
}

function signPayload(payloadBase64: string, secret: string): string {
	return toBase64Url(createHmac("sha256", secret).update(payloadBase64).digest());
}

export function parseJwtPayload(token: string): Record<string, unknown> | null {
	const parts = token.split(".");
	if (parts.length !== 3) return null;
	const payloadPart = parts[1];
	if (!payloadPart) return null;
	const raw = fromBase64Url(payloadPart).toString("utf-8");
	const payload = safeJsonParse<Record<string, unknown>>(raw);
	return payload && typeof payload === "object" ? payload : null;
}

export function isJwtTokenUsable(token: string): { ok: boolean; exp?: number; iss?: string } {
	const payload = parseJwtPayload(token);
	if (!payload) {
		return { ok: false };
	}
	const expRaw = payload.exp;
	const exp = typeof expRaw === "number" ? expRaw : Number(expRaw);
	if (!Number.isFinite(exp) || exp <= 0) {
		return { ok: false };
	}
	const now = Math.floor(Date.now() / 1000);
	if (exp <= now) {
		return { ok: false };
	}
	const iss = typeof payload.iss === "string" ? payload.iss : undefined;
	return { ok: true, exp, iss };
}

export function createStorefrontBuilderSessionToken(input: {
	exp: number;
	secret: string;
	iss?: string;
}): string {
	const payload: StorefrontBuilderSessionPayload = {
		exp: input.exp,
		iat: Math.floor(Date.now() / 1000),
		iss: input.iss,
	};
	const payloadBase64 = toBase64Url(JSON.stringify(payload));
	const signature = signPayload(payloadBase64, input.secret);
	return `${payloadBase64}.${signature}`;
}

export function createStorefrontBuilderSessionTokenWithClaims(input: {
	exp: number;
	secret: string;
	iss?: string;
	sub?: string;
	saleorAuthToken?: string;
	saleorApiOrigin?: string;
	isStaff?: boolean;
	isSuperuser?: boolean;
	permissions?: string[];
}): string {
	const payload: StorefrontBuilderSessionPayload = {
		exp: input.exp,
		iat: Math.floor(Date.now() / 1000),
		iss: input.iss,
		sub: input.sub,
		saleorAuthToken: input.saleorAuthToken,
		saleorApiOrigin: input.saleorApiOrigin,
		isStaff: input.isStaff,
		isSuperuser: input.isSuperuser,
		permissions: Array.isArray(input.permissions) ? input.permissions : undefined,
	};
	const payloadBase64 = toBase64Url(JSON.stringify(payload));
	const signature = signPayload(payloadBase64, input.secret);
	return `${payloadBase64}.${signature}`;
}

export function verifyStorefrontBuilderSessionToken(
	token: string,
	secret: string,
): StorefrontBuilderSessionPayload | null {
	const [payloadBase64, signature] = token.split(".");
	if (!payloadBase64 || !signature) return null;
	const expectedSignature = signPayload(payloadBase64, secret);
	try {
		if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
			return null;
		}
	} catch {
		return null;
	}
	const payloadRaw = fromBase64Url(payloadBase64).toString("utf-8");
	const payload = safeJsonParse<StorefrontBuilderSessionPayload>(payloadRaw);
	if (!payload || typeof payload.exp !== "number") return null;
	const now = Math.floor(Date.now() / 1000);
	if (payload.exp <= now) return null;
	return payload;
}
