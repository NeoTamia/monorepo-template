import { sql } from "drizzle-orm";
import { createDatabase } from "./client";
import { runMigrations } from "./migrations";

export async function createTestDatabase() {
  const databaseUrl = process.env.TEST_DATABASE_URL;
  if (!databaseUrl || !new URL(databaseUrl).pathname.toLowerCase().includes("test")) {
    throw new Error("A safe TEST_DATABASE_URL containing 'test' in its database name is required");
  }
  const database = createDatabase(databaseUrl);
  await runMigrations(databaseUrl);
  await database.db.execute(sql`truncate table todos`);
  return database;
}
