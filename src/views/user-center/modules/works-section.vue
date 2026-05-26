<script setup lang="ts">
import { UserAPI } from '@/service/api/user';
import { usePagination } from '@a02/alova/client';
import { useAppStore } from '@/stores/modules/app';
import { useBoolean, useIntersectionObserver } from '@a02/hooks';
import WorkCard from './work-card.vue';
import { onClickOutside } from '@vueuse/core';

defineOptions({ name: 'WorksSection' });

interface Props {
  nickname: string;
  isSelf: boolean;
}

const props = defineProps<Props>();

const appStore = useAppStore();
const isMobile = computed(() => appStore.isMobile);
const filterRef = ref<HTMLElement>();

const searchParams = reactive({
  keyword: '',
  status: undefined as number | undefined,
  category: undefined as string | undefined,
  sort: 'latest' as string,
});

const {
  bool: filterVisible,
  setTrue: openFilterModel,
  setFalse: closeFilterModel,
} = useBoolean(false);

const statusLabels: Record<number, string> = {
  1: '草稿',
  2: '待审核',
  3: '审核中',
  4: '通过',
  5: '驳回',
  6: '待调整',
  7: '已发布',
  8: '下架',
  9: '删除',
  10: '封禁',
};

const statusOptions = computed(() => [
  { value: undefined, label: '全部状态' },
  ...Object.entries(statusLabels).map(([value, label]) => ({
    value: Number(value),
    label,
  })),
]);

const categoryOptions = [
  { value: undefined, label: '全部分类' },
  { value: 'web', label: 'Web 应用' },
  { value: 'mobile', label: '移动端' },
  { value: 'ai', label: 'AI 创作' },
  { value: 'game', label: '游戏' },
  { value: 'tool', label: '开发工具' },
  { value: 'art', label: '视觉艺术' },
];

const sortOptions = [
  { value: 'latest', label: '最新发布' },
  { value: 'popular', label: '最多喜欢' },
  { value: 'views', label: '最多浏览' },
];

const loadingRef = ref<HTMLElement>();

const {
  send: sendGetUserWorks,
  data: works,
  page,
  pageSize,
  isLastPage,
  loading,
  reload,
} = usePagination(
  (p, ps) =>
    UserAPI.getUserWorks({
      pageNumber: p,
      pageSize: ps,
      ...searchParams,
    }),
  {
    append: true,
    data: ({ records }) => records,
    initialPageSize: isMobile.value ? 3 : 9,
    immediate: false,
  },
);

const { observe, unobserve } = useIntersectionObserver(loadingRef, (isIntersecting) => {
  if (isIntersecting) {
    if (!isLastPage.value && !loading.value) {
      page.value++;
      sendGetUserWorks(page.value, pageSize.value);
    }
  }
});

function handleSearch() {
  sendGetUserWorks(1, pageSize);
}

watch(
  () => props.nickname,
  () => {
    reload();
  },
);

onMounted(() => {
  observe();
  sendGetUserWorks();
  onClickOutside(filterRef, () => {
    closeFilterModel();
  });
});

onUnmounted(() => {
  unobserve();
});

watch(
  searchParams,
  () => {
    handleSearch();
  },
  {
    deep: true,
  },
);
</script>

<template>
  <div>
    <!-- 作品筛选 -->
    <div class="mb-4 flex items-center justify-between gap-4">
      <ElInput
        v-model="searchParams.keyword"
        placeholder="搜索作品名称、描述..."
        class="w-86"
        @keyup.enter="sendGetUserWorks"
      >
        <template #prefix>
          <SvgIcon icon="lucide:search" class="text-slate-500 text-base" />
        </template>
        <template #suffix>
          <ElButton size="small" link circle @click="handleSearch">
            <template #icon>
              <div class="group border-1 border-primary rd-full p-1 hover:(bg-orange-400)">
                <SvgIcon
                  icon="lucide:arrow-right"
                  class="text-slate-500 text-base group-hover:(text-slate-200)"
                />
              </div>
            </template>
          </ElButton>
        </template>
      </ElInput>

      <!-- Right: Filter -->
      <div class="relative shrink-0" ref="filterRef">
        <button
          class="h-10 px-4 rounded-lg text-xs font-500 cursor-pointer transition-all duration-200 flex items-center gap-1.5 text-slate-400 font-mono bg-slate-800/50 border border-orange-500/10"
          @click="openFilterModel"
        >
          <SvgIcon icon="lucide:sliders-horizontal" class="text-base" />
          筛选
        </button>
        <Transition name="menu">
          <div
            v-if="filterVisible"
            class="absolute right-0 top-11 w-72 sm:w-84 md:w-100 rounded-xl overflow-hidden z-20 p-3 space-y-4 bg-slate-800/98 border border-slate-400/12"
            style="box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4)"
          >
            <div v-if="props.isSelf">
              <p class="text-xs mb-2 text-slate-500 font-mono">状态</p>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="opt in statusOptions"
                  :key="opt.value"
                  class="h-7 px-2.5 rounded-md text-xs cursor-pointer transition-all duration-150 font-mono"
                  :class="
                    searchParams.status === opt.value
                      ? 'text-orange bg-orange/12'
                      : 'text-slate-400 bg-slate-400/6'
                  "
                  @click="searchParams.status = opt.value"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>
            <div>
              <p class="text-xs mb-2 text-slate-500 font-mono">分类</p>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="opt in categoryOptions"
                  :key="opt.value"
                  class="h-7 px-2.5 rounded-md text-xs cursor-pointer transition-all duration-150 font-mono"
                  :class="
                    searchParams.category === opt.value
                      ? 'text-orange bg-orange/12'
                      : 'text-slate-400 bg-slate-400/6'
                  "
                  @click="searchParams.category = opt.value"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>
            <div>
              <p class="text-xs mb-2 text-slate-500 font-mono">排序</p>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="opt in sortOptions"
                  :key="opt.value"
                  class="h-7 px-2.5 rounded-md text-xs cursor-pointer transition-all duration-150 font-mono"
                  :class="
                    searchParams.sort === opt.value
                      ? 'text-orange bg-orange/12'
                      : 'text-slate-400 bg-slate-400/6'
                  "
                  @click="searchParams.sort = opt.value"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Empty -->
    <div v-if="!works.length" class="flex flex-col items-center py-16">
      <div class="text-5xl mb-4" style="opacity: 0.15">(´･_･`)</div>
      <p class="text-sm mb-4 text-slate-400 font-mono">还没有发布作品</p>
      <button
        v-if="props.isSelf"
        class="h-10 px-6 rounded-xl text-sm font-600 cursor-pointer transition-all duration-200 btn-primary-gradient"
        @click="$router.push('/publish')"
      >
        发布你的第一个作品
      </button>
    </div>

    <!-- Works Grid -->
    <template v-else>
      <div class="w-full min-h-300px overflow-hidden">
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 py-2"
        >
          <WorkCard v-for="work in works" :key="work.id" :work="work" :is-self="props.isSelf" />
        </div>
        <div
          v-if="loading || (!isLastPage && works.length)"
          class="flex-center py-8"
          ref="loadingRef"
        >
          <div
            class="w-6 h-6 rounded-full border-2 border-transparent animate-spin border-t-orange-500"
          />
        </div>
        <div v-if="!loading && isLastPage" class="flex-center py-10">
          <p class="text-sm text-slate-500 font-mono">已加载全部作品</p>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: all 0.15s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
