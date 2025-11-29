<script lang="ts" setup>
import { PhBaseImage } from '@tg/bccomponents'
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
      class=" min-h-[140rem] border rounded-[12rem] border-solid p-[12rem] pt-[20rem] font-[500]"
      :style="{
        backgroundColor: dialogDownLoadData.bgColor,
        backgroundImage: dialogDownLoadData.bgColorType === 'gradient' ? dialogDownLoadData.bgGradientColor : '',
      }"
    >
      <div class="mb-[16rem] w-full flex flex-1 overflow-hidden items-center">
        <div class="mr-[14rem] h-[56rem] w-[56rem] flex-shrink-0">
          <PhBaseImage class="h-[56rem] w-[56rem]" fit="cover" is-network :url="dialogDownLoadData.icon" />
        </div>
        <div class="text-[16rem] flex-1 overflow-hidden">
          <div class="truncate w-full" :style="{ color: dialogDownLoadData.titleColor }">
            {{ dialogDownLoadData.title }}
          </div>
          <div class="truncate w-full" :style="{ color: dialogDownLoadData.contentColor }">
            {{ dialogDownLoadData.content }}
          </div>
        </div>
      </div>
      <div
        class="h-[36rem] flex  cursor-pointer items-center justify-center rounded-[6rem]"
        :style="{
          backgroundColor: dialogDownLoadData.buttonBorder,
          backgroundImage: dialogDownLoadData.buttonColorType === 'gradient' ? dialogDownLoadData.buttonGradientColor : '',
        }"
        @click="downloadStore.downLoad(1)"
      >
        <PhBaseImage class="h-[20rem] w-[20rem]" is-network :url="isIos() ? dialogDownLoadData.imgIcon.ios : dialogDownLoadData.imgIcon.android" />
        <span :style="{ color: dialogDownLoadData.buttonTextColor }" class="ml-[2rem]">{{ dialogDownLoadData.buttonText }}</span>
      </div>
    </div>
  </div>
  <div class="flex items-center justify-center pt-[16rem]" @click="closeIconClick">
    <div class="rounded-full w-[30rem] h-[30rem] center border-[#fff] border-solid border-[2rem]">
      <IconForgetClose style="font-size: 18rem;color: #fff;" />
    </div>
  </div>
</template>

<style>

</style>
