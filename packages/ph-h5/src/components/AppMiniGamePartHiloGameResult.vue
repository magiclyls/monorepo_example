<script setup lang='ts'>
import { PhBaseButton } from '@tg/bccomponents'
import { IconUniArrowDownEqual, IconUniArrowUpEqual, IconUniArrowUpSmall, IconUniArrowUpSmall2, IconUniPairEqual, IconUniPairRight } from '@tg/icons'
import { SendFlutterAppMessage } from '@tg/types'
import { isFlutterApp, sendMsgToFlutterApp, toFixed } from '@tg/utils'
import { GAMES_LIST_ENUM } from 'feie-ui'
import { computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useMiniGameHiloData } from '~/pages/original-game/composables/useMiniGameHiloData'
import AppMiniGamePartBaseData from './AppMiniGamePartBaseData.vue'
import AppMiniGamePartSeedInfo from './AppMiniGamePartSeedInfo.vue'
import AppMiniGamePokerCard from './AppMiniGamePokerCard.vue'

defineOptions({
  name: 'AppMiniGamePartHiloGameResult',
})

const props = defineProps<Props>()

interface Props {
  data: any
}
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { push } = useRouter()
const { EnumBetType, betTextConfig } = useMiniGameHiloData()

const pokerRecord = []

const iconsArray = {
  IconUniArrowUpEqual,
  IconUniArrowDownEqual,
  IconUniArrowUpSmall2,
  IconUniArrowUpSmall,
  IconUniPairEqual,
  IconUniPairRight,
}

const multiplier = computed(() => props.data.payout_multiplier)
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
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_GAME, 'hilo')
    return
  }

  push(`/original-game/${GAMES_LIST_ENUM.HILO}`)
}
function initRecord() {
  const betDetail = JSON.parse(props.data.bet_detail)
  const { rounds, start_card } = betDetail
  pokerRecord.push({
    rank: start_card.rank,
    color: start_card.suit,
    betVal: '',
    isWin: true,
    isInit: true,
    resultIcon: '',
    multiplier: '',
  })
  pokerRecord.push(...rounds.map((item) => {
    return {
      rank: item.card.rank,
      color: item.card.suit,
      betVal: item.guess,
      isWin: !(+item.payout_multiplier === 0),
      isInit: true,
      resultIcon: betTextConfig[item.guess].resultIcon,
      multiplier: toFixed(Number(item.payout_multiplier), 2),
    }
  }))
}

initRecord()
</script>

<template>
  <div class="w-full">
    <div class="box gap-[16rem] w-full flex flex-col px-[16rem] pb-[16rem]">
      <AppMiniGamePartBaseData
        :bet-amount="data.bet_amount" :settle-amount="data.settle_amount"
        :currency-id="data.currency_id" :multiplier="multiplier"
      />
      <!-- 🎮 游戏特有数据 🎮 -->
      <div class="grid w-full justify-center">
        <!-- <AppMiniGamePartMinesGameResultComponents :mines="mines" :open-by-player-list="openByPlayerList" /> -->
        <div class="scroll-x scroll-contain overflow-x-scroll rounded-[0.3em] pb-[24rem]">
          <div class="flex items-center gap-8 text-[14rem]">
            <div v-for="item, index of pokerRecord" :key="index" class="relative">
              <div class="h5-w">
                <AppMiniGamePokerCard
                  :class="{ 'opacity-[0.5]': item.betVal === EnumBetType[5] }" class="m-auto"
                  :rank="item.rank" :color="item.color" :face-down="false"
                />
                <div
                  v-if="index !== 0"
                  class="center h5-multiplier payout-multiplier bg-tg-text-white absolute left-[-1rem] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-[4rem] p-[7rem] shadow-[0_0_0_2px_#2a2f3c33]"
                  :class="{ 'scale-[0]': !item.isInit, 'opacity-0': !item.isInit }"
                >
                  <component
                    :is="iconsArray[item.resultIcon as keyof typeof iconsArray] ?? undefined"
                    :style="{ color: item.betVal === EnumBetType[5] ? '#ff9d00' : (item.isWin ? '#00e701' : '#E9113C') }"
                    class="text-[14rem]"
                  />
                </div>
                <div
                  class="payout-multiplier over-ellipsis bg-win absolute mt-[2rem] w-[100%] overflow-hidden rounded-[2rem] px-[2rem] py-[4rem] text-center text-[14rem] leading-[1] font-[500] decoration-[#013e01]"
                  style="color: #013e01;"
                >
                  {{ index === 0 ? $t('起手牌') : (`${item.multiplier}x`) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 前往游戏 -->
      <PhBaseButton class="theme-btn mx-auto block capitalize shadow-[0_1px_2px_0_rgba(0,0,0,0.25)]" style="--ph-base-button-font-size:14rem" @click="openCasinoGame">
        {{ t('前往', { app_name: 'Hilo' }) }}
      </PhBaseButton>
    </div>
    <!-- 种子信息 -->
    <AppMiniGamePartSeedInfo :game="GAMES_LIST_ENUM.HILO" :data="seedInfoData" />
  </div>
</template>

<style lang='scss' scoped>
.bg-win {
  background-color: #00e701;
}
.bg-lose {
  background-color: #e9113c;
}
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: 16rem;
  }
}
.h5-poker-card {
  font-size: 7px;
}
</style>
