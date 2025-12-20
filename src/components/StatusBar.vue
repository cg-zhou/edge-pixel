<script setup lang="ts">
import { useCanvasStore } from '../stores/canvas'

const canvasStore = useCanvasStore()

const getImageInfo = () => {
  if (!canvasStore.originalImage || !canvasStore.imageSrc) {
    return 'No image'
  }

  const img = canvasStore.originalImage
  const width = img.width
  const height = img.height
  const filename = canvasStore.fileName || 'demo.jpg'

  return `${filename} | ${width} x ${height} px`
}
</script>

<template>
  <div class="status-bar">
    <span class="status-info">{{ getImageInfo() }}</span>
  </div>
</template>

<style scoped>
.status-bar {
  height: 36px;
  border-top: 1px solid #404040;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 13px;
}

.status-info {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
