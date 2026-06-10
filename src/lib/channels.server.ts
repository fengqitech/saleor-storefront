import "server-only";

import { ChannelsListDocument } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";
import { DefaultChannelSlug } from "@/app/config";

function unique(values: string[]): string[] {
	return Array.from(new Set(values.filter(Boolean)));
}

function mergeHeaders(base?: HeadersInit, extra?: Record<string, string>): HeadersInit | undefined {
	if (!base && !extra) {
		return undefined;
	}
	const headers = new Headers(base);
	for (const [key, value] of Object.entries(extra || {})) {
		headers.set(key, value);
	}
	return headers;
}

export async function getActiveChannelSlugs(options?: {
	headers?: HeadersInit;
	saleorApiUrl?: string;
}): Promise<string[]> {
	const channels: string[] = [];

	if (DefaultChannelSlug) {
		channels.push(DefaultChannelSlug);
	}

	if (!process.env.SALEOR_APP_TOKEN) {
		return unique(channels);
	}

	const result = await executePublicGraphQL(ChannelsListDocument, {
		headers: mergeHeaders(options?.headers, {
			Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
		}),
		saleorApiUrl: options?.saleorApiUrl,
	});

	if (!result.ok || !result.data.channels) {
		console.warn(
			"[Channels] Failed to discover active channels:",
			result.ok ? "No channels data" : result.error.message,
		);
		return unique(channels);
	}

	for (const channel of result.data.channels) {
		if (channel.isActive && channel.slug) {
			channels.push(channel.slug);
		}
	}

	return unique(channels);
}
