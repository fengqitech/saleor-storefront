import "server-only";

import { type NextRequest } from "next/server";

type ProxyOptions = {
	origin: string;
	path: string;
	method: "GET" | "PUT" | "POST";
	bodyText?: string;
};

type ProxyResult = {
	status: number;
	ok: boolean;
	data: unknown;
};

function firstHeaderValue(value: string | null): string | null {
	if (!value) return null;
	const parts = value
		.split(",")
		.map((part) => part.trim())
		.filter(Boolean);
	return parts[0] || null;
}

export function getPublicRequestOrigin(request: NextRequest): string {
	const forwardedProto = firstHeaderValue(request.headers.get("x-forwarded-proto"));
	const forwardedHost = firstHeaderValue(request.headers.get("x-forwarded-host"));
	const host = forwardedHost || request.headers.get("host") || request.nextUrl.host;
	const proto = forwardedProto || request.nextUrl.protocol.replace(":", "") || "https";
	return `${proto}://${host}`;
}

export async function proxyStorefrontBuilderRequest(options: ProxyOptions): Promise<ProxyResult> {
	const { origin, path, method, bodyText } = options;
	const builderSecret = process.env.STOREFRONT_BUILDER_SECRET;
	if (!builderSecret) {
		return {
			status: 500,
			ok: false,
			data: { error: "STOREFRONT_BUILDER_SECRET is not configured in storefront runtime" },
		};
	}

	const target = `${origin}${path}`;
	const headers: Record<string, string> = {
		"X-Storefront-Builder-Secret": builderSecret,
	};
	if (method !== "GET") {
		headers["Content-Type"] = "application/json";
	}

	let response: Response;
	try {
		response = await fetch(target, {
			method,
			headers,
			body: method === "GET" ? undefined : bodyText || "{}",
			cache: "no-store",
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Upstream fetch failed";
		return {
			status: 502,
			ok: false,
			data: {
				error: "Upstream fetch failed",
				message,
			},
		};
	}

	const contentType = response.headers.get("content-type") || "";
	let data: unknown = null;
	if (contentType.includes("application/json")) {
		data = await response.json().catch(() => null);
	} else {
		data = { error: await response.text().catch(() => "Unexpected upstream response") };
	}

	return {
		status: response.status,
		ok: response.ok,
		data,
	};
}

export async function triggerHomepageRevalidate(
	origin: string,
	channel: string,
): Promise<{
	attempted: boolean;
	ok: boolean;
	status?: number;
	error?: string;
}> {
	const secret = process.env.REVALIDATE_SECRET;
	if (!secret || !channel) {
		return {
			attempted: false,
			ok: false,
			error: "Missing REVALIDATE_SECRET or channel",
		};
	}
	const url = new URL("/api/revalidate", origin);
	url.searchParams.set("secret", secret);
	url.searchParams.set("path", `/${channel}`);
	try {
		const response = await fetch(url.toString(), {
			method: "GET",
			cache: "no-store",
		});
		if (!response.ok) {
			return {
				attempted: true,
				ok: false,
				status: response.status,
				error: `Revalidate endpoint returned HTTP ${response.status}`,
			};
		}
		return {
			attempted: true,
			ok: true,
			status: response.status,
		};
	} catch (error) {
		return {
			attempted: true,
			ok: false,
			error: error instanceof Error ? error.message : "Revalidate request failed",
		};
	}
}
