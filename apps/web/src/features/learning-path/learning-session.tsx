"use client";

import type { CefrLevel } from "@linguaflow/shared";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { StatusMessage } from "@/components/shared/status-message";
import { Button } from "@/components/ui/button";
import { messages } from "@/config/messages";
import { fetchSampleExercise } from "@/lib/api-client";

import { ExerciseCard } from "./exercise-card";
import { LevelPicker } from "./level-picker";

export function LearningSession() {
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel>("A1");
  const [activeLevel, setActiveLevel] = useState<CefrLevel | null>(null);

  const exercise = useQuery({
    queryKey: ["sample-exercise", activeLevel],
    queryFn: () => fetchSampleExercise(activeLevel as CefrLevel),
    enabled: activeLevel !== null,
    // Seed content is deterministic, so there is nothing to refresh.
    staleTime: Infinity,
  });

  if (activeLevel === null) {
    return (
      <div className="flex flex-col gap-6">
        <LevelPicker value={selectedLevel} onChange={setSelectedLevel} />
        <div>
          <Button size="lg" onClick={() => setActiveLevel(selectedLevel)}>
            {messages.learn.start}
          </Button>
        </div>
        <StatusMessage variant="empty">{messages.learn.empty}</StatusMessage>
      </div>
    );
  }

  if (exercise.isPending) {
    return <StatusMessage variant="loading">{messages.learn.loading}</StatusMessage>;
  }

  if (exercise.isError) {
    return (
      <StatusMessage
        variant="error"
        action={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => void exercise.refetch()}>
              {messages.learn.retry}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setActiveLevel(null)}>
              {messages.learn.another}
            </Button>
          </div>
        }
      >
        {messages.learn.loadError}
      </StatusMessage>
    );
  }

  return (
    <ExerciseCard
      // A new key resets the form and the previous feedback for each exercise.
      key={exercise.data.id}
      exercise={exercise.data}
      onNext={() => setActiveLevel(null)}
    />
  );
}
