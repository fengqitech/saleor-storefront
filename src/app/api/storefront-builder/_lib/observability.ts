import "server-only";

type BuilderOutcome = "ok" | "auth_denied" | "upstream_error" | "revalidate_failed" | "internal_error";

const BUILDER_OBSERVABILITY_PREFIX = "[Builder-Observability]";

export function logStorefrontBuilderApiEvent(params: {
	endpoint: "theme" | "homepage-layout" | "commerce-layout" | "starter-kits" | "assets";
	method: "GET" | "PUT" | "POST";
	status: number;
	durationMs: number;
	outcome: BuilderOutcome;
	tenantCode?: string;
	channel?: string;
	action?: string;
	error?: string;
	deadLetterCount?: number;
	deadLetterStaleCount?: number;
	deadLetterOldestStaleAgeSeconds?: number;
	deadLetterAlertTriggered?: boolean;
	deadLetterSweepSource?: "manual" | "scheduled";
	deadLetterSweepDryRun?: boolean;
	deadLetterSweepProcessedCount?: number;
	deadLetterSweepDeliveredCount?: number;
	deadLetterSweepFailedCount?: number;
}) {
	const payload = {
		endpoint: params.endpoint,
		method: params.method,
		status: params.status,
		durationMs: params.durationMs,
		outcome: params.outcome,
		...(params.tenantCode ? { tenantCode: params.tenantCode } : {}),
		...(params.channel ? { channel: params.channel } : {}),
		...(params.action ? { action: params.action } : {}),
		...(params.error ? { error: params.error } : {}),
		...(Number.isFinite(params.deadLetterCount) ? { deadLetterCount: params.deadLetterCount } : {}),
		...(Number.isFinite(params.deadLetterStaleCount)
			? { deadLetterStaleCount: params.deadLetterStaleCount }
			: {}),
		...(Number.isFinite(params.deadLetterOldestStaleAgeSeconds)
			? { deadLetterOldestStaleAgeSeconds: params.deadLetterOldestStaleAgeSeconds }
			: {}),
		...(typeof params.deadLetterAlertTriggered === "boolean"
			? { deadLetterAlertTriggered: params.deadLetterAlertTriggered }
			: {}),
		...(params.deadLetterSweepSource ? { deadLetterSweepSource: params.deadLetterSweepSource } : {}),
		...(typeof params.deadLetterSweepDryRun === "boolean"
			? { deadLetterSweepDryRun: params.deadLetterSweepDryRun }
			: {}),
		...(Number.isFinite(params.deadLetterSweepProcessedCount)
			? { deadLetterSweepProcessedCount: params.deadLetterSweepProcessedCount }
			: {}),
		...(Number.isFinite(params.deadLetterSweepDeliveredCount)
			? { deadLetterSweepDeliveredCount: params.deadLetterSweepDeliveredCount }
			: {}),
		...(Number.isFinite(params.deadLetterSweepFailedCount)
			? { deadLetterSweepFailedCount: params.deadLetterSweepFailedCount }
			: {}),
	};
	console.log(`${BUILDER_OBSERVABILITY_PREFIX} ${JSON.stringify(payload)}`);
}
