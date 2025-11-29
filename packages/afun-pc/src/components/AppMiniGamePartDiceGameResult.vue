<script setup lang='ts'>
import { GAMES_LIST_ENUM } from 'feie-ui'
import type { IOriginalGameDetail } from '@tg/types'
import { IconUniClose, IconUniPersent, IconUniRefresh } from '@tg/icons'

interface Props {
  data: IOriginalGameDetail
}
defineOptions({
  name: 'AppMiniGamePartDiceGameResult',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { push } = useLocalRouter()
const { rightIsExpand, closeRightSidebar } = useRightSidebar()
const { isMobile } = storeToRefs(useWindowStore())

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
  if (isMobile.value) {
    setTimeout(() => {
      rightIsExpand.value && closeRightSidebar()
    }, 50)
  }
  closeDialog()

  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_GAME, GAMES_LIST_ENUM.DICE)

  else
    push(`/casino/original-game/${GAMES_LIST_ENUM.DICE}`)
}

// 下面三个参数 乘数、掷大于、获胜几率
const multiplier: string = bet_detail.payout_multiplier
const roll_over: string = toFixed(Number(bet_detail.target), 2)
const win_chance: string = bet_detail.win_chance
</script>

<template>
  <div class="w-full">
    <div class="box flex-col-16 w-full flex flex-col px-[16px] pb-[16px]">
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
      <div class="bg-tg-secondary-grey mt-[-16px] flex justify-around p-[3%]">
        <div class="max-w-[32%]">
          <p class="text-tg-secondary-light font-bold">
            {{ t('dice_bet_score_pop_up_multiplier') }}
          </p>
          <BaseInput
            v-model="multiplier"
            readonly
          >
            <template #right-icon>
              <IconUniClose />
            </template>
          </BaseInput>
        </div>
        <div class="max-w-[32%]">
          <p class="text-tg-secondary-light font-bold">
            {{ t('dice_bet_score_pop_up_roll_over') }}
          </p>
          <BaseInput
            v-model="roll_over"
            readonly
          >
            <template #right-icon>
              <IconUniRefresh />
            </template>
          </BaseInput>
        </div>
        <div class="max-w-[32%]">
          <p class="text-tg-secondary-light font-bold">
            {{ t('dice_bet_score_pop_up_win_chance') }}
          </p>
          <BaseInput
            v-model="win_chance"
            readonly
          >
            <template #right-icon>
              <IconUniPersent />
            </template>
          </BaseInput>
        </div>
      </div>
      <!-- 前往游戏 -->
      <BaseButton v-if="!isAdmin()" class="theme-btn mx-auto block capitalize" bg-style="primary" shadow size="md" @click="openCasinoGame">
        {{ t('go_to', { app_name: 'Dice' }) }}
      </BaseButton>
    </div>
    <!-- 种子信息 -->
    <AppMiniGamePartSeedInfo v-if="!isAdmin()" :game="GAMES_LIST_ENUM.DICE" :data="seedInfoData" />
  </div>
</template>

<style lang='scss' scoped>
.theme-btn{
  @include webTheme('white'){
    box-shadow: none;
  }
  @include webTheme('green'){
    --tg-base-button-style-bg: #197B59;
    color: white;
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
    --tg-base-button-secondary-bg: #42BC91;
    --tg-base-input-readonly-bg-color:var(--tg-base-input-style-background-color);
  }
  @include webTheme('white') {
    --tg-base-input-readonly-bg-color:var(--tg-base-input-style-background-color);
  }
}
</style>
