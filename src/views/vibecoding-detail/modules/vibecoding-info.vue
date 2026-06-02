<script setup lang="ts">
import { formatCompact } from '@/utils/common';

defineOptions({ name: 'VibeCodingInfo' });

interface Props {
  vibeCoding: Api.VibeCoding.VibeCodingInfo;
  isMobile: boolean;
}

const props = defineProps<Props>();

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

function formatCompactNumber(num: number) {
  return formatCompact(num);
}

const isWebPlatform = computed(
  () => props.vibeCoding.platform === 'web' || props.vibeCoding.platform === 'desktop',
);

const coverImages = computed(() => {
  const work = props.vibeCoding;
  return [...new Set([work.coverUrl, ...work.screenshots])];
});

const showTwoPerSlide = computed(() => !props.isMobile && isWebPlatform.value);

const slideGroups = computed<string[][]>(() => {
  const groups: string[][] = [];
  const size = showTwoPerSlide.value ? 2 : 1;
  for (let i = 0; i < coverImages.value.length; i += size) {
    groups.push(coverImages.value.slice(i, i + size));
  }
  return groups;
});
const repoUrl = computed(() => props.vibeCoding.repoUrl);

const socialPlatforms = computed(() => {
  const author = props.vibeCoding.author;
  const platforms = [
    { key: 'githubUrl' as const, label: 'GitHub', icon: 'github' },
    { key: 'rednoteUrl' as const, label: '小红书', icon: 'rednote' },
    { key: 'bilibiliUrl' as const, label: 'Bilibili', icon: 'bilibili' },
    { key: 'juejinUrl' as const, label: '掘金', icon: 'juejin' },
    { key: 'weiboUrl' as const, label: '微博', icon: 'weibo' },
    { key: 'portalUrl' as const, label: '个人网站', icon: 'portal' },
  ];
  return platforms.filter((p) => author?.[p.key]);
});

const authorStats = computed(() => {
  const a = props.vibeCoding.author;
  if (!a) return [];
  return [
    { label: '作品', value: a.works ?? 0 },
    { label: '获赞', value: a.likes ?? 0 },
    { label: '关注', value: a.following ?? 0 },
    { label: '粉丝', value: a.followers ?? 0 },
  ];
});

const isFavorited = ref(false);
const isFollowing = ref(false);
const shareTooltip = ref('');

function toggleFavorite() {
  isFavorited.value = !isFavorited.value;
}

function toggleFollow() {
  isFollowing.value = !isFollowing.value;
}

async function handleShare() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    shareTooltip.value = '已复制链接';
  } catch {
    shareTooltip.value = '复制失败';
  }
  setTimeout(() => {
    shareTooltip.value = '';
  }, 2000);
}
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-8">
    <!-- 左侧：基本信息 -->
    <div class="flex-1 min-w-0">
      <!-- 标题 + Featured -->
      <div class="flex items-center gap-3 mb-4">
        <div
          v-if="vibeCoding.featured"
          class="hidden h-7 px-3 rounded-lg text-xs font-700 sm:flex items-center shrink-0 font-display text-slate-900 bg-linear-135-#f97316-#fb923c tracking-wider"
        >
          FEATURED
        </div>
        <h1 class="text-2xl md:text-3xl font-700 text-slate-100">
          {{ vibeCoding.title }}
        </h1>
      </div>

      <!-- 标签 + 数据统计 -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="(tag, ti) in vibeCoding.tags"
            :key="tag"
            class="h-6 px-2.5 rounded-md text-sm font-500 flex items-center font-mono"
            :style="{
              background: getTagStyle(ti).bg,
              color: getTagStyle(ti).text,
            }"
          >
            {{ tag }}
          </span>
        </div>
        <div class="flex-y-center gap-3">
          <div class="flex items-center gap-1 text-sm text-slate-500">
            <SvgIcon icon="lucide:eye" class="text-base" />
            {{ formatCompactNumber(vibeCoding.views) }}
          </div>
          <div class="flex items-center gap-1 text-sm text-orange">
            <SvgIcon icon="lucide:heart" class="text-base" />
            {{ formatCompactNumber(vibeCoding.likes) }}
          </div>
        </div>
      </div>

      <!-- 项目介绍图 -->
      <ElCarousel class="mb-4 w-full" :autoplay="false" indicator-position="none" height="auto">
        <ElCarouselItem v-for="(group, index) in slideGroups" :key="index" class="h-auto">
          <div class="flex-y-center justify-between gap-4">
            <ElImage
              v-for="(img, imgIdx) in group"
              :key="imgIdx"
              :src="img"
              :alt="`slide-${index}-img-${imgIdx}`"
              :preview-src-list="coverImages"
              :initial-index="coverImages.indexOf(img)"
              class="rd-3 flex-1 min-w-0"
              :class="showTwoPerSlide ? 'aspect-9/16' : 'aspect-16/9'"
              preview-teleported
              fit="fill"
              lazy
            />
          </div>
        </ElCarouselItem>
      </ElCarousel>

      <!-- 说明书 (Markdown) -->
      <Markdown :source="vibeCoding.instructions" class="text-slate-400" />
    </div>

    <!-- 右侧：其他信息 -->
    <div class="w-full lg:w-96 2xl:w-[440px] shrink-0 space-y-5">
      <!-- 作者卡片 -->
      <div class="p-5 rounded-2xl bg-slate-800/40 border border-orange-500/6">
        <h3 class="text-base font-700 mb-4 tracking-wider uppercase text-slate-200 font-display">
          创作者
        </h3>
        <div class="flex items-center gap-3">
          <img
            :src="vibeCoding.author.avatar"
            :alt="vibeCoding.author.name"
            class="w-12 h-12 rounded-full object-cover cursor-pointer transition-all duration-200 hover:scale-110 border-2 border-orange-500/20"
            @click="$router.push(`/user-center/${vibeCoding.author.name}`)"
          />
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-2">
              <p
                class="text-base font-600 truncate cursor-pointer transition-colors duration-200 hover:text-[#f97316] text-slate-100"
                @click="$router.push(`/user-center/${vibeCoding.author.name}`)"
              >
                {{ vibeCoding.author.name }}
              </p>
              <button
                class="h-7 px-3 rounded-lg text-sm font-500 cursor-pointer transition-all duration-200 shrink-0 border-1 font-mono"
                :class="
                  isFollowing
                    ? 'text-green-400 bg-green/12 border-green/25'
                    : 'text-orange bg-orange/1 border-orange/25'
                "
                @click="toggleFollow"
              >
                {{ isFollowing ? '已关注' : '+ 关注' }}
              </button>
            </div>
            <p v-if="vibeCoding.author.bio" class="text-sm mt-0.5 truncate text-slate">
              {{ vibeCoding.author.bio }}
            </p>
          </div>
        </div>

        <!-- 社交链接 -->
        <div
          v-if="socialPlatforms.length"
          class="flex-y-center gap-2 mt-3 pt-3 border-t border-slate-400/6"
        >
          <a
            v-for="p in socialPlatforms"
            :key="p.key"
            :href="vibeCoding.author[p.key]"
            target="_blank"
            rel="noopener noreferrer"
            :title="p.label"
            class="w-7 h-7 rounded-lg flex-center cursor-pointer transition-all duration-200 no-underline text-slate hover:(text-orange bg-orange/8)"
          >
            <SvgIcon :local-icon="p.icon" class="text-xl" />
          </a>
        </div>

        <!-- 统计数据 -->
        <div class="flex-y-center justify-between mt-3 pt-3 border-t border-slate-400/6">
          <div
            v-for="stat in authorStats"
            :key="stat.label"
            class="text-center cursor-pointer transition-colors duration-200 hover:text-orange"
            @click="$router.push(`/user-center/${vibeCoding.author.name}`)"
          >
            <div class="text-base font-700 text-slate-100 font-display">
              {{ formatCompactNumber(stat.value) }}
            </div>
            <div class="text-base mt-0.5 text-slate font-mono">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- 收藏 + 分享 -->
      <div class="flex gap-2">
        <button
          class="flex-1 h-10 rounded-xl text-base font-600 cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-200 border-1"
          :class="
            isFavorited
              ? 'bg-orange/15 text-orange border-orange/3'
              : 'bg-slate-800/40 text-slate-300 border-slate-400/8'
          "
          @click="toggleFavorite"
        >
          <SvgIcon
            :icon="isFavorited ? 'carbon:favorite-filled' : 'carbon:favorite'"
            class="text-base"
          />
          {{ isFavorited ? '已收藏' : '收藏' }}
        </button>
        <button
          class="relative flex-1 h-10 rounded-xl text-base font-600 cursor-pointer flex-center gap-1.5 transition-all duration-200 text-slate-400 bg-slate-800/40 border border-slate-400/8"
          @click="handleShare"
        >
          <SvgIcon icon="lucide:share" class="text-base" />
          分享
          <span
            v-if="shareTooltip"
            class="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-black/80 text-white px-2 py-1 rounded whitespace-nowrap"
          >
            {{ shareTooltip }}
          </span>
        </button>
      </div>

      <!-- 项目详情 -->
      <div class="p-5 rounded-2xl bg-slate-800/40 border border-orange-500/6">
        <h3 class="text-base font-700 mb-4 tracking-wider uppercase text-slate-200 font-display">
          项目详情
        </h3>
        <div class="space-y-3">
          <div v-if="vibeCoding.languages?.length" class="flex items-center justify-between">
            <span class="text-sm text-slate font-mono">开发语言</span>
            <span class="text-sm font-500 text-slate-400 font-mono">
              {{ vibeCoding.languages.join(' / ') }}
            </span>
          </div>
          <div v-if="vibeCoding.duration" class="flex items-center justify-between">
            <span class="text-sm text-slate font-mono">开发周期</span>
            <span class="text-sm font-500 text-slate-400 font-mono">
              {{ vibeCoding.duration }}
            </span>
          </div>
          <div v-if="vibeCoding.isOnline !== undefined" class="flex items-center justify-between">
            <span class="text-sm text-slate font-mono">是否上线</span>
            <span
              class="text-sm font-500 font-mono"
              :class="vibeCoding.isOnline ? 'text-green-400' : 'text-slate'"
            >
              {{ vibeCoding.isOnline ? '已上线' : '未上线' }}
            </span>
          </div>
          <div v-if="vibeCoding.onlineDate" class="flex items-center justify-between">
            <span class="text-sm text-slate font-mono">上线日期</span>
            <span class="text-sm font-500 text-slate-400 font-mono">
              {{ vibeCoding.onlineDate }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate font-mono">分类</span>
            <span class="text-sm font-500 text-slate-400 font-mono">
              {{ categoryLabels[vibeCoding.category] || vibeCoding.category }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate font-mono">运行平台</span>
            <span class="text-sm font-500 text-slate-400 font-mono">
              {{ platformLabels[vibeCoding.platform] }}
            </span>
          </div>
          <div v-if="vibeCoding.license" class="flex items-center justify-between">
            <span class="text-sm text-slate font-mono">许可证</span>
            <span class="text-sm font-500 text-slate-400 font-mono">
              {{ vibeCoding.license }}
            </span>
          </div>
        </div>
      </div>

      <!-- 在线演示 + 源码仓库 -->
      <div v-if="vibeCoding.demoUrl || repoUrl" class="flex gap-2">
        <a
          v-if="vibeCoding.demoUrl"
          :href="vibeCoding.demoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-base font-600 transition-all duration-200 no-underline border border-orange-500/20 text-orange"
          style="
            background: linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(251, 146, 60, 0.1));
          "
          @mouseenter="
            (e: MouseEvent) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(249, 115, 22, 0.25)';
            }
          "
          @mouseleave="
            (e: MouseEvent) => {
              (e.currentTarget as HTMLElement).style.background =
                'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(251,146,60,0.1))';
            }
          "
        >
          <SvgIcon icon="lucide:play" class="text-base" />
          在线演示
        </a>
        <a
          v-if="repoUrl"
          :href="repoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-base font-600 transition-all duration-200 no-underline text-slate-400 bg-slate-800/40 border border-slate-400/10"
          @mouseenter="
            (e: MouseEvent) => {
              (e.currentTarget as HTMLElement).style.color = '#f1f5f9';
              (e.currentTarget as HTMLElement).style.background = 'rgba(30,41,59,0.6)';
            }
          "
          @mouseleave="
            (e: MouseEvent) => {
              (e.currentTarget as HTMLElement).style.color = '#94a3b8';
              (e.currentTarget as HTMLElement).style.background = 'rgba(30,41,59,0.4)';
            }
          "
        >
          <SvgIcon icon="lucide:github" class="text-base" />
          源码仓库
        </a>
      </div>

      <!-- MCP / Skills -->
      <div
        v-if="vibeCoding.mcps?.length || vibeCoding.skills?.length"
        class="p-5 rounded-2xl bg-slate-800/40 border border-orange-500/6"
      >
        <h3 class="text-base font-700 mb-4 tracking-wider uppercase text-slate-200 font-display">
          MCP / Skills
        </h3>
        <div v-if="vibeCoding.mcps?.length" class="mb-3">
          <p class="text-11px mb-2 text-slate font-mono">MCP</p>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="mcp in vibeCoding.mcps"
              :key="mcp"
              class="h-6 px-2 rounded-md text-xs flex items-center font-mono bg-blue-500/10 text-blue-400"
            >
              {{ mcp }}
            </span>
          </div>
        </div>
        <div v-if="vibeCoding.skills?.length">
          <p class="text-11px mb-2 text-slate font-mono">Skills</p>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="skill in vibeCoding.skills"
              :key="skill"
              class="h-6 px-2 rounded-md text-xs flex items-center font-mono bg-purple-500/10 text-purple-400"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>

      <!-- Agent -->
      <div
        v-if="vibeCoding.agents?.length"
        class="p-5 rounded-2xl bg-slate-800/40 border border-orange-500/6"
      >
        <h3 class="text-base font-700 mb-4 tracking-wider uppercase text-slate-200 font-display">
          AI Agent
        </h3>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="agent in vibeCoding.agents"
            :key="agent"
            class="h-6 px-2 rounded-md text-xs flex items-center font-mono bg-green-500/10 text-green-400"
          >
            {{ agent }}
          </span>
        </div>
      </div>

      <!-- 开发工具 -->
      <div
        v-if="vibeCoding.tools?.length"
        class="p-5 rounded-2xl bg-slate-800/40 border border-orange-500/6"
      >
        <h3 class="text-base font-700 mb-4 tracking-wider uppercase text-slate-200 font-display">
          开发工具
        </h3>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="tool in vibeCoding.tools"
            :key="tool"
            class="h-6 px-2 rounded-md text-xs flex items-center font-mono bg-orange-500/8 text-orange-400"
          >
            {{ tool }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
