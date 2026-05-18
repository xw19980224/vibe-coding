<script setup lang="ts">
import VibeHero from './modules/vibe-hero.vue';
import CategoryBar from './modules/category-bar.vue';
import MasonryGrid from './modules/masonry-grid.vue';
import { useVibeStore } from '@/stores/modules/vibe';

defineOptions({ name: 'HomePage' });

const vibeStore = useVibeStore();

onMounted(() => {
  vibeStore.fetchCategories();
});
</script>

<template>
  <!-- Hero Section -->
  <VibeHero />

  <!-- Works Section -->
  <section>
    <div class="pt-4 pb-2">
      <h2
        class="text-2xl md:text-3xl font-700 tracking-wider mb-2"
        style="font-family: Orbitron, sans-serif; color: #f1f5f9"
      >
        探索作品
      </h2>
      <p class="text-sm" style="color: #64748b; font-family: 'JetBrains Mono', monospace">
        {{
          vibeStore.filters.category === 'all'
            ? '浏览全部创作'
            : '筛选分类: ' +
              vibeStore.categories.find((c) => c.id === vibeStore.filters.category)?.name
        }}
      </p>
    </div>

    <CategoryBar />
    <MasonryGrid />
  </section>
</template>
