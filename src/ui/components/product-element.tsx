import { LinkWithChannel } from "../atoms/link-with-channel";
import { ProductImageWrapper } from "@/ui/atoms/product-image-wrapper";

import type { ProductListItemFragment } from "@/gql/graphql";
import { formatMoneyRange } from "@/lib/utils";
import { getTenantFriendlyMediaSources } from "@/lib/tenant-media-url";

function pickPrimaryProductImage(product: ProductListItemFragment): { url: string; alt: string } | null {
	const mediaImages =
		product.media
			?.filter((m) => m.type === "IMAGE" && m.url)
			.slice()
			.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)) ?? [];
	const primary = mediaImages[0];
	if (primary?.url) {
		const sources = getTenantFriendlyMediaSources(primary, 512);
		return { url: sources?.primary ?? primary.url, alt: primary.alt ?? product.name };
	}
	if (product.thumbnail?.url) {
		const sources = getTenantFriendlyMediaSources({ url: product.thumbnail.url }, 512);
		return { url: sources?.primary ?? product.thumbnail.url, alt: product.thumbnail.alt ?? product.name };
	}
	return null;
}

export function ProductElement({
	product,
	loading,
	priority,
}: { product: ProductListItemFragment } & { loading: "eager" | "lazy"; priority?: boolean }) {
	const image = pickPrimaryProductImage(product);
	return (
		<li data-testid="ProductElement">
			<LinkWithChannel href={`/products/${product.slug}`} key={product.id}>
				<div>
					{image?.url && (
						<ProductImageWrapper
							loading={loading}
							src={image.url}
							alt={image.alt}
							width={512}
							height={512}
							sizes={"512px"}
							priority={priority}
						/>
					)}
					<div className="mt-2 flex justify-between">
						<div>
							<h3 className="mt-1 text-sm font-semibold text-neutral-900">{product.name}</h3>
							<p className="mt-1 text-sm text-neutral-500" data-testid="ProductElement_Category">
								{product.category?.name}
							</p>
						</div>
						<p className="mt-1 text-sm font-medium text-neutral-900" data-testid="ProductElement_PriceRange">
							{formatMoneyRange({
								start: product?.pricing?.priceRange?.start?.gross,
								stop: product?.pricing?.priceRange?.stop?.gross,
							})}
						</p>
					</div>
				</div>
			</LinkWithChannel>
		</li>
	);
}
