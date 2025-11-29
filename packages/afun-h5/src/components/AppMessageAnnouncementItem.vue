<script setup lang='ts'>
import type { IMemberNoticeItem } from '@tg/types'
import { IconUniArrowRight, IconUniNotice2 } from '@tg/icons'
import { timeToFromNow } from '@tg/vue-i18n'
import { onMounted, ref } from 'vue'

interface Props {
  data: IMemberNoticeItem
}

defineOptions({ name: 'AppMessageAnnouncementItem' })
const props = defineProps<Props>()
const emit = defineEmits(['ready'])
const contentRef = ref<HTMLElement>()
const isOverThreeLines = ref(false)

onMounted(() => {
  // 檢測內容是否超過三行或有圖片
  if (contentRef.value) {
    const clientHeight = contentRef.value.clientHeight
    const scrollHeight = contentRef.value.scrollHeight
    isOverThreeLines.value = scrollHeight > clientHeight || !!props.data.image_url
  }
})

function onClickItem() {
  if (props.data.read === false) {
    emit('ready', props.data)
  }
}
</script>

<template>
  <div class="flex w-full h-[62rem] rounded-[4px] overflow-hidden" @click="onClickItem">
    <div class="flex-none h-full flex items-center text-[20rem] justify-center bg-[#213743] w-[62rem]">
      <IconUniNotice2 :class="data.read ? 'text-[#B1BAD3]' : 'text-[#24EE89]'" />
    </div>
    <div class="flex grow h-full bg-[#2F4553] items-center" style="max-width: calc(100% - 62rem);">
      <div class="w-full h-full flex items-center">
        <div class="flex flex-col overflow-hidden w-full">
          <div class="px-[12rem] mb-[2rem] flex text-[14rem] font-[500] leading-[20rem] items-center justify-between">
            <div class="overflow-hidden whitespace-nowrap text-ellipsis max-w-[80%] text-[#fff]">
              <span>{{ data.title }}</span>
            </div>
            <span class="flex-none flex items-center ml-[8rem] text-[#B1BAD3] font-[400] text-[12rem]">
              <span
                v-show="!data.read"
                class="inline-block w-[6rem] h-[6rem] bg-[#24EE89] rounded-[50%] mr-[4rem]"
              />
              {{ timeToFromNow(data.start_time ?? data.created_at) }}
              <IconUniArrowRight class="text-[14px] text-[#B1BAD3] ml-[6rem]" />
            </span>
          </div>
          <div ref="contentRef" class="px-[12rem] leading-[20rem] w-full line-clamp-1 text-[#B1BAD3] overflow-hidden text-ellipsis" style="line-height: normal;" v-html="data.content" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped></style>
