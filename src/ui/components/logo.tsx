import { LinkWithChannel } from "../atoms/link-with-channel";
import { Logo as SharedLogo } from "./shared/logo";
import type { TenantBranding } from "@/config/tenant-branding";

/**
 * Site logo with link to homepage.
 * Always renders as a link - no client-side pathname detection needed.
 */
export const Logo = ({ branding }: { branding?: TenantBranding }) => {
	return (
		<LinkWithChannel href="/" className="flex shrink-0 items-center" aria-label="Homepage">
			<SharedLogo
				className="h-7 w-auto"
				ariaLabel={branding?.siteName}
				logoLightSrc={branding?.logoLightSrc}
				logoDarkSrc={branding?.logoDarkSrc}
			/>
		</LinkWithChannel>
	);
};
