import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BodyPart, Category } from "@/lib/types";

interface FilterButtonsProps {
  selectedBodyPart: BodyPart | 'Any';
  selectedCategory: Category | 'Any';
  onBodyPartChange: (value: BodyPart | 'Any') => void;
  onCategoryChange: (value: Category | 'Any') => void;
}

const bodyParts: (BodyPart | 'Any')[] = ['Any', 'Arms', 'Back', 'Core', 'Legs', 'Shoulders', 'Chest'];
const categories: (Category | 'Any')[] = ['Any', 'Barbell', 'Dumbbell', 'Bodyweight', 'Machine', 'Cable'];

export function FilterButtons({
  selectedBodyPart,
  selectedCategory,
  onBodyPartChange,
  onCategoryChange,
}: FilterButtonsProps) {
  return (
    <div className="flex gap-2">
      <Select value={selectedBodyPart} onValueChange={onBodyPartChange}>
        <SelectTrigger className="w-[160px] bg-gray-100">
          <SelectValue placeholder="Any Body Part" />
        </SelectTrigger>
        <SelectContent>
          {bodyParts.map((part) => (
            <SelectItem key={part} value={part}>
              {part}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[160px] bg-gray-100">
          <SelectValue placeholder="Any Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
