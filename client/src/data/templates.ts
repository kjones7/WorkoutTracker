import { WorkoutTemplate } from '../lib/types';
import { exercises } from './exercises';

// Helper function to find exercise by ID
const findExercise = (id: string) => exercises.find(ex => ex.id === id);

export const workoutTemplates: WorkoutTemplate[] = [
  {
    id: '1',
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
      },
      {
        exerciseId: findExercise('3')?.id ?? '', // Plank
        sets: 3,
        duration: '1:00'
      }
    ],
    lastModified: new Date('2024-12-02'),
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
      },
      {
        exerciseId: findExercise('6')?.id ?? '', // Shrug
        sets: 3,
        reps: 12,
        weight: 135
      },
      {
        exerciseId: findExercise('7')?.id ?? '', // Ab Wheel
        sets: 3,
        duration: '0:45'
      }
    ],
    lastModified: new Date('2024-12-02'),
  },
  {
    id: '3',
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
      },
      {
        exerciseId: findExercise('10')?.id ?? '', // Decline Crunch
        sets: 3,
        reps: 15,
        weight: 10
      }
    ],
    lastModified: new Date('2024-12-02'),
  },
  {
    id: '4',
    name: 'Day 4 (Deadlift)',
    exercises: [
      {
        exerciseId: findExercise('11')?.id ?? '', // Deadlift
        sets: 3,
        reps: 5,
        weight: 185
      },
      {
        exerciseId: findExercise('14')?.id ?? '', // Stiff Leg Deadlift
        sets: 3,
        reps: 8,
        weight: 135
      },
      {
        exerciseId: findExercise('12')?.id ?? '', // Triceps Extension
        sets: 3,
        reps: 12,
        weight: 15
      },
      {
        exerciseId: findExercise('13')?.id ?? '', // Hanging Leg Raise
        sets: 3,
        reps: 10,
        weight: 5
      }
    ],
    lastModified: new Date('2024-12-02'),
  }
];
