import { Link } from "wouter";
import { Hammer, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
              <Hammer className="h-5 w-5" />
            </span>
            <span className="font-bold">Xưởng Máy Gỗ Việt</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-sidebar-foreground/70">
            Đơn vị nhập khẩu và phân phối máy chế biến gỗ công nghiệp, phục vụ
            các xưởng mộc, nhà máy nội thất trên toàn quốc.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
            Sản phẩm
          </h3>
          <ul className="space-y-2 text-sm text-sidebar-foreground/80">
            <li><Link href="/san-pham?category=may-cnc" className="hover:text-sidebar-primary">Máy CNC</Link></li>
            <li><Link href="/san-pham?category=may-bao" className="hover:text-sidebar-primary">Máy bào</Link></li>
            <li><Link href="/san-pham?category=may-cua" className="hover:text-sidebar-primary">Máy cưa</Link></li>
            <li><Link href="/san-pham?category=may-cha-nham" className="hover:text-sidebar-primary">Máy chà nhám</Link></li>
            <li><Link href="/san-pham?category=may-ghep-go" className="hover:text-sidebar-primary">Máy ghép gỗ</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
            Hỗ trợ
          </h3>
          <ul className="space-y-2 text-sm text-sidebar-foreground/80">
            <li><Link href="/gioi-thieu" className="hover:text-sidebar-primary">Giới thiệu</Link></li>
            <li><Link href="/tin-tuc" className="hover:text-sidebar-primary">Tin tức kỹ thuật</Link></li>
            <li><Link href="/lien-he" className="hover:text-sidebar-primary">Yêu cầu báo giá</Link></li>
            <li><Link href="/admin/login" className="hover:text-sidebar-primary">Quản trị nội bộ</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
            Liên hệ
          </h3>
          <ul className="space-y-2 text-sm text-sidebar-foreground/80">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>KCN Quang Minh, Mê Linh, Hà Nội</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <a href="tel:0901234567" className="hover:text-sidebar-primary">
                0901 234 567
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <a href="mailto:contact@xuongmaygo.vn" className="hover:text-sidebar-primary">
                contact@xuongmaygo.vn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sidebar-border">
        <div className="container mx-auto px-4 py-4 text-center text-xs text-sidebar-foreground/60">
          © {new Date().getFullYear()} Xưởng Máy Gỗ Việt. Mọi quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
