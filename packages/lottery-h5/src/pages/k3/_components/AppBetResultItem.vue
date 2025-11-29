<script lang="ts" setup name="AppBetResultItem">
import type { LotteryBetItem } from '@tg/types'

interface Props {
  data: LotteryBetItem[]
  extra?: LotteryBetItem[] // type2时需要
  title: string
  type: number // type 1 total, 2 特殊处理的2种色组合 ， 3 紫色，4 绿
  vertical?: boolean // vertical false时为历史记录里的 横版样式， true为投注弹窗里的竖版样式
  showTitle?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  vertical: false,
  showTitle: true,
})

function bg(item: LotteryBetItem) {
  if (props.type === 1) {
    return item.bg ? item.bg : item.even ? '#40AD72' : '#1D864C'
  }
  else if (props.type === 2) {
    return ''
  }
  else if (props.type === 3) {
    return '#B659FE'
  }
  else if (props.type === 4) {
    return '#40AD72'
  }
}
</script>

<template>
  <div
    class="flex gap-[4rem]" :class="[vertical ? 'flex-col' : 'history items-center']"
  >
    <div v-if="showTitle" class="tt text-[16rem] leading-[22rem] font-[500] k3-bet-text">
      {{ title }}
    </div>
    <div class="flex gap-[4rem] flex-wrap">
      <template v-for="(item, i) in data" :key="i">
        <div
          v-if="item.bg_img"
          v-bg-image="Number(item.label) % 2 === 0 ? '/lottery/png/ball-green.png' : '/lottery/png/ball-red.png'"
          class="k3-ball center w-[20rem] h-[20rem]"
        >
          <span
            class="txt"
            :class="[
              Number(item.label) % 2 === 0 ? 'even' : 'odd',
            ]"
          >
            {{ item.label }}
          </span>
        </div>
        <div
          v-else
          class="center rounded-[4rem] min-w-[32rem]  text-[12rem] leading-[24rem] text-[#fff]"
          :class="{
            'px-[5rem]': type !== 2,
          }"
          :style="{
            background: bg(item),
          }"
        >
          <template v-if="type === 2">
            <span class="rounded-s-[4rem] px-[5rem] bg-[#B659FE]">{{ item.label }}</span>
            <span class="rounded-e-[4rem] px-[5rem] bg-[#40AD72]">{{ extra?.map((item:LotteryBetItem) => item.label).join(',') }}</span>
          </template>
          <span v-else class="">{{ item.label }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.history {
  .tt {
    font-size: 14rem;
    line-height: 25rem;
    font-weight: 400;
  }
}
.k3-ball {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  .txt {
    font-size: 10rem;
    font-weight: 700;
  }
  .odd {
    background: linear-gradient(180deg, #f6625d 16.3%, #e93333 80.43%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .even {
    background: linear-gradient(180deg, #46c57f 13.04%, #2a995e 83.7%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
