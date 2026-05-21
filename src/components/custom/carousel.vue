<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import BScroll from '@better-scroll/core';
import Slide from '@better-scroll/slide';
import { useImagePreview } from '@/hooks/common/use-image-preview';

// 注册 Slide 插件
BScroll.use(Slide);

// 定义 props 类型
interface Props {
  images: string[];
  loop?: boolean;
  autoplay?: boolean;
  showDots?: boolean;
  interval?: number;
}

const props = withDefaults(defineProps<Props>(), {
  images: () => [],
  loop: false,
  showDots: true,
  autoplay: false,
  interval: 400,
});

// 模板 ref 类型
const scrollRef = ref<HTMLElement | null>(null);

// BScroll 实例类型（使用 any 或导入正确的类型定义，这里使用 any 避免复杂类型导入）
let bsInstance: any = null;

// 当前页码
const currentPage = ref<number>(0);

// 将图片按每两张一组分组
const slideGroups = computed<string[][]>(() => {
  const groups: string[][] = [];
  for (let i = 0; i < props.images.length; i += 2) {
    groups.push(props.images.slice(i, i + 2));
  }
  return groups;
});

// 总页数
const totalPages = computed<number>(() => slideGroups.value.length);

// 预览相关
const { openGallery } = useImagePreview();

// 准备所有图片的预览数据（src + alt）
const previewImages = computed(() =>
  props.images.map((src, idx) => ({
    src,
    alt: `image-${idx}`,
  })),
);

// 处理单张图片点击
function onImageClick(clickedSrc: string, alt: string) {
  // 找到点击图片在总数组中的索引
  const index = props.images.findIndex((src) => src === clickedSrc);
  if (index !== -1) {
    openGallery(previewImages.value, index);
  }
}

// 下一张
const nextPage = (): void => {
  if (!bsInstance) return;
  if (!props.loop && currentPage.value === totalPages.value - 1) return;
  bsInstance.next();
};

// 上一张
const prevPage = (): void => {
  if (!bsInstance) return;
  if (!props.loop && currentPage.value === 0) return;
  bsInstance.prev();
};

// 跳转到指定页
const goToPage = (idx: number): void => {
  if (bsInstance && idx >= 0 && idx < totalPages.value) {
    bsInstance.goToPage(idx, 0, 0);
  }
};

// 初始化 BScroll
const initScroll = async (): Promise<void> => {
  if (!scrollRef.value) return;
  await nextTick();
  if (bsInstance) bsInstance.destroy();

  bsInstance = new BScroll(scrollRef.value, {
    scrollX: true,
    scrollY: false,
    slide: {
      loop: props.loop,
      threshold: 0.1,
      speed: props.interval,
      autoplay: props.autoplay,
    },
    momentum: false,
    bounce: false,
    probeType: 3,
    click: true,
  });

  bsInstance.on('slidePageChanged', (page: { pageX: number; pageY: number }) => {
    currentPage.value = page.pageX;
  });

  bsInstance.on('scrollEnd', () => {
    const page = bsInstance.getCurrentPage();
    if (page) currentPage.value = page.pageX;
  });
};

// 监听图片列表变化重新初始化
watch(
  () => props.images,
  () => {
    initScroll();
  },
  { deep: true },
);

// 生命周期
onMounted(() => {
  initScroll();
});

onBeforeUnmount(() => {
  if (bsInstance) {
    bsInstance.destroy();
    bsInstance = null;
  }
});
</script>

<template>
  <div class="relative w-full overflow-hidden">
    <!-- 滚动容器 -->
    <div ref="scrollRef" class="overflow-hidden cursor-grab active:cursor-grabbing">
      <div class="flex flex-nowrap">
        <div
          v-for="(group, idx) in slideGroups"
          :key="idx"
          class="shrink-0 w-full flex flex-row justify-between gap-4 box-border"
        >
          <LazyImage
            v-for="(img, imgIdx) in group"
            :key="imgIdx"
            :src="img"
            :alt="`slide-${idx}-img-${imgIdx}`"
            class="flex-1 aspect-3/4 rounded-xl overflow-hidden bg-gray-100 shadow-md w-full h-full object-cover"
            :disable-preview="true"
            @click="onImageClick"
          />
          <!-- 占位符逻辑保持不变 -->
          <div
            v-if="group.length === 1"
            class="flex-1 aspect-3/4 rounded-xl bg-gray-100 border border-dashed border-gray-300"
          ></div>
        </div>
      </div>
    </div>

    <!-- 左箭头 -->
    <button
      class="absolute left-5 top-1/2 -translate-y-1/2 w-9 h-9 flex-center bg-black/50 text-white text-2xl font-bold rounded-full backdrop-blur-sm transition-all duration-200 hover:bg-black/80 hover:scale-105 disabled:opacity-30 disabled:pointer-events-none z-10"
      :disabled="!loop && currentPage === 0"
      @click="prevPage"
    >
      &#10094;
    </button>

    <!-- 右箭头 -->
    <button
      class="absolute right-5 top-1/2 -translate-y-1/2 w-9 h-9 flex-center bg-black/50 text-white text-2xl font-bold rounded-full backdrop-blur-sm transition-all duration-200 hover:bg-black/80 hover:scale-105 disabled:opacity-30 disabled:pointer-events-none z-10"
      :disabled="!loop && currentPage === totalPages - 1"
      @click="nextPage"
    >
      &#10095;
    </button>

    <!-- 点状指示器 -->
    <div v-if="showDots" class="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
      <button
        v-for="(_, idx) in slideGroups"
        :key="idx"
        class="w-2 h-2 rounded-full bg-white/60 transition-all duration-200 cursor-pointer"
        :class="{ 'w-5 rounded-md bg-red-400': currentPage === idx }"
        @click="goToPage(idx)"
      />
    </div>
  </div>
</template>
