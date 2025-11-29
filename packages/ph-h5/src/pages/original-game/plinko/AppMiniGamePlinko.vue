<script lang="ts" setup>
import { ApiBettingGameOriginalPlinko } from '@tg/apis'
import { PhBaseDialog, PhBaseLabel, PhBaseSelect } from '@tg/bccomponents'
import { IconUniAutoPlinko, IconUniGameInfo, IconUniKeyboard } from '@tg/icons'
import { useAppStore, useCurrency } from '@tg/stores'
import { type EnumCurrencyKey, KeyboardKeyEnum, type MiniGamePlinko } from '@tg/types'
import { formatWithSubstring, getCurrencyConfig, mul, toFixed, toFixedByLockCurrency } from '@tg/utils'
import { GAMES_LIST_ENUM } from 'feie-ui'
import { debounce } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import AppDialogBetSlipCasino from '~/components/AppDialogBetSlipCasino.vue'
import { Message } from '~/utils'
import { AppMiniGamePublicBetAmount, AppMiniGamePublicBetButton, AppMiniGamePublicBetTimes, AppMiniGamePublicLayout } from '../_components'
import AppMiniGamePartPlinkoGameInfo from '../_components/AppMiniGamePartPlinkoGameInfo.vue'
import AppMiniGamePartPlinkoHotKeys from '../_components/AppMiniGamePartPlinkoHotKeys.vue'
import { useKeyboard, useMiniGameGlobalStateHotKeys, useMiniGameLockCurrency } from '../composables'
import { Plinko } from './plinko'
import { rowMap } from './useMiniGamePlinkoMap'

const { t } = useI18n()
const router = useRouter()
const appStore = useAppStore()
const { isLogin, userInfo } = storeToRefs(appStore)
const currencyStore = useCurrency()
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const { isHotKeysEnabled } = useMiniGameGlobalStateHotKeys()

const tabList = [
  { label: t('手动投注'), value: 1 },
  { label: t('自动投注'), value: 2 },
]
const riskOptions = [
  { label: t('低等'), value: 'low' },
  { label: t('中等'), value: 'middle' },
  { label: t('高等'), value: 'high' },
]
let plinko: Plinko | null = null
const gameData = ref({
  clientSeed: '',
  serverSeed: '',
  nonce: '',
  base_seed: '',
  hash: '',
  gameType: GAMES_LIST_ENUM.PLINKO,
})
const tab = ref(1)
const container = ref<HTMLDivElement | null>(null)
const betAmountRef = ref()
const risk = ref('low')
const row = ref('8')
const betAmount = ref('0.00')
const startAutoBet = ref(false)
const startBet = ref(false)
const autoBetTimes = ref(0)
const isFirst = ref(true)
const isStopAutoBet = ref(true)
const isShowResultDialog = ref(false)
const gameResult = ref()
const isShowHotKeysDialog = ref(false)
const isShowPlinkoGameInfoDialog = ref(false)
const riskSelectRef = ref()
const levelSelectRef = ref()
let betTimes = 0
let isInfinity = false

const {
  orderCurrencyCode,
  rate,
} = useMiniGameLockCurrency(currentGlobalCurrencyMap.value.cur)

const { runAsync: betRunAsync, data: betData, loading: betLoading } = useRequest(() =>
  ApiBettingGameOriginalPlinko({
    amount: betAmount.value,
    currency_id: currentGlobalCurrencyMap.value.cur,
    line: row.value,
    risk: risk.value,
  }), {
  onError: () => {
    isStopAutoBet.value = true
    isFirst.value = true
  },
})

const currentCurrency = computed(() => currentGlobalCurrencyMap.value.name)
/** 投注货币前缀 */
const currencyPrefix = computed(() => currentGlobalCurrencyMap.value.prefix)
/** 投注额，转换 */
const betAmountMulRate = computed(() => formatWithSubstring(toFixed(+mul(+betAmount.value, +rate.value))))

const rowsOptions = computed(() => [...rowMap.keys()].map(item => ({ label: String(item), value: String(item) })))

const isStartAutoBet = computed(() => tab.value === 2 && startAutoBet.value)
const isManual = computed(() => tab.value === 1)

async function init() {
  const curRow = rowMap.get(8)
  if (container.value) {
    plinko = new Plinko(container.value)
    await plinko.init(360, 276, '#fff')
    await plinko.createPinsAndResultBoxes(curRow?.pins ?? { rows: 10, startY: 30, gap: 30, pinRadius: 4 })
    plinko.setBallConfig(curRow?.ballConfig.radius as number, curRow?.ballConfig.air as number)
    plinko.setRecordClickCb(openGameResult)
    plinko.setGameEndCb(end)
  }
}
// 投注接口
async function start() {
  if (!isLogin.value) {
    router.push('/login')
    return
  }
  if (userInfo.value?.exclude === 1) {
    Message.info('排除打开了')
    return
  }
  betAmountRef.value?.valiAmountBetLimit()
  if (betAmountRef.value.betAmountError) {
    isStopAutoBet.value = true
    return
  }
  await betRunAsync()
  if (!betData.value)
    return
  if (isManual.value)
    startBet.value = true
  else
    startAutoBet.value = true
  plinko?.createBall(betData.value.state.path)
  plinko?.setGameRes(betData.value.state.result, betData.value)
  currencyStore.deductCurrentGlobalCurrencyBalance(+betAmount.value)
  currencyStore.initCurrencyList()
}
// 小球结束后的回调
function end() {
  if (isManual.value) {
    startBet.value = false
    return
  }
  if (isStopAutoBet.value)
    startAutoBet.value = false
}

// 投注
const clickBet = debounce(() => {
  start()
}, 500, { leading: true, trailing: false })

async function autoClickBet() {
  if (!isLogin.value) {
    router.push('/login')
    return
  }
  if (userInfo.value?.exclude === 1) {
    Message.info('排除打开了')
    return
  }
  betAmountRef.value?.valiAmountBetLimit()
  if (betAmountRef.value.betAmountError) {
    isStopAutoBet.value = true
    isFirst.value = true
    return
  }
  isStopAutoBet.value = !isStopAutoBet.value

  if (isStopAutoBet.value) {
    isFirst.value = true
    return
  }

  if (isFirst.value) {
    betTimes = autoBetTimes.value
    isInfinity = (betTimes === 0)
    isFirst.value = false
  }

  if (!isInfinity) {
    while (betTimes > 0 && !isStopAutoBet.value) {
      await start()
      betTimes--
      if (betTimes === 0) {
        isStopAutoBet.value = true
        isFirst.value = true
        return
      }
      await delay(200)
    }
    return
  }

  while (!isStopAutoBet.value) {
    await start()
    await delay(200)
  }
}
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function tabChange(value: number) {
  tab.value = value
}

function changeLevel(value: 'low' | 'middle' | 'high') {
  risk.value = value
  plinko?.setLevel(value)
  plinko?.removeRecord()
}

async function changeRows(rows: string) {
  row.value = rows
  if (plinko) {
    const config = rowMap.get(Number(rows))
    plinko.setBallConfig(
      config?.ballConfig.radius ?? 0,
      config?.ballConfig.air ?? 0,
    )
    const pinsConfig = rowMap.get(Number(rows))?.pins ?? { rows: 10, startY: 30, gap: 30, pinRadius: 4 }
    plinko.removeRecord()
    await plinko.createPinsAndResultBoxes(pinsConfig)
  }
}
function openGameResult(value: MiniGamePlinko) {
  const _data = {
    bill_no: value.id,
    id: value.id,
    uid: value.uid,
    username: value.name,
    game_name: value.game,
    game_class: '8',
    bet_time: value.updated_at,
  }
  gameResult.value = _data
  setTimeout(() => {
    isShowResultDialog.value = true
  }, 50)
}

/** 快捷键 */
useKeyboard((k) => {
  const disabled = betLoading.value || startBet.value || !isStopAutoBet.value
  if (isHotKeysEnabled.value) {
    switch (k) {
      // 投注
      case KeyboardKeyEnum.SPACE:
        riskSelectRef.value?.setBool(false)
        levelSelectRef.value?.setBool(false)
        if (isManual.value && !startBet.value && !betLoading.value)
          clickBet()
        else if (!isManual.value && isStopAutoBet.value)
          autoClickBet()
        else if (!isManual.value && !isStopAutoBet.value)
          isStopAutoBet.value = true
        break
      // 加倍投注额
      case KeyboardKeyEnum.S:
        if (disabled)
          return
        betAmountRef.value?.double()
        break
      // 减半投注额
      case KeyboardKeyEnum.A:
        if (disabled)
          return
        betAmountRef.value?.half()
        break
      // 零数投注额
      case KeyboardKeyEnum.D:
        if (disabled)
          return
        betAmount.value = toFixedByLockCurrency('0', currentGlobalCurrencyMap.value.type)
        break
    }
  }
})

watch(() => currentGlobalCurrencyMap.value.cur, (a) => {
  orderCurrencyCode.value = a
})

onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <AppMiniGamePublicLayout
      :game="GAMES_LIST_ENUM.PLINKO"
      :game-type="GAMES_LIST_ENUM.PLINKO"
      :game-data="gameData"
      @open-game-info="isShowPlinkoGameInfoDialog = true"
      @open-hot-keys="isShowHotKeysDialog = true"
    >
      <template #left>
        <div class="grid gap-y-[10rem]">
          <PhBaseLabel :label="t('投注额')" :right-text="currencyPrefix + betAmountMulRate" style="--ph-base-label-color: #6D7693">
            <div class="bg-[#ffffff] rounded-[4rem] border border-[#ebebeb] border-solid p-[4rem]">
              <AppMiniGamePublicBetAmount
                ref="betAmountRef"
                v-model="betAmount" :placeholder="t('投注额')"
                :disabled="startAutoBet"
                :game="GAMES_LIST_ENUM.PLINKO"
                :currency="getCurrencyConfig(currentCurrency as EnumCurrencyKey).cur"
              />
            </div>
          </PhBaseLabel>
          <AppMiniGamePublicBetButton v-if="isManual" class="w-full" :loading="betLoading" :disabled="betLoading" :game="GAMES_LIST_ENUM.PLINKO" @bet-btn-click="clickBet">
            <div class="text-[16rem]">
              {{ t('投注') }}
            </div>
          </AppMiniGamePublicBetButton>
          <AppMiniGamePublicBetButton v-else class="w-full" :game="GAMES_LIST_ENUM.PLINKO" @bet-btn-click="autoClickBet">
            <div class="center">
              <div class="text-[16rem] mr-[6rem]">
                {{ !isStopAutoBet ? t('停止自动投注') : t('开始自动投注') }}
              </div>
              <div v-if="!isStopAutoBet" class="center auto-bet-animate">
                <IconUniAutoPlinko />
              </div>
            </div>
          </AppMiniGamePublicBetButton>
          <PhBaseLabel :label="t('风险')" style="--ph-base-label-color: #6D7693">
            <PhBaseSelect
              ref="riskSelectRef"
              v-model="risk" :options="riskOptions"
              :class="{ 'pointer-events-none': isStartAutoBet || startBet }"
              style="--ph-base-select-background-color: #fff"
              @change="changeLevel"
            />
          </PhBaseLabel>

          <PhBaseLabel :label="t('排数')" style="--ph-base-label-margin-bottom: 2rem;--ph-base-label-color: #6D7693">
            <PhBaseSelect
              ref="levelSelectRef"
              v-model="row"
              :class="{ 'pointer-events-none': isStartAutoBet || startBet }" :options="rowsOptions"
              style="--ph-base-select-background-color: #fff"
              @change="changeRows"
            />
          </PhBaseLabel>
          <PhBaseLabel v-if="!isManual" :label="t('投注次数')" class="mt-[10rem] set-label-color" style="--ph-base-label-margin-bottom: 2rem;">
            <AppMiniGamePublicBetTimes v-model.number="autoBetTimes" :disabled="isStartAutoBet" />
          </PhBaseLabel>
          <div class="h-[40rem] -mb-[12rem] -ml-[12rem] -mr-[12rem] text-[#0D2245] relative" :class="{ 'pointer-events-none opacity-[.6]': startAutoBet || startBet }">
            <div class="absolute top-0 left-0 w-full flex justify-between font-[500] h-[40rem]">
              <div v-for="item, index in tabList" :key="index" class="flex-1 center border-b-[1rem] " :class="[item.value === tab ? ' border-[#F23038]' : 'border-transparent']" @click="tabChange(item.value)">
                {{ item.label }}
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #right>
        <div class="size-full center">
          <div ref="container" />
        </div>
      </template>
    </AppMiniGamePublicLayout>
    <PhBaseDialog v-if="gameResult" v-model="isShowResultDialog" :title="t('投注')" style="--ph-base-dialog-background-color: #F6F7F8; --ph-base-dialog-icon-color: #9DABC8">
      <AppDialogBetSlipCasino v-if="isShowResultDialog" :casino-data="gameResult" />
    </PhBaseDialog>
    <PhBaseDialog v-model="isShowHotKeysDialog" :icon="IconUniKeyboard" :title="t('快捷键')" style="--ph-base-dialog-background-color: #F6F7F8">
      <AppMiniGamePartPlinkoHotKeys />
    </PhBaseDialog>
    <PhBaseDialog v-model="isShowPlinkoGameInfoDialog" :icon="IconUniGameInfo" :title="t('游戏规则')" style="--ph-base-dialog-background-color: #F6F7F8">
      <AppMiniGamePartPlinkoGameInfo />
    </PhBaseDialog>
  </div>
</template>

<style scoped lang="scss">
.auto-bet-animate {
  animation: upDown 500ms infinite alternate;
}
@keyframes upDown {
  0% {
    transform: translateY(-30%);
  }
  100% {
    transform: translateY(0%);
  }
}
</style>
