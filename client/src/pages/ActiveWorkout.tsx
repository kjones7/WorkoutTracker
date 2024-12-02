import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { WorkoutTemplate } from "../lib/types";
import { exercises } from "../data/exercises";

interface WorkoutSet {
  weight?: number;
  reps?: number;
  time?: string;
  completed: boolean;
}

interface ActiveExercise {
  exerciseId: string;
  sets: WorkoutSet[];
}

export function ActiveWorkout() {
  const [, setLocation] = useLocation();
  const [workout] = useState<WorkoutTemplate>(() => {
    const stored = sessionStorage.getItem("activeWorkout");
    return stored ? JSON.parse(stored) : null;
  });
  
  const [activeExercises, setActiveExercises] = useState<ActiveExercise[]>(() => 
    workout?.exercises.map(e => ({
      exerciseId: e.exerciseId,
      sets: Array(e.sets).fill({
        weight: e.weight,
        reps: e.reps,
        time: e.duration,
        completed: false
      })
    })) ?? []
  );

  const handleSetComplete = (exerciseIndex: number, setIndex: number, value: Partial<WorkoutSet>) => {
    setActiveExercises(prev => {
      const updated = [...prev];
      updated[exerciseIndex] = {
        ...updated[exerciseIndex],
        sets: updated[exerciseIndex].sets.map((set, idx) =>
          idx === setIndex ? { ...set, ...value, completed: true } : set
        )
      };
      return updated;
    });
  };

  const handleFinish = () => {
    // TODO: Save workout history
    sessionStorage.removeItem("activeWorkout");
    setLocation("/workout");
  };

  if (!workout) {
    return (
      <div className="p-4">
        <p>No active workout found</p>
        <Button onClick={() => setLocation("/workout")}>Return to Workouts</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="sticky top-0 bg-white z-10 p-4 flex justify-between items-center border-b">
        <div>
          <h1 className="text-xl font-bold">{workout.name}</h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
          </p>
        </div>
        <Button onClick={handleFinish} variant="default">
          Finish
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {activeExercises.map((activeExercise, exerciseIndex) => {
          const exercise = exercises.find(e => e.id === activeExercise.exerciseId);
          return (
            <div key={exerciseIndex} className="space-y-3">
              <h2 className="text-lg font-semibold">{exercise?.name}</h2>
              <div className="space-y-2">
                {activeExercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium">Set {setIndex + 1}</div>
                    {set.weight !== undefined && (
                      <input
                        type="number"
                        className="w-20 p-2 border rounded"
                        placeholder="lbs"
                        defaultValue={set.weight}
                        onChange={(e) => handleSetComplete(exerciseIndex, setIndex, { weight: Number(e.target.value) })}
                      />
                    )}
                    {set.reps !== undefined && (
                      <input
                        type="number"
                        className="w-20 p-2 border rounded"
                        placeholder="Reps"
                        defaultValue={set.reps}
                        onChange={(e) => handleSetComplete(exerciseIndex, setIndex, { reps: Number(e.target.value) })}
                      />
                    )}
                    {set.time !== undefined && (
                      <input
                        type="text"
                        className="w-20 p-2 border rounded"
                        placeholder="Time"
                        defaultValue={set.time}
                        onChange={(e) => handleSetComplete(exerciseIndex, setIndex, { time: e.target.value })}
                      />
                    )}
                    <Button
                      variant={set.completed ? "default" : "outline"}
                      className="w-20"
                      onClick={() => handleSetComplete(exerciseIndex, setIndex, { completed: true })}
                    >
                      {set.completed ? "Done" : "Do Set"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
