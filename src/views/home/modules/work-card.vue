<script setup lang="ts">
import { useRouter } from 'vue-router';
import { formatCompact } from '../../../utils/common.ts';

defineOptions({ name: 'WorkCard' });

const router = useRouter();

interface Props {
  work: Api.VibeCoding.VibeProject;
  index: number;
}

defineProps<Props>();

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

function handleCardClick(idx: number) {
  router.push(`/vibecoding/${idx}`);
}

function handleUserCenter(name: string) {
  router.push({ path: `/user-center/${name}` });
}

function handleClick(idx: number) {
  console.log(idx);
}
</script>

<template>
  <article
    class="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border border-orange-500/6 hover:(border-orange/50 -translate-y-1 shadow-[0_0_30px_orange/8])"
    style="
      background: linear-gradient(180deg, rgba(30, 41, 59, 0.8) 0%, rgba(30, 41, 59, 0.4) 100%);
      animation: cardEnter 0.5s ease-out both;
    "
    :style="{ animationDelay: `${index * 60}ms` }"
    @click="handleCardClick(work.id)"
  >
    <!-- Cover image -->
    <div
      class="relative h-48 overflow-hidden"
      style="
        background: linear-gradient(135deg, rgba(15, 23, 42, 1) 0%, rgba(30, 41, 59, 0.8) 100%);
      "
    >
      <ElImage :src="work.coverUrl" :alt="work.title" lazy fit="cover" />

      <!-- Featured badge -->
      <div
        v-if="work.featured"
        class="absolute top-3 left-3 h-6 px-2 rounded text-xs font-700 flex-y-center font-display text-slate-900 bg-gradient-to-br from-orange to-orange-400 tracking-wider"
      >
        FEATURED
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <h3 class="text-base font-600 mb-2 line-clamp-1 text-slate-100 select-text">
        {{ work.title }}
      </h3>
      <p class="text-xs mb-3 line-clamp-2 leading-relaxed text-slate-500 font-mono">
        {{ work.description }}
      </p>

      <!-- Tags -->
      <div class="flex flex-wrap gap-1.5 mb-3">
        <span
          v-for="(tag, ti) in work.tags.slice(0, 3)"
          :key="tag"
          class="h-5 px-2 rounded text-xs font-500 flex-y-center"
          :style="{
            background: getTagStyle(ti).bg,
            color: getTagStyle(ti).text,
            fontFamily: 'JetBrains Mono, monospace',
          }"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Meta -->
      <div class="flex-y-center justify-between">
        <div class="flex items-end gap-2" @click.stop="handleUserCenter(work.author?.name)">
          <ElAvatar size="small" :src="work.author?.avatar" />
          <span class="text-xs text-slate-500">
            {{ work.author.name }}
          </span>
        </div>
        <div class="flex items-center gap-3 text-xs">
          <button
            class="flex-y-center gap-1 text-xs cursor-pointer tra nsition-colors duration-200 text-slate-500"
            @click.stop="handleClick(work.id)"
            @mouseenter="
              (e: MouseEvent) => ((e.currentTarget as HTMLElement).style.color = '#F97316')
            "
            @mouseleave="
              (e: MouseEvent) => ((e.currentTarget as HTMLElement).style.color = '#64748B')
            "
          >
            <SvgIcon icon="lucide:heart" />
            {{ formatCompact(work.likes) }}
          </button>
          <div class="flex-y-center gap-1 text-xs text-slate-600 text-xs">
            <SvgIcon icon="lucide:eye" />
            {{ formatCompact(work.views) }}
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
