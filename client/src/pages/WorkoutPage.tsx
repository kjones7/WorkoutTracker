import { MoreVertical, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomNav } from "../components/BottomNav";
import { workoutTemplates } from "../data/templates";
import { exercises } from "../data/exercises";
import { useLocation } from "wouter";

export function WorkoutPage() {
  

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
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
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

  return (
    <div className="min-h-screen pb-16">
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">Start Workout</h1>
        
        

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
