<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useVibeStore } from '@/stores/modules/vibe';
import WorkCard from './work-card.vue';

defineOptions({ name: 'MasonryGrid' });

const vibeStore = useVibeStore();
const router = useRouter();

function handleCardClick(work: VibeCoding.VibeWork) {
  router.push(`/work/${work.id}`);
}

function handleLike(workId: string) {
  vibeStore.toggleLike(workId);
}
</script>

<template>
  <!-- Loading state -->
  <div v-if="vibeStore.loading" class="flex items-center justify-center py-20">
    <div class="flex flex-col items-center gap-4">
      <div
        class="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
        style="border-top-color: #F97316"
      />
      <span
        class="text-sm"
        style="color: #64748B; font-family: 'JetBrains Mono', monospace"
      >
        LOADING...
      </span>
    </div>
  </div>

  <!-- Empty state -->
  <div
    v-else-if="!vibeStore.filteredWorks.length"
    class="flex flex-col items-center justify-center py-20"
  >
    <div class="text-6xl mb-4" style="opacity: 0.2">(╯°□°)╯</div>
    <p
      class="text-base mb-2"
      style="color: #94A3B8; font-family: 'JetBrains Mono', monospace"
    >
      没有找到匹配的作品
    </p>
    <p class="text-sm" style="color: #64748B">
      试试更换筛选条件或搜索关键词
    </p>
  </div>

  <!-- Masonry grid (CSS columns fallback) -->
  <div
    v-else
    class="px-4 md:px-8 pb-12 sm:columns-2 lg:columns-3 xl:columns-4"
    style="
      columns: 1;
      column-gap: 16px;
    "
  >
    <div
      v-for="(work, index) in vibeStore.filteredWorks"
      :key="work.id"
      class="mb-4 break-inside-avoid"
    >
      <WorkCard
        :work="work"
        :index="index"
        @click="handleCardClick"
        @like="handleLike"
      />
    </div>
  </div>
</template>
