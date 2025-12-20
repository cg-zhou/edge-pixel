<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCanvasStore } from '../stores/canvas'

const canvasStore = useCanvasStore()
const canvasEl = ref<HTMLCanvasElement | null>(null)
const grainData = ref<Uint8ClampedArray | null>(null) // 存储静态颗粒数据

const generateGrainData = (width: number, height: number, intensity: number): Uint8ClampedArray => {
  const data = new Uint8ClampedArray(width * height * 4)
  const grainAmount = (intensity / 100) * 255

  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * grainAmount
    data[i] = grain
    data[i + 1] = grain
    data[i + 2] = grain
    data[i + 3] = 255
  }
  return data
}

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
    clarity,
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

// 颗粒效果（静态颗粒）
const applyGrainEffect = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
) => {
  // 如果颗粒数据不存在或尺寸改变，重新生成
  if (!grainData.value || grainData.value.length !== width * height * 4) {
    grainData.value = generateGrainData(width, height, intensity)
  }

  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  // 使用存储的静态颗粒数据，不重新生成
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, data[i] + grainData.value[i]))
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grainData.value[i + 1]))
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grainData.value[i + 2]))
  }
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
