import type { EnumJump as EnumJumpType } from '~/utils/enums'
import { ApiMemberTurntableRecord } from '@tg/apis'

interface PromoItem {
  /** 活动id */
  id: string
  /** 活动类型 */
  ty: number
  /** 活动状态，列表活动状态 */
  state?: number
  /** 展示方式 1:内置页面 2:跳转外部链接 */
  display_type?: '1' | '2'
  /** 按钮跳转链接 */
  button_redirect?: string
  button_type?: EnumJumpType
  config?: string
  /** 活动列表页 活动开始时间戳 */
  start_at?: number
  display_mode: number

  end_at?: number
}

/** 活动子菜单 */
export const useActivityMenu = createGlobalState(() => {
  const { t } = useI18n()
  const { isLogin } = storeToRefs(useAppStore())
  const router = useLocalRouter()
  const { isMobile } = storeToRefs(useWindowStore())
  const { openNotify } = useNotify()

  // const { openFreeGetManyDialog } = useDialogTurntableFirst()
  const { openTurntableFirstDialog } = useDialogTurntableFirst()
  const { toCustomUrl, jumpToUrl } = useRedirect()
  const { promoSideBar } = useGlobalPromoState()
  const { leftIsExpand, closeLeftSidebar } = useLeftSidebar()

  const activitySidebar = computed(() => {
    return promoSideBar.value.map((item) => {
      return {
        title: item.name,
        path: getPath(item.ty),
        fullPath: getFullPath(item),
        icon: getIcon(item),
        backFun: () => openActivity(item),
        promo_id: item.id,
        // useCloudImg: true,
      }
    }).concat([{
      title: t('view_all'),
      path: '/promotion',
      icon: 'chess-gameshow',
      clazz: 'has-line',
    }]) ?? []
  })

  async function goPromo(path: string) {
    await nextTick()
    router.push(path)
  }

  const notifyThrottle = throttle(() => {
    openNotify({
      icon: 'chess-gameshow',
      iconColor: '--tg-text-alltheme-green',
      title: t('activity_tip'),
      message: t('awesome_coming'),
    })
  }, 5 * 1000, { leading: true, trailing: false })

  /**
   * @param PromoItem
   * @param entranceType 从哪里进入 1-活动列表 2-右侧活动菜单 3-右下角快捷入口
   *
   */
  function openActivity(item: PromoItem, entranceType?: 1 | 2 | 3) {
    const { id: pid, ty, state, display_type, button_redirect, button_type, config, start_at, end_at } = item
    let red_start_stamp
    const now_stamp = new Date().getTime()
    if (item.display_mode === 2)
      return notifyThrottle()
    if (!start_at || !end_at) {
      return openNotify({
        type: 'error',
        code: 'false',
        message: t('promo_end'),
      })
    }
    if (end_at && +end_at > 0) {
      if (now_stamp > checkTs(+end_at)) {
        return openNotify({
          type: 'error',
          code: 'false',
          message: t('promo_end'),
        })
      }
    }

    if (start_at && +start_at > 0) {
      if (now_stamp < checkTs(+start_at)) {
        notifyThrottle()
        return
      }
    }
    switch (ty) {
      case 1:
        if ((!isLogin.value) || entranceType === 1) { // 从活动列表进入直接进入活动详情
          goPromo(`/promotions/promotion/weekly-giveaway?pid=${pid}`)
        }
        else {
          if (!router.currentRoute.value.path.includes('/weekly-giveaway')) {
            useRequest(ApiMemberTurntableRecord, {
              manual: false,
              defaultParams: [
                { pid },
              ],
              onSuccess(data) {
                if (state === 2) { // 从侧边栏或者，右下角进入，2-已结束
                  goPromo(`/promotions/promotion/weekly-giveaway?pid=${pid}`)
                  return
                }
                if (data) {
                  if (data.state == 4 && data.last_apply == 2) { // 表示最已经领取奖金，还可以重新转
                    openTurntableFirstDialog({ showRoll: true, pid })
                  }
                  else {
                    goPromo(`/promotions/promotion/weekly-giveaway?pid=${pid}`)
                  }
                }
                else { openTurntableFirstDialog({ showRoll: true, pid, state }) }
              },
            })
          }
        }
        return
      case 2:
        goPromo(`/promotions/promotion/invite?pid=${pid}`)
        return
      case 3:
        red_start_stamp = localStorage.getItem(`promo_red_start_${pid}_${getCurrentLanguageForBackend()}`)

        if (red_start_stamp && +red_start_stamp > 0) {
          if (now_stamp < +red_start_stamp) {
            notifyThrottle()
            return
          }
        }

        goPromo(`/promotions/promotion/dollar-waves?promoid=${pid}`)
        break
      case 4:
        goPromo(`/promotions/promotion/back-cash?pid=${pid}`)
        break
      case 5:
        if (`${display_type}` === '2') {
          if (button_type !== EnumJump.CUSTOM) {
            jumpToUrl({
              type: button_type,
              jumpUrl: button_redirect,
            })
          }
          else {
            toCustomUrl(button_redirect ?? '')
          }
        }
        else { goPromo(`/promotions/promotion/customize?pid=${pid}`) }
        break
      case 6:
        goPromo(`/promotions/promotion/betting-rewards?pid=${pid}`)
        break
      case 7:
        goPromo(`/promotions/promotion/auspicious-award?pid=${pid}`)
        break
      case 8:{
        let cond = 1 // 1首充 2累计 3注册
        try {
          const conf = config ? JSON.parse(config) : {}
          cond = conf.cond
        }
        catch (e) {

        }
        goPromo(`/promotions/promotion/recharge?pid=${pid}&cond=${cond}`)
        isMobile.value && leftIsExpand.value && closeLeftSidebar()
      }
        break
      case 9:
        goPromo(`/promotions/promotion/signin-rewards?pid=${pid}`)
        break
      case 10:
        goPromo(`/promotions/promotion/agent-day-reward?pid=${pid}`)
        break
      case 11:
        goPromo(`/promotions/promotion/agent-month-reward?pid=${pid}`)
        break
      case 12:
        goPromo(`/promotions/promotion/every-eight?pid=${pid}`)
        break
      case 13:
        goPromo(`/promotions/promotion/fixed-recharge?pid=${pid}`)
        break
      case 14:
        goPromo(`/promotions/promotion/wallet-payment-deposit?pid=${pid}`)
        break
      case 15:
        goPromo(`/promotions/promotion/mystery-box?pid=${pid}`)
        break
      case 16:
        goPromo(`/promotions/promotion/member-appreciation?pid=${pid}`)
        break
      case 17:
        goPromo(`/promotions/promotion/mysterious-mine?pid=${pid}`)
        break
      case 18:
        goPromo(`/promotions/promotion/invite-friends?pid=${pid}`)
        break
      default:
        break
    }
  }
  function getIcon(item: PromoItem) {
    const { ty, config } = item

    switch (ty) {
      case 1: return 'uni-activity-roulette'
      case 2: return 'uni-activity-tg'
      case 3: return 'uni-activity-hb'
      case 4: return 'uni-activity-back-cash'
      case 5: return 'uni-activity-customize'
      case 6: return 'uni-activity-rewards'
      case 7: return 'uni-activity-auspicious'
      case 8: {
        let cond = 1 // 1首充 2累计 3注册
        try {
          const conf = config ? JSON.parse(config) : {}
          cond = conf.cond
        }
        catch (e) {

        }
        return ['uni-activity-first-recharge', 'uni-activity-acc-recharge', 'uni-activity-reg-recharge'][cond - 1]
      }
      case 9: return 'uni-activity-rewards'
      case 10: return 'uni-activity-agent-day'
      case 11: return 'uni-activity-agent-month'
      case 12: return 'uni-activity-every8'
      case 13: return 'uni-activity-fix-recharge'
      case 14: return 'uni-activity-wallet-payment-deposit'
      case 15: return 'uni-activity-mystery-box'
      case 17: return 'uni-activity-mysterious-mine'
      case 16: return 'uni-activity-vector'
      case 18: return 'uni-activity-invite-frineds'
      default: return 'uni-vector'
    }
  }
  function getPath(ty: number) {
    switch (ty) {
      case 1: return '/promotions/promotion/weekly-giveaway'
      case 2: return '/promotions/promotion/invite'
      case 3: return '/promotions/promotion/dollar-waves'
      case 4: return '/promotions/promotion/back-cash'
      case 5: return '/promotions/promotion/customize'
      case 6: return '/promotions/promotion/betting-rewards'
      case 7: return '/promotions/promotion/auspicious-award'
      case 8: return '/promotions/promotion/recharge'
      case 9: return '/promotions/promotion/signin-rewards'
      case 10: return '/promotions/promotion/agent-day-reward'
      case 11: return '/promotions/promotion/agent-month-reward'
      case 12: return '/promotions/promotion/every-eight'
      case 13: return '/promotions/promotion/fixed-recharge'
      case 14: return '/promotions/promotion/wallet-payment-deposit'
      case 15: return '/promotions/promotion/mystery-box'
      case 17: return '/promotions/promotion/mysterious-mine'
      case 16: return '/promotions/promotion/member-appreciation'
      case 18: return '/promotions/promotion/invite-friends'
      default: return ''
    }
  }

  function getFullPath(item: PromoItem) {
    const { id: pid, ty, config } = item
    // 目前仅充值活动需要 完全匹配
    switch (ty) {
      case 8: {
        let cond = 1 // 1首充 2累计 3注册
        try {
          const conf = config ? JSON.parse(config) : {}
          cond = conf.cond
        }
        catch (e) {

        }
        return `/promotions/promotion/recharge?pid=${pid}&cond=${cond}`
      }
      default: return ''
    }
  }
  return {
    activitySidebar,
    openActivity,
  }
})
