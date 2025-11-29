<script lang="ts" setup>
import { ApiGetFeedbackChatList } from '@tg/apis'
import { AfunBaseDialog } from '@tg/bccomponents'
import { IconUniArrowBack } from '@tg/icons'
import { useAppStore, useChatStore } from '@tg/stores'
import { EventBusNames } from '@tg/types'
import { appEventBus } from '@tg/utils'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppLoading from '~/components/AppLoading.vue'
import AppBonusEnvelope from './AppBonusEnvelope.vue'
import AppFeedbackChatFooter from './AppFeedbackChatFooter.vue'
import AppFeedbackChatMsg from './AppFeedbackChatMsg.vue'
import AppFeedBackReceiveBonusDialog from './AppFeedBackReceiveBonusDialog.vue'

defineOptions({
  name: 'AppFeedbackChat',
})

const emit = defineEmits(['reState'])
const { userInfo } = storeToRefs(useAppStore())
const chatStore = useChatStore()

const { feedBackItem } = storeToRefs(chatStore)

const scrollMsg = ref()
const { t } = useI18n()
const messageHistory = ref<Array<any>>([])
const showClaim = ref(false)
const params = computed(() => ({ feed_id: feedBackItem.value?.feed_id ?? '' }))
const canSendMsg = computed(() =>
  messageHistory.value && messageHistory.value.length
    ? messageHistory.value[messageHistory.value.length - 1].uid !== userInfo.value?.uid
    : false)

const { runAsync: runGetHistory, loading: historyLoading } = useRequest(ApiGetFeedbackChatList, {
  onBefore: () => {
  },
  onSuccess: (data) => {
    messageHistory.value = data?.reverse() ?? []
  },
  onAfter: () => {
  },
})

function goBack() {
  chatStore.setFeedbackChatFalse()
  chatStore.setFeedbackItem()
}

function init() {
  if (params.value.feed_id.length)
    runGetHistory(params.value)
}

function reset() {
  goBack()
}

function onReceiveChatMsg(m: any) {
  if (params.value.feed_id.length)
    runGetHistory(params.value)
}

onMounted(() => {
  init()
  appEventBus.on(EventBusNames.FEEDBACK_CHAT_MESSAGE_BUS, onReceiveChatMsg)
  emit('reState')
})

onActivated(() => {
  init()
})

onDeactivated(() => {
  chatStore.setFeedbackItem()
  messageHistory.value = []
  chatStore.setFeedbackChatFalse()
})

onUnmounted(() => {
  reset()
  messageHistory.value = []
  appEventBus.off(EventBusNames.FEEDBACK_CHAT_MESSAGE_BUS, onReceiveChatMsg)
})
</script>

<template>
  <div class="app-feedback-chat">
    <div class="header my-[16px]">
      <div class="go-back text-[14px]" @click="goBack">
        <IconUniArrowBack :style="{ color: '#B1BAD3' }" />
        <span class="ml-[8px] text-[#fff]">{{ $t('返回') }}</span>
      </div>
    </div>
    <AppLoading v-if="historyLoading" />
    <div class="messages">
      <div ref="scrollMsg" class="scroll-y message-content">
        <div v-if="messageHistory.length" class="time-wrap mb-[10px] text-[#979AA7]">
          {{
            dayjs(messageHistory[0].created_at * 1000).format('MM/DD HH:mm')
          }}
        </div>
        <template v-for="msg in messageHistory" :key="msg.id">
          <AppFeedbackChatMsg :message="msg" />
        </template>
        <template v-if="!historyLoading && feedBackItem && feedBackItem.bonusState > 0">
          <AppFeedbackChatMsg
            :message="{
              uid: '',
              content: '',
              id: '',
              created_at: 0,
              feed_id: feedBackItem.feed_id,
            }"
          >
            <AppBonusEnvelope
              :amount="feedBackItem.amount"
              :bonus-state="feedBackItem.bonusState"
              @open="showClaim = true"
            />
          </AppFeedbackChatMsg>
          <AppFeedbackChatMsg
            v-if="feedBackItem.bonusState === 2"
            :message="{
              uid: userInfo?.uid ?? '',
              content: '',
              id: '',
              created_at: 0,
              feed_id: feedBackItem.feed_id,
            }"
          >
            <AppBonusEnvelope
              :amount="feedBackItem.amount"
              :bonus-state="feedBackItem.bonusState"
              @open="showClaim = true"
            />
          </AppFeedbackChatMsg>
        </template>
      </div>
    </div>
    <div
      v-if="feedBackItem && canSendMsg && feedBackItem.bonusState !== 1"
      class="footer"
    >
      <AppFeedbackChatFooter :feed-id="feedBackItem.feed_id" :allow-send="canSendMsg" />
    </div>

    <AfunBaseDialog v-model="showClaim" :title="t('领取奖金')">
      <template #icon>
        <AfunBaseImage class="w-[11px] h-[14px] mr-[8px] shrink-0" url="afun-h5/svg/feedback-claim.svg" />
      </template>
      <AppFeedBackReceiveBonusDialog :feed-back-item="feedBackItem" />
    </AfunBaseDialog>
  </div>
</template>

<style>
:root {
  --tg-chat-message-bg: transparent;
}
</style>

<style lang="scss" scoped>
.time-wrap {
  text-align: center;
  color: #6d7693;
  font-size: 14px;
}
.app-feedback-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--tg-chat-message-bg);
  .header {
    position: relative;
    width: 100%;
    height: var(--tg-spacing-50);
    z-index: var(--tg-z-index-10);
    .go-back {
      height: 100%;
      width: fit-content;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: #fff;
      font-size: 14px;
      padding-left: 16px;
      cursor: pointer;
      > *:not(:first-child) {
        margin-left: 8px;
      }
    }
  }
  .messages {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: hidden;
    position: relative;
    flex-grow: 1;
    .message-content {
      position: relative;
      overflow-x: hidden;
      min-height: 0;
      transform: translateZ(0);
      overflow-y: scroll;
      word-break: break-word;
      padding: 8px 16px;
      padding-top: 0;
      display: flex;
      flex-direction: column;
      overflow-anchor: none;
      overscroll-behavior: contain;
      gap: 16px;
      margin-bottom: 80px;
      .msg-tail {
        position: relative;
        margin: 0;
        padding: 0;
        height: 0;
      }
      .wrap {
        width: 100%;
      }
    }
  }
  .footer {
    background: #213743;
  }
}
</style>
