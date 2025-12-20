<script setup lang="ts">
interface Props {
  label: string
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const handleUpdate = (value: boolean) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="switch-control">
    <div class="switch-item">
      <span class="switch-label">{{ label }}</span>
      <el-switch :model-value="modelValue" size="small" @change="handleUpdate" />
    </div>
  </div>
</template>

<style scoped>
.switch-control {
  width: 100%;
}

.switch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 6px;
}

.switch-label {
  color: #8a93a5;
  font-size: 12px;
}
</style>
