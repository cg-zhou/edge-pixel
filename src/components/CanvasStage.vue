<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCanvasStore } from '../stores/canvas'

const canvasStore = useCanvasStore()
const canvasEl = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null

const applyFilters = () => {
  const canvas = canvasEl.value
  const ctx = canvas?.getContext('2d')
  const img = canvasStore.originalImage

  if (!canvas || !ctx || !img) return

  const { hue, saturation, brightness, contrast, blur, opacity } = canvasStore.filterParams

  canvas.width = img.width
  canvas.height = img.height

  // 构建 CSS filter
  const filters = [
    `hue-rotate(${hue}deg)`,
    `saturate(${100 + saturation}%)`,
    `brightness(${100 + brightness}%)`,
    `contrast(${100 + contrast}%)`,
    `blur(${blur}px)`,
  ]

  ctx.filter = filters.join(' ')
  ctx.globalAlpha = opacity / 100
  ctx.drawImage(img, 0, 0)
  ctx.globalAlpha = 1
}

const renderFrame = () => {
  applyFilters()
  animationId = requestAnimationFrame(renderFrame)
}

onMounted(() => {
  renderFrame()
})
</script>

<template>
  <div class="canvas-container">
    <div v-if="!canvasStore.imageSrc" class="placeholder">
      <div class="placeholder-icon">🖼️</div>
      <div class="placeholder-text">导入图片开始编辑</div>
    </div>
    <div v-else class="canvas-wrapper">
      <canvas ref="canvasEl" class="image-canvas"></canvas>
    </div>
  </div>
</template>

<style scoped>
.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #5a6270;
}

.placeholder-icon {
  font-size: 64px;
  opacity: 0.4;
}

.placeholder-text {
  font-size: 16px;
  font-weight: 500;
  opacity: 0.6;
}

.image-canvas {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  box-shadow: 0 14px 60px rgba(0, 0, 0, 0.6);
}
</style>
