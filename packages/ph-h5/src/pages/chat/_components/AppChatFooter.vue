<script lang="ts" setup>
import { ApiChatSendMessage } from '@tg/apis'
import { BaseButton, PhBaseChatInput, PhBaseImage } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconChatAtuser, IconChatBet, IconChatIgnore, IconChatRain, IconChatRule, IconChatTip, IconChatUnignore, IconUniClose3 } from '@tg/icons'
import { allEmojis, allSmileFace, useAppStore, useChatStore } from '@tg/stores'
import { EventBusNames } from '@tg/types'
import { appEventBus, application } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { onClickOutside } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'

import { useChatRulesDialog } from '../_hook/useDialogChatRules'

//  @ 用户
//  : 表情
//  / 指令
//  enter 消息加空格->发送
//  enter 加空格再次 enter 发送
defineOptions({
  name: 'AppChatFooter',
})
// type CommandType = '/bet' | '/user' | '/tip' | '/rain' | '/ignore' | '/unignore'
const { t } = useI18n()
const chatStore = useChatStore()
const { roomLang, enableChat } = storeToRefs(chatStore)
const { userInfo, isLogin } = storeToRefs(useAppStore())
// const { isMobile } = storeToRefs(useWindowStore())
const isMobile = true
const { openChatRulesDialog } = useChatRulesDialog()
// const { openStatisticsDialog } = useStatisticsDialog()
const openStatisticsDialog = openChatRulesDialog
// const chatMessageBus = useEventBus(CHAT_MESSAGE_BUS)
function openLoginDialog() { }
// const { openLoginDialog } = useLoginDialog()
const { bool: showEmoji, toggle: toggleEmoji, setBool: setEBool } = useBoolean(false)

const manCount = ref(application.numberToLocaleString(
  Math.floor(Math.random() * 100) + 1800,
  getLang(),
))
const emojiWrap = ref()
const maxMsgLen = 160
const msgInput = ref()
const message = ref('')
const atUsers = reactive([
  { name: 'abc32434', id: '39429304' },
  { name: 'adflkl32434', id: '234324335' },
  { name: 'iofugsdfs32434', id: '3450503495' },
  { name: 'eoiqfd00809', id: '98734957342' },
  { name: 'flasuoi0320423', id: '932479238' },
])
const allCommandList = reactive([
  {
    icon: IconChatBet,
    command: '/bet',
    param: '[bet id]',
    text: t('查看赌注'),
  },
  {
    icon: IconChatAtuser,
    command: '/user',
    param: '@user',
    text: t('查看玩家'),
  },
  { icon: IconChatTip, command: '/tip', param: '@user', text: t('给用户发送小费') },
  { icon: IconChatRain, command: '/rain', param: '', text: t('下红包雨') },
  {
    icon: IconChatIgnore,
    command: '/ignore',
    param: '@user',
    text: t('拉入黑名单'),
  },
  {
    icon: IconChatUnignore,
    command: '/unignore',
    param: '@user',
    text: t('移出黑名单'),
  },
])
const focusouttime = ref()
const sendtime = ref()

const commandList = computed(() => {
  const i = message.value.lastIndexOf('/')
  if (i === 0)
    return allCommandList.filter(a => a.command.indexOf(message.value) === 0)

  return []
})
const matched_at_users = computed(() => {
  const j = message.value.lastIndexOf('@')
  const k = message.value.lastIndexOf(' ')
  if (k > j || j === -1) {
    return []
  }
  else {
    const temp = message.value.slice(j + 1)
    const filtered = atUsers.filter(a => a.name.includes(temp))
    if (filtered.length)
      return filtered

    else
      return [{ name: temp, id: '00' }]
  }
})
// const emojiName = computed(() => {
//   const i = message.value.lastIndexOf(':')
//   const j = message.value.lastIndexOf('@')
//   const k = message.value.lastIndexOf(' ')
//   if (k > i || j > i)
//     return undefined

//   if (i !== -1)
//     return message.value.slice(i + 1)
//   return undefined
// })

const emojis = computed(() => {
  return allEmojis
  // if (emojiName.value === void 0) {
  //   return showEmoji.value ? allEmojis : []
  // }
  // else {
  //   return allEmojis.filter((e) => {
  //     return e.split('.')[0].includes(emojiName.value ?? '')
  //   })
  // }
})
const trimMessage = computed(() => message.value.trim())
const isCommand = computed(() => message.value[0] === '/')

const { runAsync: runSendMsg, loading: sendLoading } = useRequest(ApiChatSendMessage)
// isFace 笑脸😊 不是图片
function addEmoMsg(emo: string, isFace?: boolean) {
  if (isFace) {
    message.value += emo
    // showEmoji.value = false
    // msgInput.value?.getFocus()
    return
  }
  const i = message.value.lastIndexOf(':%')
  const j = message.value.lastIndexOf(':')
  if (j === message.value.length - 1)
    message.value = message.value.slice(0, j)

  if (i === -1)
    message.value += `%:${emo.split('.')[0]}:% `

  else
    message.value += `%:${emo.split('.')[0]}:% `

  // msgInput.value?.getFocus()
  // showEmoji.value = false
}
function addAtUser(u: { name: string }) {
  const i = message.value.lastIndexOf('@')
  message.value = `${message.value.slice(0, i + 1) + u.name} `
  msgInput.value?.getFocus()
}
function addCommand(u: { command: string }) {
  message.value = `${u.command} `
  msgInput.value?.getFocus()
}
function sendMsg() {
  sendtime.value = new Date().getTime()
  const calctime = sendtime.value - focusouttime.value

  setEBool(false)
  if (trimMessage.value.length && !sendLoading.value) {
    if (!isLogin.value) {
      // openNotify({ type: 'error', code: 'chat_not_login', message: t('notify_error_forbid_operation') })
      openLoginDialog()
      message.value = ''
      msgInput.value.setBlur()
      setTimeout(() => {
        // window.scrollTo({ top: -50, behavior: 'smooth' })
        temporaryRepair()
      }, 0)
      return
    }
    const tt = new Date().getTime()
    const i = `${Math.floor(1000000000 + Math.random() * 9000000000)}`
    const msgtemp = trimMessage.value
    runSendMsg({ c: msgtemp, lang: roomLang.value, i, v: userInfo.value?.vip }).then(() => {
      appEventBus.emit(EventBusNames.CHAT_MESSAGE_BUS, { c: msgtemp, u: userInfo.value?.uid, i, n: userInfo.value?.username, t: tt })
    }).catch(() => {
      msgInput.value.setBlur()
      setTimeout(() => {
        // window.scrollTo({ top: -50, behavior: 'smooth' })
        temporaryRepair()
      }, 0)
    })

    message.value = ''
    if (calctime < 200)
      msgInput.value?.getFocus()
  }
}
function enterPress(event: KeyboardEvent) {
  event.preventDefault()
  event.stopPropagation()
  if (trimMessage.value.length) {
    if (isCommand.value) {
      const temp = trimMessage.value.split(' ')
      const firstSpaceIdx = trimMessage.value.indexOf(' ')
      const param = firstSpaceIdx !== -1 ? trimMessage.value.slice(firstSpaceIdx) : ''
      switch (temp[0]) {
        case '/bet':
          break
        case '/user':
          openStatisticsDialog(param.replace('@', ''))
          break
        case '/tip':
          break
        case '/rain':
          break
        case '/ignore':
          break
        case '/unignore':
          break
        default:
          break
      }
      return
    }
    sendMsg()
  }
}
onClickOutside(emojiWrap, () => showEmoji.value = false)

function textareaFocus() {
  msgInput.value?.getFocus()
}
function textareaBlur() {
  msgInput.value?.setBlur()
  setTimeout(() => {
    // window.scrollTo({ top: -50, behavior: 'smooth' })
    temporaryRepair()
  }, 0)
}

function onKeyboardOut() {
  focusouttime.value = new Date().getTime()
}

function temporaryRepair() {
  let currentPosition
  const speed = 1// 页面滚动距离
  const timer: any = setInterval(() => {
    currentPosition = document.documentElement.scrollTop || document.body.scrollTop
    currentPosition -= speed
    window.scrollTo({ top: currentPosition, behavior: 'smooth' }) // 页面向上滚动
    currentPosition += speed // speed变量
    window.scrollTo({ top: currentPosition, behavior: 'smooth' }) // 页面向下滚动
    clearInterval(timer)
  }, 1)
}

onMounted(() => {
  document.addEventListener('focusout', onKeyboardOut)
})

onBeforeUnmount(() => {
  document.removeEventListener('focusout', onKeyboardOut)
})

watch(message, (val) => {
  const j = val.lastIndexOf(':')
  if (j !== -1 && j === val.length - 1)
    showEmoji.value = true
  // else
  // showEmoji.value = false
})

watch(enableChat, (val) => {
  if (!val)
    message.value = ''
})

defineExpose({ textareaFocus, textareaBlur })
</script>

<template>
  <section class="tg-app-chat-footer" @touchstart.stop @touchmove.stop>
    <Transition>
      <div v-show="!sendLoading && showEmoji" ref="emojiWrap" class="emoji-wrap">
        <div class="emoji-header">
          <span>{{ t('表情符号') }}</span>
          <div class="close" @click="setEBool(false)">
            <IconUniClose3 />
          </div>
        </div>
        <div class="scroll-y layout-grid emojis-box wrap">
          <div v-for="emo in emojis" :key="emo" class="button-wrap">
            <span class="box" @click="addEmoMsg(emo)">
              <BaseButton type="none" size="none">
                <div class="emo">
                  <PhBaseImage class="webp" :url="`/ph-h5/webp/emoji/${emo}`" />
                </div>
              </BaseButton>
            </span>
          </div>
          <div v-for="emo, idx in allSmileFace" :key="idx" class="button-wrap">
            <span class="box" @click="addEmoMsg(emo, true)">
              <BaseButton type="none" size="none">
                <div class="emo face-emo">
                  <span>{{ emo }}</span>
                </div>
              </BaseButton>
            </span>
          </div>
        </div>
      </div>
    </Transition>
    <Transition>
      <div v-show="!sendLoading && matched_at_users.length" class="scroll-y wrap at-users-wrap layout-default">
        <div v-for="u in matched_at_users" :key="u.id" class="button-wrap" @click="addAtUser(u)">
          <div class="at-user-name">
            {{ u.name }}
          </div>
        </div>
      </div>
    </Transition>
    <Transition>
      <div v-if="commandList.length" class="scroll-y wrap layout-default command-wrap">
        <div v-for="u in commandList" :key="u.command" class="button-wrap" @click="addCommand(u)">
          <div class="command">
            <div class="label">
              <component :is="u.icon" />
              <span>{{ u.command }}</span>
              <span v-if="u.param" class="param">{{ u.param }}</span>
            </div>
            <div class="desc">
              {{ u.text }}
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <div class="chat-input">
      <PhBaseChatInput
        ref="msgInput" v-model="message" :chat-mode="true" name="message" type="textarea" :rows="1"
        :placeholder="enableChat ? t('输入您的消息') : t('您已被禁言，请联系客服！')" textarea style="--tg-base-input-height: auto;"
        :disabled="!enableChat" :max="maxMsgLen" @down-enter="enterPress"
      >
        <template #right-icon>
          <BaseButton
            size="none" type="none"
            style="overflow: visible;height: 32rem;--tg-base-textarea-maxheight: 164rem;"
            :disabled="maxMsgLen - message.length <= 0 || !enableChat" @click.stop="toggleEmoji()"
          >
            <span class="smile">😀</span>
          </BaseButton>
        </template>
      </PhBaseChatInput>
    </div>
    <div class="online" @touchstart.stop @touchmove.stop.prevent>
      <div class="green-dot" />
      <div>
        <span>{{ t('在线') }}： </span>
        <span>{{ manCount }}</span>
      </div>
    </div>
    <div class="actions" @touchstart.stop @touchmove.stop.prevent>
      <span class="limit-text">{{ maxMsgLen - message.length }}</span>
      <BaseButton class="rule" :class="{ 'is-mobile': isMobile }" size="sm" @click="openChatRulesDialog">
        <IconChatRule class="text-[14rem] !text-[#0D2245]" />
      </BaseButton>
      <BaseButton
        :disabled="maxMsgLen - message.length < 0 || sendLoading || !enableChat" bg-style="secondary"
        class="send" size="sm" shadow @click="sendMsg"
      >
        {{ t('发送') }}
      </BaseButton>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  .onlineactions {
  grid-area: onlineactions;
}

.btn-w {
  position: relative;

  .send-btn-label {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    cursor: pointer;
  }
}

.emoji-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8rem 8rem 8rem 16rem;
  color: #0d2245;
  font-size: 14rem;
  font-style: normal;
  font-weight: 600;
  line-height: 22rem;

  .close {
    width: 18rem;
    height: 18rem;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .app-svg-icon {
      font-size: 17rem;
      color: #6d7693;
    }

    &:active {
      background-color: #242628;
    }
  }
}

.smile {
  font-size: 16rem;
}

.layout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40rem, 1fr));
  gap: 16rem;
  // padding: 8rem 16rem;
  max-height: 13rem;
  margin: 16rem;
  margin-top: 0;
}

.at-users-wrap,
.command-wrap {
  background: #2f4553;
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  overflow-y: auto;
  max-height: 50%;

  .button-wrap {
    .at-user-name,
    .command {
      transition: background-color 0.2s;
      cursor: pointer;
      font-size: var(14rem);
      color: #b1bad3;
      background-color: #2f4553;
      padding: 13rem 16rem;
    }

    .command {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: var(14rem);

      .label {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: #fff;
        font-weight: 600;
        margin-right: 8rem;

        .param {
          margin-left: 4rem;
        }
      }

      .desc {
        font-weight: 400;
        color: #b1bad3;
      }
    }
  }

  .button-wrap:first-child {
    .at-user-name,
    .at-user-name:hover,
    .command,
    .command:hover {
      background-color: #0f212e;
    }

    .command {
      .label {
        color: #b1bad3;
      }
    }
  }

  .button-wrap:not(first-child) {
    .at-user-name:hover,
    .command:hover {
      background-color: #b1bad3;
    }
  }
}

.emoji-wrap {
  /* background: #2f4553; */
  font-family: 'PingFang SC';
  box-shadow:
    inset 0 -5rem 4rem -4rem #0003,
    0 -1rem 4rem #0003;
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;

  background-color: #ebebeb;

  .emojis-box {
    overflow-y: auto;
    max-height: 224rem;
  }

  .button-wrap {
    .box {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4rem;
      background-color: transparent;
      width: 40rem;
      height: 40rem;
      transition: background-color 0.2s;

      &:active {
        // &:hover, &.active,
        background-color: #b1bad3;
      }
    }

    .emo {
      width: 25rem;
      height: 25rem;
    }

    .face-emo {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24rem;
    }
  }

  // .button-wrap:first-child {
  //   .box {
  //     background-color: #071824;
  //   }
  // }
}

.green-dot {
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  z-index: 1;
  background: #2ba471;
  animation: OnlineFlash 0.2s ease-out;
}

.tg-app-chat-footer {
  position: relative;
  display: grid;
  align-items: center;
  padding: 16rem 16rem 16rem 16rem;
  row-gap: 8rem;
  grid-template-rows: auto;
  grid-template-columns: auto 1fr;
  grid-template-areas:
    'input input'
    'online actions';
  touch-action: none;
  /* --tg-base-input-textarea-minheight: 37rem; */
  min-height: 37rem;

  .chat-input {
    --tg-base-input-style-right-icon-pad-v: 0;
    --tg-base-input-style-placeholder-opacity: 0.6;
    --tg-base-input-style-box-opacity: 0.8;
    grid-area: input;
    /* height: 38rem; */
    /* right-icon-pad-v: 0; */
    /* placeholder-opacity: 0.6; */
    opacity: 0.8;

    .base-input {
      /* width: 100%;
        height: 100%; */
      border-radius: 4rem;
      border: 1rem solid #ccc;
      background: var(--tg, #fff);
      padding: 0 0;
      color: #0d2245;
    }

    :deep(.base-input) {
      .input-wrap {
        padding: 0;
      }
      .input-box .right-icon {
        padding: 0;
        button {
          width: 32rem;
          margin-right: 3rem;

          &:hover {
            /* background: #2f4553; */
          }
        }
      }
    }
  }

  .online {
    grid-area: online;
    display: flex;
    align-items: center;
    color: var(--tg, #6d7693);
    font-family: 'PingFang SC';
    font-size: 12rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;

    // gap: 8rem;
    .green-dot {
      margin-right: 8rem;
    }
  }

  .actions {
    color: var(--tg, #6d7693);
    font-family: 'PingFang SC';
    font-size: 12rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;

    display: flex;
    grid-area: actions;
    justify-content: flex-end;
    align-items: center;
    // gap: 12rem;

    :deep(button.send) {
      box-shadow: none;

      display: flex;
      width: 60rem;
      height: 40rem;
      padding: 10rem 16rem;
      justify-content: center;
      align-items: center;
      gap: 10rem;

      color: #fff;
      transition: all 0.15s linear;

      border-radius: 4rem;
      background: var(--tg, #f23038);

      color: #fff;
      font-family: 'PingFang SC';
      font-size: 14rem;
      font-style: normal;
      font-weight: 600;
      line-height: normal;

      .content {
        transition: all 0.15s linear;
        width: 100%;
        height: 100%;
      }

      &:active {
        .content {
          transform: scale(0.88);
          opacity: 0.75;
        }
      }
    }

    :deep(button.rule) {
      margin-left: 12rem;
      margin-right: 12rem;

      width: 46rem;
      height: 40rem;
      border-radius: 4rem;
      background: var(--tg, #fff);

      box-shadow: none;
      color: #0d2245;

      &.is-mobile {
        &:active {
          /* background: #0f212e; */
        }
      }
    }
  }
}
</style>
