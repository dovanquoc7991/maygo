import { Link } from "wouter";
import { useGetHomeSummary } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/ProductCard";
import { PostCard } from "@/components/PostCard";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Wrench,
  PhoneCall,
} from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Bảo hành 12 - 18 tháng",
    desc: "Cam kết phụ tùng chính hãng, bảo hành tận xưởng toàn quốc.",
  },
  {
    icon: Truck,
    title: "Vận chuyển miễn phí",
    desc: "Giao hàng và lắp đặt miễn phí trong bán kính 200km Hà Nội.",
  },
  {
    icon: Wrench,
    title: "Đào tạo vận hành",
    desc: "Kỹ thuật viên hướng dẫn vận hành tại xưởng cho công nhân.",
  },
  {
    icon: PhoneCall,
    title: "Hỗ trợ 24/7",
    desc: "Đường dây kỹ thuật trực 24/7, phản hồi sự cố trong vòng 1 giờ.",
  },
];

export default function HomePage() {
  const { data, isLoading } = useGetHomeSummary();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-sidebar text-sidebar-foreground">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1920&q=80)",
          }}
        />
        <div className="relative container mx-auto grid gap-8 px-4 py-20 md:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-block rounded-full bg-sidebar-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sidebar-primary">
              Máy chế biến gỗ công nghiệp
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
              Giải pháp máy móc toàn diện cho{" "}
              <span className="text-sidebar-primary">xưởng mộc Việt</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-sidebar-foreground/80">
              Phân phối máy CNC, máy bào, máy cưa, máy chà nhám, máy ghép gỗ
              chính hãng. Tư vấn cấu hình theo nhu cầu sản xuất, bảo hành tại xưởng.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" data-testid="button-hero-products">
                <Link href="/san-pham">
                  Xem sản phẩm <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-sidebar-foreground/30 bg-transparent text-sidebar-foreground hover:bg-sidebar-accent"
                data-testid="button-hero-quote"
              >
                <Link href="/lien-he">Yêu cầu báo giá</Link>
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-6 border-t border-sidebar-border pt-6">
              <div>
                <div className="text-2xl font-bold text-sidebar-primary">
                  10+
                </div>
                <div className="text-xs text-sidebar-foreground/70">
                  Năm kinh nghiệm
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-sidebar-primary">
                  {data?.totalProducts ?? 0}+
                </div>
                <div className="text-xs text-sidebar-foreground/70">
                  Sản phẩm
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-sidebar-primary">
                  500+
                </div>
                <div className="text-xs text-sidebar-foreground/70">
                  Xưởng đã hợp tác
                </div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?w=1200&q=80"
              alt="Xưởng máy gỗ"
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-card-border bg-card p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-base font-semibold text-foreground">
                {f.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Danh mục sản phẩm
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Đầy đủ các dòng máy chế biến gỗ cho mọi quy mô xưởng.
            </p>
          </div>
          <Link
            href="/san-pham"
            className="hidden text-sm font-medium text-primary hover:underline md:inline-flex"
          >
            Xem tất cả →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(data?.categories ?? []).map((c) => (
            <Link
              key={c.slug}
              href={`/san-pham?category=${c.slug}`}
              className="flex items-center justify-between rounded-lg border border-card-border bg-card p-5 transition-shadow hover:shadow-md"
              data-testid={`link-category-${c.slug}`}
            >
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {c.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {c.productCount} sản phẩm
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-primary" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Sản phẩm nổi bật
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Các dòng máy được chọn lọc, phổ biến nhất tại các xưởng Việt Nam.
            </p>
          </div>
          <Link
            href="/san-pham"
            className="hidden text-sm font-medium text-primary hover:underline md:inline-flex"
          >
            Xem tất cả →
          </Link>
        </div>
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(data?.featuredProducts ?? []).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Posts */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Tin tức & kỹ thuật
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Cập nhật xu hướng, hướng dẫn vận hành và bảo trì máy móc.
            </p>
          </div>
          <Link
            href="/tin-tuc"
            className="hidden text-sm font-medium text-primary hover:underline md:inline-flex"
          >
            Xem tất cả →
          </Link>
        </div>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(data?.latestPosts ?? []).slice(0, 3).map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-12">
        <div className="overflow-hidden rounded-2xl bg-primary text-primary-foreground">
          <div className="grid gap-6 p-8 md:grid-cols-[2fr_1fr] md:items-center md:p-12">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">
                Cần tư vấn cấu hình máy cho xưởng của bạn?
              </h2>
              <p className="mt-2 text-primary-foreground/85">
                Đội ngũ kỹ thuật khảo sát và tư vấn miễn phí. Báo giá trong vòng 24h.
              </p>
            </div>
            <div className="flex md:justify-end">
              <Button asChild size="lg" variant="secondary" data-testid="button-cta-contact">
                <Link href="/lien-he">Liên hệ ngay</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
