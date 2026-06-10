import { ProductsPerPage } from "@/app/config";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatPrice, formatDate as formatLocaleDate } from "@/config/locale";

/** Merge class names with clsx and tailwind-merge for proper Tailwind class deduplication */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/** @deprecated Use formatDate from @/config/locale instead */
export const formatDate = formatLocaleDate;

/** @deprecated Use formatPrice from @/config/locale instead */
export const formatMoney = formatPrice;

export const formatMoneyRange = (
	range: {
		start?: { amount: number; currency: string } | null;
		stop?: { amount: number; currency: string } | null;
	} | null,
) => {
	const { start, stop } = range || {};
	const startMoney = start && formatMoney(start.amount, start.currency);
	const stopMoney = stop && formatMoney(stop.amount, stop.currency);

	if (startMoney === stopMoney) {
		return startMoney;
	}

	return `${startMoney} - ${stopMoney}`;
};

export function getHrefForVariant({
	productSlug,
	variantId,
}: {
	productSlug: string;
	variantId?: string;
}): string {
	const pathname = `/products/${encodeURIComponent(productSlug)}`;

	if (!variantId) {
		return pathname;
	}

	const query = new URLSearchParams({ variant: variantId });
	return `${pathname}?${query.toString()}`;
}

export type PaginatedListVariables = {
	first?: number;
	after?: string | null;
	last?: number;
	before?: string | null;
};

export const getPaginatedListVariables = ({
	params,
}: {
	params: { [key: string]: unknown };
}): PaginatedListVariables => {
	const cursor = typeof params?.cursor === "string" ? params?.cursor : null;
	const direction = params?.direction === "prev" ? "prev" : "next";
	const rawPerPage = typeof params?.perPage === "string" ? params.perPage : null;
	const parsedPerPage = rawPerPage ? Number.parseInt(rawPerPage, 10) : NaN;
	const perPage =
		Number.isFinite(parsedPerPage) && parsedPerPage > 0
			? Math.min(Math.max(parsedPerPage, 1), 48)
			: ProductsPerPage;

	return direction === "prev" ? { last: perPage, before: cursor } : { first: perPage, after: cursor };
};
