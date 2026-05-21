<script setup lang="ts">
import { useImagePreview } from '@/hooks/common/use-image-preview';
import { watch, onMounted, onUnmounted } from 'vue';

const { previewState, closePreview, nextImage, prevImage } = useImagePreview();

// 阻止背景滚动
function lockBodyScroll(lock: boolean) {
  if (lock) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

watch(
  () => previewState.show,
  (val) => {
    lockBodyScroll(val);
  },
);

// 键盘事件：ESC关闭，左右键切换（多图时有效）
function onKeydown(e: KeyboardEvent) {
  if (!previewState.show) return;
  if (e.key === 'Escape') {
    closePreview();
  } else if (e.key === 'ArrowLeft') {
    prevImage();
  } else if (e.key === 'ArrowRight') {
    nextImage();
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
});
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown);
  lockBodyScroll(false);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="preview-fade">
      <div
        v-if="previewState.show"
        class="fixed inset-0 z-999 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        @click="closePreview"
      >
        <!-- 关闭按钮 -->
        <div
          class="size-10 rounded-full bg-white/20 flex-center absolute top-4 right-4"
          @click="closePreview"
        >
          <SvgIcon
            icon="lucide:x"
            style="font-size: 18px"
            class="text-white hover:text-gray-300 transition"
          />
        </div>

        <div class="relative flex items-center justify-center w-full h-full">
          <!-- 主图片容器 -->
          <div class="relative max-w-[90vw] max-h-[90vh]" @click.stop>
            <img
              :src="previewState.images[previewState.currentIndex]?.src"
              :alt="previewState.images[previewState.currentIndex]?.alt"
              class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            <!-- 图片描述 -->
            <div
              v-if="previewState.images[previewState.currentIndex]?.alt"
              class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full"
            >
              {{ previewState.images[previewState.currentIndex]?.alt }}
            </div>
          </div>

          <!-- 左右切换按钮（仅多图时显示） -->
          <button
            class="size-10 rounded-full bg-white/20 flex-center absolute left-4 top-1/2 -translate-y-1/2 transition disabled:opacity-20 disabled:cursor-not-allowed"
            @click.stop="prevImage"
            :disabled="!previewState.hasPrev"
          >
            <SvgIcon
              icon="lucide:chevron-left"
              style="font-size: 18px"
              class="text-white"
            />
          </button>
          <button
            class="size-10 rounded-full bg-white/20 flex-center absolute right-4 top-1/2 -translate-y-1/2 transition disabled:opacity-20 disabled:cursor-not-allowed"
            @click.stop="nextImage"
            :disabled="!previewState.hasNext"
          >
            <SvgIcon
              icon="lucide:chevron-right"
              style="font-size: 18px"
              class="text-white"
            />
          </button>

          <!-- 多图指示器 -->
          <div
            v-if="previewState.images.length > 1"
            class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full"
          >
            {{ previewState.currentIndex + 1 }} / {{ previewState.images.length }}
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.preview-fade-enter-active,
.preview-fade-leave-active {
  transition: opacity 0.3s ease;
}
.preview-fade-enter-from,
.preview-fade-leave-to {
  opacity: 0;
}
</style>
