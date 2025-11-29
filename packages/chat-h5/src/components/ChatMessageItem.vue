<script setup lang='ts'>
import { BaseImage } from '@tg/bccomponents'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

interface Props {
  /** 客服、用户 */
  role: 'robot' | 'user'
  text: string[]
  name: string
  time: string
  avatar: string
  isH5?: boolean
}

defineOptions({ name: 'ChatMessageItem' })
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'linkClick', text: string): void
}>()

const isRobot = computed(() => props.role === 'robot')
const messageContainerRef = ref<HTMLDivElement>()
const messageTextRefs = ref<Map<number, HTMLDivElement>>(new Map())
const messageTimeRefs = ref<Map<number, HTMLSpanElement>>(new Map())
const timeTopMap = ref<Map<number, string>>(new Map())

function isPlainText(text: string): boolean {
  if (!text)
    return true
  // 檢查是否包含 HTML 標籤
  const htmlTagRegex = /<[^>]+>/
  return !htmlTagRegex.test(text)
}

function getTimeTop(index: number, text: string): string {
  return timeTopMap.value.get(index) || (isPlainText(text) ? '12px' : '1px')
}

function checkTimeOverflow(index: number) {
  nextTick(() => {
    const textRef = messageTextRefs.value.get(index)
    const timeRef = messageTimeRefs.value.get(index)

    if (textRef && timeRef) {
      const textRect = textRef.getBoundingClientRect()
      const timeRect = timeRef.getBoundingClientRect()

      // 檢查時間的底部是否超出 message-text 的底部
      const isOverflow = timeRect.bottom > textRect.bottom

      if (isOverflow) {
        timeTopMap.value.set(index, '1px')
      }
      else {
        // 如果沒有超出，根據是否為純文字設置
        const text = props.text[index] || ''
        timeTopMap.value.set(index, isPlainText(text) ? '12px' : '1px')
      }
    }
  })
}

const formattedTime = computed(() => {
  if (!props.time)
    return props.time

  // 嘗試解析時間格式（可能是 "HH:mm" 或 "HH:mm:ss"）
  const timeMatch = props.time.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/)
  if (!timeMatch)
    return props.time

  const hours = Number.parseInt(timeMatch[1], 10)
  const minutes = timeMatch[2]
  const seconds = timeMatch[3] || ''

  // 轉換為 12 小時制
  const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  const ampm = hours < 12 ? 'AM' : 'PM'

  // 返回格式：h:mm AM/PM 或 h:mm:ss AM/PM
  return seconds ? `${hour12}:${minutes}:${seconds} ${ampm}` : `${hour12}:${minutes} ${ampm}`
})

function handleMessageClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  const submitLink = target.closest('.submitLink')

  if (submitLink) {
    event.preventDefault()
    event.stopPropagation()

    // 獲取鏈接的文字內容
    const linkText = submitLink.textContent?.trim() || ''
    if (linkText) {
      emit('linkClick', linkText)
    }
  }
}

onMounted(() => {
  nextTick(() => {
    if (messageContainerRef.value) {
      messageContainerRef.value.addEventListener('click', handleMessageClick)
    }
    // 為每個消息項初始化並檢查位置
    props.text.forEach((text, index) => {
      const initialTop = isPlainText(text) ? '12px' : '1px'
      timeTopMap.value.set(index, initialTop)
      checkTimeOverflow(index)
    })
  })
})

// 監聽 text 變化，重新檢查位置
watch(() => props.text, () => {
  nextTick(() => {
    props.text.forEach((text, index) => {
      checkTimeOverflow(index)
    })
  })
}, { deep: true })

onUnmounted(() => {
  if (messageContainerRef.value) {
    messageContainerRef.value.removeEventListener('click', handleMessageClick)
  }
})
</script>

<template>
  <div class="w-full flex items-end gap-[3px]">
    <div class="w-[40px] flex-none">
      <BaseImage v-if="isRobot && avatar" class="flex-none rounded-[40px] overflow-hidden" width="40px" height="40px" :url="avatar" is-network />
      <BaseImage v-else-if="isRobot" class="flex-none rounded-[40px] overflow-hidden" width="40px" height="40px" :url="isH5 ? '/m/chat-h5/png/avatar.png' : '/chat-h5/png/avatar.png'" />
    </div>
    <div ref="messageContainerRef" :class="role">
      <div v-for="t, i in props.text" :key="t" class="item">
        <span v-if="isRobot" class="text-[#24EE89] font-[500] leading-[20px] mb-[4px]">{{ props.name }}</span>
        <div class="message-body">
          <div :ref="(el) => { if (el) messageTextRefs.set(i, el as HTMLDivElement) }" class="message-text clearfix leading-[20px]">
            <div class="text-content" v-html="t" />
            <span :ref="(el) => { if (el) messageTimeRefs.set(i, el as HTMLSpanElement) }" class="message-time" :style="{ top: getTimeTop(i, t) }">{{ formattedTime }}</span>
          </div>
        </div>
        <!-- 小尾巴 -->
        <template v-if="i === props.text.length - 1">
          <div v-if="isRobot" class="absolute left-[-7px] bottom-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18" fill="none">
              <path
                d="M6.54371 10.7995C7.08322 9.19954 7.27204 2.93319 7.04725 0C13.0873 3.59982 24.0604 11.1994 17.6174 14.3993C9.56353 18.3991 5.53579 17.5991 -2.86102e-05 17.9991C3.02098 15.9992 5.86933 12.7994 6.54371 10.7995Z"
                fill="#213743"
              />
            </svg>
          </div>
          <div v-else class="absolute right-[-5px] bottom-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
              <path
                d="M10.3589 10.7995C9.93016 9.19954 9.78012 2.93319 9.95875 0C5.15925 3.59982 -3.56015 11.1994 1.5596 14.3993C7.95928 18.3991 11.1598 17.5991 15.5586 17.9991C13.1581 15.9992 10.8947 12.7994 10.3589 10.7995Z"
                fill="#1475E1"
              />
            </svg>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.item {
  padding: 4px 10px 5px;
  position: relative;
  max-width: 100%;
  min-height: 20px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  margin-bottom: 4px;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.message-body {
  word-break: break-word;
}

.message-text {
  min-width: 0;

  :deep(.submitLink) {
    color: #24ee89;
    text-decoration: underline;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }

    &:active {
      opacity: 0.6;
    }
  }
}

.text-content {
  display: inline;
  word-break: break-word;
}

.message-time {
  position: relative;
  float: right;
  font-size: 8px;
  opacity: 0.5;
  line-height: 1;
  white-space: nowrap;
  margin-left: 4px;
}

.robot {
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  color: #e8faff;
  font-size: 14px;
  padding-left: 6px;

  .item {
    background-color: #213743;
  }
}

.user {
  display: flex;
  flex-direction: column;
  align-items: end;
  width: 100%;
  color: #e8faff;
  font-size: 14px;
  padding-right: 6px;

  .item {
    background-color: #1475e1;
    padding: 4px 10px;
    border-radius: 20px 16px 16px 20px;
  }
}
</style>
