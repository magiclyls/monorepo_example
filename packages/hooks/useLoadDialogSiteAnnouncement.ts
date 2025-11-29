import { ApiMemberNoticeAllList, ApiMemberNoticeLimitCount } from '@tg/apis'
import { useAppStore } from '@tg/stores'
import { application } from '@tg/utils'
import { getLangForBackend } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRequest } from 'vue-request'
import { useDialogSiteAnnouncementList } from './useDialogSiteAnnouncementList'

export function useLoadDialogSiteAnnouncement() {
  const { isLogin } = storeToRefs(useAppStore())
  const isFetchOk = ref(false)
  // 弹窗公告相关
  const {
    clearYesterdayNoticeCache,
    checkIsNoMore,
    hideNoMoreTipIds,
    noticeList,
  } = useDialogSiteAnnouncementList()
  // 未登录状态的公告弹框和跑马灯
  const { runAsync: runMemberNoticeAllList } = useRequest(ApiMemberNoticeAllList, {
    onBefore() {
      clearYesterdayNoticeCache()
    },
    onSuccess(data) {
      isFetchOk.value = true
      if (data.notice && data.notice.length > 0 && !isLogin.value) {
        // 过滤已经勾选不再显示的公告
        const arr = data.notice.filter(a => !checkIsNoMore(a.id))
        console.log('🚀 ~ onSuccess ~ arr:', arr)
        // 保存所有隐藏‘今日不再提示’的id
        hideNoMoreTipIds.value = arr.map((a) => {
          if ((a.bounce_frequency === 2 && a.bounce_frequency_limit < 3) || a.is_limit === 2)
            return a.id
          return ''
        }).filter(b => !!b)

        if (arr.length > 0) {
          noticeList.value = arr

          setTimeout(() => {
            arr.forEach((item) => {
              try {
                const url = item?.image_url[getLangForBackend()!]
                if (url) {
                  const img = new Image()
                  img.src = application.getImgUrl(url)
                }
              }
              catch (error) {
                console.log('error', error)
              }
            })
          }, 30)
          // const { openDialogSiteAnnouncement } = useDialogSiteAnnouncement()
          // openDialogSiteAnnouncement(noticeList.value)
        }
      }
    },
  })

  // 登录后的公告接口
  const { runAsync: runApiMemberNoticeList } = useRequest(ApiMemberNoticeAllList, {
    // ready: isLogin,
    // manual: false,
    onSuccess(res) {
      if (res.notice && res.notice.length > 0) {
        // 过滤已经勾选不再显示的公告
        const arr = res.notice.filter(a => !checkIsNoMore(a.id))

        // 获取登录前勾选了今日不再显示的公告id
        const noMoreTodayIds = res.notice.filter(a => checkIsNoMore(a.id)).map(b => b.id)
        // 发送给后端标记为今日不再提示
        if (noMoreTodayIds.length > 0) {
          ApiMemberNoticeLimitCount({
            types: 2,
            is_check: 1,
            ids: noMoreTodayIds,
          })
        }

        // 保存所有隐藏‘今日不再提示’的id
        hideNoMoreTipIds.value = arr.map((a) => {
          if ((a.bounce_frequency === 2 && a.bounce_frequency_limit < 3) || a.is_limit === 2)
            return a.id
          return ''
        }).filter(b => !!b)

        if (arr.length > 0) {
          noticeList.value = arr
          isFetchOk.value = true

          setTimeout(() => {
            arr.forEach((item: any) => {
              try {
                const url = item?.image_url[getLangForBackend()]
                if (url) {
                  const img = new Image()
                  img.src = application.getImgUrl(url)
                }
              }
              catch (error) {
                console.log('error', error)
              }
            })
          }, 30)
          // const { openDialogSiteAnnouncement } = useDialogSiteAnnouncement()
          // openDialogSiteAnnouncement(noticeList.value)
          // 记录弹窗频率
          ApiMemberNoticeLimitCount({ types: 1, is_check: 1, ids: noticeList.value.filter(b => b.bounce_frequency === 2).map(a => a.id) })
        }
        else {
          isFetchOk.value = true
          noticeList.value = []
        }
      }
      else {
        noticeList.value = []
        isFetchOk.value = true
      }
    },
  })

  onMounted(() => {
    if (!isLogin.value)
      runMemberNoticeAllList()

    else
      runApiMemberNoticeList()
  })

  return {
    noticeList,
    isFetchOk,
    runApiMemberNoticeList,
  }
}
