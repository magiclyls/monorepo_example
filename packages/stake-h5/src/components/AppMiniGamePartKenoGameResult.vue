<script setup lang='ts'>
import { GAMES_LIST_ENUM } from 'feie-ui'
import type { IOriginalGameDetail } from '@tg/types'

interface Props {
  data: IOriginalGameDetail
}
defineOptions({
  name: 'AppMiniGamePartKenoGameResult',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { push } = useLocalRouter()
const { rightIsExpand, closeRightSidebar } = useRightSidebar()
const { isMobile } = storeToRefs(useWindowStore())

const multiplier = computed(() => props.data.payout_multiplier)
const betDetail = computed<{
  drawn_numbers: number[]
  selected_numbers: number[]
  risk: string
}>(() => JSON.parse(props.data.bet_detail))

const risk = computed(() => {
  const arr = [
    { label: t('keno_risk_classic'), value: 'classic' },
    { label: t('keno_risk_low'), value: 'low' },
    { label: t('keno_risk_medium'), value: 'medium' },
    { label: t('keno_risk_high'), value: 'high' },
  ]
  return arr.find(a => a.value === betDetail.value.risk)?.label ?? ''
})

const seedInfoData = computed(() => {
  return {
    serverSeed: props.data.server_seed,
    serverSeedHash: props.data.server_seed_hash,
    clientSeed: props.data.client_seed,
    nonce: props.data.nonce,
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
  push(`/casino/original-game/${GAMES_LIST_ENUM.KENO}`)
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
        <AppMiniGamePartKenoGameResultComponents :drawn-numbers="betDetail.drawn_numbers" :selected-numbers="betDetail.selected_numbers" />
        <BaseLabel :label="t('plinko_risk')">
          <BaseInput v-model="risk" readonly />
        </BaseLabel>
      </div>

      <!-- 前往游戏 -->
      <BaseButton v-if="!isAdmin()" class="theme-btn mx-auto block capitalize" size="md" bg-style="secondary" shadow @click="openCasinoGame">
        {{ t('go_to', { app_name: 'Keno' }) }}
      </BaseButton>
    </div>
    <!-- 种子信息 -->
    <AppMiniGamePartSeedInfo v-if="!isAdmin()" :game="GAMES_LIST_ENUM.KENO" :data="seedInfoData" />
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
