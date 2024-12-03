import { useState } from "react";
import { ExerciseCard } from "@/components/features/exercises/ExerciseCard";
import { SearchBar } from "@/components/features/exercises/SearchBar";
import { FilterButtons } from "@/components/features/exercises/FilterButtons";
import { BottomNav } from "@/components/features/BottomNav";
import { exercises } from "@/data/exercises";
import type { BodyPart, Category } from "@/lib/types";

export function ExerciseLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bodyPart, setBodyPart] = useState<BodyPart | "Any">("Any");
  const [category, setCategory] = useState<Category | "Any">("Any");

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesBodyPart = bodyPart === "Any" || exercise.bodyPart === bodyPart;
    const matchesCategory = category === "Any" || exercise.category === category;
    return matchesSearch && matchesBodyPart && matchesCategory;
  });

  return (
    <div className="min-h-screen pb-16">
      <div className="sticky top-0 bg-white z-10 p-4 space-y-4">
        <h1 className="text-2xl font-bold">Exercises</h1>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterButtons
          selectedBodyPart={bodyPart}
          selectedCategory={category}
          onBodyPartChange={setBodyPart}
          onCategoryChange={setCategory}
        />
      </div>

      <div className="p-4 space-y-3">
        {filteredExercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>

      
    </div>
  );
}
