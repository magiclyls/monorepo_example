import { ApiMemberChatEnable } from '@tg/apis'
import { useAppStore, useChatStore } from '@tg/stores'
import { EventBusNames } from '@tg/types'
import { appEventBus, forbidChatCallback, getEnv, socketClient } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRequest } from 'vue-request'

const noOfHashFunction = 6 // number of hash functions

function hash(key: string) {
  const hashNumbers = []
  for (let i = 1; i <= noOfHashFunction; i++) {
    hashNumbers.push(
      Math.abs(
        key.split('').reduce((a, b) => ((a << i) - a + b.charCodeAt(0)) | 0, 0),
      ),
    )
  }
  return hashNumbers
}

export function isValueContainInBloom(strArr: Array<string>, searchStr: string) {
  const storage = Array.from({ length: 2 ** 22 - 1 }).fill(0) // Bllom filter bit
  strArr.forEach((str) => {
    const indexes = hash(str)
    indexes.forEach(index => (storage[index] = 1))
  })
  const hashes = hash(searchStr)
  const result = hashes.filter(index => !storage[index])
  return !(result.length > 0)
}

const { VITE_SOCKET_PREFIX } = getEnv()

export function useChatEvent() {
  const forbidTopic = `${VITE_SOCKET_PREFIX}/chat/forbid`
  const { userInfo, isLogin } = storeToRefs(useAppStore())
  const chatStore = useChatStore()
  const { room, hideChat } = storeToRefs(chatStore)

  const roomApiValue = computed(() => room.value?.apiValue)

  const { runAsync: runChatEnabled } = useRequest(ApiMemberChatEnable, {
    manual: true,
    ready: isLogin,
    onSuccess: (res) => {
      chatStore.setEnableChat(!!res)
    },
  })

  function onForbidMsg(msg: string) {
    // try {
    //   const data = JSON.parse(msg)
    //   if (userInfo.value && userInfo.value.uid) {
    //     if (data[userInfo.value.uid] && data[userInfo.value.uid].length) {
    //       if (data[userInfo.value.uid].includes(roomApiValue.value)) {
    //         chatStore.setEnableChat(false)
    //         return
    //       }
    //     }
    //     chatStore.setEnableChat(true)
    //   }
    // }
    // catch {}
    runChatEnabled({ room: roomApiValue.value })
  }

  function onMqttConnectSuc() {
    socketClient.removeSubscribe(forbidTopic)
    setTimeout(() => {
      addForbidTopic()
    }, 0)
  }

  function addForbidTopic() {
    socketClient.addSubscribe(forbidTopic, { callback: forbidChatCallback })
  }

  onMounted(() => {
    appEventBus.on(EventBusNames.CHAT_FORBID_MESSAGE_BUS, onForbidMsg)
    appEventBus.on(EventBusNames.MQTT_CONNECT_SUCCESS_BUS, onMqttConnectSuc)
    setTimeout(() => {
      addForbidTopic()
    }, 0)
  })

  onBeforeUnmount(() => {
    appEventBus.off(EventBusNames.CHAT_FORBID_MESSAGE_BUS, onForbidMsg)
    appEventBus.off(EventBusNames.MQTT_CONNECT_SUCCESS_BUS, onMqttConnectSuc)
    socketClient.removeSubscribe(forbidTopic)
  })

  // watchEffect(async () => {
  //   console.log('roomApiValue 这里一直循环执行，不知道为什么？', roomApiValue)
  //   if (roomApiValue.value)
  //     runChatEnabled({ room: roomApiValue.value })
  // })

  watch(roomApiValue, (val) => {
    if (val)
      runChatEnabled({ room: val })
  }, { immediate: true })

  watch(hideChat, (val) => {
    if (val) {
      socketClient.removeSubscribe(forbidTopic)
    }
    else {
      setTimeout(() => {
        addForbidTopic()
      }, 0)
    }
  })

  return {
  }
}
