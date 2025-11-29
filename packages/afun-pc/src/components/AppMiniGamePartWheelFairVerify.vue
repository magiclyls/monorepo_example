<script setup lang='ts'>
import { IconUniArrowDown, IconChessPlinko, IconUniArrowUpSmall2 } from '@tg/icons'
import { GAMES_LIST, useDice } from 'feie-ui'

defineOptions({
  name: 'AppMiniGamePartWheelFairVerify',
})
const props = defineProps<Props>()

const emit = defineEmits([
  'update:game',
  'update:clientSeed',
  'update:serverSeed',
  'update:nonce',
])

interface Props {
  game: string
  clientSeed: string
  serverSeed: string
  nonce: number
  gameData?: {
    [k: string]: any
  }
}

const { t } = useI18n()
const closeDialog = inject('closeDialog', () => { })
const { push } = useLocalRouter()

const _game = ref(props.game)
const wheelParams = ref({
  clientSeed: props.clientSeed,
  serverSeed: props.serverSeed,
  nonce: props.nonce,
  risk: props.gameData?.risk,
  segments: props.gameData?.segments,
})
/* 没选择时也有默认值 */
const handledWheelParams = computed(() => {
  const obj = { ...wheelParams.value }
  if (!obj.risk)
    obj.risk = 'low'
  if (!obj.segments)
    obj.segments = 10
  return obj
})

const { diceResult } = useDice(wheelParams)
const hasResult = computed(() => diceResult.value !== 0)

const riskList = [
  { label: t('keno_risk_low'), value: 'low' },
  { label: t('keno_risk_medium'), value: 'middle' },
  { label: t('keno_risk_high'), value: 'high' },
]
const segmentsList = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '30', value: 30 },
  { label: '40', value: 40 },
  { label: '50', value: 50 },
]

function changeNonceDice(type: 'up' | 'down') {
  if (type === 'up')
    wheelParams.value.nonce += 1

  else if (type === 'down' && wheelParams.value.nonce > 0)
    wheelParams.value.nonce -= 1
}
function onGameSelect(v: string) {
  emit('update:game', v)
}
function onClientSeedInput(v: string) {
  emit('update:clientSeed', v)
}
function onServerSeedInput(v: string) {
  emit('update:serverSeed', v)
}
function onNonceInput(v: number) {
  emit('update:nonce', +v)
}
// 查看计算细目
function checkFairnessesCalcButton() {
  push(`/provably-fair/calculation?game=${_game.value}`)
  closeDialog()
}
</script>

<template>
  <div>
    <!-- top -->
    <div class="flex-col-16 flex flex-col p-[16px]">
      <div
        class="border-tg-secondary text-left min-h-[200px] flex flex-col items-center justify-center border-[2px] rounded-[8px] border-dotted p-[16px] text-left"
      >
        <div v-if="!hasResult" class="flex flex-col items-center">
          <span class="text-tg-text-grey-light text-[14px] leading-[1.5]">
            {{ t('plinko_fairnesses_verifyText1') }}
          </span>
          <IconChessPlinko class="plinko-icon-loading mt-[16px] block" />
        </div>
        <div v-else class="h-full w-full">
          <AppMiniGamePartWheelResultComponent :key="diceResult" :result="diceResult" :risk="handledWheelParams.risk" :segments="handledWheelParams.segments" />
        </div>
      </div>
    </div>

    <div class="bg-tg-secondary-dark flex-col-16 flex flex-col p-[16px]">
      <BaseLabel :label="t('plinko_verifyTexts_game')">
        <BaseSelect
          v-model="_game" :options="GAMES_LIST" style="
        --tg-base-select-style-padding-y:7px;
        --tg-base-select-style-padding-x:7px;
        " @select="onGameSelect"
        />
      </BaseLabel>
      <BaseLabel :label="t('plinko_verifyTexts_clientSeed')">
        <BaseInput
          v-model="wheelParams.clientSeed" style="
        --tg-base-input-style-pad-x:7px;
        --tg-base-input-style-pad-y:7px;
        --tg-base-input-style-pad-left:7px;
        --tg-base-input-line-height:1.5;
        " @input="onClientSeedInput"
        />
      </BaseLabel>
      <BaseLabel :label="t('plinko_verifyTexts_serverSeed')">
        <BaseInput
          v-model="wheelParams.serverSeed" style="
        --tg-base-input-style-pad-x:7px;
        --tg-base-input-style-pad-y:7px;
        --tg-base-input-style-pad-left:7px;
        --tg-base-input-line-height:1.5;
        " @input="onServerSeedInput"
        />
      </BaseLabel>
      <BaseLabel :label="t('plinko_verifyTexts_nonce')">
        <BaseInput
          v-model.number="wheelParams.nonce" style="
        --tg-base-input-style-pad-x:7px;
        --tg-base-input-style-pad-y:7px;
        --tg-base-input-style-pad-left:7px;
        --tg-base-input-line-height:1.5;
        " type="number" @input="onNonceInput"
        >
          <template #right>
            <div class="relative flex">
              <div
                class="bg-tg-secondary active:bg-tg-secondary-dark group-hover:bg-tg-text-grey-hover flex items-center px-[20px] py-[13.5px]"
                style="--tg-icon-color:var(--tg-text-white)"
                @click="changeNonceDice('down')"
              >
                <IconUniArrowDown />
              </div>
              <div
                class="bg-tg-secondary active:bg-tg-secondary-dark group-hover:bg-tg-text-grey-hover flex items-center px-[20px] py-[13.5px]"
                style="--tg-icon-color:var(--tg-text-white)"
                @click="changeNonceDice('up')"
              >
                <IconUniArrowUpSmall2 />
              </div>
              <div class="bg-tg-primary absolute left-[53px] top-[11px] h-[22px] w-[2px]" />
            </div>
          </template>
        </BaseInput>
      </BaseLabel>
      <BaseLabel :label="t('plinko_risk')">
        <BaseSelect
          v-model="wheelParams.risk" :options="riskList" style="
        --tg-base-select-style-padding-y:7px;
        --tg-base-select-style-padding-x:7px;
        "
        />
      </baselabel>
      <BaseLabel :label="t('segments')">
        <BaseSelect
          v-model.number="wheelParams.segments" :options="segmentsList" style="
        --tg-base-select-style-padding-y:7px;
        --tg-base-select-style-padding-x:7px;
        "
        />
      </baselabel>
      <div class="flex justify-center">
        <BaseButton type="text" size="none" @click="checkFairnessesCalcButton">
          <span>{{ t('plinko_fairnesses_calcButton') }}</span>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.flex-col-16{
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
.group-hover\:bg-tg-text-grey-hover:hover:not(:active) {
  background-color: var(--tg-third-grey);
}
</style>
