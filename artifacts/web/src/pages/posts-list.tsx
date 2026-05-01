import { useState } from "react";
import { useListPosts } from "@workspace/api-client-react";
import { PostCard } from "@/components/PostCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export default function PostsListPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useListPosts(search ? { search } : {});

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Tin tức & kỹ thuật</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Hướng dẫn lựa chọn, vận hành và bảo trì máy chế biến gỗ.
        </p>
      </header>

      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm bài viết..."
          className="pl-9"
          data-testid="input-search-posts"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : (data ?? []).length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          Chưa có bài viết phù hợp.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(data ?? []).map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
