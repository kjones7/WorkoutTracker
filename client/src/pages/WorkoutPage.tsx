import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomNav } from "../components/features/BottomNav";
import { workoutTemplates } from "../data/templates";
import { exercises } from "../data/exercises";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { PlayCircle } from "lucide-react";

export function WorkoutPage() {
  // activeWorkout state can be any type, default is null
  const [activeWorkout, setActiveWorkout] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("activeWorkout");
    if (stored) {
      setActiveWorkout(JSON.parse(stored));
    }
  }, []);

  const formatTimeAgo = (date: Date) => {
    const days = Math.round((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} days ago`;
  };

  const TemplateCard = ({ template }: { template: typeof workoutTemplates[0] }) => {
    const [, setLocation] = useLocation();

    const handleStartTemplate = () => {
      sessionStorage.setItem("activeWorkout", JSON.stringify(template));
      setLocation("/active-workout");
    };

    return (
      <Card className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold">{template.name}</h3>
        </div>
        <p className="text-sm text-gray-500">
          {template.exercises.map(e => exercises.find(ex => ex.id === e.exerciseId)?.name).join(", ")}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarClock className="h-4 w-4 mr-1" />
            {formatTimeAgo(template.lastModified)}
          </div>
          <Button variant="default" onClick={handleStartTemplate}>
            Start
          </Button>
        </div>
      </Card>
    );
  };

  /**
   * Defining this component within WorkoutPage simplfies things because we don't need to pass the activeWorkout state in as a prop.
   */
  const ActiveWorkoutCard = () => {
    /**
     * useLocation() is from wouter, which is a library for routing in React.
     * It returns an array of the current path (which is ignored below) and a function to update the path.
     */
    const [, setLocation] = useLocation();

    return (
      <Card className="bg-blue-50 border-blue-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-blue-900">Active Workout</h3>
            <p className="text-sm text-blue-700">{activeWorkout?.name}</p>
          </div>
          <Button
            variant="default"
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => setLocation("/active-workout")}
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Continue
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">Start Workout</h1>

        {activeWorkout && <ActiveWorkoutCard />}

        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Templates</h2>
            <div className="flex gap-2">
            </div>
          </div>

          <div className="space-y-3">
            {workoutTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}