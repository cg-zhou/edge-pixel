<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const count = ref(0)
const loading = ref(false)
const dialogVisible = ref(false)

const handleClick = () => {
  count.value++
}

const handleButtonClick = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('操作成功！')
  }, 2000)
}

const handleDialog = () => {
  dialogVisible.value = true
}
</script>

<template>
  <div class="container">
    <h1>Element Plus 组件测试</h1>
    
    <!-- 按钮组件 -->
    <div class="section">
      <h2>按钮</h2>
      <el-button type="primary" @click="handleClick">主按钮 (已点击 {{ count }} 次)</el-button>
      <el-button>默认按钮</el-button>
      <el-button type="success">成功按钮</el-button>
      <el-button type="warning">警告按钮</el-button>
      <el-button type="danger">危险按钮</el-button>
    </div>

    <!-- 加载按钮 -->
    <div class="section">
      <h2>加载状态按钮</h2>
      <el-button type="primary" :loading="loading" @click="handleButtonClick">
        {{ loading ? '加载中...' : '点击加载' }}
      </el-button>
    </div>

    <!-- 输入框 -->
    <div class="section">
      <h2>输入框</h2>
      <el-input placeholder="请输入内容"></el-input>
      <el-input placeholder="请输入密码" show-password type="password"></el-input>
    </div>

    <!-- 选择框 -->
    <div class="section">
      <h2>选择框</h2>
      <el-select placeholder="请选择">
        <el-option label="选项1" value="1"></el-option>
        <el-option label="选项2" value="2"></el-option>
        <el-option label="选项3" value="3"></el-option>
      </el-select>
    </div>

    <!-- 对话框 -->
    <div class="section">
      <h2>对话框</h2>
      <el-button @click="handleDialog">打开对话框</el-button>
      <el-dialog v-model="dialogVisible" title="测试对话框">
        <p>这是一个 Element Plus 对话框</p>
        <template #footer>
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="dialogVisible = false">确定</el-button>
        </template>
      </el-dialog>
    </div>

    <!-- 警告框 -->
    <div class="section">
      <h2>警告框</h2>
      <el-alert title="成功提示" type="success" description="这是一个成功提示"></el-alert>
      <el-alert title="信息提示" type="info" description="这是一个信息提示"></el-alert>
      <el-alert title="警告提示" type="warning" description="这是一个警告提示"></el-alert>
      <el-alert title="错误提示" type="error" description="这是一个错误提示"></el-alert>
    </div>

    <!-- 卡片 -->
    <div class="section">
      <h2>卡片</h2>
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>卡片标题</span>
          </div>
        </template>
        <p>这是卡片的内容区域</p>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.section {
  background-color: #f5f5f5;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
}

.section h2 {
  color: #333;
  font-size: 18px;
  margin-bottom: 15px;
}

:deep(.el-button + .el-button) {
  margin-left: 10px;
}

:deep(.el-input) {
  width: 200px;
  margin-right: 20px;
}

:deep(.el-select) {
  width: 200px;
}

:deep(.el-alert) {
  margin-bottom: 10px;
}

:deep(.el-alert:last-child) {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.box-card) {
  width: 100%;
}
</style>
