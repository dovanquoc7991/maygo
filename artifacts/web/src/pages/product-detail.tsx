import { useState } from "react";
import { Link, useRoute } from "wouter";
import { useGetProductBySlug } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatVnd } from "@/lib/format";
import { Phone, Check, ChevronLeft } from "lucide-react";

export default function ProductDetailPage() {
  const [, params] = useRoute("/san-pham/:slug");
  const slug = params?.slug ?? "";
  const { data, isLoading, isError } = useGetProductBySlug(slug);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Không tìm thấy sản phẩm</h1>
        <Button asChild className="mt-4">
          <Link href="/san-pham">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  const onSale = data.salePrice != null && data.salePrice < data.price;
  const images = [data.coverImageUrl, ...(data.gallery ?? [])].filter(
    (v, i, arr) => v && arr.indexOf(v) === i,
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/san-pham"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Tất cả sản phẩm
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-lg border border-card-border bg-muted">
            <img
              src={images[activeImage]}
              alt={data.name}
              className="h-full w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square overflow-hidden rounded-md border-2 transition-colors ${
                    activeImage === i ? "border-primary" : "border-transparent"
                  }`}
                  data-testid={`button-thumb-${i}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {data.categoryName}
          </span>
          <h1 className="mt-1 text-3xl font-bold text-foreground">
            {data.name}
          </h1>
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span>Mã: {data.sku}</span>
            <span>•</span>
            <span>Hãng: {data.brand}</span>
            {data.origin && (
              <>
                <span>•</span>
                <span>Xuất xứ: {data.origin}</span>
              </>
            )}
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              {formatVnd(onSale ? data.salePrice : data.price)}
            </span>
            {onSale && (
              <span className="text-base text-muted-foreground line-through">
                {formatVnd(data.price)}
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {data.inStock ? (
              <Badge className="bg-emerald-600 text-white">Còn hàng</Badge>
            ) : (
              <Badge variant="secondary">Hết hàng</Badge>
            )}
            {data.warrantyMonths && (
              <Badge variant="outline">Bảo hành {data.warrantyMonths} tháng</Badge>
            )}
            {data.featured && (
              <Badge className="bg-primary/10 text-primary border border-primary/30">
                Nổi bật
              </Badge>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {data.shortDescription}
          </p>

          {data.features && data.features.length > 0 && (
            <ul className="mt-5 space-y-2">
              {data.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" data-testid="button-quote">
              <Link href="/lien-he">Yêu cầu báo giá</Link>
            </Button>
            <Button asChild size="lg" variant="outline" data-testid="button-call">
              <a href="tel:0901234567">
                <Phone className="mr-1 h-4 w-4" /> Gọi 0901 234 567
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-foreground">Mô tả chi tiết</h2>
          <div className="prose prose-sm mt-3 max-w-none whitespace-pre-line text-muted-foreground">
            {data.description}
          </div>
        </div>

        {data.specs && data.specs.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-foreground">Thông số kỹ thuật</h2>
            <dl className="mt-3 divide-y divide-border rounded-lg border border-card-border bg-card text-sm">
              {data.dimensions && (
                <div className="flex justify-between gap-4 px-4 py-3">
                  <dt className="text-muted-foreground">Kích thước</dt>
                  <dd className="text-right font-medium">{data.dimensions}</dd>
                </div>
              )}
              {data.weightKg != null && (
                <div className="flex justify-between gap-4 px-4 py-3">
                  <dt className="text-muted-foreground">Khối lượng</dt>
                  <dd className="text-right font-medium">{data.weightKg} kg</dd>
                </div>
              )}
              {data.powerKw != null && (
                <div className="flex justify-between gap-4 px-4 py-3">
                  <dt className="text-muted-foreground">Công suất</dt>
                  <dd className="text-right font-medium">{data.powerKw} kW</dd>
                </div>
              )}
              {data.specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-4 px-4 py-3">
                  <dt className="text-muted-foreground">{s.label}</dt>
                  <dd className="text-right font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
