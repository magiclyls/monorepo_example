<script setup lang="ts">
import type { StatisticsType } from '~/utils/statistics'

import { ApiMemberPixelFirstDepositExists, ApiMemberPixelFirstDepositMark } from '@tg/apis'

defineOptions({
  name: 'AppGlobalStatistics',
})
const status = reactive<Record<StatisticsType, boolean | 'xxxxx'>>({
  facebook: 'xxxxx',
  google: 'xxxxx',
  tiktok: 'xxxxx',
  kwai: 'xxxxx',
})

const appStore = useAppStore()
const { isLogin, userInfo } = storeToRefs(appStore)

const { run: runMemberPixelFirstDepositMark } = useRequest(ApiMemberPixelFirstDepositMark)

const { runAsync: runAsyncMemberPixelFirstDepositExists } = useRequest(ApiMemberPixelFirstDepositExists, { manual: true })

// 1分钟执行一次 handleStatisticsBus
useIntervalFn(() => {
  appStore.updateUserInfo()
}, 1 * 60 * 1000)

async function handleStatisticsBus(emitData: Record<StatisticsType, string>) {
  console.error('emitData', emitData)

  let isSend = false

  if (isLogin.value) {
    const _list = Object.keys(emitData) as StatisticsType[]

    for (let i = 0; i < _list.length; i++) {
      const _key = _list[i]
      const _value = emitData[_key]
      if (_value) {
        const res = await runAsyncMemberPixelFirstDepositExists({
          pixel_id: _value,
        })

        // 设置状态
        status[_key] = res

        console.table({
          '发送条件': '没有发送给三方 && 是首存用户 && 没有发送过',
          [`PIXI_ID_${_key}`]: _value,
          '是否发送过事件给三方(false为没发送)': res,
          '是否首存过（1是首存）': userInfo.value?.mext.is_first_deposit,
          '是否发送过': isSend,
        })

        if (res === false && userInfo.value?.mext.is_first_deposit === 1) {
          if (!isSend) {
            console.error('发送首存事件', _value)
            Statistics.sendStatisticsCustomEvent(CustomStatisticsEvent.FIRST_CHARGE)
            // Statistics.sendStatisticsCustomEvent(CustomStatisticsEvent.PAY_COMPLETE)
            isSend = true
          }

          runMemberPixelFirstDepositMark({
            pixel_id: _value,
          })
        }
      }
    }
  }
}

onMounted(() => {
  appEventBus.on(EventBusNames.STATISTICS_BUS, handleStatisticsBus)
})

onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.STATISTICS_BUS, handleStatisticsBus)
})
</script>

<template>
  <div
    id="app-global-statistics"
    class="hidden"
    :data-google-first-deposit-exists="status.google"
    :data-facebook-first-deposit-exists="status.facebook"
    :data-tiktok-first-deposit-exists="status.tiktok"
    :data-kwai-first-deposit-exists="status.kwai"
    :data-is-first-deposit="userInfo?.mext.is_first_deposit"
  />
</template>
