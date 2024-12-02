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
      // Get all keys with prefix 'workout:'
      const keys = await db.list();
      const workoutKeys = Object.keys(keys).filter(key => key.startsWith('workout:'));
      
      if (!workoutKeys.length) {
        return res.json([]); // Return empty array if no workouts found
      }

      const workouts = await Promise.all(
        workoutKeys.map(async (key) => {
          try {
            const workout = await db.get(key);
            if (!workout || typeof workout !== 'object') {
              console.warn(`Skipping invalid workout data for key: ${key}`);
              return null;
            }
            
            // Validate the workout data structure
            const workoutData = workout as WorkoutData;
            if (!workoutData.name || !Array.isArray(workoutData.exercises) || !workoutData.completedAt) {
              console.warn(`Skipping malformed workout data for key: ${key}`);
              return null;
            }
            
            return workoutData;
          } catch (err) {
            console.warn(`Error processing workout ${key}:`, err);
            return null;
          }
        })
      );

      // Filter out null values and sort by completion date
      const validWorkouts = workouts
        .filter((w): w is WorkoutData => w !== null)
        .sort((a, b) => 
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        );

      res.json(validWorkouts);
    } catch (error) {
      console.error("Error retrieving workouts:", error);
      res.status(500).json({ message: "Failed to retrieve workouts" });
    }
  });
}
