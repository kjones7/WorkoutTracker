import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Clock, Weight, Trophy } from "lucide-react";
import { getWorkouts } from "../lib/database";
import { exercises } from "../data/exercises";
import type { WorkoutData } from "../lib/database";

export function HistoryPage() {
  const [workouts, setWorkouts] = useState<WorkoutData[]>([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await getWorkouts();
        setWorkouts(data);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };
    fetchWorkouts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const dayNum = date.getDate();
    return { day, date: `${month} ${dayNum}` };
  };

  const calculateWorkoutStats = (workout: WorkoutData) => {
    let totalWeight = 0;
    let totalReps = 0;
    let prs = 0;
    let maxWeight = 0;
    const startTime = new Date(workout.completedAt);
    
    // Get the last set completion time and calculate statistics
    let lastSetTime = startTime;
    workout.exercises.forEach(exercise => {
      let exerciseMaxWeight = 0;
      exercise.sets.forEach(set => {
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
      
      // Check if this exercise has a PR (comparing with the exercise's previous max)
      if (exerciseMaxWeight > maxWeight) {
        maxWeight = exerciseMaxWeight;
        prs++;
      }
    });

    // Calculate duration in minutes
    const durationMs = lastSetTime.getTime() - startTime.getTime();
    const durationMins = Math.round(durationMs / (1000 * 60));
    
    return {
      totalWeight,
      totalReps,
      prs,
      duration: `${durationMins}m`,
      maxWeight
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
          {workouts.map((workout, index) => {
            const { day, date } = formatDate(workout.completedAt);
            const stats = calculateWorkoutStats(workout);
            
            return (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-semibold text-lg">{workout.name}</h2>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-gray-600 mb-3">{day}, {date}</p>

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
                  <div className="flex items-center gap-1" title="Personal Records">
                    <Trophy className="h-4 w-4 text-blue-500" />
                    <span>{stats.prs} {stats.prs === 1 ? 'PR' : 'PRs'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {workout.exercises.map((exercise, i) => {
                    const exerciseData = exercises.find(e => e.id === exercise.exerciseId);
                    const bestSet = exercise.sets.reduce((best, current) => {
                      if (!current.completed) return best;
                      if (!best.weight || !best.reps) return current;
                      if (!current.weight || !current.reps) return best;
                      return (current.weight * current.reps > best.weight * best.reps) ? current : best;
                    }, exercise.sets[0]);

                    return (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-sm text-gray-900">
                          {`${exercise.sets.filter(s => s.completed).length}× ${exerciseData?.name}`}
                        </span>
                        <span className="text-sm text-gray-600">
                          {bestSet.weight ? `${bestSet.weight} lb × ${bestSet.reps}` : bestSet.time}
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
    </div>
  );
}
