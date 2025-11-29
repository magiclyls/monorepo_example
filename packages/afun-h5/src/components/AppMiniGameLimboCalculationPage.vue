<script setup lang='ts'>
import { AfunBaseInput, AfunBaseLabel } from '@tg/bccomponents'
import { IconChessFrame2, IconUniArrowDown, IconUniArrowUpSmall2 } from '@tg/icons'
import { toFixed } from '@tg/utils'
import { useLimbo } from 'feie-ui'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

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
  <AfunBaseLabel class="mb-[16px]" :label="$t('客户端种子')" style="--afun-base-label-margin-bottom: 2px">
    <AfunBaseInput v-model="limboParams.clientSeed" type="text" msg-after-touched style="--afun-base-input-padding-y: 9px" />
  </AfunBaseLabel>
  <AfunBaseLabel class="mb-[16px]" :label="$t('服务器种子')" style="--afun-base-label-margin-bottom: 2px">
    <AfunBaseInput v-model="limboParams.serverSeed" type="text" msg-after-touched style="--afun-base-input-padding-y: 9px" />
  </AfunBaseLabel>
  <AfunBaseLabel class="mb-[16px]" :label="$t('现时标志')" style="--afun-base-label-margin-bottom: 2px">
    <AfunBaseInput
      v-model.number="limboParams.nonce" style="
        --afun-base-input-padding-right: 0;
        --afun-base-input-padding-y: 9px
        "
    >
      <template #right>
        <div class="relative flex">
          <div
            class="bg-[#EBEBEB] flex items-center justify-center w-[32px] h-[32px] mt-[3px] rounded-[4px] mr-[2px]"
            style="--tg-icon-color:var(--tg-text-white)" @click="changeNonce('down')"
          >
            <IconUniArrowDown />
          </div>
          <div
            class="bg-[#EBEBEB] flex items-center justify-center w-[32px] h-[32px] mt-[3px] rounded-[4px] mr-[4px]"
            style="--tg-icon-color:var(--tg-text-white)" @click="changeNonce('up')"
          >
            <IconUniArrowUpSmall2 />
          </div>
          <div class="bg-tg-primary absolute left-[53px] top-[11px] h-[22px] w-[2px]" />
        </div>
      </template>
    </AfunBaseInput>
  </AfunBaseLabel>

  <!-- 结果 -->
  <div class="border-tg-secondary flex-col-16 min-h-[200px] flex flex-col items-center justify-center border-2 rounded-[4px] border-dotted p-[16px]">
    <template v-if="!hasResult">
      <div class="text-[14px] leading-[1.5]">
        {{ $t('需要更多输入才能验证结果') }}
      </div>
      <div class="ani-roll">
        <IconChessFrame2 />
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
      <IconChessFrame2 />
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
          {{ t('最终结果') }}
        </h6>
        <div>
          <span class="text-tg-text-white text-[14px] font-semibold leading-[1.5] font-mono">{{ limboResult }}</span>
        </div>
      </div>
      <div>
        <h6 class="text-tg-text-lightgrey mb-[8px] text-[14px] font-semibold leading-[1.5]">
          {{ t('赌场种子到字节') }}
        </h6>
        <SeedToBytes v-if="limboSeedToByte" :list="limboSeedToByte" />
      </div>
      <div>
        <h6 class="text-tg-text-lightgrey mb-[8px] text-[14px] font-semibold leading-[1.5]">
          {{ t('字节到数字') }}
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
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
</style>
