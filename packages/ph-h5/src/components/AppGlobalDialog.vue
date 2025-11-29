<script setup lang='ts'>
import { ApiOnPwaDialogClose } from '@tg/apis'
import { PhBaseDialog, PhBasePopup } from '@tg/bccomponents'
import { useAppStore, useDialogStore, useDownloadStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppAddToDesk from '~/components/AppAddToDesk.vue'
import AppDialogFacialRecognition from '~/components/AppDialogFacialRecognition.vue'
import AppDialogKYCVerify from '~/components/AppDialogKYCVerify.vue'
import AppDialogLoginPwa from '~/components/AppDialogLoginPwa.vue'
import AppDialogPromoAd from '~/components/AppDialogPromoAd.vue'
import AppDialogShareRegisterLink from '~/components/AppDialogShareRegisterLink.vue'
import AppReloadDialog from '~/components/AppReloadDialog.vue'
import AppReloadNotLoginDialog from '~/components/AppReloadNotLoginDialog.vue'
import { usePreferredLanguage } from '~/hooks'

defineOptions({ name: 'AppGlobalDialog' })
const { t } = useI18n()
const dialogStore = useDialogStore()
const { selectedLang } = usePreferredLanguage()
const {
  showSafeDialog,
  showShareRegisterLinkDialog,
  showPromoAdDialog,
  showLoginPwaDialog,
  showKYCVerifyDialog,
  showKFacialRecognitionDialog,
  dialogFacialRecognitionData,
} = storeToRefs(dialogStore)
const { isShowAddToDesk } = storeToRefs(useDownloadStore())
const { isLogin } = storeToRefs(useAppStore())
watch(showLoginPwaDialog, () => {
  if (!showLoginPwaDialog.value && selectedLang.value && isLogin) {
    ApiOnPwaDialogClose({ lang: selectedLang.value.value.replace('-', '_') })
  }
})
</script>

<template>
  <div>
    <!-- ios添加桌面 -->
    <PhBasePopup v-model="isShowAddToDesk">
      <AppAddToDesk />
    </PhBasePopup>
    <!-- 首页弹窗 -->
    <AppReloadDialog v-if="isLogin" />
    <AppReloadNotLoginDialog v-else />
    <!-- pwa提示弹窗 -->
    <PhBasePopup v-model="showLoginPwaDialog">
      <AppDialogLoginPwa @close="dialogStore.showLoginPwaDialog = false" />
    </PhBasePopup>
    <!-- 保险库弹窗 -->
    <PhBaseDialog v-if="showSafeDialog" v-model="showSafeDialog">
      保险库弹窗
    </PhBaseDialog>
    <!-- 分享注册链接 -->
    <PhBaseDialog
      v-if="showShareRegisterLinkDialog" v-model="showShareRegisterLinkDialog" :title="t('分享注册链接')"
      style="--ph-base-dialog-background-color: #F6F7F8;"
    >
      <AppDialogShareRegisterLink />
    </PhBaseDialog>
    <AppDialogPromoAd v-if="showPromoAdDialog" />
    <!-- 绑定CPF -->
    <PhBaseDialog v-if="showKYCVerifyDialog" v-model="showKYCVerifyDialog">
      <AppDialogKYCVerify />
    </PhBaseDialog>
    <!-- 人脸识别 -->
    <PhBaseDialog v-if="showKFacialRecognitionDialog" v-model="showKFacialRecognitionDialog">
      <AppDialogFacialRecognition v-bind="dialogFacialRecognitionData" />
    </PhBaseDialog>
  </div>
</template>

<style lang='scss' scoped></style>
