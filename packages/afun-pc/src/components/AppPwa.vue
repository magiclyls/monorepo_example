<script lang="ts" setup>
import { IconUniClose,IconSvg11,IconSvg12, IconPwaDiaDown,  IconPwaDiaClose, IconPwaDiaTips } from '@tg/icons'

defineOptions({
  name: 'AppPwa',
})

const downloadStore = useDownloadStore()
const { pwaGlobalConfig, pwaData, iconUrl, webSiteName } = storeToRefs(downloadStore)
const { bodyWidth } = storeToRefs(useWindowStore())
const { isZhcn } = storeToRefs(useLanguageStore())

const { openService } = useService()
const { t } = useI18n()

// 强制提示下载对话
const isShowDownload = ref(false)
const isShowAdd = ref(false)
function downLoad() {
  if (downloadStore.downLoad() === 'ShowSafari')
    isShowAdd.value = true
}
function closeAdd() {
  isShowAdd.value = false
}
onMounted(() => {
  setTimeout(() => {
    isShowDownload.value = pwaData.value?.lead_page === '1' && !isPwa()
  }, 2000)
})
console.log(pwaGlobalConfig.value, 'pwaGlobalConfig');

</script>

<template>
  <!-- 自定义样式 -->
  <div
    v-if="pwaGlobalConfig.barType === 1" class="app-pwa-define fixed left-0 top-0 z-10 h-[46px] overflow-hidden"
    :style="{
      backgroundColor: pwaGlobalConfig.config.bgColor,
      paddingLeft: pwaGlobalConfig.btnPosition === 4 ? '10px' : '0',
      paddingRight: pwaGlobalConfig.btnPosition === 3 ? '10px' : '0',
      width: `${bodyWidth}px`,
    }"
  >
    <div
      class="h-[46px] w-full flex items-center justify-between leading-[1.3]" :style="{
        paddingRight: pwaGlobalConfig.btnPosition !== 1 ? '10px' : '0',
        paddingLeft: pwaGlobalConfig.btnPosition !== 2 ? '10px' : '0',
      }"
    >
      <div class="flex flex-1 items-center overflow-hidden">
        <!-- 关闭按钮 1后 2前  -->
        <div v-if="pwaGlobalConfig.btnPosition === 2" class="h-full flex items-center justify-center px-[10px]" @click="downloadStore.setIsShowPwaFalse">
          <IconUniClose name="uni-close" style="font-size:10px" />
        </div>
        <!-- 自定义文字 -->
        <div class="flex flex-col overflow-hidden">
          <div class="truncate text-[14px]" :class="[isZhcn ? '' : 'font-semibold']" :style="{ color: pwaGlobalConfig.mainTitlecolor }">
            {{ pwaGlobalConfig.mainTitlecontent }}
          </div>
          <div class="truncate text-[12px]" :class="[isZhcn ? '' : 'text-[14px] font-semibold']" :style="{ color: pwaGlobalConfig.subTitlecolor }">
            {{ pwaGlobalConfig.subTitlecontent }}
          </div>
        </div>
      </div>
      <div class="h-full flex flex-shrink-0 items-center justify-between text-[14px]">
        <BaseButton
          size="none"
          style="padding:0 14px;height:30px;" :style="{ backgroundColor: pwaGlobalConfig.config.btnColor }"
          @click="downLoad"
        >
          <IconSvg11 v-if="isIos()" style="font-size:16px;" :style="{ '--tg-icon-color': pwaGlobalConfig.btnIconColor }" />
          <IconSvg12 v-else style="font-size:16px;" :style="{ '--tg-icon-color': pwaGlobalConfig.btnIconColor }" />

          <span class="ml-[3px] text-[14px] font-semibold" :style="{ color: pwaGlobalConfig.btnTextcolor }"> {{ pwaGlobalConfig.btnTextcontent }} </span>
        </BaseButton>
        <div v-if="pwaGlobalConfig.btnPosition === 1" class="h-full flex items-center justify-center px-[10px]" @click="downloadStore.setIsShowPwaFalse ">
          <IconUniClose name="uni-close" class="close-icon" style="font-size:12px" />
        </div>
      </div>
    </div>
    <!-- 3右上 4左上  -->
    <div
      v-if="pwaGlobalConfig.btnPosition === 3 || pwaGlobalConfig.btnPosition === 4"
      class="absolute top-0 h-[20px] w-[20px] flex items-center justify-center"
      :class="[pwaGlobalConfig.btnPosition === 3 && 'right-0', pwaGlobalConfig.btnPosition === 4 && 'left-0']"
      @click="downloadStore.setIsShowPwaFalse"
    >
      <IconUniClose name="uni-close" style="font-size:10px" />
    </div>
  </div>
  <!-- 图片 -->
  <div v-else-if="pwaGlobalConfig.barType === 2" class="app-pwa-img bg-tg-secondary-dark fixed left-0 top-0 z-10 h-[46px] w-full overflow-hidden pl-[10px]">
    <BaseImage class="absolute left-0 top-0 h-[46px] w-[365px]" fit="cover" :url="pwaGlobalConfig.imgUrl" is-network />
    <div class="absolute right-0 top-0 z-50 h-full flex items-center justify-end text-[14px]" style="--tg-icon-color:#B1BAD3">
      <BaseButton
        bg-style="primary" size="none"
        style="padding:0 14px;height:30px;"
        @click="downLoad"
      >
        <IconPwaDiaDown style="font-size:16px" />
        <span class="ml-[3px] text-[12px] font-medium"> {{ t('download_app') }} </span>
      </BaseButton>
      <div class="h-full flex items-center justify-center px-[10px]" @click="downloadStore.setIsShowPwaFalse">
        <IconUniClose name="uni-close" style="font-size:10px" />
      </div>
    </div>
  </div>
  <AppAddToDesk v-if="isShowAdd" @close="closeAdd" />
  <!-- 强制提示下载对话 -->
  <teleport to="body">
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
              <BaseImage class="w-full" url="/png/home/pwa-load-banner.png" />
            </baseaspectratio>
            <div class="absolute right-[10px] top-[10px] z-10" @click="isShowDownload = false">
              <IconPwaDiaClose name="pwa-dia-close" style="font-size:28.8px" />
            </div>
          </div>
          <div class="px-[23px]">
            <div class="mb-[5px] text-center text-[18px] font-bold leading-[23px]">
              {{ t('pwa_ios_lead1') }}
            </div>
            <div class="mb-[16px]">
              {{ t('pwa_ios_lead2') }}
            </div>
            <div class="mb-[16px] flex items-center rounded-[4.8px] bg-[#F5F5F5] py-[5px]">
              <BaseImage class="mx-[10px] h-[43px] w-[43px] rounded-[10px]" :url="iconUrl" is-network />
              <span class="text-[16px] font-semibold">{{ webSiteName }}</span>
            </div>
            <div class="mb-[16px] flex items-center">
              <div
                class="text-tg-text-white h-[43px] flex flex-1 items-center rounded-full pl-[46px] font-semibold" style="
                background: linear-gradient(180deg, #72CB45 0%, #337611 100%), #0054E9;
                box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.20);"
                @click="downLoad"
              >
                <IconPwaDiaDown style="font-size:18px;--tg-icon-color:#fff" />
                <span class="ml-[40px]">{{ t('pwa_ios_lead3') }}</span>
              </div>
              <div class="ml-[10px] h-[43px] w-[43px] cursor-pointer text-[43px]" @click="openService({ isFootBar: false, needDeal: true });isShowDownload = false">
                <BaseImage url="/png/icon/uni-kefu.png" class="w-[43px]" />
              </div>
            </div>
            <div class="mb-[9px] text-[18px] font-bold leading-[23px]">
              {{ t('pwa_ios_lead4') }}
            </div>
            <div class="mb-[8px] flex">
              <div class="mr-[7px] h-[15px] w-[6px] flex items-center">
                <span class="bg-tg-secondary-dark h-[6px] w-[6px] rounded-full" />
              </div>
              <span>{{ t('pwa_ios_lead5') }}</span>
            </div>
            <div class="mb-[8px] flex">
              <div class="mr-[7px] h-[15px] w-[6px] flex items-center">
                <span class="bg-tg-secondary-dark h-[6px] w-[6px] rounded-full" />
              </div>
              <span>{{ t('pwa_ios_lead6') }}</span>
            </div>
            <div class="mb-[8px] flex">
              <div class="mr-[7px] h-[15px] w-[6px] flex items-center">
                <span class="bg-tg-secondary-dark h-[6px] w-[6px] rounded-full" />
              </div>
              <span>{{ t('pwa_ios_lead7') }}</span>
            </div>
            <div class="mb-[20px] flex">
              <div class="mr-[7px] h-[15px] w-[6px] flex items-center">
                <span class="bg-tg-secondary-dark h-[6px] w-[6px] rounded-full" />
              </div>
              <span>{{ t('pwa_ios_lead8') }}</span>
            </div>
            <div class="mb-[16px] rounded-[4.8px] bg-[#F5F5F5] px-[10px] py-[4px]">
              <div class="mb-[8px] flex items-center">
                <IconPwaDiaTips name="pwa-dia-tips" style="font-size:13px" />
                <span class="ml-[4px] text-[18px] font-semibold">{{ t('pwa_ios_lead9') }}</span>
              </div>
              <div>
                {{ t('pwa_ios_lead10') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<style lang="scss" scoped>
.v-enter-active {
  transition: transform 0.2s ease;
}
.v-enter-from .dialog-content{
  transform: translate(0, 100%);
}
.dialog-content {
  transition: transform 0.2s ease;
}

.close-icon {
  @include webTheme('green'){
    color:#fff;
  }
  @include webTheme('white'){
    color:#555555;
  }
}

.force-box {
  left: var(--pc-h5model-left, 0);
  top: 0;
  bottom: 0;
  right: 0;
  width: var(--pc-h5model-width, 100%);
}
</style>
