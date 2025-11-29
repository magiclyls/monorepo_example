<script lang="ts" setup>
import { BaseButton, BaseImage } from '@tg/bccomponents'
import { computed } from 'vue'

type Size = number | `${number}px` | `${number}rem`

interface Task {
  title: string
  /** 当前进度 */
  progressCurrent?: number
  /** 总进度 */
  progressTotal?: number
  /** 按钮文案，默认 '立刻邀请' */
  buttonText?: string
  /** 是否禁用按钮 */
  disabled?: boolean
  /** 是否 loading（按钮显示省略号） */
  loading?: boolean
  /** 外层卡片圆角，默认 12px */
  radius?: Size
  /** 外层内边距，默认 14px 16px */
  padding?: string
}

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const progressText = computed(() => {
  const cur = props.task.progressCurrent ?? 0
  const total = props.task.progressTotal ?? 0
  return `${cur}/${total}`
})

function onClick() {
  if (props.task.disabled || props.task.loading)
    return
  emit('click')
}
</script>

<template>
  <div class="itc-wrap">
    <!-- 顶部：标题 + 进度 -->
    <div class="itc-head">
      <div class="itc-title" :title="task.title">
        {{ task.title }}
      </div>
      <div class="itc-progress">
        {{ progressText }}
      </div>
    </div>

    <!-- 底部：奖励 + 按钮 -->
    <div class="itc-foot">
      <div class="itc-reward">
        <BaseImage class="mx-[2px] mb-[3px] w-[27px]" url="/activity/png/word-collection/coupon.png" />
        <span class="itc-reward-text ml-[2px]">x1</span>
      </div>
      <BaseButton size="xs" bg-style="secondary" class="h-[28px]" style="--tg-base-button-padding-x: 20px;" @click="onClick">
        {{ task.buttonText }}
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
/* 容器 */
.itc-wrap {
  background: #213743; /* 深色卡片 */
  border-radius: 4px;
  padding: 8px 10px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.15) inset;
}

/* 头部行：标题 + 进度 */
.itc-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  line-height: 20px;
}
.itc-title {
  color: #b1bad3;
  font-size: 14px;
  line-height: 1.2;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.itc-progress {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

/* 底部行：奖励 + 按钮 */
.itc-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
}
.itc-reward {
  display: inline-flex;
  align-items: center;
  color: #ffffff;
  font-weight: 700;
}
.itc-reward-icon {
  width: 28px;
  height: 20px;
  object-fit: contain;
}
.itc-reward-text {
  font-size: 15.4px;
  font-weight: 400;
}

/* 按钮（亮绿） */
.itc-btn {
  appearance: none;
  border: 0;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 16px;
  font-weight: 800;
  color: #03210a;
  background: #10e000; /* 纯色亮绿 */
  box-shadow:
    0 4px 0 #08b300 inset,
    0 2px 8px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition:
    transform 0.06s ease,
    filter 0.2s ease,
    opacity 0.2s;
}
.itc-btn:hover {
  filter: brightness(1.05);
}
.itc-btn:active {
  transform: translateY(1px);
}
.itc-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.itc-loading-dot {
  letter-spacing: 2px;
}

/* 自定义尺寸支持（可通过 style 传入） */
:host,
.itc-wrap {
  --itc-radius: 12px;
  --itc-padding: 14px 16px;
}
</style>
