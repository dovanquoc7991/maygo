import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="mt-3 text-lg text-foreground">Không tìm thấy trang</p>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Đường dẫn bạn truy cập không tồn tại hoặc đã bị di chuyển.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Về trang chủ</Link>
      </Button>
    </div>
  );
}
