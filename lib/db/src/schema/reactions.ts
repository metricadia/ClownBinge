import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { postsTable } from "./posts";

export const reactionTypeEnum = pgEnum("reaction_type", [
  "clowned",
  "side_eye",
  "receipts",
  "dead",
  "self_owned",
  "thats_right",
  "king_queen",
  "finished_them",
  "nailed_it",
]);

export const reactionsTable = pgTable("reactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => postsTable.id, { onDelete: "cascade" }),
  type: reactionTypeEnum("type").notNull(),
  ipHash: text("ip_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReactionSchema = createInsertSchema(reactionsTable).omit({ id: true, createdAt: true });
export type InsertReaction = z.infer<typeof insertReactionSchema>;
export type Reaction = typeof reactionsTable.$inferSelect;
