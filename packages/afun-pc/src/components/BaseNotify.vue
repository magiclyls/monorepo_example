<script lang="ts" setup name="base-notify">
import { IconUniClose, IconUniSet, IconUniUserBlue, IconUniGreenEmail, IconUniWarning, IconUniConfirmed, IconNavbarCart, IconUniTrend, IconSettingsPhone, IconNavbarWalletNotify, IconUniAutoBet, IconUniRecordWarn, IconUniChatSend } from '@tg/icons'
import type { notifyType } from '~/composables/useNotify'

interface Props {
  type?: notifyType
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

const _iconColor = ref()
if (props.iconColor)
  _iconColor.value = useCssVar(props.iconColor)

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
      return t('notify_title_error')
    case 'success':
      return t('notify_title_success')
    case 'user':
      return t('welcome_guest')
    case 'info':
      return t('warm_tip')
    case 'chat':
      return t('open_chat')
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
      v-if="show"
      class="tg-base-notify"
      :class="[clazz]"
      @mouseover="overMove"
      @mouseleave="leaveEnd"
      @mouseenter="enterStart"
    >
      <div
        v-if="iconName"
        class="left"
        :class="{ singleLine, [type]: true }"
        :style="iconColor ? `--tg-icon-color:${_iconColor.value}` : undefined"
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
            <div class="text-tg-secondary-light">
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

<style lang="scss" scoped>
@keyframes countDown {
    0% {
        transform: scaleX(1)
    }

    to {
        transform: scaleX(0)
    }
}
.timer {
  height: 3px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--tg-third-grey);
  transform-origin: left;
  animation-fill-mode: forwards;
  animation-timing-function: linear;
  animation-name: countDown;
  animation-duration: 5s;
  border-bottom-left-radius: var(--tg-radius-default); //
  @include webTheme('white') {
      background: #C1C1C1;
    }
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
  font-size: var(--tg-font-size-xl);
  background: var(--tg-secondary-grey);
  box-shadow: 0px 3px 5px 0px #{rgba($color: var(--tg-color-black-rgb), $alpha: 0.35)};
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  width: fit-content;
  min-width: 275px;
  max-width: calc(100vw - 2rem);
  @include webTheme('white') {
    background: #f5f5f5;
  }
  @include webTheme('green') {
    background: #076237;
  }
  .left {
    padding: var(--tg-spacing-27) var(--tg-spacing-23);
    background: var(--tg-primary-main);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    &.singleLine{
      padding:16px 20px 19px;
    }

    @include webTheme('white') {
      background: #F2CA5C;
    }
    @include webTheme('green') {
      background: #055434;
    }

    &.success{
      --tg-icon-color: #00E701;
      @include webTheme('green') {
        --tg-icon-color:#2DFF0B;
      }
      @include webTheme('white') {
        --tg-icon-color: #00A501;
      }
    }
  }
  .right {
    font-size: var(--tg-font-size-default);
    color: var(--tg-text-white);
    text-align: left;
    font-size: 14px;
    font-weight: 500;
    flex: 1;
    padding: var(--tg-spacing-16) 0 var(--tg-spacing-15) var(--tg-spacing-16);
    h3 {
      font-weight: var(--tg-font-weight-semibold);
      line-height: var(--tg-spacing-20);
      margin-bottom: 6px;
    }
    p {
      line-height: var(--tg-spacing-21);
      color: var(--tg-text-lightgrey);
      font-weight: var(--tg-font-weight-normal);
      // padding-top: var(--tg-spacing-4);
      @include webTheme('green') {
        --tg-text-lightgrey: #5ECEA6;
      }
    }
    .message{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      font-size: 14px;
      font-weight: 500;
    }
  }
  .close {
    font-size: var(--tg-font-size-default);
    padding: 0 var(--tg-spacing-14) 0 var(--tg-spacing-8);
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
