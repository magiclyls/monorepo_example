import AppWalletsDialog from '~/components/AppWalletsDialog.vue'
import type { EnumCurrencyKey } from '@tg/types'
import { SendFlutterThirdPartyAppMessage } from '@tg/types'
import {  sendMsgToFlutterThirdPartyApp } from '~/utils'

export function useWalletDialog(params?: {
  activeTab?: string
  initCurrency?: EnumCurrencyKey
  initCurrentNetwork?: string
  depositTab?: string
}) {
  const { openDialog: openWalletDialog, closeDialog: closeWalletDialog } = useDialog({
    default: () => h(AppWalletsDialog, {
      // 主tab
      activeTab: params?.activeTab,
      initCurrency: params?.initCurrency,
      initCurrentNetwork: params?.initCurrentNetwork,
      // 存款页面下面的副tab
      depositTab: params?.depositTab,
    }),
  })

  return {
    openWalletDialog: () => {
      sendMsgToFlutterThirdPartyApp(SendFlutterThirdPartyAppMessage.RECHARGECLICK)
      sendMsgToAdjust(SendFlutterThirdPartyAppMessage.RECHARGECLICK)
      openWalletDialog()
    },
    closeWalletDialog,
  }
}
