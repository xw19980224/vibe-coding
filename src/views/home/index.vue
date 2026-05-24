<script setup lang="ts">
import VibeHero from './modules/vibe-hero.vue';
import { usePagination, useRequest } from '@a02/alova/client';
import { VibeWorksAPI } from '@/service/api/vibe-works';
import { useBoolean, useIntersectionObserver } from '@a02/hooks';
import { onClickOutside } from '@vueuse/core';
import { useAppStore } from '@/stores/modules/app';
import WorkCard from './modules/work-card.vue';

defineOptions({ name: 'HomePage' });

const appStore = useAppStore();

const isMobile = computed(() => appStore.isMobile);
const loadingRef = ref<HTMLElement>();
const sortDropdownRef = ref<HTMLElement>();
const {
  bool: sortDropdownVisible,
  toggle: toggleSortDropdown,
  setBool: setSortDropdownVisible,
} = useBoolean(false);
const { bool: filterDropdownVisible, toggle: toggleFilterDropdown } = useBoolean(false);
const searchParams = reactive({
  category: 'all',
  sort: 'recommended' as Api.VibeCoding.SortMode,
});

const {
  send: sendGetWorks,
  data,
  page,
  pageSize,
  isLastPage,
  loading,
  reload,
} = usePagination(
  (pageNum, size) => {
    return VibeWorksAPI.getWorks({ ...searchParams, pageNumber: pageNum, pageSize: size });
  },
  {
    append: true,
    data: (res) => (res as Api.VibeCoding.VibeProjectPage).records,
    total: (res) => (res as Api.VibeCoding.VibeProjectPage).total,
    initialPageSize: isMobile.value ? 3 : 9,
  },
);

const sortOptions = [
  { key: 'recommended' as Api.VibeCoding.SortMode, label: '推荐' },
  { key: 'latest' as Api.VibeCoding.SortMode, label: '最新' },
  { key: 'popular' as Api.VibeCoding.SortMode, label: '最热' },
];

const categories = computed(() => [
  { value: 'all', label: '全部' },
  ...(categoriesRes.value?.map((c) => ({ value: c.code, label: c.name })) || []),
]);

const { data: categoriesRes } = useRequest(() => VibeWorksAPI.getCategories(), {
  immediate: true,
});

function handleCategoryChange() {
  reload();
}

function handleSortChange(sort: Api.VibeCoding.SortMode) {
  searchParams.sort = sort;
  setSortDropdownVisible(false);
  reload();
}

const { observe, unobserve } = useIntersectionObserver(
  loadingRef,
  (isIntersecting) => {
    if (isIntersecting) {
      if (!isLastPage.value && !loading.value) {
        page.value++;
        sendGetWorks(page.value, pageSize.value);
      }
    }
  },
  {
    rootMargin: '100px',
  },
);

onMounted(() => {
  observe();
  onClickOutside(sortDropdownRef, () => {
    setSortDropdownVisible(false);
  });
});

onUnmounted(() => {
  unobserve();
});
</script>

<template>
  <!-- Hero Section -->
  <VibeHero />

  <!-- Works Section -->
  <section>
    <div class="pt-4 pb-2">
      <h2
        class="text-2xl md:text-3xl font-700 tracking-wider mb-2 text-slate-100"
        style="font-family: Orbitron, sans-serif"
      >
        探索作品
      </h2>
      <p class="text-sm text-slate-500" style="font-family: 'JetBrains Mono', monospace">
        {{
          searchParams.category === 'all'
            ? '浏览全部创作'
            : '筛选分类: ' + categories.find((c) => c.value === searchParams.category)?.label
        }}
      </p>
    </div>

    <div class="flex items-start justify-between gap-4 pt-5">
      <!-- Left: Categories -->
      <div class="flex-1 min-w-0">
        <ElTabs v-model="searchParams.category" @tabChange="handleCategoryChange">
          <ElTabPane
            v-for="(category, index) in categories"
            :key="index"
            :label="category.label"
            :name="category.value"
          />
        </ElTabs>
      </div>

      <!-- Right: Sort + Filter -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Sort dropdown -->
        <div class="relative" ref="sortDropdownRef">
          <button
            class="h-10 px-3 rounded-lg text-sm cursor-pointer transition-all duration-200 flex items-center gap-1.5"
            style="
              background: rgba(30, 41, 59, 0.6);
              border: 1px solid rgba(148, 163, 184, 0.12);
              color: #e2e8f0;
              font-family: 'JetBrains Mono', monospace;
            "
            @click="toggleSortDropdown"
          >
            <SvgIcon icon="lucide:arrow-up-down" style="font-size: 13px" />
            {{ sortOptions.find((s) => s.key === searchParams.sort)?.label || '推荐' }}
          </button>
          <div
            v-if="sortDropdownVisible"
            class="absolute right-0 top-11 rounded-lg p-1 z-20"
            style="
              background: rgba(30, 41, 59, 0.95);
              border: 1px solid rgba(249, 115, 22, 0.12);
              backdrop-filter: blur(12px);
            "
          >
            <button
              v-for="opt in sortOptions"
              :key="opt.key"
              class="w-full h-9 rounded-md text-sm cursor-pointer transition-all duration-150 px-3"
              :style="{
                fontFamily: '\'JetBrains Mono\', monospace',
                color: searchParams.sort === opt.key ? '#F97316' : '#94A3B8',
                background:
                  searchParams.sort === opt.key ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
              }"
              @click="handleSortChange(opt.key)"
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
          @click="toggleFilterDropdown"
        >
          <SvgIcon icon="lucide:sliders-horizontal" style="font-size: 13px" />
          筛选
        </button>
      </div>
    </div>

    <div class="full min-h-300px overflow-hidden">
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
      >
        <WorkCard :work="item" :key="item.id" :index="index" v-for="(item, index) in data" />
      </div>
      <div
        v-if="loading || (!isLastPage && data.length)"
        class="flex-center py-20"
        ref="loadingRef"
      >
        <div
          class="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
          style="border-top-color: #f97316"
        />
      </div>

      <div v-if="!loading && isLastPage" class="flex-center py-10">
        <p class="text-sm text-slate-500" style="font-family: 'JetBrains Mono', monospace">
          已加载全部作品
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
