export type BodyPart = 'Arms' | 'Back' | 'Core' | 'Legs' | 'Shoulders' | 'Chest';
export type Category = 'Barbell' | 'Dumbbell' | 'Bodyweight' | 'Machine' | 'Cable' | 'Duration' | 'Weighted Bodyweight';

export interface Exercise {
  id: string;
  name: string;
  bodyPart: BodyPart;
  category: Category;
  weight?: number;
  reps?: number;
  duration?: string;
  illustration: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Array<{
    exerciseId: string;
    sets: number;
    reps?: number;
    weight?: number;
    duration?: string;
  }>;
  lastModified: Date;
  isExample?: boolean;
}

export interface WorkoutSet {
  weight?: number;
  reps?: number;
  time?: string;
  completed: boolean;
}

export interface ActiveExercise {
  exerciseId: string;
  sets: WorkoutSet[];
}
