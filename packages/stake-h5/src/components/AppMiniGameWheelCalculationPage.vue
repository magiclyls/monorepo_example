<script setup lang='ts'>
import { IconUniArrowDown, IconChessFrame2, IconUniArrowUpSmall2 } from '@tg/icons'
import { useDice } from 'feie-ui'

defineOptions({
  name: 'AppMiniGameWheelCalculationPage',
})
const { t } = useI18n()

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
const wheelParams = ref({
  clientSeed: '',
  serverSeed: '',
  nonce: 0,
  risk: '',
  segments: 0,
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
const { diceByteToNumber, diceResult, diceSeedToByte } = useDice(handledWheelParams)

// 是否有结果
const hasResult = computed(() => diceResult.value !== 0)

function changeNonce(type: 'up' | 'down') {
  if (type === 'up')
    wheelParams.value.nonce += 1

  else if (type === 'down' && wheelParams.value.nonce > 0)
    wheelParams.value.nonce -= 1
}
</script>

<template>
  <BaseLabel class="mb-[16px]" :label="$t('client_seed')">
    <BaseInput v-model="wheelParams.clientSeed" type="text" msg-after-touched />
  </BaseLabel>
  <BaseLabel class="mb-[16px]" :label="$t('server_seed')">
    <BaseInput v-model="wheelParams.serverSeed" type="text" msg-after-touched />
  </BaseLabel>
  <BaseLabel class="mb-[16px]" :label="$t('present_sign')">
    <BaseInput
      v-model.number="wheelParams.nonce" style="
        --tg-base-input-style-pad-x:7px;
        --tg-base-input-style-pad-y:7px;
        --tg-base-input-style-pad-left:7px;
        --tg-base-input-line-height:1.5;
        "
    >
      <template #right>
        <div class="relative flex">
          <div
            class="bg-tg-secondary active:bg-tg-secondary-dark group-hover:bg-tg-text-grey-hover flex items-center px-[20px] py-[13.5px]"
            style="--tg-icon-color:var(--tg-text-white)" @click="changeNonce('down')"
          >
            <IconUniArrowDown />
          </div>
          <div
            class="bg-tg-secondary active:bg-tg-secondary-dark group-hover:bg-tg-text-grey-hover flex items-center px-[20px] py-[13.5px]"
            style="--tg-icon-color:var(--tg-text-white)" @click="changeNonce('up')"
          >
            <IconUniArrowUpSmall2 />
          </div>
          <div class="bg-tg-primary absolute left-[53px] top-[11px] h-[22px] w-[2px]" />
        </div>
      </template>
    </BaseInput>
  </BaseLabel>
  <BaseLabel class="mb-[16px]" :label="$t('plinko_risk')">
    <BaseSelect v-model="wheelParams.risk" :options="riskList" small />
  </BaseLabel>
  <BaseLabel class="mb-[16px]" :label="$t('segments')">
    <BaseSelect v-model.number="wheelParams.segments" :options="segmentsList" small />
  </BaseLabel>
  <!-- 结果 -->
  <div class="border-tg-secondary flex-col-16 min-h-[200px] flex flex-col items-center justify-center border-[2px] rounded-[4px] border-dotted p-[16px]">
    <template v-if="!hasResult">
      <div class="text-[14px] leading-[1.5]">
        {{ $t('more_input_required_verify_results') }}
      </div>
      <div class="ani-roll">
        <IconChessFrame2 style="--tg-icon-color:var(--tg-text-white);" />
      </div>
    </template>
    <!-- result -->
    <div v-else class="h-full w-full">
      <AppMiniGamePartWheelResultComponent :key="diceResult" :result="diceResult" :risk="handledWheelParams.risk" :segments="handledWheelParams.segments" />
    </div>
  </div>

  <!-- 计算明细 -->
  <div v-if="!hasResult" class="flex-col-16 min-h-[200px] flex flex-col items-center justify-center rounded-[4px] p-[16px]">
    <div class="ani-roll">
      <IconChessFrame2 style="--tg-icon-color:var(--tg-text-white);" />
    </div>
  </div>

  <!-- 有数据 -->
  <template v-if="hasResult">
    <div
      :key="`${wheelParams.clientSeed}-${wheelParams.nonce}-${wheelParams.serverSeed}`"
      class="flex-col-16 w-full flex flex-col"
    >
      <div class="w-full">
        <h6 class="text-tg-text-lightgrey mb-[8px] text-[14px] font-semibold leading-[1.5]">
          {{ t('verify_final_result') }}
        </h6>
        <div>
          <span class="text-tg-text-white text-[14px] font-semibold leading-[1.5] font-mono">{{ diceResult }}</span>
        </div>
      </div>
      <div>
        <h6 class="text-tg-text-lightgrey mb-[8px] text-[14px] font-semibold leading-[1.5]">
          {{ t('verify_social_casino_seeds_toBytes') }}
        </h6>
        <SeedToBytes v-if="diceSeedToByte" :list="diceSeedToByte" />
      </div>
      <div>
        <h6 class="text-tg-text-lightgrey mb-[8px] text-[14px] font-semibold leading-[1.5]">
          {{ t('verify_bytes_to_number') }}
        </h6>
        <BytesToNumber v-if="diceByteToNumber" :list="diceByteToNumber" />
      </div>
    </div>
  </template>
</template>

<style lang='scss' scoped>
.flex-col-16{
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
</style>
