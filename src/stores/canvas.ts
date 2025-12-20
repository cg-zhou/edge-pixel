import { defineStore } from 'pinia'

export interface FilterParams {
  hue: number // 色相 -180 ~ 180
  saturation: number // 饱和度 -100 ~ 100
  brightness: number // 亮度 -100 ~ 100
  contrast: number // 对比度 -100 ~ 100
  blur: number // 模糊 0 ~ 20
  opacity: number // 透明度 0 ~ 100
}

interface CanvasState {
  originalImage: HTMLImageElement | null
  imageSrc: string
  filterParams: FilterParams
  imageSize: number // 图片大小（字节）
  fileName: string // 文件名
}

export const useCanvasStore = defineStore('canvas', {
  state: (): CanvasState => ({
    originalImage: null,
    imageSrc: '',
    imageSize: 0,
    fileName: '',
    filterParams: {
      hue: 0,
      saturation: 0,
      brightness: 0,
      contrast: 0,
      blur: 0,
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
          const decoded = atob(src.split(',')[1])
          this.imageSize = decoded.length
        }
      }
      img.src = src
    },
    updateFilter(key: keyof FilterParams, value: number) {
      this.filterParams[key] = value
    },
    resetFilters() {
      this.filterParams = {
        hue: 0,
        saturation: 0,
        brightness: 0,
        contrast: 0,
        blur: 0,
        opacity: 100,
      }
    },
  },
})
