<script lang="ts" setup>
// import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import { computed, defineProps } from 'vue'

interface Props {
  // 当前进度
  value: number
  // 最大值
  max?: number
  // 最小值，默认为0
  min?: number
  // 自定义进度条颜色
  barColor?: string
  // 自定义进度条背景颜色
  backgroundColor?: string
  // 进度条高度，默认为 10px
  height?: string
  // 是否显示进度百分比
  showPercentage?: boolean
}

// 默认值设置
const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  barColor: 'linear-gradient(to right, #71ea94, #b0dc86)',
  backgroundColor: '#323536',
  height: '10px',
  showPercentage: true,
})

// 进度
const progress = computed(() => {
  const clampedValue = Math.min(Math.max(props.value, props.min), props.max)
  return (clampedValue - props.min) / (props.max - props.min) * 100
})

// 计算
const progressBarStyle = computed(() => ({
  width: `${progress.value}%`,
  height: props.height,
  background: props.barColor,
}))

const backgroundStyle = computed(() => ({
  width: '100%',
  height: props.height,
  background: props.backgroundColor,
}))
</script>

<template>
  <div class="progress-bar-container" :style="backgroundStyle">
    <div class="progress-bar" :style="progressBarStyle" />
    <span v-if="showPercentage" class="percentage-label text-white">{{ progress }}%</span>
  </div>
</template>

<style scoped lang="scss">
.progress-bar-container {
  display: flex;
  align-items: center;
  /* justify-content: center; */
  border-radius: 10px;
  position: relative;
  width: 100%;
}

.progress-bar {
  border-radius: 10px;
  transition: width 0.3s ease-in-out;
}

.percentage-label {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: bold;
}
</style>
