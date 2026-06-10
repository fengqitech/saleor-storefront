"use client";

import Image, { type ImageProps } from "next/image";
import { useMemo, useState } from "react";

type Props = Omit<ImageProps, "src"> & {
	primarySrc: string;
	fallbackSrc?: string | null;
};

export function ImageWithFallback({ primarySrc, fallbackSrc, onError, ...props }: Props) {
	const candidates = useMemo(() => {
		const list = [primarySrc, fallbackSrc].filter(Boolean) as string[];
		return Array.from(new Set(list));
	}, [primarySrc, fallbackSrc]);

	const [idx, setIdx] = useState(0);
	const src = candidates[idx] ?? primarySrc;

	return (
		<Image
			{...props}
			src={src}
			onError={(e) => {
				if (idx < candidates.length - 1) {
					setIdx((prev) => prev + 1);
				}
				onError?.(e);
			}}
		/>
	);
}
