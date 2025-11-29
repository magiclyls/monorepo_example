<script setup lang="ts">
import { SSAppLoading, SSBaseTabs } from '@tg/bccomponents'
import { IconSptBasketball, IconSptUserBet, IconSptVSports, IconUniFavorites } from '@tg/icons'
import { useAppStore, useSportsStore } from '@tg/stores'
import { EventBusNames } from '@tg/types'
import { appEventBus, Session, STORAGE_SPORTS_LIVE_NAV } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, unref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSportsConfig } from '../config/index'
import AppSportsHomeMarketTypeTabs from './components/AppSportsHomeMarketTypeTabs.vue'
import AppSportsLobby from './components/AppSportsLobby.vue'

defineOptions({ name: 'StakeSportsHome' })

const sportsStore = useSportsStore()
const { isSportsLoginSusses, marketType, isLobbyLoadFirst } = storeToRefs(sportsStore)
const { projectName } = useSportsConfig()
const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())

const list = computed(() => [
  {
    label: t('大厅'),
    value: 'all',
    icon: IconSptBasketball,
  },
  {
    label: t('虚拟体育'),
    value: 'v-sports',
    icon: IconSptVSports,
  },
  {
    label: t('我的投注'),
    value: 'my-bet',
    icon: IconSptUserBet,
    disabled: !isLogin.value || !isSportsLoginSusses.value,
  },
  {
    label: t('收藏夹'),
    value: 'fav',
    icon: IconUniFavorites,
    disabled: !isLogin.value || !isSportsLoginSusses.value,
  },
])
// queen项目
const isQueenH5 = computed(() => projectName === 'ph-h5')
// Afun项目
const isAfunH5 = computed(() => projectName === 'afun-h5')

function setLobby() {
  marketType.value = 'all'
}
function onTabChange() {
  isLobbyLoadFirst.value = false
  Session.set(STORAGE_SPORTS_LIVE_NAV, unref(marketType))
}

onMounted(() => {
  appEventBus.on(EventBusNames.SPORTS_LOBBY_RESET, setLobby)
  Session.set(STORAGE_SPORTS_LIVE_NAV, unref(marketType))
})
onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.SPORTS_LOBBY_RESET, setLobby)
  Session.remove(STORAGE_SPORTS_LIVE_NAV)
})
</script>

<template>
  <div>
    <AppSportsHomeMarketTypeTabs v-if="isQueenH5" />
    <slot name="banner" />
    <SSBaseTabs v-if="isAfunH5" v-model="marketType" class="mt-[11rem]" :list="list" @change="onTabChange" />
    <AppSportsLobby v-if="isLobbyLoadFirst" :market-type="marketType" />
    <template v-else>
      <Suspense timeout="0">
        <AppSportsLobby :key="marketType" :market-type="marketType" />
        <template #fallback>
          <SSAppLoading :project-name="projectName" full-screen />
        </template>
      </Suspense>
    </template>
  </div>
</template>

<style scoped lang="scss"></style>
