import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, MoreVertical, RotateCcw } from "lucide-react";
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

  const handleFinish = async () => {
    if (!workout || !activeExercises.length) {
      console.error('No workout data available');
      return;
    }

    try {
      const workoutData = {
        name: workout.name,
        exercises: activeExercises,
        completedAt: new Date().toISOString(),
      };

      // Validate workout data before saving
      const isValid = activeExercises.every(exercise => 
        exercise.exerciseId && Array.isArray(exercise.sets) && 
        exercise.sets.every(set => 
          typeof set.completed === 'boolean' &&
          (set.weight === undefined || typeof set.weight === 'number') &&
          (set.reps === undefined || typeof set.reps === 'number') &&
          (set.time === undefined || typeof set.time === 'string')
        )
      );

      if (!isValid) {
        throw new Error('Invalid workout data structure');
      }

      // Save to Replit Database
      const { saveWorkout } = await import('../lib/database');
      const key = await saveWorkout(workoutData);

      if (!key) {
        throw new Error('Failed to get workout key from database');
      }

      // Store for completion page
      sessionStorage.setItem("completedWorkout", JSON.stringify(workoutData));
      sessionStorage.removeItem("activeWorkout");
      
      setLocation("/workout-complete");
    } catch (error) {
      console.error('Error saving workout:', error);
      // TODO: Add a proper error notification system
      alert('Failed to save workout. Please try again.');
    }
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
      <div className="bg-white">
        <div className="flex justify-between items-center p-4">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <RotateCcw className="h-5 w-5 text-gray-500" />
          </Button>
          <Button onClick={handleFinish} variant="default" className="bg-green-500 hover:bg-green-600">
            Finish
          </Button>
        </div>
        <div className="px-4 pb-4">
          <h1 className="text-xl font-bold">{workout.name}</h1>
          <div className="flex items-center mt-1">
            <p className="text-base text-gray-900">
              {new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
            </p>
            <div className="h-1 w-1 bg-gray-300 rounded-full mx-2" />
            <button className="text-base text-gray-500">Notes</button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {activeExercises.map((activeExercise, exerciseIndex) => {
          const exercise = exercises.find(e => e.id === activeExercise.exerciseId);
          return (
            <div key={exerciseIndex} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-blue-600">{exercise?.name}</h2>
                <button className="p-2">
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="rounded-lg bg-gray-50 overflow-hidden">
                <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-2 px-4 py-2 bg-gray-100">
                  <div className="text-sm font-medium text-gray-500">Set</div>
                  <div className="text-sm font-medium text-gray-500">Previous</div>
                  {activeExercise.sets[0]?.weight !== undefined ? (
                    <>
                      <div className="text-sm font-medium text-gray-500">lbs</div>
                      <div className="text-sm font-medium text-gray-500">Reps</div>
                    </>
                  ) : (
                    <div className="text-sm font-medium text-gray-500 col-span-2">Time</div>
                  )}
                  <div></div>
                </div>
                {activeExercise.sets.map((set, setIndex) => (
                  <div key={setIndex} 
                    className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-2 px-4 py-2 items-center border-t border-gray-200">
                    <div className="text-sm font-medium w-8">{setIndex + 1}</div>
                    <div className="text-sm text-gray-600">
                      {set.weight !== undefined 
                        ? `${set.weight} lb × ${set.reps}`
                        : set.time}
                    </div>
                    {set.weight !== undefined ? (
                      <>
                        <input
                          type="number"
                          className="w-full p-2 rounded bg-white border border-gray-200 text-sm"
                          placeholder="lbs"
                          defaultValue={set.weight}
                          onChange={(e) => handleSetComplete(exerciseIndex, setIndex, { weight: Number(e.target.value) })}
                        />
                        <input
                          type="number"
                          className="w-full p-2 rounded bg-white border border-gray-200 text-sm"
                          placeholder="reps"
                          defaultValue={set.reps}
                          onChange={(e) => handleSetComplete(exerciseIndex, setIndex, { reps: Number(e.target.value) })}
                        />
                      </>
                    ) : (
                      <input
                        type="text"
                        className="w-full p-2 rounded bg-white border border-gray-200 text-sm col-span-2"
                        placeholder="0:00"
                        defaultValue={set.time}
                        onChange={(e) => handleSetComplete(exerciseIndex, setIndex, { time: e.target.value })}
                      />
                    )}
                    <Button
                      variant={set.completed ? "default" : "ghost"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => handleSetComplete(exerciseIndex, setIndex, { completed: true })}
                    >
                      <Check className={`h-4 w-4 ${set.completed ? 'text-white' : 'text-gray-400'}`} />
                    </Button>
                  </div>
                ))}
                <button 
                  className="w-full py-2 text-sm text-blue-600 hover:bg-gray-100 transition-colors border-t border-gray-200"
                  onClick={() => {/* TODO: Implement add set */}}
                >
                  + Add Set
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
