<script setup lang='ts'>
import { AfunBaseInput, AfunBaseLabel } from '@tg/bccomponents'
import { IconChessFrame2 } from '@tg/icons'
import { getCrashPoint } from '@tg/utils'
import { floor } from 'lodash'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AppMiniGamePartCrashGameResultComponent from './AppMiniGamePartCrashGameResultComponent.vue'

defineOptions({
  name: 'AppMiniGameCrashCalculationPage',
})
const { t } = useI18n()
const route = useRoute()

const params = ref({
  hash: route.query.hash as string,
  base_seed: route.query.base_seed as string,
})

const result = computed(() => {
  if (params.value.hash && params.value.base_seed) {
    try {
      const temp = getCrashPoint(params.value.hash, params.value.base_seed)
      if (temp)
        return temp
    }
    catch {}
  }
})
</script>

<template>
  <!-- Plinko -->
  <AfunBaseLabel class="mb-[16px]" :label="$t('散列')">
    <AfunBaseInput v-model="params.hash" type="text" msg-after-touched />
  </AfunBaseLabel>
  <AfunBaseLabel class="mb-[16px]" :label="$t('种子')">
    <AfunBaseInput v-model="params.base_seed" type="text" msg-after-touched />
  </AfunBaseLabel>

  <!-- 结果 -->
  <div class="border-tg-secondary result-root min-h-[200px] flex flex-col items-center justify-center border-2 rounded-[4px] border-dotted p-[16px]">
    <template v-if="!result">
      <div class="text-[14px] leading-[1.5]">
        {{ $t('需要更多输入才能验证结果') }}
      </div>
      <div class="ani-roll">
        <IconChessFrame2 />
      </div>
    </template>

    <!-- result -->
    <div v-else class="w-full">
      <AppMiniGamePartCrashGameResultComponent :result="result[0]" />
    </div>
  </div>

  <!-- 计算明细 -->
  <div v-if="!result" class="min-h-[200px] flex flex-col items-center justify-center rounded-[4px] p-[16px]">
    <div class="ani-roll">
      <IconChessFrame2 />
    </div>
  </div>

  <!-- 有数据 -->
  <template v-if="result">
    <div
      class="result-root w-full flex flex-col"
    >
      <div class="w-full">
        <h6 class="text-tg-text-lightgrey mb-[8px] text-[14px] font-semibold leading-[1.5]">
          {{ t('最终结果') }}
        </h6>
        <div class="scroll-x text-tg-text-white flex flex-row pb-[8px] text-sm font-semibold">
          {{ floor(result[1], 16) }}
        </div>
      </div>
      <div>
        <h6 class="text-tg-text-lightgrey mb-[8px] text-[14px] font-semibold leading-[1.5]">
          {{ t('赌场种子到十六进制') }}
        </h6>
        <div class="scroll-x text-tg-text-white text-sm font-[600] leading-[21px]">
          <span>HMAC_SHA256({{ params.hash }}, {{ params.base_seed }})</span>
          <table>
            <tr>
              <template v-for="(c, cdx) in result[2]" :key="cdx">
                <td v-if="cdx % 2 === 0" class="text-center" :class="[cdx > 0 ? 'pl-8' : '']">
                  <span class="inline-flex flex-nowrap items-center text-sm font-semibold" :class="[cdx > 6 ? 'text-tg-secondary-light' : 'text-white']">{{ c }}{{ result[2][cdx + 1] ?? '' }}</span>
                </td>
              </template>
            </tr>
          </table>
        </div>
      </div>
      <div>
        <h6 class="text-tg-text-lightgrey mb-[8px] text-[14px] font-semibold leading-[1.5]">
          {{ t('十六进制到十进制') }}
        </h6>
        <div class="scroll-x">
          <div class="text-tg-text-white w-fit flex flex-col">
            <span class="whitespace-nowrap text-sm font-semibold leading-[21px]">
              （{{ result[2].slice(0, 8).split('').join(', ') }}） = {{ result[3] }}
            </span>
            <table>
              <tbody>
                <template v-for="(h, hdx) in result[2].slice(0, 8)" :key="hdx">
                  <tr class="text-sm leading-[21px]">
                    <td class="pr-[16px] text-right">
                      <span v-show="hdx > 0">+</span>
                    </td>
                    <td class="text-right">
                      {{ Number(`0x${h}`) * Math.pow(16, 7 - hdx) }}
                    </td>
                    <td class="text-tg-secondary-light text-right">
                      (
                      {{ h }}
                      * (16 ^
                      {{ 7 - hdx }}
                      ))
                    </td>
                  </tr>
                </template>
                <tr class="text-right">
                  <td class="pr-[16px]">
                    =
                  </td>
                  <td class="text-sm font-semibold">
                    {{ result[3] }}
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div>
        <h6 class="text-tg-text-lightgrey mb-[8px] text-[14px] font-semibold leading-[1.5]">
          Raw to Edged
        </h6>
        <div class="scroll-x">
          <p class="text-tg-secondary-light font-semibold">
            4294967296
            / (
            <span class="text-tg-text-white font-semibold">{{ result[3] }}</span>
            + 1) * (1 -
            0.01
            ) =
            <span class="text-tg-text-white font-semibold">{{ floor(result[1], 16) }}</span>
          </p>
        </div>
      </div>
    </div>
  </template>
</template>

<style lang='scss' scoped>
.result-root {
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
</style>
