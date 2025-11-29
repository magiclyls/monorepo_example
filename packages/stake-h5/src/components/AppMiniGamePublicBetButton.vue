<script setup lang='ts'>
import { IconChessFrame, IconChessFrame1, IconChessFrame2, IconChessFrame3, IconChessFrame4, IconChessFrame9, IconSptSoccer, IconUniBlackjackLoading, IconUniDiamondsLoading, IconUniLimboLoading } from '@tg/icons'
import { GAMES_LIST_ENUM } from 'feie-ui'

interface Props {
  game: GAMES_LIST_ENUM
  disabled?: boolean
  loading?: boolean
  isAuto?: boolean
  autoStart?: boolean
}
defineOptions({
  name: 'AppMiniGamePublicBetButton',
})
const props = defineProps<Props>()
const emit = defineEmits(['betBtnClick'])

const appStore = useAppStore()
const { isCompleteKYC, isLogin } = storeToRefs(appStore)
const { isKYCVerifyOpen } = storeToRefs(useBrandStore())
/** KYC弹窗 */
const { openKYCDialog } = useDialogKYCVerify()

const loadingIcon = computed(() => {
  switch (props.game) {
    case GAMES_LIST_ENUM.HILO:
      return IconChessFrame3
    case GAMES_LIST_ENUM.DICE:
      return IconChessFrame2
    case GAMES_LIST_ENUM.BLACKJACK:
      return IconUniBlackjackLoading
    case GAMES_LIST_ENUM.LIMBO:
      return IconUniLimboLoading
    case GAMES_LIST_ENUM.MINES:
      return IconChessFrame4
    case GAMES_LIST_ENUM.CRASH:
      return IconChessFrame1
    case GAMES_LIST_ENUM.KENO:
      return IconChessFrame
    case GAMES_LIST_ENUM.WHEEI:
      return IconChessFrame9
    case GAMES_LIST_ENUM.DRAGONTOWER:
      return IconChessFrame2
    case GAMES_LIST_ENUM.DIAMONDS:
      return IconUniDiamondsLoading
    default:
      return IconSptSoccer
  }
})

function onBetBtnClick() {
  appStore.setGameStartBool(true)
  /** 增加kyc逻辑 */
  if (isLogin.value && isKYCVerifyOpen.value && !isCompleteKYC.value)
    return openKYCDialog()

  emit('betBtnClick')
}
</script>

<template>
  <BaseButton
    :disabled="disabled"
    size="xl" bg-style="secondary" style="font-size:medium;--tg-base-button-secondary-icon-hover-color:#000;"
    @click="onBetBtnClick"
  >
    <template v-if="isAuto">
      <div class="flex items-center">
        <slot />
        <div v-if="loading || autoStart" :class="[game]" class="wobble ml-[8px] flex items-center text-[16px]">
          <component :is="loadingIcon" />
        </div>
      </div>
    </template>

    <template v-else>
      <template v-if="loading">
        <div :class="[game]" class="wobble flex items-center text-[16px]">
          <component :is="loadingIcon" />
        </div>
      </template>
      <slot v-else />
    </template>
  </BaseButton>
</template>

<style lang='scss' scoped>
.limbo {
  animation-name: limbo-loading;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: cubic-bezier(.87, -.41, .19, 1.44);
}

.mines {
  animation-name: limbo-loading;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: cubic-bezier(.87, -.41, .19, 1.44);
}

.blackjack {
  animation-name: blackjack-loading;
  animation-duration: 1.6s;
  animation-iteration-count: infinite;
}

.hilo {
  animation-name: hilo-loading;
  animation-duration: 1.6s;
  animation-iteration-count: infinite;
}

.dice {
  transform-origin: center;
  animation-name: dice-loading;
  animation-duration: 1.6s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.keno {
  animation-name: keno-loading;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: cubic-bezier(.87, -.41, .19, 1.44);
}

.wheel {
  animation-name: wheel-loading;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  transform-origin: 50% 25%;
  animation-timing-function: ease-in-out;
}

.diamonds {
  animation-name: diamonds-flipY;
  animation-duration: 1.6s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes diamonds-flipY {
  50% {
    transform: rotateY(180deg) scale(1.2);
  }

  100% {
    transform: rotateY(360deg);
  }
}

@keyframes dice-loading {

  0%,
  5% {
    transform: rotate(0) translate(0);
  }

  15% {
    transform: rotate(45deg) translate(-10%, -10%);
  }

  20%,
  30% {
    transform: rotate(90deg) translate(0);
  }

  37.5% {
    transform: rotate(135deg) translate(-10%, 10%);
  }

  45%,
  55% {
    transform: rotate(180deg) translate(0);
  }

  62.5% {
    transform: rotate(225deg) translate(10%, 10%);
  }

  70%,
  80% {
    transform: rotate(270deg) translate(0);
  }

  87.5% {
    transform: rotate(315deg) translate(10%, -10%);
  }

  95%,
  100% {
    transform: rotate(360deg) translate(0);
  }
}

@keyframes limbo-loading {
  25% {
    transform: scale(1.3);
  }

  50% {
    transform: scale(1.3) rotate(-10deg);
  }

  75% {
    transform: scale(1.3) rotate(10deg);
  }

}

@keyframes blackjack-loading {
  50% {
    transform: rotateY(180deg) scale(1.2);
  }

  100% {
    transform: rotateY(360deg);
  }
}

@keyframes hilo-loading {
  50% {
    transform: rotateX(180deg);
  }

  100% {
    transform: rotateX(360deg);
  }
}

@keyframes keno-loading {
  5% {
    transform: scale(1.3);
  }

  50% {
    transform: scale(1.3) rotate(-10deg);
  }

  75% {
    transform: scale(1.3) rotate(10deg);
  }
}

@keyframes wheel-loading {

  0%,
  100% {
    transform: rotate(30deg);
  }

  50% {
    transform: rotate(-80deg);
  }

  75% {
    transform: rotate(50deg);
  }
}
</style>
