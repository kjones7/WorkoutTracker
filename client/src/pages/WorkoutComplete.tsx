import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/forms/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { exercises } from "../data/exercises";
import type { Exercise } from "../lib/types";
import { getWorkouts } from "../lib/database";
import { useEffect, useState } from "react";

export function WorkoutComplete() {
  const [, setLocation] = useLocation();
  const [completedWorkout, setCompletedWorkout] = useState<any>(null);

  useEffect(() => {
    const workout = JSON.parse(sessionStorage.getItem("completedWorkout") || "{}");
    setCompletedWorkout(workout);
  }, []);

  return (
    <div className="min-h-screen p-4 pb-20 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md p-6 space-y-6 mb-4">
        <div className="text-center space-y-4">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="text-2xl font-bold text-gray-900">Workout Complete!</h1>
          <p className="text-gray-600">
            Great job! You've successfully completed your workout.
          </p>
        </div>

        <Button 
          className="w-full"
          onClick={() => {
            sessionStorage.removeItem("activeWorkout");
            setLocation("/");
          }}
        >
          Return to Workout Page
        </Button>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Workout Summary</h2>
          <div className="space-y-2 text-sm text-gray-600">
            {completedWorkout?.exercises?.map((exercise: any, index: number) => {
              const completedSets = exercise.sets.filter((set: any) => set.completed).length;
              const exerciseDetails = exercises.find((e: Exercise) => e.id === exercise.exerciseId);
              return (
                <div key={index} className="flex justify-between items-center">
                  <span>{exerciseDetails?.name}</span>
                  <span>{completedSets} sets completed</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
