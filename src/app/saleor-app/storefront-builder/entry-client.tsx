"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppBridge, AppBridgeProvider, useAppBridge } from "@saleor/app-sdk/app-bridge";

type SessionState = "idle" | "loading" | "failed";

function EntryInner() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [state, setState] = useState<SessionState>("idle");
	const [error, setError] = useState<string | null>(null);
	const { appBridgeState } = useAppBridge();

	// Legacy: older dashboard versions passed token via query param.
	// Current dashboard uses AppBridge handshake (postMessage) and token refresh events.
	const token = useMemo(() => {
		const fromQuery = searchParams.get("token") || "";
		if (fromQuery) return fromQuery;
		return appBridgeState?.token || "";
	}, [appBridgeState?.token, searchParams]);
	const saleorApiUrl = useMemo(
		() =>
			searchParams.get("saleorApiUrl") || searchParams.get("apiUrl") || appBridgeState?.saleorApiUrl || "",
		[appBridgeState?.saleorApiUrl, searchParams],
	);

	useEffect(() => {
		let cancelled = false;
		const establishSession = async () => {
			if (!token) {
				setState("failed");
				setError("缺少 Saleor 会话令牌。请从 Saleor Dashboard 的扩展入口打开本页面。");
				return;
			}
			setState("loading");
			setError(null);
			try {
				const response = await fetch("/api/storefront-builder/session", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						token,
						saleorApiUrl: saleorApiUrl || undefined,
					}),
				});
				const payload = (await response.json().catch(() => null)) as { error?: string } | null;
				if (!response.ok) {
					throw new Error(payload?.error || "无法建立店铺搭建器会话");
				}
				if (cancelled) return;
				router.replace("/storefront-builder?embedded=1");
			} catch (e) {
				if (cancelled) return;
				setState("failed");
				setError(e instanceof Error ? e.message : "无法建立店铺搭建器会话");
			}
		};
		void establishSession();
		return () => {
			cancelled = true;
		};
	}, [router, saleorApiUrl, token]);

	return (
		<main className="mx-auto flex min-h-[50vh] w-full max-w-2xl flex-col items-center justify-center px-6 py-10">
			<div className="w-full rounded-lg border border-border bg-card p-6 text-center">
				<h1 className="text-xl font-semibold tracking-tight">店铺搭建器会话初始化</h1>
				{state === "loading" ? (
					<p className="mt-3 text-sm text-muted-foreground">正在校验 Saleor 扩展会话...</p>
				) : null}
				{state === "failed" ? (
					<p className="mt-3 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
						{error}
					</p>
				) : null}
			</div>
		</main>
	);
}

export function SaleorAppStorefrontBuilderEntryClient() {
	const appBridgeInstance = useMemo(() => {
		if (typeof window === "undefined") return undefined;
		return new AppBridge();
	}, []);

	return (
		<AppBridgeProvider appBridgeInstance={appBridgeInstance}>
			<EntryInner />
		</AppBridgeProvider>
	);
}
