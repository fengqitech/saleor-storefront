import { Suspense } from "react";
import { SaleorAppStorefrontBuilderEntryClient } from "./entry-client";

export default function SaleorAppStorefrontBuilderEntryPage() {
	return (
		<Suspense
			fallback={
				<main className="mx-auto flex min-h-[50vh] w-full max-w-2xl flex-col items-center justify-center px-6 py-10">
					<div className="w-full rounded-lg border border-border bg-card p-6 text-center">
						<h1 className="text-xl font-semibold tracking-tight">Storefront Builder App Session</h1>
						<p className="mt-3 text-sm text-muted-foreground">Loading...</p>
					</div>
				</main>
			}
		>
			<SaleorAppStorefrontBuilderEntryClient />
		</Suspense>
	);
}
