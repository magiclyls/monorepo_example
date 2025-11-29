<script setup lang='ts'>
import { PhBaseInput, PhBaseLabel, PhBaseSelect } from '@tg/bccomponents'
import { IconChessFrame2, IconUniArrowDown, IconUniArrowUpSmall2 } from '@tg/icons'
import { useDice } from 'feie-ui'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppMiniGamePartWheelResultComponent from './AppMiniGamePartWheelResultComponent.vue'

defineOptions({
  name: 'AppMiniGameWheelCalculationPage',
})
const { t } = useI18n()

const riskList = [
  { label: t('低等'), value: 'low' },
  { label: t('中等'), value: 'middle' },
  { label: t('高等'), value: 'high' },
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
  <PhBaseLabel class="mb-[16rem]" :label="$t('客户端种子')" style="--ph-base-label-margin-bottom: 2rem">
    <PhBaseInput
      v-model="wheelParams.clientSeed" type="text" msg-after-touched
      style="
    --ph-base-input-padding-y: 9rem
    "
    />
  </PhBaseLabel>
  <PhBaseLabel class="mb-[16rem]" :label="$t('服务器种子')" style="--ph-base-label-margin-bottom: 2rem">
    <PhBaseInput
      v-model="wheelParams.serverSeed" type="text" msg-after-touched
      style="
    --ph-base-input-padding-y: 9rem
    "
    />
  </PhBaseLabel>
  <PhBaseLabel class="mb-[16rem]" :label="$t('现时标志')" style="--ph-base-label-margin-bottom: 2rem">
    <PhBaseInput
      v-model.number="wheelParams.nonce" style="
        --ph-base-input-padding-right: 0;
        --ph-base-input-padding-y: 9rem
        "
    >
      <template #right>
        <div class="relative flex">
          <div
            class="bg-[#EBEBEB] flex items-center justify-center w-[32rem] h-[32rem] mt-[3rem] rounded-[4rem] mr-[2rem]"
            style="--tg-icon-color:var(--tg-text-white)" @click="changeNonce('down')"
          >
            <IconUniArrowDown />
          </div>
          <div
            class="bg-[#EBEBEB] flex items-center justify-center w-[32rem] h-[32rem] mt-[3rem] rounded-[4rem] mr-[4rem]"
            style="--tg-icon-color:var(--tg-text-white)" @click="changeNonce('up')"
          >
            <IconUniArrowUpSmall2 />
          </div>
          <div class="bg-tg-primary absolute left-[53rem] top-[11rem] h-[22rem] w-[2rem]" />
        </div>
      </template>
    </PhBaseInput>
  </PhBaseLabel>
  <PhBaseLabel class="mb-[16rem]" :label="$t('风险')" style="--ph-base-label-margin-bottom: 2rem">
    <PhBaseSelect v-model="wheelParams.risk" :options="riskList" small />
  </PhBaseLabel>
  <PhBaseLabel class="mb-[16rem]" :label="$t('分段')" style="--ph-base-label-margin-bottom: 2rem">
    <PhBaseSelect v-model.number="wheelParams.segments" :options="segmentsList" small />
  </PhBaseLabel>
  <!-- 结果 -->
  <div class="border-tg-secondary flex-col-16 min-h-[200rem] flex flex-col items-center justify-center border-2 rounded-[4rem] border-dotted p-[16rem]">
    <template v-if="!hasResult">
      <div class="text-[14rem] leading-[1.5]">
        {{ $t('需要更多输入才能验证结果') }}
      </div>
      <div class="ani-roll">
        <IconChessFrame2 />
      </div>
    </template>
    <!-- result -->
    <div v-else class="h-full w-full">
      <AppMiniGamePartWheelResultComponent :key="diceResult" :result="diceResult" :risk="handledWheelParams.risk" :segments="handledWheelParams.segments" />
    </div>
  </div>

  <!-- 计算明细 -->
  <div v-if="!hasResult" class="flex-col-16 min-h-[200rem] flex flex-col items-center justify-center rounded-[4rem] p-[16rem]">
    <div class="ani-roll">
      <IconChessFrame2 />
    </div>
  </div>

  <!-- 有数据 -->
  <template v-if="hasResult">
    <div
      :key="`${wheelParams.clientSeed}-${wheelParams.nonce}-${wheelParams.serverSeed}`"
      class="flex-col-16 w-full flex flex-col"
    >
      <div class="w-full">
        <h6 class="text-tg-text-lightgrey mb-[8rem] text-[14rem] font-semibold leading-[1.5]">
          {{ t('最终结果') }}
        </h6>
        <div>
          <span class="text-tg-text-white text-[14rem] font-semibold leading-[1.5] font-mono">{{ diceResult }}</span>
        </div>
      </div>
      <div>
        <h6 class="text-tg-text-lightgrey mb-[8rem] text-[14rem] font-semibold leading-[1.5]">
          {{ t('赌场种子到字节') }}
        </h6>
        <SeedToBytes v-if="diceSeedToByte" :list="diceSeedToByte" />
      </div>
      <div>
        <h6 class="text-tg-text-lightgrey mb-[8rem] text-[14rem] font-semibold leading-[1.5]">
          {{ t('字节到数字') }}
        </h6>
        <BytesToNumber v-if="diceByteToNumber" :list="diceByteToNumber" />
      </div>
    </div>
  </template>
</template>

<style lang='scss' scoped>
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
</style>
