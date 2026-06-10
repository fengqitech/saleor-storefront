import { Suspense } from "react";
import { RootWrapper } from "./page-wrapper";
import { Loader } from "@/ui/atoms/loader";
import { getSaleorApiUrlFromRequest } from "@/lib/saleor-api-url.server";

export const metadata = {
	title: "Checkout · Saleor Storefront example",
	description: "Complete your purchase securely.",
};

/**
 * Checkout page with Cache Components.
 * Entire page is dynamic (reads searchParams for checkout ID).
 */
export default function CheckoutPage(props: {
	searchParams: Promise<{ checkout?: string; order?: string }>;
}) {
	return (
		<Suspense fallback={<CheckoutSkeleton />}>
			<CheckoutContent searchParams={props.searchParams} />
		</Suspense>
	);
}

/**
 * Dynamic checkout content - reads searchParams at request time.
 */
async function CheckoutContent({
	searchParams: searchParamsPromise,
}: {
	searchParams: Promise<{ checkout?: string; order?: string }>;
}) {
	const searchParams = await searchParamsPromise;

	if (!searchParams.checkout && !searchParams.order) {
		return null;
	}

	const saleorApiUrl = (await getSaleorApiUrlFromRequest()) || process.env.NEXT_PUBLIC_SALEOR_API_URL;
	if (!saleorApiUrl) {
		return null;
	}

	return <RootWrapper saleorApiUrl={saleorApiUrl} />;
}

function CheckoutSkeleton() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<Loader />
		</div>
	);
}
