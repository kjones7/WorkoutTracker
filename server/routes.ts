import type { Express } from "express";
import Database from "@replit/database";

const db = new Database();

interface WorkoutData {
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
      const workoutData: WorkoutData = req.body;
      const timestamp = new Date().getTime();
      const key = `workout:${timestamp}`;
      
      await db.set(key, workoutData);
      res.json({ message: "Workout saved successfully", key });
    } catch (error) {
      console.error("Error saving workout:", error);
      res.status(500).json({ message: "Failed to save workout" });
    }
  });

  app.get("/api/workouts", async (_req, res) => {
    try {
      const keys = await db.list("workout:");
      if (!Array.isArray(keys)) {
        throw new Error("Failed to retrieve workout keys");
      }

      const workouts = await Promise.all(
        keys.map(async (key) => {
          const workout = await db.get(key);
          return workout as WorkoutData;
        })
      );

      const sortedWorkouts = workouts.sort((a, b) => 
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );

      res.json(sortedWorkouts);
    } catch (error) {
      console.error("Error retrieving workouts:", error);
      res.status(500).json({ message: "Failed to retrieve workouts" });
    }
  });
}
