const value = process.env.TEST_DATABASE_URL;
if (!value) throw new Error("TEST_DATABASE_URL is required");

const testUrl = new URL(value);
const applicationUrl = process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL) : undefined;
if (!testUrl.pathname.toLowerCase().includes("test")) {
  throw new Error("TEST_DATABASE_URL must target a database whose name contains 'test'");
}
if (applicationUrl?.href === testUrl.href) {
  throw new Error("TEST_DATABASE_URL must differ from DATABASE_URL");
}
