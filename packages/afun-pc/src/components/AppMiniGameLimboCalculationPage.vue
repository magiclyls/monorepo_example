<script setup lang='ts'>
import { IconUniArrowDown, IconChessFrame2, IconUniArrowUpSmall2 } from '@tg/icons'
import { useLimbo } from 'feie-ui'

defineOptions({
  name: 'AppMiniGameLimboCalculationPage',
})
const { t } = useI18n()

const limboParams = ref({
  clientSeed: '',
  serverSeed: '',
  nonce: 0,
})

const { limboByteToNumber, limboResult, limboSeedToByte, limboRwoToEdged } = useLimbo(limboParams)

// 是否有结果
const hasResult = computed(() => !!limboResult.value)

function changeNonce(type: 'up' | 'down') {
  if (type === 'up')
    limboParams.value.nonce += 1

  else if (type === 'down' && limboParams.value.nonce > 0)
    limboParams.value.nonce -= 1
}
</script>

<template>
  <!-- Plinko -->
  <BaseLabel class="mb-[16px]" :label="$t('client_seed')">
    <BaseInput v-model="limboParams.clientSeed" type="text" msg-after-touched />
  </BaseLabel>
  <BaseLabel class="mb-[16px]" :label="$t('server_seed')">
    <BaseInput v-model="limboParams.serverSeed" type="text" msg-after-touched />
  </BaseLabel>
  <BaseLabel class="mb-[16px]" :label="$t('present_sign')">
    <BaseInput
      v-model.number="limboParams.nonce" style="
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
    <div v-else class="w-full text-center">
      <div class="text-tg-text-white text-[18px] font-semibold leading-[27px]" style="font-family: proxima-nova, sans-serif;">
        {{ toFixed(limboResult) }} ×
      </div>
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
      :key="`${limboParams.clientSeed}-${limboParams.nonce}-${limboParams.serverSeed}`"
      class="flex-col-16 w-full flex flex-col"
    >
      <div class="w-full">
        <h6 class="text-tg-text-lightgrey mb-[8px] text-[14px] font-semibold leading-[1.5]">
          {{ t('verify_final_result') }}
        </h6>
        <div>
          <span class="text-tg-text-white text-[14px] font-semibold leading-[1.5] font-mono">{{ limboResult }}</span>
        </div>
      </div>
      <div>
        <h6 class="text-tg-text-lightgrey mb-[8px] text-[14px] font-semibold leading-[1.5]">
          {{ t('verify_social_casino_seeds_toBytes') }}
        </h6>
        <SeedToBytes v-if="limboSeedToByte" :list="limboSeedToByte" />
      </div>
      <div>
        <h6 class="text-tg-text-lightgrey mb-[8px] text-[14px] font-semibold leading-[1.5]">
          {{ t('verify_bytes_to_number') }}
        </h6>
        <BytesToNumber v-if="limboByteToNumber" :list="limboByteToNumber" />
      </div>
      <div>
        <h6 class="text-tg-text-lightgrey mb-[8px] text-[14px] font-semibold leading-[1.5]">
          Raw to Edged
        </h6>
        <span class="text-tg-text-white mb-[8px] text-[14px] font-semibold leading-[1.5] tracking-widest">{{ limboRwoToEdged }}</span>
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
