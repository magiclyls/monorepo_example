<script lang="ts" setup>
import { ApiAddFeedbackChatMsg } from '@tg/apis'
import { PhBaseButton, PhBaseInput } from '@tg/bccomponents'
import { useAppStore } from '@tg/stores'
import { EventBusNames } from '@tg/types'
import { appEventBus } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'

interface Props {
  feedId: string
  allowSend: boolean
}
defineOptions({
  name: 'AppFeedbackChatFooter',
})
const props = defineProps<Props>()

// const feedChatMessageBus = useEventBus(EventBusNames.FEEDBACK_CHAT_MESSAGE_BUS)

const { t } = useI18n()
// const { openNotify } = useNotify()

const { isLogin, userInfo } = storeToRefs(useAppStore())

const maxMsgLen = 512
const msgInput = ref()
const message = ref('')

const trimMessage = computed(() => message.value.trim())
const params = computed(() => ({
  feed_id: props.feedId,
  content: trimMessage.value,
  source: 1,
}))

const { run: runSendMsg, loading: sendLoading } = useRequest(ApiAddFeedbackChatMsg, {
  onSuccess: () => {
    const tt = Math.ceil(new Date().getTime() / 1000)
    appEventBus.emit(EventBusNames.FEEDBACK_CHAT_MESSAGE_BUS, { content: trimMessage.value, feed_id: props.feedId, create_at: tt, id: `id-${tt}`, uid: userInfo.value?.uid })
  },
})

function sendMsg() {
  if (trimMessage.value.length && !sendLoading.value) {
    if (props.allowSend) {
      if (!isLogin.value) {
        // openNotify({ type: 'error', message: t('notify_error_forbid_operation') })
        return
      }
      runSendMsg(params.value)
      msgInput.value.getFocus()
    }
    else {
      // openNotify({ type: 'error', message: t('wait_office_reply') })
    }
    message.value = ''
  }
}

function enterPress(event: KeyboardEvent) {
  event.preventDefault()
  event.stopPropagation()
  if (trimMessage.value.length) {
    if (!isLogin.value) {
      // openNotify({ type: 'error', message: t('notify_error_forbid_operation') })
      return
    }
    sendMsg()
  }
}
</script>

<template>
  <div class="fixed bottom-0 left-0 gap-[12rem] flex w-full bg-[#fff] p-[16rem]">
    <div class="flex-1">
      <PhBaseInput
        ref="msgInput"
        v-model="message"
        class=" h-[41rem]"
        :placeholder="t('输入您的消息')"
        textarea
        :max="maxMsgLen"
        @down-enter="enterPress"
      />
    </div>
    <PhBaseButton class="w-[57rem] min-w-[68rem] h-[41rem]" @click="sendMsg">
      {{ t('发送') }}
    </PhBaseButton>
  </div>
</template>

<style lang="scss" scoped>
.app-feedback-chat-footer {
  display: flex;
  padding: 16rem;
  width: 100%;
  align-items: stretch;
  > *:not(:first-child) {
    margin-left: 12rem;
  }
  .chat-input {
    flex: 1;
  }
}
</style>
