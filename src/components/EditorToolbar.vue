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

const handleExport = () => {
  const canvas = document.querySelector('canvas') as HTMLCanvasElement
  if (!canvas) return

  isExporting.value = true
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = `edited-image-${Date.now()}.png`
  link.click()

  setTimeout(() => {
    isExporting.value = false
  }, 500)
}
</script>

<template>
  <div class="topbar">
    <div class="topbar-section">
      <!-- <img src="assets/logo.png" alt="Edge Pixel" class="logo" /> -->
      <span class="topbar-title">Edge Pixel</span>
    </div>

    <div class="topbar-section">
      <el-button type="primary" @click="triggerFileInput">导入图片</el-button>
      <el-button
        :disabled="!canvasStore.imageSrc || isExporting"
        @click="handleExport"
      >
        {{ isExporting ? '导出中...' : '导出' }}
      </el-button>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      @change="handleFileSelect"
      style="display: none"
    />
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
