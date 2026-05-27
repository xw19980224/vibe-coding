<script setup lang="ts">
defineOptions({ name: 'Steps' });

interface Props {
  steps: { value: number; label: string }[];
  current: number;
  prevLabel?: string;
  nextLabel?: string;
  confirmLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  prevLabel: '上一步',
  nextLabel: '下一步',
  confirmLabel: '确认',
});

const emit = defineEmits<{
  (e: 'prev'): void;
  (e: 'next'): void;
  (e: 'confirm'): void;
}>();

defineSlots<{
  default: (props: { index: number }) => VNode;
}>();

const isFirst = computed(() => props.current === 1);
const isLast = computed(() => props.current === props.steps.length);
const currentLabel = computed(() => props.steps.find((s) => s.value === props.current)?.label || '');

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
    <!-- Desktop: 全部步骤 -->
    <div class="hidden md:flex items-start py-2">
      <div v-for="(step, i) in steps" :key="i" class="flex-1 flex flex-col items-center relative">
        <div
          v-if="i > 0"
          class="absolute top-4 -left-2/5 right-3/5 h-2px"
          :class="step.value <= current ? 'bg-orange' : 'bg-slate-400/15'"
        />
        <div
          class="relative z-1 size-8 rounded-full flex-center text-2xs font-700 transition-all duration-300 border-2"
          :class="stepClass(step.value)"
        >
          <SvgIcon v-if="stepState(step.value) === 'done'" icon="lucide:check" class="text-base" />
          <span v-else>{{ step.value }}</span>
        </div>
        <span
          class="text-base mt-2 transition-colors duration-300"
          :class="stepState(step.value) === 'pending' ? 'text-slate-600' : 'text-slate-400'"
        >
          {{ step.label }}
        </span>
      </div>
    </div>

    <!-- Mobile: 仅当前步骤 -->
    <div class="flex md:hidden items-center gap-3 py-2">
      <div
        class="size-8 rounded-full flex-center text-2xs font-700 transition-all duration-300 border-2 shrink-0"
        :class="stepClass(current)"
      >
        <span>{{ current }}</span>
      </div>
      <span class="text-base text-slate-400 font-display">{{ currentLabel }}</span>
      <span class="text-xs text-slate-600 font-mono ml-auto">{{ current }}/{{ steps.length }}</span>
    </div>

    <div class="w-full">
      <slot :index="current" />
    </div>

    <!-- 导航按钮 -->
    <div class="flex gap-3 mt-6">
      <button
        v-if="!isFirst"
        class="flex-1 h-12 rounded-xl text-sm font-600 cursor-pointer transition-all duration-200 text-slate-400 border border-orange-500/15 bg-transparent"
        @click="emit('prev')"
      >
        {{ prevLabel }}
      </button>
      <button
        v-if="!isLast"
        class="flex-1 h-12 rounded-xl text-sm font-600 cursor-pointer transition-all duration-300 text-orange-400 border border-orange/25 bg-orange/10 backdrop-blur-sm hover:(bg-orange/20 border-orange/45)"
        @click="emit('next')"
      >
        {{ nextLabel }}
      </button>
      <button
        v-if="isLast"
        class="flex-1 h-12 rounded-xl text-sm font-600 cursor-pointer transition-all duration-200 btn-primary-gradient"
        @click="emit('confirm')"
      >
        {{ confirmLabel }}
      </button>
    </div>
  </div>
</template>
