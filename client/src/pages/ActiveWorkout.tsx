
import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Check, MoreVertical, Timer, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exercises } from "@/data/exercises";
import type { WorkoutTemplate, ActiveExercise, WorkoutSet } from "@/lib/types";
import { useRestTimer } from "@/hooks/use-rest-timer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlateCalculator } from "@/components/features/workouts/PlateCalculator";

interface WorkoutHeaderProps {
  workoutName: string;
  onFinish: () => void;
  timeLeft: number | null;
  isTimerActive: boolean;
  onSkipTimer: () => void;
}

interface SetRowProps {
  set: WorkoutSet;
  setIndex: number;
  exerciseType: string;
  onDelete: () => void;
  onChange: (value: Partial<WorkoutSet>) => void;
  onComplete: (completed: boolean) => void;
}

interface ExerciseCardProps {
  exercise: ActiveExercise;
  exerciseIndex: number;
  onExerciseUpdate: (value: ActiveExercise) => void;
  startTimer: () => void;
}

const SetRow: React.FC<SetRowProps> = ({
  set,
  setIndex,
  exerciseType,
  onDelete,
  onChange,
  onComplete,
}) => (
  <div
    className={`grid grid-cols-[auto_1fr_1fr_auto_auto] gap-2 px-4 py-2 items-center border-t border-gray-200 transition-all duration-300 ease-in-out ${
      set.completed ? "bg-green-50" : ""
    }`}
  >
    <div className="text-sm font-medium w-8">{setIndex + 1}</div>
    {exerciseType === "Duration" ? (
      <input
        type="text"
        className="w-full p-2 rounded bg-white border border-gray-200 text-sm col-span-2"
        placeholder="0:00"
        value={set.time || ""}
        onChange={(e) => onChange({ time: e.target.value })}
      />
    ) : (
      <>
        <input
          type="number"
          step="2.5"
          min="0"
          className="w-full p-2 rounded bg-white border border-gray-200 text-sm"
          placeholder="lbs"
          value={set.weight || ""}
          onChange={(e) => onChange({ weight: Number(e.target.value) })}
        />
        <input
          type="number"
          min="0"
          className="w-full p-2 rounded bg-white border border-gray-200 text-sm"
          placeholder="reps"
          value={set.reps || ""}
          onChange={(e) => onChange({ reps: Number(e.target.value) })}
        />
      </>
    )}
    <Button
      variant={set.completed ? "default" : "ghost"}
      size="sm"
      className={`w-8 h-8 p-0 transition-all duration-300 ease-in-out transform ${
        set.completed
          ? "bg-green-500 hover:bg-green-600 scale-110"
          : "hover:bg-green-50 scale-100"
      }`}
      onClick={() => onComplete(!set.completed)}
    >
      <Check
        className={`h-4 w-4 transition-all duration-300 ease-in-out ${
          set.completed ? "text-white scale-100" : "text-gray-400 scale-90 opacity-70"
        }`}
      />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      className="w-8 h-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
      onClick={onDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

const AddSetButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    className="w-full py-2 text-sm text-blue-600 hover:bg-gray-100 transition-colors border-t border-gray-200"
    onClick={onClick}
  >
    + Add Set
  </button>
);

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  exerciseIndex,
  onExerciseUpdate,
  startTimer,
}) => {
  const exerciseDetails = exercises.find((e) => e.id === exercise.exerciseId);

  const handleSetDataUpdate = (setIndex: number, value: Partial<WorkoutSet>) => {
    const updatedSets = exercise.sets.map((set: WorkoutSet, idx: number) =>
      idx === setIndex ? { ...set, ...value } : set
    );
    onExerciseUpdate({ ...exercise, sets: updatedSets });
  };

  const handleSetDelete = (setIndex: number) => {
    const updatedSets = exercise.sets.filter(
      (_: WorkoutSet, idx: number) => idx !== setIndex
    );
    onExerciseUpdate({ ...exercise, sets: updatedSets });
  };

  const handleAddSet = () => {
    if (!exerciseDetails) return;

    const newSet: WorkoutSet =
      exerciseDetails.category === "Duration"
        ? { time: "", completed: false }
        : { weight: 0, reps: 0, completed: false };

    onExerciseUpdate({
      ...exercise,
      sets: [...exercise.sets, newSet],
    });
  };

  if (!exerciseDetails) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-blue-600">
          {exerciseDetails.name}
        </h2>
        <button className="p-2">
          <MoreVertical className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      <div className="rounded-lg bg-gray-50 overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-2 px-4 py-2 bg-gray-100">
          <div className="text-sm font-medium text-gray-500">Set</div>
          {exerciseDetails.category === "Duration" ? (
            <div className="text-sm font-medium text-gray-500 col-span-2">
              Time
            </div>
          ) : (
            <>
              <div className="text-sm font-medium text-gray-500">lbs</div>
              <div className="text-sm font-medium text-gray-500">Reps</div>
            </>
          )}
          <div></div>
          <div></div>
        </div>
        {exercise.sets.map((set: WorkoutSet, setIndex: number) => (
          <SetRow
            key={`${exercise.exerciseId}-${setIndex}`}
            set={set}
            setIndex={setIndex}
            exerciseType={exerciseDetails.category}
            onDelete={() => handleSetDelete(setIndex)}
            onChange={(value) => handleSetDataUpdate(setIndex, value)}
            onComplete={(completed) => {
              handleSetDataUpdate(setIndex, { completed });
              if (completed) {
                startTimer();
              }
            }}
          />
        ))}
        <AddSetButton onClick={handleAddSet} />
      </div>
    </section>
  );
};

const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  workoutName,
  onFinish,
  timeLeft,
  isTimerActive,
  onSkipTimer,
}) => {
  const [isPlateCalcOpen, setIsPlateCalcOpen] = React.useState(false);

  return (
    <header className="bg-white">
      {isTimerActive && timeLeft !== null && (
        <div className="fixed inset-x-0 top-0 bg-blue-500 text-white py-2 px-4 flex items-center justify-center gap-2">
          <Timer className="h-4 w-4" />
          <span>
            Rest Timer: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-blue-100"
            onClick={onSkipTimer}
          >
            Skip
          </Button>
        </div>
      )}
      <div className="flex justify-between items-center p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setIsPlateCalcOpen(true)}>
              Plate Calculator
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          onClick={onFinish}
          variant="default"
          className="bg-green-500 hover:bg-green-600"
        >
          Finish
        </Button>
      </div>
      <div className="px-4 pb-4">
        <h1 className="text-xl font-bold">{workoutName}</h1>
        <div className="flex items-center mt-1">
          <time className="text-base text-gray-900">
            {new Date().toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </time>
          <div className="h-1 w-1 bg-gray-300 rounded-full mx-2" />
          <button className="text-base text-gray-500">Notes</button>
        </div>
      </div>
      <PlateCalculator
        isOpen={isPlateCalcOpen}
        onClose={() => setIsPlateCalcOpen(false)}
      />
    </header>
  );
};

export function ActiveWorkout() {
  const [, setLocation] = useLocation();
  const [workout] = useState<WorkoutTemplate>(() => {
    const stored = sessionStorage.getItem("activeWorkout");
    return stored ? JSON.parse(stored) : null;
  });

  const [activeExercises, setActiveExercises] = useState<ActiveExercise[]>(
    () =>
      workout?.exercises.map((e: { exerciseId: string }) => ({
        exerciseId: e.exerciseId,
        sets: [],
      })) ?? []
  );

  const { timeLeft, isActive, startTimer, stopTimer } = useRestTimer();

  const handleFinish = async () => {
    if (!workout || !activeExercises.length) {
      console.error("No workout data available");
      return;
    }

    try {
      const { v4: uuid } = await import("uuid");
      const workoutData = {
        id: uuid(),
        name: workout.name,
        exercises: activeExercises,
        completedAt: new Date().toISOString(),
      };

      const { saveWorkout } = await import("../lib/database");
      const key = await saveWorkout(workoutData);

      if (!key) {
        throw new Error("Failed to get workout key from database");
      }

      sessionStorage.setItem("completedWorkout", JSON.stringify(workoutData));
      sessionStorage.removeItem("activeWorkout");

      setLocation("/workout-complete");
    } catch (error) {
      console.error("Error saving workout:", error);
      alert("Failed to save workout. Please try again.");
    }
  };

  if (!workout) {
    return (
      <div className="p-4">
        <p>No active workout found</p>
        <Button onClick={() => setLocation("/workout")}>
          Return to Workouts
        </Button>
      </div>
    );
  }

  const handleExerciseUpdate = (
    exerciseIndex: number,
    updatedExercise: ActiveExercise
  ) => {
    setActiveExercises((prev) => {
      const updated = [...prev];
      updated[exerciseIndex] = updatedExercise;
      return updated;
    });
  };

  return (
    <main className="min-h-screen pb-16">
      <WorkoutHeader
        workoutName={workout.name}
        onFinish={handleFinish}
        timeLeft={timeLeft}
        isTimerActive={isActive}
        onSkipTimer={stopTimer}
      />
      <div className="p-4 space-y-6">
        {activeExercises.map((exercise, exerciseIndex) => (
          <ExerciseCard
            key={`${exercise.exerciseId}-${exerciseIndex}`}
            exercise={exercise}
            exerciseIndex={exerciseIndex}
            onExerciseUpdate={(updatedExercise) =>
              handleExerciseUpdate(exerciseIndex, updatedExercise)
            }
            startTimer={startTimer}
          />
        ))}
      </div>
    </main>
  );
}
