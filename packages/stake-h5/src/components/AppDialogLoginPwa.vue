<script setup lang='ts'>
import {  IconUniWarningColor, IconPwaDiaDown, IconUniPwaPlus, IconUniPwaShare } from '@tg/icons'
import { getEnv } from '@tg/utils';

defineOptions({ name: 'AppDialogLoginPwa' })

const closeDialog = inject('closeDialog', () => {})
const { t } = useI18n()
const { userLanguage, isZhcn, isPtbr } = storeToRefs(useLanguageStore())
const { VITE_OFFICIAL_DOMAIN } = getEnv()
const { theme } = storeToRefs(useAppStore())
const { openService } = useService()
const downLoadStore = useDownloadStore()
const { setIsHaveWaitingLoginPWADialogTrue } = useGlobalStateWalletState()
const dialogDownLoadData = ref<Record<string, any>>({})

const themeText = computed(() => {
  if (theme.value === 'green' || theme.value === 'white')
    return theme.value
  return 'default'
})

async function onClickService() {
  setIsHaveWaitingLoginPWADialogTrue()
  closeDialog()
  await nextTick()
  openService({ isFootBar: false, needDeal: false })
}

function getIsShowDialogDownLoad() {
  try {
    const obj = JSON.parse((globalInitMap.allBrandInfo?.pc?.home_app_download || '{}') as string)
    const data = obj.flag && +obj.flag === 2 ? obj.customize : obj.official
    data.buttonText = data.lang.buttonText[userLanguage.value.replace('-', '_')]
    data.content = data.lang.content[userLanguage.value.replace('-', '_')]
    data.title = data.lang.title[userLanguage.value.replace('-', '_')]
    dialogDownLoadData.value = data
  }
  catch (err) {
    console.log('getIsShowDialogDownLoad', err)
  }
}
getIsShowDialogDownLoad()
</script>

<template>
  <div class="w-full">
    <!-- 背景 -->
    <div :class="[`theme-header-bg-${themeText}`]" class="absolute h-[220px] w-full">
      <BaseImage v-if="theme === 'green'" class="top-[55px] overflow-hidden rounded-t-md !absolute" url="/png/home/pwa_bg_green.webp" />
      <BaseImage v-else-if="theme === 'white'" class="top-[55px] overflow-hidden rounded-t-md !absolute" url="/png/home/pwa_bg_white.webp" />
      <BaseImage v-else class="top-[55px] overflow-hidden rounded-t-md !absolute" url="/png/home/pwa_bg_grey.webp" />
      <BaseImage class="!absolute" url="/png/home/login_pwa_banner.webp" />
    </div>
    <!-- 内容 -->
    <div
      :class="[`theme-content-bg-${themeText}`]"
      class="relative mt-[115px] w-full px-[24px] pb-[20px] pt-[60px]"
    >
      <div class="theme-title text-center font-medium" :class="isPtbr ? 'text-[14px]' : 'text-[13px]'">
        <span class="leading-[20px]">{{ t('pwa_ios_lead1') }}</span>
        <i18n-t keypath="login_pwa_lead1" tag="div" class="leading-[20px]">
          <span class="theme-web-app">{{ t('web_app') }}</span>
        </i18n-t>
      </div>
      <!-- app logo -->
      <div class="w-full flex items-center" :class="isIos() ? 'mt-[17px]' : 'mt-[10px]'">
        <div class="theme-bg flex grow items-center rounded-[4px] p-[4px]">
          <div class="mr-[8px] h-[37px] w-[37px] flex-shrink-0">
            <BaseImage class="theme-icon h-[37px] w-[37px]" fit="cover" is-network :url="dialogDownLoadData.icon" />
          </div>
          <span class="theme-domain text-[12px] font-medium">{{ VITE_OFFICIAL_DOMAIN }}</span>
        </div>
        <div v-if="isIos()" class="ml-[16px] flex cursor-pointer items-center text-[36px]" @click="onClickService">
          <BaseImage url="/png/icon/uni-kefu-green.png" class="w-[36px]" v-if="theme === 'green'" />
          <BaseImage url="/png/icon/uni-kefu-white.png" class="w-[36px]" v-else-if="theme === 'white'" />
          <BaseImage url="/png/icon/uni-kefu-lvse.png" class="w-[36px]" v-else />
        </div>
      </div>
      <!-- 说明ios -->
      <template v-if="isIos()">
        <div class="theme-text-content mb-[16px] mt-[19px] flex flex-col text-[11px] font-medium leading-[20px]" :class="isPtbr ? (theme === 'white' ? 'text-[12px] theme-text-ptr-white' : 'text-[12px] theme-text') : 'text-[11px]'">
          <span class="theme-sub-title">{{ t('login_pwa_lead2') }}</span>
          <span><span class="mr-[6px] inline-block translate-y-[-1.5px] text-[8px]" :class="isZhcn ? 'theme-square-cn' : 'theme-square'">◆</span>{{ t('login_pwa_lead3') }}<IconUniPwaShare class="ml-[8px] translate-y-2 text-[14px]" /></span>
          <span><span class="mr-[6px] inline-block translate-y-[-1.5px] text-[8px]" :class="isZhcn ? 'theme-square-cn' : 'theme-square'">◆</span>{{ t('login_pwa_lead4') }}<IconUniPwaPlus class="ml-[8px] translate-y-4 text-[14px]" /></span>
          <span><span class="mr-[6px] inline-block translate-y-[-1.5px] text-[8px]" :class="isZhcn ? 'theme-square-cn' : 'theme-square'">◆</span>{{ t('login_pwa_lead5') }}</span>
          <span><span class="mr-[6px] inline-block translate-y-[-1.5px] text-[8px]" :class="isZhcn ? 'theme-square-cn' : 'theme-square'">◆</span>{{ t('login_pwa_lead6') }}</span>
        </div>
        <div class="theme-bg theme-text1 flex rounded-[4px] p-[8px]">
          <div class="flex flex-col">
            <div class="h-[14px] flex items-center">
              <IconUniWarningColor style="font-size: 8px;" />
            </div>
            <div />
          </div>
          <div class="ml-[6px] flex flex-col leading-[14px] font-[500]" :class="isPtbr ? 'text-[12px] leading-[14px]' : 'text-[11px] leading-[18px]'">
            <span>{{ t('login_pwa_lead7') }}</span>
            <span>{{ t('login_pwa_lead8') }}</span>
          </div>
        </div>
      </template>
      <!-- 说明安卓 -->
      <template v-else>
        <div class="mt-[12px] flex items-center">
          <div class="theme-btn relative flex grow items-center" @click="downLoadStore.downLoad(2)">
            <IconPwaDiaDown class="theme-icon absolute left-[18px]" style="font-size: 18px;" />
            <span class="grow text-center" :class="isPtbr ? 'text-[16px]' : 'text-[15px]'">{{ t('install') }}</span>
          </div>
          <div class="flex cursor-pointer items-center text-[36px]" @click="onClickService">
            <BaseImage url="/png/icon/uni-kefu-green.png" class="w-[36px]" v-if="theme === 'green'" />
            <BaseImage url="/png/icon/uni-kefu-white.png" class="w-[36px]" v-else-if="theme === 'white'" />
            <BaseImage url="/png/icon/uni-kefu-lvse.png" class="w-[36px]" v-else />
          </div>
        </div>
        <div class="theme-text-content mb-[16px] mt-[19px] flex flex-col font-medium leading-[20px]" :class="isPtbr ? 'text-[12px]' : isZhcn ? 'text-[11px]' : 'text-[11px]'">
          <span class="theme-sub-title">{{ t('login_pwa_lead2') }}</span>
          <span>
            <span class="mr-[6px] inline-block translate-y-[-1.5px] text-[8px]" :class="isZhcn ? 'theme-square-cn' : 'theme-square'">◆</span>{{ t('login_pwa_lead9') }}
          </span>
          <span><span class="mr-[6px] inline-block translate-y-[-1.5px] text-[8px]" :class="isZhcn ? 'theme-square-cn' : 'theme-square'">◆</span>{{ t('login_pwa_lead10') }}</span>
          <span><span class="mr-[6px] inline-block translate-y-[-1.5px] text-[8px]" :class="isZhcn ? 'theme-square-cn' : 'theme-square'">◆</span>{{ t('login_pwa_lead11') }}</span>
        </div>
        <div class="theme-bg theme-text1 flex rounded-[4px] p-[8px]">
          <div class="flex flex-col">
            <div class="h-[14px] flex items-center">
              <IconUniWarningColor style="font-size: 8px;color:#ED4163" />
            </div>
            <div />
          </div>
          <div class="ml-[6px] flex flex-col leading-[14px] font-[500]" :class="isPtbr ? 'text-[12px] leading-[14px]' : 'text-[11px] leading-[18px]'">
            <span>{{ t('login_pwa_lead7') }}</span>
            <span>{{ t('login_pwa_lead12') }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.theme-content-bg-default{
  background-repeat: no-repeat;
  background-size: cover;
  @include getBackgroundImage('/home/pwa_bg_grey_1')
}
.theme-content-bg-white{
  background-repeat: no-repeat;
  background-size: cover;
  @include getBackgroundImage('/home/pwa_bg_white_1')
}
.theme-content-bg-green{
  background-repeat: no-repeat;
  background-size: cover;
  @include getBackgroundImage('/home/pwa_bg_green_1')
}
.theme-content-bg-bcgame{
  background-repeat: no-repeat;
  background-size: cover;
  @include getBackgroundImage('/home/pwa_bg_grey_1')
}
.theme-content-bg-new-default{
  background-repeat: no-repeat;
  background-size: cover;
  @include getBackgroundImage('/home/pwa_bg_grey_1')
}
.theme-web-app{
  color: #07e706;
  @include webTheme('white'){
    color: #ffa908;
  }
  @include webTheme('green'){
    color: #ffa908;
  }
}
.theme-bg{
  background-color: #274456;
  @include webTheme('green'){
    background-color: #02432D;
  }@include webTheme('white'){
    background-color: #F5F5F5;
  }
}
.theme-domain{
  color: #B1BAD3;
  letter-spacing: 0.6px;
  @include webTheme('white'){
    color: #555;
  }
  @include webTheme('green'){
    color: #76f0c5;
  }
}
.theme-square{
  color: #B1BAD3;
  @include webTheme('white'){
    color: #555;
  }
  @include webTheme('green'){
    color: #76F0C5;
  }
}
.theme-square-cn{
  color: #B1BAD3;
  @include webTheme('white'){
    color: #111;
  }
  @include webTheme('green'){
    color: #76F0C5;
  }
}
.theme-sub-title{
  color: #B1BAD3;
  @include webTheme('white'){
    color: #555;
  }
  @include webTheme('green'){
    color: #3CB389;
  }
}
.theme-text{
  color: #B1BAD3;
  @include webTheme('green'){
    color: #fff;
  }
  @include webTheme('white'){
    color: #555;
  }
}
.theme-text-content{
  color: #fff;
  @include webTheme('green'){
    color: #fff;
  }
  @include webTheme('white'){
    color: #111;
  }
}
.theme-text-ptr-white{
  color: #555!important;
}
.theme-icon{
  color: #fff;
  @include webTheme('green'){
    color: #02432D;
  }
  @include webTheme('white'){
    color: #111111;
  }
}
.theme-text1{
  color: #B1BAD3;
  border: 1px dashed #B1BAD3;
  @include webTheme('green'){
    color: #3CB389;
    border: 1px dashed #3CB389;
  }
  @include webTheme('white'){
    color: #555;
    border: 1px dashed #555;
  }
}
.theme-title{
  @include webTheme('white'){
    color: #555;
  }
}
.theme-btn{
  border-radius: 100px;
  background: linear-gradient(180deg, #00D201 -26.39%, #005600 100%), linear-gradient(180deg, #8EFF8F 0%, #00E701 100%);
  height: 36px;
  margin-right: 10px;
  color: #fff;
  --tg-icon-color:#02432D;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  @include webTheme('green'){
    color: #02432D;
    background: linear-gradient(180deg, #FFEB7C 0%, #D89E00 100%);
  }
  @include webTheme('white'){
    color: #111;
    --tg-icon-color:#111;
    background: linear-gradient(180deg, #FFEB7C 0%, #D89E00 100%);
  }
}
</style>
