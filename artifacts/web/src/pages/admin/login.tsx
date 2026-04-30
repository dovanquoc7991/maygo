import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAdminLogin } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { setAdminToken, getAdminToken } from "@/lib/api";
import { Hammer } from "lucide-react";

export default function AdminLoginPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const login = useAdminLogin();

  useEffect(() => {
    if (getAdminToken()) navigate("/admin", { replace: true });
  }, [navigate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login.mutate(
      { data: { username, password } },
      {
        onSuccess: (data) => {
          setAdminToken(data.token);
          window.location.href = `${import.meta.env.BASE_URL}admin`.replace(
            /\/+/g,
            "/",
          );
        },
        onError: () => {
          toast({
            title: "Đăng nhập thất bại",
            description: "Sai tên đăng nhập hoặc mật khẩu",
            variant: "destructive",
          });
        },
      },
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar p-4">
      <div className="w-full max-w-sm rounded-xl bg-card p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Hammer className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-base font-bold text-foreground">Quản trị</h1>
            <p className="text-xs text-muted-foreground">Xưởng Máy Gỗ Việt</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              data-testid="input-username"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              data-testid="input-password"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={login.isPending}
            data-testid="button-login"
          >
            {login.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Tài khoản mặc định: <code className="font-mono">admin</code> /{" "}
          <code className="font-mono">admin123</code>
        </p>
      </div>
    </div>
  );
}
