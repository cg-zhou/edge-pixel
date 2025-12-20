<script setup lang="ts">

interface Props {
  label: string
  modelValue: number
  min: number
  max: number
  step?: number
}

const props = withDefaults(defineProps<Props>(), {
  step: 1,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const handleUpdate = (value: number) => {
  emit('update:modelValue', value)
}

</script>

<template>
  <div class="param-control">
    <div class="param-item">
      <label class="param-label">{{ label }}</label>
      <el-slider class="param-slider" :model-value="modelValue" :min="min" :max="max" :step="step" show-input
        size="small" @input="handleUpdate" />
    </div>
  </div>
</template>

<style scoped>
.param-control {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;

  :deep(.el-slider__input) {
    width: 90px;
  }

  :deep(.el-slider__runway.show-input) {
    margin-right: 10px;
  }
}

.param-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 8px;
}

.param-label {
  font-size: 11px;
  color: #8a93a5;
  white-space: nowrap;
  width: 34px;
}

.param-slider {
  flex: 1;

  :deep(.el-slider__bar) {
    background-color: #409eff;
  }
}

.param-input {
  width: 70px;

  :deep(.el-input__inner) {
    padding: 4px 8px;
    font-size: 12px;
  }
}
</style>
