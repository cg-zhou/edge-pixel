<script setup lang="ts">
import { computed } from 'vue'
import { useCanvasStore } from '../stores/canvas'

const canvasStore = useCanvasStore()

const params = computed(() => canvasStore.filterParams)

const handleReset = () => {
  canvasStore.resetFilters()
}
</script>

<template>
  <div class="adjust-panel">
    <div class="panel-section">
      <div class="section-title">色相</div>
      <div class="param-item">
        <label class="param-label">旋转</label>
        <el-slider
          v-model="params.hue"
          :min="-180"
          :max="180"
          @input="(v: any) => canvasStore.updateFilter('hue', v)"
        />
        <span class="param-value">{{ params.hue }}°</span>
      </div>
    </div>

    <div class="panel-section">
      <div class="section-title">颜色</div>
      <div class="param-item">
        <label class="param-label">饱和度</label>
        <el-slider
          v-model="params.saturation"
          :min="-100"
          :max="100"
          @input="(v: any) => canvasStore.updateFilter('saturation', v)"
        />
        <span class="param-value">{{ params.saturation }}</span>
      </div>
      <div class="param-item">
        <label class="param-label">亮度</label>
        <el-slider
          v-model="params.brightness"
          :min="-100"
          :max="100"
          @input="(v: any) => canvasStore.updateFilter('brightness', v)"
        />
        <span class="param-value">{{ params.brightness }}</span>
      </div>
    </div>

    <div class="panel-section">
      <div class="section-title">对比</div>
      <div class="param-item">
        <label class="param-label">对比度</label>
        <el-slider
          v-model="params.contrast"
          :min="-100"
          :max="100"
          @input="(v: any) => canvasStore.updateFilter('contrast', v)"
        />
        <span class="param-value">{{ params.contrast }}</span>
      </div>
    </div>

    <div class="panel-section">
      <div class="section-title">效果</div>
      <div class="param-item">
        <label class="param-label">模糊</label>
        <el-slider
          v-model="params.blur"
          :min="0"
          :max="20"
          :step="0.1"
          @input="(v: any) => canvasStore.updateFilter('blur', v)"
        />
        <span class="param-value">{{ params.blur.toFixed(1) }}</span>
      </div>
      <div class="param-item">
        <label class="param-label">透明度</label>
        <el-slider
          v-model="params.opacity"
          :min="0"
          :max="100"
          @input="(v: any) => canvasStore.updateFilter('opacity', v)"
        />
        <span class="param-value">{{ params.opacity }}%</span>
      </div>
    </div>

    <div class="panel-section">
      <el-button type="primary" @click="handleReset">重置</el-button>
    </div>
  </div>
</template>

<style scoped>
.adjust-panel {
  padding: 0;
  height: 100%;
  overflow-y: auto;
}

.panel-section {
  padding: 16px 12px;
  border-bottom: 1px solid #1f2733;
}

.panel-section:first-child {
  padding-top: 12px;
}

.section-title {
  font-weight: 600;
  font-size: 12px;
  color: #b0b8c6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.param-item {
  display: grid;
  grid-template-columns: 60px 1fr 50px;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.param-item:last-child {
  margin-bottom: 0;
}

.param-label {
  font-size: 12px;
  color: #8a93a5;
}

.param-value {
  text-align: right;
  font-size: 12px;
  font-weight: 600;
  color: #7ab7ff;
  font-family: 'Monaco', monospace;
}
</style>
