export interface ApiEnv {
  host: string;
  port: number;
  corsOrigins: string[];
  databaseUrl: string;
}

async function readSecret(name: string): Promise<string | undefined> {
  const direct = process.env[name];
  if (direct) return direct;
  const file = process.env[`${name}_FILE`];
  if (!file) return undefined;
  return (await Bun.file(file).text()).trim();
}

export async function loadApiEnv(): Promise<ApiEnv> {
  const databaseUrl = await readSecret("DATABASE_URL");
  if (!databaseUrl) throw new Error("DATABASE_URL or DATABASE_URL_FILE is required");
  const port = Number(process.env.API_PORT ?? "8080");
  if (!Number.isInteger(port) || port < 1 || port > 65_535) throw new Error("API_PORT is invalid");
  const parsedDatabaseUrl = URL.parse(databaseUrl);
  if (
    !parsedDatabaseUrl ||
    !["postgres:", "postgresql:"].includes(parsedDatabaseUrl.protocol) ||
    !parsedDatabaseUrl.hostname ||
    parsedDatabaseUrl.pathname.length < 2
  ) {
    throw new Error("DATABASE_URL must be a PostgreSQL URL with a database name");
  }
  const corsOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  if (
    !corsOrigins.length ||
    corsOrigins.some((origin) => {
      const url = URL.parse(origin);
      return !url || !["http:", "https:"].includes(url.protocol) || url.origin !== origin;
    })
  )
    throw new Error("CORS_ORIGINS must contain HTTP origins without paths");
  return {
    host: process.env.API_HOST ?? "0.0.0.0",
    port,
    corsOrigins,
    databaseUrl,
  };
}
