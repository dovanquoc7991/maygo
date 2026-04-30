import {
  pgTable,
  text,
  serial,
  timestamp,
  boolean,
  integer,
  numeric,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export type SpecItem = { label: string; value: string };

export const productsTable = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    shortDescription: text("short_description").notNull().default(""),
    description: text("description").notNull().default(""),
    price: numeric("price", { precision: 14, scale: 2 }).notNull().default("0"),
    salePrice: numeric("sale_price", { precision: 14, scale: 2 }),
    currency: text("currency").notNull().default("VND"),
    categorySlug: text("category_slug").notNull(),
    categoryName: text("category_name").notNull(),
    brand: text("brand").notNull().default(""),
    sku: text("sku").notNull().default(""),
    powerKw: numeric("power_kw", { precision: 10, scale: 2 }),
    weightKg: numeric("weight_kg", { precision: 10, scale: 2 }),
    dimensions: text("dimensions"),
    warrantyMonths: integer("warranty_months"),
    origin: text("origin"),
    coverImageUrl: text("cover_image_url").notNull().default(""),
    gallery: text("gallery").array().notNull().default([]),
    features: text("features").array().notNull().default([]),
    specs: jsonb("specs").$type<SpecItem[]>().notNull().default([]),
    inStock: boolean("in_stock").notNull().default(true),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    slugIdx: uniqueIndex("products_slug_idx").on(table.slug),
  }),
);

export const insertProductSchema = createInsertSchema(productsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
