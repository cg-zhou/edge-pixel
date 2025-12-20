<script setup lang="ts">
import { ref } from 'vue'
import { useCanvasStore } from '../stores/canvas'
import ParamControl from './ParamControl.vue'
import TransformPanel from './TransformPanel.vue'

const canvasStore = useCanvasStore()
const activeTab = ref('effects')

const handleReset = () => {
  canvasStore.resetFilters()
}

const updateValue = (key: keyof typeof canvasStore.filterParams, value: number) => {
  canvasStore.updateFilter(key, value)
}

</script>

<template>
  <div class="adjust-panel">
    <el-tabs v-model="activeTab" class="tabs-container" type="card">
      <!-- 图像 Tab -->
      <el-tab-pane label="图像" name="effects">
        <div class="tab-content">
          <!-- 色彩分组 -->
          <div class="panel-group">
            <div class="group-header">色彩</div>
            <div class="group-items">
              <ParamControl label="色调" :model-value="canvasStore.filterParams.hue" :min="-180" :max="180"
                @update:model-value="(v) => updateValue('hue', v)" />
              <ParamControl label="饱和度" :model-value="canvasStore.filterParams.saturation" :min="-100" :max="100"
                @update:model-value="(v) => updateValue('saturation', v)" />
            </div>
          </div>

          <!-- 明度分组 -->
          <div class="panel-group">
            <div class="group-header">明度</div>
            <div class="group-items">
              <ParamControl label="亮度" :model-value="canvasStore.filterParams.brightness" :min="-100" :max="100"
                @update:model-value="(v) => updateValue('brightness', v)" />
              <ParamControl label="对比度" :model-value="canvasStore.filterParams.contrast" :min="-100" :max="100"
                @update:model-value="(v) => updateValue('contrast', v)" />
              <ParamControl label="高光" :model-value="canvasStore.filterParams.highlights" :min="-100" :max="100"
                @update:model-value="(v) => updateValue('highlights', v)" />
              <ParamControl label="阴影" :model-value="canvasStore.filterParams.shadows" :min="-100" :max="100"
                @update:model-value="(v) => updateValue('shadows', v)" />
              <ParamControl label="光感" :model-value="canvasStore.filterParams.exposure" :min="-100" :max="100"
                @update:model-value="(v) => updateValue('exposure', v)" />
            </div>
          </div>

          <!-- 效果分组 -->
          <div class="panel-group">
            <div class="group-header">效果</div>
            <div class="group-items">
              <ParamControl label="模糊" :model-value="canvasStore.filterParams.blur" :min="0" :max="20" :step="0.1"
                @update:model-value="(v) => updateValue('blur', v)" />
              <ParamControl label="颗粒" :model-value="canvasStore.filterParams.grain" :min="0" :max="100"
                @update:model-value="(v) => updateValue('grain', v)" />
              <ParamControl label="褪色" :model-value="canvasStore.filterParams.fade" :min="0" :max="100"
                @update:model-value="(v) => updateValue('fade', v)" />
              <ParamControl label="暗角" :model-value="canvasStore.filterParams.vignette" :min="0" :max="100"
                @update:model-value="(v) => updateValue('vignette', v)" />
            </div>
          </div>

          <!-- 重置按钮 -->
          <div class="panel-footer">
            <el-button type="primary" @click="handleReset">重置</el-button>
          </div>
        </div>
      </el-tab-pane>

      <!-- 变换 Tab -->
      <el-tab-pane label="变换" name="transform">
        <TransformPanel />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.adjust-panel {
  padding: 0;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #0d1117;
}

.tabs-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tabs-container :deep(.el-tabs__content) {
  flex: 1;
  overflow-y: auto;
}

.tab-content {
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.panel-group {
  border: 1px solid #303844;
  border-radius: 6px;
  background-color: #0d1117;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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

.param-control {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.param-label {
  color: #8a93a5;
  white-space: nowrap;
}

.panel-footer {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
  padding: 0 12px;
}
</style>
