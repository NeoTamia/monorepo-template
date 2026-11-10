CREATE TABLE IF NOT EXISTS "todos" (
  "id" uuid PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "completed" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "todos_title_not_blank" CHECK (length(btrim("title")) > 0)
);

CREATE INDEX IF NOT EXISTS "todos_created_at_id_idx" ON "todos" ("created_at" DESC, "id" DESC);
