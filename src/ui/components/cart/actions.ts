"use server";

import { revalidatePath } from "next/cache";
import { executeAuthenticatedGraphQL } from "@/lib/graphql";
import { CheckoutDeleteLinesDocument, CheckoutLinesUpdateDocument } from "@/gql/graphql";
import * as Checkout from "@/lib/checkout";
import { getSaleorApiUrl } from "@/lib/saleor-api-url.server";

export async function deleteCartLine(checkoutId: string, lineId: string) {
	const saleorApiUrl = await getSaleorApiUrl();
	if (!saleorApiUrl) {
		return;
	}
	const result = await executeAuthenticatedGraphQL(CheckoutDeleteLinesDocument, {
		variables: {
			checkoutId,
			lineIds: [lineId],
		},
		cache: "no-cache",
		saleorApiUrl,
	});

	// If cart is now empty, clear the checkout cookie to start fresh next time
	if (result.ok) {
		const checkout = result.data.checkoutLinesDelete?.checkout;
		if (checkout && checkout.lines.length === 0) {
			await Checkout.clearCheckoutCookie(checkout.channel.slug);
		}
	}

	revalidatePath("/cart");
	revalidatePath("/");
}

export async function updateCartLineQuantity(checkoutId: string, lineId: string, quantity: number) {
	if (quantity < 1) {
		return deleteCartLine(checkoutId, lineId);
	}

	const saleorApiUrl = await getSaleorApiUrl();
	if (!saleorApiUrl) {
		return;
	}
	await executeAuthenticatedGraphQL(CheckoutLinesUpdateDocument, {
		variables: {
			checkoutId,
			lines: [{ lineId, quantity }],
		},
		cache: "no-cache",
		saleorApiUrl,
	});

	revalidatePath("/cart");
	revalidatePath("/");
}
