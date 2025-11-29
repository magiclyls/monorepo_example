<script lang="ts" setup>
import { SSBaseButton } from '@tg/bccomponents'
import { computed, inject } from 'vue'

interface Props {
  type: number
}
defineOptions({ name: 'AppMultiBetExplainDialog' })
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })

const content = computed(() => {
  switch (props.type) {
    case 1:
      return {
        title: '3串4',
        text1: '3串4是由3场赛事组成的4个注单。',
        text2: '选择3场赛事投注3串4时，系统将选择的3场赛事中拆出一个3个2串1以及1个3串1,一个串关为一单即一共4个注单。',
      }
    case 2:
      return {
        title: '4串11',
        text1: '4串11是由4场赛事组成的11个注单。',
        text2: '选择4场赛事投注4串11时，系统将选择的4场赛事中拆出一个6个2串1,4个3串1以及1个4串1,一个串关为一单即一共11个注单。',
      }
    case 3:
      return {
        title: '5串26',
        text1: '5串26是由5场赛事组成的26个注单。',
        text2: '选择5场赛事投注5串26时，系统将选择的5场赛事中拆出一个10个2串1,10个3串1,5个4串1以及1个5串1,一个串关为一单即一共26个注单。',
      }
    case 4:
      return {
        title: '6串57',
        text1: '6串57是由6场赛事组成的26个注单。',
        text2: '选择6场赛事投注6串57时，系统将选择的6场赛事中拆出一个15个2串1,20个3串1,15个4串1,6个5串1以及1个6串1,一个串关为一单即一共57个注单。',
      }
    case 5:
      return {
        title: '7串120',
        text1: '7串120是由7场赛事组成的120个注单。',
        text2: '选择7场赛事投注7串120时，系统将选择的7场赛事中拆出一个21个2串1,35个3串1,35个4串1,21个5串1,7个6串1以及1个7串1,一个串关为一单即一共120个注单。',
      }
    case 6:
      return {
        title: '8串247',
        text1: '8串247是由8场赛事组成的247个注单。',
        text2: '选择8场赛事投注8串247时，系统将选择的8场赛事中拆出一个28个2串1,57个3串1,70个4串1,56个5串1,28个6串1,8个7串1以及1个8串1,一个串关为一单即一共247个注单。',
      }
    case 7:
      return {
        title: '9串502',
        text1: '9串502是由9场赛事组成的502个注单。',
        text2: '选择9场赛事投注9串502时，系统将选择的9场赛事中拆出一个36个2串1,84个3串1,126个4串1,126个5串1,84个6串1,36个7串1,9个8串1以及1个9串1,一个串关为一单即一共502个注单。',
      }
    case 8:
      return {
        title: '10串1013',
        text1: '10串1013是由10场赛事组成的1013个注单。',
        text2: '选择10场赛事投注10串1013时，系统将选择的10场赛事中拆出一个45个2串1,120个3串1,210个4串1,252个5串1,210个6串1,120个7串1,45个8串1,10个9串1以及1个10串1,一个串关为一单即一共1013个注单。',
      }
    case 9:
      return {
        title: '2串1',
        text1: '2串1是由2场赛事组成的1个注单。',
        text2: '选择2场赛事投注2串1时，系统将选择的2场赛事中合并为一个注单，2场赛事必须全赢才可以获得盈利。',
      }
    case 10:
      return {
        title: '3串1',
        text1: '3串1是由3场赛事组成的1个注单。',
        text2: '选择3场赛事投注3串1时，系统将选择的3场赛事中合并为一个注单，3场赛事必须全赢才可以获得盈利。',
      }
    case 11:
      return {
        title: '4串1',
        text1: '4串1是由4场赛事组成的1个注单。',
        text2: '选择3场赛事投注4串1时，系统将选择的4场赛事中合并为一个注单，4场赛事必须全赢才可以获得盈利。',
      }
    case 12:
      return {
        title: '5串1',
        text1: '5串1是由5场赛事组成的1个注单。',
        text2: '选择5场赛事投注5串1时，系统将选择的5场赛事中合并为一个注单，5场赛事必须全赢才可以获得盈利。',
      }
    case 13:
      return {
        title: '6串1',
        text1: '6串1是由6场赛事组成的1个注单。',
        text2: '选择6场赛事投注6串1时，系统将选择的6场赛事中合并为一个注单，6场赛事必须全赢才可以获得盈利。',
      }
    case 14:
      return {
        title: '7串1',
        text1: '7串1是由7场赛事组成的1个注单。',
        text2: '选择7场赛事投注7串1时，系统将选择的7场赛事中合并为一个注单，7场赛事必须全赢才可以获得盈利。',
      }
    case 15:
      return {
        title: '8串1',
        text1: '8串1是由8场赛事组成的1个注单。',
        text2: '选择8场赛事投注8串1时，系统将选择的8场赛事中合并为一个注单，8场赛事必须全赢才可以获得盈利。',
      }
    case 16:
      return {
        title: '9串1',
        text1: '9串1是由9场赛事组成的1个注单。',
        text2: '选择9场赛事投注9串1时，系统将选择的9场赛事中合并为一个注单，9场赛事必须全赢才可以获得盈利。',
      }
    case 17:
      return {
        title: '10串1',
        text1: '10串1是由10场赛事组成的1个注单。',
        text2: '选择10场赛事投注10串1时，系统将选择的10场赛事中合并为一个注单，10场赛事必须全赢才可以获得盈利。',
      }
    default :
      return {}
  }
})
</script>

<template>
  <div class="w-[263rem] overflow-hidden rounded-[6rem]">
    <header class="theme-header h-[42rem] flex items-center justify-center text-[18rem] font-semibold">
      <span class="mr-[6rem]">什么是</span>{{ content.title }}
    </header>
    <div class="theme-content flex flex-col px-[16rem] pb-[17rem] pt-[13rem]">
      <div class="mb-[23rem] font-medium">
        {{ content.text1 }}
      </div>
      <div class="mb-[23rem] font-medium">
        {{ content.text2 }}
      </div>
      <div class="flex items-center justify-center">
        <SSBaseButton class="h-[36rem] w-[140rem]" size="none" @click="closeDialog">
          我知道了
        </SSBaseButton>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --ss-spt-multi-bet-explain-dialog-bg1: #f6f7f8;
  --ss-spt-multi-bet-explain-dialog-bg2: #fff;
  --ss-spt-multi-bet-explain-dialog-color1: #0d2245;
  --ss-spt-multi-bet-explain-dialog-color2: #6d7693;
}
</style>

<style lang="scss" scoped>
.theme-header {
  background-color: var(--ss-spt-multi-bet-explain-dialog-bg1);
  color: var(--ss-spt-multi-bet-explain-dialog-color1);
}
.theme-content {
  background-color: var(--ss-spt-multi-bet-explain-dialog-bg2);
  color: var(--ss-spt-multi-bet-explain-dialog-color2);
}
</style>
