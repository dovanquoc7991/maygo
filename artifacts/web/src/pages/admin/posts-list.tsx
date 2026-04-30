import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListAdminPosts,
  useDeletePost,
  getListAdminPostsQueryKey,
  getGetAdminStatsQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/format";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminPostsListPage() {
  const { data, isLoading } = useListAdminPosts();
  const qc = useQueryClient();
  const { toast } = useToast();
  const del = useDeletePost();

  function handleDelete(id: number, title: string) {
    del.mutate(
      { id },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListAdminPostsQueryKey() });
          qc.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
          toast({ title: "Đã xóa", description: `Đã xóa "${title}".` });
        },
        onError: () => {
          toast({
            title: "Lỗi",
            description: "Không thể xóa bài viết",
            variant: "destructive",
          });
        },
      },
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {data?.length ?? 0} bài viết trong hệ thống
        </p>
        <Button asChild data-testid="button-new-post">
          <Link href="/admin/bai-viet/moi">
            <Plus className="mr-1 h-4 w-4" /> Viết bài mới
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (data?.length ?? 0) === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          Chưa có bài viết nào.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-card-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Tiêu đề</th>
                <th className="px-4 py-3">Tác giả</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày đăng</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(data ?? []).map((p) => (
                <tr key={p.id} data-testid={`row-post-${p.id}`}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{p.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.author}</td>
                  <td className="px-4 py-3">
                    {p.published ? (
                      <Badge className="bg-emerald-600 text-white">Đã đăng</Badge>
                    ) : (
                      <Badge variant="secondary">Bản nháp</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(p.publishedAt ?? p.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/admin/bai-viet/${p.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xóa bài viết?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc muốn xóa "{p.title}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(p.id, p.title)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
