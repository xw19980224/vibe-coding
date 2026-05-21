<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useRequest } from '@a02/alova/client';
import { VibeWorksAPI } from '@/service/api/vibe-works';
import { formatCompact } from '@/utils/common';
import { useAppStore } from '@/stores/modules/app';

defineOptions({ name: 'VibeCodingDetail' });

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const isMobile = computed(() => appStore.isMobile);

const {
  loading: workDetailLoading,
  data: workDetail,
  send: fetchWorkDetail,
} = useRequest((params) => VibeWorksAPI.getWorkById(params), {
  immediate: false,
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

const categoryLabels: Record<string, string> = {
  web: 'Web 应用',
  mobile: '移动端',
  ai: 'AI 创作',
  game: '游戏',
  tool: '开发工具',
  art: '视觉艺术',
};

const platformLabels: Record<Api.VibeCoding.RuntimePlatform, string> = {
  web: 'Web',
  ios: 'iOS',
  android: 'Android',
  desktop: '桌面端',
  'mini-program': '小程序',
  cross: '跨平台',
};

const tagColors = [
  { bg: 'rgba(249, 115, 22, 0.12)', text: '#FB923C' },
  { bg: 'rgba(59, 130, 246, 0.12)', text: '#60A5FA' },
  { bg: 'rgba(34, 197, 94, 0.12)', text: '#4ADE80' },
  { bg: 'rgba(168, 85, 247, 0.12)', text: '#C084FC' },
  { bg: 'rgba(236, 72, 153, 0.12)', text: '#F472B6' },
];

function getTagStyle(idx: number) {
  return tagColors[idx % tagColors.length];
}

const formattedDate = computed(() => {
  const d = workDetail.value?.createdAt;
  if (!d) return '';
  return new Date(d).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

const isWebPlatform = computed(() => {
  return workDetail.value?.platform === 'web' || workDetail.value?.platform === 'desktop';
});

/** 项目介绍轮播：封面 + 截图（去重） */
const coverImages = computed(() => {
  const work = workDetail.value;
  if (!work) return [];
  return [...new Set([work.coverUrl, ...work.screenshots])];
});

watch(
  () => route.params.id,
  (id) => {
    if (id) fetchWorkDetail(id as string);
  },
);

onMounted(() => {
  const id = route.params.id as string;
  if (id) fetchWorkDetail(id);
});
</script>

<template>
  <div class="pt-20 pb-12">
    <!-- Loading -->
    <div v-if="workDetailLoading" class="flex items-center justify-center py-20">
      <div
        class="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
        style="border-top-color: #f97316"
      />
    </div>

    <!-- Content -->
    <template v-else-if="workDetail">
      <!-- ========== VibeCoding 信息区域 ========== -->
      <div class="flex flex-col lg:flex-row gap-8 mb-16">
        <!-- 左侧：基本信息 -->
        <div class="flex-1 min-w-0">
          <!-- 标题 + Featured -->
          <div class="flex items-center gap-3 mb-4">
            <div
              v-if="workDetail.featured"
              class="hidden h-7 px-3 rounded-lg text-xs font-700 sm:flex items-center shrink-0"
              style="
                background: linear-gradient(135deg, #f97316, #fb923c);
                color: #0f172a;
                font-family: Orbitron, sans-serif;
                letter-spacing: 0.05em;
              "
            >
              FEATURED
            </div>
            <h1 class="text-2xl md:text-3xl font-700" style="color: #f1f5f9">
              {{ workDetail.title }}
            </h1>
          </div>

          <!-- 标签 + 数据统计 -->
          <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="(tag, ti) in workDetail.tags"
                :key="tag"
                class="h-6 px-2.5 rounded-md text-xs font-500 flex items-center"
                :style="{
                  background: getTagStyle(ti).bg,
                  color: getTagStyle(ti).text,
                  fontFamily: 'JetBrains Mono, monospace',
                }"
              >
                {{ tag }}
              </span>
            </div>
            <div class="flex-y-center gap-3">
              <div class="flex items-center gap-1 text-xs" style="color: #64748b">
                <SvgIcon icon="lucide:eye" style="font-size: 14px" />
                {{ formatCompact(workDetail.views) }}
              </div>
              <div class="flex items-center gap-1 text-xs" style="color: #f97316">
                <SvgIcon icon="lucide:heart" style="font-size: 14px" />
                {{ formatCompact(workDetail.likes) }}
              </div>
            </div>
          </div>

          <!-- 项目介绍图 -->
          <VibecodingCarousel
            :single="isMobile || !isWebPlatform"
            :images="coverImages"
            :show-dots="false"
            :loop="false"
            class="mb-6"
          />

          <!-- 描述 -->
          <div>
            <h3
              class="text-xs font-700 mb-3 tracking-wider uppercase"
              style="color: #f97316; font-family: Orbitron, sans-serif"
            >
              项目介绍
            </h3>
            <p class="text-sm leading-relaxed" style="color: #94a3b8">
              {{ workDetail.description }}
            </p>
          </div>
        </div>

        <!-- 右侧：其他信息 -->
        <div class="w-full lg:w-96 shrink-0 space-y-5">
          <!-- 作者卡片 -->
          <div
            class="p-5 rounded-2xl"
            style="background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(249, 115, 22, 0.06)"
          >
            <h3
              class="text-xs font-700 mb-4 tracking-wider uppercase"
              style="color: #64748b; font-family: Orbitron, sans-serif"
            >
              创作者
            </h3>
            <div class="flex items-center gap-3">
              <img
                :src="workDetail.author.avatar"
                :alt="workDetail.author.name"
                class="w-12 h-12 rounded-full object-cover"
                style="border: 2px solid rgba(249, 115, 22, 0.2)"
              />
              <div class="min-w-0">
                <p class="text-sm font-600" style="color: #f1f5f9">
                  {{ workDetail.author.name }}
                </p>
                <p
                  v-if="workDetail.author.bio"
                  class="text-xs mt-0.5 truncate"
                  style="color: #64748b"
                >
                  {{ workDetail.author.bio }}
                </p>
              </div>
            </div>
          </div>

          <!-- 项目详情 -->
          <div
            class="p-5 rounded-2xl"
            style="background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(249, 115, 22, 0.06)"
          >
            <h3
              class="text-xs font-700 mb-4 tracking-wider uppercase"
              style="color: #64748b; font-family: Orbitron, sans-serif"
            >
              项目详情
            </h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span
                  class="text-xs"
                  style="color: #64748b; font-family: 'JetBrains Mono', monospace"
                >
                  分类
                </span>
                <span
                  class="text-xs font-500"
                  style="color: #94a3b8; font-family: 'JetBrains Mono', monospace"
                >
                  {{ categoryLabels[workDetail.category] || workDetail.category }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span
                  class="text-xs"
                  style="color: #64748b; font-family: 'JetBrains Mono', monospace"
                >
                  运行平台
                </span>
                <span
                  class="text-xs font-500"
                  style="color: #94a3b8; font-family: 'JetBrains Mono', monospace"
                >
                  {{ platformLabels[workDetail.platform] }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span
                  class="text-xs"
                  style="color: #64748b; font-family: 'JetBrains Mono', monospace"
                >
                  状态
                </span>
                <span
                  class="text-xs font-500"
                  style="color: #94a3b8; font-family: 'JetBrains Mono', monospace"
                >
                  {{ statusLabels[workDetail.status] || '-' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span
                  class="text-xs"
                  style="color: #64748b; font-family: 'JetBrains Mono', monospace"
                >
                  发布日期
                </span>
                <span
                  class="text-xs font-500"
                  style="color: #94a3b8; font-family: 'JetBrains Mono', monospace"
                >
                  {{ formattedDate }}
                </span>
              </div>
            </div>
          </div>

          <!-- Vibe Prompt -->
          <div
            v-if="workDetail.vibePrompt"
            class="p-5 rounded-2xl"
            style="background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(249, 115, 22, 0.06)"
          >
            <h3
              class="text-xs font-700 mb-3 tracking-wider uppercase"
              style="color: #f97316; font-family: Orbitron, sans-serif"
            >
              Vibe Prompt
            </h3>
            <p
              class="text-sm leading-relaxed"
              style="color: #94a3b8; font-family: 'JetBrains Mono', monospace"
            >
              {{ workDetail.vibePrompt }}
            </p>
          </div>

          <!-- 仓库地址 -->
          <a
            v-if="workDetail.link"
            :href="workDetail.link"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-600 transition-all duration-200 no-underline"
            style="
              background: rgba(249, 115, 22, 0.08);
              color: #f97316;
              border: 1px solid rgba(249, 115, 22, 0.15);
            "
            @mouseenter="
              (e: MouseEvent) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(249, 115, 22, 0.15)';
              }
            "
            @mouseleave="
              (e: MouseEvent) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(249, 115, 22, 0.08)';
              }
            "
          >
            <SvgIcon icon="lucide:external-link" style="font-size: 16px" />
            查看仓库
          </a>
        </div>
      </div>

      <!-- ========== 评论区域 ========== -->
      <div
        class="rounded-2xl p-8"
        style="background: rgba(30, 41, 59, 0.3); border: 1px solid rgba(148, 163, 184, 0.06)"
      >
        <h3 class="text-lg font-700 mb-6" style="color: #f1f5f9; font-family: Orbitron, sans-serif">
          评论
        </h3>
        <div class="flex flex-col items-center py-12">
          <div class="text-4xl mb-3" style="opacity: 0.08">💬</div>
          <p class="text-sm" style="color: #64748b; font-family: 'JetBrains Mono', monospace">
            暂无评论
          </p>
        </div>
      </div>
    </template>

    <!-- Not found -->
    <div v-else class="flex flex-col items-center py-20">
      <p class="text-lg" style="color: #94a3b8">作品不存在</p>
      <button
        class="mt-4 h-10 px-6 rounded-xl text-sm font-600 cursor-pointer"
        style="background: linear-gradient(135deg, #f97316, #fb923c); color: #fff"
        @click="router.push('/')"
      >
        返回首页
      </button>
    </div>
  </div>
</template>
