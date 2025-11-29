<script setup lang='ts'>
import { GAMES_LIST_ENUM } from 'feie-ui'
import type { IOriginalGameDetail } from '@tg/types'

interface Props {
  data: IOriginalGameDetail
}
defineOptions({
  name: 'AppMiniGamePartLimboGameResult',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { push } = useLocalRouter()
const { rightIsExpand, closeRightSidebar } = useRightSidebar()
const { isMobile } = storeToRefs(useWindowStore())

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
  if (isMobile.value) {
    setTimeout(() => {
      rightIsExpand.value && closeRightSidebar()
    }, 50)
  }
  closeDialog()

  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_GAME, GAMES_LIST_ENUM.LIMBO)

  else
    push(`/casino/original-game/${GAMES_LIST_ENUM.LIMBO}`)
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
      <div class="text-tg-text-lightgrey w-full text-center text-[14px] font-semibold">
        <span class="mb-[4px] inline-block h-[21px] pb-[15px]">{{ t('mini_target') }}</span><br>
        <span class="text-tg-text-white pb-[15px] text-lg">{{ parseFloat(multiplier_target) }} ×</span><br>
        <span class="mt-[14px] inline-block h-[21px] pb-[15px]">{{ t('mini_result') }}</span><br>
        <span class="text-lg" :class="[isWill ? 'win' : 'loss']">{{ limboResult }} ×</span><br>
      </div>

      <!-- 前往游戏 -->
      <BaseButton v-if="!isAdmin()" class="theme-btn mx-auto block capitalize" bg-style="primary" shadow size="md" @click="openCasinoGame">
        {{ t('go_to', { app_name: 'Limbo' }) }}
      </BaseButton>
    </div>
    <!-- 种子信息 -->
    <AppMiniGamePartSeedInfo v-if="!isAdmin()" :game="GAMES_LIST_ENUM.LIMBO" :data="seedInfoData" />
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
.loss{
  color:var(--tg-text-error)
}
.win{
  color: var(--tg-text-green)
}
.box {
  @include webTheme('green') {
    --tg-base-button-secondary-bg: #197B59;
    --tg-secondary-text-color-theme-green:#ffffff;
  }
}
</style>
