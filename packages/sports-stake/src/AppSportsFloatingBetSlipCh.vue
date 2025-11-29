<script setup lang='ts'>
import { useBoolean } from '@tg/hooks'
import { IconSptUserBet } from '@tg/icons'
import { useSportsStore } from '@tg/stores'
import { EnumSportsEventType, EventBusNames } from '@tg/types'
import { appEventBus } from '@tg/utils'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppSportsFloatingBetCh from './components/AppSportsFloatingBetCh.vue'

const sportStore = useSportsStore()
const { t } = useI18n()
/** 购物车数据 */
const cartDataList = computed(() => sportStore.cart.dataList)
const betCount = computed(() => sportStore.cart.count)
const { bool: showBall, setBool: setShowBall } = useBoolean(true)
/** 是否展示单式浮窗 */
const isSingle = computed(() => EnumSportsEventType.CHUAN !== sportStore.lobbyCurrentEventType && cartDataList.value.length > 0)
/** 是否展示复式悬浮球 */
const isShowBall = computed(() => showBall.value && EnumSportsEventType.CHUAN === sportStore.lobbyCurrentEventType && cartDataList.value.length > 0)
const isShowMulti = computed(() => !showBall.value && EnumSportsEventType.CHUAN === sportStore.lobbyCurrentEventType && cartDataList.value.length > 0)

function clickBall() {
  if (betCount.value > 1)
    setShowBall(false)
  else
    appEventBus.emit(EventBusNames.APP_GLOBAL_MESSAGE, { content: t('至少选择2场比赛'), type: 'info' })
}

watch(() => sportStore.lobbyCurrentEventType, (newVal) => {
  if (newVal !== EnumSportsEventType.CHUAN)
    sportStore.cart.removeAll()
})
watch(betCount, () => {
  if (betCount.value === 0)
    setShowBall(true)
})
</script>

<template>
  <!-- 一个蓝色的球 -->
  <div
    v-if="isShowBall" style="color:var(--ss-spt-floating-bet-slip-ch-color1);"
    class="fixed bottom-[96rem] left-[50%] h-[54rem] w-[54rem] flex translate-x-[-50%] items-center justify-center rounded-[50%] bg-[var(--ss-spt-floating-bet-slip-ch-bg1)] text-[26rem]"
    @click="clickBall"
  >
    <IconSptUserBet style="color:var(--ss-spt-floating-bet-slip-ch-color1)" />
    <span class="absolute right-[8rem] top-[27rem] rounded-full bg-[var(--ss-spt-floating-bet-slip-ch-bg1)] leading-[15rem] text-[15rem] text-[var(--ss-spt-floating-bet-slip-ch-color1)]">串</span>
    <div
      v-show="betCount > 0" :class="betCount < 10 ? 'right-[-5rem]' : 'right-[-13rem]'"
      class="absolute top-0 rounded-[50rem] bg-[var(--ss-spt-floating-bet-slip-ch-bg2)] px-[7rem] text-[12rem] font-semibold leading-[19rem] text-[var(--ss-spt-floating-bet-slip-ch-color2)]"
    >
      {{ betCount }}
    </div>
  </div>
  <!-- 中文注单浮窗 -->
  <AppSportsFloatingBetCh v-else-if="(isSingle || isShowMulti)" @change-ballshow="(val) => setShowBall(val)" />
</template>
