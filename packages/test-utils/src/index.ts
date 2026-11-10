export function createTestId(prefix = "test") {
  return `${prefix}-${crypto.randomUUID()}`;
}
