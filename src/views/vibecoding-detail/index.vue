<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useRequest } from '@a02/alova/client';
import { VibeWorksAPI } from '@/service/api/vibe-works';
import { useAppStore } from '@/stores/modules/app';
import VibeCodingInfo from './modules/vibecoding-info.vue';
import CommentSection from './modules/comment-section.vue';

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
      <VibeCodingInfo :work-detail="workDetail" :is-mobile="isMobile" class="mb-16" />
      <CommentSection />
    </template>

    <!-- Not found -->
    <div v-else class="flex flex-col items-center py-20">
      <p class="text-lg text-slate-400" >作品不存在</p>
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
