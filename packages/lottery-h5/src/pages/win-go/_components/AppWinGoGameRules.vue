<script name="AppWinGoGameRules" setup lang="ts">
import type { Ref } from 'vue'
import { computed, inject, ref } from 'vue'
import { useLocale } from '../../../components/LotteryConfigProvider'

const { $$t } = useLocale()

const currentTab = inject<Ref<number>>('currentTab', ref(1001))

const rules = [
  {
    label: $$t('选择什么', { x: $$t('绿色') }),
    value:
      $$t('wingo绿色规则'),
  },
  {
    label: $$t('选择什么', { x: $$t('红色') }),
    value:
      $$t('wingo红色规则'),
  },
  {
    label: $$t('选择什么', { x: $$t('紫色') }),
    value:
      $$t('wingo紫色规则'),
  },
  {
    label: $$t('选择什么', { x: $$t('号码') }),
    value:
      $$t('wingo号码规则'),
  },
  {
    label: $$t('选择什么', { x: $$t('大') }),
    value:
      $$t('wingo大规则'),
  },
  {
    label: $$t('选择什么', { x: $$t('小') }),
    value:
      $$t('wingo小规则'),
  },
]
function transferText(value: string, t: 'm' | 's') {
  return t === 'm' ? `${value}${$$t('分钟')}` : `${value}${$$t('秒')}`
}
const times = new Map([
  [1002, [transferText('1', 'm'), transferText('55', 's'), '1440']],
  [1001, [transferText('30', 's'), transferText('25', 's'), '2880']],
  [1003, [transferText('3', 'm'), `${transferText('2', 'm')} ${transferText('55', 's')}`, '480']],
  [1004, [transferText('5', 'm'), `${transferText('4', 'm')} ${transferText('55', 's')}`, '288']],
  [1005, [transferText('10', 'm'), `${transferText('9', 'm')} ${transferText('55', 's')}`, '144']],
])
const curTime = computed<string[]>(() => times.get(currentTab.value) || ['', ''])
</script>

<template>
  <div class="px-[16rem] py-[12rem] wingo-rules-text text-[12rem] font-[400] scroll-y">
    <h1 class="leading-[20rem]">
      {{ $$t('彩票通用规则', { x: curTime[0], y: curTime[1], n: curTime[2] }) }}
    </h1>
    <h1>{{ $$t('假设100元交易，扣除2%手续费，结算金额98') }}</h1>
    <h2>
      <ol>
        <li v-for="item, index of rules" :key="index">
          <p class="leading-[20rem] wingo-rules-text1 font-[800]">
            {{ `${index + 1}. ${item.label}:` }}
          </p>
          <p class="leading-[20rem]">
            {{ item.value }}
          </p>
        </li>
      </ol>
    </h2>
  </div>
</template>
