<script lang="ts" setup>
import { ApiGameOriginCrashIssueRecord } from '@tg/apis'
import { PhBaseButton, PhBaseInput } from '@tg/bccomponents'
import { type IOriginalGameDetail, SendFlutterAppMessage } from '@tg/types'
import { isFlutterApp, sendMsgToFlutterApp } from '@tg/utils'
import { useElementSize } from '@vueuse/core'
import { GAMES_LIST_ENUM } from 'feie-ui'
import { floor } from 'lodash'
import { computed, inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import AppMiniGamePartBaseData from './AppMiniGamePartBaseData.vue'
import AppMiniGamePartSeedInfo from './AppMiniGamePartSeedInfo.vue'

interface Props {
  data: IOriginalGameDetail
}
defineOptions({
  name: 'AppMiniGamePartCrashGameResult',
})
const props = defineProps<Props>()

const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { push } = useRouter()

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
  closeDialog()

  if (isFlutterApp()) {
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_GAME, 'crash')
    return
  }

  push(`/original-game/${GAMES_LIST_ENUM.CRASH}`)
}
</script>

<template>
  <div ref="gameBlackJackRef" class="w-full">
    <div class="px-[16rem]">
      <AppMiniGamePartBaseData
        :bet-amount="data.bet_amount"
        :settle-amount="data.settle_amount"
        :currency-id="data.currency_id"
        :multiplier="data.payout_multiplier"
      />
    </div>
    <div
      :style="{ fontSize: `${fontSizeGameRoot}em` }"
      class="box w-full px-[16rem] pb-[16rem] mt-[15rem]"
    >
      <div class="w-full flex grow flex-col items-center justify-center">
        <div class="wrap gap-[16rem] mb-[16rem] mt-12 w-full flex flex-col">
          <div class="text-tg-text-white text-center text-[28rem] font-semibold leading-[42rem]">
            {{ +data.result > 0 ? floor(+data.result, 2).toFixed(2) : '0.00' }}x
          </div>
          <div>
            <PhBaseInput readonly :model-value="betDetail.bet_point" style="--ph-base-input-background-color: #EBEBEB; --ph-base-input-border-color: transparent; --ph-base-input-padding-y: 9rem" />
          </div>
        </div>
      </div>
      <!-- 前往游戏 -->
      <PhBaseButton class="mx-auto block capitalize" style="--ph-base-button-font-size:14rem" @click="openCasinoGame">
        {{ t('前往', { app_name: 'Crash' }) }}
      </PhBaseButton>
    </div>
    <!-- 种子信息 -->
    <AppMiniGamePartSeedInfo :game="GAMES_LIST_ENUM.CRASH" :data="seedInfoData" />
  </div>
</template>

<style lang="scss" scoped>
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: 16rem;
  }
}
.divider {
  position: absolute;
  width: 2px;
  height: 80%;
  top: 50%;
  right: 100%;
  transform: translate(50%, -50%);
  background: #213743;
}
.stats-row {
  // display: grid;
  padding: 12px 14px;
  background: #0f212e;
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
      color: #b1bad3;
      transition: 250ms;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      line-height: 14px;
    }
    dd {
      // margin-top: 4px;
      color: #fff;
      font-weight: 500;
      display: flex;
      align-items: center;
    }
  }
}
</style>
