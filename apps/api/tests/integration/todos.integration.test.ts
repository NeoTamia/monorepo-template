import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { createTodoRepository } from "@neotamia/monorepo-template-database";
import { createTestDatabase } from "@neotamia/monorepo-template-database/test-support";
import { createApp } from "@/app";

let database: Awaited<ReturnType<typeof createTestDatabase>>;

beforeAll(async () => {
  database = await createTestDatabase();
});

afterAll(async () => {
  await database.client.end();
});

describe("todo HTTP API", () => {
  test("creates, updates and deletes a todo", async () => {
    const app = createApp({
      corsOrigins: ["http://localhost:3000"],
      isDatabaseReady: async () => true,
      todos: createTodoRepository(database.db),
    });

    const createResponse = await app.handle(
      new Request("http://localhost/api/v1/todos/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "Exercise Elysia" }),
      }),
    );
    expect(createResponse.status).toBe(201);
    const created = (await createResponse.json()) as { id: string };

    const updateResponse = await app.handle(
      new Request(`http://localhost/api/v1/todos/${created.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ completed: true }),
      }),
    );
    expect(updateResponse.status).toBe(200);

    const deleteResponse = await app.handle(
      new Request(`http://localhost/api/v1/todos/${created.id}`, { method: "DELETE" }),
    );
    expect(deleteResponse.status).toBe(204);
  });
});
