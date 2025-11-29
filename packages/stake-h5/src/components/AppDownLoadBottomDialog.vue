<script lang="ts" setup>
import { IconCloseIcon } from '@tg/icons'
const languageStore = useLanguageStore()
const { userLanguage, isZhcn } = storeToRefs(languageStore)
const dialogDownLoadData = ref<Record<string, any>>({})
const notLoginReloadDialog = useNotLoginReloadDialog()
const isShowAdd = ref(false)
function downLoad() {
  if (window.downloadStore.downLoad() === 'ShowSafari')
    isShowAdd.value = true
}
function closeAdd() {
  isShowAdd.value = false
}

function getIsShowDialogDownLoad() {
  try {
    const data = JSON.parse(globalInitMap.allBrandInfo?.pc?.bottom_app_download ?? '')
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
  <div class="relative">
    <div class="absolute right-[10px] top-[10px] flex items-center justify-center" @click="notLoginReloadDialog.next()">
      <IconCloseIcon style="font-size: 14px;" class="close-icon" />
    </div>
    <div
      class="h-[140px] rounded-t-[12px] px-[25px] pb-[12px] pt-[13px]"
      :style="{ backgroundColor: dialogDownLoadData.bgColor }"
    >
      <div class="mb-[15px] flex items-center">
        <div class="mr-[14px] h-[56px] w-[56px] flex-shrink-0">
          <BaseImage class="h-[56px] w-[56px]" fit="cover" is-network :url="dialogDownLoadData.icon" />
        </div>
        <div class="text-tg-text-white font-medium" :class="[isZhcn ? '' : 'text-[18px] font-semibold']">
          <div class="mb-[4px]" :style="{ color: dialogDownLoadData.titleColor }">
            {{ dialogDownLoadData.title }}
          </div>
          <div :style="{ color: dialogDownLoadData.contentColor }">
            {{ dialogDownLoadData.content }}
          </div>
        </div>
      </div>
      <div class="w-full flex gap-[24px]">
        <div
          class="h-[36px] w-[50%] flex items-center justify-center border rounded-[6px] border-solid text-[14px] font-medium"
          :style="{ borderColor: dialogDownLoadData.buttonBorder, color: dialogDownLoadData.buttonBorder }"
          @click="notLoginReloadDialog.next()"
        >
          {{ $t('cancel') }}
        </div>
        <div
          class="h-[36px] w-[50%] flex cursor-pointer items-center justify-center overflow-hidden text-ellipsis rounded-[6px] pl-[6px]"
          :style="{ backgroundColor: dialogDownLoadData.buttonBorder }"
          @click="downLoad"
        >
          <BaseImage class="h-[20px] min-w-[20px] w-[20px]" is-network :url="isIos() ? dialogDownLoadData.imgIcon.ios : dialogDownLoadData.imgIcon.android" />
          <span :style="{ color: dialogDownLoadData.buttonTextColor }" class="ml-[4px] overflow-hidden text-ellipsis whitespace-nowrap font-semibold">{{ dialogDownLoadData.buttonText }}</span>
        </div>
      </div>
    </div>
  </div>
  <AppAddToDesk v-if="isShowAdd" @close="closeAdd" />
</template>

<style lang="scss" scoped>
.close-icon {
  @include webTheme('green'){
    color:#fff;
  }
  @include webTheme('white'){
    color:#555555;
  }
}
</style>
