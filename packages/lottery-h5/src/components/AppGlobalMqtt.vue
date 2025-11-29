<script lang="ts" setup name="AppGlobalMqtt">
import type { EventBusMap } from '@tg/types'
import { useAppStore } from '@tg/stores'
import { EnumLotteryType, EventBusNames } from '@tg/types'
import { appEventBus, getEnv, socketClient } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { onActivated, onDeactivated, watch } from 'vue'
import { isIFrame } from '../utils/tool'

const { VITE_SOCKET_PREFIX } = getEnv()
const { userInfo } = storeToRefs(useAppStore())

const subscribedTopics = new Set<number>()

/**
 * 100x win-go
 * 200x race
 * 300x k3
 * 400x 5D
 * 500x trx-win-go
 */
const eventMap = new Map([
  [1, EventBusNames.LOTTERY_WIN_GO],
  [2, EventBusNames.LOTTERY_RACE],
  [3, EventBusNames.LOTTERY_K3],
  [4, EventBusNames.LOTTERY_5D],
  [5, EventBusNames.TRX_WIN_GO],
])
const topicMap = new Map<EnumLotteryType, number[]>([
  [EnumLotteryType.WIN_GO, [1001, 1002, 1003, 1004, 1005]],
  [EnumLotteryType.RACE, [2001, 2002, 2003, 2004, 2005]],
  [EnumLotteryType.K3, [3001, 3002, 3003, 3004, 3005]],
  [EnumLotteryType.FIVE_D, [4001, 4002, 4003, 4004, 4005]],
  [EnumLotteryType.TRX_WIN_GO, [5002]],
])

function sendMsg(values: any) {
  const topic = values.topic.slice(-4)
  const type = topic[0]
  const event = eventMap.get(Number(type)) as keyof EventBusMap
  appEventBus.emit(event, values)
}
function sendWinLose(params: any) {
  const values = JSON.parse(params.message.parsed.payload)
  appEventBus.emit(EventBusNames.LOTTERY_SETTLE_DIALOG, values)
}

function subscribeTopics() {
  const urlParams = new URLSearchParams(window.location.search)
  const type = urlParams.get('type')
  const target = topicMap.get(Number(type))
  if (!target)
    return
  target.forEach((item) => {
    socketClient.addSubscribe(`${VITE_SOCKET_PREFIX}/cp/${item}`, { callback: sendMsg })
    subscribedTopics.add(item)
  })
  if (userInfo.value) {
    socketClient.addSubscribe(`${VITE_SOCKET_PREFIX}/cp/settle/${userInfo.value?.uid}`, { callback: sendWinLose })
    subscribedTopics.add(Number(userInfo.value?.uid))
  }
}
function unsubscribeTopics() {
  subscribedTopics.forEach((item) => {
    if (String(item).length > 5)
      socketClient.removeSubscribe(`${VITE_SOCKET_PREFIX}/cp/settle/${item}`)
    else
      socketClient.removeSubscribe(`${VITE_SOCKET_PREFIX}/cp/${item}`)
  })
  subscribedTopics.clear()
}

appEventBus.on(EventBusNames.MQTT_CONNECT_SUCCESS_BUS, () => {
  subscribeTopics()
})

appEventBus.on(EventBusNames.APP_GLOBAL_VISIBILITY, () => {
  subscribeTopics()
})

onDeactivated(() => {
  unsubscribeTopics()
})
onActivated(() => {
  subscribeTopics()
})
watch(userInfo, () => {
  if (!socketClient.client) {
    socketClient.connect('登录连接', userInfo.value?.uid as unknown as string)
    return
  }
  if (!isIFrame())
    return
  if (userInfo.value) {
    socketClient.connect('登录连接', userInfo.value.uid as unknown as string)
  }
  else {
    socketClient.connect('没登录连接')
  }
}, { immediate: true })
</script>

<template>
  <div />
</template>
