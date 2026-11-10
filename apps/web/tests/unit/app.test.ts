import { describe, expect, test, vi } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import TodoWorkspace from "~/components/todos/TodoWorkspace.vue";

const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn(async () => []) }));
mockNuxtImport("$fetch", () => fetchMock);

describe("Todo workspace", () => {
  test("shows the empty state", async () => {
    const wrapper = await mountSuspended(TodoWorkspace);
    expect(wrapper.text()).toContain("Nothing waiting on you.");
    expect(wrapper.get("label").attributes("for")).toBe("todo-title");
  });
});
