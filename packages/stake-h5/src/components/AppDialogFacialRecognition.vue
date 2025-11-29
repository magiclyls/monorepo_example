<script setup lang='ts'>
import { nanoid } from 'nanoid'
import { IconUniFaceGood, IconUniFaceNogood } from '@tg/icons'
import { getEnv } from '@tg/utils';

interface Props {
  onCancel: () => void
  onConfirm: () => void
  cpf: string
  successText?: string
}

defineOptions({ name: 'AppDialogFacialRecognition' })
const props = defineProps<Props>()
const { t } = useI18n()
const closeDialog = inject('closeDialog', () => { })
const { VITE_KYC_FACIAL_RECOGNITION_PREFIX } = getEnv()

const { isMobile } = storeToRefs(useWindowStore())
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
  <div class="w-full p-[16px] pb-[32px]">
    <h5 class="mb-[12px] text-[18px] font-semibold leading-[25px]">
      {{ t('kyc_face_scan') }}
    </h5>
    <div class="w-full flex flex-col items-center">
      <div
        class="theme-text mb-[32px] w-full text-[14px] font-semibold leading-[21px]"
        :class="isMobile ? '' : 'text-center'"
      >
        {{ t('kyc_face_scan_for_good') }}
      </div>
      <div class="mb-[32px] w-[140px] flex items-center justify-center">
        <BaseImage url="/png/kyc/face-good.png" />
      </div>
      <div class="mb-[16px] h-[21px]">
        <template v-if="isStartFaceScan">
          <div v-if="isFaceScanGood" class="flex items-center">
            <IconUniFaceGood class="theme-icon1 text-[20px]" />
            <span class="theme-text2 ml-[8px] text-[14px] font-semibold leading-[21px]">
              {{ t('kyc_face_scan_good') }}
            </span>
          </div>
          <div v-else class="flex items-center">
            <IconUniFaceNogood class="theme-icon2 text-[20px]" />
            <span class="theme-text3 ml-[8px] text-[14px] font-semibold leading-[21px]">
              {{ t('kyc_face_scan_not_good') }}
            </span>
          </div>
        </template>
      </div>
      <BaseButton v-if="!isStartFaceScan" :loading="isLoading" class="them-btn h-[44px] w-full" @click="startFaceScan">
        {{ t('kyc_face_scan_now') }}
      </BaseButton>
      <template v-if="isStartFaceScan">
        <!-- 成功 -->
        <BaseButton v-if="isFaceScanGood" class="them-btn h-[44px] w-full" @click="onConfirmClick">
          {{ successText ? successText : t('submit') }}
        </BaseButton>
        <!-- 失败 -->
        <BaseButton v-else class="them-btn h-[44px] w-full" :loading="isLoading" @click="startFaceScan">
          {{ t('kyc_face_scan_again') }}
        </BaseButton>
      </template>
    </div>
  </div>
</template>

<style lang='scss' scoped>
h5 {
  color: var(--tg-text-white);
}

.theme-text {
  color: var(--tg-text-lightgrey);

  @include webTheme('green') {
    color: #5ECEA6;
  }
}

.theme-icon1 {
  --tg-icon-color: #00E701;

  @include webTheme('white') {
    --tg-icon-color: #00A501;
  }

  @include webTheme('green') {
    --tg-icon-color: #2DFF0B;
  }
}

.theme-icon2 {
  --tg-icon-color: #FC3C3C;

  @include webTheme('white') {
    --tg-icon-color: #E91134;
  }

  @include webTheme('green') {
    --tg-icon-color: #E9233C;
  }
}

.theme-text2 {
  color: #24EE89;

  @include webTheme('white') {
    color: #00A501;
  }

  @include webTheme('green') {
    color: #2DFF0B;
  }
}

.theme-text3 {
  color: #FC3C3C;

  @include webTheme('white') {
    color: #E91134;
  }

  @include webTheme('green') {
    color: #E9233C;
  }
}

.them-btn {
  --tg-base-button-style-bg: #00E701;
  --tg-base-button-style-bg-hover: #00E701;
  --tg-base-button-color: #071824;

  @include webTheme('white') {
    --tg-base-button-style-bg: #F2CA5C;
    --tg-base-button-style-bg-hover: #F2CA5C;
    --tg-base-button-color:#111;
  }
   @include webTheme('green') {
    --tg-base-button-style-bg: #F6D14A;
    --tg-base-button-style-bg-hover: #F6D14A;
    --tg-base-button-color:#02432D;
  }
}
</style>
