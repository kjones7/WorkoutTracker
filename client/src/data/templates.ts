import { WorkoutTemplate } from '../lib/types';
import { exercises } from './exercises';

// Helper function to find exercise by ID
const findExercise = (id: string) => exercises.find(ex => ex.id === id);

export const workoutTemplates: WorkoutTemplate[] = [
  {
    id: '1',
    name: 'Day 3 (Bench)',
    exercises: [
      {
        exerciseId: findExercise('8')?.id ?? '', // Bench Press
        sets: 3,
        reps: 8,
        weight: 135
      },
      {
        exerciseId: findExercise('9')?.id ?? '', // Bent Over One Arm Row
        sets: 3,
        reps: 10,
        weight: 40
      }
    ],
    lastModified: new Date('2024-11-25'),
    isExample: false
  },
  {
    id: '2',
    name: 'Day 2 (Squat)',
    exercises: [
      {
        exerciseId: findExercise('4')?.id ?? '', // Front Squat
        sets: 3,
        reps: 6,
        weight: 135
      },
      {
        exerciseId: findExercise('5')?.id ?? '', // Lunge
        sets: 3,
        reps: 12,
        weight: 20
      }
    ],
    lastModified: new Date('2024-11-30'),
    isExample: false
  },
  {
    id: '3',
    name: 'Day 1 (OH Press)',
    exercises: [
      {
        exerciseId: findExercise('1')?.id ?? '', // Seated Overhead Press
        sets: 3,
        reps: 8,
        weight: 95
      },
      {
        exerciseId: findExercise('2')?.id ?? '', // Bicep Curl
        sets: 3,
        reps: 10,
        weight: 45
      }
    ],
    lastModified: new Date('2024-11-29'),
    isExample: false
  }
];

export const exampleTemplates: WorkoutTemplate[] = [
  {
    id: 'e1',
    name: 'Full Body Strength',
    exercises: [
      {
        exerciseId: findExercise('8')?.id ?? '', // Bench Press
        sets: 3,
        reps: 8,
        weight: 135
      },
      {
        exerciseId: findExercise('4')?.id ?? '', // Front Squat
        sets: 3,
        reps: 6,
        weight: 135
      },
      {
        exerciseId: findExercise('11')?.id ?? '', // Deadlift
        sets: 3,
        reps: 5,
        weight: 185
      }
    ],
    lastModified: new Date(),
    isExample: true
  }
];
