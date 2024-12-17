import { Exercise } from '../lib/types';

/**
 * The exercises available in the app.
 */
export const exercises: Exercise[] = [
  {
    id: '1',
    name: 'Seated Overhead Press',
    bodyPart: 'Shoulders',
    category: 'Barbell',
    weight: 95,
    reps: 8,
    illustration: '/icons/shoulder-press.svg'
  },
  {
    id: '2',
    name: 'Bicep Curl',
    bodyPart: 'Arms',
    category: 'Barbell',
    weight: 45,
    reps: 10,
    illustration: '/icons/bicep-curl.svg'
  },
  {
    id: '3',
    name: 'Plank',
    bodyPart: 'Core',
    category: 'Duration',
    duration: '1:00',
    illustration: '/icons/plank.svg'
  },
  {
    id: '4',
    name: 'Front Squat',
    bodyPart: 'Legs',
    category: 'Barbell',
    weight: 135,
    reps: 6,
    illustration: '/icons/squat.svg'
  },
  {
    id: '5',
    name: 'Lunge',
    bodyPart: 'Legs',
    category: 'Dumbbell',
    weight: 20,
    reps: 12,
    illustration: '/icons/lunge.svg'
  },
  {
    id: '6',
    name: 'Shrug',
    bodyPart: 'Shoulders',
    category: 'Barbell',
    weight: 135,
    reps: 12,
    illustration: '/icons/shrug.svg'
  },
  {
    id: '7',
    name: 'Ab Wheel',
    bodyPart: 'Core',
    category: 'Duration',
    duration: '0:45',
    illustration: '/icons/ab-wheel.svg'
  },
  {
    id: '8',
    name: 'Bench Press',
    bodyPart: 'Chest',
    category: 'Barbell',
    weight: 135,
    reps: 8,
    illustration: '/icons/bench-press.svg'
  },
  {
    id: '9',
    name: 'Bent Over One Arm Row',
    bodyPart: 'Back',
    category: 'Dumbbell',
    weight: 40,
    reps: 10,
    illustration: '/icons/row.svg'
  },
  {
    id: '10',
    name: 'Decline Crunch',
    bodyPart: 'Core',
    category: 'Weighted Bodyweight',
    weight: 10,
    reps: 15,
    illustration: '/icons/crunch.svg'
  },
  {
    id: '11',
    name: 'Deadlift',
    bodyPart: 'Back',
    category: 'Barbell',
    weight: 185,
    reps: 5,
    illustration: '/icons/deadlift.svg'
  },
  {
    id: '12',
    name: 'Triceps Extension',
    bodyPart: 'Arms',
    category: 'Dumbbell',
    weight: 15,
    reps: 12,
    illustration: '/icons/tricep-extension.svg'
  },
  {
    id: '13',
    name: 'Hanging Leg Raise',
    bodyPart: 'Core',
    category: 'Weighted Bodyweight',
    weight: 5,
    reps: 10,
    illustration: '/icons/leg-raise.svg'
  },
  {
    id: '14',
    name: 'Stiff Leg Deadlift',
    bodyPart: 'Back',
    category: 'Barbell',
    weight: 135,
    reps: 8,
    illustration: '/icons/stiff-leg-deadlift.svg'
  }
];
