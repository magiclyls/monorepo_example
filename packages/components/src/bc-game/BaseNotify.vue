<script lang="ts" setup name="base-notify">
import type { notifyType } from '@tg/types'
import { useBoolean } from '@tg/hooks'
import { IconUniClose } from '@tg/icons'
import { useCssVar } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

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
  set: 'uni-set',
  user: 'uni-user-blue',
  email: 'uni-green-email',
  error: 'uni-warning',
  success: 'uni-confirmed',
  insurance: 'navbar-cart',
  statistics: 'uni-trend',
  phone: 'settings-phone',
  wallet: 'navbar-wallet-notify',
  auto: 'uni-auto-bet',
  info: 'uni-record-warn',
  chat: 'uni-chat-send',
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
  // startCount()
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
        :class="{ singleLine }"
        :style="iconColor ? `color:${_iconColor.value}` : undefined"
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
    </section>
  </Transition>
</template>

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
  background: var(--tg-text-grey); // #557086
  transform-origin: left;
  animation-fill-mode: forwards;
  animation-timing-function: linear;
  animation-name: countDown;
  animation-duration: 5s;
  border-bottom-left-radius: 4rem; //
}
.notify-slide-fade-enter-active,
.notify-slide-fade-leave-active {
  transition: all 0.15s ease-in-out;
}

.notify-slide-fade-enter-from,
.notify-slide-fade-leave-to {
  transform: translateY(-200px);
  opacity: 0;
}

.notify-slide-fade-enter-to,
.notify-slide-fade-leave-from {
  transform: translateY(0);
  opacity: 1;
}
.tg-base-notify {
  position: relative;
  font-size: var(--tg-font-size-xl);
  border-radius: 0.75rem;
  padding: 0.6875rem 0.5rem;
  background: #232626;
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  width: fit-content;
  min-width: 17.1875rem;
  max-width: calc(100vw - 2rem);
  .left {
    display: flex;
    justify-content: center;
    font-size: 1.5rem;
    &.singleLine {
      padding: 16px 20px 19px;
    }
  }
  .right {
    font-size: 14rem;
    color: #fff;
    text-align: left;
    font-size: 0.875rem;
    padding: 0 0.5rem;
    font-weight: 500;
    flex: 1;
    h3 {
      font-weight: 600;
      line-height: 20rem;
      margin-bottom: 6px;
    }
    p {
      line-height: var(--tg-spacing-21);
      color: #b1bad3;
      font-weight: 400;
    }
    .message {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      font-size: 0.875rem;
      line-height: 1.3125rem;
      font-weight: 500;
    }
  }
  .close {
    cursor: pointer;
    display: flex;
    justify-content: center;
    font-size: 1.5rem;
  }
  &:hover {
    .timer {
      animation-play-state: paused;
    }
  }
}
</style>
