import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

export function WorkoutComplete() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-4">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="text-2xl font-bold text-gray-900">Workout Complete!</h1>
          <p className="text-gray-600">
            Great job! You've successfully completed your workout.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Workout Summary</h2>
          {/* Summary details will be populated from session storage */}
          <div className="space-y-2 text-sm text-gray-600">
            {JSON.parse(sessionStorage.getItem("activeWorkout") || "{}").exercises?.map((exercise: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span>{exercise.name}</span>
                <span>{exercise.sets} sets</span>
              </div>
            ))}
          </div>
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
      </Card>
    </div>
  );
}
