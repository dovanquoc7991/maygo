import type { Product, Post } from "@workspace/db";

export function serializeProduct(p: Product) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    description: p.description,
    price: Number(p.price),
    salePrice: p.salePrice == null ? null : Number(p.salePrice),
    currency: p.currency,
    categorySlug: p.categorySlug,
    categoryName: p.categoryName,
    brand: p.brand,
    sku: p.sku,
    powerKw: p.powerKw == null ? null : Number(p.powerKw),
    weightKg: p.weightKg == null ? null : Number(p.weightKg),
    dimensions: p.dimensions ?? null,
    warrantyMonths: p.warrantyMonths ?? null,
    origin: p.origin ?? null,
    coverImageUrl: p.coverImageUrl,
    gallery: p.gallery ?? [],
    features: p.features ?? [],
    specs: p.specs ?? [],
    inStock: p.inStock,
    featured: p.featured,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export function serializePost(p: Post) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    coverImageUrl: p.coverImageUrl,
    author: p.author,
    tags: p.tags ?? [],
    published: p.published,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}
