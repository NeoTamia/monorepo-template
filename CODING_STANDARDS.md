# Coding standards

## TypeScript and package boundaries

- Keep TypeScript strict. Narrow `unknown` at external boundaries and use `import type` for type-only imports.
- Give non-trivial exported functions explicit return types where this does not erase framework inference.
- Explain necessary type assertions and lint suppressions at their use site. Fix types instead of hiding errors.
- Applications consume packages; packages do not import applications. Browser code must not import database or server-only code.
- Keep shared runtime contracts independent of HTTP frameworks and persistence. Expose package APIs through package exports.
- Keep environment access in startup/configuration code. Validate required configuration before opening a listener.

## Runtime

- Use the API's structured logger with named events and explicit scalar fields. Keep credentials, request bodies, headers, raw URLs and arbitrary error messages out of logs.
- Return errors as `{ code, message, requestId }`; keep unexpected error details server-side. Generate request IDs on the server.
- Run migrations before serving traffic through the shared migration function, which holds a PostgreSQL session advisory lock on a dedicated connection. Keep schema changes compatible with the previous application release.
- Keep committed migrations immutable after release. Generate the next migration from the schema and review its SQL.

## Dependencies and tooling

- Pin external dependencies exactly; use `workspace:*` for internal packages. Update the Bun lockfile with manifest changes.
- Oxlint and Oxfmt are authoritative. Keep one shared configuration and justify local exceptions.
- Keep Docker builds reproducible with the frozen lockfile and pinned base images. Copy every workspace manifest before installing dependencies.

## Writing

Write repository documentation and code comments in English, with LF line endings. Describe the reason for a non-obvious constraint instead of repeating the code.
