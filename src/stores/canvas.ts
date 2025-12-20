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
  imageSrc: string
  filterParams: FilterParams
  imageSize: number // 图片大小（字节）
  fileName: string // 文件名
  // 变换参数
  scale: number // 缩放 10 ~ 200 (%)
  rotate: number // 旋转 -180 ~ 180 (度)
  flipH: boolean // 水平翻转
  flipV: boolean // 垂直翻转
}

export const useCanvasStore = defineStore('canvas', {
  state: (): CanvasState => ({
    originalImage: null,
    imageSrc: '',
    imageSize: 0,
    fileName: '',
    scale: 100,
    rotate: 0,
    flipH: false,
    flipV: false,
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
      }
      img.src = src
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
