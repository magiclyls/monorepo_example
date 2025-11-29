<script lang="ts" setup name="base-notify">
import type { TBaseNotifyType } from '@tg/types'
import { useBoolean } from '@tg/hooks'
import {
  IconNavbarCart,
  IconNavbarWalletNotify,
  IconSettingsPhone,
  IconUniAutoBet,
  IconUniChatSend,
  IconUniClose,
  IconUniConfirmed,
  IconUniGreenEmail,
  IconUniRecordWarn,
  IconUniSet,
  IconUniTrend,
  IconUniUserBlue,
  IconUniWarning,
} from '@tg/icons'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  type?: TBaseNotifyType
  icon?: string
  iconColor?: string
  title?: string
  message?: string
  showClose?: boolean
  funcCall?: string
  clazz?: string
}
defineOptions({
  name: 'BaseNotify',
})
const props = withDefaults(defineProps<Props>(), {
  type: 'success',
  showClose: true,
  clazz: '',
})

const emit = defineEmits(['close', 'notifyClick'])

const iconObj = {
  set: IconUniSet,
  user: IconUniUserBlue,
  email: IconUniGreenEmail,
  error: IconUniWarning,
  success: IconUniConfirmed,
  insurance: IconNavbarCart,
  statistics: IconUniTrend,
  phone: IconSettingsPhone,
  wallet: IconNavbarWalletNotify,
  auto: IconUniAutoBet,
  info: IconUniRecordWarn,
  chat: IconUniChatSend,
}

const { t } = useI18n()
const { bool: show, setTrue: setNTrue, setFalse: setNFalse } = useBoolean(false)

const timer = ref()
const stayTime = ref(5000)
const startTime = ref(0)
const endTime = ref(0)

const iconName = computed(() => {
  if (props.icon)
    return props.icon
  else
    return iconObj[props.type]
})

const _title = computed(() => {
  if (props.title)
    return undefined
  switch (props.type) {
    case 'error':
      return t('错误')
    case 'success':
      return t('成功')
    case 'user':
      return t('欢迎')
    case 'info':
      return t('温馨提示')
    case 'chat':
      return t('解锁聊天功能')
    default:
      return undefined
  }
})
// 单行
const singleLine = computed(() => props.type === 'auto')

function close() {
  setNFalse()
  setTimeout(() => {
    emit('close', props.funcCall)
  }, 800)
}

function overMove() {
  clearTimeout(timer.value)
}

function leaveEnd() {
  startCount()
}

function startCount() {
  stayTime.value = stayTime.value - (endTime.value - startTime.value)
  startTime.value = new Date().getTime()
  timer.value = setTimeout(() => {
    close()
  }, stayTime.value)
}

function enterStart() {
  clearTimeout(timer.value)
  endTime.value = new Date().getTime()
}

function handClose() {
  close()
}

function contentClick() {
  emit('notifyClick')
}

onMounted(() => {
  setNTrue()
  startCount()
})
</script>

<template>
  <Transition name="notify-slide-fade">
    <section
      v-if="show" class="tg-base-notify" :class="[clazz]" @mouseover="overMove" @mouseleave="leaveEnd"
      @mouseenter="enterStart"
    >
      <div
        v-if="iconName" class="left" :class="{ singleLine, [type]: true }"
        :style="iconColor ? `color:${iconColor}` : undefined"
      >
        <component :is="iconName" />
      </div>
      <div class="right" @click.stop="contentClick">
        <slot>
          <div>
            <slot name="title">
              <h3 v-if="title" class="title" v-html="title" />
              <h3 v-if="!title && _title" class="title">
                {{ _title }}
              </h3>
            </slot>
            <div class="text-[#b1bad3]">
              <slot name="message">
                <p v-if="message" class="message" v-html="message" />
              </slot>
            </div>
          </div>
        </slot>
      </div>
      <div v-if="showClose" class="close" @click="handClose">
        <IconUniClose />
      </div>
      <div class="timer" />
    </section>
  </Transition>
</template>

<style lang="scss">
.tg-notification-list {
  display: grid;
  grid-auto-flow: row;
  position: fixed;
  top: 80px;
  left: 16px;
  z-index: 9999;
  > *:not(:last-child) {
    margin-bottom: 12px;
  }
}
</style>

<style lang="scss" scoped>
@keyframes countDown {
  0% {
    transform: scaleX(1);
  }

  to {
    transform: scaleX(0);
  }
}

.timer {
  height: 3px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #557086;
  transform-origin: left;
  animation-fill-mode: forwards;
  animation-timing-function: linear;
  animation-name: countDown;
  animation-duration: 5s;
  border-bottom-left-radius: 4px; //
}

.notify-slide-fade-enter-active {
  transition: all 0.15s ease-out;
  opacity: 1;
}

.notify-slide-fade-leave-active {
  transition: all 0.15s cubic-bezier(1, 0.5, 0.8, 1);
  opacity: 1;
}

.notify-slide-fade-enter-from {
  transform: translateX(-200px);
  opacity: 0;
}

.notify-slide-fade-leave-to {
  transform: translateX(-200px);
  opacity: 0;
}

.tg-base-notify {
  position: relative;
  font-size: 24px;
  background: #213743;
  box-shadow: 0px 3px 5px 0px #{rgba($color: #000, $alpha: 0.35)};
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  width: fit-content;
  min-width: 275px;
  max-width: calc(100vw - 2rem);

  .left {
    padding: 27px 23px;
    background: #1a2c38;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;

    &.singleLine {
      padding: 16px 20px 19px;
    }

    &.success {
      color: #2dff0b;
    }
    &.error {
      color: #ed4163;
    }
  }

  .right {
    font-size: 14px;
    color: #fff;
    text-align: left;
    font-size: 14px;
    font-weight: 500;
    flex: 1;
    padding: 16px 0 15px 16px;

    h3 {
      font-weight: 600;
      line-height: 20px;
      margin-bottom: 6px;
    }

    p {
      line-height: 21px;
      color: #b1bad3;
      font-weight: 400;
    }

    .message {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      font-size: 14px;
      font-weight: 500;
    }
  }

  .close {
    font-size: 14px;
    padding: 0 14px 0 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    .timer {
      animation-play-state: paused;
    }
  }
}
</style>
