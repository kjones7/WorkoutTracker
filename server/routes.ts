import type { Express } from "express";
import { v4 as uuid } from "uuid";
import { db, workouts, initializeDatabase } from "@db/index";
import { eq } from "drizzle-orm";

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
  // Initialize database
  await initializeDatabase();

  app.post("/api/workouts", async (req, res) => {
    try {
      console.log("Received workout data:", req.body);

      const workoutId = uuid();
      const workoutData: WorkoutData = {
        ...req.body,
        id: workoutId,
      };

      // Validate required fields
      if (!workoutData.name || !Array.isArray(workoutData.exercises)) {
        console.error("Invalid workout data:", workoutData);
        return res.status(400).json({ 
          message: "Invalid workout data. Name and exercises are required." 
        });
      }

      // Ensure exercises is properly stringified
      const exercisesJson = JSON.stringify(workoutData.exercises);
      console.log("Stringified exercises:", exercisesJson);

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
      const dbWorkouts = await db.select().from(workouts);
      console.log("Raw workouts from database:", dbWorkouts);

      const processedWorkouts = dbWorkouts.map(workout => {
        try {
          return {
            ...workout,
            exercises: JSON.parse(workout.exercises),
          };
        } catch (error) {
          console.error(`Error parsing exercises for workout ${workout.id}:`, error);
          return workout;
        }
      }).sort((a, b) => 
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