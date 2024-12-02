import { User, History, Dumbbell, List } from "lucide-react";
import { Link, useLocation } from "wouter";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Dumbbell, label: "Workout", path: "/workout" },
    { icon: List, label: "Exercises", path: "/" },
    { icon: History, label: "History", path: "/history" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
      {navItems.map(({ icon: Icon, label, path }) => (
        <Link key={path} href={path}>
          <div className={`flex flex-col items-center px-3 py-1 ${
            location === path ? "text-blue-600" : "text-gray-600"
          }`}>
            <Icon className="w-5 h-5" />
            <span className="text-xs mt-1">{label}</span>
          </div>
        </Link>
      ))}
    </nav>
  );
}
