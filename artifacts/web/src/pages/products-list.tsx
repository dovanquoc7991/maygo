import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import {
  useListProducts,
  useListCategories,
} from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

function useQueryString(): URLSearchParams {
  const [location] = useLocation();
  return useMemo(() => {
    const idx = location.indexOf("?");
    return new URLSearchParams(idx >= 0 ? location.slice(idx) : "");
  }, [location]);
}

export default function ProductsListPage() {
  const params = useQueryString();
  const initialCategory = params.get("category") ?? "";
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");

  const { data: categories } = useListCategories();
  const { data: products, isLoading } = useListProducts({
    ...(category ? { category } : {}),
    ...(search ? { search } : {}),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Sản phẩm</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Khám phá đầy đủ các dòng máy chế biến gỗ chúng tôi đang phân phối.
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm máy, hãng, dòng sản phẩm..."
            className="pl-9"
            data-testid="input-search"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-1">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Danh mục
          </h2>
          <button
            type="button"
            onClick={() => setCategory("")}
            className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
              category === ""
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
            data-testid="button-category-all"
          >
            Tất cả sản phẩm
          </button>
          {(categories ?? []).map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setCategory(c.slug)}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                category === c.slug
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
              data-testid={`button-category-${c.slug}`}
            >
              <span>{c.name}</span>
              <span className="text-xs opacity-70">{c.productCount}</span>
            </button>
          ))}
        </aside>

        <div>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 w-full" />
              ))}
            </div>
          ) : (products ?? []).length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
              Không tìm thấy sản phẩm phù hợp.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {(products ?? []).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
