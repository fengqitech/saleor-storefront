import { unstable_noStore as noStore } from "next/cache";
import { connection } from "next/server";
import { Suspense } from "react";
import { verifyStorefrontBuilderSessionFromCookies } from "@/lib/storefront-builder-session.server";
import { StorefrontBuilderAccessDenied } from "./access-denied";
import { StorefrontBuilderClient } from "./storefront-builder-client";

async function StorefrontBuilderPageContent() {
	await connection();
	const sessionCheck = await verifyStorefrontBuilderSessionFromCookies();
	if (!sessionCheck.authorized) {
		return <StorefrontBuilderAccessDenied reason={sessionCheck.reason} />;
	}
	return (
		<main className="w-full px-3 py-4 lg:px-5 lg:py-6 2xl:px-8">
			<div className="mb-6">
				<h1 className="text-2xl font-semibold tracking-tight">店铺搭建控制台（开发环境）</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					租户可自助管理主题与首页草稿/发布。可视化编辑器已独立到新页面，控制台主要用于引导和运营配置。
				</p>
			</div>
			<Suspense fallback={<p className="text-sm text-muted-foreground">正在加载店铺搭建页面...</p>}>
				<StorefrontBuilderClient />
			</Suspense>
		</main>
	);
}

export default function StorefrontBuilderPage() {
	noStore();
	return (
		<Suspense fallback={<p className="px-3 py-4 text-sm text-muted-foreground">正在加载店铺搭建页面...</p>}>
			<StorefrontBuilderPageContent />
		</Suspense>
	);
}
