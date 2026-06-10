"use client";

import { useMemo, useState } from "react";

type AnnouncementBarProps = {
	message: string;
	ctaLabel?: string;
	ctaHref?: string;
	dismissible?: boolean;
};

function createAnnouncementStorageKey(message: string, ctaHref?: string): string {
	const normalized = `${message}::${ctaHref || ""}`.trim().toLowerCase();
	return `storefront:announcement:dismissed:${normalized}`;
}

export function AnnouncementBar(props: AnnouncementBarProps) {
	const { message, ctaLabel, ctaHref, dismissible = false } = props;
	const storageKey = useMemo(() => createAnnouncementStorageKey(message, ctaHref), [message, ctaHref]);
	const [dismissed, setDismissed] = useState(() => {
		if (!dismissible) return false;
		if (typeof window === "undefined") return false;
		try {
			return window.localStorage.getItem(storageKey) === "1";
		} catch {
			return false;
		}
	});

	if (dismissed || !message) return null;

	const close = () => {
		if (!dismissible) return;
		try {
			window.localStorage.setItem(storageKey, "1");
		} catch {
			// noop
		}
		setDismissed(true);
	};

	return (
		<div className="flex flex-wrap items-center justify-center gap-3">
			<span>{message}</span>
			{ctaLabel && ctaHref ? (
				<a
					href={ctaHref}
					className="inline-flex rounded-md border border-current px-3 py-1 text-xs font-medium hover:opacity-90"
				>
					{ctaLabel}
				</a>
			) : null}
			{dismissible ? (
				<button
					type="button"
					onClick={close}
					className="border-current/40 hover:bg-foreground/10 inline-flex h-6 w-6 items-center justify-center rounded-md border text-xs"
					aria-label="关闭公告"
				>
					×
				</button>
			) : null}
		</div>
	);
}
