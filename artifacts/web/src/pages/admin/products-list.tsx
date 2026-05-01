import { Link } from "wouter";
import {
  useListAdminProducts,
  useDeleteProduct,
  getListAdminProductsQueryKey,
  getGetAdminStatsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
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
import { formatVnd } from "@/lib/format";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminProductsListPage() {
  const { data, isLoading } = useListAdminProducts();
  const qc = useQueryClient();
  const { toast } = useToast();
  const del = useDeleteProduct();

  function handleDelete(id: number, name: string) {
    del.mutate(
      { id },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListAdminProductsQueryKey() });
          qc.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
          toast({ title: "Đã xóa", description: `Đã xóa "${name}".` });
        },
        onError: () => {
          toast({
            title: "Lỗi",
            description: "Không thể xóa sản phẩm",
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
          {data?.length ?? 0} sản phẩm trong hệ thống
        </p>
        <Button asChild data-testid="button-new-product">
          <Link href="/admin/san-pham/moi">
            <Plus className="mr-1 h-4 w-4" /> Thêm sản phẩm
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
          Chưa có sản phẩm nào. Bấm "Thêm sản phẩm" để bắt đầu.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-card-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">Danh mục</th>
                <th className="px-4 py-3">Giá</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(data ?? []).map((p) => (
                <tr key={p.id} data-testid={`row-product-${p.id}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.coverImageUrl}
                        alt=""
                        className="h-10 w-10 flex-shrink-0 rounded object-cover"
                      />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-foreground">
                          {p.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {p.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.categoryName}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatVnd(p.salePrice ?? p.price)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.featured && (
                        <Badge className="bg-primary/10 text-primary border border-primary/30">
                          Nổi bật
                        </Badge>
                      )}
                      {p.inStock ? (
                        <Badge variant="outline">Còn hàng</Badge>
                      ) : (
                        <Badge variant="secondary">Hết hàng</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        asChild
                        data-testid={`button-edit-${p.id}`}
                      >
                        <Link href={`/admin/san-pham/${p.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            data-testid={`button-delete-${p.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xóa sản phẩm?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc muốn xóa "{p.name}"? Hành động này
                              không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(p.id, p.name)}
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
