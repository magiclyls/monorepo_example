<script setup lang='ts'>
import { AfunBaseButton, AfunBaseInput } from '@tg/bccomponents'
import { IconUniClose, IconUniPersent, IconUniRefresh } from '@tg/icons'
import { type IOriginalGameDetail, SendFlutterAppMessage } from '@tg/types'
import { isFlutterApp, sendMsgToFlutterApp, toFixed } from '@tg/utils'
import { GAMES_LIST_ENUM } from 'feie-ui'
import { computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppMiniGamePartBaseData from './AppMiniGamePartBaseData.vue'
import AppMiniGamePartDiceResultComponent from './AppMiniGamePartDiceResultComponent.vue'
import AppMiniGamePartSeedInfo from './AppMiniGamePartSeedInfo.vue'

interface Props {
  data: IOriginalGameDetail
}
defineOptions({
  name: 'AppMiniGamePartDiceGameResult',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { push } = useRouter()

const bet_detail = JSON.parse(props.data.bet_detail)
const condition = bet_detail.condition
const target = Number.parseFloat(bet_detail.target)
const result = +bet_detail.result
const settleMultiplier = props.data.payout_multiplier
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
  closeDialog()
  if (isFlutterApp()) {
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_GAME, 'dice')
    return
  }

  push(`/original-game/${GAMES_LIST_ENUM.DICE}`)
}

// 下面三个参数 乘数、掷大于、获胜几率
const multiplier: string = bet_detail.payout_multiplier
const roll_over: string = toFixed(Number(bet_detail.target), 2)
const win_chance: string = bet_detail.win_chance
</script>

<template>
  <div class="w-full">
    <div class="box gap-[16px] w-full flex flex-col px-[16px] pb-[16px]">
      <AppMiniGamePartBaseData
        :bet-amount="data.bet_amount"
        :settle-amount="data.settle_amount"
        :currency-id="data.currency_id"
        :multiplier="settleMultiplier"
      />
      <!-- 🎮 游戏特有数据 🎮 -->
      <div class="w-full flex content-center justify-around">
        <AppMiniGamePartDiceResultComponent :condition="condition" :target="target" :result="result" />
      </div>
      <!-- 结果展示 -->
      <div class="bg-[#213743] mt-[-16px] flex justify-around rounded-[4px] flex-col gap-[7px] p-[16px]">
        <div class="w-full">
          <p class="text-[#b1bad3] font-[600]">
            {{ t('乘数') }}
          </p>
          <AfunBaseInput
            v-model="multiplier"
            style="--afun-base-input-background-color: #F6F7F8; --afun-base-input-color: #fff; --afun-base-input-font-weight: 500; --afun-base-input-font-size: 13px; --afun-base-input-border-color: transparent; --afun-base-input-padding-y: 9px"
            readonly
          >
            <template #right>
              <IconUniClose class="text-[#b1bad3] text-[14px] " />
            </template>
          </AfunBaseInput>
        </div>
        <div class="w-full">
          <p class="text-[#b1bad3] font-[600]">
            {{ t('掷大于') }}
          </p>
          <AfunBaseInput
            v-model="roll_over"
            style="--afun-base-input-background-color: #F6F7F8; --afun-base-input-color: #fff; --afun-base-input-font-weight: 500; --afun-base-input-font-size: 13px; --afun-base-input-border-color: transparent; --afun-base-input-padding-y: 9px"
            readonly
          >
            <template #right>
              <IconUniRefresh class="text-[#b1bad3] text-[14px]" />
            </template>
          </AfunBaseInput>
        </div>
        <div class="w-full">
          <p class="text-[#b1bad3] font-[600]">
            {{ t('获胜机率') }}
          </p>
          <AfunBaseInput
            v-model="win_chance"
            style="--afun-base-input-background-color: #F6F7F8; --afun-base-input-color: #fff; --afun-base-input-font-weight: 500; --afun-base-input-font-size: 13px; --afun-base-input-border-color: transparent; --afun-base-input-padding-y: 9px"
            readonly
          >
            <template #right>
              <IconUniPersent class="text-[#b1bad3] text-[14px] " />
            </template>
          </AfunBaseInput>
        </div>
      </div>
      <!-- 前往游戏 -->
      <AfunBaseButton class="theme-btn mx-auto block capitalize shadow-[0_1px_2px_0_rgba(0,0,0,0.25)]" type="default" style="--afun-base-button-font-size:14px" @click="openCasinoGame">
        {{ t('前往', { app_name: 'Dice' }) }}
      </AfunBaseButton>
    </div>
    <!-- 种子信息 -->
    <AppMiniGamePartSeedInfo :game="GAMES_LIST_ENUM.DICE" :data="seedInfoData" />
  </div>
</template>

<style lang='scss' scoped>
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: 16px;
  }
}
</style>
