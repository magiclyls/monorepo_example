<script setup lang="ts">
import { PhBaseButton } from '@tg/bccomponents'
import { type IOriginalGameDetail, SendFlutterAppMessage } from '@tg/types'
import { isFlutterApp, sendMsgToFlutterApp } from '@tg/utils'
import { GAMES_LIST_ENUM } from 'feie-ui'
import { computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppMiniGamePartBaseData from './AppMiniGamePartBaseData.vue'
import AppMiniGamePartSeedInfo from './AppMiniGamePartSeedInfo.vue'
import AppMiniGamePartWheelResultComponent from './AppMiniGamePartWheelResultComponent.vue'

interface Props {
  data: IOriginalGameDetail
}
defineOptions({
  name: 'AppMiniGamePartWheelGameResult',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { push } = useRouter()
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
  closeDialog()
  if (isFlutterApp()) {
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_GAME, 'wheel')
    return
  }

  push(`/original-game/${GAMES_LIST_ENUM.WHEEI}`)
}
</script>

<template>
  <div class="w-full">
    <div class="box gap-[16rem] w-full flex flex-col px-[16rem] pb-[16rem]">
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
      <PhBaseButton class="theme-btn mx-auto block capitalize shadow-[0_1px_2px_0_rgba(0,0,0,0.25)]" style="--ph-base-button-font-size:14rem" @click="openCasinoGame">
        {{ t('前往', { app_name: GAMES_LIST_ENUM.WHEEI }) }}
      </PhBaseButton>
    </div>
    <!-- 种子信息 -->
    <AppMiniGamePartSeedInfo :game="GAMES_LIST_ENUM.WHEEI" :data="seedInfoData" />
  </div>
</template>

<style lang='scss' scoped>
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: 16rem;
  }
}
</style>
