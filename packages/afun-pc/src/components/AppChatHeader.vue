<script lang="ts" setup>
import {
  IconUniClose,
  IconUniJumpPage,
  IconUniArrowDown,
  } from '@tg/icons'
import type { Room } from '~/types'

defineOptions({
  name: 'AppChatHeader',
})
const emit = defineEmits(['change', 'toggleChatWin'])

const chatStore = useChatStore()
const { chatRoomList, room, topic, hideChat, topic_del_msg } = storeToRefs(chatStore)
const { langChoosed } = storeToRefs(useBrandStore())
const { closeRightSidebar } = useRightSidebar()
const { isGreaterThanMd, isMobile } = storeToRefs(useWindowStore())
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
  closeRightSidebar()
}

function openChat() {
  chatWin.value = window.open(`/${getCurrentUrlLanguage()}/chat?room=${room.value.value}`, '_blank', 'popup,width=370,height=720')
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
        <BaseImage :url="`/png/icon/${room.icon}.png`" class="mr-[8px] w-[14px]" />
        <span>{{ VITE_OFFICIAL_NAME }}: {{ room.label }} </span>
      </div>
    </div>
    <div v-else>
      <VDropdown
        :distance="10"
        @show="popShow"
        @hide="popHide"
      >
        <div class="chat-room-choose choose-label">
          <BaseImage :url="`/png/icon/${room.icon}.png`" class="mr-[8px] w-[14px]" />
          <span>{{ VITE_OFFICIAL_NAME }}: {{ room.label }} </span>
          <IconUniArrowDown class="arrow-down" :class="{ 'is-up': isUp }" />
        </div>
        <template #popper="{ hide }">
          <div class="scroll-y chat-room-list dropdown-scroll-content" @touchmove.stop.prevent>
            <a
              v-for="item in chatRoomList"
              :key="item.icon"
              class="item dropdown-option"
              :class="{ active: room.value === item.value }"
              @click="() => roomLabel(hide, item)"
            >
              <component :is="item.icon" />
              <span :class="{ 'font-[proxima-nova]': item.value === 'vi-VN' }">{{ item.label }}</span>
            </a>
          </div>
        </template>
      </VDropdown>
    </div>
    <div v-if="$route.path !== '/chat'" class="right-header">
      <VTooltip v-if="!hideChat && isGreaterThanMd" placement="bottom">
        <div class="item">
          <BaseButton type="text" @click="openChat">
            <IconUniJumpPage />
          </BaseButton>
        </div>
        <template #popper>
          <div class="tiny-menu-item-title">
            {{ $t('chat_new_window') }}
          </div>
        </template>
      </VTooltip>
      <div v-if="isMobile" class="item">
        <BaseButton type="text" @click="close">
          <IconUniClose />
        </BaseButton>
      </div>
      <VTooltip v-else placement="bottom" :triggers="['hover']">
        <div class="item">
          <BaseButton type="text" @click="close">
            <IconUniClose />
          </BaseButton>
        </div>
        <template #popper>
          <div class="tiny-menu-item-title">
            {{ $t('chat_close_side') }}
          </div>
        </template>
      </VTooltip>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.chat-room-list {
  @include webTheme('green') {
    background:#02432D;
  }
  .dropdown-option {
    color: var(--tg-popper-color-default);
    font-size: var(--tg-font-size-default);
    font-weight: var(--tg-font-weight-semibold);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding:
    var(--tg-spacing-button-padding-vertical-xs)
    var(--tg-spacing-button-padding-horizontal-xs);
    // gap: var(--tg-spacing-8);
    cursor: pointer;
    &:hover {
      // background-color: var(--tg-text-lightgrey);
      color: var(--tg-popper-hover-color-default);
      @include webTheme('greenblack') {
        color: var(--tg-text-greenblack-main);
      }
      @include webTheme('green') {
        color: var(--tg-text-greenblack-main);
      }
    }
    &.active {
      color: var(--tg-popper-hover-color-default);
      @include webTheme('greenblack') {
        color: var(--tg-text-greenblack-main);
      }
      @include webTheme('white') {
        color: #F09400;
      }
    }
    span {
      margin-left: var(--tg-spacing-8);
    }
  }
}
.app-chat-header {
  width: 100%;
  height: var(--tg-header-height);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: var(--tg-scrollbar-size);
  padding-left: var(--tg-spacing-16);
  color: var(--tg-text-white);
  @include webTheme('green') {
    background-color: #02432D;
  }

  .chat-room-choose {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: var(--tg-font-size-default);
    font-weight: var(--tg-font-weight-semibold);
    // gap: var(--tg-spacing-8);
    > span {
      margin-left: var(--tg-spacing-8);
      margin-right: var(--tg-spacing-8);
    }
    .arrow-down {
      transition: none;
      &.is-up {
        color: white;
        transform: rotate(180deg);
      }
      &::hover {
        color: white;
        --tg-icon-color: white;
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
  .choose-label {
    @include webTheme('green') {
      color: white;
    }
  }
  .right-header {
    display: flex;
    align-items: center;
    .item {
      display: inline-flex;
      padding: var(--tg-spacing-1) var(--tg-spacing-4);
      border-radius: 50%;
      transition: all ease .25s;
      background-color: transparent;
      &:hover {
        background-color: var(--tg-secondary-deepdark);
        --tg-icon-color: var(--tg-text-white);
      }
    }
  }
}
</style>
