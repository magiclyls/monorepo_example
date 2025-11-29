<script setup lang="ts">
import { BaseImage } from '@tg/bccomponents'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
function navigateBack() {
  console.log('navigateBack')
  router.back()
}
</script>

<template>
  <!-- 顶部导航 -->
  <div class="header">
    <div class="back-btn" @click="navigateBack">
      <BaseImage width="6px" url="/img/h5/affiliate-program/arrow-left.png" />
    </div>
    <div class="title">
      {{ route.meta.title || '联盟计划' }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.header {
  background-color: #323738;
  height: 48px;
  display: flex;
  align-items: center;
  position: relative;

  .back-btn {
    position: absolute;
    left: 15px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #b3bec1;
    font-size: 14px;
    background-color: #4a5354;
    border-radius: 4px;
    cursor: pointer;
  }

  .title {
    width: 100%;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
