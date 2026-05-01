import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import {
  useGetCurrentAdmin,
  getGetCurrentAdminQueryKey,
} from "@workspace/api-client-react";
import { getAdminToken, clearAdminToken } from "@/lib/api";

export function RequireAuth({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  const token = getAdminToken();
  const { data, isLoading, isError } = useGetCurrentAdmin({
    query: {
      queryKey: getGetCurrentAdminQueryKey(),
      enabled: Boolean(token),
      retry: false,
    },
  });

  useEffect(() => {
    if (!token) {
      navigate("/admin/login", { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    if (isError) {
      clearAdminToken();
      navigate("/admin/login", { replace: true });
    }
  }, [isError, navigate]);

  if (!token) return null;
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Đang xác thực...
      </div>
    );
  }
  if (!data) return null;
  return <>{children}</>;
}
