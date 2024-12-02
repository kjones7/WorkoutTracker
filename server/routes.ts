import type { Express } from "express";
import Database from "@replit/database";
import { v4 as uuid } from "uuid";

const db = new Database();

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

export function registerRoutes(app: Express) {
  app.post("/api/workouts", async (req, res) => {
    try {
      const workoutId = uuid();
      const workoutData: WorkoutData = {
        ...req.body,
        id: workoutId,
      };
      const key = `workout:${workoutId}`;

      await db.set(key, workoutData);
      res.json({ message: "Workout saved successfully", key });
    } catch (error) {
      console.error("Error saving workout:", error);
      res.status(500).json({ message: "Failed to save workout" });
    }
  });

  app.get("/api/workouts", async (_req, res) => {
    try {
      // Get all keys with prefix 'workout:'
      const dbResponse = await db.list("workout:");
      console.log("Raw database response:", dbResponse);

      if (!dbResponse?.ok || !Array.isArray(dbResponse.value)) {
        console.log("No valid database list found");
        return res.json([]);
      }

      const dbList = dbResponse.value;
      console.log("Processing database keys:", dbList);

      const workouts = await Promise.all(
        dbList.map(async (key) => {
          try {
            const workout = await db.get(key);
            console.log(`Fetched workout for key ${key}:`, workout);

            // If we get a 404 or null, this workout was deleted
            if (!workout || workout?.error?.statusCode === 404) {
              return null;
            }

            // Keep the numeric timestamp format
            const timestamp = key.replace("workout:", "");
            return {
              ...workout,
              completedAt: timestamp,
            };
          } catch (err) {
            console.warn(`Error processing workout ${key}:`, err);
            return null;
          }
        }),
      );

      const validWorkouts = workouts
        .filter((w): w is NonNullable<typeof w> => w !== null)
        .map((w) => w.value) // Extract the workout data from the response
        .sort(
          (a, b) =>
            new Date(b.completedAt).getTime() -
            new Date(a.completedAt).getTime(),
        );

      console.log("Final processed workouts:", validWorkouts);
      res.json(validWorkouts);
    } catch (error) {
      console.error("Error retrieving workouts:", error);
      res.status(500).json({ message: "Failed to retrieve workouts" });
    }
  });
  app.delete("/api/workouts/:key", async (req, res) => {
    try {
      const keyParam = req.params.key;
      console.log("Received delete request for key:", keyParam);

      // Ensure consistent key format
      const key = keyParam.startsWith("workout:")
        ? keyParam
        : `workout:${keyParam}`;
      console.log("Attempting deletion for key:", key);

      // Get current workout data to verify it exists
      const workoutData = await db.get(key);
      if (!workoutData || workoutData?.error?.statusCode === 404) {
        console.log("Workout not found:", key);
        return res.status(404).json({ message: "Workout not found" });
      }

      // Perform deletion
      await db.delete(key);
      console.log("Successfully deleted workout:", key);
      res.json({ message: "Workout deleted successfully" });
    } catch (error) {
      console.error("Error deleting workout:", error);
      res.status(500).json({ message: "Failed to delete workout" });
    }
  });
}
