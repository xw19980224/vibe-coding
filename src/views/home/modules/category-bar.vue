<script setup lang="ts">
import { useVibeStore } from '@/stores/modules/vibe';

defineOptions({ name: 'CategoryBar' });

const vibeStore = useVibeStore();

function selectCategory(id: string) {
  vibeStore.setCategory(id);
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-2 px-4 py-6">
    <button
      v-for="cat in vibeStore.categories"
      :key="cat.id"
      class="relative h-11 px-4 rounded-lg text-sm font-500 cursor-pointer transition-all duration-200"
      :style="{
        fontFamily: vibeStore.filters.category === cat.id ? 'Orbitron, sans-serif' : '\'JetBrains Mono\', monospace',
        color: vibeStore.filters.category === cat.id ? '#F97316' : '#94A3B8',
        background: vibeStore.filters.category === cat.id
          ? 'rgba(249, 115, 22, 0.1)'
          : 'transparent',
        border: vibeStore.filters.category === cat.id
          ? '1px solid rgba(249, 115, 22, 0.3)'
          : '1px solid rgba(148, 163, 184, 0.1)',
      }"
      @click="selectCategory(cat.id)"
    >
      {{ cat.name }}
    </button>
  </div>
</template>
