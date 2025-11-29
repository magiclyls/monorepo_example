<script setup lang='ts'>
import { GAMES_LIST_ENUM } from 'feie-ui'

defineOptions({
  name: 'AppMiniGamePartHiloGameResult',
})

const props = defineProps<Props>()

interface Props {
  data: any
}
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { push } = useLocalRouter()
const { rightIsExpand, closeRightSidebar } = useRightSidebar()
const { EnumBetType, betTextConfig } = useMiniGameHiloData()
const { isMobile } = storeToRefs(useWindowStore())

const pokerRecord = []

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
  if (isMobile.value) {
    setTimeout(() => {
      rightIsExpand.value && closeRightSidebar()
    }, 50)
  }
  closeDialog()

  if (isFlutterApp()) {
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_GAME, GAMES_LIST_ENUM.HILO)
    return
  }

  push(`/casino/original-game/${GAMES_LIST_ENUM.HILO}`)
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
    <div class="box flex-col-16 w-full flex flex-col px-[16px] pb-[16px]">
      <AppMiniGamePartBaseData
        :bet-amount="data.bet_amount" :settle-amount="data.settle_amount"
        :currency-id="data.currency_id" :multiplier="multiplier"
      />
      <!-- 🎮 游戏特有数据 🎮 -->
      <div class="grid w-full justify-center">
        <!-- <AppMiniGamePartMinesGameResultComponents :mines="mines" :open-by-player-list="openByPlayerList" /> -->
        <div class="scroll-x scroll-contain overflow-x-scroll rounded-[0.3em] pb-[24px]">
          <div class="flex items-center gap-[8px] text-[14px]" :class="{ 'h5-poker-card': isMobile }">
            <div v-for="item, index of pokerRecord" :key="index" class="relative">
              <div class="h5-w">
                <AppMiniGamePokerCard
                  :class="{ 'opacity-[0.5]': item.betVal === EnumBetType[5] }" class="m-auto"
                  :rank="item.rank" :color="item.color" :face-down="false"
                />
                <div
                  v-if="index !== 0"
                  class="center h5-multiplier payout-multiplier bg-tg-text-white absolute left-[-4px] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-[4px] p-[7px] shadow-[0_0_0_2px_#2a2f3c33]"
                  :class="{ 'scale-[0]': !item.isInit, 'opacity-0': !item.isInit }"
                >
                  <component
                    :style="{ '--tg-icon-color': item.betVal === EnumBetType[5] ? '#ff9d00' : (item.isWin ? '#00e701' : '#E9113C') }"
                    :is="item.resultIcon"
                  />
                </div>
                <div
                  class="payout-multiplier over-ellipsis bg-win absolute mt-[2px] w-[100%] overflow-hidden rounded-[2px] px-[2px] py-[4px] text-center text-[14px] leading-[1] font-[600] decoration-[#013e01]"
                  :class="{ 'bg-lose': !item.isWin, 'text-[8px]': isMobile }" style="color: #013e01;"
                >
                  {{ index === 0 ? $t('hilo_starting_hand') : (`${item.multiplier}x`) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 前往游戏 -->
      <BaseButton v-if="!isAdmin()" class="theme-btn mx-auto block capitalize" bg-style="primary" size="md" shadow @click="openCasinoGame">
        {{ t('go_to', { app_name: 'Hilo' }) }}
      </BaseButton>
    </div>
    <!-- 种子信息 -->
    <AppMiniGamePartSeedInfo v-if="!isAdmin()" :game="GAMES_LIST_ENUM.HILO" :data="seedInfoData" />
  </div>
</template>

<style lang='scss' scoped>
.bg-win{
  background-color: #00e701;
  @include webTheme('green') {
    background-color: #F6D14A;
  }
}
.bg-lose{
  background-color: #E9113C;

}
.theme-btn{
  @include webTheme('white'){
    box-shadow: none;
  }
  @include webTheme('green') {
      --tg-base-button-style-bg: #197B59;
      --tg-secondary-text-color-theme-green: white;
  }
}
.flex-col-16{
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
.h5-poker-card{
  font-size: 7px;
}
.box {
  @include webTheme('green') {
    --tg-base-button-secondary-bg: #42BC91;
  }
}
</style>
