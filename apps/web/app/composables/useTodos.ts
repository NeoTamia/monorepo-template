import {
  CreateTodoSchema,
  TodoListSchema,
  TodoSchema,
  UpdateTodoSchema,
  type CreateTodo,
  type Todo,
  type UpdateTodo,
} from "@neotamia/monorepo-template-contracts";
import { Value } from "@sinclair/typebox/value";

function assertContract<T>(schema: Parameters<typeof Value.Check>[0], value: unknown): T {
  if (!Value.Check(schema, value)) throw new Error("The API returned an invalid response.");
  return value as T;
}

export function useTodosApi() {
  const config = useRuntimeConfig();
  const baseURL = import.meta.server ? config.apiBaseUrl : config.public.apiBaseUrl;

  return {
    async list(): Promise<Todo[]> {
      const response = await $fetch<unknown>("/api/v1/todos/", { baseURL });
      return assertContract<Todo[]>(TodoListSchema, response);
    },
    async create(input: CreateTodo): Promise<Todo> {
      if (!Value.Check(CreateTodoSchema, input)) throw new Error("Give the todo a title.");
      const response = await $fetch<unknown>("/api/v1/todos/", {
        baseURL,
        method: "POST",
        body: input,
      });
      return assertContract<Todo>(TodoSchema, response);
    },
    async update(id: string, input: UpdateTodo): Promise<Todo> {
      if (!Value.Check(UpdateTodoSchema, input)) throw new Error("Choose something to update.");
      const response = await $fetch<unknown>(`/api/v1/todos/${id}`, {
        baseURL,
        method: "PATCH",
        body: input,
      });
      return assertContract<Todo>(TodoSchema, response);
    },
    async remove(id: string): Promise<void> {
      await $fetch(`/api/v1/todos/${id}`, { baseURL, method: "DELETE" });
    },
  };
}
