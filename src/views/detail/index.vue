<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useVibeStore } from '@/stores/modules/vibe';
import { formatCompact } from '@/utils/common';

defineOptions({ name: 'WorkDetailPage' });

const route = useRoute();
const router = useRouter();
const vibeStore = useVibeStore();

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


onMounted(() => {
  const id = route.params.id as string;
  vibeStore.fetchWorkById(id);
});
</script>

<template>
  <div class="pt-20 pb-12 px-4 max-w-4xl mx-auto">
      <!-- Back button -->
      <button
        class="flex items-center gap-2 mb-8 text-sm cursor-pointer transition-colors duration-200"
        style="color: #64748B; font-family: 'JetBrains Mono', monospace"
        @click="router.back()"
        @mouseenter="(e: MouseEvent) => (e.currentTarget as HTMLElement).style.color = '#F97316'"
        @mouseleave="(e: MouseEvent) => (e.currentTarget as HTMLElement).style.color = '#64748B'"
      >
        <SvgIcon icon="lucide:arrow-left" style="font-size: 16px" />
        返回
      </button>

      <!-- Loading -->
      <div v-if="vibeStore.loading" class="flex items-center justify-center py-20">
        <div
          class="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
          style="border-top-color: #F97316"
        />
      </div>

      <!-- Content -->
      <div v-else-if="vibeStore.currentWork">
        <div
          v-if="vibeStore.currentWork.featured"
          class="inline-flex h-7 px-3 rounded-lg text-xs font-700 items-center mb-6"
          style="
            background: linear-gradient(135deg, #F97316, #FB923C);
            color: #0F172A;
            font-family: Orbitron, sans-serif;
            letter-spacing: 0.05em;
          "
        >
          FEATURED
        </div>

        <h1
          class="text-3xl md:text-4xl font-700 mb-4"
          style="color: #F1F5F9"
        >
          {{ vibeStore.currentWork.title }}
        </h1>

        <div class="flex flex-wrap items-center gap-4 mb-8">
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-700"
              style="
                background: linear-gradient(135deg, #F97316, #FB923C);
                color: #0F172A;
              "
            >
              {{ vibeStore.currentWork.author.name[0] }}
            </div>
            <span class="text-sm" style="color: #94A3B8">
              {{ vibeStore.currentWork.author.name }}
            </span>
          </div>
          <span class="text-sm" style="color: #475569">|</span>
          <div class="flex items-center gap-1 text-sm" style="color: #64748B">
            <SvgIcon icon="lucide:eye" style="font-size: 16px" />
            {{ formatCompact(vibeStore.currentWork.views) }}
          </div>
          <div class="flex items-center gap-1 text-sm" style="color: #F97316">
            <SvgIcon icon="lucide:heart" style="font-size: 16px" />
            {{ formatCompact(vibeStore.currentWork.likes) }}
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mb-8">
          <span
            v-for="(tag, ti) in vibeStore.currentWork.tags"
            :key="tag"
            class="h-6 px-3 rounded-lg text-xs font-500 flex items-center"
            :style="{
              background: getTagStyle(ti).bg,
              color: getTagStyle(ti).text,
              fontFamily: 'JetBrains Mono', monospace,
            }"
          >
            {{ tag }}
          </span>
        </div>

        <p class="text-base leading-relaxed mb-8" style="color: #94A3B8">
          {{ vibeStore.currentWork.description }}
        </p>

        <div
          v-if="vibeStore.currentWork.vibePrompt"
          class="mb-8 p-6 rounded-2xl"
          style="
            background: rgba(30, 41, 59, 0.5);
            border: 1px solid rgba(249, 115, 22, 0.1);
          "
        >
          <h3
            class="text-xs font-700 mb-3 tracking-wider uppercase"
            style="color: #F97316; font-family: Orbitron, sans-serif"
          >
            Vibe Prompt
          </h3>
          <p
            class="text-sm leading-relaxed"
            style="color: #94A3B8; font-family: 'JetBrains Mono', monospace"
          >
            {{ vibeStore.currentWork.vibePrompt }}
          </p>
        </div>

        <div
          v-if="vibeStore.currentWork.codeSnippet"
          class="mb-8 rounded-2xl overflow-hidden"
          style="
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid rgba(249, 115, 22, 0.08);
          "
        >
          <div
            class="flex items-center gap-1.5 px-4 py-3"
            style="border-bottom: 1px solid rgba(249, 115, 22, 0.06)"
          >
            <div class="w-3 h-3 rounded-full" style="background: #F97316" />
            <div class="w-3 h-3 rounded-full" style="background: #FB923C" />
            <div class="w-3 h-3 rounded-full" style="background: #FBBF24" />
            <span class="ml-3 text-xs" style="color: #64748B; font-family: 'JetBrains Mono', monospace">
              code-snippet.ts
            </span>
          </div>
          <pre
            class="p-6 text-sm leading-relaxed overflow-x-auto"
            style="font-family: 'JetBrains Mono', monospace; color: #94A3B8"
          ><code>{{ vibeStore.currentWork.codeSnippet }}</code></pre>
        </div>

        <a
          v-if="vibeStore.currentWork.link"
          :href="vibeStore.currentWork.link"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-600 transition-all duration-200 no-underline"
          style="
            background: transparent;
            color: #F97316;
            border: 1px solid rgba(249, 115, 22, 0.3);
          "
          @mouseenter="(e: MouseEvent) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(249, 115, 22, 0.08)';
          }"
          @mouseleave="(e: MouseEvent) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }"
        >
          <SvgIcon icon="lucide:code" style="font-size: 16px" />
          查看源代码
        </a>
      </div>

      <!-- Not found -->
      <div v-else class="flex flex-col items-center py-20">
        <p class="text-lg" style="color: #94A3B8">作品不存在</p>
        <button
          class="mt-4 h-10 px-6 rounded-xl text-sm font-600 cursor-pointer"
          style="
            background: linear-gradient(135deg, #F97316, #FB923C);
            color: #fff;
          "
          @click="router.push('/')"
        >
          返回首页
        </button>
      </div>
  </div>
</template>
