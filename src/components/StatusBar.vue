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
        <span>{{ imageInfo.filename }}</span>
      </span>
      <span v-if="imageInfo.resolution" class="status-group">
        <span class="label">尺寸:</span>
        <span>{{ imageInfo.resolution }}</span>
      </span>
      <span v-if="imageInfo.filesize" class="status-group">
        <span class="label">大小:</span>
        <span>{{ imageInfo.filesize }}</span>
      </span>
    </div>
    <div class="status-right">
      <span class="status-group">
        <span class="label">DEV:</span>
        <a href="https://cg-zhou.top" target="_blank" class="value author-link">cg-zhou</a>
      </span>
    </div>
  </div>
</template>

<style scoped>
.status-bar {
  height: 40px;
  border-top: 1px solid var(--sys-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  font-size: 12px;
  background: color-mix(in srgb, var(--sys-bg-card) 92%, transparent);
  box-shadow: var(--sys-shadow-soft);
}

.status-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.status-right {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
  flex-shrink: 0;
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
  font-weight: bold;
  letter-spacing: 0.5px;
  color: var(--sys-text-secondary);
}

.author-link {
  color: var(--el-text-color-primary);
  cursor: pointer;
  transition: color 0.2s ease;
}

.author-link:hover {
  color: var(--sys-color-primary);
  text-decoration: underline;
}
</style>
