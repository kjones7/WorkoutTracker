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
      const workoutId = uuid();
      const workoutData: WorkoutData = {
        ...req.body,
        id: workoutId,
      };

      await db.insert(workouts).values({
        id: workoutId,
        name: workoutData.name,
        exercises: JSON.stringify(workoutData.exercises),
        completedAt: workoutData.completedAt,
      });

      res.json({ message: "Workout saved successfully", id: workoutId });
    } catch (error) {
      console.error("Error saving workout:", error);
      res.status(500).json({ message: "Failed to save workout" });
    }
  });

  app.get("/api/workouts", async (_req, res) => {
    try {
      const dbWorkouts = await db.select().from(workouts);

      const processedWorkouts = dbWorkouts.map(workout => ({
        ...workout,
        exercises: JSON.parse(workout.exercises),
      })).sort((a, b) => 
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );

      res.json(processedWorkouts);
    } catch (error) {
      console.error("Error retrieving workouts:", error);
      res.status(500).json({ message: "Failed to retrieve workouts" });
    }
  });

  app.delete("/api/workouts/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const result = await db.delete(workouts)
        .where(eq(workouts.id, id));

      if (!result) {
        return res.status(404).json({ message: "Workout not found" });
      }

      res.json({ message: "Workout deleted successfully" });
    } catch (error) {
      console.error("Error deleting workout:", error);
      res.status(500).json({ message: "Failed to delete workout" });
    }
  });
}