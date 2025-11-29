<script setup lang="ts">
import { BaseImage } from '@tg/bccomponents'
import { useAppStore, useSportsStore } from '@tg/stores'
import { Session, STORAGE_SPORTS_LIVE_NAV } from '@tg/utils'
import { useWindowScroll } from '@vueuse/core'
import { throttle } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref, unref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSportsConfig } from '../../config/index'

defineOptions({ name: 'AppSportsHomeMarketTypeTabs' })

const { y: windowY } = useWindowScroll()
const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const { projectName } = useSportsConfig()
const { isSportsLoginSusses, marketType, isLobbyLoadFirst } = storeToRefs(useSportsStore())

const scrollDwon = ref(false)
// dash计算数据
const parent = ref()
const curTabRef = ref<Array<Element | null>>([])
const dashWidth = ref()
const dashOffset = ref()

const list = computed(() => [
  {
    label: t('大厅'),
    value: 'all',
    icon: `/${projectName}/png/spt-tab-lobby.png`,
  },
  {
    label: t('虚拟体育'),
    value: 'v-sports',
    icon: `/${projectName}/png/spt-tab-vs.png`,
  },
  {
    label: t('我的投注'),
    value: 'my-bet',
    icon: `/${projectName}/png/spt-tab-my-bet.png`,
    disabled: !isLogin.value || !isSportsLoginSusses.value,
  },
  {
    label: t('收藏夹'),
    value: 'fav',
    icon: `/${projectName}/png/spt-tab-fav.png`,
    disabled: !isLogin.value || !isSportsLoginSusses.value,
  },
])

function change($event: MouseEvent, item: Record<string, any>, i: number) {
  scrollIntoView($event.target)
  reset()
  marketType.value = item.value
  onTabChange()
  if (curTabRef.value && parent.value) {
    const parentRect = parent.value!.getBoundingClientRect()
    const childRect = curTabRef.value[i]!.getBoundingClientRect()
    dashWidth.value = `${childRect.width}px`
    const offsetLeft = childRect.left - parentRect.left + parent.value.scrollLeft
    dashOffset.value = offsetLeft
  }
}

function scrollIntoView(ele: any) {
  if (!ele)
    return
  ele.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center',
  })
}

let lastScrollTop = 0
let lastScrollDownTop = 0
const SCROLL_UP_THRESHOLD = 20
const SCROLL_DOWN_TRIGGER = 50
// 暂停监听
let ignoreScroll = false

const handleScroll = throttle(() => {
  const current = windowY.value
  if (ignoreScroll)
    return

  console.log('🚸🚸🚸 ~ ignoreScroll:', current)
  if (current > lastScrollTop) {
    // 往下滚
    if (current >= SCROLL_DOWN_TRIGGER) {
      scrollDwon.value = true
    }
    lastScrollDownTop = current
  }
  else if (current < lastScrollTop) {
    // 往上滚
    if ((lastScrollDownTop - current) >= SCROLL_UP_THRESHOLD) {
      scrollDwon.value = false
    }
  }

  lastScrollTop = current
}, 30, {
  leading: true,
  trailing: false,
})

function reset() {
  ignoreScroll = true
  windowY.value = 0
  lastScrollTop = 0
  lastScrollDownTop = 0
  setTimeout(() => {
    ignoreScroll = false
  }, 100) // 冷却期
}

function onTabChange() {
  isLobbyLoadFirst.value = false
  Session.set(STORAGE_SPORTS_LIVE_NAV, unref(marketType))
}

onMounted(() => {
  // window.addEventListener('scroll', handleScroll, { passive: true })

  if (curTabRef.value && curTabRef.value[0] && parent.value) {
    const parentRect = parent.value!.getBoundingClientRect()
    const childRect = curTabRef.value[0].getBoundingClientRect()
    dashWidth.value = `${childRect.width}px`
    const offsetLeft = childRect.left - parentRect.left + parent.value.scrollLeft
    dashOffset.value = offsetLeft
  }
})

onBeforeUnmount(() => {
  // window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div
    class="wrapper h5-sticky-top w-full bg-[var(--ss-spt-home-market-type-tabs-bg1)] overflow-hidden z-[var(--z-index-dropdown)] text-[12rem] transition-transform duration-400"
    style="top:50rem;"
  >
    <div class="absolute left-[-10rem] top-[-42rem] w-[var(--pc-max-width)] h-auto  pointer-events-none">
      <BaseImage :url="`/${projectName}/png/casino-head-bg.png`" :is-show-error-img="false" />
    </div>
    <div class="overflow-hidden">
      <div ref="parent" class="overflow-scroll hide-scroll relative items-center flex">
        <div
          v-for="item, index in list" ref="curTabRef" :key="item.value"
          class="relative shrink-0 flex flex-col mr-[13.5rem] h-[66rem] justify-between items-center pt-[4rem] pb-[16rem] cursor-pointer"
          :style="{ marginRight: list?.length === index + 1 ? '0' : '13.5rem' }" :class="{ disabled: item.disabled }"
          @click="change($event, item, index)"
        >
          <div class="w-[28rem] h-[28rem]">
            <BaseImage :url="item.icon" />
          </div>
          <span
            class="leading-[12rem]"
            :class="[marketType === item.value
              ? 'text-[var(--ss-spt-home-market-type-tabs-color2)] font-[510]'
              : 'text-[var(--ss-spt-home-market-type-tabs-color1)] font-[500]',
            ]"
          >
            {{ item.label }}
          </span>
        </div>
        <div class="dash" :style="{ width: dashWidth, transform: `translateX(${dashOffset}px)` }" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.active-bg {
  border-radius: 50%;
  width: 44rem;
  height: 44rem;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.dash {
  height: 2px;
  position: absolute;
  left: 0;
  bottom: 10rem;
  width: 0;
  border-radius: 4px;
  background: var(--ss-spt-home-market-type-tabs-color3);
  transition: transform 0.2s ease-out;
}
</style>
