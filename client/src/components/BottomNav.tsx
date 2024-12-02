import { User, History, Dumbbell, List, Crown } from "lucide-react";
import { Link, useLocation } from "wouter";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: User, label: "Profile", path: "/profile" },
    { icon: History, label: "History", path: "/history" },
    { icon: Dumbbell, label: "Workout", path: "/workout" },
    { icon: List, label: "Exercises", path: "/" },
    { icon: Crown, label: "Upgrade", path: "/upgrade" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
      {navItems.map(({ icon: Icon, label, path }) => (
        <Link key={path} href={path}>
          <a className={`flex flex-col items-center px-3 py-1 ${
            location === path ? "text-blue-600" : "text-gray-600"
          }`}>
            <Icon className="w-5 h-5" />
            <span className="text-xs mt-1">{label}</span>
          </a>
        </Link>
      ))}
    </nav>
  );
}
