import "server-only";

import { type APL } from "@saleor/app-sdk/APL";

import { MultiFileAPL } from "./multi-file-apl";

function getAplFilePath(): string {
	// In the docker image used by this repo, `/app` is not writable by the runtime user.
	// Default to a writable path; override with `STOREFRONT_BUILDER_APL_FILE` for persistence.
	return process.env.STOREFRONT_BUILDER_APL_FILE || "/tmp/.storefront-builder-apl.json";
}

const apl: APL = new MultiFileAPL({
	fileName: getAplFilePath(),
});

export const saleorApp = {
	apl,
};
