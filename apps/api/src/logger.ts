interface LogFields {
  requestId?: string;
  method?: string;
  route?: string;
  status?: number;
  durationMs?: number;
  host?: string;
  port?: number;
  errorType?: string;
}

// Keep fields explicit: request bodies, headers, URLs and error messages can contain secrets.
export function log(level: "info" | "warn" | "error", event: string, fields: LogFields = {}): void {
  const line = JSON.stringify({
    time: new Date().toISOString(),
    level,
    service: "api",
    event,
    ...fields,
  });
  if (level === "error") console.error(line);
  else console.info(line);
}
