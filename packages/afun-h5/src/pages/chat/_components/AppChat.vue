<script lang="ts" setup>
import type { ChatMessageInfo, EnumLanguageKey } from '@tg/types'
import { ApiChatGetHistory } from '@tg/apis'
import { BaseButton } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconUniArrowGodown, IconUniStop } from '@tg/icons'
import { useChatStore } from '@tg/stores'
import { EnumLanguage, EventBusNames } from '@tg/types'
import { appEventBus } from '@tg/utils'
import { checkTs, timeToCustomizeFormat } from '@tg/vue-i18n'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRequest } from 'vue-request'
import { isValueContainInBloom } from '../_hook/useChatEvent'
import { useScrollPrevent } from '../_hook/useScrollPrevent'
import AppChatFooter from './AppChatFooter.vue'
import AppChatHeader from './AppChatHeader.vue'
import AppChatMsgItem from './AppChatMsgItem.vue'

defineOptions({
  name: 'AppChat',
})
// topic =  站点前缀/chat/zh_CN
// topic =  站点前缀/chat/en_US
// topic =  站点前缀/chat/vi_VN
// topic =  站点前缀/chat/pt_BR
// topic =  站点前缀/chat/hi_IN
// topic =  站点前缀/chat/th_TH

const chatStore = useChatStore()
const { hideChat, deletedMsgs } = storeToRefs(chatStore)

const { bool: showMoreBar, setFalse: setMFalse, setTrue: setMTrue } = useBoolean(false)
const {
  bool: msgHistoryLoading,
  setFalse: setMHLFalse,
  setTrue: setMHLTrue,
} = useBoolean(false)

const { lockScroll } = useScrollPrevent()

const scrollMsg = ref()
const messageHistory = ref<Array<ChatMessageInfo>>([])
const msgCounter = ref(1)
const chatFooterRef = ref()
const pageSize = 25
const page = 1

const filteredMessageHistory = computed(() => {
  const history = messageHistory.value
  const deletedIds = deletedMsgs.value

  if (!history || !history.length)
    return []

  return history
    .filter(item => !item.i || !deletedIds.includes(item.i))
    .slice(-52)
})

const { run: runGetHistory } = useRequest(ApiChatGetHistory, {
  onBefore: () => {
    setMHLTrue()
  },
  onSuccess: (data) => {
    if (data && data.d && data.d.length)
      messageHistory.value = data.d?.reverse().map(m => ({ ...m, id: (m as unknown as { i: string }).i, msg: m.c, user: { name: m.n, uid: m.u } }))
    else
      messageHistory.value = []
  },
  onAfter: () => {
    setTimeout(() => {
      goBottom()
      setMHLFalse()
    }, 800)
  },
})

function roomChange(room: EnumLanguageKey) {
  nextTick(() => {
    scrollMsg.value.scrollTop = 0
    chatFooterRef.value?.textareaFocus()
    chatFooterRef.value?.textareaBlur()
  })
  runGetHistory({ lang: EnumLanguage[room], page, page_size: pageSize })
  setMFalse()
}
function messageWrapScroll() {
  if (msgHistoryLoading.value)
    return
  if (scrollMsg.value) {
    const { height } = scrollMsg.value.getBoundingClientRect()
    if (scrollMsg.value.scrollHeight - scrollMsg.value.scrollTop - height > 200)
      setMTrue()
    else
      setMFalse()
  }
}
function goBottom2() {
  nextTick(() => {
    setTimeout(() => {
      if (scrollMsg.value) {
        const { height } = scrollMsg.value.getBoundingClientRect()
        scrollMsg.value.scrollTop = scrollMsg.value.scrollHeight - height + 500
      }
    }, 30)
  })
}
function goBottom(time?: number) {
  nextTick(() => {
    setTimeout(() => {
      document.querySelector('.msg-tail')?.scrollIntoView({ behavior: 'smooth' })
    }, time !== void 0 ? time : 300)
  })
}
function onReceiveChatMsg(m: any) {
  const hasMsg = m.i && messageHistory.value && messageHistory.value.length
    ? isValueContainInBloom(messageHistory.value.map(v => v.i).filter(f => f !== void 0 && f.length), m.i)
    : false
  if (!hasMsg) {
    if (!messageHistory.value || !messageHistory.value.length)
      messageHistory.value = []

    messageHistory.value.push({ ...m, id: m.i, msg: m.c, user: { name: m.n, uid: m.u } })
    if (showMoreBar.value)
      msgCounter.value += 1
    else
      goBottom2()
  }
}

function onDelMsgItem(delId: any) {
  console.log('onDelMsgItem', delId)
  chatStore.setDelMsgs(delId)
}

watch(showMoreBar, (val) => {
  if (!val)
    msgCounter.value = 1
})

onMounted(() => {
  // document.getElementById('chatDialog')?.showModal()

  setTimeout(() => {
    const allScrollyEl = document.querySelectorAll('.app-chat-outer .scroll-y')
    lockScroll(allScrollyEl)
  }, 300)
  appEventBus.on(EventBusNames.CHAT_MESSAGE_BUS, onReceiveChatMsg)
  appEventBus.on(EventBusNames.CHAT_DEL_MESSAGE_BUS, onDelMsgItem)
})

onUnmounted(() => {
  appEventBus.off(EventBusNames.CHAT_MESSAGE_BUS, onReceiveChatMsg)
  appEventBus.off(EventBusNames.CHAT_DEL_MESSAGE_BUS, onDelMsgItem)
})
</script>

<template>
  <section class="app-chat-outer">
    <div class="header" @touchmove.stop.prevent>
      <AppChatHeader @change="roomChange" />
    </div>
    <div
      v-if="hideChat" class="stack x-center y-center direction-vertical gap-small padding-none"
      style="height: 100%;"
    >
      <div class="popped-chat-wrapper">
        <span>{{ 'chat been hide' }}</span>
        <BaseButton bg-style="primary" size="md" @click="chatStore.toggleChat">
          {{ 'chat show room' }}
        </BaseButton>
      </div>
    </div>
    <template v-else>
      <div class="messages">
        <div ref="scrollMsg" class="scroll-y message-content" @scroll="messageWrapScroll">
          <template v-if="msgHistoryLoading">
            <div v-for="i in 20" :key="i" class="wrap">
              <AppChatMsgItem />
            </div>
          </template>
          <template v-for="msg, mdx in filteredMessageHistory" :key="mdx">
            <div
              v-if="mdx > 0
                && (checkTs(msg.t) - checkTs(filteredMessageHistory[mdx - 1].t)) > 60000" class="wrap time-wrap"
            >
              <span>{{ $t(`week_${dayjs(checkTs(msg.t)).day()}`) }}</span>
              <span>{{ timeToCustomizeFormat(msg.t, 'HH:mm') }}</span>
            </div>
            <div v-if="mdx === 0" class="wrap time-wrap">
              <span>{{ $t(`week_${dayjs(checkTs(msg.t)).day()}`) }}</span>
              <span>{{ timeToCustomizeFormat(msg.t, 'HH:mm') }}</span>
            </div>
            <div v-show="!msgHistoryLoading" class="wrap">
              <AppChatMsgItem :msg-info="msg" :go-bottom2="goBottom2" />
            </div>
          </template>
          <div class="wrap msg-tail" />
        </div>
        <Transition name="fade">
          <div v-if="showMoreBar && !msgHistoryLoading" class="more-wrap text-[14px]">
            <BaseButton shadow size="lg" class="p-[16px] button-more" @click.stop="goBottom(0)">
              <div class="icon-text stop text-[14px]">
                <IconUniStop />
                <span class="leading-tight text-[14px]">{{ $t('聊天室因滚动而暂停') }}</span>
              </div>
              <div class="icon-text go-down text-[14px]">
                <IconUniArrowGodown />
                <span class="text-[14px]">{{ msgCounter }}+ {{ $t('条新消息') }}</span>
              </div>
            </BaseButton>
          </div>
        </Transition>
      </div>
      <div class="footer" @touchstart.stop @touchmove.stop>
        <AppChatFooter ref="chatFooterRef" />
      </div>
    </template>
  </section>
</template>

<style lang="scss" scoped>
// @starting-style {
// }
dialog {
  margin: 0;
  padding: 0;
  background: transparent;
  border: 0;
  max-width: 100%;
  max-height: calc(100% - 68px);
}

// /*   Open state of the dialog  */
// dialog[open] {
//   // opacity: 1;
//   // transform: scaleY(1);
//   z-index: 0;
// }

// /*   Closed state of the dialog   */
// dialog {
//   opacity: 0;
//   transform: scaleY(0);
//   transition:
//     opacity 0.7s ease-out,
//     transform 0.7s ease-out,
//     overlay 0.7s ease-out allow-discrete,
//     display 0.7s ease-out allow-discrete;
//   /* Equivalent to
//   transition: all 0.7s allow-discrete; */
// }

// /*   Before-open state  */
// /* Needs to be after the previous dialog[open] rule to take effect,
//     as the specificity is the same */
// @starting-style {
//   dialog[open] {
//     opacity: 0;
//     transform: scaleY(0);
//   }
// }

// /* Transition the :backdrop when the dialog modal is promoted to the top layer */
// dialog::backdrop {
//   background-color: transparent;
//   transition:
//     display 0.7s allow-discrete,
//     overlay 0.7s allow-discrete,
//     background-color 0.7s;
//   /* Equivalent to
//   transition: all 0.7s allow-discrete; */
// }

// dialog[open]::backdrop {
//   background-color: transparent;
// }

// /* This starting-style rule cannot be nested inside the above selector
// because the nesting selector cannot represent pseudo-elements. */

// @starting-style {
//   dialog[open]::backdrop {
//     background-color: transparent;
//   }
// }

.popped-chat-wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  color: #b1bad3;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.app-chat-outer {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f6f7f8;

  .header {
    position: relative;
    width: 100%;
    height: 42px;
    z-index: 10;
    /* box-shadow: var(--tg-box-shadow-lg); */
    background: #ffffff;
  }

  .messages {
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    flex-grow: 1;
    background: #f6f7f8;

    .message-content {
      position: relative;
      overflow-x: hidden;
      min-height: 0;
      transform: translateZ(0);
      overflow-y: scroll;
      word-break: break-word;
      padding: 8px 10px 8px 16px;
      display: flex;
      flex-direction: column;
      overflow-anchor: none;
      overscroll-behavior: contain;
      /* background-color: #ffffff; */

      .msg-tail {
        position: relative;
        margin: 0;
        padding: 0;
        height: 0;
      }

      > * + * {
        margin-top: 8px;
      }

      .wrap {
        width: 100%;
      }

      .time-wrap {
        display: flex;
        justify-content: space-between;

        color: var(--tg, #6d7693);

        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
    }

    .more-wrap {
      left: 50%;
      position: absolute;
      bottom: 24px;
      transform: translate(-50%);
      line-height: 1.5;
      font-size: 14px;
      color: #b1bad3;
      /* color: var(--tg, #6D7693); */
      min-width: 220px;
      --tg-base-button-style-bg: #f2ca5c;
      --tg-base-button-color: #111111;
      color: #111111;

      .button-more {
        display: block;
        width: auto;
        height: 53px;
        padding: 18px 32px;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        border-radius: 4px;
        opacity: 0.7;
        background: #000;

        /* 下拉投影 */
        box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.15);
        color: #fff;

        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 22px;
      }

      .icon-text {
        display: flex;
        white-space: nowrap;
        // gap: 8px;
        /* padding: 2px 8px; */
        align-items: center;

        > span {
          margin-left: 8px;
        }

        &.stop {
          visibility: visible;
          opacity: 1;
          white-space: wrap;

          span {
            display: inline-block;
            white-space: nowrap;
          }
        }

        &.go-down {
          visibility: hidden;
          opacity: 0;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
        }
      }

      &:hover {
        .icon-text.stop {
          visibility: hidden;
          opacity: 0;
        }

        .icon-text.go-down {
          visibility: visible;
          opacity: 1;
        }
      }
    }
  }

  .footer {
    background: #ebebeb;
  }
}
</style>
