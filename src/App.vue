<script setup lang="ts">
import { onMounted } from 'vue'
import EditorToolbar from './components/EditorToolbar.vue'
import CanvasStage from './components/CanvasStage.vue'
import AdjustPanel from './components/AdjustPanel.vue'
import StatusBar from './components/StatusBar.vue'
import { useCanvasStore } from './stores/canvas'
import demoDemoJpg from './assets/demo.jpg'

const canvasStore = useCanvasStore()

onMounted(() => {
  // 首次打开时加载 demo 图片
  canvasStore.setImage(demoDemoJpg, 'demo.jpg')
})
</script>

<template>
  <div class="editor-container">
    <EditorToolbar />
    <div class="editor-main">
      <CanvasStage />
      <AdjustPanel />
    </div>
    <StatusBar />
  </div>
</template>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.editor-main {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 0;
  flex: 1;
  overflow: hidden;
}
</style>
