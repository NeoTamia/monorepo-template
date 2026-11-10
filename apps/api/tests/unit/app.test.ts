import { describe, expect, mock, test } from "bun:test";
import type { TodoRepository } from "@neotamia/monorepo-template-database";
import { createApp } from "@/app";

const todo = {
  id: "89a26784-421d-4ad2-8072-3a926109de8e",
  title: "Ship the template",
  completed: false,
  createdAt: "2026-08-23T10:00:00.000Z",
  updatedAt: "2026-08-23T10:00:00.000Z",
};

function repository(): TodoRepository {
  return {
    create: mock(async () => todo),
    findById: mock(async () => todo),
    list: mock(async () => [todo]),
    update: mock(async () => todo),
    remove: mock(async () => true),
  };
}

describe("API", () => {
  test("reports liveness", async () => {
    const app = createApp({
      corsOrigins: [],
      isDatabaseReady: async () => true,
      todos: repository(),
    });
    const response = await app.handle(new Request("http://localhost/health"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
  });

  test("returns a validated todo list", async () => {
    const app = createApp({
      corsOrigins: [],
      isDatabaseReady: async () => true,
      todos: repository(),
    });
    const response = await app.handle(new Request("http://localhost/api/v1/todos/"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([todo]);
  });
});
