<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";

interface Props extends PrimitiveProps {
  class?: HTMLAttributes["class"];
  variant?: "default" | "ghost" | "danger";
  size?: "default" | "icon";
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
  variant: "default",
  size: "default",
});

const classes = computed(() =>
  cn(
    "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    props.size === "icon" ? "size-9" : "h-10 px-4",
    props.variant === "default" && "bg-slate-950 text-white hover:bg-slate-800",
    props.variant === "ghost" && "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
    props.variant === "danger" && "text-red-700 hover:bg-red-50",
    props.class,
  ),
);
</script>

<template>
  <Primitive :as="as" :as-child="asChild" :class="classes">
    <slot />
  </Primitive>
</template>
