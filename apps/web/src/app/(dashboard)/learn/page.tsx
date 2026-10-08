import type { Metadata } from "next";

import { messages } from "@/config/messages";
import { LearningSession } from "@/features/learning-path/learning-session";

export const metadata: Metadata = { title: messages.learn.title };

export default function LearnPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">{messages.learn.title}</h1>
        <p className="text-muted-foreground">{messages.learn.description}</p>
      </header>
      <LearningSession />
    </div>
  );
}
