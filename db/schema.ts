import { pgTable, text, integer, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const workouts = pgTable("workouts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});

export const workoutExercises = pgTable("workout_exercises", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  workoutId: integer("workout_id").references(() => workouts.id).notNull(),
  exerciseId: text("exercise_id").notNull(),
  order: integer("order").notNull(),
});

export const exerciseSets = pgTable("exercise_sets", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  workoutExerciseId: integer("workout_exercise_id").references(() => workoutExercises.id).notNull(),
  weight: decimal("weight", { precision: 6, scale: 2 }),
  reps: integer("reps"),
  duration: text("duration"),
  completed: boolean("completed").notNull().default(false),
  order: integer("order").notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertWorkoutSchema = createInsertSchema(workouts);
export const selectWorkoutSchema = createSelectSchema(workouts);
export const insertWorkoutExerciseSchema = createInsertSchema(workoutExercises);
export const selectWorkoutExerciseSchema = createSelectSchema(workoutExercises);
export const insertExerciseSetSchema = createInsertSchema(exerciseSets);
export const selectExerciseSetSchema = createSelectSchema(exerciseSets);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type Workout = z.infer<typeof selectWorkoutSchema>;
export type InsertWorkoutExercise = z.infer<typeof insertWorkoutExerciseSchema>;
export type WorkoutExercise = z.infer<typeof selectWorkoutExerciseSchema>;
export type InsertExerciseSet = z.infer<typeof insertExerciseSetSchema>;
export type ExerciseSet = z.infer<typeof selectExerciseSetSchema>;
