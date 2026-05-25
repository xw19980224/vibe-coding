<script setup lang="ts">
import hardworking from '@/assets/images/hardwoking.png';

defineOptions({ name: 'CommentSection' });
</script>

<template>
  <div
    class="rounded-2xl p-8 bg-slate-800/30 border border-slate-400/6"
  >
    <h3 class="text-lg font-700 mb-6 text-slate-100 font-display" >
      评论
    </h3>
    <div class="flex flex-col items-center py-12">
      <img :src="hardworking" alt="开发中" class="w-48" />
      <p class="text-sm mt-3 text-slate-500 font-mono" >
        模块开发中...
      </p>
    </div>
  </div>
</template>
