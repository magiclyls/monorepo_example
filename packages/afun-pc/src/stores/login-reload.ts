import { acceptHMRUpdate, defineStore } from 'pinia'

export type LoginNameType = 'Announcement' | 'Activity' | 'ActivityDeposit' | 'firstRecharge'

/**
 * @description 管理页面刷新弹框
 */
export const useLoginReloadDialog = defineStore('loginReloadDialog', () => {
  const HIDE_TODAY = 'local_hide_unlogin_first_recharge_today'
  const HIDE_FOREVER = 'local_hide_unlogin_first_recharge'
  const FORMAT1 = 'YYYY-MM-DD'
  const curIndex = ref(0)
  const curName = ref<LoginNameType>()
  const route = useRoute()
  const today = dayjs()
  const { bool: isShow, setTrue: setShowTrue, setFalse: setShowFalse } = useBoolean(false)
  const { noticeList, isFetchOk: announcementIsFetchOk, runApiMemberNoticeList } = useLoadDialogSiteAnnouncement()
  const { isFetchOk: activityIsFetchOk, turntableData, loggedOpenActivityThrottle } = useLoadDialogActivity()
  const { popData, isFetchOk: firstDepositIsFetchOk, showLoginFirstDeposit, unLoginPopData } = storeToRefs(useLoadFirstDepositDialog())
  console.log('🚀 ~ useLoginReloadDialog ~ showLoginFirstDeposit:', showLoginFirstDeposit.value)

  const dialogNameList = ref<{ name: LoginNameType; isShow: boolean }[]>([])

  const appStore = useAppStore()
  const { isLogin } = storeToRefs(appStore)

  function isShowContent(name: LoginNameType) {
    return dialogNameList.value.findIndex(item => item.name === name) > -1
  }

  function next() {
    if (!isShow.value)
      return

    curIndex.value++
    const _curName = dialogNameList.value[curIndex.value]?.name
    if (_curName)
      curName.value = _curName

    else
      setShowFalse()
  }

  function popupClickHandle() {
    next()
  }

  watch([announcementIsFetchOk, activityIsFetchOk, firstDepositIsFetchOk], ([_announcement, _activity, _firstDeposit]) => {
    if (_announcement && _activity && _firstDeposit && route.name === 'casino-home') {
      console.log('route.name', route.name)
      let isShow = false
      const hide = Local.get(HIDE_FOREVER)?.value
      const hideToday = Local.get(HIDE_TODAY)?.value === today.format(FORMAT1)

      if (!hide && !hideToday)
        isShow = true

      dialogNameList.value = [
        {
          name: 'Activity',
          isShow: turntableData.value !== null,
        },
        {
          name: 'ActivityDeposit', // 首充
          isShow: Boolean(popData.value), // null或undefined 不显示
        },
        {
          name: 'firstRecharge', // 首充
          isShow: showLoginFirstDeposit.value && isShow, // false 不显示
        },
        {
          name: 'Announcement',
          isShow: noticeList.value.length > 0,
        },
      ].filter(item => item.isShow)

      if (dialogNameList.value.length > 0) {
        setShowTrue()
        curName.value = dialogNameList.value[0].name
      }
    }
  }, { immediate: true })

  watch(isLogin, (val) => {
    if (val) {
      setTimeout(() => {
        loggedOpenActivityThrottle()
        runApiMemberNoticeList()
      }, 1000)
    }
  }, { immediate: true })

  watchEffect(() => {
    console.log('globalInitMapglobalInitMap dialogNameList', dialogNameList.value)
  })

  return {
    isShow,
    curName,
    turntableData,
    noticeList,
    firstDepositIsFetchOk,
    popData,
    dialogNameList,
    popupClickHandle,
    isShowContent,
    next,
    setShowFalse,
    setShowTrue,
    unLoginPopData,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useLoginReloadDialog, import.meta.hot))
