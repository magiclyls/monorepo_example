<script lang="ts" setup>
import { AfunBaseImage } from '@tg/bccomponents'
import { IconAndroidLogo, IconAppleLogo, IconForgetClose } from '@tg/icons'
import { useDownloadStore } from '@tg/stores'
import { isIos, isPwa } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const downloadStore = useDownloadStore()
const { pwaGlobalConfig, pwaData } = storeToRefs(downloadStore)

const { t } = useI18n()

// 强制提示下载对话
const isShowDownload = ref(false)

const styleObj = computed(() => ({
  'background':
  pwaGlobalConfig.value.bgColorType === 'gradient'
    ? pwaGlobalConfig.value.config.bgGradientColor
    : `linear-gradient(90deg,${pwaGlobalConfig.value.config.bgColor},${pwaGlobalConfig.value.config.bgColor})`,
  // 'backgroundColor': pwaGlobalConfig.value.config.bgColor,
  '--download-left': pwaGlobalConfig.value.btnPosition === 4 ? '10px' : '0',
  '--download-right': pwaGlobalConfig.value.btnPosition === 3 ? '10px' : '0',
  'width': 'var(--pc-max-width)',
}))

onMounted(() => {
  setTimeout(() => {
    isShowDownload.value = pwaData.value?.lead_page === '1' && !isPwa()
  }, 2000)
})
</script>

<template>
  <!-- 自定义样式 -->
  <div
    v-if="pwaGlobalConfig.barType === 1" class="relative h-[46px] overflow-hidden"
    :style="styleObj"
  >
    <div
      class="h-[46px] w-full flex items-center justify-between leading-[1.3]" :style="{
        paddingRight: pwaGlobalConfig.btnPosition !== 1 ? '10px' : '0',
        paddingLeft: pwaGlobalConfig.btnPosition !== 2 ? '10px' : '0',
      }"
    >
      <div class="flex flex-1 items-center overflow-hidden">
        <!-- 关闭按钮 1后 2前  -->
        <div v-if="pwaGlobalConfig.btnPosition === 2" class="h-full flex items-center justify-center px-[7px]" @click="downloadStore.setIsShowPwaFalse">
          <IconForgetClose class="cursor-pointer text-[#fff] text-[17px]" />
        </div>
        <!-- 自定义文字 -->
        <div class="flex flex-col overflow-hidden">
          <div class="truncate text-[14px] font-[600]" :style="{ color: pwaGlobalConfig.mainTitlecolor }">
            {{ pwaGlobalConfig.mainTitlecontent }}
          </div>
          <div class="truncate text-[10px] font-[600]" :style="{ color: pwaGlobalConfig.subTitlecolor }">
            {{ pwaGlobalConfig.subTitlecontent }}
          </div>
        </div>
      </div>
      <div class="h-full flex flex-shrink-0 items-center justify-between text-[14px]">
        <div
          class="h-[30px] px-[19px] flex cursor-pointer items-center justify-center rounded-[4px]"
          :style="{
            backgroundColor: pwaGlobalConfig.config.btnColor,
            backgroundImage: pwaGlobalConfig.btnColorType === 'gradient' ? pwaGlobalConfig.config.btnGradientColor : '',
          }"
          @click="downloadStore.downLoad(1)"
        >
          <IconAppleLogo v-if="isIos()" class="text-[14px]" :style="{ color: pwaGlobalConfig.btnIconColor }" />
          <IconAndroidLogo v-else class="text-[14px]" :style="{ color: pwaGlobalConfig.btnIconColor }" />
          <span class="ml-[4px] text-[12px] font-[600]" :style="{ color: pwaGlobalConfig.btnTextcolor }"> {{ pwaGlobalConfig.btnTextcontent }} </span>
        </div>
        <div v-if="pwaGlobalConfig.btnPosition === 1" class="h-full flex items-center justify-center px-[7px]" @click="downloadStore.setIsShowPwaFalse ">
          <IconForgetClose class="cursor-pointer text-[#fff] text-[17px]" />
        </div>
      </div>
    </div>
    <!-- 3右上 4左上  -->
    <div
      v-if="pwaGlobalConfig.btnPosition === 3 || pwaGlobalConfig.btnPosition === 4"
      class="absolute top-0 h-20 w-20 flex items-center justify-center"
      :class="[pwaGlobalConfig.btnPosition === 3 && 'right-0', pwaGlobalConfig.btnPosition === 4 && 'left-0']"
      @click="downloadStore.setIsShowPwaFalse"
    >
      <IconForgetClose class="cursor-pointer text-[#fff] text-[17px]" />
    </div>
  </div>
  <!-- 图片 -->
  <div v-else-if="pwaGlobalConfig.barType === 2" class="relative w-[var(--pc-max-width)] bg-[#0f212e] h-[46px] overflow-hidden pl-[10px]">
    <AfunBaseImage class="absolute left-0 top-0 h-[46px] w-full" fit="cover" :url="pwaGlobalConfig.imgUrl" is-network />
    <div class="absolute right-0 top-0 z-50 h-full flex items-center justify-end text-[14px]" style="--tg-icon-color:#B1BAD3">
      <div
        class="h-[30px] bg-[#fff] px-[19px] flex cursor-pointer items-center justify-center rounded-[4px]"
        @click="downloadStore.downLoad(1)"
      >
        <IconAppleLogo v-if="isIos()" class="text-[14px] text-[#F23038]" />
        <IconAndroidLogo v-else class="text-[14px] text-[#F23038]" />
        <span class="ml-[4px] text-[12px] font-[600] text-[#F23038]">  {{ t('下载') }} </span>
      </div>
      <div class="h-full flex items-center justify-center px-[7px]" @click="downloadStore.setIsShowPwaFalse">
        <IconForgetClose class="cursor-pointer text-[#fff] text-[17px]" />
      </div>
    </div>
  </div>
  <!-- 强制提示下载对话 -->
  <!-- <teleport to="body">
    <Transition>
      <div
        v-if="isShowDownload"
        class="force-box fixed bottom-0 left-0 right-0 top-0 z-[9998] flex flex-col justify-end"
        style="background: rgba(0, 0, 0, .8)"
      >
        <div
          class="dialog-content text-tg-text-black w-full flex flex-col justify-center overflow-hidden rounded-tl-[15.3846px] rounded-tr-[15.3846px] bg-white text-[15px]"
        >
          <div class="relative w-full">
            <BaseAspectRatio :ratio="`1/${130 / 375}`">
              <AfunBaseImage class="w-full" url="/png/home/pwa-load-banner.png" />
            </baseaspectratio>
            <div class="absolute right-10 top-10 z-10" @click="isShowDownload = false">
              <BaseIcon name="pwa-dia-close" style="font-size:28.8px" />
            </div>
          </div>
          <div class="px-[23px]">
            <div class="mb-5 text-center text-[18px] font-bold leading-[23px]">
              {{ t('pwa_ios_lead1') }}
            </div>
            <div class="mb-16">
              {{ t('pwa_ios_lead2') }}
            </div>
            <div class="mb-16 flex items-center rounded-[4.8px] bg-[#F5F5F5] py-5">
              <AfunBaseImage class="mx-10 h-43 w-43 rounded-[10px]" :url="iconUrl" is-network />
              <span class="text-[16px] font-semibold">{{ webSiteName }}</span>
            </div>
            <div class="mb-16 flex items-center">
              <div
                class="text-tg-text-white h-43 flex flex-1 items-center rounded-full pl-46 font-semibold" style="
                background: linear-gradient(180deg, #72CB45 0%, #337611 100%), #0054E9;
                box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.20);"
                @click="downLoad"
              >
                <BaseIcon name="pwa-dia-down" style="font-size:18px;--tg-icon-color:#fff" />
                <span class="ml-40">{{ t('pwa_ios_lead3') }}</span>
              </div>
              <div class="ml-10 h-43 w-43 cursor-pointer text-[43px]" @click="router.push('/service');isShowDownload = false">
                <BaseIcon name="uni-kefu" style="font-size:43px" />
              </div>
            </div>
            <div class="mb-9 text-[18px] font-bold leading-[23px]">
              {{ t('pwa_ios_lead4') }}
            </div>
            <div class="mb-8 flex">
              <div class="mr-7 h-15 w-6 flex items-center">
                <span class="bg-tg-secondary-dark h-6 w-6 rounded-full" />
              </div>
              <span>{{ t('pwa_ios_lead5') }}</span>
            </div>
            <div class="mb-8 flex">
              <div class="mr-7 h-15 w-6 flex items-center">
                <span class="bg-tg-secondary-dark h-6 w-6 rounded-full" />
              </div>
              <span>{{ t('pwa_ios_lead6') }}</span>
            </div>
            <div class="mb-8 flex">
              <div class="mr-7 h-15 w-6 flex items-center">
                <span class="bg-tg-secondary-dark h-6 w-6 rounded-full" />
              </div>
              <span>{{ t('pwa_ios_lead7') }}</span>
            </div>
            <div class="mb-20 flex">
              <div class="mr-7 h-15 w-6 flex items-center">
                <span class="bg-tg-secondary-dark h-6 w-6 rounded-full" />
              </div>
              <span>{{ t('pwa_ios_lead8') }}</span>
            </div>
            <div class="mb-16 rounded-[4.8px] bg-[#F5F5F5] px-10 py-4">
              <div class="mb-8 flex items-center">
                <BaseIcon name="pwa-dia-tips" style="font-size:13px" />
                <span class="ml-4 text-[18px] font-semibold">{{ t('pwa_ios_lead9') }}</span>
              </div>
              <div>
                {{ t('pwa_ios_lead10') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </teleport> -->
</template>

<style lang="scss" scoped>
.v-enter-active {
  transition: transform 0.2s ease;
}
.v-enter-from .dialog-content {
  transform: translate(0, 100%);
}
.dialog-content {
  transition: transform 0.2s ease;
}

.force-box {
  left: var(--pc-h5model-left, 0);
  top: 0;
  bottom: 0;
  right: 0;
  width: var(--pc-h5model-width, 100%);
}
</style>
