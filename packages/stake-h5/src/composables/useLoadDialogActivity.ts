import { ApiMemberTurntableConfig, ApiMemberTurntableRecord } from '@tg/apis'

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
  const { isLogin, currentGlobalCurrency } = storeToRefs(useAppStore())
  // const { openFreeGetManyDialog } = useDialogFreeGetMany()
  // const { openTurntableFirstDialog } = useDialogTurntableFirst()
  const { openPromoAdDialog } = usePromoAdDialog()
  const route = useRoute()
  const { rightIsExpand } = useRightSidebar()
  const { isMobile } = storeToRefs(useWindowStore())

  const activeCurrency = computed(() => {
    // 虚拟币统一使用USDT
    const val = application.isVirtualCurrency(currentGlobalCurrency.value) ? 'USDT' : currentGlobalCurrency.value
    return currencyConfig[isLogin.value ? val : (languageConfig[getCurrentLanguageForFrontend()].currency)]
  })
  const { runAsync: runAsyncTurntableConfig } = useRequest(ApiMemberTurntableConfig, {
    manual: true,
  })

  const { runPromoCombine } = useGlobalPromoState()

  async function getPromoPop(callBack?: (data: IOPromoPopItem, cfg: any) => void) {
    runPromoCombine().then((res) => {
      if (!callBack)
        isFetchOk.value = true

      if (res && res.pop && res.pop.length > 0) {
        // 过滤哪些需要展示
        const _popArr = res.pop.filter((item) => {
        /** 所有活动都先判断是否弹出 1关闭 2未登陆弹 3登陆弹 4未登陆、登陆弹 */
          if (isLogin.value)
            return ['3', '4'].includes(item.pop)
          else
            return ['2', '4'].includes(item.pop)
        })

        // 登陆状态下没有需要展示的、有需要展示的但没有转盘
        if (_popArr.length === 0 || (callBack && _popArr.findIndex(a => a.ty === 1) === -1))
          isFetchOk.value = true

        _popArr.sort((a, b) => b.ty - a.ty).forEach((item, index, array) => {
          // 如果是大转盘
          if (item.ty === 1) {
            const _data = item
            runAsyncTurntableConfig({ pid: item.id, cur: activeCurrency.value.cur }).then((turnRes) => {
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
                if ((route.name === 'casino-home' || route.path === '/') && (isMobile.value ? !rightIsExpand.value : true))
                  turntableData.value = { showRoll: true, pid: _data.id, data: turnRes, state: _data.state }

                // openTurntableFirstDialog({ showRoll: true, pid: _data.id, data: cfg, state: _data.state })
                // window.scrollTo({ top: -50, behavior: 'smooth' })
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
              if (item.ty != 8) // 首充不要弹这个
                openPromoAdDialog(item)
            }
          }
        })
      }
      else {
        isFetchOk.value = true
      }
    })
  }
  function getTurntableRecord(_data: IOPromoPopItem, cfg: any) {
    useRequest(ApiMemberTurntableRecord, {
      manual: false,
      defaultParams: [
        { pid: _data.id },
      ],
      onSuccess(data) {
        isFetchOk.value = true
        if (!data) {
          if ((route.name === 'casino-home' || route.path === '/') && (isMobile.value ? !rightIsExpand.value : true))
            turntableData.value = { showRoll: true, pid: _data.id, data: cfg, state: _data.state }
            // openTurntableFirstDialog({ showRoll: true, pid: _data.id, data: cfg, state: _data.state })
            // window.scrollTo({ top: -50, behavior: 'smooth' })
        }
      },
    })
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
