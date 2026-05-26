<script setup lang="ts">
defineOptions({ name: 'Steps' });

interface Props {
  steps: {
    value: number;
    label: string;
  }[];
  current: number;
}

const props = defineProps<Props>();

defineSlots<{
  default: (props: { index: number }) => VNode;
}>();

function stepState(value: number) {
  if (value < props.current) return 'done';
  if (value === props.current) return 'active';
  return 'pending';
}

function stepClass(value: number) {
  const state = stepState(value);
  if (state === 'done') return 'text-slate-900 bg-orange border-orange';
  if (state === 'active') return 'text-orange bg-orange/10 border-orange';
  return 'text-slate-600 bg-slate-400/5 border-slate-400/10';
}
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <div class="flex items-start py-2">
      <div v-for="(step, i) in steps" :key="i" class="flex-1 flex flex-col items-center relative">
        <!-- 连接线 -->
        <div
          v-if="i > 0"
          class="absolute top-4 -left-2/5 right-3/5 h-2px"
          :class="step.value <= current ? 'bg-orange' : 'bg-slate-400/15'"
        />

        <!-- 步骤圆 -->
        <div
          class="relative z-1 size-8 rounded-full flex-center text-2xs font-700 transition-all duration-300 border-2"
          :class="stepClass(step.value)"
        >
          <SvgIcon v-if="stepState(step.value) === 'done'" icon="lucide:check" class="text-base" />
          <span v-else>{{ step.value }}</span>
        </div>

        <!-- 标签 -->
        <span
          class="text-base mt-2 transition-colors duration-300"
          :class="stepState(step.value) === 'pending' ? 'text-slate-600' : 'text-slate-400'"
        >
          {{ step.label }}
        </span>
      </div>
    </div>
    <div class="w-full">
      <slot :index="current" />
    </div>
  </div>
</template>
