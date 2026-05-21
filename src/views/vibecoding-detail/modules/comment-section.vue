<script setup lang="ts">
import hardworking from '@/assets/images/hardwoking.png';

defineOptions({ name: 'CommentSection' });
</script>

<template>
  <div
    class="rounded-2xl p-8"
    style="background: rgba(30, 41, 59, 0.3); border: 1px solid rgba(148, 163, 184, 0.06)"
  >
    <h3 class="text-lg font-700 mb-6" style="color: #f1f5f9; font-family: Orbitron, sans-serif">
      评论
    </h3>
    <div class="flex flex-col items-center py-12">
      <img :src="hardworking" alt="开发中" class="w-48" />
      <p class="text-sm mt-3" style="color: #64748b; font-family: 'JetBrains Mono', monospace">
        模块开发中...
      </p>
    </div>
  </div>
</template>
