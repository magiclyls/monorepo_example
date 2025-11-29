<script setup lang='ts'>
import { PhBaseInput, PhBaseLabel } from '@tg/bccomponents'
import { IconChessFrame2, IconUniArrowDown, IconUniArrowUpSmall2 } from '@tg/icons'
import { useDice } from 'feie-ui'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppMiniGamePartDiceResultComponent from './AppMiniGamePartDiceResultComponent.vue'

defineOptions({
  name: 'AppMiniGameDiceCalculationPage',
})
const { t } = useI18n()

const diceParams = ref({
  clientSeed: '',
  serverSeed: '',
  nonce: 0,
})

function changeNonce(type: 'up' | 'down') {
  if (type === 'up')
    diceParams.value.nonce += 1

  else if (type === 'down' && diceParams.value.nonce > 0)
    diceParams.value.nonce -= 1
}
const {
  diceByteToNumber,
  diceResult,
  diceSeedToByte,
} = useDice(diceParams)

// 是否有结果
const hasResult = computed(() => diceResult.value !== 0)
</script>

<template>
  <!-- Plinko -->
  <PhBaseLabel class="mb-[16rem]" :label="$t('客户端种子')" style="--ph-base-label-margin-bottom: 2rem">
    <PhBaseInput v-model="diceParams.clientSeed" type="text" msg-after-touched style="--ph-base-input-padding-y: 9rem" />
  </PhBaseLabel>
  <PhBaseLabel class="mb-[16rem]" :label="$t('服务器种子')" style="--ph-base-label-margin-bottom: 2rem">
    <PhBaseInput v-model="diceParams.serverSeed" type="text" msg-after-touched style="--ph-base-input-padding-y: 9rem" />
  </PhBaseLabel>
  <PhBaseLabel class="mb-[16rem]" :label="$t('现时标志')" style="--ph-base-label-margin-bottom: 2rem">
    <PhBaseInput
      v-model.number="diceParams.nonce" style="
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
    <div v-else class="w-full">
      <AppMiniGamePartDiceResultComponent :key="diceResult" :result="diceResult" />
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
      :key="`${diceParams.clientSeed}-${diceParams.nonce}-${diceParams.serverSeed}`"
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
