<script lang="ts" setup>
import { PhBaseImage } from '@tg/bccomponents'
import { IconForgetClose } from '@tg/icons'
import { useDownloadStore, useNotLoginReloadDialog } from '@tg/stores'
import { storeToRefs } from 'pinia'

const downloadStore = useDownloadStore()
const { dialogDownLoadBottomData } = storeToRefs(downloadStore)
const notLoginReloadDialog = useNotLoginReloadDialog()
</script>

<template>
  <div class="h5-fixed-bottom relative px-[10rem] font-[500] flex flex-col z-100" style="bottom: 80rem;">
    <div
      class="absolute right-[18rem] z-10 top-[2rem] flex items-center justify-center"
      @click="downloadStore.isOpenDownLoadDialogBottom = false"
    >
      <IconForgetClose class="cursor-pointer text-[#fff] text-[17rem]" />
    </div>
    <div
      class="h-[72rem] rounded-[8rem] px-[8rem] border border-[#FFE0E0]"
      :style="{
        backgroundColor: dialogDownLoadBottomData.bgColor,
        backgroundImage: dialogDownLoadBottomData.bgColorType === 'gradient' ? dialogDownLoadBottomData.bgGradientColor : '',
      }"
    >
      <div class="h-full w-full flex justify-between items-center">
        <div class="flex items-center flex-1 overflow-hidden">
          <div class="mr-[6rem] h-[58rem] w-[58rem] flex-shrink-0">
            <PhBaseImage class="h-[58rem] w-[58rem]" fit="cover" is-network :url="dialogDownLoadBottomData.icon" />
          </div>
          <div class="text-[14rem] flex-1 overflow-hidden">
            <div class="truncate" :style="{ color: dialogDownLoadBottomData.titleColor }">
              {{ dialogDownLoadBottomData.title }}
            </div>
            <div class="truncate" :style="{ color: dialogDownLoadBottomData.contentColor }">
              {{ dialogDownLoadBottomData.content }}
            </div>
          </div>
        </div>
        <div
          v-if="dialogDownLoadBottomData.buttonText"
          class="h-[36rem] flex-shrink-0 flex cursor-pointer items-center justify-center overflow-hidden rounded-[6px] px-[10rem]"
          :style="{
            backgroundColor: dialogDownLoadBottomData.buttonBorder,
            backgroundImage: dialogDownLoadBottomData.buttonColorType === 'gradient' ? dialogDownLoadBottomData.buttonGradientColor : '',
          }"
          @click="downloadStore.downLoad(1)"
        >
          <!-- <PhBaseImage class="h-[20rem] min-w-[20rem] w-[20rem]" is-network :url="isIos() ? dialogDownLoadBottomData.imgIcon.ios : dialogDownLoadBottomData.imgIcon.android" /> -->
          <span
            :style="{ color: dialogDownLoadBottomData.buttonTextColor }"
            class="text-[14rem] text-ellipsis whitespace-nowrap fomt-[500]"
          >
            {{ dialogDownLoadBottomData.buttonText }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
