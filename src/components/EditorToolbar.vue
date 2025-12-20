<script setup lang="ts">
import { ref } from 'vue'
import { useCanvasStore } from '../stores/canvas'

const canvasStore = useCanvasStore()
const fileInput = ref<HTMLInputElement | null>(null)
const isExporting = ref(false)

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

const exportImage = (format: ExportFormat = 'jpg') => {
  const canvas = document.querySelector('canvas') as HTMLCanvasElement
  if (!canvas) return

  isExporting.value = true

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

  setTimeout(() => {
    isExporting.value = false
  }, 500)
}

const handleExportClick = () => {
  exportImage('jpg')
}

const handleDropdownCommand = (command: string) => {
  exportImage(command as ExportFormat)
}
</script>

<template>
  <div class="topbar">
    <div class="topbar-section">
      <!-- <img src="assets/logo.png" alt="Edge Pixel" class="logo" /> -->
      <span class="topbar-title">Edge Pixel</span>
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
        {{ isExporting ? '下载中...' : '下载图片' }}
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
