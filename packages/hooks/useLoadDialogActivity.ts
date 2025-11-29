import { ApiMemberTurntableConfig, ApiMemberTurntableRecord } from '@tg/apis'
import { useAppStore, useCurrency, useDialogStore } from '@tg/stores'
import { application, getCurrencyConfig, isFlutterApp, Local, STORAGE_PROMO_AD_POP_LOGIN, STORAGE_PROMO_AD_POP_UNLOGIN } from '@tg/utils'
import { throttle } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRequest } from 'vue-request'
import { useRoute } from 'vue-router'
import { useGlobalPromoState } from './useGlobalPromoState'

interface IOPromoPopItem {
  id: string
  name: string
  state: number
  ty: number
  cfg: string
  display_type: string
  button_type: number
  button_redirect: string
}

interface TurntableDataType {
  showRoll?: boolean
  /** 首页弹框转盘配置是，首页弹框接口返回的 */
  data?: any
  state?: number
  pid?: string
  amount?: string
}

export function useLoadDialogActivity() {
  const isFetchOk = ref(false)
  const turntableData = ref<TurntableDataType | null>(null)
  const { isLogin } = storeToRefs(useAppStore())
  const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
  const dialogStore = useDialogStore()
  const route = useRoute()

  const activeCurrency = computed(() => {
    return application.isVirtualCurrency(currentGlobalCurrencyMap.value.type) ? getCurrencyConfig('706').cur : currentGlobalCurrencyMap.value.cur
  })

  const { runAsync: runAsyncTurntableConfig } = useRequest(ApiMemberTurntableConfig, {
    manual: true,
  })

  const { runPromoCombine } = useGlobalPromoState()

  async function getPromoPop(callBack?: (data: IOPromoPopItem, cfg: any) => void) {
    runPromoCombine().then((res) => {
      if (res && res.pop && res.pop.length > 0) {
        // 过滤哪些需要展示
        const _popArr = res.pop.filter((item) => {
        /** 所有活动都先判断是否弹出 1关闭 2未登陆弹 3登陆弹 4未登陆、登陆弹 */
          if (isLogin.value)
            return ['3', '4'].includes(item.pop)
          else
            return ['2', '4'].includes(item.pop)
        })

        // 有需要展示的但没有转盘
        if (_popArr.length === 0 || (_popArr.findIndex(a => a.ty === 1) === -1)) {
          isFetchOk.value = true
        }

        _popArr.sort((a, b) => b.ty - a.ty).forEach((item, index, array) => {
          // 如果是大转盘
          if (item.ty === 1) {
            const _data = item
            runAsyncTurntableConfig({ pid: item.id, cur: activeCurrency.value }).then((turnRes) => {
              const cfg = turnRes
              // try {
              //   cfg = JSON.parse(_data.cfg)
              // }
              // catch (err) {
              //   cfg = _data.cfg
              // }
              if (callBack) {
                callBack(_data, cfg)
              }
              else {
                turntableData.value = { showRoll: true, pid: _data.id, data: turnRes, state: _data.state }
                isFetchOk.value = true
              }
            })
          }
          else {
            // 除了转盘和首充的其他活动
            const _arr = array.filter(a => a.ty !== 1)

            const poped_unlogin = Local.get(STORAGE_PROMO_AD_POP_UNLOGIN)?.value
            const poped_login = Local.get(STORAGE_PROMO_AD_POP_LOGIN)?.value
            if (isLogin.value && poped_login === 'yes')
              return
            if (!isLogin.value && poped_unlogin === 'yes')
              return

            if (route.name === 'casino-home' || route.path === '/') {
              if (item.ty === _arr[_arr.length - 1]?.ty) {
                if (isLogin.value)
                  Local.set(STORAGE_PROMO_AD_POP_LOGIN, 'yes')
                else
                  Local.set(STORAGE_PROMO_AD_POP_UNLOGIN, 'yes')
              }
              if (item.ty !== 8) // 首充不要弹这个
                dialogStore.openPromoAdDialog(item)
            }
          }
        })
      }
      else {
        isFetchOk.value = true
      }
    })
  }
  const { runAsync: runAsyncTurntableRecord } = useRequest(ApiMemberTurntableRecord, {
    manual: true,
  })

  async function getTurntableRecord(_data: IOPromoPopItem, cfg: any) {
    try {
      const data = await runAsyncTurntableRecord({ pid: _data.id })
      if (!data) {
        turntableData.value = { showRoll: true, pid: _data.id, data: cfg, state: _data.state }
      }
    }
    catch (error) {
      // 处理错误
    }
    finally {
      isFetchOk.value = true
    }
  }

  async function unLoginOpenActivity() {
    if (isFlutterApp())
      return
    getPromoPop()
  }

  async function loggedOpenActivity() {
    getPromoPop(getTurntableRecord)
  }

  const loggedOpenActivityThrottle = throttle(() => {
    if (isFlutterApp())
      return
    loggedOpenActivity()
  }, 1 * 1000, {
    leading: true,
    trailing: false,
  })

  return {
    unLoginOpenActivity,
    loggedOpenActivityThrottle,
    isFetchOk,
    turntableData,
  }
}
