import { runMigrations } from "./migrations";
import { readFile } from "node:fs/promises";

async function readDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  if (process.env.DATABASE_URL_FILE) {
    return (await readFile(process.env.DATABASE_URL_FILE, "utf8")).trim();
  }
  throw new Error("DATABASE_URL or DATABASE_URL_FILE is required");
}

await runMigrations(await readDatabaseUrl());
