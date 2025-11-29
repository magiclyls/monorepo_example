<script setup lang='ts'>
import { AfunBaseButton, AfunBaseImage } from '@tg/bccomponents'
import { useKYC } from '@tg/hooks'
import { IconUniFaceNogood } from '@tg/icons'
import { EventBusNames } from '@tg/types'
import { appEventBus, getEnv } from '@tg/utils'
import { nanoid } from 'nanoid'
import { inject, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  onCancel?: () => void
  onConfirm?: () => void
  cpf: string
  successText?: string
}

defineOptions({ name: 'AppDialogFacialRecognition' })
const props = defineProps<Props>()
const { t } = useI18n()
const closeDialog = inject('closeDialog', () => { })
const { VITE_KYC_FACIAL_RECOGNITION_PREFIX } = getEnv()
const { loadLegitimuzCDNAndInit, startFacialRecognitionFlow } = useKYC()

const isLoading = ref(false)
const isStartFaceScan = ref(false)
const isFaceScanGood = ref(false)
const referenceId = `${VITE_KYC_FACIAL_RECOGNITION_PREFIX}${nanoid()}`
console.log('🚸🚸🚸 ~ referenceId:', referenceId)

function onConfirmClick() {
  if (props.onConfirm)
    props.onConfirm()

  nextTick(() => {
    closeDialog()
  })
}

function onFacialRecognitionSuccess(data: any) {
  console.log('🚸🚸🚸 ~ 脸部识别完成 ~ data:', data)
  /** 脸部识别完成 */
  if (data.ref_id === referenceId)
    isFaceScanGood.value = true
}

function startFaceScan() {
  isLoading.value = true
  startFacialRecognitionFlow({
    cpf: props.cpf,
    referenceId,
  }).then(() => {
    isStartFaceScan.value = true
    isLoading.value = false
  })
}

// 加载KYC CDN
loadLegitimuzCDNAndInit()

onMounted(() => {
  appEventBus.on(EventBusNames.KYC_FACIAL_RECOGNITION_SUCCESS, onFacialRecognitionSuccess)
})
onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.KYC_FACIAL_RECOGNITION_SUCCESS, onFacialRecognitionSuccess)
})
</script>

<template>
  <div class="w-full px-[16px] pb-[32px]">
    <h5 class="mb-[12px] text-[18px] font-semibold leading-[25px]">
      {{ t('人脸识别扫描') }}
    </h5>
    <div class="w-full flex flex-col items-center">
      <div
        class="theme-text mb-[32px] w-full text-[14px] font-semibold leading-[21px]"
      >
        {{ t('为了您的保障资金安全') }}
      </div>
      <div class="mb-[32px] w-[140px] flex items-center justify-center">
        <AfunBaseImage url="/png/face-good.png" />
      </div>
      <div class="mb-[16px] h-[21px]">
        <template v-if="isStartFaceScan">
          <div v-if="isFaceScanGood" class="flex items-center">
            <AfunBaseImage width="20px" height="20px" url="/png/uni-face-good.png" />
            <span class="theme-text2 ml-[8px] text-[14px] font-semibold leading-[21px]">
              {{ t('人脸识别成功') }}
            </span>
          </div>
          <div v-else class="flex items-center">
            <IconUniFaceNogood name="uni-face-nogood" class="theme-icon2 text-[20px]" />
            <span class="theme-text3 ml-[8px] text-[14px] font-semibold leading-[21px]">
              {{ t('人脸识别失败') }}
            </span>
          </div>
        </template>
      </div>
      <AfunBaseButton v-if="!isStartFaceScan" :loading="isLoading" class="them-btn h-[44px] w-full" @click="startFaceScan">
        {{ t('立即识别') }}
      </AfunBaseButton>
      <template v-if="isStartFaceScan">
        <!-- 成功 -->
        <AfunBaseButton v-if="isFaceScanGood" class="them-btn h-[44px] w-full" @click="onConfirmClick">
          {{ successText ? successText : t('提交') }}
        </AfunBaseButton>
        <!-- 失败 -->
        <AfunBaseButton v-else class="them-btn h-[44px] w-full" :loading="isLoading" @click="startFaceScan">
          {{ t('重新识别') }}
        </AfunBaseButton>
      </template>
    </div>
  </div>
</template>

<style lang='scss' scoped>
h5 {
  color: #fff;
}

.theme-text {
  color: #b1bad3;
}

.theme-icon1 {
  color: #24ee89;
}

.theme-icon2 {
  color: #ed4163;
}

.theme-text2 {
  color: #24ee89;
}

.theme-text3 {
  color: #ed4163;
}

.them-btn {
  --tg-base-button-style-bg: #24ee89;
  --tg-base-button-style-bg-hover: #24ee89;
  --tg-base-button-color: #071824;
}
</style>
