import { pgTable, text, uuid, boolean, integer, timestamp, date, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const categoryEnum = pgEnum("category", [
  "self_owned",
  "law_and_justice",
  "money_and_power",
  "us_constitution",
  "women_and_girls",
  "anti_racist_heroes",
  "us_history",
  "religion",
  "investigations",
  "war_and_inhumanity",
  "health_and_healing",
  "technology",
  "censorship",
  "global_south",
  "how_it_works",
  "nerd_out",
  "disarming_hate",
  "native_and_first_nations",
]);

export const statusEnum = pgEnum("status", ["draft", "review", "published"]);

export const postsTable = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  caseNumber: text("case_number").unique().notNull(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  teaser: text("teaser").notNull().default(""),
  body: text("body").notNull(),
  category: categoryEnum("category").notNull(),
  subjectName: text("subject_name"),
  subjectTitle: text("subject_title"),
  subjectParty: text("subject_party"),
  verifiedSource: text("verified_source"),
  sourceUrl: text("source_url"),
  hasVideo: boolean("has_video").notNull().default(false),
  videoUrl: text("video_url"),
  videoThumbnail: text("video_thumbnail"),
  transcript: text("transcript"),
  selfOwnScore: integer("self_own_score"),
  tags: text("tags").array().notNull().default([]),
  schemaMarkup: jsonb("schema_markup"),
  status: statusEnum("status").notNull().default("draft"),
  dateOfIncident: date("date_of_incident"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  viewCount: integer("view_count").notNull().default(0),
  shareCount: integer("share_count").notNull().default(0),
  userSubmitted: boolean("user_submitted").notNull().default(false),
  pinned: boolean("pinned").notNull().default(false),
  staffPick: boolean("staff_pick").notNull().default(false),
  locked: boolean("locked").notNull().default(false),
  aiScore: integer("ai_score"),
  aiScoreTestedAt: timestamp("ai_score_tested_at"),
  idsScore: integer("ids_score"),
  nerdAccessible: boolean("nerd_accessible").notNull().default(true),
  seoMetaTitle: text("seo_meta_title"),
});

export const insertPostSchema = createInsertSchema(postsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof postsTable.$inferSelect;
