import Database from "@replit/database";

const db = new Database();

export interface WorkoutData {
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

export const saveWorkout = async (workoutData: WorkoutData) => {
  const timestamp = new Date().getTime();
  const key = `workout:${timestamp}`;
  await db.set(key, workoutData);
  return key;
};

export const getWorkouts = async (): Promise<WorkoutData[]> => {
  const keys = await db.list("workout:");
  const workouts = await Promise.all(
    keys.map(async (key) => {
      const workout = await db.get(key);
      return workout as WorkoutData;
    })
  );
  return workouts.sort((a: WorkoutData, b: WorkoutData) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
};
