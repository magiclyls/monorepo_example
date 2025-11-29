import { ApiMemberNoticeAllList } from '@tg/apis'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useNoticeStore = defineStore('notice', () => {
  const {
    data,
    runAsync: runNoticeAllList,
  } = useRequest(ApiMemberNoticeAllList, {
    manual: false,
  })

  /** 跑马灯 */
  const marqueeData = computed(() => {
    if (data.value && data.value.marquee && data.value.marquee.length) {
      return data.value.marquee.map((item) => {
        return {
          ...item,
          content_lang: item.content[getCurrentLanguageForBackend()],
          title_lang: item.title[getCurrentLanguageForBackend()],
        }
      })
    }

    return []
  })
  /** 公告 */
  const announcementData = computed(() => data.value && data.value.notice && data.value.notice.length ? data.value.notice : [])

  return {
    marqueeData,
    announcementData,
    runNoticeAllList,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useNoticeStore, import.meta.hot))
