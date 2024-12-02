import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ExerciseLibrary } from "./pages/ExerciseLibrary";
import { WorkoutPage } from "./pages/WorkoutPage";
import { ActiveWorkout } from "./pages/ActiveWorkout";
import { WorkoutComplete } from "./pages/WorkoutComplete";
import { BottomNav } from "./components/BottomNav";

function Router() {
  return (
    <>
      <Switch>
        <Route path="/" component={WorkoutPage} />
        <Route path="/exercises" component={ExerciseLibrary} />
        <Route path="/active-workout" component={ActiveWorkout} />
        <Route path="/workout-complete" component={WorkoutComplete} />
        <Route>404 Page Not Found</Route>
      </Switch>
      <BottomNav />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
);
