<script setup lang='ts'>
import { PhBaseInput, PhBaseLabel } from '@tg/bccomponents'
import { IconChessFrame2, IconUniArrowDown, IconUniArrowUpSmall2 } from '@tg/icons'
import { useBlackJack } from 'feie-ui'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppMiniGamePartBlackjackGameResultComponent from './AppMiniGamePartBlackjackGameResultComponent.vue'

defineOptions({
  name: 'AppMiniGameBlackJackCalculationPage',
})
const { t } = useI18n()

const params = ref({
  clientSeed: '',
  serverSeed: '',
  nonce: 0,
})

function changeNonce(type: 'up' | 'down') {
  if (type === 'up')
    params.value.nonce += 1

  else if (type === 'down' && params.value.nonce > 0)
    params.value.nonce -= 1
}
const {
  byteToNumber,
  seedToByte,
  result,
} = useBlackJack(params)

// 是否有结果
const hasResult = computed(() => result.value && result.value.numResult && result.value.numResult.length)
</script>

<template>
  <!-- Plinko -->
  <PhBaseLabel class="mb-[16rem]" :label="$t('客户端种子')" style="--ph-base-label-margin-bottom: 2rem">
    <PhBaseInput v-model="params.clientSeed" type="text" msg-after-touched style="--ph-base-input-padding-y: 9rem" />
  </PhBaseLabel>
  <PhBaseLabel class="mb-[16rem]" :label="$t('服务器种子')" style="--ph-base-label-margin-bottom: 2rem">
    <PhBaseInput v-model="params.serverSeed" type="text" msg-after-touched style="--ph-base-input-padding-y: 9rem" />
  </PhBaseLabel>
  <PhBaseLabel class="mb-[16rem]" :label="$t('现时标志')" style="--ph-base-label-margin-bottom: 2rem">
    <PhBaseInput
      v-model.number="params.nonce" style="
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
  <div class="border-tg-secondary min-h-[200rem] flex flex-col items-center justify-center border-2 rounded-[4rem] border-dotted p-16">
    <template v-if="!hasResult">
      <div class="text-[14rem] leading-[1.5]">
        {{ $t('需要更多输入才能验证结果') }}
      </div>
      <div class="ani-roll mt-16">
        <IconChessFrame2 />
      </div>
    </template>

    <!-- result -->
    <div v-else class="w-full">
      <AppMiniGamePartBlackjackGameResultComponent :result="result.numResult" />
    </div>
  </div>

  <!-- 计算明细 -->
  <div v-if="!hasResult" class="min-h-[200rem] flex flex-col items-center justify-center rounded-[4rem] p-16">
    <div class="ani-roll">
      <IconChessFrame2 />
    </div>
  </div>

  <!-- 有数据 -->
  <template v-if="hasResult">
    <div
      :key="`${params.clientSeed}-${params.nonce}-${params.serverSeed}`"
      class="hasresult-root w-full flex flex-col"
    >
      <div class="w-full">
        <h6 class="text-tg-text-lightgrey mb-[8rem] text-[14rem] font-semibold leading-[1.5]">
          {{ t('最终结果') }}
        </h6>
        <div class="scroll-x flex flex-row pb-[8rem]">
          <div v-for="(item, idx) in result.numResult" :key="idx" class="flex flex-col items-center">
            <div class="text-tg-text-white flex flex-row text-[14rem] font-semibold leading-[1.5] font-mono">
              <span>{{ item }}</span>
            </div>
            <div class="text-tg-text-white flex flex-row text-[14rem] font-semibold leading-[1.5] font-mono">
              <span>{{ result.pokerResult[idx] }}</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h6 class="text-tg-text-lightgrey mb-[8rem] text-[14rem] font-semibold leading-[1.5]">
          {{ t('赌场种子到字节') }}
        </h6>
        <SeedToBytes v-if="seedToByte" :list="seedToByte" />
      </div>
      <div>
        <h6 class="text-tg-text-lightgrey mb-[8rem] text-[14rem] font-semibold leading-[1.5]">
          {{ t('字节到数字') }}
        </h6>
        <BytesToNumber v-if="byteToNumber" :list="byteToNumber" />
      </div>
    </div>
  </template>
</template>

<style lang='scss' scoped>
.hasresult-root {
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
  .scroll-x {
    > *:not(:first-child) {
      margin-left: var(--tg-spacing-8);
    }
  }
}
</style>
