import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { formatVnd } from "@/lib/format";
import type { Product } from "@workspace/api-client-react";

export function ProductCard({ product }: { product: Product }) {
  const onSale = product.salePrice != null && product.salePrice < product.price;
  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-card-border bg-card transition-shadow hover:shadow-md"
      data-testid={`card-product-${product.slug}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.coverImageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {onSale && (
          <Badge className="absolute left-3 top-3 bg-destructive text-destructive-foreground">
            Khuyến mãi
          </Badge>
        )}
        {!product.inStock && (
          <Badge className="absolute right-3 top-3" variant="secondary">
            Hết hàng
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {product.categoryName}
        </span>
        <h3 className="mt-1 line-clamp-2 text-base font-semibold text-foreground group-hover:text-primary">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
          {product.shortDescription}
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            {formatVnd(onSale ? product.salePrice : product.price)}
          </span>
          {onSale && (
            <span className="text-xs text-muted-foreground line-through">
              {formatVnd(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
