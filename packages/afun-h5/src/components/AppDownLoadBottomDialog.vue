<script lang="ts" setup>
import { AfunBaseImage } from '@tg/bccomponents'
import { IconForgetClose } from '@tg/icons'
import { useDownloadStore, useNotLoginReloadDialog } from '@tg/stores'
import { storeToRefs } from 'pinia'

const downloadStore = useDownloadStore()
const { dialogDownLoadBottomData } = storeToRefs(downloadStore)
const notLoginReloadDialog = useNotLoginReloadDialog()
</script>

<template>
  <div class="h5-fixed-bottom relative px-[10px] font-[600] flex flex-col z-100" style="bottom: 80px;">
    <div
      class="absolute right-[18px] z-10 top-[2px] flex items-center justify-center"
      @click="downloadStore.isOpenDownLoadDialogBottom = false"
    >
      <IconForgetClose class="cursor-pointer text-[#fff] text-[17px]" />
    </div>
    <div
      class="h-[72px] rounded-[8px] px-[8px] border border-[#FFE0E0]"
      :style="{
        backgroundColor: dialogDownLoadBottomData.bgColor,
        backgroundImage: dialogDownLoadBottomData.bgColorType === 'gradient' ? dialogDownLoadBottomData.bgGradientColor : '',
      }"
    >
      <div class="h-full w-full flex justify-between items-center">
        <div class="flex items-center flex-1 overflow-hidden">
          <div class="mr-[6px] h-[58px] w-[58px] flex-shrink-0">
            <AfunBaseImage class="h-[58px] w-[58px]" fit="cover" is-network :url="dialogDownLoadBottomData.icon" />
          </div>
          <div class="text-[14px] flex-1 overflow-hidden">
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
          class="h-[36px] flex-shrink-0 flex cursor-pointer items-center justify-center overflow-hidden rounded-[6px] px-[10px]"
          :style="{
            backgroundColor: dialogDownLoadBottomData.buttonBorder,
            backgroundImage: dialogDownLoadBottomData.buttonColorType === 'gradient' ? dialogDownLoadBottomData.buttonGradientColor : '',
          }"
          @click="downloadStore.downLoad(1)"
        >
          <!-- <AfunBaseImage class="h-[20px] min-w-[20px] w-[20px]" is-network :url="isIos() ? dialogDownLoadBottomData.imgIcon.ios : dialogDownLoadBottomData.imgIcon.android" /> -->
          <span
            :style="{ color: dialogDownLoadBottomData.buttonTextColor }"
            class="text-[14px] text-ellipsis whitespace-nowrap fomt-[500]"
          >
            {{ dialogDownLoadBottomData.buttonText }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
