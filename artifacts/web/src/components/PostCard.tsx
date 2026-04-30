import { Link } from "wouter";
import { formatDate } from "@/lib/format";
import type { Post } from "@workspace/api-client-react";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/tin-tuc/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-card-border bg-card transition-shadow hover:shadow-md"
      data-testid={`card-post-${post.slug}`}
    >
      <div className="aspect-[16/9] overflow-hidden bg-muted">
        <img
          src={post.coverImageUrl}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{post.author}</span>
          <span>•</span>
          <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
        </div>
        <h3 className="mt-2 line-clamp-2 text-base font-semibold text-foreground group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}
