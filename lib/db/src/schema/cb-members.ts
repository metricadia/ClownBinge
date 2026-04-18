/**
 * Self-hosted CB member auth table.
 * Replaces Clerk-based member management.
 */
import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const cbMembersTable = pgTable("cb_members", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash"),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  emailVerified: boolean("email_verified").notNull().default(false),
  emailVerifyToken: text("email_verify_token"),
  verifyTokenExpiresAt: timestamp("verify_token_expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at").notNull().defaultNow(),
});

export const insertCbMemberSchema = createInsertSchema(cbMembersTable).omit({ id: true, createdAt: true });
export type InsertCbMember = z.infer<typeof insertCbMemberSchema>;
export type CbMember = typeof cbMembersTable.$inferSelect;
