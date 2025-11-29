<script setup lang='ts'>
import { AfunBaseButton } from '@tg/bccomponents'
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
    <div class="gap-[16px] box w-full flex flex-col px-[16px] pb-[16px]">
      <AppMiniGamePartBaseData
        :bet-amount="data.bet_amount"
        :settle-amount="data.settle_amount"
        :currency-id="data.currency_id"
        :multiplier="multiplier"
      />
      <!-- 🎮 游戏特有数据 🎮 -->
      <div class="text-[##b1bad3] w-full text-center text-[14px] font-[400] flex flex-col items-center">
        <span class="mb-[4px] inline-block h-[21px]">{{ t('目标') }}</span>
        <span class="text-[#fff] text-[18px] font-[600]">{{ parseFloat(multiplier_target) }} ×</span>
        <span class="mt-[14px] inline-block h-[21px]">{{ t('结果') }}</span>
        <span class="text-[18px] font-[600]" :class="[isWill ? 'win' : 'loss']">{{ limboResult }} ×</span>
      </div>

      <!-- 前往游戏 -->
      <AfunBaseButton class="theme-btn mx-auto block capitalize shadow-[0_1px_2px_0_rgba(0,0,0,0.25)]" type="default" style="--afun-base-button-font-size:14px" @click="openCasinoGame">
        {{ t('前往', { app_name: 'Limbo' }) }}
      </AfunBaseButton>
    </div>
    <!-- 种子信息 -->
    <AppMiniGamePartSeedInfo :game="GAMES_LIST_ENUM.LIMBO" :data="seedInfoData" />
  </div>
</template>

<style lang='scss' scoped>
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: 16px;
  }
}
.loss {
  color: #ed4163;
}
.win {
  color: #24ee89;
}
</style>
