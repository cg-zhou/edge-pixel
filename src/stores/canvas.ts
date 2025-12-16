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
}

export const useCanvasStore = defineStore('canvas', {
  state: (): CanvasState => ({
    originalImage: null,
    imageSrc: '',
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
    setImage(src: string) {
      this.imageSrc = src
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        this.originalImage = img
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
