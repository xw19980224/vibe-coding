<script setup lang="ts">
import VibeHero from './modules/vibe-hero.vue';
import CategoryBar from './modules/category-bar.vue';
import MasonryGrid from './modules/masonry-grid.vue';
import { useVibeStore } from '@/stores/modules/vibe';

defineOptions({ name: 'HomePage' });

const vibeStore = useVibeStore();
</script>

<template>
  <!-- Hero Section -->
  <VibeHero />

  <!-- Works Section -->
  <section>
    <div class="max-w-7xl mx-auto">
      <div class="text-center px-4 pt-4 pb-2">
        <h2
          class="text-2xl md:text-3xl font-700 tracking-wider mb-2"
          style="font-family: Orbitron, sans-serif; color: #F1F5F9"
        >
          探索作品
        </h2>
        <p
          class="text-sm"
          style="color: #64748B; font-family: 'JetBrains Mono', monospace"
        >
          {{
            vibeStore.filters.category === 'all'
              ? '浏览全部创作'
              : '筛选分类: ' + vibeStore.categories.find((c) => c.id === vibeStore.filters.category)?.name
          }}
        </p>
      </div>

      <CategoryBar />
      <MasonryGrid />
    </div>
  </section>
</template>
