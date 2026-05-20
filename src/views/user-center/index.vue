<script setup lang="ts">
import { UserApi } from '@/service/api/user';
import ProfileHeader from './modules/profile-header.vue';
import UserTabs from './modules/user-tabs.vue';
import UserOperationDialog from './modules/user-operation-dialog.vue';
import { useAuthStore } from '@/stores/modules/auth';
import { usePagination, useRequest } from '@a02/alova/client';
import { useAppStore } from '@/stores/modules/app';
import { useRouter } from 'vue-router';
import WorkCard from './modules/work-card.vue';
import { useBoolean, useIntersectionObserver } from '@a02/hooks';

defineOptions({ name: 'UserCenterPage' });

const authStore = useAuthStore();
const appStore = useAppStore();
const router = useRouter();
const isMobile = computed(() => appStore.isMobile);

const loadingRef = ref<HTMLElement>();
const { bool: editDialogVisible, setTrue: openEditDialog } = useBoolean(false);
const activeTab = ref('works');
const searchParams = reactive({
  status: undefined,
});

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
  { value: undefined, label: '全部' },
  ...Object.entries(statusLabels).map(([value, label]) => ({
    value: Number(value),
    label,
  })),
]);

const stats = computed(() => [
  { label: '作品', value: statsRes.value?.works ?? 0 },
  { label: '获赞', value: statsRes.value?.likes ?? 0 },
  { label: '关注', value: statsRes.value?.following ?? 0 },
  { label: '粉丝', value: statsRes.value?.followers ?? 0 },
]);

const tabs = computed(() => [
  { id: 'works', label: '作品', count: statsRes.value?.works ?? 0 },
  { id: 'likes', label: '收藏', count: statsRes.value?.collections ?? 0 },
]);

const { observe, unobserve } = useIntersectionObserver(loadingRef, (isIntersecting) => {
  if (isIntersecting) {
    if (!isLastPage.value && !loading.value) {
      page.value++;
      sendGetUserWorks(page.value, pageSize.value);
    }
  }
});

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
    UserApi.getUserWorks({
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

const { data: statsRes } = useRequest(() => UserApi.getStats(), {
  immediate: true,
});

function handleStatusChange(status: Api.VibeCoding.VibeProject['status'] | 'all') {
  searchParams.status = status;
  reload();
}

onMounted(() => {
  observe();
  if (activeTab.value === 'works') {
    sendGetUserWorks();
  }
});

onUnmounted(() => {
  unobserve();
});
</script>

<template>
  <div class="pt-24 pb-12">
    <ProfileHeader
      :user-info="authStore.userInfo"
      :stats="stats"
      @edit-user-profile="openEditDialog"
    />

    <UserTabs v-model:active-tab="activeTab" :tabs="tabs" />

    <template v-if="activeTab === 'works'">
      <div class="mb-4">
        <ScrollTabs height="h-8">
          <button
            v-for="opt in statusOptions"
            :key="opt.value"
            class="h-8 px-4 rounded-lg text-xs font-500 cursor-pointer transition-all duration-200 shrink-0"
            :style="{
              background:
                searchParams.status === opt.value
                  ? 'rgba(249, 115, 22, 0.15)'
                  : 'rgba(148, 163, 184, 0.06)',
              color: searchParams.status === opt.value ? '#f97316' : '#94a3b8',
              border: `1px solid ${searchParams.status === opt.value ? 'rgba(249, 115, 22, 0.25)' : 'rgba(148, 163, 184, 0.08)'}`,
              fontFamily: 'JetBrains Mono, monospace',
            }"
            @click="handleStatusChange(opt.value)"
          >
            {{ opt.label }}
          </button>
        </ScrollTabs>
      </div>
      <div v-if="!works.length" class="flex flex-col items-center py-16">
        <div class="text-5xl mb-4" style="opacity: 0.15">(´･_･`)</div>
        <p class="text-sm mb-4" style="color: #94a3b8; font-family: 'JetBrains Mono', monospace">
          还没有发布作品
        </p>
        <button
          class="h-10 px-6 rounded-xl text-sm font-600 cursor-pointer transition-all duration-200"
          style="background: linear-gradient(135deg, #f97316, #fb923c); color: #fff"
          @click="router.push('/publish')"
        >
          发布你的第一个作品
        </button>
      </div>
      <template v-else>
        <div class="w-full min-h-300px overflow-hidden">
          <div v-for="work in works" class="mb-4" :key="work.id">
            <WorkCard :work="work" />
          </div>
          <div
            v-if="loading || (!isLastPage && works.length)"
            class="flex-center py-8"
            ref="loadingRef"
          >
            <div
              class="w-6 h-6 rounded-full border-2 border-transparent animate-spin"
              style="border-top-color: #f97316"
            />
          </div>
          <div v-if="!loading && isLastPage" class="flex-center py-10">
            <p class="text-sm" style="color: #64748b; font-family: 'JetBrains Mono', monospace">
              已加载全部作品
            </p>
          </div>
        </div>
      </template>
    </template>

    <template v-if="activeTab === 'likes'">
      <div class="flex flex-col items-center py-16">
        <div class="text-4xl mb-3" style="opacity: 0.1">☆</div>
        <p class="text-sm" style="color: #64748b; font-family: 'JetBrains Mono', monospace">
          暂无收藏的作品
        </p>
      </div>
    </template>

    <UserOperationDialog v-model:visible="editDialogVisible" :user-info="authStore.userInfo" />
  </div>
</template>
