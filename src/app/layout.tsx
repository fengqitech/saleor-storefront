import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Suspense, type ReactNode } from "react";
import { DraftModeNotification } from "@/ui/components/draft-mode-notification";
import { rootMetadata } from "@/lib/seo";
import { localeConfig } from "@/config/locale";
import { TenantHeadClient } from "@/ui/components/tenant-head-client";

/**
 * Root metadata for the entire site.
 * Configuration is in src/lib/seo/config.ts
 */
export const metadata = rootMetadata;

export default function RootLayout(props: { children: ReactNode }) {
	const { children } = props;

	return (
		<html lang={localeConfig.htmlLang} className={`${GeistSans.variable} ${GeistMono.variable} min-h-dvh`}>
			<body className="min-h-dvh font-sans">
				<Suspense>
					<TenantHeadClient />
				</Suspense>
				{children}
				<Suspense>
					<DraftModeNotification />
				</Suspense>
			</body>
		</html>
	);
}
