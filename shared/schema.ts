import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("employee"),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  status: text("status").notNull().default("pending"),
  effort: integer("effort").notNull(), // in minutes
  date: timestamp("date").notNull().defaultNow(),
  isPlanned: boolean("is_planned").notNull().default(false),
});

export const categories = [
  "Planned",
  "Unplanned",
  "Extra Effort",
  "Defect Fix",
  "Doubt Resolution",
  "Meeting",
  "Miscellaneous",
] as const;

export const taskStatuses = ["pending", "in_progress", "completed"] as const;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTaskSchema = createInsertSchema(tasks)
  .omit({ id: true, userId: true })
  .extend({
    category: z.enum(categories),
    status: z.enum(taskStatuses),
    title: z.string().min(1, "Title is required"),
    effort: z.number().min(1, "Effort must be at least 1 minute"),
    description: z.string().optional(),
    date: z.coerce.date(),
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;