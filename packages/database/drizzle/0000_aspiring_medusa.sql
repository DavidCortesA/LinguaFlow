CREATE TABLE "exercise_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exercise_id" text NOT NULL,
	"level" text NOT NULL,
	"skill" text NOT NULL,
	"response" text NOT NULL,
	"is_correct" boolean NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL
);
