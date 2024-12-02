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
      const dbList = await db.list();
      console.log('Raw database keys:', dbList);

      if (!dbList || !dbList.value) {
        console.log('No database list or value found');
        return res.json([]);
      }
      
      const workoutKeys = dbList.value.filter(key => key.startsWith('workout:'));
      console.log('Filtered workout keys:', workoutKeys);
      
      if (!workoutKeys.length) {
        console.log('No workout keys found');
        return res.json([]); // Return empty array if no workouts found
      }

      const workouts = await Promise.all(
        workoutKeys.map(async (key) => {
          try {
            const workout = await db.get(key);
            console.log('Retrieved workout:', workout);
            
            // Extract the actual workout data from the nested structure
            const workoutData = workout.value || workout;
            console.log(`Retrieved workout data for key ${key}:`, workoutData);
            
            // Type guard function to validate WorkoutData
            const isWorkoutData = (data: any): data is WorkoutData => {
              if (!data) return false;
              
              // If we have a nested structure, use the value property
              const workoutData = data.value || data;
              
              return (
                typeof workoutData === 'object' &&
                typeof workoutData.name === 'string' &&
                Array.isArray(workoutData.exercises) &&
                typeof workoutData.completedAt === 'string' &&
                workoutData.exercises.every((exercise: any) =>
                  typeof exercise === 'object' &&
                  typeof exercise.exerciseId === 'string' &&
                  Array.isArray(exercise.sets) &&
                  exercise.sets.every((set: any) =>
                    typeof set === 'object' &&
                    typeof set.completed === 'boolean' &&
                    (set.weight === undefined || typeof set.weight === 'number') &&
                    (set.reps === undefined || typeof set.reps === 'number') &&
                    (set.time === undefined || typeof set.time === 'string')
                  )
                )
              );
            };

            if (!isWorkoutData(workoutData)) {
              console.warn(`Invalid or malformed workout data for key: ${key}`);
              return null;
            }
            
            return workoutData;
          } catch (err) {
            console.warn(`Error processing workout ${key}:`, err);
            return null;
          }
        })
      );

      // Explicitly type the filtered workouts array
      const validWorkouts = workouts
        .filter((workout): workout is NonNullable<typeof workout> => workout !== null)
        .sort((a, b) => {
          // Add null checks for TypeScript
          if (!a || !b) return 0;
          return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
        });

      console.log('Final processed workouts:', validWorkouts);
      res.json(validWorkouts);
    } catch (error) {
      console.error("Error retrieving workouts:", error);
      res.status(500).json({ message: "Failed to retrieve workouts" });
    }
  });
}
