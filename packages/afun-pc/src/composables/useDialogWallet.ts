import type { CurrencyCode, EnumCurrencyKey } from '@tg/types'
import { SendFlutterThirdPartyAppMessage } from '@tg/types'
import {  sendMsgToFlutterThirdPartyApp } from '~/utils'
import qs from 'qs'

interface QueryParams {
  currency?: CurrencyCode
  subtab?: string
}
export function useWalletDialog(params?: {
  activeTab?: string
  initCurrency?: EnumCurrencyKey
  depositTab?: string
}) {
  /* const { openDialog: openWalletDialog, closeDialog: closeWalletDialog } = useDialog({
    default: () => h(AppWalletsDialog, {
      // 主tab
      activeTab: params?.activeTab,
      initCurrency: params?.initCurrency,
      initCurrentNetwork: params?.initCurrentNetwork,
      // 存款页面下面的副tab
      depositTab: params?.depositTab,
    }),
  }) */
  const router = useLocalRouter()
  return {
    openWalletDialog: () => {
      sendMsgToFlutterThirdPartyApp(SendFlutterThirdPartyAppMessage.RECHARGECLICK)
      sendMsgToAdjust(SendFlutterThirdPartyAppMessage.RECHARGECLICK)
      let url = '/center/deposit'
      if(params?.activeTab === 'withdraw'){
        url = '/center/withdraw'
      }
      const query: QueryParams = {}
      if(params?.initCurrency){
        query.currency = getCurrencyConfig(params?.initCurrency).cur
      }
      if(params?.depositTab){
        query.subtab = params?.depositTab
      }
      router.push(`${url}?${qs.stringify(query)}`)
    },
    closeWalletDialog:()=>{},
  }
}
