import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { verifyStorefrontBuilderSessionFromCookies } from "@/lib/storefront-builder-session.server";
import { StorefrontBuilderAccessDenied } from "../access-denied";
import { StorefrontBuilderClient } from "../storefront-builder-client";

async function StorefrontBuilderEditorPageContent() {
	await connection();
	const sessionCheck = await verifyStorefrontBuilderSessionFromCookies();
	if (!sessionCheck.authorized) {
		return <StorefrontBuilderAccessDenied title="可视化编辑器访问受限" reason={sessionCheck.reason} />;
	}
	return (
		<main className="w-full px-2 py-3 lg:px-4 lg:py-4 2xl:px-6">
			<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">店铺可视化编辑器</h1>
					<p className="mt-1 text-sm text-muted-foreground">全屏编辑工作区（Puck 可视化编辑）。</p>
				</div>
				<Link
					className="rounded border border-border px-3 py-2 text-sm font-medium"
					href="/dashboard/extensions/installed"
				>
					返回扩展列表
				</Link>
			</div>
			<Suspense fallback={<p className="text-sm text-muted-foreground">正在加载编辑器...</p>}>
				<StorefrontBuilderClient editorOnly />
			</Suspense>
		</main>
	);
}

export default function StorefrontBuilderEditorPage() {
	noStore();
	return (
		<Suspense fallback={<p className="px-2 py-3 text-sm text-muted-foreground">正在加载编辑器...</p>}>
			<StorefrontBuilderEditorPageContent />
		</Suspense>
	);
}
