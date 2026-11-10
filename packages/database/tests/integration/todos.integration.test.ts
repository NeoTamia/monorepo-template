import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { createTodoRepository } from "@/todos";
import { createTestDatabase } from "@neotamia/monorepo-template-database/test-support";

let database: Awaited<ReturnType<typeof createTestDatabase>>;

beforeAll(async () => {
  database = await createTestDatabase();
});

afterAll(async () => {
  await database.client.end();
});

describe("todo repository", () => {
  test("persists the complete lifecycle", async () => {
    const repository = createTodoRepository(database.db);
    const created = await repository.create({ title: "  Exercise PostgreSQL  " });
    expect(created.title).toBe("Exercise PostgreSQL");
    expect(created.completed).toBe(false);

    const updated = await repository.update(created.id, { completed: true });
    expect(updated?.completed).toBe(true);
    expect(await repository.findById(created.id)).toEqual(updated);
    expect(await repository.list()).toEqual([updated!]);

    expect(await repository.remove(created.id)).toBe(true);
    expect(await repository.findById(created.id)).toBeNull();
  });
});
