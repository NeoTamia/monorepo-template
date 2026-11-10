# Contributing

Thank you for improving this project. By participating, you agree to follow the
[Code of Conduct](CODE_OF_CONDUCT.md).

## Development setup

Install Bun `1.4.0`, Git and Docker, then run:

```bash
cp .env.example .env
bun install --frozen-lockfile
docker compose up -d postgres
bun run db:migrate
```

Dependencies are always pinned exactly. Add them with `bun add --exact` or
`bun add --dev --exact`; `workspace:*` is reserved for internal packages.

## GitFlow

- `main` is the latest stable release.
- `dev` is the integration branch.
- Start `feature/*`, `bugfix/*` and `experimental/*` branches from `dev`.
- Start urgent `hotfix/*` branches from `main` and merge them back into both branches.
- Open ordinary pull requests against `dev`.
- Release Please and the NeoTamia GitFlow workflow manage release promotion.

## Quality commands

```bash
bun run format
bun run lint
bun run typecheck
bun run test:unit
bun run test:integration
bun run test:e2e
bun run build
```

Oxfmt and Oxlint are the only formatter and linter. Do not add Prettier or ESLint. TypeScript remains
strict; prefer `unknown` over `any`, validate every external boundary and keep environment access in
application configuration layers.

See [CODING_STANDARDS.md](CODING_STANDARDS.md) for code, runtime and dependency conventions.

## Monorepo boundaries

- Applications may depend on packages; packages never depend on applications.
- Shared contracts stay independent from Elysia, Nuxt and persistence.
- Database packages contain no HTTP logic.
- Frontend packages never import database code.
- Public package exports must not expose private file paths.

## Tests

- Unit tests cover isolated behavior and use `*.test.ts`.
- Integration tests cover PostgreSQL and HTTP boundaries and use `*.integration.test.ts`.
- E2E tests cover critical browser journeys and use `*.e2e.ts`.
- Tests are examples; extend them when requested by the derived project.
- Fixtures must not contain real credentials, addresses or tokens.

## Conventional Commits

Use `type(scope): imperative subject`. Accepted types are `feat`, `fix`, `docs`, `test`, `refactor`,
`perf`, `build`, `ci`, `chore` and `revert`. Mark incompatible changes with `!` and a
`BREAKING CHANGE:` footer.

## Pull requests

Keep a pull request focused and explain why the change is needed. Link its issue, document migrations
or compatibility impact, update relevant documentation and include the exact commands used to verify
the result. Never include generated output, caches, `.env` files or secrets.

Security vulnerabilities must follow [SECURITY.md](SECURITY.md) instead of the public issue tracker.
