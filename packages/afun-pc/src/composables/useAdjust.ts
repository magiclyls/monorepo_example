import Adjust from '@adjustcom/adjust-web-sdk'
import { SendFlutterThirdPartyAppMessage } from '@tg/types'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface QueryParams {
  [key: string]: string
}
export function useAdjust() {
  const router = useRouter()
  const route = useRoute()
  const { adjustEventToken } = storeToRefs(useAppStore())
  onMounted(async () => {
    await router.isReady()
    const { adjustapptoken, eventtoken } = route.query
    const obj: QueryParams = {}
    if (eventtoken && typeof eventtoken === 'string') {
      eventtoken.split(';').forEach((pair) => {
        const [key, value] = pair.split('=')
        if (key && value) {
          obj[key] = value
        }
      })
    }
    adjustEventToken.value = obj
    if (adjustapptoken) {
      Adjust.initSdk({
        appToken: adjustapptoken as string,
        environment: import.meta.env.PROD ? 'production' : 'sandbox',
      })
    }
  })
}

export function sendMsgToAdjust(type: SendFlutterThirdPartyAppMessage) {
  const { adjustEventToken } = storeToRefs(useAppStore())
  let deduplicationId
  if (type === SendFlutterThirdPartyAppMessage.FIRSTRECHARGE || type === SendFlutterThirdPartyAppMessage.RECHARGE) {
    deduplicationId = (+new Date()).toString()
  }
  if (adjustEventToken.value[type]) {
    Adjust.trackEvent({
      eventToken: adjustEventToken.value[type],
      deduplicationId,
    })
  }
}
