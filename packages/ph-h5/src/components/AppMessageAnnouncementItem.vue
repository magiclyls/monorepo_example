<script setup lang='ts'>
import type { IMemberNoticeItem } from '@tg/types'
import { IconUniNotice2 } from '@tg/icons'
import { getPlainTextFromHtml } from '@tg/utils'
import { timeToFromNow } from '@tg/vue-i18n'

interface Props {
  data: IMemberNoticeItem
}

defineOptions({ name: 'AppMessageAnnouncementItem' })
defineProps<Props>()
</script>

<template>
  <div class="flex w-full h-[70rem] rounded-[4px] overflow-hidden">
    <div class="flex-none h-full flex items-center text-[20rem] justify-center bg-[#EBEBEB] w-[62rem]">
      <IconUniNotice2 :class="data.read ? 'text-[#9DABC8]' : 'text-[#F23038]'" />
    </div>
    <div class="flex grow h-full bg-[#fff] items-center " style="max-width: calc(100% - 62rem);">
      <div class="w-full h-full flex items-center">
        <div class="flex flex-col overflow-hidden w-full">
          <div class="px-[14rem] mb-[2rem] flex text-[14rem] font-[500] leading-[20rem] items-center justify-between">
            <div class="overflow-hidden whitespace-nowrap text-ellipsis max-w-[80%] text-[#0D2245]">
              <span>{{ data.title }}</span>
            </div>
            <span class="flex-none flex items-center ml-[8rem]">
              <span
                v-show="!data.read"
                class="inline-block w-[6rem] h-[6rem] bg-[#F23038] rounded-[50%] mr-[4rem]"
              />
              {{ timeToFromNow(data.start_time ?? data.created_at) }}
            </span>
          </div>
          <div
            class="px-[14rem] leading-[20rem] w-full text-[#6D7693]  overflow-hidden whitespace-nowrap text-ellipsis"
          >
            {{ getPlainTextFromHtml(data.content) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped></style>
