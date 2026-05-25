<script setup lang="ts">
import { useRouter } from 'vue-router';

defineOptions({ name: 'NotFoundPage' });

const router = useRouter();

function goHome() {
  router.push('/');
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 relative bg-slate-900">
    <div
      class="absolute inset-0"
      style="background: radial-gradient(ellipse at 50% 50%, rgba(249, 115, 22, 0.04) 0%, transparent 60%)"
    />

    <div class="relative z-10 flex flex-col items-center">
      <div
        class="text-9xl font-700 mb-4 tracking-wider text-slate-100 font-display"
      >
        404
      </div>

      <p
        class="text-base mb-2 text-slate-400 font-mono"
      >
        页面不见了
      </p>
      <p
        class="text-sm mb-8 text-slate-500 font-mono"
      >
        你访问的页面不存在或已被移除
      </p>

      <button
        class="h-11 px-8 rounded-xl text-sm font-600 cursor-pointer transition-all duration-200 flex-center gap-2"
        style="background: linear-gradient(135deg, #f97316, #fb923c); color: #fff; box-shadow: 0 2px 12px rgba(249, 115, 22, 0.2)"
        @click="goHome"
      >
        <SvgIcon icon="lucide:home" style="font-size: 16px" />
        返回首页
      </button>
    </div>
  </div>
</template>
