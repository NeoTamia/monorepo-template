import { FormatRegistry, Type, type Static } from "@sinclair/typebox";

FormatRegistry.Set("uuid", (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value),
);
FormatRegistry.Set("date-time", (value) => !Number.isNaN(Date.parse(value)));

export const TodoSchema = Type.Object(
  {
    id: Type.String({ format: "uuid" }),
    title: Type.String({ minLength: 1, maxLength: 200 }),
    completed: Type.Boolean(),
    createdAt: Type.String({ format: "date-time" }),
    updatedAt: Type.String({ format: "date-time" }),
  },
  { additionalProperties: false },
);

export const TodoIdParamsSchema = Type.Object(
  { id: Type.String({ format: "uuid" }) },
  { additionalProperties: false },
);

export const CreateTodoSchema = Type.Object(
  { title: Type.String({ minLength: 1, maxLength: 200, pattern: ".*\\S.*" }) },
  { additionalProperties: false },
);

export const UpdateTodoSchema = Type.Partial(
  Type.Object(
    {
      title: Type.String({ minLength: 1, maxLength: 200, pattern: ".*\\S.*" }),
      completed: Type.Boolean(),
    },
    { additionalProperties: false },
  ),
  { minProperties: 1 },
);

export const TodoListSchema = Type.Array(TodoSchema);

export const ApiErrorSchema = Type.Object(
  {
    code: Type.String(),
    message: Type.String(),
    requestId: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

export type Todo = Static<typeof TodoSchema>;
export type CreateTodo = Static<typeof CreateTodoSchema>;
export type UpdateTodo = Static<typeof UpdateTodoSchema>;
export type ApiError = Static<typeof ApiErrorSchema>;
