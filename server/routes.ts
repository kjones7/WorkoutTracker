import type { Express } from "express";
import { v4 as uuid } from "uuid";
import { workouts, getDb } from "@db/index";
import { eq } from "drizzle-orm";
import type { Workout } from "@db/schema";
import { validateWorkout } from "./middleware/validate";

interface WorkoutData {
  id: string;
  name: string;
  exercises: Array<{
    exerciseId: string;
    sets: Array<{
      weight?: number;
      reps?: number;
      time?: string;
      completed: boolean;
    }>;
  }>;
  completedAt: string;
}

export async function registerRoutes(app: Express) {
  app.post("/api/workouts", validateWorkout, async (req, res) => {
    try {
      console.log("Received validated workout data:", req.body);

      const workoutId = uuid();
      const workoutData: WorkoutData = {
        ...req.body,
        id: workoutId,
      };

      // Ensure exercises is properly stringified
      const exercisesJson = JSON.stringify(workoutData.exercises);
      console.log("Stringified exercises:", exercisesJson);

      const db = getDb();
      await db.insert(workouts).values({
        id: workoutId,
        name: workoutData.name,
        exercises: exercisesJson,
        completedAt: workoutData.completedAt || new Date().toISOString(),
      });

      console.log("Successfully saved workout:", workoutId);
      res.json({ message: "Workout saved successfully", id: workoutId });
    } catch (error) {
      console.error("Error saving workout:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message, error.stack);
      }
      res.status(500).json({ 
        message: "Failed to save workout",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/workouts", async (_req, res) => {
    try {
      console.log("Fetching all workouts");
      const db = getDb();
      const dbWorkouts = await db.select().from(workouts);
      console.log("Raw workouts from database:", dbWorkouts);

      const processedWorkouts = dbWorkouts.map((workout: Workout) => {
        try {
          return {
            ...workout,
            exercises: JSON.parse(workout.exercises),
          };
        } catch (error) {
          console.error(`Error parsing exercises for workout ${workout.id}:`, error);
          return workout;
        }
      }).sort((a: Workout, b: Workout) => 
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );

      console.log("Processed workouts:", processedWorkouts);
      res.json(processedWorkouts);
    } catch (error) {
      console.error("Error retrieving workouts:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message, error.stack);
      }
      res.status(500).json({ 
        message: "Failed to retrieve workouts",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.delete("/api/workouts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log("Attempting to delete workout:", id);

      const db = getDb();
      const result = await db.delete(workouts)
        .where(eq(workouts.id, id));

      if (!result) {
        console.log("No workout found with id:", id);
        return res.status(404).json({ message: "Workout not found" });
      }

      console.log("Successfully deleted workout:", id);
      res.json({ message: "Workout deleted successfully" });
    } catch (error) {
      console.error("Error deleting workout:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message, error.stack);
      }
      res.status(500).json({ 
        message: "Failed to delete workout",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}