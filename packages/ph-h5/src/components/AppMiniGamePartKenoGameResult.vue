<script setup lang='ts'>
import { PhBaseButton, PhBaseInput } from '@tg/bccomponents'
import PhBaseLabel from '@tg/bccomponents/src/ph/PhBaseLabel.vue'
import { type IOriginalGameDetail, SendFlutterAppMessage } from '@tg/types'
import { isFlutterApp, sendMsgToFlutterApp } from '@tg/utils'
import { GAMES_LIST_ENUM } from 'feie-ui'
import { computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppMiniGamePartBaseData from './AppMiniGamePartBaseData.vue'
import AppMiniGamePartKenoGameResultComponents from './AppMiniGamePartKenoGameResultComponents.vue'
import AppMiniGamePartSeedInfo from './AppMiniGamePartSeedInfo.vue'

interface Props {
  data: IOriginalGameDetail
}
defineOptions({
  name: 'AppMiniGamePartKenoGameResult',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { push } = useRouter()

const multiplier = computed(() => props.data.payout_multiplier)
const betDetail = computed<{
  drawn_numbers: number[]
  selected_numbers: number[]
  risk: string
}>(() => JSON.parse(props.data.bet_detail))

const risk = computed(() => {
  const arr = [
    { label: t('典型'), value: 'classic' },
    { label: t('低等'), value: 'low' },
    { label: t('中等'), value: 'medium' },
    { label: t('高等'), value: 'high' },
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
  closeDialog()
  if (isFlutterApp()) {
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_GAME, 'keno')
    return
  }

  push(`/original-game/${GAMES_LIST_ENUM.KENO}`)
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
        <AppMiniGamePartKenoGameResultComponents :drawn-numbers="betDetail.drawn_numbers" :selected-numbers="betDetail.selected_numbers" />
        <PhBaseLabel :label="t('风险')" style="--ph-base-label-margin-bottom: 3rem; --ph-base-label-font-weight: 500">
          <PhBaseInput v-model="risk" readonly style="--ph-base-input-background-color: #EBEBEB; --ph-base-input-color: #0D2245; --ph-base-input-font-weight: 500; --ph-base-input-font-size: 13rem; --ph-base-input-border-color: transparent; --ph-base-input-padding-y: 9rem" />
        </PhBaseLabel>
      </div>

      <!-- 前往游戏 -->
      <PhBaseButton class="theme-btn mx-auto block capitalize shadow-[0_1px_2px_0_rgba(0,0,0,0.25)]" style="--ph-base-button-font-size:14rem" @click="openCasinoGame">
        {{ t('前往', { app_name: 'Keno' }) }}
      </PhBaseButton>
    </div>
    <!-- 种子信息 -->
    <AppMiniGamePartSeedInfo :game="GAMES_LIST_ENUM.KENO" :data="seedInfoData" />
  </div>
</template>

<style lang='scss' scoped>
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: 16rem;
  }
}
</style>
