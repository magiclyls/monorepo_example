<script lang="ts" setup>
import { IconUniHome } from '@tg/icons'
// const route = useRoute()
const router = useLocalRouter()
// const { isMobile } = storeToRefs(useWindowStore())
const { userLanguage } = storeToRefs(useLanguageStore())
const { openWalletDialog } = useWalletDialog()
const {
  // isSupported,
  orientation,
  // angle,
} = useScreenOrientation()

const homeRef = ref()
const chargeRef = ref()
const gameUrl = Local.get(STORAGE_FIAT_CURRENCY_DEPOSIT_URL)?.value
const mobileGameUrl = ref(gameUrl ?? '') // decodeURIComponent(gameUrl)
const mobileGameFrameRef = ref()
const { bool: isShowMobileTopOperation, setTrue: showMobileTopOperation, setFalse: hideMobileTopOperation } = useBoolean(false)

function goHome() {
  router.back()
}

function openRecharge() {
  openWalletDialog()
}

onMounted(() => {
  setTimeout(() => {
    showMobileTopOperation()
  }, 2000)
})

onBeforeUnmount(() => {
  mobileGameUrl.value = ''
  hideMobileTopOperation()
})

const initialX = ref()
const initialY = ref()
const maxX = ref(window.innerWidth - 58)
const maxY = ref(window.innerHeight - 58)
const { x, y, style } = useDraggable(homeRef, {
  initialValue: {
    x: initialX.value,
    y: initialY.value,
  },
  onMove: (p) => {
    maxX.value = window.innerWidth - 58
    maxY.value = window.innerHeight - 58
    if (p.x < 0)
      x.value = 0
    if (p.x > maxX.value)
      x.value = maxX.value
    if (p.y < 0)
      y.value = 0
    if (p.y > maxY.value)
      y.value = maxY.value
  },
})
const { x: chargeX, y: chargeY, style: chargeStyle } = useDraggable(chargeRef, {
  initialValue: {
    x: initialX.value,
    y: initialY.value,
  },
  onMove: (p) => {
    maxX.value = window.innerWidth - 58
    maxY.value = window.innerHeight - 58
    if (p.x < 0)
      chargeX.value = 0
    if (p.x > maxX.value)
      chargeX.value = maxX.value
    if (p.y < 0)
      chargeY.value = 0
    if (p.y > maxY.value)
      chargeY.value = maxY.value
  },
})

watch(orientation, () => {
  maxX.value = window.innerWidth - 58
  maxY.value = window.innerHeight - 58
  x.value = initialX.value
  y.value = initialY.value
  chargeX.value = initialX.value
  chargeY.value = initialY.value
})
</script>

<template>
  <div class="h-full">
    <div class="loading-box h-full flex flex-col items-center justify-center">
      <BaseLoading />
    </div>
    <teleport to="body">
      <div v-show="mobileGameUrl" class="mobile-game-frame w-full">
        <iframe
          ref="mobileGameFrameRef"
          :src="mobileGameUrl"
          frameborder="0"
          allowfullscreen
        />
        <div class="top-operation text-tg-text-white w-full flex justify-between p-[6px] text-[10px] leading-[14px]" :class="[isShowMobileTopOperation ? 'opacity-100' : 'opacity-0']">
          <div ref="homeRef" class="item fixed flex flex-col items-center justify-center" :style="style" @click="goHome">
            <IconUniHome class="text-[18px]" />
            <div>{{ $t('navigation_back') }}</div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<style lang="scss" scoped>
.loading-box {
  height: 100%;
  height: 100vh;
  height: 100dvh;
}
.mobile-game-frame {
  iframe {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100%;
    height: 100vh;
    height: 100dvh;
    border: none;
    z-index: 99;
  }
  .top-operation {
    --tg-icon-color: white;
    top: 0;
    left: 0;
    color: white;
    transition: all 500ms ease;
    .item {
      width: 52px;
      height: 52px;
      border: 1px solid white;
      border-radius: 50px;
      background: rgba(35,50,62, .7);
      z-index: 100;
    }
    .item:first-child {
      top: 6px;
      left: 6px;
    }
    .item:last-child {
      top: 6px;
      right: 6px;
    }
  }
}
</style>
