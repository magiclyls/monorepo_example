<script setup lang="ts">
import { IconUniNotice } from '@tg/icons'

const text = ref('金蛇狂舞迎新年，天降祥瑞满人间。瑞雪红梅嫌意浓，春风得意乐无边。')
</script>

<template>
  <div class="notification-box">
    <!-- 左侧图标 -->
    <div class="icon">
      <IconUniNotice name="uni-notice" />
    </div>
    <!-- 文字滚动区域 -->
    <div class="text-container">
      <div class="text">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.notification-box {
  width: 100%;
  height: 1.8rem;
  border-radius: 4px;
  background: var(--tg-secondary-dark);
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.icon {
  padding: 0 10px;
  font-size: 18px;
}

.text-container {
  flex: 1;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.text {
  height: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
  position: absolute;
  top: 0;
  left: 100%; /* 初始位置在右侧 */
  color: white;
  font-size: 14px;
  animation: scrollText 10s linear infinite; /* 10s 是滚动时间 */
}

@keyframes scrollText {
  0% {
    transform: translateX(0); /* 从右侧开始 */
  }
  100% {
    transform: translateX(-500%); /* 滚动到左侧 */
  }
}
</style>
