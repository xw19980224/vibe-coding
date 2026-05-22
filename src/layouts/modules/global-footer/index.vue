<script setup lang="ts">
defineOptions({ name: 'GlobalFooter' });
</script>

<template>
  <footer
    class="relative z-10 py-12"
    style="border-top: 1px solid rgba(249, 115, 22, 0.08); background: rgba(15, 23, 42, 0.6)"
  >
    <div class="mx-auto px-4 md:px-8 w-full sm:w-4/5">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex-y-center gap-2">
          <div
            class="w-7 h-7 rounded-lg flex-center text-sm font-bold"
            style="background: linear-gradient(135deg, #f97316, #fb923c); color: #0f172a"
          >
            V
          </div>
          <span
            class="text-sm font-700 tracking-wider"
            style="font-family: Orbitron, sans-serif; color: #94a3b8"
          >
            VIBE<span style="color: #f97316">CODING</span>
          </span>
        </div>

        <div class="flex-y-center gap-6">
          <a
            v-for="link in ['关于我们', '帮助中心', '社区规范', '隐私政策']"
            :key="link"
            class="text-sm cursor-pointer transition-colors duration-200"
            style="color: #64748b; font-family: 'JetBrains Mono', monospace"
            @mouseenter="(e: MouseEvent) => ((e.target as HTMLElement).style.color = '#F97316')"
            @mouseleave="(e: MouseEvent) => ((e.target as HTMLElement).style.color = '#64748B')"
          >
            {{ link }}
          </a>
        </div>

        <p class="text-xs" style="color: #475569; font-family: 'JetBrains Mono', monospace">
          &copy; {{ new Date().getFullYear() }} VibeCoding — Built with AI, Shared with Love
        </p>
      </div>
    </div>
  </footer>
</template>
