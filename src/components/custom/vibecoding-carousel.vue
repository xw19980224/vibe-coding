<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import BScroll from '@better-scroll/core';
import Slide from '@better-scroll/slide';
import { useImagePreview } from '@/hooks/common/use-image-preview';

BScroll.use(Slide);

interface Props {
  images: string[];
  /** 是否单图模式：false=每页2张(3/4)，true=每页1张(4/3) */
  single?: boolean;
  /** 是否循环播放 */
  loop?: boolean;
  /** 是否自动播放 */
  autoplay?: boolean;
  /** 是否显示点状指示器 */
  showDots?: boolean;
  /** 自动播放间隔 */
  interval?: number;
}

const props = withDefaults(defineProps<Props>(), {
  images: () => [],
  single: false,
  loop: false,
  autoplay: false,
  showDots: true,
  interval: 400,
});

const scrollRef = ref<HTMLElement | null>(null);
let bsInstance: any = null;
const currentPage = ref<number>(0);

const perPage = computed(() => (props.single ? 1 : 2));

/** 将图片按每页显示数量一组分组 */
const slideGroups = computed<string[][]>(() => {
  const groups: string[][] = [];
  for (let i = 0; i < props.images.length; i += perPage.value) {
    groups.push(props.images.slice(i, i + perPage.value));
  }
  return groups;
});

const totalPages = computed<number>(() => slideGroups.value.length);

const imgAspect = computed(() => (props.single ? 'aspect-4/3' : 'aspect-3/4'));

const { openGallery } = useImagePreview();

const previewImages = computed(() =>
  props.images.map((src, idx) => ({ src, alt: `image-${idx}` })),
);

function onImageClick(clickedSrc: string) {
  const index = props.images.findIndex((src) => src === clickedSrc);
  if (index !== -1) openGallery(previewImages.value, index);
}

const nextPage = (): void => {
  if (!bsInstance) return;
  if (!props.loop && currentPage.value === totalPages.value - 1) return;
  bsInstance.next();
};

const prevPage = (): void => {
  if (!bsInstance) return;
  if (!props.loop && currentPage.value === 0) return;
  bsInstance.prev();
};

const goToPage = (idx: number): void => {
  if (bsInstance && idx >= 0 && idx < totalPages.value) {
    bsInstance.goToPage(idx, 0, 0);
  }
};

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

watch(
  () => props.images,
  () => initScroll(),
  { deep: true },
);

onMounted(() => initScroll());
onBeforeUnmount(() => {
  if (bsInstance) {
    bsInstance.destroy();
    bsInstance = null;
  }
});
</script>

<template>
  <div class="relative w-full overflow-hidden">
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
            :class="[
              imgAspect,
              'flex-1 rounded-xl overflow-hidden bg-gray-100 shadow-md size-full object-cover',
            ]"
            :disable-preview="true"
            @click="(src: string) => onImageClick(src)"
          />
          <div
            v-if="!single && group.length === 1"
            :class="[
              imgAspect,
              'flex-1 rounded-xl bg-gray-100 border border-dashed border-gray-300',
            ]"
          />
        </div>
      </div>
    </div>

    <!-- 左箭头 -->
    <button
      class="absolute left-4 top-1/2 -translate-y-1/2 size-9 flex-center bg-black/50 text-white rounded-full backdrop-blur-sm transition-all duration-200 hover:(bg-black/80 scale-105) z-10"
      v-if="currentPage !== 0"
      @click="prevPage"
    >
      <SvgIcon icon="lucide:chevron-left" class="text-white text-2xl" />
    </button>

    <!-- 右箭头 -->
    <button
      v-if="currentPage !== totalPages - 1"
      class="absolute right-4 top-1/2 -translate-y-1/2 size-9 flex-center bg-black/50 text-white rounded-full backdrop-blur-sm transition-all duration-200 hover:(bg-black/80 scale-105) z-10"
      @click="nextPage"
    >
      <SvgIcon icon="lucide:chevron-right" class="text-white text-2xl" />
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
