import { ref, reactive } from 'vue'

export interface PreviewImage {
  src: string
  alt?: string
}

const previewState = reactive({
  show: false,
  images: [] as PreviewImage[],   // 支持多图扩展，目前单图时数组长度为1
  currentIndex: 0,
  hasNext: false,
  hasPrev: false,
})

export function useImagePreview() {
  const openPreview = (src: string, alt?: string) => {
    previewState.images = [{ src, alt }]
    previewState.currentIndex = 0
    previewState.show = true
    previewState.hasNext = false
    previewState.hasPrev = false
  }

  // 扩展方法：打开多图预览（可选）
  const openGallery = (images: PreviewImage[], startIndex = 0) => {
    previewState.images = images
    previewState.currentIndex = startIndex
    previewState.show = true
    previewState.hasNext = startIndex < images.length - 1
    previewState.hasPrev = startIndex > 0
  }

  const closePreview = () => {
    previewState.show = false
    // 可选：延迟清空数据，避免关闭动画时闪屏
    setTimeout(() => {
      if (!previewState.show) {
        previewState.images = []
        previewState.currentIndex = 0
        previewState.hasNext = false
        previewState.hasPrev = false
      }
    }, 300)
  }

  const nextImage = () => {
    if (previewState.currentIndex < previewState.images.length - 1) {
      previewState.currentIndex++
      previewState.hasNext = previewState.currentIndex < previewState.images.length - 1
      previewState.hasPrev = previewState.currentIndex > 0
    }
  }

  const prevImage = () => {
    if (previewState.currentIndex > 0) {
      previewState.currentIndex--
      previewState.hasPrev = previewState.currentIndex > 0
      previewState.hasNext = previewState.currentIndex < previewState.images.length - 1
    }
  }

  return {
    previewState,   // 响应式状态，供 ImagePreview 组件使用
    openPreview,
    openGallery,
    closePreview,
    nextImage,
    prevImage,
  }
}
