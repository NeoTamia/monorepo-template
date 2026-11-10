<script setup lang="ts">
import { Check, LoaderCircle, Plus, RefreshCw, Trash2 } from "lucide-vue-next";
import type { Todo } from "@neotamia/monorepo-template-contracts";

const api = useTodosApi();
useHead({
  title: "Todo workspace",
  meta: [
    {
      name: "description",
      content: "A production-oriented Bun, Elysia and Nuxt monorepo starter.",
    },
  ],
});
const title = ref("");
const mutationError = ref("");
const pendingIds = ref(new Set<string>());
const {
  data: todos,
  error,
  refresh,
  status,
} = await useAsyncData("todos", api.list, {
  default: () => [],
});

const completedCount = computed(() => todos.value.filter((todo) => todo.completed).length);

async function createTodo() {
  const normalizedTitle = title.value.trim();
  if (!normalizedTitle) {
    mutationError.value = "Give the todo a short, concrete title.";
    return;
  }
  mutationError.value = "";
  try {
    const todo = await api.create({ title: normalizedTitle });
    todos.value = [todo, ...todos.value];
    title.value = "";
  } catch {
    mutationError.value = "The todo could not be created. Check the API and try again.";
  }
}

async function toggleTodo(todo: Todo) {
  pendingIds.value = new Set(pendingIds.value).add(todo.id);
  mutationError.value = "";
  try {
    const updated = await api.update(todo.id, { completed: !todo.completed });
    todos.value = todos.value.map((item) => (item.id === todo.id ? updated : item));
  } catch {
    mutationError.value = `“${todo.title}” could not be updated. Try again.`;
  } finally {
    const next = new Set(pendingIds.value);
    next.delete(todo.id);
    pendingIds.value = next;
  }
}

async function removeTodo(todo: Todo) {
  if (!window.confirm(`Delete “${todo.title}”?`)) return;
  pendingIds.value = new Set(pendingIds.value).add(todo.id);
  mutationError.value = "";
  try {
    await api.remove(todo.id);
    todos.value = todos.value.filter((item) => item.id !== todo.id);
  } catch {
    mutationError.value = `“${todo.title}” could not be deleted. Try again.`;
  } finally {
    const next = new Set(pendingIds.value);
    next.delete(todo.id);
    pendingIds.value = next;
  }
}
</script>

<template>
  <main class="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-12 sm:px-8 sm:py-20">
    <header class="mb-10 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
      <div>
        <p class="mb-2 text-sm font-medium text-slate-600">Monorepo starter</p>
        <h1
          class="max-w-xl text-balance text-4xl font-bold tracking-[-0.03em] text-slate-950 sm:text-5xl"
        >
          A small list, kept moving.
        </h1>
      </div>
      <p v-if="todos.length" class="text-sm tabular-nums text-slate-600" aria-live="polite">
        {{ completedCount }} of {{ todos.length }} done
      </p>
    </header>

    <form class="mb-8 flex flex-col gap-3 sm:flex-row" @submit.prevent="createTodo">
      <label for="todo-title" class="sr-only">Todo title</label>
      <UiInput
        id="todo-title"
        v-model="title"
        maxlength="200"
        placeholder="What needs doing?"
        aria-describedby="todo-help"
      />
      <UiButton type="submit" class="shrink-0">
        <Plus :size="17" aria-hidden="true" />
        Add todo
      </UiButton>
    </form>
    <p id="todo-help" class="sr-only">Titles can contain up to 200 characters.</p>

    <div
      v-if="mutationError"
      role="alert"
      class="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
    >
      {{ mutationError }}
    </div>

    <section aria-labelledby="todos-heading">
      <div class="mb-3 flex items-center justify-between border-b border-slate-200 pb-3">
        <h2 id="todos-heading" class="text-sm font-semibold text-slate-950">Current work</h2>
        <UiButton
          v-if="error"
          variant="ghost"
          size="icon"
          aria-label="Retry loading todos"
          @click="refresh"
        >
          <RefreshCw :size="17" aria-hidden="true" />
        </UiButton>
      </div>

      <div
        v-if="status === 'pending'"
        class="flex items-center gap-3 py-10 text-sm text-slate-600"
        role="status"
      >
        <LoaderCircle class="animate-spin" :size="18" aria-hidden="true" />
        Loading your list…
      </div>

      <div v-else-if="error" class="py-10">
        <p class="font-semibold text-slate-950">The list is out of reach.</p>
        <p class="mt-1 max-w-md text-sm leading-6 text-slate-600">
          Make sure the API and database are running, then use the retry button above.
        </p>
      </div>

      <div v-else-if="todos.length === 0" class="py-12 text-center">
        <div
          class="mx-auto mb-4 grid size-10 place-items-center rounded-full bg-slate-100 text-slate-700"
        >
          <Check :size="18" aria-hidden="true" />
        </div>
        <p class="font-semibold text-slate-950">Nothing waiting on you.</p>
        <p class="mt-1 text-sm text-slate-600">
          Add the first todo above to exercise the full stack.
        </p>
      </div>

      <ul v-else class="divide-y divide-slate-200" aria-label="Todos">
        <li
          v-for="todo in todos"
          :key="todo.id"
          class="group flex min-h-16 items-center gap-3 py-3"
        >
          <button
            type="button"
            class="grid size-6 shrink-0 place-items-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:opacity-50"
            :class="
              todo.completed
                ? 'border-slate-950 bg-slate-950 text-white'
                : 'border-slate-400 bg-white text-transparent hover:border-slate-700'
            "
            :aria-label="
              todo.completed ? `Mark ${todo.title} as incomplete` : `Mark ${todo.title} as complete`
            "
            :disabled="pendingIds.has(todo.id)"
            @click="toggleTodo(todo)"
          >
            <Check :size="15" aria-hidden="true" />
          </button>
          <span
            class="min-w-0 flex-1 break-words text-[0.95rem] leading-6"
            :class="
              todo.completed ? 'text-slate-500 line-through decoration-slate-400' : 'text-slate-900'
            "
          >
            {{ todo.title }}
          </span>
          <UiButton
            variant="danger"
            size="icon"
            class="opacity-70 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
            :aria-label="`Delete ${todo.title}`"
            :disabled="pendingIds.has(todo.id)"
            @click="removeTodo(todo)"
          >
            <Trash2 :size="17" aria-hidden="true" />
          </UiButton>
        </li>
      </ul>
    </section>

    <footer class="mt-auto pt-16 text-xs leading-5 text-slate-500">
      Shared TypeBox contracts · Elysia API · Nuxt SSR · PostgreSQL
    </footer>
  </main>
</template>
