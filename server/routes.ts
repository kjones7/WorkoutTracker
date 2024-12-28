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

type ProcessedWorkout = {
  id: string;
  name: string;
  exercises: any;
  completedAt: string;
  _parseError?: boolean;
}

export async function registerRoutes(app: Express) {
  app.post("/api/workouts", validateWorkout, async (req, res) => {
    const db = getDb();
    try {
      console.log("[Routes] Starting workout creation transaction");
      const result = await db.transaction(async (tx) => {
        console.log("[Routes] Received validated workout data:", req.body);

        const workoutId = uuid();
        const workoutData: WorkoutData = {
          ...req.body,
          id: workoutId,
        };

        // Ensure exercises is properly stringified
        const exercisesJson = JSON.stringify(workoutData.exercises);
        console.log("[Routes] Stringified exercises:", exercisesJson);

        await tx.insert(workouts).values({
          id: workoutId,
          name: workoutData.name,
          exercises: exercisesJson,
          completedAt: workoutData.completedAt || new Date().toISOString(),
        });

        return workoutId;
      });

      console.log("[Routes] Successfully saved workout:", result);
      res.json({ message: "Workout saved successfully", id: result });
    } catch (error) {
      console.error("[Routes] Error saving workout:", error);
      if (error instanceof Error) {
        console.error("[Routes] Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      res.status(500).json({ 
        message: "Failed to save workout",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/workouts", async (_req, res) => {
    const db = getDb();
    try {
      console.log("[Routes] Fetching all workouts");
      const dbWorkouts = await db.select().from(workouts);
      console.log("[Routes] Raw workouts from database:", dbWorkouts);

      const processedWorkouts: ProcessedWorkout[] = dbWorkouts.map((workout) => {
        try {
          return {
            ...workout,
            exercises: JSON.parse(workout.exercises),
          };
        } catch (error) {
          console.error(`[Routes] Error parsing exercises for workout ${workout.id}:`, error);
          return {
            ...workout,
            exercises: [],
            _parseError: true
          };
        }
      });

      // Sort workouts by completedAt date
      const sortedWorkouts = processedWorkouts.sort((a, b) => 
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );

      console.log("[Routes] Processed workouts:", sortedWorkouts);
      res.json(sortedWorkouts);
    } catch (error) {
      console.error("[Routes] Error retrieving workouts:", error);
      if (error instanceof Error) {
        console.error("[Routes] Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      res.status(500).json({ 
        message: "Failed to retrieve workouts",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.delete("/api/workouts/:id", async (req, res) => {
    const db = getDb();
    try {
      const { id } = req.params;
      console.log("[Routes] Starting workout deletion transaction for:", id);

      await db.transaction(async (tx) => {
        const result = await tx.delete(workouts)
          .where(eq(workouts.id, id));

        if (!result) {
          throw new Error(`No workout found with id: ${id}`);
        }
      });

      console.log("[Routes] Successfully deleted workout:", id);
      res.json({ message: "Workout deleted successfully" });
    } catch (error) {
      console.error("[Routes] Error deleting workout:", error);
      if (error instanceof Error) {
        console.error("[Routes] Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }

      if (error instanceof Error && error.message.includes("No workout found")) {
        return res.status(404).json({ message: "Workout not found" });
      }

      res.status(500).json({ 
        message: "Failed to delete workout",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}