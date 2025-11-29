<script lang="ts" setup>
import { AfunBaseImage } from '@tg/bccomponents'
import { IconForgetClose } from '@tg/icons'
import { useDownloadStore, useNotLoginReloadDialog } from '@tg/stores'
import { isIos } from '@tg/utils'

import { storeToRefs } from 'pinia'

const downloadStore = useDownloadStore()
const { dialogDownLoadData } = storeToRefs(downloadStore)

const notLoginReloadDialog = useNotLoginReloadDialog()

function closeIconClick() {
  notLoginReloadDialog.next()
}
</script>

<template>
  <div>
    <div
      class=" min-h-[140px] border rounded-[12px] border-solid p-[12px] pt-[20px] font-[600]"
      :style="{
        backgroundColor: dialogDownLoadData.bgColor,
        backgroundImage: dialogDownLoadData.bgColorType === 'gradient' ? dialogDownLoadData.bgGradientColor : '',
      }"
    >
      <div class="mb-[16px] w-full flex flex-1 overflow-hidden items-center">
        <div class="mr-[14px] h-[56px] w-[56px] flex-shrink-0">
          <AfunBaseImage class="h-[56px] w-[56px]" fit="cover" is-network :url="dialogDownLoadData.icon" />
        </div>
        <div class="text-[16px] flex-1 overflow-hidden">
          <div class="truncate w-full" :style="{ color: dialogDownLoadData.titleColor }">
            {{ dialogDownLoadData.title }}
          </div>
          <div class="truncate w-full" :style="{ color: dialogDownLoadData.contentColor }">
            {{ dialogDownLoadData.content }}
          </div>
        </div>
      </div>
      <div
        class="h-[36px] flex  cursor-pointer items-center justify-center rounded-[6px]"
        :style="{
          backgroundColor: dialogDownLoadData.buttonBorder,
          backgroundImage: dialogDownLoadData.buttonColorType === 'gradient' ? dialogDownLoadData.buttonGradientColor : '',
        }"
        @click="downloadStore.downLoad(1)"
      >
        <AfunBaseImage class="h-[20px] w-[20px]" is-network :url="isIos() ? dialogDownLoadData.imgIcon.ios : dialogDownLoadData.imgIcon.android" />
        <span :style="{ color: dialogDownLoadData.buttonTextColor }" class="ml-[2px]">{{ dialogDownLoadData.buttonText }}</span>
      </div>
    </div>
  </div>
  <div class="flex items-center justify-center pt-[16px]" @click="closeIconClick">
    <div class="rounded-full w-[30px] h-[30px] center border-[#fff] border-solid border-[2px]">
      <IconForgetClose style="font-size: 18px;color: #fff;" />
    </div>
  </div>
</template>

<style>

</style>
