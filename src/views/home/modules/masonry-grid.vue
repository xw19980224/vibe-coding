<script setup lang="ts">
import VibeCodingWaterfall from '@/components/custom/vibe-coding-waterfall.vue';
import { vibeWorksApi } from '@/service/api/vibe-works';
import { useVibeStore } from '@/stores/modules/vibe';
import { usePagination } from '@a02/alova/client';
import WorkCard from './work-card.vue';

defineOptions({ name: 'MasonryGrid' });

const vibeStore = useVibeStore();

const { data, page, isLastPage, fetching, reload } = usePagination(
  (p, ps) => {
    const { category, sort, search } = vibeStore.filters;
    return vibeWorksApi.getWorks({ current: p, size: ps, category, sort, search });
  },
  {
    append: true,
    data: (res) => (res as Api.VibeCoding.VibeProjectPage).records,
    total: (res) => (res as Api.VibeCoding.VibeProjectPage).total,
  },
);

function loadMore() {
  if (!isLastPage.value && !fetching.value) {
    page.value++;
  }
}

watch(
  () => vibeStore.filters,
  () => reload(),
  { deep: true },
);
</script>

<template>
  <VibeCodingWaterfall
    :gap="16"
    :column="3"
    :items="data"
    :loading="fetching && data.length > 0"
    :has-more="!isLastPage"
    class="w-full min-h-500px"
    @load-more="loadMore"
  >
    <template #default="{ item, index }">
      <WorkCard :work="item" :key="item.id" :index="index" />
    </template>
  </VibeCodingWaterfall>

  <div v-if="fetching && !data.length" class="flex items-center justify-center py-20">
    <div
      class="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
      style="border-top-color: #f97316"
    />
  </div>
</template>
