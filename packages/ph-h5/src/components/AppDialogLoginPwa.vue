<script setup lang='ts'>
import { PhBaseImage } from '@tg/bccomponents'
import { IconAddPwa, IconForgetClose, IconUpPwa } from '@tg/icons'
import { useDownloadStore } from '@tg/stores'
import { isIos } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const emit = defineEmits(['close'])
const downloadStore = useDownloadStore()
const { iconUrl, webSiteName } = storeToRefs(downloadStore)
const { t } = useI18n()
const router = useRouter()

function close() {
  emit('close')
}
</script>

<template>
  <div class="relative pt-[155rem]">
    <div class="absolute h-full top-0 left-0 ">
      <PhBaseImage width="375rem" url="/ph-h5/png/loginpwa.png" />
      <div class="h-full bg-[#fff]" />
    </div>
    <div class="absolute top-0 right-[0rem] px-[8rem] pb-[8rem] flex items-center justify-center cursor-pointer" @click="close">
      <div class="rounded-full w-[18rem] h-[18rem] center border-[#fff] border-solid border-[1.2rem]">
        <IconForgetClose style="font-size: 12rem;color: #fff;" />
      </div>
    </div>
    <div class="relative z-1 px-[30rem] pb-[24rem]">
      <div class="text-[#0D2245] center mb-[4rem] text-[18rem] font-[500]">
        {{ t('发现新版本') }}
      </div>
      <div class="center mb-[14rem]">
        {{ t('下载桌面应用程序以获得更流畅的体验') }}
      </div>
      <div class="flex justify-between items-center mb-[14rem]">
        <div class="flex items-center p-[6rem] flex-1 bg-[#F6F7F8] rounded-[6rem]">
          <PhBaseImage width="45rem" height="45rem" class="rounded-[7rem]" is-network :url="iconUrl" />
          <span class="ml-[10rem] text-[#0D2245] text-[16rem]">{{ webSiteName }}</span>
        </div>
        <div v-if="isIos()" class="ml-[20rem] cursor-pointer" @click="router.push('/service');close()">
          <PhBaseImage width="42rem" url="/ph-h5/png/kefu.png" />
        </div>
      </div>
      <div v-if="!isIos()" class="cursor-pointer flex justify-between items-center mb-[14rem]">
        <div class="flex-1 cursor-pointer relative rounded-[8rem] center text-[#fff] text-[18rem] bg-[#F23038] h-[42rem]" @click="downloadStore.downLoad(2)">
          <div class="h-full absolute center left-[30rem] top-0">
            <PhBaseImage width="18rem" url="/ph-h5/png/download-pwa.png" />
          </div>
          <span>{{ t('安装') }}</span>
        </div>
        <div class="ml-[14rem] cursor-pointer" @click="router.push('/service');close()">
          <PhBaseImage width="42rem" url="/ph-h5/png/kefu.png" />
        </div>
      </div>
      <div v-if="isIos()" class="mb-[14rem]">
        <div class="mb-[4rem]">
          {{ t('应用安装指南') }}
        </div>
        <div class="text-[#0D2245] flex items-center mb-[4rem]">
          <span class="text-[7rem] mr-[6rem]">◆</span>
          <span> {{ t('点击Safari浏览器菜单栏分享') }}</span>
          <IconUpPwa class="text-[#025BE8] text-[18rem] ml-[8rem]" />
        </div>
        <div class="text-[#0D2245] flex items-center mb-[4rem]">
          <span class="text-[7rem] mr-[6rem]">◆</span>
          <span>{{ t('然后点击添加到主屏幕选项') }}</span>
          <IconAddPwa class="text-[#6D7693] text-[18rem] ml-[8rem]" />
        </div>
        <div class="text-[#0D2245] flex items-center mb-[4rem]">
          <span class="text-[7rem] mr-[6rem]">◆</span>{{ t('然后点击添加到点击添加按钮主屏幕选项') }}
        </div>
        <div class="text-[#0D2245] flex items-center mb-[4rem]">
          <span class="text-[7rem] mr-[6rem]">◆</span>{{ t('安装完成') }}
        </div>
      </div>
      <div v-else class="mb-[14rem]">
        <div class="mb-[4rem]">
          {{ t('应用安装指南') }}
        </div>
        <div class="text-[#0D2245] flex items-center mb-[4rem]">
          <span class="text-[7rem] mr-[6rem]">◆</span>{{ t('点击上方按钮下载安装文件') }}
        </div>
        <div class="text-[#0D2245] flex items-center mb-[4rem]">
          <span class="text-[7rem] mr-[6rem]">◆</span>{{ t('在设备设置中允许安装来自未知来源的应用') }}
        </div>
        <div class="text-[#0D2245] flex items-center mb-[4rem]">
          <span class="text-[7rem] mr-[6rem]">◆</span>{{ t('安装完成') }}
        </div>
      </div>
      <div class="bg-[#F6F7F8] px-[8rem] py-[8rem] text-[#6D7693] border border-dashed border-[#9DABC9] text-[12rem] center rounded-[6rem]">
        <PhBaseImage width="10rem" height="10rem" url="/ph-h5/png/warning.png" />
        <span class="ml-[8rem]">{{ t('本应用已通过APP STORE安全认证，请放心安装') }}</span>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped></style>
