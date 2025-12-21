<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useCanvasStore } from '../stores/canvas'
import { applyGrain } from '../utils/grain'

const canvasStore = useCanvasStore()
const canvasEl = ref<HTMLCanvasElement | null>(null)

let lastRenderTime = 0
const THROTTLE_INTERVAL = 50 // 节流间隔 50ms

const applyFilters = () => {
  const canvas = canvasEl.value
  const ctx = canvas?.getContext('2d')
  // 预览使用缩略图
  const img = canvasStore.previewImage

  if (!canvas || !ctx || !img) return

  const {
    hue,
    saturation,
    invert,
    grayscale,
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

  // 计算缩放后的尺寸
  const scaledWidth = img.width * (canvasStore.scale / 100)
  const scaledHeight = img.height * (canvasStore.scale / 100)

  canvas.width = scaledWidth
  canvas.height = scaledHeight

  // 应用变换
  ctx.save()
  ctx.translate(scaledWidth / 2, scaledHeight / 2)

  // 旋转
  ctx.rotate((canvasStore.rotate * Math.PI) / 180)

  // 翻转
  if (canvasStore.flipH) ctx.scale(-1, 1)
  if (canvasStore.flipV) ctx.scale(1, -1)

  ctx.translate(-scaledWidth / 2, -scaledHeight / 2)

  // 构建 CSS filter
  const filters = [
    `hue-rotate(${hue}deg)`,
    `saturate(${100 + saturation - fade * 0.5}%)`,
    `brightness(${100 + brightness + exposure * 0.3}%)`,
    `contrast(${100 + contrast}%)`,
    `blur(${blur}px)`,
    `invert(${fade * 0.3}%)`,
    invert ? `invert(100%)` : `invert(0%)`,
    grayscale ? `grayscale(100%)` : `grayscale(0%)`,
  ]

  if (highlights > 0) {
    filters.push(`brightness(${100 + highlights * 0.2}%)`)
  }
  if (shadows > 0) {
    filters.push(`brightness(${100 - shadows * 0.2}%)`)
  }

  ctx.filter = filters.join(' ')
  ctx.globalAlpha = opacity / 100
  ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight)
  ctx.globalAlpha = 1

  // 应用暗角效果
  if (vignette > 0) {
    applyVignetteEffect(ctx, scaledWidth, scaledHeight, vignette)
  }

  // 应用颗粒效果
  if (grain > 0) {
    applyGrainEffect(ctx, scaledWidth, scaledHeight, grain)
  }

  ctx.restore()
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

// 节流渲染：保证实时反馈，每 50ms 最多渲染一次
const throttledRender = () => {
  const now = Date.now()
  if (now - lastRenderTime >= THROTTLE_INTERVAL) {
    lastRenderTime = now
    applyFilters()
  } else {
    // 确保最后一次变化也能渲染
    setTimeout(() => {
      applyFilters()
    }, THROTTLE_INTERVAL - (now - lastRenderTime))
  }
}

// 监听参数变化，使用节流
watch(
  () => [
    canvasStore.filterParams,
    canvasStore.scale,
    canvasStore.rotate,
    canvasStore.flipH,
    canvasStore.flipV,
    canvasStore.previewImage,
  ],
  () => {
    throttledRender()
  },
  { deep: true }
)

onMounted(() => {
  // 初始渲染
  applyFilters()
})
</script>

<template>
  <div class="canvas-container" v-loading="canvasStore.isLoading" element-loading-text="加载中...">
    <div v-if="!canvasStore.imageSrc" class="placeholder">
      <div class="placeholder-text">打开图片开始编辑</div>
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

/* Canvas 画布区域 */
.canvas-container {
  background: repeating-conic-gradient(#353535 0% 25%, #272727 0% 50%);
  background-size: 20px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  flex: 1;
  position: relative;
}

.canvas-wrapper {
  position: relative;
  box-shadow: 0 14px 60px rgba(0, 0, 0, 0.6);
}

canvas {
  display: block;
  max-width: 100%;
  max-height: 100%;
}
</style>
