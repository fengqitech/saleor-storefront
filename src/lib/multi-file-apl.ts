import "server-only";

import { promises as fs } from "fs";

import type { APL, AuthData } from "@saleor/app-sdk/APL";

type StoredAuthData = Pick<AuthData, "token" | "saleorApiUrl" | "appId" | "jwks">;

function isRecord(value: unknown): value is Record<string, unknown> {
	return !!value && typeof value === "object" && !Array.isArray(value);
}

function isStoredAuthData(value: unknown): value is StoredAuthData {
	if (!isRecord(value)) {
		return false;
	}
	return (
		typeof value.token === "string" &&
		typeof value.saleorApiUrl === "string" &&
		typeof value.appId === "string"
	);
}

function normalizeStoredData(parsed: unknown): StoredAuthData[] {
	// `FileAPL` writes a single object. We support that legacy format too.
	if (isStoredAuthData(parsed)) {
		return [parsed];
	}
	if (Array.isArray(parsed)) {
		return parsed.filter(isStoredAuthData);
	}
	return [];
}

export class MultiFileAPL implements APL {
	private readonly fileName: string;

	constructor(config: { fileName: string }) {
		this.fileName = config.fileName;
	}

	private async load(): Promise<StoredAuthData[]> {
		try {
			const raw = await fs.readFile(this.fileName, "utf-8");
			return normalizeStoredData(JSON.parse(raw));
		} catch {
			return [];
		}
	}

	private async save(data: StoredAuthData[]): Promise<void> {
		const tmpFileName = `${this.fileName}.tmp`;
		const payload = JSON.stringify(data, null, 2);
		await fs.writeFile(tmpFileName, payload);
		await fs.rename(tmpFileName, this.fileName);
	}

	async get(saleorApiUrl: string): Promise<AuthData | undefined> {
		const all = await this.load();
		return all.find((item) => item.saleorApiUrl === saleorApiUrl);
	}

	async getAll(): Promise<AuthData[]> {
		return await this.load();
	}

	async set(authData: AuthData): Promise<void> {
		const all = await this.load();
		const without = all.filter((item) => item.saleorApiUrl !== authData.saleorApiUrl);
		without.push({
			token: authData.token,
			saleorApiUrl: authData.saleorApiUrl,
			appId: authData.appId,
			jwks: authData.jwks,
		});
		await this.save(without);
	}

	async delete(saleorApiUrl: string): Promise<void> {
		const all = await this.load();
		const without = all.filter((item) => item.saleorApiUrl !== saleorApiUrl);
		await this.save(without);
	}
}
