<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCanvasStore } from '../stores/canvas'
import { applyGrain } from '../utils/grain'

const canvasStore = useCanvasStore()
const canvasEl = ref<HTMLCanvasElement | null>(null)

const applyFilters = () => {
  const canvas = canvasEl.value
  const ctx = canvas?.getContext('2d')
  const img = canvasStore.originalImage

  if (!canvas || !ctx || !img) return

  const {
    hue,
    saturation,
    brightness,
    contrast,
    highlights,
    shadows,
    exposure,
    blur,
    grain,
    fade,
    vignette,
    opacity,
  } = canvasStore.filterParams

  canvas.width = img.width
  canvas.height = img.height

  // 构建 CSS filter
  const filters = [
    `hue-rotate(${hue}deg)`,
    `saturate(${100 + saturation - fade * 0.5}%)`, // 褪色会降低饱和度
    `brightness(${100 + brightness + exposure * 0.3}%)`,
    `contrast(${100 + contrast}%)`,
    `blur(${blur}px)`, // 模糊效果
    `invert(${fade * 0.3}%)`, // 褪色效果
  ]

  // 高光和阴影通过亮度调整模拟
  if (highlights > 0) {
    filters.push(`brightness(${100 + highlights * 0.2}%)`)
  }
  if (shadows > 0) {
    filters.push(`brightness(${100 - shadows * 0.2}%)`)
  }

  ctx.filter = filters.join(' ')
  ctx.globalAlpha = opacity / 100
  ctx.drawImage(img, 0, 0)
  ctx.globalAlpha = 1

  // 应用暗角效果（通过 canvas 绘制）
  if (vignette > 0) {
    applyVignetteEffect(ctx, canvas.width, canvas.height, vignette)
  }

  // 应用颗粒效果（通过 canvas 绘制）
  if (grain > 0) {
    applyGrainEffect(ctx, canvas.width, canvas.height, grain)
  }
}

// 暗角效果
const applyVignetteEffect = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
) => {
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 2)
  gradient.addColorStop(0, `rgba(0, 0, 0, 0)`)
  gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity * 0.01})`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

// 颗粒效果（像素级实现，保证生效）
const applyGrainEffect = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
) => {
  const imageData = ctx.getImageData(0, 0, width, height)
  // 使用 intensity 值作为种子，确保相同强度下颗粒图案相同（静止）
  applyGrain(imageData, intensity, Math.round(intensity))
  ctx.putImageData(imageData, 0, 0)
}

const renderFrame = () => {
  applyFilters()
  requestAnimationFrame(renderFrame)
}

onMounted(() => {
  renderFrame()
})
</script>

<template>
  <div class="canvas-container">
    <div v-if="!canvasStore.imageSrc" class="placeholder">
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
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}
</style>
