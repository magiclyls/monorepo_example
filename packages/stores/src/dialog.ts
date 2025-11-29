import { useBoolean } from '@tg/hooks'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * @description 全局弹窗
 */
export const useDialogStore = defineStore('dialog', () => {
  /** loginpwa弹窗 */
  const showLoginPwaDialog = ref(false)
  /** 保险柜弹窗 */
  const { bool: showSafeDialog, setTrue: openSafeDialog } = useBoolean(false)
  /** 分享注册链接 */
  const { bool: showShareRegisterLinkDialog, setTrue: setShowShareRegisterLinkDialogTrue } = useBoolean(false)
  /** 活动弹窗 */
  const { bool: showPromoAdDialog, setBool: setShowPromoAdDialogBool } = useBoolean(false)
  /** 红包雨 */
  const dialogRainData = ref<any>()
  /** 红包雨领取结果 */
  const dialogBonusData = ref<any>()
  /** 分享弹窗 */
  const showShareDialog = ref(false)
  /** 绑定CPF */
  const { bool: showKYCVerifyDialog, setTrue: openShowKYCVerifyDialog } = useBoolean(false)
  /** 人脸识别弹窗 */
  const { bool: showKFacialRecognitionDialog } = useBoolean(false)
  const dialogFacialRecognitionData = ref()

  // 传递给活动弹窗的props
  const promoAdDialogProps = ref<Record<string, any>>()
  // 打开首动弹窗 结合props传递
  function openPromoAdDialog(props: Record<string, any>) {
    promoAdDialogProps.value = props
    setShowPromoAdDialogBool(true)
  }

  // 打开人脸识别弹窗
  function openFacialRecognitionDialog(props: {
    onCancel?: () => void
    onConfirm?: () => void
    cpf: string
    successText?: string
  }) {
    dialogFacialRecognitionData.value = props
    showKFacialRecognitionDialog.value = true
  }

  return {
    showSafeDialog,
    showShareRegisterLinkDialog,
    showPromoAdDialog,
    promoAdDialogProps,
    dialogRainData,
    dialogBonusData,
    showLoginPwaDialog,
    showShareDialog,
    showKYCVerifyDialog,
    showKFacialRecognitionDialog,
    dialogFacialRecognitionData,
    openSafeDialog,
    setShowShareRegisterLinkDialogTrue,
    openPromoAdDialog,
    setShowPromoAdDialogBool,
    openShowKYCVerifyDialog,
    openFacialRecognitionDialog,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useDialogStore, import.meta.hot))
