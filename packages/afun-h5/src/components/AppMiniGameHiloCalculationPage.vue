<script setup lang='ts'>
import { AfunBaseInput, AfunBaseLabel } from '@tg/bccomponents'
import { IconChessFrame2, IconUniArrowDown, IconUniArrowUpSmall2 } from '@tg/icons'
import { useHilo } from 'feie-ui'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppMiniGamePartHiloResultComponent from './AppMiniGamePartHiloResultComponent.vue'

defineOptions({
  name: 'AppMiniGameHiloCalculationPage',
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
  result,
  byteToNumber,
  seedToByte,
} = useHilo(params)

// 是否有结果
const hasResult = computed(() => result.value && result.value.numResult && result.value.numResult.length)
</script>

<template>
  <!-- Plinko -->
  <AfunBaseLabel class="mb-[16px]" :label="$t('客户端种子')" style="--afun-base-label-margin-bottom: 2px">
    <AfunBaseInput v-model="params.clientSeed" type="text" msg-after-touched style="--afun-base-input-padding-y: 9px" />
  </AfunBaseLabel>
  <AfunBaseLabel class="mb-[16px]" :label="$t('服务器种子')" style="--afun-base-label-margin-bottom: 2px">
    <AfunBaseInput v-model="params.serverSeed" type="text" msg-after-touched style="--afun-base-input-padding-y: 9px" />
  </AfunBaseLabel>
  <AfunBaseLabel class="mb-[16px]" :label="$t('现时标志')" style="--afun-base-label-margin-bottom: 2px">
    <AfunBaseInput
      v-model.number="params.nonce" style="
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
    <div v-else class="w-full">
      <AppMiniGamePartHiloResultComponent :result="result.numResult" />
    </div>
  </div>

  <!-- 计算明细 -->
  <div v-if="!hasResult" class="flex-col-16 min-h-200 flex flex-col items-center justify-center rounded-[4px] p-16">
    <div class="ani-roll">
      <IconChessFrame2 />
    </div>
  </div>

  <!-- 有数据 -->
  <template v-if="hasResult">
    <div
      :key="`${params.clientSeed}-${params.nonce}-${params.serverSeed}`"
      class="flex-col-16 w-full flex flex-col"
    >
      <div class="w-full">
        <h6 class="text-tg-text-lightgrey mb-[8px] text-[14px] font-semibold leading-[1.5]">
          {{ t('最终结果') }}
        </h6>
        <div class="scroll-x flex-row-8 flex flex-row pb-[8px]">
          <div v-for="(item, idx) in result.numResult" :key="idx" class="flex flex-col items-center">
            <div class="text-tg-text-white flex flex-row text-[14px] font-semibold leading-[1.5] font-mono">
              <span>{{ item }}</span>
            </div>
            <div class="text-tg-text-white flex flex-row text-[14px] font-semibold leading-[1.5] font-mono">
              <span>{{ result.pokerResult[idx] }}</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h6 class="text-tg-text-lightgrey mb-[8px] text-[14px] font-semibold leading-[1.5]">
          {{ t('赌场种子到字节') }}
        </h6>
        <SeedToBytes v-if="seedToByte" :list="seedToByte" />
      </div>
      <div>
        <h6 class="text-tg-text-lightgrey mb-[8px] text-[14px] font-semibold leading-[1.5]">
          {{ t('字节到数字') }}
        </h6>
        <BytesToNumber v-if="byteToNumber" :list="byteToNumber" />
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
.flex-row-8 {
  > *:not(:first-child) {
    margin-left: var(--tg-spacing-8);
  }
}
</style>
