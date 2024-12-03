import { User, History, Dumbbell, List } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/forms/button";

export function BottomNav() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { icon: Dumbbell, label: "Workout", path: "/" },
    { icon: List, label: "Exercises", path: "/exercises" },
    { icon: History, label: "History", path: "/history" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
      {navItems.map(({ icon: Icon, label, path }) => (
        <Button
          key={path}
          variant="ghost"
          onClick={() => setLocation(path)}
          className={`flex flex-col items-center h-auto px-3 py-1 ${
            location === path ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <Icon className="w-5 h-5" />
          <span className="text-xs mt-1">{label}</span>
        </Button>
      ))}
    </nav>
  );
}
