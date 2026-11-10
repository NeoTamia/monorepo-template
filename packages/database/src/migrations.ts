import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

export async function runMigrations(databaseUrl: string): Promise<void> {
  // A dedicated single connection holds the session lock across Drizzle's migration transaction.
  const client = postgres(databaseUrl, {
    max: 1,
    max_lifetime: 0,
    idle_timeout: 0,
    onnotice: () => {},
  });
  try {
    await client`set lock_timeout = '60s'`;
    await client`select pg_advisory_lock(734812906)`;
    const migrationsFolder = fileURLToPath(new URL("../migrations", import.meta.url));
    await migrate(drizzle(client), { migrationsFolder });
  } finally {
    // Closing the connection releases the lock even when a migration fails.
    await client.end({ timeout: 5 });
  }
}
