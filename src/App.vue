<script setup lang="ts">
import EditorToolbar from './components/EditorToolbar.vue'
import CanvasStage from './components/CanvasStage.vue'
import AdjustPanel from './components/AdjustPanel.vue'
</script>

<template>
  <div class="editor-container">
    <EditorToolbar />
    <div class="editor-main">
      <CanvasStage />
      <AdjustPanel />
    </div>
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
