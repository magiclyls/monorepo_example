<script name="AppRacingRules" setup lang="ts">
import type { Ref } from 'vue'
import { computed, inject, ref } from 'vue'
import { useLocale } from '../../../components/LotteryConfigProvider'

const { $$t } = useLocale()

const currentTab = inject<Ref<number>>('currentTab', ref(2001))

const rules = [
  {
    label: $$t('选择什么', { x: `${$$t('第一名')}${$$t('至')}${$$t('第三名')}` }),
    value:
      $$t('racing第一名到第三名规则'),
  },
  {
    label: $$t('选择什么', { x: `${$$t('大')}/${$$t('小')}` }),
    value:
      $$t('racing大小规则'),
  },
  {
    label: $$t('选择什么', { x: `${$$t('单')}/${$$t('双')}` }),
    value:
      $$t('racing单双规则'),
  },
]
function transferText(value: string, t: 'm' | 's') {
  return t === 'm' ? `${value}${$$t('分钟')}` : `${value}${$$t('秒')}`
}
const times = new Map([
  [2002, [transferText('1', 'm'), transferText('55', 's'), '1440']],
  [2001, [transferText('30', 's'), transferText('25', 's'), '2880']],
  [2003, [transferText('3', 'm'), `${transferText('2', 'm')} ${transferText('55', 's')}`, '480']],
  [2004, [transferText('5', 'm'), `${transferText('4', 'm')} ${transferText('55', 's')}`, '288']],
  [2005, [transferText('10', 'm'), `${transferText('9', 'm')} ${transferText('55', 's')}`, '144']],
])
const curTime = computed<string[]>(() => times.get(currentTab.value) || ['', '', ''])
</script>

<template>
  <div class="px-[16rem] py-[12rem] racing-rules-text text-[12rem] font-[400] scroll-y">
    <h1 class="leading-[20rem]">
      {{ $$t('彩票通用规则', { x: curTime[0], y: curTime[1], n: curTime[2] }) }}
    </h1>
    <h1>{{ $$t('假设100元交易，扣除2%手续费，结算金额98') }}</h1>
    <h2>
      <ol>
        <li v-for="item, index of rules" :key="index">
          <p class="leading-[20rem] racing-rules-text font-[800]">
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
