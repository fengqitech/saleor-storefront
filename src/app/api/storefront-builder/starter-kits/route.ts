import { NextRequest } from "next/server";
import {
	getPublicRequestOrigin,
	proxyStorefrontBuilderRequest,
	triggerHomepageRevalidate,
} from "../_lib/upstream";
import { authorizeStorefrontBuilderRequest, type BuilderSessionContext } from "../_lib/auth";
import { logStorefrontBuilderApiEvent } from "../_lib/observability";

const LARGE_PROVISION_OPERATION_ENTITY_THRESHOLD = Number.isFinite(
	Number.parseInt(process.env.STOREFRONT_BUILDER_PROVISION_GUARDRAIL_MAX_ENTITIES || "20", 10),
)
	? Math.max(1, Number.parseInt(process.env.STOREFRONT_BUILDER_PROVISION_GUARDRAIL_MAX_ENTITIES || "20", 10))
	: 20;

type StarterKitRefs = {
	suggestedMenus?: string[];
	suggestedPages?: string[];
};

type GuardrailNotificationSummary = {
	attempted?: number;
	delivered?: number;
	failed?: number;
	retryAttempts?: number;
	deadLetters?: number;
	deadLetterIds?: string[];
	channels?: string[];
	errors?: string[];
};

type GuardrailNotificationDeadLetter = {
	id?: string;
	createdAt?: string;
	updatedAt?: string;
	proposalId?: string;
	actor?: string;
	actorId?: string;
	kind?: string;
	label?: string;
	targetUrl?: string;
	attempts?: number;
	retryAttempts?: number;
	maxRetries?: number;
	lastError?: string;
};

type GuardrailNotificationRetryResult = {
	deadLetterId?: string;
	proposalId?: string;
	label?: string;
	kind?: string;
	targetUrl?: string;
	successful?: boolean;
	attempts?: number;
	retryAttempts?: number;
	maxRetries?: number;
	retriedAt?: string;
	error?: string;
};

type GuardrailNotificationDeadLetterStatus = {
	deadLetterCount?: number;
	staleCount?: number;
	oldestStaleAgeSeconds?: number;
	staleAfterSeconds?: number;
	alert?: {
		triggered?: boolean;
		minStaleCount?: number;
		staleAgeThresholdSeconds?: number;
	};
};

type GuardrailNotificationSweepSummary = {
	dryRun?: boolean;
	scheduled?: boolean;
	staleAfterSeconds?: number;
	maxItems?: number;
	discoveredStaleCount?: number;
	processedCount?: number;
	deliveredCount?: number;
	failedCount?: number;
	retryAttempts?: number;
};

type StarterKitsResponsePayload = {
	tenant?: {
		channel?: string;
		code?: string;
		domain?: string;
	};
	action?: string;
	mode?: string;
	changed?: boolean;
	guardrailPolicy?: StarterKitGuardrailPolicy;
	guardrailPolicyPending?: Record<string, unknown> | null;
	guardrailNotificationDeadLetters?: GuardrailNotificationDeadLetter[];
	guardrailNotificationDeadLetterStatus?: GuardrailNotificationDeadLetterStatus;
	notification?: GuardrailNotificationSummary;
	notificationRetry?: GuardrailNotificationRetryResult;
	deadLetterSweep?: GuardrailNotificationSweepSummary;
	deadLetterSweepScheduled?: GuardrailNotificationSweepSummary | null;
	saleorRefs?: StarterKitRefs;
	auditEntry?: StarterKitAuditEntry;
	targetAuditEntry?: StarterKitAuditEntry;
	[key: string]: unknown;
};

type StarterKitRequestPayload = {
	action?: string;
	mode?: string;
	auditId?: string;
	deadLetterId?: string;
	dryRun?: boolean;
	maxItems?: number;
	staleAfterSeconds?: number;
	provisionSaleor?: boolean;
	rollbackProvisionedSaleor?: boolean;
	restoreProvisionedSaleor?: boolean;
	rollbackProvisionScope?: ProvisioningScope;
	restoreProvisionScope?: ProvisioningScope;
	restoreConflictPolicy?: RestoreConflictPolicy;
	rollbackProvisionSelection?: ProvisioningSelection;
	restoreProvisionSelection?: ProvisioningSelection;
	confirmLargeProvisionOperation?: boolean;
	guardrailBypassRequested?: boolean;
	allowSelfApprovalOverride?: boolean;
};

type StarterKitGuardrailPolicy = {
	maxEntities: number;
	bypass: {
		superuser: boolean;
		permissions: string[];
	};
	updatedAt?: string;
	updatedBy?: string;
};

type GuardrailDecision = {
	operation: "rollback" | "restore";
	maxEntities: number;
	targetCount: number;
	confirmationProvided: boolean;
	bypassRequested: boolean;
	bypassEligible: boolean;
	bypassUsed: boolean;
	evaluatedAt: string;
};

type ProvisioningSectionResult = {
	created: string[];
	existing: string[];
	skipped: string[];
	errors: Array<{ key: string; message: string }>;
};

type SaleorProvisioningResult = {
	enabled: boolean;
	changed: boolean;
	saleorApiUrl?: string;
	warnings: string[];
	menus: ProvisioningSectionResult;
	pages: ProvisioningSectionResult;
};

type ProvisioningRollbackSectionResult = {
	deleted: string[];
	skipped: string[];
	errors: Array<{ key: string; message: string }>;
};

type SaleorProvisioningRollbackResult = {
	enabled: boolean;
	changed: boolean;
	saleorApiUrl?: string;
	warnings: string[];
	menus: ProvisioningRollbackSectionResult;
	pages: ProvisioningRollbackSectionResult;
};

type SaleorProvisioningRestoreResult = {
	enabled: boolean;
	changed: boolean;
	saleorApiUrl?: string;
	warnings: string[];
	source?: string;
	conflictPolicy?: RestoreConflictPolicy;
	menus: ProvisioningSectionResult;
	pages: ProvisioningSectionResult;
};

type ProvisioningRollbackPreviewSectionResult = {
	wouldDelete: string[];
	missing: string[];
	skipped: string[];
	errors: Array<{ key: string; message: string }>;
};

type SaleorProvisioningRollbackPreviewResult = {
	enabled: boolean;
	changed: boolean;
	saleorApiUrl?: string;
	warnings: string[];
	scope: ProvisioningScope;
	guardrail?: {
		maxEntities: number;
		selectedCount: number;
		confirmationRequired: boolean;
		bypassEligible: boolean;
	};
	menus: ProvisioningRollbackPreviewSectionResult;
	pages: ProvisioningRollbackPreviewSectionResult;
};

type ProvisioningRestorePreviewSectionResult = {
	wouldCreate: string[];
	existing: string[];
	skipped: string[];
	conflicts: string[];
	errors: Array<{ key: string; message: string }>;
};

type SaleorProvisioningRestorePreviewResult = {
	enabled: boolean;
	changed: boolean;
	saleorApiUrl?: string;
	warnings: string[];
	source?: string;
	scope: ProvisioningScope;
	conflictPolicy: RestoreConflictPolicy;
	guardrail?: {
		maxEntities: number;
		selectedCount: number;
		confirmationRequired: boolean;
		bypassEligible: boolean;
	};
	menus: ProvisioningRestorePreviewSectionResult;
	pages: ProvisioningRestorePreviewSectionResult;
};

type ProvisioningScope = {
	menus: boolean;
	pages: boolean;
};

type ProvisioningSelection = {
	menus: string[];
	pages: string[];
};

type ProvisioningTargetSlugs = {
	menus: string[];
	pages: string[];
};

type RestoreConflictPolicy = "skip-existing" | "error-on-existing";

type StarterKitAuditEntry = {
	id?: string;
	type?: string;
	targetAuditId?: string;
	saleorProvisioning?: SaleorProvisioningResult;
	rollbackProvisioning?: SaleorProvisioningRollbackResult;
	restoreProvisioning?: SaleorProvisioningRestoreResult;
	restoreTargets?: {
		source?: string;
		menus?: string[];
		pages?: string[];
	};
	rollbackGuardrail?: GuardrailDecision;
	restoreGuardrail?: GuardrailDecision;
	notification?: GuardrailNotificationSummary;
	notificationRetry?: GuardrailNotificationRetryResult;
	[key: string]: unknown;
};

function jsonResponse(data: unknown, status: number) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store",
		},
	});
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseProvisioningScope(value: unknown): ProvisioningScope | undefined {
	if (!isObjectRecord(value)) return undefined;
	const hasMenus = typeof value.menus === "boolean";
	const hasPages = typeof value.pages === "boolean";
	if (!hasMenus && !hasPages) return undefined;
	return {
		menus: hasMenus ? value.menus === true : true,
		pages: hasPages ? value.pages === true : true,
	};
}

function parseProvisioningSelection(value: unknown): ProvisioningSelection | undefined {
	if (!isObjectRecord(value)) return undefined;
	const menus = asArrayOfStrings(value.menus);
	const pages = asArrayOfStrings(value.pages);
	if (menus.length === 0 && pages.length === 0) return undefined;
	return { menus, pages };
}

function parseBody(bodyText: string | undefined): StarterKitRequestPayload {
	if (!bodyText) return {};
	try {
		const parsed = JSON.parse(bodyText) as Record<string, unknown>;
		const parsedRollbackScope = parseProvisioningScope(parsed.rollbackProvisionScope);
		const parsedRestoreScope = parseProvisioningScope(parsed.restoreProvisionScope);
		const parsedRollbackSelection = parseProvisioningSelection(parsed.rollbackProvisionSelection);
		const parsedRestoreSelection = parseProvisioningSelection(parsed.restoreProvisionSelection);
		const restoreConflictPolicy: RestoreConflictPolicy =
			parsed.restoreConflictPolicy === "error-on-existing" ? "error-on-existing" : "skip-existing";
		return {
			action: typeof parsed.action === "string" ? parsed.action : undefined,
			mode: typeof parsed.mode === "string" ? parsed.mode : undefined,
			auditId: typeof parsed.auditId === "string" ? parsed.auditId : undefined,
			deadLetterId: typeof parsed.deadLetterId === "string" ? parsed.deadLetterId : undefined,
			dryRun: parsed.dryRun === true,
			maxItems: Number.isInteger(parsed.maxItems) ? Number(parsed.maxItems) : undefined,
			staleAfterSeconds: Number.isInteger(parsed.staleAfterSeconds)
				? Number(parsed.staleAfterSeconds)
				: undefined,
			provisionSaleor: parsed.provisionSaleor === true,
			rollbackProvisionedSaleor: parsed.rollbackProvisionedSaleor === true,
			restoreProvisionedSaleor: parsed.restoreProvisionedSaleor !== false,
			rollbackProvisionScope: parsedRollbackScope || { menus: true, pages: true },
			restoreProvisionScope: parsedRestoreScope || { menus: true, pages: true },
			restoreConflictPolicy,
			rollbackProvisionSelection: parsedRollbackSelection,
			restoreProvisionSelection: parsedRestoreSelection,
			confirmLargeProvisionOperation: parsed.confirmLargeProvisionOperation === true,
			guardrailBypassRequested: parsed.guardrailBypassRequested === true,
			allowSelfApprovalOverride: parsed.allowSelfApprovalOverride === true,
		};
	} catch {
		return {};
	}
}

function mapPreviewAction(
	action: string | undefined,
): "rollback-dry-run" | "restore-provisioned-dry-run" | undefined {
	if (action === "rollback-dry-run") return "rollback-dry-run";
	if (action === "restore-provisioned-dry-run") return "restore-provisioned-dry-run";
	return undefined;
}

function buildDeadLetterObservabilityFields(payload: StarterKitsResponsePayload) {
	const status = payload.guardrailNotificationDeadLetterStatus;
	const manualSweep = payload.deadLetterSweep;
	const scheduledSweep = payload.deadLetterSweepScheduled || undefined;
	const sweep = manualSweep || scheduledSweep;
	const sweepSource: "manual" | "scheduled" | undefined = manualSweep
		? "manual"
		: scheduledSweep
			? "scheduled"
			: undefined;
	return {
		deadLetterCount: Number.isFinite(status?.deadLetterCount) ? status?.deadLetterCount : undefined,
		deadLetterStaleCount: Number.isFinite(status?.staleCount) ? status?.staleCount : undefined,
		deadLetterOldestStaleAgeSeconds: Number.isFinite(status?.oldestStaleAgeSeconds)
			? status?.oldestStaleAgeSeconds
			: undefined,
		deadLetterAlertTriggered:
			typeof status?.alert?.triggered === "boolean" ? status.alert.triggered : undefined,
		deadLetterSweepSource: sweepSource,
		deadLetterSweepDryRun: typeof sweep?.dryRun === "boolean" ? sweep.dryRun : undefined,
		deadLetterSweepProcessedCount: Number.isFinite(sweep?.processedCount) ? sweep?.processedCount : undefined,
		deadLetterSweepDeliveredCount: Number.isFinite(sweep?.deliveredCount) ? sweep?.deliveredCount : undefined,
		deadLetterSweepFailedCount: Number.isFinite(sweep?.failedCount) ? sweep?.failedCount : undefined,
	};
}

const ACTOR_ENRICH_ACTIONS = new Set([
	"apply",
	"rollback",
	"annotate",
	"record-restore",
	"propose-guardrail-policy",
	"approve-guardrail-policy",
	"reject-guardrail-policy",
	"restore-guardrail-policy",
	"retry-guardrail-notification-dead-letter",
	"sweep-guardrail-notification-dead-letters",
]);

function enrichBodyWithActorContext(
	bodyText: string | undefined,
	method: "GET" | "POST",
	session: BuilderSessionContext | undefined,
): string | undefined {
	if (method !== "POST" || !bodyText) return bodyText;
	try {
		const parsed = JSON.parse(bodyText) as Record<string, unknown>;
		const action = typeof parsed.action === "string" ? parsed.action : "";
		if (!ACTOR_ENRICH_ACTIONS.has(action)) {
			return bodyText;
		}
		const actorFromBody = typeof parsed.actor === "string" && parsed.actor.trim() ? parsed.actor.trim() : "";
		const actorId = typeof session?.sub === "string" && session.sub.trim() ? session.sub.trim() : "";
		return JSON.stringify({
			...parsed,
			actor: actorFromBody || (actorId ? `user:${actorId}` : "storefront-builder"),
			actorId: actorId || undefined,
			actorIsSuperuser: session?.isSuperuser === true,
		});
	} catch {
		return bodyText;
	}
}

function buildInternalDryRunBody(parsedRequest: StarterKitRequestPayload): string | null {
	const previewAction = mapPreviewAction(parsedRequest.action);
	if (!previewAction) return null;
	const auditId = typeof parsedRequest.auditId === "string" ? parsedRequest.auditId.trim() : "";
	if (!auditId) return null;
	if (previewAction === "rollback-dry-run") {
		return JSON.stringify({
			action: "audit-entry",
			auditId,
		});
	}
	return JSON.stringify({
		action: "restore-provisioned",
		auditId,
	});
}

function hasValidRollbackSnapshot(auditEntry: StarterKitAuditEntry | undefined): boolean {
	if (!auditEntry) return false;
	const before = isObjectRecord(auditEntry.before) ? auditEntry.before : null;
	if (!before) return false;
	return isObjectRecord(before.theme) && isObjectRecord(before.homepageLayout);
}

function applySelection(allSlugs: string[], selection?: ProvisioningSelection["menus"]): string[] {
	if (!selection || selection.length === 0) return allSlugs;
	const selected = new Set(selection);
	return allSlugs.filter((slug) => selected.has(slug));
}

function applyScopeToTargets(
	targets: ProvisioningTargetSlugs,
	scope: ProvisioningScope,
): ProvisioningTargetSlugs {
	return {
		menus: scope.menus ? targets.menus : [],
		pages: scope.pages ? targets.pages : [],
	};
}

function countProvisioningTargets(targets: ProvisioningTargetSlugs): number {
	return targets.menus.length + targets.pages.length;
}

function normalizeGuardrailPolicy(policy: StarterKitGuardrailPolicy | undefined): StarterKitGuardrailPolicy {
	const maxEntities =
		Number.isInteger(policy?.maxEntities) && Number(policy?.maxEntities) > 0
			? Number(policy?.maxEntities)
			: LARGE_PROVISION_OPERATION_ENTITY_THRESHOLD;
	const bypassPermissions = asArrayOfStrings(policy?.bypass?.permissions);
	return {
		maxEntities,
		bypass: {
			superuser: policy?.bypass?.superuser === true,
			permissions: bypassPermissions,
		},
		updatedAt: typeof policy?.updatedAt === "string" ? policy.updatedAt : undefined,
		updatedBy: typeof policy?.updatedBy === "string" ? policy.updatedBy : undefined,
	};
}

function canBypassGuardrail(
	policy: StarterKitGuardrailPolicy,
	session: BuilderSessionContext | undefined,
): boolean {
	if (!session?.isStaff) return false;
	if (policy.bypass.superuser && session.isSuperuser) return true;
	if (policy.bypass.permissions.length === 0) return false;
	return session.permissions.some((permission) => policy.bypass.permissions.includes(permission));
}

function buildGuardrailDecision(params: {
	operation: "rollback" | "restore";
	targetCount: number;
	policy: StarterKitGuardrailPolicy;
	confirmationProvided: boolean;
	bypassRequested: boolean;
	bypassEligible: boolean;
}): GuardrailDecision {
	const bypassUsed =
		params.targetCount > params.policy.maxEntities && params.bypassRequested && params.bypassEligible;
	return {
		operation: params.operation,
		maxEntities: params.policy.maxEntities,
		targetCount: params.targetCount,
		confirmationProvided: params.confirmationProvided,
		bypassRequested: params.bypassRequested,
		bypassEligible: params.bypassEligible,
		bypassUsed,
		evaluatedAt: new Date().toISOString(),
	};
}

function asArrayOfStrings(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	return value
		.filter((item): item is string => typeof item === "string")
		.map((item) => item.trim())
		.filter(Boolean);
}

function titleFromSlug(slug: string): string {
	return slug
		.split("-")
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function normalizeSaleorApiUrl(origin: string, tenantDomain?: string): string {
	const normalizedTenantDomain = (tenantDomain || "").trim().toLowerCase();
	if (normalizedTenantDomain) {
		return `https://${normalizedTenantDomain}/graphql/`;
	}
	const configured = process.env.NEXT_PUBLIC_SALEOR_API_URL;
	if (configured && /^https?:\/\//.test(configured)) {
		return configured;
	}
	return `${origin}/graphql/`;
}

function buildTenantHeaders(
	payload: StarterKitsResponsePayload,
	request: NextRequest,
): Record<string, string> {
	const headers: Record<string, string> = {};
	const tenantDomain =
		payload.tenant?.domain ||
		request.headers.get("x-tenant-domain") ||
		request.headers.get("x-forwarded-host") ||
		"";
	const tenantCode = payload.tenant?.code || request.headers.get("x-tenant-code") || "";
	if (tenantDomain) {
		headers["X-Tenant-Domain"] = tenantDomain;
		headers["X-Forwarded-Host"] = tenantDomain;
		headers["X-Forwarded-Proto"] = "https";
	}
	if (tenantCode) {
		headers["X-Tenant-Code"] = tenantCode;
	}
	return headers;
}

async function executeSaleorAdminGraphQL<T>({
	query,
	variables,
	saleorApiUrl,
	adminToken,
	tenantHeaders,
}: {
	query: string;
	variables?: Record<string, unknown>;
	saleorApiUrl: string;
	adminToken: string;
	tenantHeaders: Record<string, string>;
}): Promise<{ ok: boolean; data?: T; error?: string }> {
	try {
		const response = await fetch(saleorApiUrl, {
			method: "POST",
			cache: "no-store",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${adminToken}`,
				...tenantHeaders,
			},
			body: JSON.stringify({
				query,
				variables: variables || {},
			}),
		});
		if (!response.ok) {
			return { ok: false, error: `Saleor API HTTP ${response.status}` };
		}
		const payload = (await response.json().catch(() => null)) as {
			data?: T;
			errors?: Array<{ message?: string }>;
		} | null;
		if (!payload) {
			return { ok: false, error: "Invalid Saleor GraphQL response" };
		}
		if (Array.isArray(payload.errors) && payload.errors.length > 0) {
			const message = payload.errors.map((error) => error.message || "Unknown GraphQL error").join("; ");
			return { ok: false, error: message };
		}
		return { ok: true, data: payload.data };
	} catch (error) {
		return { ok: false, error: error instanceof Error ? error.message : "Saleor GraphQL request failed" };
	}
}

async function ensureMenuExists(params: {
	slug: string;
	channel: string;
	saleorApiUrl: string;
	adminToken: string;
	tenantHeaders: Record<string, string>;
	result: ProvisioningSectionResult;
	existingConflictPolicy?: RestoreConflictPolicy;
}): Promise<void> {
	const menuGetQuery = `
		query StarterKitMenuGet($slug: String!, $channel: String) {
			menu(slug: $slug, channel: $channel) {
				id
				slug
			}
		}
	`;
	const existingMenu = await executeSaleorAdminGraphQL<{ menu?: { id?: string | null } | null }>({
		query: menuGetQuery,
		variables: { slug: params.slug, channel: params.channel },
		saleorApiUrl: params.saleorApiUrl,
		adminToken: params.adminToken,
		tenantHeaders: params.tenantHeaders,
	});
	if (!existingMenu.ok) {
		params.result.errors.push({
			key: params.slug,
			message: existingMenu.error || "Menu query failed",
		});
		return;
	}
	if (existingMenu.data?.menu?.id) {
		params.result.existing.push(params.slug);
		if (params.existingConflictPolicy === "error-on-existing") {
			params.result.errors.push({
				key: params.slug,
				message: "Menu already exists (conflict policy: error-on-existing)",
			});
		}
		return;
	}

	const menuCreateMutation = `
		mutation StarterKitMenuCreate($input: MenuCreateInput!) {
			menuCreate(input: $input) {
				menu {
					id
					slug
				}
				errors {
					field
					message
					code
				}
			}
		}
	`;
	const createdMenu = await executeSaleorAdminGraphQL<{
		menuCreate?: {
			menu?: { id?: string | null } | null;
			errors?: Array<{ message?: string | null } | null>;
		} | null;
	}>({
		query: menuCreateMutation,
		variables: {
			input: {
				name: titleFromSlug(params.slug),
				slug: params.slug,
			},
		},
		saleorApiUrl: params.saleorApiUrl,
		adminToken: params.adminToken,
		tenantHeaders: params.tenantHeaders,
	});
	if (!createdMenu.ok) {
		params.result.errors.push({
			key: params.slug,
			message: createdMenu.error || "Menu create failed",
		});
		return;
	}
	const createErrors = (createdMenu.data?.menuCreate?.errors || [])
		.map((error) => error?.message || "")
		.filter(Boolean);
	if (createErrors.length > 0 || !createdMenu.data?.menuCreate?.menu?.id) {
		params.result.errors.push({
			key: params.slug,
			message: createErrors.join("; ") || "Menu create returned no id",
		});
		return;
	}
	params.result.created.push(params.slug);
}

async function getFirstPageTypeId(params: {
	saleorApiUrl: string;
	adminToken: string;
	tenantHeaders: Record<string, string>;
}): Promise<{ id?: string; error?: string }> {
	const query = `
		query StarterKitFirstPageType {
			pageTypes(first: 1) {
				edges {
					node {
						id
					}
				}
			}
		}
	`;
	const response = await executeSaleorAdminGraphQL<{
		pageTypes?: {
			edges?: Array<{ node?: { id?: string | null } | null } | null> | null;
		} | null;
	}>({
		query,
		saleorApiUrl: params.saleorApiUrl,
		adminToken: params.adminToken,
		tenantHeaders: params.tenantHeaders,
	});
	if (!response.ok) {
		return { error: response.error || "Page type query failed" };
	}
	const pageTypeId = response.data?.pageTypes?.edges?.[0]?.node?.id;
	if (!pageTypeId) {
		return { error: "No page type available for page creation" };
	}
	return { id: pageTypeId };
}

function buildPlaceholderPageContent(slug: string): Record<string, unknown> {
	return {
		time: Date.now(),
		version: "2.28.2",
		blocks: [
			{
				type: "paragraph",
				data: {
					text: `This is an auto-generated starter-kit page for "${titleFromSlug(slug)}".`,
				},
			},
		],
	};
}

function formatSequenceRepairHint(errorMessage: string, tenantCode?: string): string {
	if (!errorMessage) return errorMessage;
	const normalized = errorMessage.toLowerCase();
	const looksLikeDuplicateKey =
		normalized.includes("duplicate key value violates unique constraint") ||
		normalized.includes("page_page_pkey");
	if (!looksLikeDuplicateKey) return errorMessage;

	const tenantHint = tenantCode ? `TENANT_CODE=${tenantCode}` : "TENANT_CODE=<tenant_code>";
	return `${errorMessage} (Likely Postgres sequence out-of-sync for this tenant schema. Run: scripts/repair_tenant_sequences.sh ${tenantHint} then retry.)`;
}

async function ensurePageExists(params: {
	slug: string;
	channel: string;
	pageTypeId: string;
	saleorApiUrl: string;
	adminToken: string;
	tenantHeaders: Record<string, string>;
	result: ProvisioningSectionResult;
	existingConflictPolicy?: RestoreConflictPolicy;
}): Promise<void> {
	const tenantCode =
		params.tenantHeaders["X-Tenant-Code"] || params.tenantHeaders["x-tenant-code"] || undefined;
	const pageGetQuery = `
		query StarterKitPageGet($slug: String!, $channel: String) {
			page(slug: $slug, channel: $channel) {
				id
				slug
			}
		}
	`;
	const existingPage = await executeSaleorAdminGraphQL<{ page?: { id?: string | null } | null }>({
		query: pageGetQuery,
		variables: { slug: params.slug, channel: params.channel },
		saleorApiUrl: params.saleorApiUrl,
		adminToken: params.adminToken,
		tenantHeaders: params.tenantHeaders,
	});
	if (!existingPage.ok) {
		params.result.errors.push({
			key: params.slug,
			message: existingPage.error || "Page query failed",
		});
		return;
	}
	if (existingPage.data?.page?.id) {
		params.result.existing.push(params.slug);
		if (params.existingConflictPolicy === "error-on-existing") {
			params.result.errors.push({
				key: params.slug,
				message: "Page already exists (conflict policy: error-on-existing)",
			});
		}
		return;
	}

	const pageCreateMutation = `
		mutation StarterKitPageCreate($input: PageCreateInput!) {
			pageCreate(input: $input) {
				page {
					id
					slug
				}
				errors {
					field
					message
					code
				}
			}
		}
	`;
	const createdPage = await executeSaleorAdminGraphQL<{
		pageCreate?: {
			page?: { id?: string | null } | null;
			errors?: Array<{ message?: string | null } | null>;
		} | null;
	}>({
		query: pageCreateMutation,
		variables: {
			input: {
				pageType: params.pageTypeId,
				slug: params.slug,
				title: titleFromSlug(params.slug),
				isPublished: true,
				content: JSON.stringify(buildPlaceholderPageContent(params.slug)),
			},
		},
		saleorApiUrl: params.saleorApiUrl,
		adminToken: params.adminToken,
		tenantHeaders: params.tenantHeaders,
	});
	if (!createdPage.ok) {
		params.result.errors.push({
			key: params.slug,
			message: formatSequenceRepairHint(createdPage.error || "Page create failed", tenantCode),
		});
		return;
	}
	const createErrors = (createdPage.data?.pageCreate?.errors || [])
		.map((error) => error?.message || "")
		.filter(Boolean);
	if (createErrors.length > 0 || !createdPage.data?.pageCreate?.page?.id) {
		params.result.errors.push({
			key: params.slug,
			message: formatSequenceRepairHint(createErrors.join("; ") || "Page create returned no id", tenantCode),
		});
		return;
	}
	params.result.created.push(params.slug);
}

async function provisionStarterKitSaleorResources({
	request,
	payload,
	origin,
}: {
	request: NextRequest;
	payload: StarterKitsResponsePayload;
	origin: string;
}): Promise<SaleorProvisioningResult> {
	const result: SaleorProvisioningResult = {
		enabled: true,
		changed: false,
		warnings: [],
		menus: { created: [], existing: [], skipped: [], errors: [] },
		pages: { created: [], existing: [], skipped: [], errors: [] },
	};

	const refs = payload.saleorRefs || {};
	const menuSlugs = asArrayOfStrings(refs.suggestedMenus);
	const pageSlugs = asArrayOfStrings(refs.suggestedPages);
	if (menuSlugs.length === 0 && pageSlugs.length === 0) {
		result.warnings.push("Starter kit has no Saleor refs to provision.");
		return result;
	}

	const adminToken = process.env.SALEOR_APP_TOKEN || "";
	if (!adminToken) {
		result.warnings.push("SALEOR_APP_TOKEN is missing; skipped Saleor provisioning.");
		return result;
	}

	const saleorApiUrl = normalizeSaleorApiUrl(
		origin,
		payload.tenant?.domain || request.headers.get("x-tenant-domain") || undefined,
	);
	result.saleorApiUrl = saleorApiUrl;
	const tenantHeaders = buildTenantHeaders(payload, request);
	const channel = payload.tenant?.channel || "default-channel";

	for (const menuSlug of menuSlugs) {
		await ensureMenuExists({
			slug: menuSlug,
			channel,
			saleorApiUrl,
			adminToken,
			tenantHeaders,
			result: result.menus,
		});
	}

	if (pageSlugs.length > 0) {
		const pageType = await getFirstPageTypeId({
			saleorApiUrl,
			adminToken,
			tenantHeaders,
		});
		if (!pageType.id) {
			const message = pageType.error || "No page type id found";
			result.warnings.push(message);
			for (const pageSlug of pageSlugs) {
				result.pages.skipped.push(pageSlug);
				result.pages.errors.push({
					key: pageSlug,
					message,
				});
			}
		} else {
			for (const pageSlug of pageSlugs) {
				await ensurePageExists({
					slug: pageSlug,
					channel,
					pageTypeId: pageType.id,
					saleorApiUrl,
					adminToken,
					tenantHeaders,
					result: result.pages,
				});
			}
		}
	}

	result.changed = result.menus.created.length > 0 || result.pages.created.length > 0;
	return result;
}

async function annotateStarterKitAudit({
	origin,
	auditId,
	patch,
}: {
	origin: string;
	auditId: string;
	patch: Record<string, unknown>;
}): Promise<{ ok: boolean; auditEntry?: StarterKitAuditEntry; error?: string }> {
	const annotationResult = await proxyStorefrontBuilderRequest({
		origin,
		path: "/internal/storefront-builder/starter-kits",
		method: "POST",
		bodyText: JSON.stringify({
			action: "annotate",
			auditId,
			patch,
		}),
	});
	if (!annotationResult.ok) {
		const payload = annotationResult.data as { error?: string } | null;
		return {
			ok: false,
			error: payload?.error || `Audit annotation failed (HTTP ${annotationResult.status})`,
		};
	}
	const payload = annotationResult.data as { auditEntry?: StarterKitAuditEntry } | null;
	return {
		ok: true,
		auditEntry: payload?.auditEntry,
	};
}

async function findMenuIdBySlug(params: {
	slug: string;
	channel: string;
	saleorApiUrl: string;
	adminToken: string;
	tenantHeaders: Record<string, string>;
}): Promise<{ id?: string; error?: string }> {
	const menuGetQuery = `
		query StarterKitMenuDeleteLookup($slug: String!, $channel: String) {
			menu(slug: $slug, channel: $channel) {
				id
			}
		}
	`;
	const result = await executeSaleorAdminGraphQL<{ menu?: { id?: string | null } | null }>({
		query: menuGetQuery,
		variables: { slug: params.slug, channel: params.channel },
		saleorApiUrl: params.saleorApiUrl,
		adminToken: params.adminToken,
		tenantHeaders: params.tenantHeaders,
	});
	if (!result.ok) {
		return { error: result.error || "Menu lookup failed" };
	}
	return { id: result.data?.menu?.id || undefined };
}

async function deleteMenuById(params: {
	id: string;
	saleorApiUrl: string;
	adminToken: string;
	tenantHeaders: Record<string, string>;
}): Promise<{ ok: boolean; error?: string }> {
	const mutation = `
		mutation StarterKitMenuDelete($id: ID!) {
			menuDelete(id: $id) {
				errors {
					field
					message
					code
				}
			}
		}
	`;
	const result = await executeSaleorAdminGraphQL<{
		menuDelete?: { errors?: Array<{ message?: string | null } | null> | null } | null;
	}>({
		query: mutation,
		variables: { id: params.id },
		saleorApiUrl: params.saleorApiUrl,
		adminToken: params.adminToken,
		tenantHeaders: params.tenantHeaders,
	});
	if (!result.ok) {
		return { ok: false, error: result.error || "Menu delete failed" };
	}
	const errors = (result.data?.menuDelete?.errors || []).map((error) => error?.message || "").filter(Boolean);
	if (errors.length > 0) {
		return { ok: false, error: errors.join("; ") };
	}
	return { ok: true };
}

async function findPageIdBySlug(params: {
	slug: string;
	channel: string;
	saleorApiUrl: string;
	adminToken: string;
	tenantHeaders: Record<string, string>;
}): Promise<{ id?: string; error?: string }> {
	const pageGetQuery = `
		query StarterKitPageDeleteLookup($slug: String!, $channel: String) {
			page(slug: $slug, channel: $channel) {
				id
			}
		}
	`;
	const result = await executeSaleorAdminGraphQL<{ page?: { id?: string | null } | null }>({
		query: pageGetQuery,
		variables: { slug: params.slug, channel: params.channel },
		saleorApiUrl: params.saleorApiUrl,
		adminToken: params.adminToken,
		tenantHeaders: params.tenantHeaders,
	});
	if (!result.ok) {
		return { error: result.error || "Page lookup failed" };
	}
	return { id: result.data?.page?.id || undefined };
}

async function deletePageById(params: {
	id: string;
	saleorApiUrl: string;
	adminToken: string;
	tenantHeaders: Record<string, string>;
}): Promise<{ ok: boolean; error?: string }> {
	const mutation = `
		mutation StarterKitPageDelete($id: ID!) {
			pageDelete(id: $id) {
				errors {
					field
					message
					code
				}
			}
		}
	`;
	const result = await executeSaleorAdminGraphQL<{
		pageDelete?: { errors?: Array<{ message?: string | null } | null> | null } | null;
	}>({
		query: mutation,
		variables: { id: params.id },
		saleorApiUrl: params.saleorApiUrl,
		adminToken: params.adminToken,
		tenantHeaders: params.tenantHeaders,
	});
	if (!result.ok) {
		return { ok: false, error: result.error || "Page delete failed" };
	}
	const errors = (result.data?.pageDelete?.errors || []).map((error) => error?.message || "").filter(Boolean);
	if (errors.length > 0) {
		return { ok: false, error: errors.join("; ") };
	}
	return { ok: true };
}

async function rollbackProvisionedSaleorResources({
	request,
	payload,
	origin,
	scope,
	selection,
}: {
	request: NextRequest;
	payload: StarterKitsResponsePayload;
	origin: string;
	scope: ProvisioningScope;
	selection?: ProvisioningSelection;
}): Promise<SaleorProvisioningRollbackResult> {
	const result: SaleorProvisioningRollbackResult = {
		enabled: true,
		changed: false,
		warnings: [],
		menus: { deleted: [], skipped: [], errors: [] },
		pages: { deleted: [], skipped: [], errors: [] },
	};

	const rollbackTargets = resolveRollbackTargetSlugs(payload, selection);
	const menuSlugs = rollbackTargets.menus;
	const pageSlugs = rollbackTargets.pages;
	if (menuSlugs.length === 0 && pageSlugs.length === 0) {
		result.warnings.push("No provisioned Saleor entities matched rollback selection.");
		return result;
	}

	const adminToken = process.env.SALEOR_APP_TOKEN || "";
	if (!adminToken) {
		result.warnings.push("SALEOR_APP_TOKEN is missing; skipped provisioning rollback.");
		return result;
	}

	const saleorApiUrl = normalizeSaleorApiUrl(
		origin,
		payload.tenant?.domain || request.headers.get("x-tenant-domain") || undefined,
	);
	result.saleorApiUrl = saleorApiUrl;
	const tenantHeaders = buildTenantHeaders(payload, request);
	const channel = payload.tenant?.channel || "default-channel";

	if (!scope.menus && menuSlugs.length > 0) {
		result.warnings.push("Rollback menu scope disabled; skipped menu deletion.");
		result.menus.skipped.push(...menuSlugs);
	} else {
		for (const menuSlug of menuSlugs) {
			const found = await findMenuIdBySlug({
				slug: menuSlug,
				channel,
				saleorApiUrl,
				adminToken,
				tenantHeaders,
			});
			if (found.error) {
				result.menus.errors.push({ key: menuSlug, message: found.error });
				continue;
			}
			if (!found.id) {
				result.menus.skipped.push(menuSlug);
				continue;
			}
			const deleted = await deleteMenuById({
				id: found.id,
				saleorApiUrl,
				adminToken,
				tenantHeaders,
			});
			if (!deleted.ok) {
				result.menus.errors.push({ key: menuSlug, message: deleted.error || "Menu delete failed" });
				continue;
			}
			result.menus.deleted.push(menuSlug);
		}
	}

	if (!scope.pages && pageSlugs.length > 0) {
		result.warnings.push("Rollback page scope disabled; skipped page deletion.");
		result.pages.skipped.push(...pageSlugs);
	} else {
		for (const pageSlug of pageSlugs) {
			const found = await findPageIdBySlug({
				slug: pageSlug,
				channel,
				saleorApiUrl,
				adminToken,
				tenantHeaders,
			});
			if (found.error) {
				result.pages.errors.push({ key: pageSlug, message: found.error });
				continue;
			}
			if (!found.id) {
				result.pages.skipped.push(pageSlug);
				continue;
			}
			const deleted = await deletePageById({
				id: found.id,
				saleorApiUrl,
				adminToken,
				tenantHeaders,
			});
			if (!deleted.ok) {
				result.pages.errors.push({ key: pageSlug, message: deleted.error || "Page delete failed" });
				continue;
			}
			result.pages.deleted.push(pageSlug);
		}
	}

	result.changed = result.menus.deleted.length > 0 || result.pages.deleted.length > 0;
	return result;
}

function resolveRollbackTargetSlugs(
	payload: StarterKitsResponsePayload,
	selection?: ProvisioningSelection,
): ProvisioningTargetSlugs {
	const targetProvisioning = payload.targetAuditEntry?.saleorProvisioning;
	return {
		menus: applySelection(asArrayOfStrings(targetProvisioning?.menus?.created), selection?.menus),
		pages: applySelection(asArrayOfStrings(targetProvisioning?.pages?.created), selection?.pages),
	};
}

function resolveRestoreTargetSlugs(payload: StarterKitsResponsePayload): {
	source: string;
	menus: string[];
	pages: string[];
} {
	const targetEntry = payload.targetAuditEntry;
	const fromResponseMenus = asArrayOfStrings(targetEntry?.restoreTargets?.menus);
	const fromResponsePages = asArrayOfStrings(targetEntry?.restoreTargets?.pages);
	if (fromResponseMenus.length > 0 || fromResponsePages.length > 0) {
		const source =
			typeof targetEntry?.restoreTargets?.source === "string" && targetEntry.restoreTargets.source.trim()
				? targetEntry.restoreTargets.source.trim()
				: "worker-restore-targets";
		return { source, menus: fromResponseMenus, pages: fromResponsePages };
	}

	const deletedMenus = asArrayOfStrings(targetEntry?.rollbackProvisioning?.menus?.deleted);
	const deletedPages = asArrayOfStrings(targetEntry?.rollbackProvisioning?.pages?.deleted);
	if (deletedMenus.length > 0 || deletedPages.length > 0) {
		return { source: "rollback-deleted", menus: deletedMenus, pages: deletedPages };
	}

	const createdMenus = asArrayOfStrings(targetEntry?.saleorProvisioning?.menus?.created);
	const createdPages = asArrayOfStrings(targetEntry?.saleorProvisioning?.pages?.created);
	return { source: "apply-created", menus: createdMenus, pages: createdPages };
}

async function restoreProvisionedSaleorResources({
	request,
	payload,
	origin,
	scope,
	conflictPolicy,
	selection,
}: {
	request: NextRequest;
	payload: StarterKitsResponsePayload;
	origin: string;
	scope: ProvisioningScope;
	conflictPolicy: RestoreConflictPolicy;
	selection?: ProvisioningSelection;
}): Promise<SaleorProvisioningRestoreResult> {
	const result: SaleorProvisioningRestoreResult = {
		enabled: true,
		changed: false,
		warnings: [],
		source: undefined,
		conflictPolicy,
		menus: { created: [], existing: [], skipped: [], errors: [] },
		pages: { created: [], existing: [], skipped: [], errors: [] },
	};

	const restoreTargetsRaw = resolveRestoreTargetSlugs(payload);
	const restoreTargets = {
		source: restoreTargetsRaw.source,
		menus: applySelection(restoreTargetsRaw.menus, selection?.menus),
		pages: applySelection(restoreTargetsRaw.pages, selection?.pages),
	};
	result.source = restoreTargets.source;
	if (restoreTargets.menus.length === 0 && restoreTargets.pages.length === 0) {
		result.warnings.push("No rollback-deleted/apply-created Saleor entities matched restore selection.");
		return result;
	}

	const adminToken = process.env.SALEOR_APP_TOKEN || "";
	if (!adminToken) {
		result.warnings.push("SALEOR_APP_TOKEN is missing; skipped provisioning restore.");
		return result;
	}

	const saleorApiUrl = normalizeSaleorApiUrl(
		origin,
		payload.tenant?.domain || request.headers.get("x-tenant-domain") || undefined,
	);
	result.saleorApiUrl = saleorApiUrl;
	const tenantHeaders = buildTenantHeaders(payload, request);
	const channel = payload.tenant?.channel || "default-channel";

	if (!scope.menus && restoreTargets.menus.length > 0) {
		result.warnings.push("Restore menu scope disabled; skipped menu restoration.");
		result.menus.skipped.push(...restoreTargets.menus);
	} else {
		for (const menuSlug of restoreTargets.menus) {
			await ensureMenuExists({
				slug: menuSlug,
				channel,
				saleorApiUrl,
				adminToken,
				tenantHeaders,
				result: result.menus,
				existingConflictPolicy: conflictPolicy,
			});
		}
	}

	if (!scope.pages && restoreTargets.pages.length > 0) {
		result.warnings.push("Restore page scope disabled; skipped page restoration.");
		result.pages.skipped.push(...restoreTargets.pages);
	} else if (restoreTargets.pages.length > 0) {
		const pageType = await getFirstPageTypeId({
			saleorApiUrl,
			adminToken,
			tenantHeaders,
		});
		if (!pageType.id) {
			const message = pageType.error || "No page type id found";
			result.warnings.push(message);
			for (const pageSlug of restoreTargets.pages) {
				result.pages.skipped.push(pageSlug);
				result.pages.errors.push({ key: pageSlug, message });
			}
		} else {
			for (const pageSlug of restoreTargets.pages) {
				await ensurePageExists({
					slug: pageSlug,
					channel,
					pageTypeId: pageType.id,
					saleorApiUrl,
					adminToken,
					tenantHeaders,
					result: result.pages,
					existingConflictPolicy: conflictPolicy,
				});
			}
		}
	}

	result.changed = result.menus.created.length > 0 || result.pages.created.length > 0;
	return result;
}

async function previewRollbackProvisionedSaleorResources({
	request,
	payload,
	origin,
	scope,
	selection,
	guardrailPolicy,
	bypassEligible,
}: {
	request: NextRequest;
	payload: StarterKitsResponsePayload;
	origin: string;
	scope: ProvisioningScope;
	selection?: ProvisioningSelection;
	guardrailPolicy: StarterKitGuardrailPolicy;
	bypassEligible: boolean;
}): Promise<SaleorProvisioningRollbackPreviewResult> {
	const result: SaleorProvisioningRollbackPreviewResult = {
		enabled: true,
		changed: false,
		warnings: [],
		scope,
		menus: { wouldDelete: [], missing: [], skipped: [], errors: [] },
		pages: { wouldDelete: [], missing: [], skipped: [], errors: [] },
	};

	const rollbackTargets = resolveRollbackTargetSlugs(payload, selection);
	const menuSlugs = rollbackTargets.menus;
	const pageSlugs = rollbackTargets.pages;
	if (menuSlugs.length === 0 && pageSlugs.length === 0) {
		result.warnings.push("No provisioned Saleor entities recorded on target audit entry.");
		return result;
	}

	const adminToken = process.env.SALEOR_APP_TOKEN || "";
	if (!adminToken) {
		result.warnings.push("SALEOR_APP_TOKEN is missing; skipped provisioning rollback preview.");
		return result;
	}

	const saleorApiUrl = normalizeSaleorApiUrl(
		origin,
		payload.tenant?.domain || request.headers.get("x-tenant-domain") || undefined,
	);
	result.saleorApiUrl = saleorApiUrl;
	const tenantHeaders = buildTenantHeaders(payload, request);
	const channel = payload.tenant?.channel || "default-channel";

	if (!scope.menus && menuSlugs.length > 0) {
		result.warnings.push("Rollback menu scope disabled; skipped menu preview.");
		result.menus.skipped.push(...menuSlugs);
	} else {
		for (const menuSlug of menuSlugs) {
			const found = await findMenuIdBySlug({
				slug: menuSlug,
				channel,
				saleorApiUrl,
				adminToken,
				tenantHeaders,
			});
			if (found.error) {
				result.menus.errors.push({ key: menuSlug, message: found.error });
				continue;
			}
			if (!found.id) {
				result.menus.missing.push(menuSlug);
				continue;
			}
			result.menus.wouldDelete.push(menuSlug);
		}
	}

	if (!scope.pages && pageSlugs.length > 0) {
		result.warnings.push("Rollback page scope disabled; skipped page preview.");
		result.pages.skipped.push(...pageSlugs);
	} else {
		for (const pageSlug of pageSlugs) {
			const found = await findPageIdBySlug({
				slug: pageSlug,
				channel,
				saleorApiUrl,
				adminToken,
				tenantHeaders,
			});
			if (found.error) {
				result.pages.errors.push({ key: pageSlug, message: found.error });
				continue;
			}
			if (!found.id) {
				result.pages.missing.push(pageSlug);
				continue;
			}
			result.pages.wouldDelete.push(pageSlug);
		}
	}

	const scopedTargets = applyScopeToTargets(rollbackTargets, scope);
	const selectedCount = countProvisioningTargets(scopedTargets);
	result.guardrail = {
		maxEntities: guardrailPolicy.maxEntities,
		selectedCount,
		confirmationRequired: selectedCount > guardrailPolicy.maxEntities,
		bypassEligible,
	};
	result.changed = result.menus.wouldDelete.length > 0 || result.pages.wouldDelete.length > 0;
	return result;
}

async function previewRestoreProvisionedSaleorResources({
	request,
	payload,
	origin,
	scope,
	conflictPolicy,
	selection,
	guardrailPolicy,
	bypassEligible,
}: {
	request: NextRequest;
	payload: StarterKitsResponsePayload;
	origin: string;
	scope: ProvisioningScope;
	conflictPolicy: RestoreConflictPolicy;
	selection?: ProvisioningSelection;
	guardrailPolicy: StarterKitGuardrailPolicy;
	bypassEligible: boolean;
}): Promise<SaleorProvisioningRestorePreviewResult> {
	const result: SaleorProvisioningRestorePreviewResult = {
		enabled: true,
		changed: false,
		warnings: [],
		source: undefined,
		scope,
		conflictPolicy,
		menus: { wouldCreate: [], existing: [], skipped: [], conflicts: [], errors: [] },
		pages: { wouldCreate: [], existing: [], skipped: [], conflicts: [], errors: [] },
	};

	const restoreTargetsRaw = resolveRestoreTargetSlugs(payload);
	const restoreTargets = {
		source: restoreTargetsRaw.source,
		menus: applySelection(restoreTargetsRaw.menus, selection?.menus),
		pages: applySelection(restoreTargetsRaw.pages, selection?.pages),
	};
	result.source = restoreTargets.source;
	if (restoreTargets.menus.length === 0 && restoreTargets.pages.length === 0) {
		result.warnings.push(
			"No rollback-deleted or apply-created Saleor entities were found for restore preview.",
		);
		return result;
	}

	const adminToken = process.env.SALEOR_APP_TOKEN || "";
	if (!adminToken) {
		result.warnings.push("SALEOR_APP_TOKEN is missing; skipped provisioning restore preview.");
		return result;
	}

	const saleorApiUrl = normalizeSaleorApiUrl(
		origin,
		payload.tenant?.domain || request.headers.get("x-tenant-domain") || undefined,
	);
	result.saleorApiUrl = saleorApiUrl;
	const tenantHeaders = buildTenantHeaders(payload, request);
	const channel = payload.tenant?.channel || "default-channel";

	if (!scope.menus && restoreTargets.menus.length > 0) {
		result.warnings.push("Restore menu scope disabled; skipped menu preview.");
		result.menus.skipped.push(...restoreTargets.menus);
	} else {
		for (const menuSlug of restoreTargets.menus) {
			const found = await findMenuIdBySlug({
				slug: menuSlug,
				channel,
				saleorApiUrl,
				adminToken,
				tenantHeaders,
			});
			if (found.error) {
				result.menus.errors.push({ key: menuSlug, message: found.error });
				continue;
			}
			if (found.id) {
				result.menus.existing.push(menuSlug);
				if (conflictPolicy === "error-on-existing") {
					result.menus.conflicts.push(menuSlug);
				}
				continue;
			}
			result.menus.wouldCreate.push(menuSlug);
		}
	}

	if (!scope.pages && restoreTargets.pages.length > 0) {
		result.warnings.push("Restore page scope disabled; skipped page preview.");
		result.pages.skipped.push(...restoreTargets.pages);
	} else if (restoreTargets.pages.length > 0) {
		const pageType = await getFirstPageTypeId({
			saleorApiUrl,
			adminToken,
			tenantHeaders,
		});
		if (!pageType.id) {
			const message = pageType.error || "No page type id found";
			result.warnings.push(message);
			for (const pageSlug of restoreTargets.pages) {
				result.pages.errors.push({ key: pageSlug, message });
			}
		} else {
			for (const pageSlug of restoreTargets.pages) {
				const found = await findPageIdBySlug({
					slug: pageSlug,
					channel,
					saleorApiUrl,
					adminToken,
					tenantHeaders,
				});
				if (found.error) {
					result.pages.errors.push({ key: pageSlug, message: found.error });
					continue;
				}
				if (found.id) {
					result.pages.existing.push(pageSlug);
					if (conflictPolicy === "error-on-existing") {
						result.pages.conflicts.push(pageSlug);
					}
					continue;
				}
				result.pages.wouldCreate.push(pageSlug);
			}
		}
	}

	const scopedTargets = applyScopeToTargets(
		{ menus: restoreTargets.menus, pages: restoreTargets.pages },
		scope,
	);
	const selectedCount = countProvisioningTargets(scopedTargets);
	result.guardrail = {
		maxEntities: guardrailPolicy.maxEntities,
		selectedCount,
		confirmationRequired: selectedCount > guardrailPolicy.maxEntities,
		bypassEligible,
	};
	result.changed = result.menus.wouldCreate.length > 0 || result.pages.wouldCreate.length > 0;
	return result;
}

async function recordStarterKitRestoreAudit({
	origin,
	auditId,
	restoreProvisioning,
	source,
	restoreGuardrail,
}: {
	origin: string;
	auditId: string;
	restoreProvisioning: SaleorProvisioningRestoreResult;
	source?: string;
	restoreGuardrail?: GuardrailDecision;
}): Promise<{ ok: boolean; auditEntry?: StarterKitAuditEntry; error?: string }> {
	const recordResult = await proxyStorefrontBuilderRequest({
		origin,
		path: "/internal/storefront-builder/starter-kits",
		method: "POST",
		bodyText: JSON.stringify({
			action: "record-restore",
			auditId,
			source,
			restoreProvisioning,
			restoreGuardrail,
			note: "Recorded provisioning restore from storefront builder",
			actor: "builder-ui",
		}),
	});
	if (!recordResult.ok) {
		const payload = recordResult.data as { error?: string } | null;
		return {
			ok: false,
			error: payload?.error || `Restore audit recording failed (HTTP ${recordResult.status})`,
		};
	}
	const payload = recordResult.data as { auditEntry?: StarterKitAuditEntry } | null;
	return {
		ok: true,
		auditEntry: payload?.auditEntry,
	};
}

async function proxy(request: NextRequest, method: "GET" | "POST") {
	const startedAt = Date.now();
	const auth = authorizeStorefrontBuilderRequest(request, {
		requireWriteAccess: method !== "GET",
	});
	if (!auth.ok) {
		logStorefrontBuilderApiEvent({
			endpoint: "starter-kits",
			method,
			status: auth.status,
			durationMs: Date.now() - startedAt,
			outcome: "auth_denied",
			tenantCode: request.headers.get("x-tenant-code") || undefined,
			error: auth.error,
		});
		return jsonResponse({ error: auth.error || "Unauthorized" }, auth.status);
	}
	const rawBodyText = method === "GET" ? undefined : await request.text();
	const bodyText = enrichBodyWithActorContext(rawBodyText, method, auth.session);
	const parsedRequest: StarterKitRequestPayload = method === "POST" ? parseBody(bodyText) : {};
	const previewAction = method === "POST" ? mapPreviewAction(parsedRequest.action) : undefined;
	if (method === "POST" && previewAction) {
		const internalBodyText = buildInternalDryRunBody(parsedRequest);
		if (!internalBodyText) {
			logStorefrontBuilderApiEvent({
				endpoint: "starter-kits",
				method,
				status: 400,
				durationMs: Date.now() - startedAt,
				outcome: "internal_error",
				tenantCode: request.headers.get("x-tenant-code") || undefined,
				action: previewAction,
				error: "auditId is required for dry-run",
			});
			return jsonResponse({ error: "auditId is required for dry-run preview." }, 400);
		}
		const internalResult = await proxyStorefrontBuilderRequest({
			origin: getPublicRequestOrigin(request),
			path: "/internal/storefront-builder/starter-kits",
			method,
			bodyText: internalBodyText,
		});
		const internalPayload: StarterKitsResponsePayload =
			internalResult.data && typeof internalResult.data === "object"
				? (internalResult.data as StarterKitsResponsePayload)
				: {};
		if (!internalResult.ok) {
			logStorefrontBuilderApiEvent({
				endpoint: "starter-kits",
				method,
				status: internalResult.status,
				durationMs: Date.now() - startedAt,
				outcome: "upstream_error",
				tenantCode: request.headers.get("x-tenant-code") || undefined,
				action: previewAction,
			});
			return jsonResponse(internalPayload, internalResult.status);
		}
		const guardrailPolicy = normalizeGuardrailPolicy(internalPayload.guardrailPolicy);
		const bypassEligible = canBypassGuardrail(guardrailPolicy, auth.session);

		if (previewAction === "rollback-dry-run") {
			let provisioningRollbackDryRun: SaleorProvisioningRollbackPreviewResult | undefined;
			if (parsedRequest.rollbackProvisionedSaleor) {
				provisioningRollbackDryRun = await previewRollbackProvisionedSaleorResources({
					request,
					payload: internalPayload,
					origin: getPublicRequestOrigin(request),
					scope: parsedRequest.rollbackProvisionScope || { menus: true, pages: true },
					selection: parsedRequest.rollbackProvisionSelection,
					guardrailPolicy,
					bypassEligible,
				});
			}
			const previewPayload: StarterKitsResponsePayload = {
				...internalPayload,
				action: previewAction,
				guardrailPolicy,
				rollbackDryRun: {
					targetAuditId: parsedRequest.auditId,
					hasSnapshot: hasValidRollbackSnapshot(internalPayload.auditEntry),
					provisioningRollbackEnabled: parsedRequest.rollbackProvisionedSaleor === true,
					provisioningRollbackDryRun,
				},
			};
			logStorefrontBuilderApiEvent({
				endpoint: "starter-kits",
				method,
				status: 200,
				durationMs: Date.now() - startedAt,
				outcome: "ok",
				tenantCode: request.headers.get("x-tenant-code") || undefined,
				channel: internalPayload?.tenant?.channel || request.nextUrl.searchParams.get("channel") || undefined,
				action: previewAction,
				...buildDeadLetterObservabilityFields(previewPayload),
			});
			return jsonResponse(previewPayload, 200);
		}

		const provisioningRestoreDryRun = await previewRestoreProvisionedSaleorResources({
			request,
			payload: internalPayload,
			origin: getPublicRequestOrigin(request),
			scope: parsedRequest.restoreProvisionScope || { menus: true, pages: true },
			conflictPolicy: parsedRequest.restoreConflictPolicy || "skip-existing",
			selection: parsedRequest.restoreProvisionSelection,
			guardrailPolicy,
			bypassEligible,
		});
		const previewPayload: StarterKitsResponsePayload = {
			...internalPayload,
			action: previewAction,
			guardrailPolicy,
			provisioningRestoreDryRun,
		};
		logStorefrontBuilderApiEvent({
			endpoint: "starter-kits",
			method,
			status: 200,
			durationMs: Date.now() - startedAt,
			outcome: "ok",
			tenantCode: request.headers.get("x-tenant-code") || undefined,
			channel: internalPayload?.tenant?.channel || request.nextUrl.searchParams.get("channel") || undefined,
			action: previewAction,
			...buildDeadLetterObservabilityFields(previewPayload),
		});
		return jsonResponse(previewPayload, 200);
	}

	const result = await proxyStorefrontBuilderRequest({
		origin: getPublicRequestOrigin(request),
		path: "/internal/storefront-builder/starter-kits",
		method,
		bodyText,
	});

	let responsePayload: StarterKitsResponsePayload =
		result.data && typeof result.data === "object" ? (result.data as StarterKitsResponsePayload) : {};
	let resolvedAction = "";
	let resolvedChannel = "";
	let revalidateFailed = false;
	let revalidateError = "";
	if (method === "POST" && result.ok) {
		const action = responsePayload?.action || parsedRequest.action;
		const mode = responsePayload?.mode || parsedRequest.mode;
		resolvedAction = action || "";
		const guardrailPolicy = normalizeGuardrailPolicy(responsePayload.guardrailPolicy);
		const bypassEligible = canBypassGuardrail(guardrailPolicy, auth.session);
		responsePayload = {
			...responsePayload,
			guardrailPolicy,
		};
		let provisionChanged = false;
		let rollbackProvisionChanged = false;
		let restoreProvisionChanged = false;

		if (action === "apply" && parsedRequest.provisionSaleor) {
			const provisionResult = await provisionStarterKitSaleorResources({
				request,
				payload: responsePayload,
				origin: getPublicRequestOrigin(request),
			});
			provisionChanged = provisionResult.changed;
			responsePayload = {
				...responsePayload,
				provisioning: provisionResult,
			};
			const applyAuditId =
				typeof responsePayload.auditEntry?.id === "string" ? responsePayload.auditEntry.id : "";
			if (applyAuditId) {
				const annotation = await annotateStarterKitAudit({
					origin: getPublicRequestOrigin(request),
					auditId: applyAuditId,
					patch: {
						saleorProvisioning: provisionResult,
					},
				});
				if (annotation.ok && annotation.auditEntry) {
					responsePayload = {
						...responsePayload,
						auditEntry: annotation.auditEntry,
					};
				} else if (!annotation.ok && annotation.error) {
					const warnings = Array.isArray(provisionResult.warnings) ? [...provisionResult.warnings] : [];
					warnings.push(`Audit annotation failed: ${annotation.error}`);
					responsePayload = {
						...responsePayload,
						provisioning: {
							...provisionResult,
							warnings,
						},
					};
				}
			}
		}

		if (action === "rollback" && parsedRequest.rollbackProvisionedSaleor) {
			const rollbackScope = parsedRequest.rollbackProvisionScope || { menus: true, pages: true };
			const rollbackTargets = applyScopeToTargets(
				resolveRollbackTargetSlugs(responsePayload, parsedRequest.rollbackProvisionSelection),
				rollbackScope,
			);
			const rollbackTargetCount = countProvisioningTargets(rollbackTargets);
			const rollbackGuardrailDecision = buildGuardrailDecision({
				operation: "rollback",
				targetCount: rollbackTargetCount,
				policy: guardrailPolicy,
				confirmationProvided: parsedRequest.confirmLargeProvisionOperation === true,
				bypassRequested: parsedRequest.guardrailBypassRequested === true,
				bypassEligible,
			});
			if (
				rollbackTargetCount > guardrailPolicy.maxEntities &&
				!rollbackGuardrailDecision.confirmationProvided &&
				!rollbackGuardrailDecision.bypassUsed
			) {
				logStorefrontBuilderApiEvent({
					endpoint: "starter-kits",
					method,
					status: 400,
					durationMs: Date.now() - startedAt,
					outcome: "internal_error",
					tenantCode: request.headers.get("x-tenant-code") || undefined,
					channel:
						responsePayload?.tenant?.channel || request.nextUrl.searchParams.get("channel") || undefined,
					action,
					error: `Guardrail confirmation required (${rollbackTargetCount} entities > ${guardrailPolicy.maxEntities})`,
				});
				return jsonResponse(
					{
						...responsePayload,
						error: `Guardrail confirmation required for rollback of ${rollbackTargetCount} entities (max ${guardrailPolicy.maxEntities}).`,
						guardrail: {
							operation: "rollback",
							maxEntities: guardrailPolicy.maxEntities,
							targetCount: rollbackTargetCount,
							confirmationRequired: true,
							bypassEligible: rollbackGuardrailDecision.bypassEligible,
						},
					},
					400,
				);
			}
			const rollbackResult = await rollbackProvisionedSaleorResources({
				request,
				payload: responsePayload,
				origin: getPublicRequestOrigin(request),
				scope: rollbackScope,
				selection: parsedRequest.rollbackProvisionSelection,
			});
			rollbackProvisionChanged = rollbackResult.changed;
			responsePayload = {
				...responsePayload,
				provisioningRollback: rollbackResult,
			};
			const rollbackAuditId =
				typeof responsePayload.auditEntry?.id === "string" ? responsePayload.auditEntry.id : "";
			if (rollbackAuditId) {
				const annotation = await annotateStarterKitAudit({
					origin: getPublicRequestOrigin(request),
					auditId: rollbackAuditId,
					patch: {
						rollbackProvisioning: rollbackResult,
						rollbackGuardrail: rollbackGuardrailDecision,
					},
				});
				if (annotation.ok && annotation.auditEntry) {
					responsePayload = {
						...responsePayload,
						auditEntry: annotation.auditEntry,
					};
				}
			}
		}

		if (action === "restore-provisioned" && parsedRequest.restoreProvisionedSaleor !== false) {
			const restoreScope = parsedRequest.restoreProvisionScope || { menus: true, pages: true };
			const restoreTargetsRaw = resolveRestoreTargetSlugs(responsePayload);
			const restoreTargetsScoped = applyScopeToTargets(
				{
					menus: applySelection(restoreTargetsRaw.menus, parsedRequest.restoreProvisionSelection?.menus),
					pages: applySelection(restoreTargetsRaw.pages, parsedRequest.restoreProvisionSelection?.pages),
				},
				restoreScope,
			);
			const restoreTargetCount = countProvisioningTargets(restoreTargetsScoped);
			const restoreGuardrailDecision = buildGuardrailDecision({
				operation: "restore",
				targetCount: restoreTargetCount,
				policy: guardrailPolicy,
				confirmationProvided: parsedRequest.confirmLargeProvisionOperation === true,
				bypassRequested: parsedRequest.guardrailBypassRequested === true,
				bypassEligible,
			});
			if (
				restoreTargetCount > guardrailPolicy.maxEntities &&
				!restoreGuardrailDecision.confirmationProvided &&
				!restoreGuardrailDecision.bypassUsed
			) {
				logStorefrontBuilderApiEvent({
					endpoint: "starter-kits",
					method,
					status: 400,
					durationMs: Date.now() - startedAt,
					outcome: "internal_error",
					tenantCode: request.headers.get("x-tenant-code") || undefined,
					channel:
						responsePayload?.tenant?.channel || request.nextUrl.searchParams.get("channel") || undefined,
					action,
					error: `Guardrail confirmation required (${restoreTargetCount} entities > ${guardrailPolicy.maxEntities})`,
				});
				return jsonResponse(
					{
						...responsePayload,
						error: `Guardrail confirmation required for restore of ${restoreTargetCount} entities (max ${guardrailPolicy.maxEntities}).`,
						guardrail: {
							operation: "restore",
							maxEntities: guardrailPolicy.maxEntities,
							targetCount: restoreTargetCount,
							confirmationRequired: true,
							bypassEligible: restoreGuardrailDecision.bypassEligible,
						},
					},
					400,
				);
			}
			const restoreResult = await restoreProvisionedSaleorResources({
				request,
				payload: responsePayload,
				origin: getPublicRequestOrigin(request),
				scope: restoreScope,
				conflictPolicy: parsedRequest.restoreConflictPolicy || "skip-existing",
				selection: parsedRequest.restoreProvisionSelection,
			});
			restoreProvisionChanged = restoreResult.changed;
			responsePayload = {
				...responsePayload,
				provisioningRestore: restoreResult,
			};

			const restoreAuditId =
				typeof parsedRequest.auditId === "string" && parsedRequest.auditId.trim()
					? parsedRequest.auditId.trim()
					: typeof responsePayload.targetAuditId === "string"
						? responsePayload.targetAuditId
						: "";
			if (restoreAuditId) {
				const recordRestore = await recordStarterKitRestoreAudit({
					origin: getPublicRequestOrigin(request),
					auditId: restoreAuditId,
					restoreProvisioning: restoreResult,
					source: restoreResult.source,
					restoreGuardrail: restoreGuardrailDecision,
				});
				if (recordRestore.ok && recordRestore.auditEntry) {
					responsePayload = {
						...responsePayload,
						auditEntry: recordRestore.auditEntry,
					};
				} else if (!recordRestore.ok && recordRestore.error) {
					const warnings = Array.isArray(restoreResult.warnings) ? [...restoreResult.warnings] : [];
					warnings.push(`Restore audit recording failed: ${recordRestore.error}`);
					responsePayload = {
						...responsePayload,
						provisioningRestore: {
							...restoreResult,
							warnings,
						},
					};
				}
			}
		}

		const shouldRevalidate =
			action === "rollback" ||
			action === "restore-provisioned" ||
			(action === "apply" && mode === "publish" && responsePayload?.changed !== false);
		if (shouldRevalidate || provisionChanged || rollbackProvisionChanged || restoreProvisionChanged) {
			const channel = responsePayload?.tenant?.channel || "default-channel";
			resolvedChannel = channel;
			const revalidateResult = await triggerHomepageRevalidate(request.nextUrl.origin, channel);
			if (revalidateResult.attempted && !revalidateResult.ok) {
				revalidateFailed = true;
				revalidateError = revalidateResult.error || "Starter-kit revalidate failed";
			}
		}
	}
	logStorefrontBuilderApiEvent({
		endpoint: "starter-kits",
		method,
		status: result.status,
		durationMs: Date.now() - startedAt,
		outcome: revalidateFailed ? "revalidate_failed" : result.ok ? "ok" : "upstream_error",
		tenantCode: request.headers.get("x-tenant-code") || undefined,
		channel: resolvedChannel || request.nextUrl.searchParams.get("channel") || undefined,
		action: resolvedAction || undefined,
		error: revalidateError || undefined,
		...buildDeadLetterObservabilityFields(responsePayload),
	});

	return jsonResponse(responsePayload, result.status);
}

export async function GET(request: NextRequest) {
	return proxy(request, "GET");
}

export async function POST(request: NextRequest) {
	return proxy(request, "POST");
}
