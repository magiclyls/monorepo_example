<script lang="ts" setup>
import { AfunBaseImage } from '@tg/bccomponents'
import { IconForgetClose, IconUpPwa } from '@tg/icons'
import { useDownloadStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const downloadStore = useDownloadStore()
const { iconUrl, webSiteName } = storeToRefs(downloadStore)

const { t } = useI18n()
const origin = window.location.origin.split('//')[1]
</script>

<template>
  <div
    class="w-full flex flex-col justify-center rounded-tl-[15.3846px] rounded-tr-[15.3846px] bg-white px-[23.07px] pb-[30.7692px] pt-[26.9230px] text-[#5F6368]"
  >
    <div class="w-full flex items-center justify-between">
      <span class="flex-1 font-semibold text-black">{{ t('安装应用程序') }}</span>
      <div class="flex items-center text-[23px]" style="--tg-icon-color:#000" @click="downloadStore.setIsShowAddToDesk(false)">
        <IconForgetClose />
      </div>
    </div>
    <div
      class="border-tg-text-grey-light my-[30px] w-full flex items-center border rounded-[7.6923px] border-solid p-[19.2307px]"
    >
      <AfunBaseImage class="mr-[17px] w-[42.3px] rounded-[9.6153px]" :url="iconUrl" is-network />
      <div class="flex flex-col justify-center">
        <span class="mb-[5.7692px] font-bold">{{ webSiteName }}</span>
        <span class="text-[11.5385px]">{{ origin }}</span>
      </div>
    </div>
    <div class="w-full flex items-center">
      <span class="mr-[13.4615px] font-bold text-black">1.</span>
      <span class="">{{ t('点击') }}</span>
      <IconUpPwa class="text-[#025BE8] text-[18px] mx-[4px]" />
      <span class="">{{ t('浏览器栏中的') }}</span>
    </div>
    <div class="text-tsm my-[30.7692px] w-full flex items-center">
      <span class="mr-[13.4615px] font-bold text-black">2.</span>
      <span class="">{{ t('向下滚动并选择') }}</span>
      <span class="border-[#a0a3ab] ml-[7.6923px] border border-solid px-[6px] rounded-full">
        {{ t('添加到主页') }}
      </span>
    </div>
    <div class="text-tsm w-full flex items-center">
      <span class="mr-[13.4615px] font-bold text-black">3.</span>
      <span class="">{{ t('向下滚动并选择') }}</span>
      <AfunBaseImage class="rouneded-[5.7692px] mx-[7.6923px] w-[23.7px]" :url="iconUrl" is-network />
      <span class="">{{ t('网站菜单中的') }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
