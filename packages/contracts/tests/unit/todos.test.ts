import { describe, expect, test } from "bun:test";
import { Value } from "@sinclair/typebox/value";
import { CreateTodoSchema, TodoSchema, UpdateTodoSchema } from "@/todos";

describe("todo contracts", () => {
  test("accepts a valid todo", () => {
    expect(
      Value.Check(TodoSchema, {
        id: "89a26784-421d-4ad2-8072-3a926109de8e",
        title: "Ship the template",
        completed: false,
        createdAt: "2026-08-23T10:00:00.000Z",
        updatedAt: "2026-08-23T10:00:00.000Z",
      }),
    ).toBe(true);
  });

  test("rejects blank creates and empty patches", () => {
    expect(Value.Check(CreateTodoSchema, { title: "" })).toBe(false);
    expect(Value.Check(CreateTodoSchema, { title: "   " })).toBe(false);
    expect(Value.Check(UpdateTodoSchema, {})).toBe(false);
  });
});
