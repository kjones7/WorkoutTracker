import type { Express } from "express";

import { db } from "@db/index";
import { workouts, workoutExercises, exerciseSets } from "@db/schema";
import type { Express } from "express";

export function registerRoutes(app: Express) {
  app.post("/api/workouts", async (req, res) => {
    try {
      const { name, exercises } = req.body;
      
      // Create the workout
      const [workout] = await db
        .insert(workouts)
        .values({ name })
        .returning();

      // Create workout exercises and their sets
      for (const [exerciseIndex, exercise] of exercises.entries()) {
        const [workoutExercise] = await db
          .insert(workoutExercises)
          .values({
            workoutId: workout.id,
            exerciseId: exercise.exerciseId,
            order: exerciseIndex,
          })
          .returning();

        // Insert all sets for this exercise
        await db.insert(exerciseSets).values(
          exercise.sets.map((set: any, setIndex: number) => ({
            workoutExerciseId: workoutExercise.id,
            weight: set.weight || null,
            reps: set.reps || null,
            duration: set.time || null,
            completed: set.completed,
            order: setIndex,
          }))
        );
      }

      res.json({ message: "Workout saved successfully" });
    } catch (error) {
      console.error("Error saving workout:", error);
      res.status(500).json({ message: "Failed to save workout" });
    }
  });
}
