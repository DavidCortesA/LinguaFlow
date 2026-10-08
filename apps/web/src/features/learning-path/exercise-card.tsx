"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CEFR_LEVELS, type LearningExercise } from "@linguaflow/shared";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { StatusMessage } from "@/components/shared/status-message";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { messages } from "@/config/messages";
import { submitAttempt } from "@/lib/api-client";
import { cn } from "@/lib/utils";

const AnswerFormSchema = z.object({
  response: z.string().trim().min(1, messages.learn.emptyAnswer),
});
type AnswerForm = z.input<typeof AnswerFormSchema>;

interface ExerciseCardProps {
  exercise: LearningExercise;
  onNext: () => void;
}

export function ExerciseCard({ exercise, onNext }: ExerciseCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnswerForm, unknown, z.output<typeof AnswerFormSchema>>({
    resolver: zodResolver(AnswerFormSchema),
    defaultValues: { response: "" },
  });

  const attempt = useMutation({
    mutationFn: (values: z.output<typeof AnswerFormSchema>) =>
      submitAttempt(exercise.id, values.response),
  });

  const position = CEFR_LEVELS.indexOf(exercise.level) + 1;
  const feedback = attempt.data?.feedback;
  const errorId = `${exercise.id}-error`;
  const { responseFormat } = exercise;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{messages.learn.exerciseTitle(exercise.level)}</CardTitle>
          <Badge variant="accent">{exercise.level}</Badge>
        </div>
        <CardDescription>{exercise.instructions}</CardDescription>
        <div className="flex flex-col gap-1.5 pt-1">
          <p className="text-muted-foreground text-xs">
            {messages.learn.levelProgress(position, CEFR_LEVELS.length)}
          </p>
          <Progress
            value={position}
            max={CEFR_LEVELS.length}
            label={messages.learn.levelProgress(position, CEFR_LEVELS.length)}
          />
        </div>
      </CardHeader>

      <CardContent>
        <p lang={exercise.targetLanguage} className="bg-muted rounded-lg p-4 text-lg font-medium">
          {exercise.prompt}
        </p>

        <form
          noValidate
          onSubmit={handleSubmit((values) => attempt.mutate(values))}
          className="flex flex-col gap-4"
        >
          {responseFormat.kind === "single_choice" ? (
            <fieldset
              className="flex flex-col gap-2"
              aria-describedby={errors.response ? errorId : undefined}
            >
              <legend className="mb-1 text-sm font-medium">{messages.learn.choiceLegend}</legend>
              {responseFormat.options.map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    "bg-background hover:border-ring/60 flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm",
                    "has-focus-visible:ring-ring/40 has-focus-visible:ring-3 has-checked:border-primary has-checked:bg-secondary",
                  )}
                >
                  <input
                    type="radio"
                    value={option.id}
                    className="accent-primary size-4"
                    {...register("response")}
                  />
                  <span lang={exercise.targetLanguage}>{option.label}</span>
                </label>
              ))}
            </fieldset>
          ) : (
            <div className="flex flex-col gap-2">
              <label htmlFor={`${exercise.id}-input`} className="text-sm font-medium">
                {messages.learn.answerLabel}
              </label>
              <Input
                id={`${exercise.id}-input`}
                lang={exercise.targetLanguage}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                maxLength={responseFormat.maxLength}
                placeholder={messages.learn.answerPlaceholder}
                aria-invalid={errors.response ? true : undefined}
                aria-describedby={errors.response ? errorId : undefined}
                {...register("response")}
              />
            </div>
          )}

          {errors.response ? (
            <p id={errorId} role="alert" className="text-destructive text-sm">
              {errors.response.message}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={attempt.isPending}>
              {attempt.isPending ? messages.learn.submitting : messages.learn.submit}
            </Button>
            <Button type="button" variant="outline" onClick={onNext}>
              {messages.learn.another}
            </Button>
          </div>
        </form>

        {attempt.isError ? (
          <StatusMessage variant="error">{messages.learn.submitError}</StatusMessage>
        ) : null}

        {feedback ? (
          <StatusMessage
            variant={feedback.isCorrect ? "success" : "error"}
            title={feedback.isCorrect ? messages.learn.correct : messages.learn.incorrect}
          >
            <p>{feedback.message}</p>
            {feedback.correctAnswer ? (
              <p className="mt-1 font-medium">
                {messages.learn.correctAnswer(feedback.correctAnswer)}
              </p>
            ) : null}
          </StatusMessage>
        ) : null}
      </CardContent>
    </Card>
  );
}
