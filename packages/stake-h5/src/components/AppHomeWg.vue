<script setup lang='ts'>
import { getEnv } from '@tg/utils';

interface ComponentItem {
  cid: string
  platform_id: string
  name: string
  icon: string
  component: any
  value?: string
  ty?: string | number
}

const { VITE_SITE_NAME } = getEnv()

let prefixTitle = 'btc_casino_title'
if (VITE_SITE_NAME === 'x02')
  prefixTitle = 'btc_casino_title_xpj'
else if (VITE_SITE_NAME === 'v03')
  prefixTitle = 'btc_casino_title_wnsr'
else
  prefixTitle = 'btc_casino_title'

usePageTitle({ prefix: prefixTitle, suffix: 'casino_game', isT: true })

const route = useRoute()
const routeName = computed(() => route.name?.toString())
const { isLogin } = storeToRefs(useAppStore())
const { isMobile } = storeToRefs(useWindowStore())
const casinoStore = useCasinoStore()
const { casinoNav, casinoGameList, currentCasinoNav, firstCasinoNav, sidebarClickTime } = storeToRefs(casinoStore)
const { marqueeData } = storeToRefs(useNoticeStore())

const tebRef = ref()

const showAll = computed(() => currentCasinoNav.value === '-1&all')
const componentList = computed(() => {
  const _c: ComponentItem[] = []
  const _list = casinoNav.value
    ? casinoNav.value
    : [{
        ty: -1,
        cid: '',
        name: '',
        icon: '',
        value: '-1',
        platform_id: '',
        label: '',
      }]
  _list.forEach((item) => {
    /** ty = 1类别 */
    if (item.ty === 1 || item.ty === 5) {
      _c.push({
        cid: item.cid,
        platform_id: item.platform_id,
        name: item.label,
        icon: item.icon,
        value: item.value,
        ty: item.ty,
        component: defineAsyncComponent(
          () => import('~/components/AppCasinoCateList.vue'),
        ),
      })
    }

    else if (item.ty === 2) {
      /**  ty = 2场馆 */
      _c.push({
        cid: item.platform_id,
        platform_id: item.platform_id,
        name: item.label,
        icon: item.icon,
        value: item.value,
        ty: item.ty,
        component: defineAsyncComponent(
          () => import('~/components/AppCasinoCateList.vue'),
        ),
      })
    }
    else if (item.ty === -1) {
      _c.push({
        cid: item.cid,
        platform_id: item.platform_id,
        name: item.label,
        icon: item.icon,
        value: item.value,
        component: defineAsyncComponent(
          () => import('~/components/AppEmptyDiv.vue'),
        ),
      })
    }
    else {
      _c.push({
        cid: item.platform_id,
        platform_id: item.platform_id,
        name: item.label,
        icon: item.icon,
        value: item.value,
        ty: item.ty,
        component: defineAsyncComponent(
          () => import('~/components/AppCasinoCateList.vue'),
        ),
      })
    }
  })

  return _c
})

const currentObject = computed<ComponentItem>(() => {
  const _0 = componentList.value.find((item: any) => item.value === currentCasinoNav.value)
  return _0 as ComponentItem
})

// 统一加载tab中的网络icon
function loadIcon() {
  return new Promise((resolve) => {
    let a = 0
    const t = setInterval(() => {
      a++
      if (casinoNav.value && casinoNav.value.length > 0) {
        clearInterval(t)
        const arr = casinoNav.value.map((a) => {
          return application.loadImage(a.icon)
        })
        Promise.allSettled(arr).then((result) => {
          resolve(result)
        })
      }
      else if (a > 300 || !casinoNav.value) {
        clearInterval(t)
        resolve(true)
      }
    }, 50)
  })
}

function setLobby() {
  currentCasinoNav.value = firstCasinoNav.value
  nextTick(() => {
    tebRef.value?.resetTab('nearest')
  })
}

appEventBus.on(EventBusNames.CASINO_LOBBY_RESET, setLobby)
onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.CASINO_LOBBY_RESET, setLobby)
})

onBeforeRouteLeave(() => {
  window.casinoIndexScrollHeight = document.documentElement.scrollTop
})

watch(sidebarClickTime, (val, old) => {
  if (val > 0) {
    nextTick(() => {
      tebRef.value?.resetTab('nearest')
    })
  }
}, { immediate: true })

onActivated(() => {
  if (sidebarClickTime.value > 0) {
    nextTick(() => {
      tebRef.value?.resetTab('nearest')
    })
  }
})

await application.allSettled([loadIcon()])
</script>

<template>
  <div data-cl="casino-wg" class="casino-wg">
    <div class="layout-spacing">
      <div class="">
        <AppBannerWg type="casino" />
      </div>
      <div v-if="!isMobile" class="tg-mt-24">
        <AppGameSearchWg :key="routeName" game-type="1" is-lobby />
      </div>
      <div v-if="marqueeData && marqueeData.length" class="mx-[3vw] mt-[7px] flex items-center gap-[5px] pl-[2px] @md:mx-[6px] @md:mt-[24px]">
        <BaseImage class="w-[18px]" url="/png/home/icon_dt_pmd.webp" loading="eager" />
        <AppNoticeMarquee class="flex-1" />
        <AppEmailMsg />
      </div>
      <div v-show="casinoNav && casinoNav.length > 0" class="tg-mt-24" :class="{ isMobile }">
        <!-- <BaseTab2Wg
          v-if="isMobile"
          ref="tebRef" v-model="currentCasinoNav"
          :list="casinoNav ?? []"
          :center="false" size="large"
        /> -->
        <BaseTabWg
          ref="tebRef" v-model="currentCasinoNav"
          :list="casinoNav ?? []"
          with-theme
          :center="false" size="large"
        />
      </div>
      <div v-if="isMobile" class="pt-[14px]">
        <AppPrizePool />
      </div>
      <div class="content-wrapper">
        <!-- 大厅 -->
        <div v-show="showAll">
          <template v-for="item in casinoGameList" :key="item.name">
            <AppCasinoLobbyProviderSliderWg
              v-if="item.cid === '5'" :data="item.venue"
              :title="item.name" :icon="item.icon"
            />
            <AppSliderMultiLineWg
              v-else-if="item.nav_games && item.nav_games.length" :total="item.total"
              :icon="item.icon"
              :title="item.name"
              :data="item.nav_games"
              :cid="item.cid"
              :ty="item.ty"
              :pid="item.platform_id"
              :path="item.path"
              use-cloud-img
            />
          </template>
        </div>
        <div v-show="currentObject">
          <KeepAlive>
            <Suspense timeout="0">
              <component
                :is="currentObject.component"
                :cid="currentObject.cid"
                :name="currentObject.name"
                :icon="currentObject.icon"
                :platform-id="currentObject.platform_id"
                :ty="currentObject.ty"
              />
              <template #fallback>
                <AppLoadingWg full-screen />
              </template>
            </Suspense>
          </KeepAlive>
        </div>
      </div>
    </div>
    <!-- <div class="layout-spacing">
      <AppBetDataWg mode="casino" />
    </div> -->
    <!-- 公司介绍 -->
    <!-- <div v-if="!isLogin" class="pb-[32px]">
      <AppCasinoIntroWg has-more />
    </div> -->
  </div>
</template>

<style lang='scss' scoped>
.casino-wg {
  // background: url(/webp/home/bg_pattern_tile.avif);
  background-repeat: repeat;
  background-attachment: fixed;
  @include webTheme('greenblack'){
    --tg-wg-tab-style-color: #bbb;
    --tg-wg-tab-style-line-active-text-color: #26FFBE;
    --tg-wg-tab-style-active-bg: #5A5A5A;
  }
}
.tg-mt-24 {
  margin-top: 24px;
  &.isMobile{
    margin-top: 12px;
  }
}
.list-wrap {
  margin-top: var(--tg-spacing-10);

  .title {
    font-size: var(--tg-font-size-base);
    color: var(--tg-text-white);
    margin-bottom: var(--tg-spacing-10);
    display: flex;
    align-items: center;

    &:hover {
      --tg-icon-color: var(--tg-text-white);
    }

    span {
      font-size: var(--tg-font-size-md);
      font-weight: var(--tg-font-weight-semibold);
      margin-left: var(--tg-spacing-8);
      line-height: 1.5;
    }
  }

  .more {
    margin-top: var(--tg-spacing-24);
    display: flex;
    justify-content: center;
  }
}
</style>
