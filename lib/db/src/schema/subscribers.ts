import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const subscribersTable = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
  source: text("source"),
  active: boolean("active").notNull().default(true),
});

export const insertSubscriberSchema = createInsertSchema(subscribersTable).omit({ id: true, subscribedAt: true });
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribersTable.$inferSelect;
