<script setup lang='ts'>
import { AfunBaseInput, AfunBaseLabel, AfunBaseSelect } from '@tg/bccomponents'
import { IconChessFrame2, IconUniArrowDown, IconUniArrowUpSmall2 } from '@tg/icons'
import { usePlinko } from 'feie-ui'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'AppMiniGamePlinkoCalculationPage',
})
const { t } = useI18n()

const plinkoParams = ref({
  clientSeed: '',
  serverSeed: '',
  nonce: 0,
  line: 16,
  level: 'low',
})
const levelList = [
  { value: 'low', label: t('低等') },
  { value: 'middle', label: t('中等') },
  { value: 'high', label: t('高等') },
]
const rowList = [
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10' },
  { value: 11, label: '11' },
  { value: 12, label: '12' },
  { value: 13, label: '13' },
  { value: 14, label: '14' },
  { value: 15, label: '15' },
  { value: 16, label: '16' },
]
function changeNonce(type: 'up' | 'down') {
  if (type === 'up')
    plinkoParams.value.nonce += 1

  else if (type === 'down' && plinkoParams.value.nonce > 0)
    plinkoParams.value.nonce -= 1
}
const {
  plinkoPay,
  plinkoResultList,
  plinkoOdds,
  plinkoSeedToByte,
  plinkoByteToNumber,
  plinkoResult,
  plinkoMulNum,
} = usePlinko(plinkoParams)
const prizeIndex = computed(() => {
  if (plinkoPay.value && plinkoPay.value.length > 0) {
    const str = plinkoPay.value.join(' + ')
    return str
  }
  return ''
})

// 是否有结果
const hasResult = computed(() => plinkoMulNum.value !== 0)
</script>

<template>
  <!-- Plinko -->
  <AfunBaseLabel class="mb-[16px]" :label="$t('客户端种子')" style="--afun-base-label-margin-bottom: 2px">
    <AfunBaseInput
      v-model="plinkoParams.clientSeed" type="text" msg-after-touched
      style="
    --afun-base-input-padding-y: 9px
    "
    />
  </AfunBaseLabel>
  <AfunBaseLabel class="mb-[16px]" :label="$t('服务器种子')" style="--afun-base-label-margin-bottom: 2px">
    <AfunBaseInput
      v-model="plinkoParams.serverSeed" type="text" msg-after-touched
      style="
    --afun-base-input-padding-y: 9px
    "
    />
  </AfunBaseLabel>
  <AfunBaseLabel class="mb-[16px]" :label="$t('现时标志')" style="--afun-base-label-margin-bottom: 2px">
    <AfunBaseInput
      v-model.number="plinkoParams.nonce" style="
        --afun-base-input-padding-right: 0;
        --afun-base-input-padding-y: 9px
        "
    >
      <template #right>
        <div class="relative flex">
          <div
            class="bg-[#2f4553] flex items-center justify-center w-[32px] h-[32px] mt-[3px] rounded-[4px] mr-[2px]"
            style="--tg-icon-color:var(--tg-text-white)" @click="changeNonce('down')"
          >
            <IconUniArrowDown />
          </div>
          <div
            class="bg-[#2f4553] flex items-center justify-center w-[32px] h-[32px] mt-[3px] rounded-[4px] mr-[4px]"
            style="--tg-icon-color:var(--tg-text-white)" @click="changeNonce('up')"
          >
            <IconUniArrowUpSmall2 />
          </div>
          <div class="bg-tg-primary absolute left-[53px] top-[11px] h-[22px] w-[2px]" />
        </div>
      </template>
    </AfunBaseInput>
  </AfunBaseLabel>
  <AfunBaseLabel class="mb-[16px]" :label="$t('风险')" style="--afun-base-label-margin-bottom: 2px">
    <AfunBaseSelect
      v-model="plinkoParams.level" :options="levelList" style="
        --tg-base-select-style-padding-y:7px;
        --tg-base-select-style-padding-x:7px;
        "
    />
  </AfunBaseLabel>
  <AfunBaseLabel class="mb-[16px]" :label="$t('排数')" style="--afun-base-label-margin-bottom: 2px">
    <AfunBaseSelect
      v-model="plinkoParams.line" :options="rowList" style="
        --tg-base-select-style-padding-y:7px;
        --tg-base-select-style-padding-x:7px;
        "
    />
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
    <ResultPlinko
      v-if=" hasResult" :key="`${plinkoResult}-${plinkoMulNum}-${plinkoParams.line}`" class="mx-auto" :index="plinkoResult"
      :result="(+plinkoMulNum).toFixed(1).toString()"
      :row="plinkoParams.line.toString()"
    />
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
      :key="`${plinkoParams.clientSeed}-${plinkoParams.level}-${plinkoParams.line}-${plinkoParams.nonce}-${plinkoParams.serverSeed}`"
      class="flex-col-16 w-full flex flex-col"
    >
      <div class="w-full">
        <h6 class="text-tg-text-lightgrey mb-[8px] text-[14px] font-semibold leading-[1.5]">
          {{ t('最终结果') }}
        </h6>
        <div class="max-w-full w-full overflow-x-scroll">
          <span v-if="plinkoPay && plinkoPay.length > 0" class="text-tg-text-white text-[14px] font-semibold leading-[1.5] font-mono">
            {{ t('支付指数：') }}{{ prizeIndex }} = {{ plinkoResult }}
          </span>
          <table class="mt-[16px] w-full">
            <tbody>
              <tr>
                <td
                  v-for="n, i in plinkoResultList" :key="i" :class="{ 'pl-16': i > 0 }"
                  class="text-tg-text-white text-center text-[14px] font-semibold leading-[1.5] font-mono"
                >
                  {{ n }}
                </td>
              </tr>
              <tr>
                <td
                  v-for="n, i in plinkoOdds" :key="i" :class="{ 'pl-16': i > 0 }"
                  class="text-tg-text-white text-center text-[14px] font-semibold leading-[1.5] font-mono"
                >
                  {{ n }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h6 class="text-tg-text-lightgrey mb-[8px] text-[14px] font-semibold leading-[1.5]">
          {{ t('赌场种子到字节') }}
        </h6>
        <SeedToBytes v-if="plinkoSeedToByte" :list="plinkoSeedToByte" />
      </div>
      <div>
        <h6 class="text-tg-text-lightgrey mb-[8px] text-[14px] font-semibold leading-[1.5]">
          {{ t('字节到数字') }}
        </h6>
        <BytesToNumber v-if="plinkoByteToNumber" :list="plinkoByteToNumber" />
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
