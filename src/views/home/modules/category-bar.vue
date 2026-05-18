<script setup lang="ts">
import { useVibeStore } from '@/stores/modules/vibe';
import SvgIcon from '@/components/custom/svg-icon.vue';

defineOptions({ name: 'CategoryBar' });

const vibeStore = useVibeStore();

const sortOptions = [
  { id: 'recommended' as Api.VibeCoding.SortMode, label: '推荐' },
  { id: 'latest' as Api.VibeCoding.SortMode, label: '最新' },
  { id: 'popular' as Api.VibeCoding.SortMode, label: '最热' },
];

const sortDropdownOpen = ref(false);
const filterDropdownOpen = ref(false);
const categoriesEl = ref<HTMLElement>();
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

function selectCategory(id: string) {
  vibeStore.setCategory(id);
}

function selectSort(sort: Api.VibeCoding.SortMode) {
  vibeStore.setSort(sort);
  sortDropdownOpen.value = false;
}

function updateArrows() {
  const el = categoriesEl.value;
  if (!el) return;
  canScrollLeft.value = el.scrollLeft > 1;
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
}

function scrollLeft() {
  if (categoriesEl.value) {
    categoriesEl.value.scrollBy({ left: -200, behavior: 'smooth' });
  }
}

function scrollRight() {
  if (categoriesEl.value) {
    categoriesEl.value.scrollBy({ left: 200, behavior: 'smooth' });
  }
}

onMounted(() => {
  updateArrows();
  categoriesEl.value?.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);
});

onBeforeUnmount(() => {
  categoriesEl.value?.removeEventListener('scroll', updateArrows);
  window.removeEventListener('resize', updateArrows);
});
</script>

<template>
  <div class="flex items-center justify-between gap-4 py-5">
    <!-- Left: Categories -->
    <div class="flex items-center gap-1 min-w-0 flex-1">
      <button
        v-if="canScrollLeft"
        class="h-10 w-8 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center shrink-0"
        style="
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(249, 115, 22, 0.1);
          color: #f97316;
        "
        @click="scrollLeft"
      >
        <SvgIcon icon="lucide:chevron-left" style="font-size: 16px" />
      </button>
      <div
        ref="categoriesEl"
        class="flex items-center gap-2 overflow-hidden"
        @scroll="updateArrows"
      >
        <button
          v-for="cat in vibeStore.categories"
          :key="cat.id"
          class="h-10 px-4 rounded-lg text-sm font-500 cursor-pointer transition-all duration-200 shrink-0"
          :style="{
            fontFamily:
              vibeStore.filters.category === cat.id
                ? 'Orbitron, sans-serif'
                : '\'JetBrains Mono\', monospace',
            color:
              vibeStore.filters.category === cat.id ? '#F97316' : '#94A3B8',
            background:
              vibeStore.filters.category === cat.id
                ? 'rgba(249, 115, 22, 0.1)'
                : 'transparent',
            border:
              vibeStore.filters.category === cat.id
                ? '1px solid rgba(249, 115, 22, 0.3)'
                : '1px solid rgba(148, 163, 184, 0.08)',
          }"
          @click="selectCategory(cat.id)"
        >
          {{ cat.name }}
        </button>
      </div>
      <button
        v-if="canScrollRight"
        class="h-10 w-8 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center shrink-0"
        style="
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(249, 115, 22, 0.1);
          color: #f97316;
        "
        @click="scrollRight"
      >
        <SvgIcon icon="lucide:chevron-right" style="font-size: 16px" />
      </button>
    </div>

    <!-- Right: Sort + Filter -->
    <div class="flex items-center gap-2 shrink-0">
      <!-- Sort dropdown -->
      <div class="relative">
        <button
          class="h-10 px-3 rounded-lg text-sm cursor-pointer transition-all duration-200 flex items-center gap-1.5"
          style="
            background: rgba(30, 41, 59, 0.6);
            border: 1px solid rgba(148, 163, 184, 0.12);
            color: #e2e8f0;
            font-family: 'JetBrains Mono', monospace;
          "
          @click="sortDropdownOpen = !sortDropdownOpen"
        >
          <SvgIcon icon="lucide:arrow-up-down" style="font-size: 13px" />
          {{ sortOptions.find((s) => s.id === vibeStore.filters.sort)?.label || '推荐' }}
        </button>
        <div
          v-if="sortDropdownOpen"
          class="absolute right-0 top-11 w-28 rounded-lg p-1 z-20"
          style="
            background: rgba(30, 41, 59, 0.95);
            border: 1px solid rgba(249, 115, 22, 0.12);
            backdrop-filter: blur(12px);
          "
        >
          <button
            v-for="opt in sortOptions"
            :key="opt.id"
            class="w-full h-9 rounded-md text-sm cursor-pointer transition-all duration-150 text-left px-3"
            :style="{
              fontFamily: '\'JetBrains Mono\', monospace',
              color:
                vibeStore.filters.sort === opt.id ? '#F97316' : '#94A3B8',
              background:
                vibeStore.filters.sort === opt.id
                  ? 'rgba(249, 115, 22, 0.1)'
                  : 'transparent',
            }"
            @click="selectSort(opt.id)"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- Filter button -->
      <button
        class="h-10 px-3 rounded-lg text-sm cursor-pointer transition-all duration-200 flex items-center gap-1.5"
        style="
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.12);
          color: #e2e8f0;
          font-family: 'JetBrains Mono', monospace;
        "
        @click="filterDropdownOpen = !filterDropdownOpen"
      >
        <SvgIcon icon="lucide:sliders-horizontal" style="font-size: 13px" />
        筛选
      </button>
    </div>
  </div>
</template>
