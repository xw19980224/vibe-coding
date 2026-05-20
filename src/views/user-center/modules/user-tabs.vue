<script setup lang="ts">
defineOptions({ name: 'UserTabs' });

interface Props {
  tabs: {
    id: string;
    label: string;
    count?: number;
  }[];
}

const props = withDefaults(defineProps<Props>(), {
  tabs: () => [],
});

const activeTab = defineModel<string>('activeTab', { required: true });
</script>

<template>
  <div class="flex gap-0 mb-8" style="border-bottom: 1px solid rgba(148, 163, 184, 0.08)">
    <button
      v-for="tab in props.tabs"
      :key="tab.id"
      class="relative h-11 px-6 text-sm font-500 cursor-pointer transition-all duration-200 flex items-center gap-2"
      :style="{
        color: activeTab === tab.id ? '#f1f5f9' : '#64748B',
        fontFamily: 'JetBrains Mono, monospace',
      }"
      @click="activeTab = tab.id"
    >
      {{ tab.label }}
      <span
        v-if="tab.count !== undefined"
        class="text-xs"
        :style="{ color: activeTab === tab.id ? '#F97316' : '#475569' }"
      >
        {{ tab.count }}
      </span>
      <div
        v-if="activeTab === tab.id"
        class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 rounded-full"
        style="height: 2px; background: #f97316"
      />
    </button>
  </div>
</template>
