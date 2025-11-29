<script setup lang='ts'>
import { IconSptUserBet } from '@tg/icons'

const sportStore = useSportsStore()
const { openToast } = useToast()
const { isMobile } = storeToRefs(useWindowStore())
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
    openToast({ message: '至少选择2场比赛' })
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
    v-if="isMobile && isShowBall" style="--tg-icon-color:#fff;"
    class="fixed bottom-[96px] left-[50%] h-[54px] w-[54px] flex translate-x-[-50%] items-center justify-center rounded-[100px] bg-[var(--app-sports-floating-bet-slip-ch-ball-bg)] text-[26px]"
    @click="clickBall"
  >
    <IconSptUserBet name="spt-user-bet" style="color:var(--app-sports-floating-bet-slip-ch-text-ball)" />
    <span class="absolute right-[8px] top-[27px] rounded-full bg-[var(--app-sports-floating-bet-slip-ch-ball-bg)] text-[15px] text-[var(--app-sports-floating-bet-slip-ch-text-ball)]">串</span>
    <div
      v-show="betCount > 0" :class="betCount < 10 ? 'right-[-5px]' : 'right-[-13px]'"
      class="absolute top-0 rounded-[50px] bg-[#E91134] px-[7px] text-[12px] font-semibold leading-[19px] text-white"
    >
      {{ betCount }}
    </div>
  </div>
  <!-- 中文注单浮窗 -->
  <AppSportsFloatingBetCh v-else-if="isMobile && (isSingle || isShowMulti)" @change-ballshow="(val) => setShowBall(val)" />
  <!-- PC版 -->
  <AppSportsFloatingBetCh v-else-if="!isMobile" @change-ballshow="(val) => setShowBall(val)" />
</template>

<style>
:root {
  --app-sports-floating-bet-slip-ch-text-ball: #fff;
  --app-sports-floating-bet-slip-ch-ball-bg: #3673da;
}

[theme="green"] {
  --app-sports-floating-bet-slip-ch-ball-bg: #F6D14A;
  --app-sports-floating-bet-slip-ch-text-ball: #055434;
}

[theme="white"] {
  --app-sports-floating-bet-slip-ch-text-ball: #000;
  --app-sports-floating-bet-slip-ch-ball-bg: #eccb6e;
}
</style>
