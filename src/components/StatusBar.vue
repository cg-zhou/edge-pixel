<script setup lang="ts">
import { useCanvasStore } from '../stores/canvas'
import { computed } from 'vue'

const canvasStore = useCanvasStore()

const imageInfo = computed(() => {
  if (!canvasStore.originalImage || !canvasStore.imageSrc) {
    return {
      filename: 'No image',
      resolution: '',
      filesize: '',
      hasImage: false,
    }
  }

  const img = canvasStore.originalImage
  const width = img.width
  const height = img.height
  const filename = canvasStore.fileName || 'demo.jpg'

  // 计算文件大小（字节转 KB/MB）
  let filesizeStr = ''
  if (canvasStore.imageSize > 0) {
    if (canvasStore.imageSize > 1024 * 1024) {
      filesizeStr = (canvasStore.imageSize / (1024 * 1024)).toFixed(2) + ' MB'
    } else if (canvasStore.imageSize > 1024) {
      filesizeStr = (canvasStore.imageSize / 1024).toFixed(2) + ' KB'
    } else {
      filesizeStr = canvasStore.imageSize + ' B'
    }
  }

  return {
    filename,
    resolution: `${width} × ${height} px`,
    filesize: filesizeStr,
    hasImage: true,
  }
})
</script>

<template>
  <div class="status-bar">
    <div class="status-left">
      <span v-if="imageInfo.hasImage" class="status-group">
        <span class="label">文件:</span>
        <span class="value">{{ imageInfo.filename }}</span>
      </span>
      <span v-if="imageInfo.resolution" class="status-group">
        <span class="label">尺寸:</span>
        <span class="value">{{ imageInfo.resolution }}</span>
      </span>
      <span v-if="imageInfo.filesize" class="status-group">
        <span class="label">大小:</span>
        <span class="value">{{ imageInfo.filesize }}</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.status-bar {
  height: 40px;
  border-top: 1px solid #404040;
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-size: 12px;
  background: var(--card-bg);
  box-shadow: 0 -2px 8px var(--shadow-color);
}

.status-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.status-group {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.label {
  color: var(--text-tertiary);
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value {
  color: var(--text-secondary);
}
</style>
