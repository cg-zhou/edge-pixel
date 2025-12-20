<script setup lang="ts">
import { computed } from 'vue'
import { useCanvasStore } from '../stores/canvas'
import ParamControl from './ParamControl.vue'
import SwitchControl from './SwitchControl.vue'

const canvasStore = useCanvasStore()

const updateValue = (key: 'scale' | 'rotate' | 'flipH' | 'flipV', value: number | boolean) => {
  canvasStore.updateTransform(key, value)
}

const handleResetTransform = () => {
  canvasStore.resetTransform()
}

const rotateQuickly = (angle: number) => {
  const newRotate = canvasStore.rotate + angle
  const normalized = newRotate > 180 ? newRotate - 360 : newRotate < -180 ? newRotate + 360 : newRotate
  canvasStore.updateTransform('rotate', normalized)
}

// 计算实时的宽高
const dimensions = computed(() => {
  const img = canvasStore.originalImage
  if (!img) {
    return { width: 0, height: 0 }
  }
  const scale = canvasStore.scale / 100
  return {
    width: Math.round(img.width * scale),
    height: Math.round(img.height * scale),
  }
})
</script>

<template>
  <div class="transform-panel">
    <!-- 缩放分组 -->
    <div class="panel-group">
      <div class="group-header">缩放</div>
      <div class="group-items">
        <ParamControl label="缩放" :model-value="canvasStore.scale" :min="10" :max="200"
          @update:model-value="(v) => updateValue('scale', v)" />

        <!-- 显示实时尺寸 -->
        <div class="dimensions-display">
          <span class="dimension-label">尺寸：</span>
          <span class="dimension-value">{{ dimensions.width }} × {{ dimensions.height }}px</span>
        </div>
      </div>
    </div>

    <!-- 旋转分组 -->
    <div class="panel-group">
      <div class="group-header">旋转</div>
      <div class="group-items">
        <ParamControl label="旋转" :model-value="canvasStore.rotate" :min="-180" :max="180"
          @update:model-value="(v) => updateValue('rotate', v)" />

        <div class="quick-buttons">
          <el-button size="small" type="primary" @click="rotateQuickly(90)">右旋 90°</el-button>
          <el-button size="small" type="primary" @click="rotateQuickly(-90)">左旋 90°</el-button>
        </div>
      </div>
    </div>

    <!-- 翻转分组 -->
    <div class="panel-group">
      <div class="group-header">翻转</div>
      <div class="group-items">
        <SwitchControl label="水平翻转" :model-value="canvasStore.flipH"
          @update:model-value="(v) => updateValue('flipH', v)" />
        <SwitchControl label="垂直翻转" :model-value="canvasStore.flipV"
          @update:model-value="(v) => updateValue('flipV', v)" />
      </div>
    </div>

    <!-- 重置按钮 -->
    <div class="panel-footer">
      <el-button type="primary" @click="handleResetTransform">重置</el-button>
    </div>
  </div>
</template>

<style scoped>
.transform-panel {
  padding: 12px;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: #0d1117;
}

.panel-group {
  border: 1px solid #303844;
  border-radius: 6px;
  background-color: #0d1117;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 10px;
}

.group-header {
  padding: 10px 12px;
  background: linear-gradient(135deg, #1f2733 0%, #16202b 100%);
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid #303844;
}

.group-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
}

.quick-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.dimensions-display {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.dimension-label {
  color: #8a93a5;
  font-size: 11px;
  padding: 4px 6px;
}

.dimension-value {
  font-weight: normal;
}

.panel-footer {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
  margin-top: auto;
}
</style>
