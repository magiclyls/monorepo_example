<script setup lang='ts'>
import { AfunBaseImage } from '@tg/bccomponents'
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
  <div class="relative pt-[155px]">
    <div class="absolute h-full w-full top-0 left-0">
      <AfunBaseImage width="375px" url="/m/afun-h5/png/loginpwa.png" />
      <div class="h-full bg-[#1A2C38]" />
    </div>
    <div class="absolute top-0 right-[0px] px-[8px] pb-[8px] flex items-center justify-center cursor-pointer" @click="close">
      <div class="rounded-full w-[18px] h-[18px] center border-[#B1BAD3] border-solid border-[1.2px]">
        <IconForgetClose style="font-size: 12px;color: #B1BAD3;" />
      </div>
    </div>
    <div class="relative z-1 px-[30px] pb-[24px]">
      <div class="text-[#fff] center mb-[4px] text-[18px] font-[600]">
        {{ t('发现新版本') }}
      </div>
      <div class="text-[#B1BAD3] center mb-[14px]">
        {{ t('下载桌面应用程序以获得更流畅的体验') }}
      </div>
      <div class="flex justify-between items-center mb-[14px]">
        <div class="flex items-center p-[6px] flex-1 bg-[#213743] rounded-[6px]">
          <AfunBaseImage width="45px" height="45px" class="rounded-[7px]" is-network :url="iconUrl" />
          <span class="ml-[10px] text-[#fff] text-[16px]">{{ webSiteName }}</span>
        </div>
        <div v-if="isIos()" class="ml-[20px] cursor-pointer" @click="router.push('/service');close()">
          <AfunBaseImage width="42px" url="/m/afun-h5/png/kefu.png" />
        </div>
      </div>
      <div v-if="!isIos()" class="cursor-pointer flex justify-between items-center mb-[14px]">
        <div class="flex-1 cursor-pointer relative rounded-[4px] center text-[#05080A] text-[18px] bg-[linear-gradient(90deg,#24EE89_0%,#9FE871_100%)] h-[42px]" @click="downloadStore.downLoad(2)">
          <div class="h-full absolute center left-[30px] top-0">
            <AfunBaseImage width="18px" url="/m/afun-h5/png/download-pwa.png" />
          </div>
          <span>{{ t('安装') }}</span>
        </div>
        <div class="ml-[14px] cursor-pointer" @click="router.push('/service');close()">
          <AfunBaseImage width="42px" url="/m/afun-h5/png/kefu.png" />
        </div>
      </div>
      <div v-if="isIos()" class="mb-[14px]">
        <div class="text-[#B1BAD3] mb-[4px]">
          {{ t('应用安装指南') }}
        </div>
        <div class="text-[#FFF] flex items-center mb-[4px]">
          <span class="text-[7px] mr-[6px]">◆</span>
          <span> {{ t('点击Safari浏览器菜单栏分享') }}</span>
          <IconUpPwa class="text-[#025BE8] text-[18px] ml-[8px]" />
        </div>
        <div class="text-[#FFF] flex items-center mb-[4px]">
          <span class="text-[7px] mr-[6px]">◆</span>
          <span>{{ t('然后点击添加到主屏幕选项') }}</span>
          <IconAddPwa class="text-[#B1BAD3] text-[18px] ml-[8px]" />
        </div>
        <div class="text-[#FFF] flex items-center mb-[4px]">
          <span class="text-[7px] mr-[6px]">◆</span>{{ t('然后点击添加到点击添加按钮主屏幕选项') }}
        </div>
        <div class="text-[#FFF] flex items-center mb-[4px]">
          <span class="text-[7px] mr-[6px]">◆</span>{{ t('安装完成') }}
        </div>
      </div>
      <div v-else class="mb-[14px]">
        <div class="text-[#B1BAD3] mb-[4px]">
          {{ t('应用安装指南') }}
        </div>
        <div class="text-[#FFF] flex items-center mb-[4px]">
          <span class="text-[7px] mr-[6px]">◆</span>{{ t('点击上方按钮下载安装文件') }}
        </div>
        <div class="text-[#FFF] flex items-center mb-[4px]">
          <span class="text-[7px] mr-[6px]">◆</span>{{ t('在设备设置中允许安装来自未知来源的应用') }}
        </div>
        <div class="text-[#FFF] flex items-center mb-[4px]">
          <span class="text-[7px] mr-[6px]">◆</span>{{ t('安装完成') }}
        </div>
      </div>
      <div class="bg-[#213743] px-[8px] py-[8px] text-[#B1BAD3] border border-dashed border-[#2F4553] text-[12px] center rounded-[6px]">
        <AfunBaseImage width="10px" height="10px" url="/m/afun-h5/png/warning.png" />
        <span class="ml-[8px]">{{ t('本应用已通过APP STORE安全认证，请放心安装') }}</span>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped></style>
