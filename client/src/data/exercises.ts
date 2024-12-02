import { Exercise } from '../lib/types';

export const exercises: Exercise[] = [
  {
    id: '1',
    name: 'Bicep Curl',
    bodyPart: 'Arms',
    category: 'Barbell',
    weight: 45,
    reps: 10,
    illustration: '/icons/bicep-curl.svg'
  },
  {
    id: '2',
    name: 'Hanging Leg Raise',
    bodyPart: 'Core',
    category: 'Bodyweight',
    reps: 8,
    illustration: '/icons/leg-raise.svg'
  },
  {
    id: '3',
    name: 'Triceps Extension',
    bodyPart: 'Arms',
    category: 'Dumbbell',
    weight: 12.5,
    reps: 10,
    illustration: '/icons/tricep-extension.svg'
  },
  {
    id: '4',
    name: 'Stiff Leg Deadlift',
    bodyPart: 'Back',
    category: 'Barbell',
    weight: 45,
    reps: 10,
    illustration: '/icons/deadlift.svg'
  },
  {
    id: '5',
    name: 'Deadlift',
    bodyPart: 'Back',
    category: 'Barbell',
    weight: 145,
    reps: 5,
    illustration: '/icons/deadlift.svg'
  },
  {
    id: '6',
    name: 'Front Squat',
    bodyPart: 'Legs',
    category: 'Barbell',
    weight: 75,
    reps: 4,
    illustration: '/icons/squat.svg'
  },
  {
    id: '7',
    name: 'Ab Wheel',
    bodyPart: 'Core',
    category: 'Bodyweight',
    reps: 7,
    illustration: '/icons/ab-wheel.svg'
  },
  {
    id: '8',
    name: 'Plank',
    bodyPart: 'Core',
    category: 'Bodyweight',
    duration: '0:30',
    illustration: '/icons/plank.svg'
  }
];
