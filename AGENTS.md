# Working in this repository

Before changing code or configuration, read [CODING_STANDARDS.md](CODING_STANDARDS.md).
For development setup and branch/release conventions, read [CONTRIBUTING.md](CONTRIBUTING.md).
For container or deployment changes, read [Docker deployment](deploy/README.md).

- Use Bun from the repository root; the root `package.json` defines the runtime version and commands.
- Keep changes scoped to the requested behavior. Extend the existing packages before adding infrastructure or dependencies.
- After code changes, run `bun run format:check`, `bun run lint`, `bun run typecheck` and `bun run build`. Report any checks that could not complete.
- Tests are examples for derived projects. Add or extend tests only when requested; do not introduce mandatory coverage gates for the template.
- When adding a workspace, update the Dockerfile's manifest copies before its frozen install.
- When changing shared tooling, update `.github/template-sync.yml` if the new file should reach derived projects. Workflows remain outside automatic sync.
