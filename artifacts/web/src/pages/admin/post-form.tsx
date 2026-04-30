import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListAdminPosts,
  useCreatePost,
  useUpdatePost,
  getListAdminPostsQueryKey,
  getGetAdminStatsQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/format";
import { ChevronLeft } from "lucide-react";

type FormState = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  author: string;
  tagsText: string;
  published: boolean;
};

const EMPTY: FormState = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  author: "Ban biên tập",
  tagsText: "",
  published: true,
};

export default function AdminPostFormPage() {
  const [matchEdit, paramsEdit] = useRoute("/admin/bai-viet/:id");
  const [matchNew] = useRoute("/admin/bai-viet/moi");
  const isEdit = matchEdit && !matchNew;
  const postId = isEdit ? parseInt(paramsEdit?.id ?? "", 10) : null;

  const [, navigate] = useLocation();
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: list } = useListAdminPosts({
    query: { queryKey: getListAdminPostsQueryKey(), enabled: isEdit },
  });
  const existing = useMemo(
    () => (postId != null ? list?.find((p) => p.id === postId) : undefined),
    [list, postId],
  );

  const [state, setState] = useState<FormState>(EMPTY);
  const [touchedSlug, setTouchedSlug] = useState(false);

  useEffect(() => {
    if (existing) {
      setState({
        slug: existing.slug,
        title: existing.title,
        excerpt: existing.excerpt,
        content: existing.content,
        coverImageUrl: existing.coverImageUrl,
        author: existing.author,
        tagsText: (existing.tags ?? []).join(", "),
        published: existing.published,
      });
    }
  }, [existing]);

  const create = useCreatePost();
  const update = useUpdatePost();
  const submitting = create.isPending || update.isPending;

  function update_(field: keyof FormState, value: unknown) {
    setState((s) => ({ ...s, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      slug: state.slug.trim(),
      title: state.title.trim(),
      excerpt: state.excerpt.trim(),
      content: state.content.trim(),
      coverImageUrl: state.coverImageUrl.trim(),
      author: state.author.trim(),
      tags: state.tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      published: state.published,
    };
    const onSuccess = () => {
      qc.invalidateQueries({ queryKey: getListAdminPostsQueryKey() });
      qc.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
      toast({ title: isEdit ? "Đã cập nhật" : "Đã đăng bài" });
      navigate("/admin/bai-viet");
    };
    const onError = () => {
      toast({
        title: "Lưu thất bại",
        description: "Kiểm tra slug có bị trùng và các trường bắt buộc.",
        variant: "destructive",
      });
    };
    if (isEdit && postId != null) {
      update.mutate({ id: postId, data: payload }, { onSuccess, onError });
    } else {
      create.mutate({ data: payload }, { onSuccess, onError });
    }
  }

  return (
    <div>
      <Link
        href="/admin/bai-viet"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Danh sách bài viết
      </Link>
      <h2 className="mt-2 text-xl font-bold">
        {isEdit ? "Chỉnh sửa bài viết" : "Viết bài mới"}
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-lg border border-card-border bg-card p-5 space-y-3">
            <div className="space-y-1.5">
              <Label>Tiêu đề *</Label>
              <Input
                value={state.title}
                onChange={(e) => {
                  update_("title", e.target.value);
                  if (!isEdit && !touchedSlug) update_("slug", slugify(e.target.value));
                }}
                required
                data-testid="input-title"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Slug *</Label>
              <Input
                value={state.slug}
                onChange={(e) => {
                  setTouchedSlug(true);
                  update_("slug", e.target.value);
                }}
                required
                data-testid="input-post-slug"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tóm tắt *</Label>
              <Textarea
                value={state.excerpt}
                onChange={(e) => update_("excerpt", e.target.value)}
                rows={3}
                required
                data-testid="input-excerpt"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Nội dung *</Label>
              <Textarea
                value={state.content}
                onChange={(e) => update_("content", e.target.value)}
                rows={14}
                required
                data-testid="input-content"
              />
              <p className="text-xs text-muted-foreground">
                Hỗ trợ xuống dòng để chia đoạn.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-card-border bg-card p-5 space-y-3">
            <div className="space-y-1.5">
              <Label>Ảnh bìa (URL) *</Label>
              <Input
                value={state.coverImageUrl}
                onChange={(e) => update_("coverImageUrl", e.target.value)}
                required
                data-testid="input-post-cover"
              />
              {state.coverImageUrl && (
                <img
                  src={state.coverImageUrl}
                  alt=""
                  className="mt-2 aspect-[16/9] w-full rounded-md object-cover"
                />
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Tác giả *</Label>
              <Input
                value={state.author}
                onChange={(e) => update_("author", e.target.value)}
                required
                data-testid="input-author"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tag (cách nhau bằng dấu phẩy)</Label>
              <Input
                value={state.tagsText}
                onChange={(e) => update_("tagsText", e.target.value)}
                placeholder="CNC, Tư vấn, Kỹ thuật"
                data-testid="input-tags"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="published">Xuất bản công khai</Label>
              <Switch
                id="published"
                checked={state.published}
                onCheckedChange={(v) => update_("published", v)}
                data-testid="switch-published"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={submitting} data-testid="button-save-post">
              {submitting ? "Đang lưu..." : isEdit ? "Cập nhật" : "Đăng bài"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/bai-viet")}
            >
              Hủy
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
