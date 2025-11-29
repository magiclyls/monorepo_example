import type { KeepAliveProps, PropType, VNode } from 'vue'
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'
import { setupHistoryDirection } from '@tg/utils'
import { defineComponent, h, KeepAlive, ref, watchEffect } from 'vue'

const keepAliveMap: Record<string, string> = {
  keepALiveDirection: 'enter',
}

export function getMeepALiveDirection() {
  return keepAliveMap.keepALiveDirection
}

setupHistoryDirection((v) => {
  keepAliveMap.keepALiveDirection = v
})

export const kaProps = {
  route: {} as PropType<RouteLocationNormalizedLoadedGeneric>,
  is: {} as PropType<VNode>,
  include: [String, RegExp, Array] as unknown as PropType<KeepAliveProps['include']>,
  exclude: [String, RegExp, Array] as unknown as PropType<KeepAliveProps['exclude']>,
  max: [String, Number] as unknown as PropType<KeepAliveProps['max']>,
}

export default defineComponent({
  name: 'BaseKeepAlive',
  props: kaProps,
  setup(props, { emit, slots, attrs }) {
    const kepList = ref<string[]>([])

    watchEffect(() => {
      const comName = props.is && (props.is.type as any).name
      const arr = [...new Set([...kepList.value, comName])].filter(item => item)

      if (keepAliveMap.keepALiveDirection === 'back') {
        if (arr[arr.length - 1] !== comName) {
          arr.pop()
        }
      }

      kepList.value = arr
    })

    return () => {
      // if (props.is) {
      //   console.log('compoent route', props.route)
      //   console.log('compoent name', props.is.type.name = 'Abc')
      // }

      console.log('props.is', kepList.value)

      return h(KeepAlive, {
        include: [
          'KeepAliveCasinoHome',
          'KeepAliveAppPromotionWarp',
          'KeepAliveAffiliate',
          ...kepList.value,
        ],
        exclude: [
          'AppSportsHomePage',
          'AppUser',
          'AppSportsFixturePage',
        ],
      }, {
        default: () => props.is
          ? h(props.is)
          : null,
      })
    }
  },
})
