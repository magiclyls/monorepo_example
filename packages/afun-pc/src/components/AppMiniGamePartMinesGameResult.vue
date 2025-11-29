<script setup lang='ts'>
import { GAMES_LIST_ENUM } from 'feie-ui'
import type { IOriginalGameDetail } from '@tg/types'

interface Props {
  data: IOriginalGameDetail
}
defineOptions({
  name: 'AppMiniGamePartMinesGameResult',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { push } = useLocalRouter()
const { rightIsExpand, closeRightSidebar } = useRightSidebar()
const { isMobile } = storeToRefs(useWindowStore())

const multiplier = computed(() => props.data.payout_multiplier)
/** 炸弹的位置 */
const mines = computed<number[]>(() => JSON.parse(props.data.result))
/** 用户打开的位置 */
const openByPlayerList = computed(() => props.data.remark.split(',').map(a => +a))

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
  if (isMobile.value) {
    setTimeout(() => {
      rightIsExpand.value && closeRightSidebar()
    }, 50)
  }
  closeDialog()

  if (isFlutterApp()) {
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_GAME, GAMES_LIST_ENUM.MINES)
    return
  }

  push(`/casino/original-game/${GAMES_LIST_ENUM.MINES}`)
}
</script>

<template>
  <div class="w-full">
    <div class="flex-col-16 box w-full flex flex-col px-[16px] pb-[16px]">
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
      <BaseButton v-if="!isAdmin()" class="theme-btn mx-auto block capitalize" size="md" bg-style="primary" shadow @click="openCasinoGame">
        {{ t('go_to', { app_name: 'Mines' }) }}
      </BaseButton>
    </div>
    <!-- 种子信息 -->
    <AppMiniGamePartSeedInfo v-if="!isAdmin()" :game="GAMES_LIST_ENUM.MINES" :data="seedInfoData" />
  </div>
</template>

<style lang='scss' scoped>
.theme-btn{
  @include webTheme('white'){
    box-shadow: none;
  }
}
.flex-col-16{
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
.box {
  @include webTheme('green') {
    --tg-base-button-secondary-bg: #197B59;
    --tg-secondary-text-color-theme-green:#fff;
  }
}
</style>
