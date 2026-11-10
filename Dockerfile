FROM oven/bun:1.4.0-slim@sha256:e0ee68d16ccb9927bf02aa7dd8fd4bf3369ee6d46da04faa72b05ce8bfd135f6 AS workspace
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/config/package.json ./packages/config/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/database/package.json ./packages/database/
COPY packages/test-utils/package.json ./packages/test-utils/
RUN bun install --frozen-lockfile --ignore-scripts
COPY . .
RUN bun --filter @neotamia/monorepo-template-contracts build

FROM oven/bun:1.4.0-slim@sha256:e0ee68d16ccb9927bf02aa7dd8fd4bf3369ee6d46da04faa72b05ce8bfd135f6 AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update \
    && apt-get install --yes --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

FROM workspace AS api-build
RUN bun --filter @neotamia/monorepo-template-api build

FROM runtime AS api
COPY --from=api-build --chown=bun:bun /app/apps/api/dist ./dist
COPY --from=api-build --chown=bun:bun /app/packages/database/migrations ./migrations
USER bun
EXPOSE 8080
CMD ["bun", "dist/index.js"]

FROM workspace AS web-build
WORKDIR /app/apps/web
RUN bun --bun run build

FROM runtime AS web
COPY --from=web-build --chown=bun:bun /app/apps/web/.output ./.output
USER bun
EXPOSE 3000
CMD ["bun", ".output/server/index.mjs"]
