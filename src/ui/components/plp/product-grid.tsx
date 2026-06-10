import { ProductCard, type ProductCardData } from "./product-card";

interface ProductGridProps {
	products: ProductCardData[];
	density?: "compact" | "standard" | "large";
}

const GRID_DENSITY_CLASS: Record<NonNullable<ProductGridProps["density"]>, string> = {
	compact: "grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4",
	standard: "grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6",
	large: "grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 lg:gap-8",
};

export function ProductGrid({ products, density = "standard" }: ProductGridProps) {
	const densityClass = GRID_DENSITY_CLASS[density] || GRID_DENSITY_CLASS.standard;
	return (
		<div className={`grid w-full ${densityClass}`}>
			{products.map((product, index) => (
				<ProductCard key={product.id} product={product} priority={index < 3} />
			))}
		</div>
	);
}
