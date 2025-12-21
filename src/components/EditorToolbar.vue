<script setup lang="ts">
import { ref } from 'vue'
import { useCanvasStore } from '../stores/canvas'
import { applyGrain } from '../utils/grain'

const canvasStore = useCanvasStore()
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (evt) => {
    const src = evt.target?.result as string
    canvasStore.setImage(src, file.name)
  }
  reader.readAsDataURL(file)
  input.value = ''
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

type ExportFormat = 'png' | 'jpg' | 'webp'

// 使用原图进行导出处理
const exportImage = async (format: ExportFormat = 'jpg') => {
  const img = canvasStore.originalImage
  if (!img) return

  canvasStore.isExporting = true

  // 使用 setTimeout 确保 loading 显示
  await new Promise(resolve => setTimeout(resolve, 50))

  try {
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

    // 计算原图缩放后的尺寸
    const scaledWidth = img.width * (canvasStore.scale / 100)
    const scaledHeight = img.height * (canvasStore.scale / 100)

    // 计算导出时的效果补偿比例（原图/预览图）
    const exportRatio = canvasStore.previewRatio > 0 ? 1 / canvasStore.previewRatio : 1
    // 导出时按比例调整 blur（预览图上的 blur 在原图上需要放大）
    const exportBlur = blur * exportRatio

    // 创建离屏 Canvas
    const canvas = document.createElement('canvas')
    canvas.width = scaledWidth
    canvas.height = scaledHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 应用变换
    ctx.save()
    ctx.translate(scaledWidth / 2, scaledHeight / 2)
    ctx.rotate((canvasStore.rotate * Math.PI) / 180)
    if (canvasStore.flipH) ctx.scale(-1, 1)
    if (canvasStore.flipV) ctx.scale(1, -1)
    ctx.translate(-scaledWidth / 2, -scaledHeight / 2)

    // 构建 CSS filter（blur 使用补偿后的值）
    const filters = [
      `hue-rotate(${hue}deg)`,
      `saturate(${100 + saturation - fade * 0.5}%)`,
      `brightness(${100 + brightness + exposure * 0.3}%)`,
      `contrast(${100 + contrast}%)`,
      `blur(${exportBlur}px)`,
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
      const gradient = ctx.createRadialGradient(
        scaledWidth / 2, scaledHeight / 2, 0,
        scaledWidth / 2, scaledHeight / 2, Math.max(scaledWidth, scaledHeight) / 2
      )
      gradient.addColorStop(0, `rgba(0, 0, 0, 0)`)
      gradient.addColorStop(1, `rgba(0, 0, 0, ${vignette * 0.01})`)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, scaledWidth, scaledHeight)
    }

    // 应用颗粒效果
    if (grain > 0) {
      const imageData = ctx.getImageData(0, 0, scaledWidth, scaledHeight)
      applyGrain(imageData, grain, Math.round(grain))
      ctx.putImageData(imageData, 0, 0)
    }

    ctx.restore()

    const formatConfig: Record<ExportFormat, { mime: string; quality: number }> = {
      png: { mime: 'image/png', quality: 1 },
      jpg: { mime: 'image/jpeg', quality: 0.9 },
      webp: { mime: 'image/webp', quality: 0.85 },
    }

    const config = formatConfig[format]
    const dataUrl = canvas.toDataURL(config.mime, config.quality)

    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `edited-image-${Date.now()}.${format}`
    link.click()
  } finally {
    canvasStore.isExporting = false
  }
}

const handleExportClick = () => {
  exportImage('jpg')
}

const handleDropdownCommand = (command: string) => {
  exportImage(command as ExportFormat)
}
</script>

<template>
  <div class="topbar" v-loading="canvasStore.isExporting" element-loading-text="导出中...">
    <div class="topbar-section">
      <a href="https://pixel.cg-zhou.top" class="topbar-link" target="_blank" rel="noopener">
        <img src="/src/assets/logo.png" alt="Edge Pixel" class="logo" />
        <span class="topbar-title unselectable">Edge Pixel</span>
      </a>
    </div>

    <div class="topbar-section">
      <el-button type="primary" @click="triggerFileInput">打开图片</el-button>
      <el-dropdown
        :disabled="!canvasStore.imageSrc"
        split-button
        type="primary"
        @click="handleExportClick"
        @command="handleDropdownCommand"
      >
        {{ canvasStore.isExporting ? '下载中...' : '下载图片' }}
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="png">PNG - 无损格式</el-dropdown-item>
            <el-dropdown-item command="jpg">JPG - 通用压缩</el-dropdown-item>
            <el-dropdown-item command="webp">WebP - 最优压缩</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <input ref="fileInput" type="file" accept="image/*" @change="handleFileSelect" style="display: none" />
  </div>
</template>

<style scoped>
.logo {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(58, 90, 106, 0.4));
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

</style>
