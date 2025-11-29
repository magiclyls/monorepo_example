<script setup lang='ts'>
import { LotteryDialog } from '@tg/bccomponents'
import { ref } from 'vue'
import { useLocale, useProjectName } from '../../../components/LotteryConfigProvider'

const { $$t } = useLocale()
const isShow = ref(false)

const list = [
  {
    type: 1,
    label: $$t('k3玩法p1'),
  },
  {
    type: 2,
    label: $$t('k3玩法h1'),
  },
  {
    type: 1,
    label: $$t('k3玩法p2'),
  },
  {
    type: 2,
    label: $$t('k3玩法h2'),
  },
  {
    type: 1,
    label: $$t('k3玩法p3'),
  },
  {
    type: 2,
    label: $$t('k3玩法h3'),
  },
  {
    type: 1,
    label: $$t('k3玩法p4'),
  },
  {
    type: 2,
    label: $$t('k3玩法h4'),
  },
  {
    type: 1,
    label: $$t('k3玩法p5'),
  },
  {
    type: 2,
    label: $$t('k3玩法h5'),
  },
  {
    type: 1,
    label: $$t('k3玩法p6'),
  },
  {
    type: 2,
    label: $$t('k3玩法h6'),
  },
  {
    type: 1,
    label: $$t('k3玩法p7'),
  },
  {
    type: 2,
    label: $$t('k3玩法h7'),
  },
  {
    type: 1,
    label: $$t('k3玩法p8'),
  },

]
</script>

<template>
  <div class="">
    <div @click="isShow = true">
      <slot />
    </div>
    <LotteryDialog v-model="isShow" :title="$$t('玩法说明')" :max-size="[264, 371]" :close-text="$$t('关闭')" :project="useProjectName()">
      <div class="px-[16rem] py-[12rem] text-[#6D7693] text-[12rem] leading-[20rem] font-[400] scroll-y">
        <p
          v-for="(item, i) in list" :key="i" :class="{
            'font-[700]': item.type === 2,
          }"
        >
          {{ item.label }}
        </p>
      </div>
    </LotteryDialog>
  </div>
</template>

<style lang='scss' scoped>

</style>
