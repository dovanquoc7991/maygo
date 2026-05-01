import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Hammer } from "lucide-react";

const NAV = [
  { href: "/", label: "Trang chủ" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/lien-he", label: "Liên hệ" },
];

export function Header() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="bg-sidebar text-sidebar-foreground">
        <div className="container mx-auto flex h-9 items-center justify-between px-4 text-xs">
          <span className="hidden sm:inline">
            Chuyên cung cấp máy chế biến gỗ chính hãng — Bảo hành tận xưởng toàn quốc
          </span>
          <a
            href="tel:0901234567"
            className="flex items-center gap-1.5 hover:text-sidebar-primary"
            data-testid="link-hotline"
          >
            <Phone className="h-3 w-3" />
            <span>Hotline: 0901 234 567</span>
          </a>
        </div>
      </div>

      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" data-testid="link-home">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Hammer className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight text-foreground">
              Xưởng Máy Gỗ Việt
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Máy chế biến gỗ công nghiệp
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? location === "/"
                : location.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary ${
                  active ? "text-primary" : "text-foreground"
                }`}
                data-testid={`link-nav-${item.href.replace(/\//g, "") || "home"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Button asChild size="sm" data-testid="button-contact">
            <Link href="/lien-he">Báo giá ngay</Link>
          </Button>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Mở menu"
          data-testid="button-menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border md:hidden">
          <div className="container mx-auto flex flex-col px-4 py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                data-testid={`link-mobile-${item.href.replace(/\//g, "") || "home"}`}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild size="sm" className="mt-2" onClick={() => setOpen(false)}>
              <Link href="/lien-he">Báo giá ngay</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
