<script setup lang='ts'>
import { PhBaseButton } from '@tg/bccomponents'
import { type IOriginalGameDetail, SendFlutterAppMessage } from '@tg/types'
import { isFlutterApp, sendMsgToFlutterApp } from '@tg/utils'
import { GAMES_LIST_ENUM } from 'feie-ui'
import { computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppMiniGamePartBaseData from './AppMiniGamePartBaseData.vue'
import AppMiniGamePartSeedInfo from './AppMiniGamePartSeedInfo.vue'

interface Props {
  data: IOriginalGameDetail
}
defineOptions({
  name: 'AppMiniGamePartLimboGameResult',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { push } = useRouter()

const limboResult = computed(() => JSON.parse(props.data.bet_detail).result)
const multiplier = computed(() => props.data.payout_multiplier)
const multiplier_target = computed(() => JSON.parse(props.data.bet_detail).multiplier_target)
const isWill = computed(() => {
  if (+limboResult.value > +multiplier_target.value)
    return true
  else return false
})

const seedInfoData = computed(() => {
  return {
    serverSeed: props.data.server_seed,
    serverSeedHash: props.data.server_seed_hash,
    clientSeed: props.data.client_seed,
    nonce: props.data.nonce,
    risk: props.data.bet_type.split(',')[1],
    row: props.data.bet_type.split(',')[0],
  }
})

// 前往游戏
function openCasinoGame() {
  closeDialog()
  if (isFlutterApp()) {
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_GAME, 'limbo')
    return
  }

  push(`/original-game/${GAMES_LIST_ENUM.LIMBO}`)
}
</script>

<template>
  <div class="w-full">
    <div class="gap-[16rem] box w-full flex flex-col px-[16rem] pb-[16rem]">
      <AppMiniGamePartBaseData
        :bet-amount="data.bet_amount"
        :settle-amount="data.settle_amount"
        :currency-id="data.currency_id"
        :multiplier="multiplier"
      />
      <!-- 🎮 游戏特有数据 🎮 -->
      <div class="text-[#6D7693] w-full text-center text-[14rem] font-[400] flex flex-col items-center">
        <span class="mb-[4rem] inline-block h-[21rem]">{{ t('目标') }}</span>
        <span class="text-[#0D2245] text-[18rem] font-[500]">{{ parseFloat(multiplier_target) }} ×</span>
        <span class="mt-[14rem] inline-block h-[21rem]">{{ t('结果') }}</span>
        <span class="text-[18rem] font-[500]" :class="[isWill ? 'win' : 'loss']">{{ limboResult }} ×</span>
      </div>

      <!-- 前往游戏 -->
      <PhBaseButton class="theme-btn mx-auto block capitalize shadow-[0_1px_2px_0_rgba(0,0,0,0.25)]" style="--ph-base-button-font-size:14rem" @click="openCasinoGame">
        {{ t('前往', { app_name: 'Limbo' }) }}
      </PhBaseButton>
    </div>
    <!-- 种子信息 -->
    <AppMiniGamePartSeedInfo :game="GAMES_LIST_ENUM.LIMBO" :data="seedInfoData" />
  </div>
</template>

<style lang='scss' scoped>
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: 16rem;
  }
}
.loss {
  color: #ed4163;
}
.win {
  color: #00e701;
}
</style>
