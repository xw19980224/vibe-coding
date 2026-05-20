<script setup lang="ts">
import VibeHero from './modules/vibe-hero.vue';
import { usePagination, useRequest } from '@a02/alova/client';
import { VibeWorksApi } from '@/service/api/vibe-works';
import { useBoolean, useIntersectionObserver } from '@a02/hooks';
import { useAppStore } from '@/stores/modules/app';
import WorkCard from './modules/work-card.vue';

defineOptions({ name: 'HomePage' });

const appStore = useAppStore();

const isMobile = computed(() => appStore.isMobile);
const loadingRef = ref<HTMLElement>();
const { bool: sortDropdownVisible, toggle: toggleSortDropdown } = useBoolean(false);
const { bool: filterDropdownVisible, toggle: toggleFilterDropdown } = useBoolean(false);
const searchParams = reactive({
  category: undefined,
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
    return VibeWorksApi.getWorks({ ...searchParams, pageNumber: pageNum, pageSize: size });
  },
  {
    append: true,
    data: (res) => (res as Api.VibeCoding.VibeProjectPage).records,
    total: (res) => (res as Api.VibeCoding.VibeProjectPage).total,
    initialPageSize: isMobile.value ? 3 : 9,
  },
);

const sortOptions = [
  { id: 'recommended' as Api.VibeCoding.SortMode, label: '推荐' },
  { id: 'latest' as Api.VibeCoding.SortMode, label: '最新' },
  { id: 'popular' as Api.VibeCoding.SortMode, label: '最热' },
];

const categories = computed(() => [
  { value: undefined, label: '全部' },
  ...(categoriesRes.value?.map((c) => ({ value: c.id, label: c.name })) || []),
]);

const { data: categoriesRes } = useRequest(() => VibeWorksApi.getCategories(), {
  immediate: true,
});
function handleCategoryChange(category: string | undefined) {
  searchParams.category = category;
  reload();
}

const { observe, unobserve } = useIntersectionObserver(
  loadingRef,
  (isIntersecting) => {
    if (isIntersecting) {
      console.log('isLastPage', isLastPage.value);
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
        class="text-2xl md:text-3xl font-700 tracking-wider mb-2"
        style="font-family: Orbitron, sans-serif; color: #f1f5f9"
      >
        探索作品
      </h2>
      <p class="text-sm" style="color: #64748b; font-family: 'JetBrains Mono', monospace">
        {{
          searchParams.category === undefined
            ? '浏览全部创作'
            : '筛选分类: ' + categories.find((c) => c.value === searchParams.category)?.label
        }}
      </p>
    </div>

    <div class="flex items-center justify-between gap-4 py-5">
      <!-- Left: Categories -->
      <div class="flex-1 min-w-0">
        <ScrollTabs>
          <button
            v-for="cat in categories"
            :key="cat.value ?? 'all'"
            class="h-10 px-4 rounded-lg text-sm font-500 cursor-pointer transition-all duration-200 shrink-0"
            :style="{
              fontFamily:
                searchParams.category === cat.value
                  ? 'Orbitron, sans-serif'
                  : '\'JetBrains Mono\', monospace',
              color: searchParams.category === cat.value ? '#F97316' : '#94A3B8',
              background:
                searchParams.category === cat.value ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
              border:
                searchParams.category === cat.value
                  ? '1px solid rgba(249, 115, 22, 0.3)'
                  : '1px solid rgba(148, 163, 184, 0.08)',
            }"
            @click="handleCategoryChange(cat.value)"
          >
            {{ cat.label }}
          </button>
        </ScrollTabs>
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
            @click="toggleSortDropdown"
          >
            <SvgIcon icon="lucide:arrow-up-down" style="font-size: 13px" />
            {{ sortOptions.find((s) => s.id === searchParams.sort)?.label || '推荐' }}
          </button>
          <div
            v-if="sortDropdownVisible"
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
                color: searchParams.sort === opt.id ? '#F97316' : '#94A3B8',
                background:
                  searchParams.sort === opt.id ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
              }"
              @click="searchParams.sort = opt.id"
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
        <p class="text-sm" style="color: #64748b; font-family: 'JetBrains Mono', monospace">
          已加载全部作品
        </p>
      </div>
    </div>
  </section>
</template>
