<script setup lang='ts'>
import { AfunBaseInput, AfunBaseLabel, AfunBaseSelect } from '@tg/bccomponents'
import { IconChessFrame2, IconUniArrowDown, IconUniArrowUpSmall2 } from '@tg/icons'
import { useMines } from 'feie-ui'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppMiniGamePartMinesGameResultComponents from './AppMiniGamePartMinesGameResultComponents.vue'

defineOptions({
  name: 'AppMiniGameMinesCalculationPage',
})
const { t } = useI18n()

const minesParams = ref({
  clientSeed: '',
  serverSeed: '',
  nonce: 0,
  mines: 0,
})
const minesList = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 },
  { label: '11', value: 11 },
  { label: '12', value: 12 },
  { label: '13', value: 13 },
  { label: '14', value: 14 },
  { label: '15', value: 15 },
  { label: '16', value: 16 },
  { label: '17', value: 17 },
  { label: '18', value: 18 },
  { label: '19', value: 19 },
  { label: '20', value: 20 },
  { label: '21', value: 21 },
  { label: '22', value: 22 },
  { label: '23', value: 23 },
  { label: '24', value: 24 },
]
const openByPlayerList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
const { resultMap, byteToNumber, seedToByte } = useMines(minesParams)
// 是否有结果
const hasResult = computed(() => (minesParams.value.clientSeed || minesParams.value.serverSeed) && minesParams.value.mines)

function changeNonce(type: 'up' | 'down') {
  if (type === 'up')
    minesParams.value.nonce += 1

  else if (type === 'down' && minesParams.value.nonce > 0)
    minesParams.value.nonce -= 1
}
</script>

<template>
  <!-- Plinko -->
  <AfunBaseLabel class="mb-[16px]" :label="$t('客户端种子')" style="--afun-base-label-margin-bottom: 2px">
    <AfunBaseInput v-model="minesParams.clientSeed" type="text" msg-after-touched style="--afun-base-input-padding-y: 9px" />
  </AfunBaseLabel>
  <AfunBaseLabel class="mb-[16px]" :label="$t('服务器种子')" style="--afun-base-label-margin-bottom: 2px">
    <AfunBaseInput v-model="minesParams.serverSeed" type="text" msg-after-touched style="--afun-base-input-padding-y: 9px" />
  </AfunBaseLabel>
  <AfunBaseLabel class="mb-[16px]" :label="$t('现时标志')" style="--afun-base-label-margin-bottom: 2px">
    <AfunBaseInput
      v-model.number="minesParams.nonce" style="
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
          <div class="bg-tg-primary absolute left-53 top-11 h-22 w-2" />
        </div>
      </template>
    </AfunBaseInput>
  </AfunBaseLabel>
  <AfunBaseLabel class="mb-[16px]" label="Mines" style="--afun-base-label-margin-bottom: 2px">
    <AfunBaseSelect
      v-model="minesParams.mines" :options="minesList" style="
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
    <div v-else class="w-full">
      <AppMiniGamePartMinesGameResultComponents
        :key="`${minesParams.clientSeed}-${minesParams.serverSeed}-${minesParams.nonce}-${minesParams.mines}`"
        :mines="resultMap.renderValues" :open-by-player-list="openByPlayerList"
      />
    </div>
  </div>

  <!-- 计算明细 -->
  <div v-if="!hasResult" class="flex-col-16 min-h-[200px] flex flex-col items-center justify-center rounded-[4px] p-16">
    <div class="ani-roll">
      <IconChessFrame2 />
    </div>
  </div>

  <!-- 有数据 -->
  <template v-if="hasResult">
    <div
      :key="`${minesParams.clientSeed}-${minesParams.nonce}-${minesParams.serverSeed}`"
      class="flex-col-16 w-full flex flex-col"
    >
      <div class="w-full">
        <h6 class="text-tg-text-lightgrey mb-[8px] text-[14px] font-semibold leading-[1.5]">
          {{ t('最终结果') }}
        </h6>
        <div class="flex-col-16 flex flex-col">
          <span class="text-tg-text-white text-[14px] font-semibold leading-[1.5] font-mono">
            {{ t('数值') }}{{ t('冒号') }}{{ resultMap.renderValues.join(', ') }}
          </span>
          <div>
            <p class="text-tg-text-white text-[14px] font-semibold leading-[1.5] font-mono">
              x = (value mod 5) + 1
            </p>
            <p class="text-tg-text-white text-[14px] font-semibold leading-[1.5] font-mono">
              y = 5 - floor(value / 5)
            </p>
            <p class="text-tg-text-white text-[14px] font-semibold leading-[1.5] font-mono">
              (x, y) {{ t('从左下方开始') }}
            </p>
          </div>
          <span class="text-tg-text-white text-[14px] font-semibold leading-[1.5] font-mono">
            {{ t('地雷坐标') }}{{ t('冒号') }}{{ resultMap.minesCoordinate.join(', ') }}
          </span>
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
      <div>
        <h6 class="text-tg-text-lightgrey mb-[8px] text-[14px] font-semibold leading-[1.5]">
          {{ t('数字到洗牌') }}
        </h6>
        <div class="text-tg-text-white scroll-x w-full text-[14px] font-mono">
          <div v-for="(item, index) in resultMap.numberToShuffle" :key="index" class="flex-row-1points4 flex items-center">
            <span
              v-for="(cItem, cIndex) in item"
              :key="cIndex" class="px-[4px]"
            >
              <span
                class="inline-block leading-[21px]"
                :class="{
                  'bg-[#1475e1] ': resultMap.values[index] === cItem && cItem !== 0,
                }"
              >
                {{ cItem }}
              </span>

            </span>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<style lang='scss' scoped>
.flex-row-1points4 {
  > *:not(:first-child) {
    margin-left: 1.4px;
  }
}
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
</style>
