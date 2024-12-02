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

export const saveWorkout = async (workoutData: WorkoutData): Promise<string> => {
  const response = await fetch('/api/workouts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workoutData),
  });

  if (!response.ok) {
    throw new Error('Failed to save workout');
  }

  const result = await response.json();
  return result.key;
};

export const getWorkouts = async (): Promise<WorkoutData[]> => {
  const response = await fetch('/api/workouts');
  
  if (!response.ok) {
    throw new Error('Failed to retrieve workouts');
  }

  return response.json();
};
export const deleteWorkout = async (key: string): Promise<void> => {
  const response = await fetch(`/api/workouts/${key}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete workout');
  }
};
