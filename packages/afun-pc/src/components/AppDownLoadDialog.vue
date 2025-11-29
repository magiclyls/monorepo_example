<script lang="ts" setup>
import { IconDialogDownloadClose } from '@tg/icons'
interface Props {
  isInNormalDialog?: boolean
}
const props = defineProps<Props>()

const closeDialog = inject('closeDialog', () => { })

const languageStore = useLanguageStore()
const { userLanguage, isZhcn } = storeToRefs(languageStore)
const dialogDownLoadData = ref<Record<string, any>>({})
const notLoginReloadDialog = useNotLoginReloadDialog()
const isShowAdd = ref(false)
function downLoad() {
  if (window.downloadStore.downLoad(true) === 'ShowSafari')
    isShowAdd.value = true
}
function closeAdd() {
  isShowAdd.value = false
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

function closeIconClick() {
  if (props.isInNormalDialog) {
    closeDialog()
    return
  }
  notLoginReloadDialog.next()
}
</script>

<template>
  <div>
    <div
      class="border-tg-secondary mb-[16px] min-h-[140px] border rounded-[12px] border-solid p-[12px] pt-[20px]"
      :style="{ backgroundColor: dialogDownLoadData.bgColor }"
    >
      <div class="mb-[16px] flex items-center">
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
      <div
        class="h-[36px] flex cursor-pointer items-center justify-center rounded-[6px]"
        :style="{ backgroundColor: dialogDownLoadData.buttonBorder }"
        @click="downLoad"
      >
        <BaseImage class="h-[20px] w-[20px]" is-network :url="isIos() ? dialogDownLoadData.imgIcon.ios : dialogDownLoadData.imgIcon.android" />
        <span :style="{ color: dialogDownLoadData.buttonTextColor }" class="ml-[4px] font-semibold">{{ dialogDownLoadData.buttonText }}</span>
      </div>
    </div>
  </div>
  <div class="flex items-center justify-center" @click="closeIconClick">
    <BaseImage width="30px" height="30px" url="/png/casino/dialog-download-close.png" />
  </div>

  <AppAddToDesk v-if="isShowAdd" @close="closeAdd" />
</template>

<style>
:root {
  --app-downLoad-dialog-close-icon-color: var(--tg-svg-default-color);
}

[theme="white"] {
  --app-downLoad-dialog-close-icon-color: #fff
}
[theme="green"] {
  --app-downLoad-dialog-close-icon-color: #fff
}
</style>
