<script setup lang="ts">
import { GAMES_LIST_ENUM } from 'feie-ui'
import type { IOriginalGameDetail } from '@tg/types'

interface Props {
  data: IOriginalGameDetail
}
defineOptions({
  name: 'AppMiniGamePartWheelGameResult',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { isMobile } = storeToRefs(useWindowStore())
const { push } = useLocalRouter()
const { rightIsExpand, closeRightSidebar } = useRightSidebar()
const multiplier = computed(() => props.data.payout_multiplier)
const risk = computed<string>(() => JSON.parse(props.data.bet_detail).risk)
const segments = computed<number>(() => JSON.parse(props.data.bet_detail).segments)
const result = computed<number>(() => JSON.parse(props.data.bet_detail).result)
const seedInfoData = computed(() => {
  return {
    serverSeed: props.data.server_seed,
    serverSeedHash: props.data.server_seed_hash,
    clientSeed: props.data.client_seed,
    nonce: props.data.nonce,
    risk: risk.value,
    segments: segments.value,
  }
})

// 前往游戏
function openCasinoGame() {
  if (isMobile.value) {
    setTimeout(() => {
      rightIsExpand.value && closeRightSidebar()
    }, 50)
  }
  closeDialog()
  push(`/casino/original-game/${GAMES_LIST_ENUM.WHEEI}`)
}
</script>

<template>
  <div class="w-full">
    <div class="box flex-col-16 w-full flex flex-col px-[16px] pb-[16px]">
      <AppMiniGamePartBaseData
        :bet-amount="data.bet_amount"
        :settle-amount="data.settle_amount"
        :currency-id="data.currency_id"
        :multiplier="multiplier"
      />
      <!-- 🎮 游戏特有数据 🎮 -->
      <div class="w-full">
        <AppMiniGamePartWheelResultComponent
          :key="result" :result="result" :risk="risk" :segments="segments" :bet-amount="data.bet_amount"
          :currency-id="data.currency_id"
        />
      </div>

      <!-- 前往游戏 -->
      <BaseButton v-if="!isAdmin()" class="theme-btn mx-auto block capitalize" size="md" bg-style="secondary" shadow @click="openCasinoGame">
        {{ t('go_to', { app_name: GAMES_LIST_ENUM.WHEEI }) }}
      </BaseButton>
    </div>
    <!-- 种子信息 -->
    <AppMiniGamePartSeedInfo v-if="!isAdmin()" :game="GAMES_LIST_ENUM.WHEEI" :data="seedInfoData" />
  </div>
</template>

<style lang='scss' scoped>
.theme-btn{
  @include webTheme('white'){
    box-shadow: none;
  }
}
.flex-col-16{
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
.box {
  @include webTheme('green') {
    --tg-base-button-secondary-bg: #197B59;
    --tg-secondary-text-color-theme-green:#fff;
  }
}
</style>
