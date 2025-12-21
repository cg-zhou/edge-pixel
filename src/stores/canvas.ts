import { defineStore } from 'pinia'

export interface FilterParams {
  // 色彩分组
  hue: number // 色相 -180 ~ 180
  saturation: number // 饱和度 -100 ~ 100
  invert: boolean // 反色
  grayscale: boolean // 灰阶

  // 明度分组
  brightness: number // 亮度 -100 ~ 100
  contrast: number // 对比度 -100 ~ 100
  highlights: number // 高光 -100 ~ 100
  shadows: number // 阴影 -100 ~ 100
  exposure: number // 光感 -100 ~ 100

  // 效果分组
  blur: number // 模糊 0 ~ 20
  grain: number // 颗粒 0 ~ 100
  fade: number // 褪色 0 ~ 100
  vignette: number // 暗角 0 ~ 100

  opacity: number // 透明度 0 ~ 100
}

interface CanvasState {
  originalImage: HTMLImageElement | null
  previewImage: HTMLImageElement | null // 预览用缩略图（最大1920px）
  previewRatio: number // 预览图与原图的比例（previewWidth / originalWidth）
  imageSrc: string
  filterParams: FilterParams
  imageSize: number // 图片大小（字节）
  fileName: string // 文件名
  // 变换参数
  scale: number // 缩放 10 ~ 200 (%)
  rotate: number // 旋转 -180 ~ 180 (度)
  flipH: boolean // 水平翻转
  flipV: boolean // 垂直翻转
  // 加载状态
  isLoading: boolean // 图片加载中
  isExporting: boolean // 导出中
}

export const useCanvasStore = defineStore('canvas', {
  state: (): CanvasState => ({
    originalImage: null,
    previewImage: null,
    previewRatio: 1,
    imageSrc: '',
    imageSize: 0,
    fileName: '',
    scale: 100,
    rotate: 0,
    flipH: false,
    flipV: false,
    isLoading: false,
    isExporting: false,
    filterParams: {
      hue: 0,
      saturation: 0,
      invert: false,
      grayscale: false,
      brightness: 0,
      contrast: 0,
      highlights: 0,
      shadows: 0,
      exposure: 0,
      blur: 0,
      grain: 0,
      fade: 0,
      vignette: 0,
      opacity: 100,
    },
  }),
  actions: {
    setImage(src: string, fileName: string = 'image') {
      this.imageSrc = src
      this.fileName = fileName
      this.isLoading = true

      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        this.originalImage = img
        // 从 src 获取文件大小（如果是 data URL）
        if (src.startsWith('data:')) {
          const parts = src.split(',')
          if (parts[1]) {
            const decoded = atob(parts[1])
            this.imageSize = decoded.length
          }
        }
        // 创建预览用缩略图（最大1920px）
        this.createPreviewImage(img)
      }
      img.src = src
    },
    createPreviewImage(img: HTMLImageElement) {
      const MAX_PREVIEW_SIZE = 1920
      const { width, height } = img

      // 如果图片尺寸小于最大预览尺寸，直接使用原图
      if (width <= MAX_PREVIEW_SIZE && height <= MAX_PREVIEW_SIZE) {
        this.previewImage = img
        this.previewRatio = 1
        this.isLoading = false
        return
      }

      // 计算缩放比例
      const ratio = Math.min(MAX_PREVIEW_SIZE / width, MAX_PREVIEW_SIZE / height)
      this.previewRatio = ratio
      const newWidth = Math.round(width * ratio)
      const newHeight = Math.round(height * ratio)

      // 创建离屏 Canvas 生成缩略图
      const canvas = document.createElement('canvas')
      canvas.width = newWidth
      canvas.height = newHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        this.previewImage = img
        this.isLoading = false
        return
      }

      ctx.drawImage(img, 0, 0, newWidth, newHeight)

      // 创建预览图
      const previewImg = new Image()
      previewImg.onload = () => {
        this.previewImage = previewImg
        this.isLoading = false
      }
      previewImg.src = canvas.toDataURL('image/jpeg', 0.9)
    },
    updateFilter(key: keyof FilterParams, value: number | boolean) {
      ;(this.filterParams as any)[key] = value
    },
    resetFilters() {
      this.filterParams = {
        hue: 0,
        saturation: 0,
        invert: false,
        grayscale: false,
        brightness: 0,
        contrast: 0,
        highlights: 0,
        shadows: 0,
        exposure: 0,
        blur: 0,
        grain: 0,
        fade: 0,
        vignette: 0,
        opacity: 100,
      }
    },
    updateTransform(key: 'scale' | 'rotate' | 'flipH' | 'flipV', value: number | boolean) {
      if (key === 'scale' || key === 'rotate') {
        ;(this as any)[key] = value as number
      } else {
        ;(this as any)[key] = value as boolean
      }
    },
    resetTransform() {
      this.scale = 100
      this.rotate = 0
      this.flipH = false
      this.flipV = false
    },
  },
})
