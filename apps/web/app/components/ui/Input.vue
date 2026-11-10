<script setup lang="ts">
import type { HTMLAttributes, InputHTMLAttributes } from "vue";
import { cn } from "~/lib/utils";

interface Props {
  class?: HTMLAttributes["class"];
  disabled?: boolean;
  id?: string;
  maxlength?: InputHTMLAttributes["maxlength"];
  placeholder?: string;
  required?: boolean;
  type?: string;
}

const props = withDefaults(defineProps<Props>(), { type: "text" });
const model = defineModel<string>({ default: "" });
</script>

<template>
  <input
    :id="props.id"
    v-model="model"
    :class="
      cn(
        'h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-base text-slate-950 outline-none transition-[border-color,box-shadow] placeholder:text-slate-500 focus:border-slate-700 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500',
        props.class,
      )
    "
    :disabled="props.disabled"
    :maxlength="props.maxlength"
    :placeholder="props.placeholder"
    :required="props.required"
    :type="props.type"
  />
</template>
