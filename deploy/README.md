# Docker deployment

## Local stack

Run `docker compose up --build`. PostgreSQL starts first; the API applies pending migrations under a session advisory lock on a dedicated connection before listening, then the web service starts after API readiness succeeds.

Concurrent API starts wait up to 60 seconds for the migration lock. Failed migrations roll back and prevent API startup. Compose restarts the failed API. The API database role needs schema migration privileges; use a separate deployment role in derived projects that require stricter privilege separation.

## Production

1. Publish the API and web images with the OCI workflow. Pull requests build and scan without publishing. Publication requires successful format, lint, type and build checks.
2. Copy `deploy/production.env.example` to `deploy/production.env`, fill in both image digests, the registry and public origins.
3. Create `deploy/secrets/database_url` and `deploy/secrets/postgres_password` with restricted filesystem permissions. The database URL must use the `postgres` hostname, database `app`, user `app`, and the same password (URL-encoded in the URL).
4. Put an HTTPS reverse proxy on the Compose `edge` network, routing the frontend to `web:3000` and the API to `api:8080`. This Compose file intentionally publishes no host ports. Set the browser API URL and CORS origin to those public HTTPS origins.
5. Deploy from the repository root:

```sh
docker compose --env-file deploy/production.env -f compose.production.yaml pull
docker compose --env-file deploy/production.env -f compose.production.yaml up -d --wait --wait-timeout 180
docker compose --env-file deploy/production.env -f compose.production.yaml ps
docker compose --env-file deploy/production.env -f compose.production.yaml logs --tail=100 api
```

Keep `deploy/production.env` and `deploy/secrets/` outside version control. Health checks report readiness; JSON API logs include a server-generated request ID also returned in `x-request-id` and error responses. Only explicit operational fields are logged, not payloads or raw exception messages.

## Updates

Replace the image digests and repeat the deployment commands. Keep migrations backward compatible so the previous API image can still use the updated schema. An application rollback means restoring the previous image digests; it does not reverse database migrations. Never remove the PostgreSQL volume during an update.

## Template updates

Template Sync merges the selected shared files using a three-way merge. Application code and workflows are excluded. Review workflow changes from the source template manually; the generated project owns its CI permissions and delivery configuration. After a dependency sync, regenerate `bun.lock` with `bun install` and commit it with the manifests.
