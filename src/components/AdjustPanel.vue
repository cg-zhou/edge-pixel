<script setup lang="ts">
import { computed } from 'vue'
import { useCanvasStore } from '../stores/canvas'
import ParamControl from './ParamControl.vue'

const canvasStore = useCanvasStore()

const params = computed(() => canvasStore.filterParams)

const handleReset = () => {
  canvasStore.resetFilters()
}

const updateValue = (key: keyof typeof params.value, value: number) => {
  canvasStore.updateFilter(key, value)
}

</script>

<template>
  <div class="adjust-panel">
    <!-- 色彩分组 -->
    <div class="panel-group">
      <div class="group-header">色彩</div>
      <div class="group-items">
        <ParamControl label="色调" :model-value="params.hue" :min="-180" :max="180"
          @update:model-value="(v) => updateValue('hue', v)" />
        <ParamControl label="饱和度" :model-value="params.saturation" :min="-100" :max="100"
          @update:model-value="(v) => updateValue('saturation', v)" />
      </div>
    </div>

    <!-- 明度分组 -->
    <div class="panel-group">
      <div class="group-header">明度</div>
      <div class="group-items">
        <ParamControl label="亮度" :model-value="params.brightness" :min="-100" :max="100"
          @update:model-value="(v) => updateValue('brightness', v)" />
        <ParamControl label="对比度" :model-value="params.contrast" :min="-100" :max="100"
          @update:model-value="(v) => updateValue('contrast', v)" />
        <ParamControl label="高光" :model-value="params.highlights" :min="-100" :max="100"
          @update:model-value="(v) => updateValue('highlights', v)" />
        <ParamControl label="阴影" :model-value="params.shadows" :min="-100" :max="100"
          @update:model-value="(v) => updateValue('shadows', v)" />
        <ParamControl label="光感" :model-value="params.exposure" :min="-100" :max="100"
          @update:model-value="(v) => updateValue('exposure', v)" />
      </div>
    </div>

    <!-- 效果分组 -->
    <div class="panel-group">
      <div class="group-header">效果</div>
      <div class="group-items">
        <ParamControl label="模糊" :model-value="params.blur" :min="0" :max="20" :step="0.1"
          @update:model-value="(v) => updateValue('blur', v)" />
        <ParamControl label="颗粒" :model-value="params.grain" :min="0" :max="100"
          @update:model-value="(v) => updateValue('grain', v)" />
        <ParamControl label="褪色" :model-value="params.fade" :min="0" :max="100"
          @update:model-value="(v) => updateValue('fade', v)" />
        <ParamControl label="暗角" :model-value="params.vignette" :min="0" :max="100"
          @update:model-value="(v) => updateValue('vignette', v)" />
      </div>
    </div>

    <!-- 重置按钮 -->
    <div class="panel-footer">
      <el-button type="primary" @click="handleReset">重置</el-button>
    </div>
  </div>
</template>

<style scoped>
.adjust-panel {
  padding: 12px;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel-group {
  border: 1px solid #1f2733;
  border-radius: 4px;
  overflow: hidden;
}

.group-header {
  padding: 8px 12px;
  background-color: rgba(31, 39, 51, 0.5);
  font-weight: 600;
  font-size: 12px;
  color: #b0b8c6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #1f2733;
}

.group-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid #1f2733;

  &:last-child {
    border-bottom: none;
  }
}

.param-control {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.param-label {
  font-size: 11px;
  color: #8a93a5;
  white-space: nowrap;
}

.panel-footer {
  padding: 8px;
  text-align: center;
}
</style>
