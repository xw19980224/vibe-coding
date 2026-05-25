<script setup lang="ts">
defineOptions({ name: 'Steps' });

interface StepItem {
  value: number;
  label: string;
}

interface Props {
  steps: StepItem[];
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
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <div class="flex items-start py-2">
      <div v-for="(step, i) in steps" :key="i" class="flex-1 flex flex-col items-center relative">
        <!-- 连接线 -->
        <div
          v-if="i > 0"
          class="absolute top-4 -left-2/5 right-3/5 h-[2px]"
          :style="{
            background: step.value <= current ? '#f97316' : 'rgba(148, 163, 184, 0.15)',
          }"
        />

        <!-- 步骤圆 -->
        <div
          class="relative z-1 size-8 rounded-full flex-center text-2xs font-700 transition-all duration-300"
          :class="{
            'text-slate-900': stepState(step.value) === 'done',
            'text-[#f97316]': stepState(step.value) === 'active',
            'text-[#475569]': stepState(step.value) === 'pending',
          }"
          :style="{
            background:
              stepState(step.value) === 'done'
                ? '#f97316'
                : stepState(step.value) === 'active'
                  ? 'rgba(249, 115, 22, 0.12)'
                  : 'rgba(148, 163, 184, 0.06)',
            border:
              stepState(step.value) === 'active'
                ? '2px solid #f97316'
                : stepState(step.value) === 'done'
                  ? '2px solid #f97316'
                  : '2px solid rgba(148, 163, 184, 0.12)',
            fontFamily: 'JetBrains Mono, monospace',
          }"
        >
          <SvgIcon
            v-if="stepState(step.value) === 'done'"
            icon="lucide:check"
            style="font-size: 14px"
          />
          <span v-else>{{ step.value }}</span>
        </div>

        <!-- 标签 -->
        <span
          class="text-base mt-2 transition-colors duration-300"
          :style="{
            color: stepState(step.value) === 'pending' ? '#475569' : '#94a3b8',
            fontFamily: 'JetBrains Mono, monospace',
          }"
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
