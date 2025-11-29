<script setup lang='ts'>
import { LotteryDialog, LotteryImage } from '@tg/bccomponents'
import { IconUniClose } from '@tg/icons'
import { computed, ref } from 'vue'
import { useLocale } from '../../../components/LotteryConfigProvider'

const props = defineProps<Props>()
const { $$t } = useLocale()
interface Props {
  type: number
  // 1,2     two same, a pair
  // 3,4     three same, any three same
  // 5,6,7   three different , three continue, two different
}

const isShow = ref(false)
const configs = [
  {
    rule: $$t('k3规则1'),
    imgs: [5, 5],
  },
  {
    rule: $$t('k3规则2'),
    imgs: [6, 1, 6],
  },
  {
    rule: $$t('k3规则3'),
    imgs: [6, 6, 6],
  },
  {
    rule: $$t('k3规则4'),
    imgs: [0, 0, 0],
  },
  {
    rule: $$t('k3规则5'),
    imgs: [1, 2, 4],
  },
  {
    rule: $$t('k3规则6'),
    imgs: [1, 2, 3],
  },
  {
    rule: $$t('k3规则7'),
    imgs: [1, 2],
  },
]
const currentConfig = computed(() => {
  return configs[props.type - 1]
})
</script>

<template>
  <div>
    <div @click="isShow = true">
      <slot />
    </div>
    <LotteryDialog v-model="isShow" :show-header="false" :show-footer="false" :max-size="[300, 800]" style="--lot-dialog-container-bg: transparent;">
      <div class="relative px-[16rem] py-[30rem] text-[12rem] font-[400] app-dialog-rules-bg rounded-[6rem]">
        <div class="center gap-[20rem]">
          <LotteryImage v-for="n in currentConfig.imgs" :key="n" class="w-[45rem]" :url="`/lottery/png/dice-solo-${n}.png`" />
        </div>
        <div class="mt-[6rem]">
          {{ currentConfig.rule }}
        </div>
      </div>
      <div class="center mt-[11rem]">
        <div
          class="center w-[22rem] h-[22rem] cursor-pointer rounded-full text-[#fff] border-[2rem] border-[#fff]"
          @click="isShow = false"
        >
          <IconUniClose class="text-[12rem]" />
        </div>
      </div>
    </LotteryDialog>
  </div>
</template>

<style lang='scss' scoped>

</style>
