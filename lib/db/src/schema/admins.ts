import {
  pgTable,
  text,
  serial,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const adminUsersTable = pgTable(
  "admin_users",
  {
    id: serial("id").primaryKey(),
    username: text("username").notNull(),
    passwordHash: text("password_hash").notNull(),
    displayName: text("display_name").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    usernameIdx: uniqueIndex("admin_users_username_idx").on(table.username),
  }),
);

export const adminSessionsTable = pgTable("admin_sessions", {
  token: text("token").primaryKey(),
  adminId: serial("admin_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsersTable).omit({
  id: true,
  createdAt: true,
});
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsersTable.$inferSelect;
export type AdminSession = typeof adminSessionsTable.$inferSelect;
