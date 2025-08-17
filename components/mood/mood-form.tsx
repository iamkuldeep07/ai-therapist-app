"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";

interface MoodFormProps {
  onSubmit: (data: { moodScore: number }) => void | Promise<void>;
  isLoading: boolean;
}

export function MoodForm({ onSubmit, isLoading }: MoodFormProps) {
  const [moodScore, setMoodScore] = useState(50);

  const emotions = [
    { value: 0, label: "😔", description: "Very Low" },
    { value: 25, label: "😕", description: "Low" },
    { value: 50, label: "😊", description: "Neutral" },
    { value: 75, label: "😃", description: "Good" },
    { value: 100, label: "🤗", description: "Great" },
  ];

  const currentEmotion =
    emotions.find((em) => Math.abs(moodScore - em.value) < 15) || emotions[2];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ moodScore });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="text-center space-y-2">
        <div className="text-4xl">{currentEmotion.label}</div>
        <div className="text-sm text-[hsl(215,16%,45%)]">
          {currentEmotion.description}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between px-2">
          {emotions.map((em) => (
            <div
              key={em.value}
              className={`cursor-pointer transition-opacity ${
                Math.abs(moodScore - em.value) < 15
                  ? "opacity-100"
                  : "opacity-50"
              }`}
              onClick={() => setMoodScore(em.value)}
            >
              <div className="text-2xl">{em.label}</div>
            </div>
          ))}
        </div>

        <Slider
          value={[moodScore]}
          onValueChange={(value) => setMoodScore(value[0])}
          min={0}
          max={100}
          step={1}
          className="py-4"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
          </>
        ) : (
          "Save Mood"
        )}
      </Button>
    </form>
  );
}