import { createTestDatabase } from "@neotamia/monorepo-template-database/test-support";

export default async function globalSetup() {
  const database = await createTestDatabase();
  await database.client.end();
}
