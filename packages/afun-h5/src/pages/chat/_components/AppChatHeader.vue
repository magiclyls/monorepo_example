<script lang="ts" setup>
import { BaseButton } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconUniArrowDown, IconUniClose3 } from '@tg/icons'
import { useBrandStore, useChatStore } from '@tg/stores'
import { EventBusNames, type Room } from '@tg/types'
import { addChatCallback, appEventBus, delChatCallback, getEnv, socketClient } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { router } from '~/modules/router'
import { useChatEvent } from '../_hook/useChatEvent'
import { useRightSidebar } from '../_hook/useRightSidebar'

defineOptions({
  name: 'AppChatHeader',
})

const emit = defineEmits(['change', 'toggleChatWin'])

const chatStore = useChatStore()
const { chatRoomList, room, topic, hideChat, topic_del_msg } = storeToRefs(chatStore)
const { langChoosed } = storeToRefs(useBrandStore())
const { closeRightSidebar } = useRightSidebar()
// const {  isMobile } = storeToRefs(useWindowStore())
const isMobile = true

const { bool: isUp, setBool: setUBool } = useBoolean(false)
const { VITE_OFFICIAL_NAME } = getEnv()

useChatEvent()

const chatWin = ref()

emit('change', room.value.value)

function chooseRoom(item: Room) {
  socketClient.removeSubscribe(topic.value)

  chatStore.setRoom(item)
  emit('change', item.value)

  setTimeout(() => {
    addChatTopic()
  }, 0)
}

function close() {
  // closeRightSidebar()
  router.go(-1)
}

function openChat() {
  chatWin.value = window.open(`/${getLang()}/chat?room=${room.value.value}`, '_blank', 'popup,width=370,height=720')
  chatStore.toggleChat()
}

function onMqttConnectSuc() {
  socketClient.removeSubscribe(topic.value)
  socketClient.removeSubscribe(topic_del_msg.value)
  setTimeout(() => {
    addChatTopic()
    delChatTopic()
  }, 0)
}

function roomLabel(hide: () => void, item: any) {
  hide()
  chooseRoom(item)
}

function popShow() {
  setUBool(true)
}

function popHide() {
  setUBool(false)
}

function addChatTopic() {
  socketClient.addSubscribe(topic.value, { callback: addChatCallback })
}

function delChatTopic() {
  socketClient.addSubscribe(topic_del_msg.value, { callback: delChatCallback })
}

watch(hideChat, (val) => {
  if (val) {
    socketClient.removeSubscribe(topic.value)
    socketClient.removeSubscribe(topic_del_msg.value)
  }
  else {
    chatWin.value.close()
    setTimeout(() => {
      addChatTopic()
      delChatTopic()
    }, 0)
  }
})

onMounted(() => {
  appEventBus.on(EventBusNames.MQTT_CONNECT_SUCCESS_BUS, onMqttConnectSuc)
  setTimeout(() => {
    addChatTopic()
    delChatTopic()
  }, 0)
})

onUnmounted(() => {
  socketClient.removeSubscribe(topic.value)
  socketClient.removeSubscribe(topic_del_msg.value)
  appEventBus.off(EventBusNames.MQTT_CONNECT_SUCCESS_BUS, onMqttConnectSuc)
})
</script>

<template>
  <section class="app-chat-header" @touchstart.stop @touchmove.stop.prevent>
    <div v-if="langChoosed">
      <div class="chat-room-choose">
        <component :is="room.icon" />
        <span>{{ VITE_OFFICIAL_NAME }}:{{ room.label }} </span>
      </div>
    </div>
    <div v-else>
      <VDropdown :distance="10" popper-class="chat-room-choose-dropdown" @show="popShow" @hide="popHide">
        <div class="chat-room-choose choose-label">
          <component :is="room.icon" />
          <span>{{ VITE_OFFICIAL_NAME }}:{{ room.label }} </span>
          <IconUniArrowDown class="arrow-down" :class="{ 'is-up': isUp }" />
        </div>
        <template #popper="{ hide }">
          <div class="scroll-y chat-room-list dropdown-scroll-content" @touchmove.stop.prevent>
            <a
              v-for="item in chatRoomList" :key="item.icon" class="item dropdown-option"
              :class="{ active: room.value === item.value }" @click="() => roomLabel(hide, item)"
            >
              <component :is="item.icon" />
              <span :class="{ 'font-[proxima-nova]': item.value === 'vi-VN' }">{{ item.label }}</span>
            </a>
          </div>
        </template>
      </VDropdown>
    </div>
    <!-- v-if="$route.path !== '/chat'" -->
    <div class="right-header">
      <!-- <VTooltip v-if="!hideChat" placement="bottom">
        <div class="item">
          <BaseButton type="none" @click="openChat">
            <IconUniJumpPage />
          </BaseButton>
        </div>
        <template #popper>
          <div class="tiny-menu-item-title">
            {{ $t('chat_new_window') }}
          </div>
        </template>
      </VTooltip> -->
      <div v-if="isMobile" class="item">
        <BaseButton type="none" @click="close">
          <IconUniClose3 />
        </BaseButton>
      </div>
      <!-- <VTooltip v-else placement="bottom" :triggers="['hover']">
        <div class="item">
          <BaseButton type="none" @click="close">
            <IconUniClose />
          </BaseButton>
        </div>
        <template #popper>
          <div class="tiny-menu-item-title">
            {{ $t('chat_close_side') }}
          </div>
        </template>
      </VTooltip> -->
    </div>
  </section>
</template>

<style>
  .chat-room-choose-dropdown .v-popper__wrapper .v-popper__inner {
  width: 120px;
  padding: 4px 0px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  border-radius: 4px;
  border: 1px solid #ebebeb;
  background: #fff;

  color: #2f4553;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 22px;

  .dropdown-option {
    height: 38px;
  }
  .active {
    background: #f23038;
    color: #fff;
  }
}

.chat-room-choose-dropdown .v-popper__arrow-container {
  display: none;
}
</style>

<style lang="scss" scoped>
  .chat-room-list {
  .dropdown-option {
    color: var(--tg-popper-color-default);
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding: 12px 12px;
    // gap: 8px;
    cursor: pointer;

    &:hover {
      // background-color: #b1bad3;
      color: var(--tg-popper-hover-color-default);
    }

    &.active {
      color: var(--tg-popper-hover-color-default);
      color: #f09400;
    }

    span {
      margin-left: 8px;
    }
  }
}

.app-chat-header {
  width: 100%;
  display: flex;
  align-items: center;

  height: 42px;
  padding: 0px 10px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
  background: #fff;

  .chat-room-choose {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    color: var(--tg, #0d2245);
    text-align: center;

    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px;

    // gap: 8px;
    > span {
      margin-left: 8px;
      margin-right: 8px;
    }

    .arrow-down {
      transition: none;

      &.is-up {
        color: white;
        transform: rotate(180deg);
      }

      &::hover {
        color: white;
      }
    }

    &:active {
      transform: scale(0.96);
    }

    &:hover {
      .arrow-down {
        color: white;
      }
    }
  }

  .right-header {
    display: flex;
    align-items: center;

    .item {
      display: inline-flex;
      padding: 1px 4px;
      border-radius: 50%;
      transition: all ease 0.25s;
      background-color: transparent;
      width: 18px;
      height: 18px;

      button {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        border: none;
        cursor: pointer;
      }

      .app-svg-icon {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        color: #0d2245;
      }
    }
  }
}
</style>
