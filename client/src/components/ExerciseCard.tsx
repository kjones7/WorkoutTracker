import { Card } from "@/components/ui/card";
import { Exercise } from "../lib/types";

interface ExerciseCardProps {
  exercise: Exercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <Card className="p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors">
      <div className="w-12 h-12 flex-shrink-0">
        <img
          src={exercise.illustration}
          alt={exercise.name}
          className="w-full h-full object-contain"
        />
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold text-base">{exercise.name}</h3>
        <p className="text-sm text-gray-500">{exercise.bodyPart}</p>
      </div>
      
      <div className="text-right text-sm text-gray-600">
        {exercise.weight && exercise.reps && (
          <span>{exercise.weight} lb (x{exercise.reps})</span>
        )}
        {exercise.reps && !exercise.weight && (
          <span>{exercise.reps} reps</span>
        )}
        {exercise.duration && (
          <span>{exercise.duration}</span>
        )}
      </div>
    </Card>
  );
}
