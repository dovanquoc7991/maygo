import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useGetCurrentAdmin } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { clearAdminToken } from "@/lib/api";
import {
  LayoutDashboard,
  Package,
  Newspaper,
  LogOut,
  Hammer,
  ExternalLink,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/san-pham", label: "Sản phẩm", icon: Package },
  { href: "/admin/bai-viet", label: "Bài viết", icon: Newspaper },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location, navigate] = useLocation();
  const { data: admin } = useGetCurrentAdmin();

  function handleLogout() {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
    window.location.reload();
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-64 flex-shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Hammer className="h-4 w-4" />
          </span>
          <span className="text-sm font-bold">Quản trị</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? location === "/admin"
                : location.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
                data-testid={`link-admin-${item.href.replace(/\//g, "-")}`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ExternalLink className="h-4 w-4" />
            Xem trang công khai
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-8">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {NAV.find((n) =>
                n.href === "/admin"
                  ? location === "/admin"
                  : location.startsWith(n.href),
              )?.label ?? "Quản trị"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {admin && (
              <span className="text-sm text-muted-foreground">
                Xin chào, <strong className="text-foreground">{admin.displayName}</strong>
              </span>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLogout}
              className="md:hidden"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
