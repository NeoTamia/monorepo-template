import { cors } from "@elysiajs/cors";
import {
  ApiErrorSchema,
  CreateTodoSchema,
  TodoIdParamsSchema,
  TodoListSchema,
  TodoSchema,
  UpdateTodoSchema,
} from "@neotamia/monorepo-template-contracts";
import type { TodoRepository } from "@neotamia/monorepo-template-database";
import { Elysia } from "elysia";
import { log } from "./logger";

export interface AppDependencies {
  corsOrigins: string[];
  isDatabaseReady: () => Promise<boolean>;
  todos: TodoRepository;
}

const notFound = { code: "TODO_NOT_FOUND", message: "Todo not found" } as const;

export function createApp(dependencies: AppDependencies) {
  const requests = new WeakMap<Request, { requestId: string; startedAt: number }>();
  const errorBody = (request: Request, code: string, message: string) => ({
    code,
    message,
    requestId: requests.get(request)?.requestId,
  });

  return new Elysia()
    .onRequest(({ request, set }) => {
      const requestId = crypto.randomUUID();
      requests.set(request, { requestId, startedAt: performance.now() });
      set.headers["x-request-id"] = requestId;
    })
    .onError(({ code, error, request, status }) => {
      if (code === "VALIDATION" && error.type !== "response")
        return status(422, errorBody(request, "VALIDATION_ERROR", "Invalid request"));
      if (code === "PARSE")
        return status(400, errorBody(request, "PARSE_ERROR", "Invalid request body"));
      if (code === "NOT_FOUND")
        return status(404, errorBody(request, "NOT_FOUND", "Route not found"));
      log("error", "request.failed", {
        requestId: requests.get(request)?.requestId,
        errorType: error instanceof Error ? error.name : "UnknownError",
      });
      return status(500, errorBody(request, "INTERNAL_ERROR", "Internal server error"));
    })
    .onAfterResponse(({ request, route, response, set }) => {
      const context = requests.get(request);
      log("info", "request.completed", {
        requestId: context?.requestId,
        method: request.method,
        route: route ?? "unmatched",
        status:
          response instanceof Response
            ? response.status
            : typeof set.status === "number"
              ? set.status
              : 200,
        durationMs: Math.round(performance.now() - (context?.startedAt ?? performance.now())),
      });
    })
    .use(cors({ origin: dependencies.corsOrigins, exposeHeaders: ["x-request-id"] }))
    .get("/health", () => ({ status: "ok" as const }))
    .get("/ready", async ({ request, status }) => {
      const ready = await dependencies.isDatabaseReady();
      return ready
        ? { status: "ready" as const }
        : status(503, errorBody(request, "NOT_READY", "Database unavailable"));
    })
    .group("/api/v1/todos", (app) =>
      app
        .get("/", () => dependencies.todos.list(), { response: TodoListSchema })
        .get(
          "/:id",
          async ({ params, request, status }) =>
            (await dependencies.todos.findById(params.id)) ??
            status(404, errorBody(request, notFound.code, notFound.message)),
          { params: TodoIdParamsSchema, response: { 200: TodoSchema, 404: ApiErrorSchema } },
        )
        .post(
          "/",
          async ({ body, status }) =>
            status(201, await dependencies.todos.create({ title: body.title.trim() })),
          { body: CreateTodoSchema, response: { 201: TodoSchema } },
        )
        .patch(
          "/:id",
          async ({ body, params, request, status }) => {
            const todo = await dependencies.todos.update(params.id, {
              ...body,
              ...(body.title === undefined ? {} : { title: body.title.trim() }),
            });
            return todo ?? status(404, errorBody(request, notFound.code, notFound.message));
          },
          {
            body: UpdateTodoSchema,
            params: TodoIdParamsSchema,
            response: { 200: TodoSchema, 404: ApiErrorSchema },
          },
        )
        .delete(
          "/:id",
          async ({ params, request, status }) =>
            (await dependencies.todos.remove(params.id))
              ? new Response(null, { status: 204 })
              : status(404, errorBody(request, notFound.code, notFound.message)),
          { params: TodoIdParamsSchema, response: { 404: ApiErrorSchema } },
        ),
    );
}
