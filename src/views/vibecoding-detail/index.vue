<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useRequest } from '@a02/alova/client';
import { VibeCodingAPI } from '@/service/api/vibecoding.ts';
import { useAppStore } from '@/stores/modules/app';
import VibeCodingInfo from './modules/vibecoding-info.vue';
import CommentSection from './modules/comment-section.vue';

defineOptions({ name: 'VibeCodingDetail' });

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const isMobile = computed(() => appStore.isMobile);

const {
  loading: vibeCodingDetailLoading,
  data: vibeCodingDetail,
  send: fetchVibeCodingDetail,
} = useRequest((params) => VibeCodingAPI.getVibeCodingById(params), {
  immediate: false,
});

watch(
  () => route.params.id,
  (id) => {
    if (id) fetchVibeCodingDetail(id as string);
  },
);

onMounted(() => {
  const id = route.params.id as string;
  if (id) fetchVibeCodingDetail(id);
});
</script>

<template>
  <div class="pt-20 pb-12">
    <!-- Loading -->
    <div v-if="vibeCodingDetailLoading" class="flex items-center justify-center py-20">
      <div
        class="w-10 h-10 rounded-full border-2 border-transparent animate-spin border-t-orange-500"
      />
    </div>

    <!-- Content -->
    <template v-else-if="vibeCodingDetail">
      <VibeCodingInfo :vibe-coding="vibeCodingDetail" :is-mobile="isMobile" class="mb-10" />
      <CommentSection />
    </template>

    <!-- Not found -->
    <div v-else class="flex flex-col items-center py-20">
      <p class="text-lg text-slate-400">作品不存在</p>
      <button
        class="mt-4 h-10 px-6 rounded-xl text-sm font-600 cursor-pointer btn-primary-gradient"
        @click="router.push('/')"
      >
        返回首页
      </button>
    </div>
  </div>
</template>
