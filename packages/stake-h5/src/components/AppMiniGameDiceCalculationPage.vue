<script setup lang='ts'>
import { IconChessFrame2, IconUniArrowDown, IconUniArrowUpSmall2 } from '@tg/icons'
import { useDice } from 'feie-ui'

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
  <BaseLabel class="mb-[16px]" :label="$t('client_seed')">
    <BaseInput v-model="diceParams.clientSeed" type="text" msg-after-touched />
  </BaseLabel>
  <BaseLabel class="mb-[16px]" :label="$t('server_seed')">
    <BaseInput v-model="diceParams.serverSeed" type="text" msg-after-touched />
  </BaseLabel>
  <BaseLabel class="mb-[16px]" :label="$t('present_sign')">
    <BaseInput
      v-model.number="diceParams.nonce" style="
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
    <div v-else class="w-full">
      <AppMiniGamePartDiceResultComponent :key="diceResult" :result="diceResult" />
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
      :key="`${diceParams.clientSeed}-${diceParams.nonce}-${diceParams.serverSeed}`"
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
