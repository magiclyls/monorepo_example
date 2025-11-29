<script setup lang='ts'>
import { ApiOnPwaDialogClose } from '@tg/apis'
import { AfunBaseDialog, AfunBasePopup } from '@tg/bccomponents'
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
import AppShareDialog from '~/components/AppShareDialog.vue'
import { usePreferredLanguage } from '~/hooks'

defineOptions({ name: 'AppGlobalDialog' })
const { t } = useI18n()
const dialogStore = useDialogStore()
const { selectedLang } = usePreferredLanguage()
const {
  showSafeDialog,
  showShareRegisterLinkDialog,
  showShareDialog,
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
    <AfunBasePopup v-model="isShowAddToDesk">
      <AppAddToDesk />
    </AfunBasePopup>
    <!-- 首页弹窗 -->
    <AppReloadDialog v-if="isLogin" />
    <AppReloadNotLoginDialog v-else />
    <!-- pwa提示弹窗 -->
    <AfunBasePopup v-model="showLoginPwaDialog">
      <AppDialogLoginPwa @close="dialogStore.showLoginPwaDialog = false" />
    </AfunBasePopup>
    <!-- 保险库弹窗 -->
    <AfunBaseDialog v-if="showSafeDialog" v-model="showSafeDialog">
      保险库弹窗
    </AfunBaseDialog>
    <!-- 分享注册链接 -->
    <AfunBaseDialog v-model="showShareRegisterLinkDialog" :title="t('分享注册链接')">
      <AppDialogShareRegisterLink />
    </AfunBaseDialog>
    <AfunBaseDialog v-model="showShareDialog" :title="t('立即邀请')">
      <AppShareDialog />
    </AfunBaseDialog>
    <AppDialogPromoAd v-if="showPromoAdDialog" />
    <!-- 绑定CPF -->
    <AfunBaseDialog v-if="showKYCVerifyDialog" v-model="showKYCVerifyDialog">
      <AppDialogKYCVerify />
    </AfunBaseDialog>
    <!-- 人脸识别 -->
    <AfunBaseDialog v-if="showKFacialRecognitionDialog" v-model="showKFacialRecognitionDialog">
      <AppDialogFacialRecognition v-bind="dialogFacialRecognitionData" />
    </AfunBaseDialog>
  </div>
</template>

<style lang='scss' scoped></style>
