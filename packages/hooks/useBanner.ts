import type { BannerItem } from '@tg/types'
import { ApiMemberBannerListV4 } from '@tg/apis'
import { useAppStore } from '@tg/stores'
import { application } from '@tg/utils'
import { storeToRefs } from 'pinia'

import { computed } from 'vue'
import { useRequest } from 'vue-request'

export function useBanner() {
  const { isLogin } = storeToRefs(useAppStore())

  const { runAsync: runMemberBannerV4List, data } = useRequest(ApiMemberBannerListV4)

  const bannerList = computed(() => {
    if (data.value === undefined || data.value.length === 0)
      return []

    return data.value.map<BannerItem>((item) => {
      const loopConfig = item.loop_config
      const temp: BannerItem = {
        promo_info: item.promo_info,
        imgUrl: loopConfig.jump_url,
        type: loopConfig.jump_type,
        jumpState: loopConfig.jump_state,
        backgroundUrl: item.background,
        rightImageUrl: item.icon,
        content: item.content,
        align: item.style === 1 ? 'left' : 'right',
        banner_style: item.style,
        title: '',
        superscript: item.superscript,
        banner_style3_background: loopConfig.img_url,
        button: item.button_state === 1
          ? {
              text: item.button_content,
              url: item.button_jump_url,
              type: item.button_jump_type,
            }
          : undefined,
      }
      if (item.style === 3 && loopConfig && [1, 2].includes(item.style_custom_mode))
        return { ...temp, imgUrl: loopConfig.jump_url, type: loopConfig.jump_type, jumpState: loopConfig.jump_state }

      return temp
    }).filter(a => a.banner_style === 3 ? !!a.banner_style3_background : true).filter((item) => {
      if (item.promo_info.display_mode === 1 && !isLogin)
        return false
      return true
    })
  })

  function fetchDataOrLoadImage(type: 'casino' | 'sports') {
    return new Promise((resolve, reject) => {
      runMemberBannerV4List({
        position: type === 'casino' ? 1 : 2,
      }).then(async () => {
        const urls = bannerList.value.reduce<Promise<any>[]>((acc, item) => {
          if (item.banner_style === 3)
            acc.push(application.loadImage(item.banner_style3_background))

          else
            acc.push(application.loadImage(item.backgroundUrl), application.loadImage(item.rightImageUrl))

          return acc
        }, [])
        await application.allSettled(urls)
        resolve(true)
      }).catch(() => {
        reject(new Error('fetch data error'))
      })
    })
  }

  return {
    bannerList,
    fetchDataOrLoadImage,
  }
}
