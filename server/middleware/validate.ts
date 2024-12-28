import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

// Validation schema for workout sets
const workoutSetSchema = z.object({
  weight: z.number().optional(),
  reps: z.number().optional(),
  time: z.string().optional(),
  completed: z.boolean()
});

// Validation schema for workout exercises
const workoutExerciseSchema = z.object({
  exerciseId: z.string(),
  sets: z.array(workoutSetSchema)
});

// Main workout validation schema
export const workoutSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  exercises: z.array(workoutExerciseSchema),
  completedAt: z.string().default(() => new Date().toISOString())
});

// Middleware to validate workout data
export function validateWorkout(req: Request, res: Response, next: NextFunction) {
  try {
    const result = workoutSchema.safeParse(req.body);
    
    if (!result.success) {
      console.error("Workout validation failed:", result.error.errors);
      return res.status(400).json({
        message: "Invalid workout data",
        errors: result.error.errors
      });
    }
    
    req.body = result.data;
    next();
  } catch (error) {
    console.error("Error in workout validation middleware:", error);
    res.status(500).json({ 
      message: "Server error during validation",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
