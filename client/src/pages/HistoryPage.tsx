import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Clock, Weight, Trophy, Trash2 } from "lucide-react";
import { getWorkouts, deleteWorkout } from "../lib/database";
import { exercises } from "../data/exercises";
import type { WorkoutData } from "../lib/database";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function HistoryPage() {
  const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDeleteWorkout = async (workoutId: string) => {
    try {
      const key = `workout:${workoutId}`;
      console.log("Attempting to delete workout with key:", key);
      await deleteWorkout(key);

      // Only update UI state if the database deletion was successful
      setWorkouts((prevWorkouts) =>
        prevWorkouts.filter((workout) => workout.id !== workoutId)
      );

      toast({
        title: "Success",
        description: "Workout deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting workout:", error);
      toast({
        title: "Error",
        description: "Failed to delete workout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSelectedWorkout(null);
    }
  };

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await getWorkouts();
        setWorkouts(data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };
    fetchWorkouts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString("en-US", { weekday: "long" });
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const dayNum = date.getDate();
    return { day, date: `${month} ${dayNum}` };
  };

  const calculateWorkoutStats = (workout: WorkoutData) => {
    // Default values
    const stats = {
      totalWeight: 0,
      totalReps: 0,
      prs: 0,
      duration: "0m",
      maxWeight: 0,
    };

    // Return default stats if workout is invalid
    if (!workout || !workout.exercises) {
      return stats;
    }

    let totalWeight = 0;
    let totalReps = 0;
    let prs = 0;
    let maxWeight = 0;
    const startTime = new Date(workout.completedAt);

    let lastSetTime = startTime;
    workout.exercises.forEach((exercise) => {
      if (!exercise || !exercise.sets) return;

      let exerciseMaxWeight = 0;
      exercise.sets.forEach((set) => {
        if (!set) return;

        if (set.completed) {
          if (set.weight && set.reps) {
            const setVolume = set.weight * set.reps;
            totalWeight += setVolume;
            totalReps += set.reps;
            exerciseMaxWeight = Math.max(exerciseMaxWeight, set.weight);
          }
          lastSetTime = new Date(workout.completedAt);
        }
      });

      if (exerciseMaxWeight > maxWeight) {
        maxWeight = exerciseMaxWeight;
        prs++;
      }
    });

    const durationMs = lastSetTime.getTime() - startTime.getTime();
    const durationMins = Math.round(durationMs / (1000 * 60));

    return {
      totalWeight,
      totalReps,
      prs,
      duration: `${durationMins}m`,
      maxWeight,
    };
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">History</h1>
          <Button variant="ghost">Calendar</Button>
        </div>

        <div className="space-y-4">
          {workouts?.map((workout, index) => {
            if (!workout || !workout.exercises) return null;
            const { day, date } = formatDate(workout.completedAt);
            const stats = calculateWorkoutStats(workout);

            return (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-semibold text-lg">{workout.name}</h2>
                  <DropdownMenu onOpenChange={() => {
                    if (selectedWorkout) {
                      setSelectedWorkout(null);
                    }
                  }}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedWorkout(workout.id);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Workout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-gray-600 mb-3">
                  {day}, {date}
                </p>

                <div className="flex flex-wrap gap-4 mb-3 text-sm">
                  <div className="flex items-center gap-1" title="Duration">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{stats.duration}</span>
                  </div>
                  <div className="flex items-center gap-1" title="Total Volume">
                    <Weight className="h-4 w-4 text-gray-500" />
                    <span>{stats.totalWeight.toLocaleString()} lb</span>
                  </div>
                  <div className="flex items-center gap-1" title="Total Reps">
                    <span className="text-gray-500">×</span>
                    <span>{stats.totalReps} reps</span>
                  </div>
                  <div
                    className="flex items-center gap-1"
                    title="Personal Records"
                  >
                    <Trophy className="h-4 w-4 text-blue-500" />
                    <span>
                      {stats.prs} {stats.prs === 1 ? "PR" : "PRs"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {workout.exercises.map((exercise, i) => {
                    const exerciseData = exercises.find(
                      (e) => e.id === exercise.exerciseId,
                    );
                    const bestSet = exercise.sets.reduce((best, current) => {
                      if (!current.completed) return best;
                      if (!best.weight || !best.reps) return current;
                      if (!current.weight || !current.reps) return best;
                      return current.weight * current.reps >
                        best.weight * best.reps
                        ? current
                        : best;
                    }, exercise.sets[0]);

                    return (
                      <div
                        key={i}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-gray-900">
                          {`${exercise.sets.filter((s) => s.completed).length}× ${exerciseData?.name}`}
                        </span>
                        <span className="text-sm text-gray-600">
                          {bestSet.weight
                            ? `${bestSet.weight} lb × ${bestSet.reps}`
                            : bestSet.time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!selectedWorkout}
        onClose={() => setSelectedWorkout(null)}
        onConfirm={() =>
          selectedWorkout && handleDeleteWorkout(selectedWorkout)
        }
        title="Delete Workout"
        description="Are you sure you want to delete this workout? This action cannot be undone."
      />
    </div>
  );
}
