export type BodyPart = 'Arms' | 'Back' | 'Core' | 'Legs' | 'Shoulders' | 'Chest';
export type Category = 'Barbell' | 'Dumbbell' | 'Bodyweight' | 'Machine' | 'Cable';

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
