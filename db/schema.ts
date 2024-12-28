import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const workouts = sqliteTable("workouts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  exercises: text("exercises").notNull(), // Store as JSON string
  completedAt: text("completedAt").notNull(),
});

// Export types for TypeScript
export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = typeof workouts.$inferInsert;
