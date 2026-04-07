import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const subscriberTokensTable = pgTable("subscriber_tokens", {
  token: text("token").primaryKey(),
  label: text("label").notNull(),
  email: text("email"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const insertSubscriberTokenSchema = createInsertSchema(subscriberTokensTable).omit({ createdAt: true });
export type InsertSubscriberToken = z.infer<typeof insertSubscriberTokenSchema>;
export type SubscriberToken = typeof subscriberTokensTable.$inferSelect;
