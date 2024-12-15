
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PlateCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlateCalculator: React.FC<PlateCalculatorProps> = ({
  isOpen,
  onClose,
}) => {
  const [weight, setWeight] = React.useState<number>(45);
  const plateWeights = [45, 35, 25, 10, 5, 2.5];
  const barWeight = 45;

  const calculatePlates = (targetWeight: number): number[] => {
    const plates: number[] = [];
    let remainingWeight = Math.max(0, targetWeight - barWeight) / 2;

    plateWeights.forEach((plate) => {
      while (remainingWeight >= plate) {
        plates.push(plate);
        remainingWeight -= plate;
      }
    });

    return plates;
  };

  const plates = calculatePlates(weight);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Plate Calculator</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="weight" className="text-sm font-medium">
              Total Weight (including bar)
            </label>
            <input
              id="weight"
              type="number"
              step="2.5"
              min={45}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full p-2 rounded border border-gray-200"
            />
          </div>
          <div className="p-4 bg-gray-50 rounded-md space-y-2">
            <div className="text-sm">
              <span className="font-medium">Bar weight:</span> {barWeight}lb
            </div>
            <div className="text-sm">
              <span className="font-medium">Plates per side:</span>{" "}
              {plates.length > 0
                ? plates.map((p) => `${p}lb`).join(", ")
                : "No plates needed"}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
