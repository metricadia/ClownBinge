import { pgTable, text, uuid, integer, timestamp } from "drizzle-orm/pg-core";

export const tipsTable = pgTable("tips", {
  id: uuid("id").primaryKey().defaultRandom(),
  submitterName: text("submitter_name"),
  submitterEmail: text("submitter_email"),
  subjectName: text("subject_name").notNull(),
  subjectTitle: text("subject_title"),
  category: text("category"),
  incidentDescription: text("incident_description").notNull(),
  sourceUrl: text("source_url"),
  claudeScore: integer("claude_score"),
  claudeAssessment: text("claude_assessment"),
  claudeRecommendation: text("claude_recommendation"),
  status: text("status").notNull().default("pending_review"),
  ipHash: text("ip_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
