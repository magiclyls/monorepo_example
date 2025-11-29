<script setup lang="ts">
import dayjs from 'dayjs'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(defineProps<{
  state: 0 | 1 | 2
  unreadCount: number
  id: string
  content: string
  time: number
}>(), {
  state: 0,
  unreadCount: 0,
  id: '',
  content: '',
  created_at: 0,
})
const { t } = useI18n()
const status = {
  1: t('处理中'),
  0: t('待处理'),
  2: t('已处理'),
}

// 根据状态变色
const statusColor = computed(() => {
  return props.state === 0 ? 'text-[#fff]' : 'text-[#FF9800]'
})
</script>

<template>
  <div class="p-[12px] bg-[#2F4553] rounded-[4px] mb-[16px]">
    <!-- 顶部：状态和未读 -->
    <div class="flex justify-between items-start mb-[12px]">
      <div class="text-[14px] text-[#fff]">
        {{ t('反馈状态') }}：
        <span :class="statusColor" class="font-[600] text-[14px]">{{ status[state] }}</span>
      </div>
      <div class="flex items-center text-[14px] text-[#B1BAD3]">
        <span
          v-if="unreadCount > 0"
          class="size-[6px] bg-[#24EE89] rounded-full mr-[4px]"
        />
        <span>{{ unreadCount === 0 ? t('已读') : t('未读') }}</span>
      </div>
    </div>

    <!-- ID -->
    <div class="text-[14px] text-[#fff] mb-[12px] flex justify-between">
      <span>{{ t('反馈ID') }}：{{ id }}</span>
      <span class="text-[#B1BAD3]">{{ dayjs(time * 1000).format('MM/DD HH:mm') }}</span>
    </div>

    <!-- 内容 -->
    <div class="text-[14px] text-[#fff] truncate line-clamp-1">
      {{ t('内容') }}：{{ content }}
    </div>
  </div>
</template>
