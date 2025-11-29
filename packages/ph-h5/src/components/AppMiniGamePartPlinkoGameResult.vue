<script setup lang='ts'>
import { PhBaseButton, PhBaseInput, PhBaseLabel } from '@tg/bccomponents'
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
  name: 'AppMiniGamePartPlinkoGameResult',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { push } = useRouter()

const plinkoIndex = computed(() => +props.data.result.split(',')[0])
const plinkoResult = computed(() => props.data.result.split(',')[1])
const risk = computed(() => props.data.bet_type.split(',')[1])
const plinkoRisk = computed(() => {
  const obj: { [k: string]: string } = {
    low: t('低等'),
    middle: t('中等'),
    high: t('高等'),
  }
  return obj[risk.value]
})
const plinkoRow = computed(() => props.data.bet_type.split(',')[0])
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
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_GAME, 'plinko')
    return
  }

  push(`/original-game/${GAMES_LIST_ENUM.PLINKO}`)
}
</script>

<template>
  <div class="w-full">
    <div class="box gap-[16rem] w-full flex flex-col px-[16rem] pb-[16rem]">
      <AppMiniGamePartBaseData
        :bet-amount="data.bet_amount"
        :settle-amount="data.settle_amount"
        :currency-id="data.currency_id"
        :multiplier="plinkoResult"
      />
      <!-- 🎮 游戏特有数据 🎮 -->
      <div class="w-full">
        <ResultPlinko
          class="mx-auto mb-[16rem] rounded-[4rem] w-[48rem] text-center h-[40rem] bg-[#FA6020]! shadow-[0_3px_0_0_#A80000]!" :index="plinkoIndex"
          :result="(+plinkoResult).toFixed(1).toString()"
          :row="plinkoRow"
        />
        <PhBaseLabel :label="t('风险')" style="--ph-base-label-margin-bottom: 3rem; --ph-base-label-font-weight: 500">
          <PhBaseInput
            v-model="plinkoRisk" readonly
            style="--ph-base-input-background-color: #EBEBEB; --ph-base-input-color: #0D2245; --ph-base-input-font-weight: 500; --ph-base-input-font-size: 13rem; --ph-base-input-border-color: transparent; --ph-base-input-padding-y: 9rem"
          />
        </PhBaseLabel>
        <PhBaseLabel class="mt-[13rem]" :label="t('排数')" style="--ph-base-label-margin-bottom: 3rem; --ph-base-label-font-weight: 500">
          <PhBaseInput
            v-model="plinkoRow" readonly
            style="--ph-base-input-background-color: #EBEBEB; --ph-base-input-color: #0D2245; --ph-base-input-font-weight: 500; --ph-base-input-font-size: 13rem; --ph-base-input-border-color: transparent; --ph-base-input-padding-y: 9rem"
          />
        </PhBaseLabel>
      </div>

      <!-- 前往游戏 -->
      <PhBaseButton class="theme-btn mx-auto block capitalize shadow-[0_1px_2px_0_rgba(0,0,0,0.25)]" style="--ph-base-button-font-size:14rem" @click="openCasinoGame">
        {{ t('前往', { app_name: 'Plinko' }) }}
      </PhBaseButton>
    </div>
    <!-- 种子信息 -->
    <AppMiniGamePartSeedInfo :game="GAMES_LIST_ENUM.PLINKO" :data="seedInfoData" />
  </div>
</template>

<style lang='scss' scoped>
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: 16rem;
  }
}
:deep(.score-span) {
  font-size: 10rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 40rem;
  font-weight: 700;
}
</style>
