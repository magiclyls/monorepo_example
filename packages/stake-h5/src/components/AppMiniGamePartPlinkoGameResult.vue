<script setup lang='ts'>
import { GAMES_LIST_ENUM } from 'feie-ui'
import type { IOriginalGameDetail } from '@tg/types'

interface Props {
  data: IOriginalGameDetail
}
defineOptions({
  name: 'AppMiniGamePartPlinkoGameResult',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { push } = useLocalRouter()
const { rightIsExpand, closeRightSidebar } = useRightSidebar()
const { isMobile } = storeToRefs(useWindowStore())

const plinkoIndex = computed(() => +props.data.result.split(',')[0])
const plinkoResult = computed(() => props.data.result.split(',')[1])
const risk = computed(() => props.data.bet_type.split(',')[1])
const plinkoRisk = computed(() => {
  const obj: { [k: string]: string } = {
    low: t('plinko_level1'),
    middle: t('plinko_level2'),
    high: t('plinko_level3'),
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
  if (isMobile.value) {
    setTimeout(() => {
      rightIsExpand.value && closeRightSidebar()
    }, 50)
  }
  closeDialog()

  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_GAME, GAMES_LIST_ENUM.PLINKO)

  else
    push(`/casino/original-game/${GAMES_LIST_ENUM.PLINKO}`)
}
</script>

<template>
  <div class="w-full">
    <div class="box flex-col-16 w-full flex flex-col px-[16px] pb-[16px]">
      <AppMiniGamePartBaseData
        :bet-amount="data.bet_amount"
        :settle-amount="data.settle_amount"
        :currency-id="data.currency_id"
        :multiplier="plinkoResult"
      />
      <!-- 🎮 游戏特有数据 🎮 -->
      <div class="w-full">
        <ResultPlinko
          class="mx-auto" :index="plinkoIndex"
          :result="(+plinkoResult).toFixed(1).toString()"
          :row="plinkoRow"
        />
        <BaseLabel :label="t('plinko_risk')">
          <BaseInput
            v-model="plinkoRisk" readonly style="
        --tg-base-input-style-pad-x:7px;
        --tg-base-input-style-pad-y:7px;
        --tg-base-input-style-pad-left:7px;
        --tg-base-input-line-height:1.5;
        "
          />
        </BaseLabel>
        <BaseLabel class="mt-[14px]" :label="t('plinko_rows')">
          <BaseInput
            v-model="plinkoRow" readonly style="
        --tg-base-input-style-pad-x:7px;
        --tg-base-input-style-pad-y:7px;
        --tg-base-input-style-pad-left:7px;
        --tg-base-input-line-height:1.5;
        "
          />
        </BaseLabel>
      </div>

      <!-- 前往游戏 -->
      <BaseButton v-if="!isAdmin()" class="theme-btn mx-auto block capitalize" size="md" bg-style="secondary" shadow @click="openCasinoGame">
        {{ t('go_to', { app_name: 'Plinko' }) }}
      </BaseButton>
    </div>
    <!-- 种子信息 -->
    <AppMiniGamePartSeedInfo v-if="!isAdmin()" :game="GAMES_LIST_ENUM.PLINKO" :data="seedInfoData" />
  </div>
</template>

<style lang='scss' scoped>
.theme-btn{
  @include webTheme('white'){
    box-shadow: none;
  }
  @include webTheme('green'){
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
    --tg-secondary-text-color-theme-green:#ffffff;
    --tg-base-input-style-border:none;
    --tg-base-input-readonly-bg-color:#197B59;
    --tg-base-input-style-background-color:#197B59;
  }
}
</style>
