import Link from "next/link";

type StorefrontBuilderAccessDeniedProps = {
	title?: string;
	reason?: string;
};

export function StorefrontBuilderAccessDenied({
	title = "店铺搭建器访问受限",
	reason,
}: StorefrontBuilderAccessDeniedProps) {
	const showReason = process.env.NODE_ENV !== "production" && !!reason;

	return (
		<main className="mx-auto flex min-h-[50vh] w-full max-w-2xl flex-col items-center justify-center px-6 py-10">
			<div className="w-full rounded-lg border border-border bg-card p-6 text-center">
				<h1 className="text-xl font-semibold tracking-tight">{title}</h1>
				<p className="mt-3 text-sm text-muted-foreground">
					请先登录 Saleor Dashboard，并通过「扩展」入口打开店铺搭建器。
				</p>
				<div className="mt-5 flex flex-wrap items-center justify-center gap-2">
					<Link
						className="rounded border border-border px-3 py-2 text-sm font-medium"
						href="/dashboard/extensions/installed"
					>
						前往扩展列表
					</Link>
					<Link className="rounded border border-border px-3 py-2 text-sm font-medium" href="/dashboard">
						前往 Dashboard
					</Link>
				</div>
				{showReason ? (
					<p className="mt-4 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-left text-xs text-amber-700">
						调试信息：{reason}
					</p>
				) : null}
			</div>
		</main>
	);
}
