import { Link } from "wouter";
import { useGetAdminStats } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  Newspaper,
  Star,
  XCircle,
  CheckCircle,
  Tags,
} from "lucide-react";

const TILES = [
  { key: "totalProducts", label: "Sản phẩm", icon: Package, href: "/admin/san-pham" },
  { key: "featuredProducts", label: "Sản phẩm nổi bật", icon: Star, href: "/admin/san-pham" },
  { key: "outOfStockProducts", label: "Hết hàng", icon: XCircle, href: "/admin/san-pham" },
  { key: "totalCategories", label: "Danh mục", icon: Tags, href: "/admin/san-pham" },
  { key: "totalPosts", label: "Bài viết", icon: Newspaper, href: "/admin/bai-viet" },
  { key: "publishedPosts", label: "Đã xuất bản", icon: CheckCircle, href: "/admin/bai-viet" },
] as const;

export default function AdminDashboardPage() {
  const { data, isLoading } = useGetAdminStats();

  return (
    <div>
      <p className="mb-6 text-sm text-muted-foreground">
        Tổng quan dữ liệu trang web. Truy cập các mục bên trái để quản lý.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((t) => (
          <Link
            key={t.key}
            href={t.href}
            className="rounded-lg border border-card-border bg-card p-5 transition-shadow hover:shadow-md"
            data-testid={`tile-${t.key}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {t.label}
              </span>
              <t.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-2 text-3xl font-bold text-foreground">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                (data?.[t.key] ?? 0)
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
