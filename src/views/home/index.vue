<script setup lang="ts">
import VibeHero from './modules/vibe-hero.vue';
import { usePagination, useRequest } from '@a02/alova/client';
import { VibeCodingAPI } from '@/service/api/vibecoding.ts';
import { useBoolean, useIntersectionObserver } from '@a02/hooks';
import { onClickOutside } from '@vueuse/core';
import { useAppStore } from '@/stores/modules/app';
import WorkCard from './modules/work-card.vue';
import { CategoryAPI } from '@/service/api/category.ts';

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
const searchParams = reactive({
  category: 'all',
  featured: false,
  field: 'create_time',
  order: 'DESC' as Api.Common.SortType,
});

const {
  send: sendGetVibeCoding,
  data,
  page,
  pageSize,
  isLastPage,
  loading,
  reload,
} = usePagination(
  (pageNum, size) => {
    const params = {
      ...searchParams,
      pageNumber: pageNum,
      pageSize: size,
    };
    if (params.category === 'all') {
      delete params.category;
    }
    return VibeCodingAPI.findVibeCodingPage(params as Api.VibeCoding.VibeCodingSearchParams);
  },
  {
    append: true,
    data: (res) => (res as Api.VibeCoding.VibeCodingPage).records,
    total: (res) => (res as Api.VibeCoding.VibeCodingPage).total,
    initialPageSize: isMobile.value ? 3 : 9,
  },
);

const sortOptions = [
  { key: 'createTime', label: '最新' },
  { key: 'views', label: '最热' },
];

const categories = computed(() => [
  { value: 'all', label: '全部' },
  ...(categoriesRes.value?.map((c) => ({ value: c.code, label: c.name })) || []),
]);

const { data: categoriesRes } = useRequest(() => CategoryAPI.getCategories(), {
  immediate: true,
});

function handleCategoryChange() {
  reload();
}

function handleSortChange(sort: string) {
  searchParams.field = sort;
  setSortDropdownVisible(false);
  reload();
}

const { observe, unobserve } = useIntersectionObserver(
  loadingRef,
  (isIntersecting) => {
    if (isIntersecting) {
      if (!isLastPage.value && !loading.value) {
        page.value++;
        sendGetVibeCoding(page.value, pageSize.value);
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
      <h2 class="text-2xl md:text-3xl font-700 tracking-wider mb-2 text-slate-100 font-display">
        探索作品
      </h2>
      <p class="text-sm text-slate-500 font-mono">
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
            class="h-10 px-3 rounded-lg text-sm cursor-pointer transition-all duration-200 flex items-center gap-1.5 font-mono text-slate-200 bg-slate-800/60 border border-slate-400/12"
            @click="toggleSortDropdown"
          >
            <SvgIcon icon="lucide:arrow-up-down" class="text-sm" />
            {{ sortOptions.find((s) => s.key === searchParams.order)?.label || '最新' }}
          </button>
          <div
            v-if="sortDropdownVisible"
            class="absolute right-0 top-11 rounded-lg p-1 z-20 bg-slate-800/95 border border-orange-500/12 backdrop-blur-sm"
          >
            <button
              v-for="opt in sortOptions"
              :key="opt.key"
              class="w-full h-9 rounded-md text-sm cursor-pointer transition-all duration-150 px-3 font-mono"
              :class="searchParams.order === opt.key ? 'text-orange bg-orange/1' : 'text-slate-400'"
              @click="handleSortChange(opt.key)"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Filter button -->
        <button
          v-if="false"
          class="h-10 px-3 rounded-lg text-sm cursor-pointer transition-all duration-200 flex items-center gap-1.5 font-mono text-slate-200 bg-slate-800/60 border border-slate-400/12"
        >
          <SvgIcon icon="lucide:sliders-horizontal" class="text-sm" />
          筛选
        </button>
      </div>
    </div>

    <div class="full min-h-300px overflow-hidden">
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 py-2"
      >
        <WorkCard :vibe-coding="item" :key="item.id" :index="index" v-for="(item, index) in data" />
      </div>
      <div
        v-if="loading || (!isLastPage && data.length)"
        class="flex-center py-20"
        ref="loadingRef"
      >
        <div
          class="w-10 h-10 rounded-full border-2 border-transparent animate-spin border-t-orange-500"
        />
      </div>

      <div v-if="!loading && isLastPage" class="flex-center py-10">
        <p class="text-sm text-slate-500 font-mono">已加载全部作品</p>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
