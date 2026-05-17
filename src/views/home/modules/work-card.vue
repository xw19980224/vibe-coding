<script setup lang="ts">
defineOptions({ name: 'WorkCard' });

const props = defineProps<{
  work: VibeCoding.VibeWork;
  index: number;
}>();

const emit = defineEmits<{
  click: [work: VibeCoding.VibeWork];
  like: [workId: string];
}>();

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

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}
</script>

<template>
  <article
    class="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
    style="
      background: linear-gradient(180deg, rgba(30, 41, 59, 0.8) 0%, rgba(30, 41, 59, 0.4) 100%);
      border: 1px solid rgba(249, 115, 22, 0.06);
      animation: cardEnter 0.5s ease-out both;
    "
    :style="{ animationDelay: `${index * 60}ms` }"
    @click="emit('click', work)"
    @mouseenter="(e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      el.style.borderColor = 'rgba(249, 115, 22, 0.25)';
      el.style.boxShadow = '0 0 30px rgba(249, 115, 22, 0.08)';
      el.style.transform = 'translateY(-4px)';
    }"
    @mouseleave="(e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      el.style.borderColor = 'rgba(249, 115, 22, 0.06)';
      el.style.boxShadow = 'none';
      el.style.transform = 'translateY(0)';
    }"
  >
    <!-- Cover area --- code-like visual -->
    <div
      class="relative h-48 overflow-hidden flex items-center justify-center"
      style="background: linear-gradient(135deg, rgba(15, 23, 42, 1) 0%, rgba(30, 41, 59, 0.8) 100%)"
    >
      <!-- Code snippet preview -->
      <div
        v-if="work.codeSnippet"
        class="w-full h-full p-4 overflow-hidden"
        style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #94A3B8; opacity: 0.6"
      >
        <pre class="whitespace-pre-wrap line-clamp-6">{{ work.codeSnippet }}</pre>
      </div>
      <div
        v-else
        class="text-6xl"
        style="opacity: 0.15; color: #F97316"
      >
        { }

      </div>

      <!-- Featured badge -->
      <div
        v-if="work.featured"
        class="absolute top-3 left-3 h-6 px-2 rounded text-xs font-700 flex items-center"
        style="
          background: linear-gradient(135deg, #F97316, #FB923C);
          color: #0F172A;
          font-family: Orbitron, sans-serif;
          font-size: 10px;
          letter-spacing: 0.05em;
        "
      >
        FEATURED
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <h3
        class="text-base font-600 mb-2 line-clamp-1"
        style="color: #F1F5F9"
      >
        {{ work.title }}
      </h3>
      <p
        class="text-xs mb-3 line-clamp-2 leading-relaxed"
        style="color: #64748B; font-family: 'JetBrains Mono', monospace"
      >
        {{ work.description }}
      </p>

      <!-- Tags -->
      <div class="flex flex-wrap gap-1.5 mb-3">
        <span
          v-for="(tag, ti) in work.tags.slice(0, 3)"
          :key="tag"
          class="h-5 px-2 rounded text-xs font-500 flex items-center"
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
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-700"
            style="
              background: linear-gradient(135deg, #F97316, #FB923C);
              color: #0F172A;
            "
          >
            {{ work.author.name[0] }}
          </div>
          <span class="text-xs" style="color: #64748B">
            {{ work.author.name }}
          </span>
        </div>
        <div class="flex items-center gap-3">
          <button
            class="flex items-center gap-1 text-xs cursor-pointer transition-colors duration-200"
            style="color: #64748B"
            @click.stop="emit('like', work.id)"
            @mouseenter="(e: MouseEvent) => (e.currentTarget as HTMLElement).style.color = '#F97316'"
            @mouseleave="(e: MouseEvent) => (e.currentTarget as HTMLElement).style.color = '#64748B'"
          >
            <SvgIcon icon="lucide:heart" style="font-size: 14px" />
            {{ formatNumber(work.likes) }}
          </button>
          <div class="flex items-center gap-1 text-xs" style="color: #475569">
            <SvgIcon icon="lucide:eye" style="font-size: 14px" />
            {{ formatNumber(work.views) }}
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
