import { Link, useRoute } from "wouter";
import { useGetPostBySlug } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import { ChevronLeft } from "lucide-react";

export default function PostDetailPage() {
  const [, params] = useRoute("/tin-tuc/:slug");
  const slug = params?.slug ?? "";
  const { data, isLoading, isError } = useGetPostBySlug(slug);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-10 space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="aspect-[16/9] w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Không tìm thấy bài viết</h1>
        <Button asChild className="mt-4">
          <Link href="/tin-tuc">Quay lại tin tức</Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="container mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/tin-tuc"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Tất cả bài viết
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">
        {data.title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span>{data.author}</span>
        <span>•</span>
        <span>{formatDate(data.publishedAt ?? data.createdAt)}</span>
        {data.tags.map((t) => (
          <Badge key={t} variant="secondary">{t}</Badge>
        ))}
      </div>

      <p className="mt-4 border-l-4 border-primary bg-muted/40 p-4 text-base italic text-muted-foreground">
        {data.excerpt}
      </p>

      <div className="mt-6 aspect-[16/9] overflow-hidden rounded-lg bg-muted">
        <img
          src={data.coverImageUrl}
          alt={data.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="prose prose-base mt-8 max-w-none whitespace-pre-line leading-relaxed text-foreground">
        {data.content}
      </div>
    </article>
  );
}
