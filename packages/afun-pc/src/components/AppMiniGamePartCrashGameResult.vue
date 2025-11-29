<script lang="ts" setup>
import type { IOriginalGameDetail } from '@tg/types'

import { ApiGameOriginCrashIssueRecord } from '@tg/apis'
import { GAMES_LIST_ENUM } from 'feie-ui'

interface Props {
  data: IOriginalGameDetail
}
defineOptions({
  name: 'AppMiniGamePartCrashGameResult',
})
const props = defineProps<Props>()

const closeDialog = inject('closeDialog', () => { })

const { isMobile } = storeToRefs(useWindowStore())
const { t } = useI18n()
const { push } = useLocalRouter()
const { rightIsExpand, closeRightSidebar } = useRightSidebar()

const {
  data: list,
  runAsync: runGetRecordAsync,
  loading,
} = useRequest(ApiGameOriginCrashIssueRecord)

const betDetail = ref()

try {
  betDetail.value = JSON.parse(props.data?.bet_detail)
  runGetRecordAsync({ page_size: 1, issue: betDetail.value.issue_id, page: 1 })
}
catch {}

const crash_data = computed(() => list.value && list.value.d && list.value.d.length ? list.value.d[0] : undefined)

const seedInfoData = computed(() => {
  return {
    serverSeed: props.data.server_seed,
    serverSeedHash: props.data.server_seed_hash,
    clientSeed: props.data.client_seed,
    nonce: props.data.nonce,
    base_seed: crash_data.value?.base_seed ?? '',
    hash: crash_data.value?.hash ?? '',
  }
})

const gameBlackJackRef = ref()
const { width: WrapWidth } = useElementSize(gameBlackJackRef)
const fontSizeGameRoot = computed(() => {
  if (WrapWidth.value > 900)
    return 1.5
  else if (WrapWidth.value <= 400)
    return 0.7
  else
    return (0.7 + 0.7 * (WrapWidth.value - 400) / (900 - 400)).toFixed(6)
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
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_GAME, GAMES_LIST_ENUM.CRASH)
    return
  }

  push(`/casino/original-game/${GAMES_LIST_ENUM.CRASH}`)
}
</script>

<template>
  <div ref="gameBlackJackRef" class="w-full">
    <div class="px-[16px]">
      <AppMiniGamePartBaseData
        :bet-amount="data.bet_amount"
        :settle-amount="data.settle_amount"
        :currency-id="data.currency_id"
        :multiplier="data.payout_multiplier"
      />
    </div>
    <div
      :style="{ fontSize: `${fontSizeGameRoot}em` }"
      class="box w-full px-[16px] pb-[16px]"
    >
      <div class="w-full flex grow flex-col items-center justify-center">
        <div class="wrap flex-col-16 mb-[16px] mt-[12px] w-full flex flex-col">
          <div class="text-tg-text-white text-center text-[28px] font-semibold leading-[42px]">
            {{ +data.result > 0 ? floor(+data.result, 2).toFixed(2) : '0.00' }}x
          </div>
          <div>
            <BaseInput readonly :model-value="betDetail.bet_point" />
          </div>
        </div>
      </div>
      <!-- 前往游戏 -->
      <BaseButton v-if="!isAdmin()" class="mx-auto block capitalize" size="md" shadow bg-style="primary" @click="openCasinoGame">
        {{ t('go_to', { app_name: 'Crash' }) }}
      </BaseButton>
    </div>
    <!-- 种子信息 -->
    <AppMiniGamePartSeedInfo v-if="!isAdmin()" :game="GAMES_LIST_ENUM.CRASH" :data="seedInfoData" />
  </div>
</template>

<style lang="scss" scoped>
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
.divider {
  position: absolute;
  width: 2px;
  height: 80%;
  top: 50%;
  right: 100%;
  transform: translate(50%, -50%);
  background: var(--tg-secondary-grey);
}
.stats-row {
  // display: grid;
  padding: 12px 14px;
  background: var(--tg-secondary-dark);
  border-radius: 4px;
  width: 100%;
  // grid-template-columns: repeat(3, 1fr);
  .col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    padding: 7px;
    &:first-of-type .divider {
      display: none;
    }
    dt {
      color: var(--tg-text-lightgrey);
      transition: 250ms;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      line-height: 14px;
    }
    dd {
      // margin-top: 4px;
      color: #fff;
      font-weight: 600;
      display: flex;
      align-items: center;
    }
  }
}
.box {
  @include webTheme('green') {
    --tg-base-button-secondary-bg: #42bc91;
  }
}
</style>
