<script lang="ts" setup>
import { IconUniClose } from '@tg/icons'
import Swiper from 'swiper'
import 'swiper/css'

defineOptions({
  name: 'AppPromoHotGate',
})
const { openActivity } = useActivityMenu()
const { rightWidth, isMobile, bodyWidth, width } = storeToRefs(useWindowStore())
const { rightIsExpand } = useRightSidebar()
const { leftIsExpand } = useLeftSidebar()
const { theme } = storeToRefs(useAppStore())
const route = useRoute()

const promoHotGateRef = ref()

const rightWidthNum = computed(() => +rightWidth.value.split('px')[0])
// 有皮肤的情况下基础宽度
const _baseWidth = computed(() => {
  if (theme.value === '')
    return window.innerWidth
  return window.innerWidth - ((window.innerWidth - bodyWidth.value) / 2)
})
const maxX = computed(() => (isMobile.value ? _baseWidth.value - 75 : (_baseWidth.value - 120 - (rightIsExpand.value ? rightWidthNum.value : 16))))
const maxY = computed(() => (isMobile.value ? window.innerHeight - 75 : window.innerHeight - 120))
const right = computed(() => {
  return rightIsExpand.value ? `${+rightWidth.value.split('px')[0] + 16}px` : '16px'
})

const initialX = computed(() => {
  if (isMobile.value)
    return isShowServiceFloatSites() ? ((window.innerWidth - bodyWidth.value) / 2) + 10 : _baseWidth.value - 12 - 75
  else
    return _baseWidth.value - 120 - (rightIsExpand.value ? rightWidthNum.value : 16)
},
)
const initialY = ref(isMobile.value ? window.innerHeight - 156 : window.innerHeight - 220)

const { x, y, style } = useDraggable(promoHotGateRef, {
  initialValue: {
    x: initialX.value,
    y: initialY.value,
  },
  onMove: (p) => {
    p.x = initialX.value
    p.y = initialY.value
  },
})
const _style = computed(() => {
  if (isMobile.value)
    return style.value

  return {
    right: `${right.value}`,
    top: `${y.value}px`,
  }
})

const appStore = useAppStore()
const { promoShortCut } = useGlobalPromoState()
const { show, setShow, closeAll, setCloseAll } = usePromoHotGate()

const deletedImgs = ref<string[]>([])
const swiper = ref()

const sliders = computed(() => promoShortCut.value?.map((h) => {
  let temp
  try {
    temp = JSON.parse(h.icon)
  }
  catch {
    temp = h.icon
  }
  if (isArray(temp) && temp.length) {
    const tf = temp.filter((e: string) => e !== undefined && e !== null && e.trim().length && e.includes('.'))
    return tf.length ? tf.map((t: string) => ({ ...h, ty: h.ty, id: h.id, icon: t })) : undefined
  }
  else if (isArray(temp) && temp.length === 0) {
    return undefined
  }
  else { return { ...h, icon: temp } }
}).filter(f => f !== undefined && f !== null).flat().filter(f => !deletedImgs.value.includes(f.icon)))

function deleteSlider(item: any) {
  deletedImgs.value.push(item.icon)
  nextTick(() => {
    swiper.value.update()
  })
}

function deleteAll() {
  swiper.value.destroy()
  setShow(false)
  setCloseAll(true)
}

let autoplayTimer: ReturnType<typeof setTimeout>
const stopAutoplay = () => clearTimeout(autoplayTimer)
function autoplay() {
  stopAutoplay()
  if (sliders.value && sliders.value.length > 1 && show.value) {
    autoplayTimer = setTimeout(() => {
      swiper.value.slideNext()
      autoplay()
    }, 3000)
  }
}
// 点击节流
const openThrottleActivity = throttle((item: any) => {
  openActivity(item)
}, 1.2 * 1000, {
  leading: true,
  trailing: false,
})

async function initSwiper(sliders: any) {
  if (closeAll.value)
    return
  if (sliders && sliders.length && (isMobile.value ? (route.name === 'casino-home' || route.path === '/') : true)) {
    setShow(true)
    await nextTick()
    setTimeout(() => {
      swiper.value = new Swiper('.swiperlocal', {
        direction: 'horizontal',
        loop: true,
        autoplay: true,
      })
      setTimeout(() => {
        autoplay()
      }, 2000)
    }, 0)
  }
}

function resizeCallBack() {
  getInitialY()
}

function getInitialY() {
  initialY.value = isMobile.value ? window.innerHeight - 160 : window.innerHeight - 220
  y.value = initialY.value
}

onMounted(() => {
  window.addEventListener('resize', resizeCallBack)
  initSwiper(sliders.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCallBack)
})

watch(sliders, (val) => {
  if (!val || val.length === 0)
    swiper.value?.destroy()
  if (val && val.length)
    initSwiper(sliders.value)
}, { deep: true, immediate: true })

watch(rightIsExpand, (val) => {
  const leftWidth = window.innerWidth - rightWidthNum.value - 16
  if (!isMobile.value) {
    if (val) {
      if (x.value > leftWidth - 120)
        x.value = leftWidth - 120
    }
    else {
      x.value = x.value + rightWidthNum.value
      if (x.value > maxX.value)
        x.value = maxX.value
    }
  }
})
watch(isMobile, () => {
  getInitialY()
})

watch(route, (val) => {
  if (isMobile.value) {
    if ((val.name === 'casino-home' || val.path === '/')) {
      setShow(true)
      nextTick(() => {
        initSwiper(sliders.value)
      })
    }
    else {
      swiper.value?.destroy()
      setShow(false)
    }
  }
})
watch(width, (newWidth) => {
  const __baseWidth = theme.value === '' ? newWidth : newWidth - ((newWidth - bodyWidth.value) / 2)
  if (isMobile.value)
    x.value = isShowServiceFloatSites() ? ((newWidth - bodyWidth.value) / 2) + 10 : __baseWidth - 12 - 75
  else
    x.value = __baseWidth - 120 - (rightIsExpand.value ? rightWidthNum.value : 16)
}, { immediate: true })
</script>

<template>
  <teleport to="body">
    <div
      v-if="sliders && sliders.length && show && !closeAll"
      ref="promoHotGateRef"
      draggable="true"
      class="fixed overflow-hidden duration-[0.25s]"
      :class="[isMobile && (rightIsExpand || leftIsExpand) ? 'z-[-2]' : 'z-[2]', isMobile ? 'h-[75px] w-[75px]  !left-[var(--pc-h5model-left,0)]' : ' h-[120px] w-[120px]']"
      :style="_style"
    >
      <div
        class="text-tg-text-white swiperlocal relative text-[10px]"
        :class="[isMobile ? 'h-[75px] w-[75px] ' : 'h-[75px] w-[120px]']"
      >
        <div class="swiper-wrapper">
          <div v-for="(item, idx) in sliders" :key="item.id + idx" class="swiper-slide relative cursor-pointer">
            <BaseImage is-network :url="item.icon[0] === '/' ? item.icon : `/${item.icon}`" @click.stop="openThrottleActivity(item)" />
          </div>
        </div>
      </div>
      <a class="text-tg-text-white close absolute right-0 top-0 z-[1001] h-[15px] w-[15px] flex cursor-pointer justify-end text-[10px]" @click.stop="deleteAll">
        <IconUniClose />
      </a>
    </div>
    <BaseImage v-for="(item, idx) in sliders" :key="idx" width="0px" height="0px" class="invisible h-[0px] w-[0px]" is-network hidden :url="item.icon[0] === '/' ? item.icon : `/${item.icon}`" />
  </teleport>
</template>

<style lang="scss" scoped>
.close {
  --tg-icon-color: white;
  svg {
    cursor: pointer;
    display: block;
  }
}
.swiperlocal {
  --tg-icon-color: white;
}
</style>
