<script setup lang='ts'>
import { IconSptBasketball, IconSptVSports, IconSptUserBet, IconUniFavorites } from '@tg/icons';

defineOptions({
  name: 'KeepAliveSports',
})
const props = defineProps<{ platId: string }>()

// setTimeout(() => {
//   document.querySelector('#TgMainContent')?.scrollTo({ top: -50, left: 0 })
// }, 0)

const { t } = useI18n()
usePageTitle({ prefix: t('page_title_sport'), suffix: t('online_casino') })
const { isMobile } = storeToRefs(useWindowStore())
const { isLogin, theme } = storeToRefs(useAppStore())
const sportsStore = useSportsStore()
const { currentProvider, providerList, isSportsLoginSusses } = storeToRefs(sportsStore)
const { bool: isFirst } = useBoolean(true)

const marketType = ref(Session.get<string>(STORAGE_SPORTS_LIVE_NAV)?.value ?? 'all')
const tabList = computed(() => [
  { label: t('sports_tab_lobby'), value: 'all', icon: IconSptBasketball },
  {
    label: t('v_sports'),
    value: 'v-sports',
    icon: IconSptVSports,
  },
  {
    label: t('sports_header_my_bets'),
    value: 'my-bet',
    icon: IconSptUserBet,
    disabled: !isLogin.value || !isSportsLoginSusses.value,
  },
  {
    label: t('h5_sports_top_tab_list_favorites'),
    value: 'fav',
    icon: IconUniFavorites,
    disabled: !isLogin.value || !isSportsLoginSusses.value,
  },
])

function setLobby() {
  marketType.value = 'all'
}
function onTabChange() {
  isFirst.value = false
  Session.set(STORAGE_SPORTS_LIVE_NAV, unref(marketType))
}

sportsStore.changeProvider(props.platId)
appEventBus.on(EventBusNames.SPORTS_LOBBY_RESET, setLobby)

onMounted(() => {
  Session.set(STORAGE_SPORTS_LIVE_NAV, unref(marketType))
})
onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.SPORTS_LOBBY_RESET, setLobby)
  Session.remove(STORAGE_SPORTS_LIVE_NAV)
})
</script>

<template>
  <div class="sports sports-layout-home">
    <div class="w-full flex flex-col pb-[1px] @md:pb-[12px]">
      <!-- <AppSportsRecommendEventBanner /> -->
      <AppBannerNewDefault v-if="theme === 'new-default'" type="sports" />
      <div v-else-if="theme === 'white'" class="mt-[12px]">
        <AppBannerWhite type="sports" />
      </div>
      <AppBanner v-else type="sports" />
      <!-- <AppMarquee /> -->
      <div v-if="!isMobile" class="tg-mt-24">
        <AppGameSearch game-type="2" />
      </div>
      <AppSportsProviderSlider v-if="providerList.length > 1" v-model="currentProvider" :list="providerList"
        @change="sportsStore.changeProvider" />
      <div class="mt-[11px] @md:mt-[12px]">
        <BaseTab v-model="marketType" size="large" :list="tabList" :center="false" with-icon @change="onTabChange" />
      </div>
    </div>

    <AppSportsLobby v-if="isFirst" :market-type="marketType" />
    <template v-else>
      <Suspense timeout="0">
        <AppSportsLobby :key="marketType" :market-type="marketType" />
        <template #fallback>
          <AppLoading full-screen />
        </template>
      </Suspense>
    </template>

    <!-- <div v-show="marketType !== 'my-bet'" class="layout-spacing">
      <AppBetData mode="sports" :is-casino-mine="false" />
    </div> -->
    <!-- <AppSportsIntroduction /> -->
  </div>
</template>

<style lang='scss' scoped>
.tg-mt-12 {
  margin-top: 12px;
}

.base-tab {
  @include webTheme('white') {
    --tg-tab-style-wrap-bg-color: #f5f5f5;
  }
}
</style>

<route lang="yaml">
name: sports-home-tg
meta:
  layout: home
  showHomeHeader: true
</route>
