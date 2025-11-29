<script setup lang='ts'>
import { AfunBaseButton } from '@tg/bccomponents'
import { type IOriginalGameDetail, SendFlutterAppMessage } from '@tg/types'
import { isFlutterApp, sendMsgToFlutterApp } from '@tg/utils'
import { GAMES_LIST_ENUM } from 'feie-ui'
import { computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppMiniGamePartBaseData from './AppMiniGamePartBaseData.vue'
import AppMiniGamePartMinesGameResultComponents from './AppMiniGamePartMinesGameResultComponents.vue'
import AppMiniGamePartSeedInfo from './AppMiniGamePartSeedInfo.vue'

interface Props {
  data: IOriginalGameDetail
}
defineOptions({
  name: 'AppMiniGamePartMinesGameResult',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { push } = useRouter()

const multiplier = computed(() => props.data.payout_multiplier)
/** 炸弹的位置 */
const mines = computed<number[]>(() => JSON.parse(props.data.result || '{}'))
/** 用户打开的位置 */
const openByPlayerList = computed(() => props.data.pxark.split(',').map(a => +a))

const seedInfoData = computed(() => {
  return {
    serverSeed: props.data.server_seed,
    serverSeedHash: props.data.server_seed_hash,
    clientSeed: props.data.client_seed,
    nonce: props.data.nonce,
    mines: mines.value.length,
  }
})

// 前往游戏
function openCasinoGame() {
  closeDialog()
  if (isFlutterApp()) {
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_GAME, 'mines')
    return
  }

  push(`/original-game/${GAMES_LIST_ENUM.MINES}`)
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
      <div class="w-full">
        <AppMiniGamePartMinesGameResultComponents :mines="mines" :open-by-player-list="openByPlayerList" />
      </div>

      <!-- 前往游戏 -->
      <AfunBaseButton class="theme-btn mx-auto block capitalize shadow-[0_1px_2px_0_rgba(0,0,0,0.25)]" type="default" style="--afun-base-button-font-size:14px" @click="openCasinoGame">
        {{ t('前往', { app_name: 'Mines' }) }}
      </AfunBaseButton>
    </div>
    <!-- 种子信息 -->
    <AppMiniGamePartSeedInfo :game="GAMES_LIST_ENUM.MINES" :data="seedInfoData" />
  </div>
</template>

<style lang='scss' scoped>
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: 16px;
  }
}
</style>
