import {
  createDatabase,
  createTodoRepository,
  runMigrations,
} from "@neotamia/monorepo-template-database";
import { sql } from "drizzle-orm";
import { createApp } from "./app";
import { loadApiEnv } from "./env";
import { log } from "./logger";

const env = await loadApiEnv();
const { client, db } = createDatabase(env.databaseUrl);
const app = createApp({
  corsOrigins: env.corsOrigins,
  todos: createTodoRepository(db),
  isDatabaseReady: async () => {
    try {
      await db.execute(sql`select 1`);
      return true;
    } catch {
      return false;
    }
  },
});

try {
  log("info", "migrations.started");
  await runMigrations(env.databaseUrl);
  log("info", "migrations.completed");
  app.listen({ hostname: env.host, port: env.port });
  log("info", "server.started", { host: env.host, port: env.port });
} catch (error) {
  log("error", "startup.failed", {
    errorType: error instanceof Error ? error.name : "UnknownError",
  });
  await client.end();
  process.exit(1);
}

let stopping = false;
async function shutdown(): Promise<void> {
  if (stopping) return;
  stopping = true;
  const deadline = setTimeout(() => process.exit(1), 25_000);
  deadline.unref();
  try {
    await app.stop();
    await client.end({ timeout: 5 });
    log("info", "server.stopped");
  } catch {
    log("error", "shutdown.failed");
    process.exitCode = 1;
  } finally {
    clearTimeout(deadline);
  }
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
