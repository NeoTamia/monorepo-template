import type { CreateTodo, Todo, UpdateTodo } from "@neotamia/monorepo-template-contracts";
import { desc, eq } from "drizzle-orm";
import type { Database } from "./client";
import { todos } from "./schema";

function toTodo(row: typeof todos.$inferSelect): Todo {
  return {
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function createTodoRepository(db: Database) {
  return {
    async create(input: CreateTodo): Promise<Todo> {
      const [row] = await db
        .insert(todos)
        .values({ id: crypto.randomUUID(), title: input.title.trim() })
        .returning();
      if (!row) throw new Error("Todo insert returned no row");
      return toTodo(row);
    },
    async findById(id: string): Promise<Todo | null> {
      const [row] = await db.select().from(todos).where(eq(todos.id, id)).limit(1);
      return row ? toTodo(row) : null;
    },
    async list(): Promise<Todo[]> {
      const rows = await db.select().from(todos).orderBy(desc(todos.createdAt), desc(todos.id));
      return rows.map(toTodo);
    },
    async update(id: string, input: UpdateTodo): Promise<Todo | null> {
      const values = {
        ...(input.title === undefined ? {} : { title: input.title.trim() }),
        ...(input.completed === undefined ? {} : { completed: input.completed }),
        updatedAt: new Date(),
      };
      const [row] = await db.update(todos).set(values).where(eq(todos.id, id)).returning();
      return row ? toTodo(row) : null;
    },
    async remove(id: string): Promise<boolean> {
      const rows = await db.delete(todos).where(eq(todos.id, id)).returning({ id: todos.id });
      return rows.length > 0;
    },
  };
}

export type TodoRepository = ReturnType<typeof createTodoRepository>;
