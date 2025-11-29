<script setup lang='ts'>
import { AfunBaseButton } from '@tg/bccomponents'
import { type IOriginalGameDetail, SendFlutterAppMessage } from '@tg/types'
import { isFlutterApp, sendMsgToFlutterApp } from '@tg/utils'
import { GAMES_LIST_ENUM } from 'feie-ui'
import { computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppMiniGamePartBaseData from './AppMiniGamePartBaseData.vue'
import AppMiniGamePartDragontowerResultComponent from './AppMiniGamePartDragontowerResultComponent.vue'
import AppMiniGamePartSeedInfo from './AppMiniGamePartSeedInfo.vue'

interface Props {
  data: IOriginalGameDetail
}
defineOptions({
  name: 'AppMiniGamePartDragontowerGameResult',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { push } = useRouter()

const Result = computed(() => JSON.parse(props.data.bet_detail))
const multiplier = computed(() => props.data.payout_multiplier)

const seedInfoData = computed(() => {
  console.log('props.data:', props.data)
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
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_GAME, 'dragontower')
    return
  }

  push(`/original-game/${GAMES_LIST_ENUM.DRAGONTOWER}`)
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
      <div class="w-full flex content-center justify-around">
        <AppMiniGamePartDragontowerResultComponent :result="Result" />
      </div>

      <!-- 前往游戏 -->
      <AfunBaseButton class="mx-auto block capitalize" type="default" style="--afun-base-button-font-size:14px" @click="openCasinoGame">
        {{ t('前往', { app_name: 'Dragontower' }) }}
      </AfunBaseButton>
    </div>
    <!-- 种子信息 -->
    <AppMiniGamePartSeedInfo :game="GAMES_LIST_ENUM.DRAGONTOWER" :data="seedInfoData" :game-data="data" />
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
