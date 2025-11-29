<script setup lang='ts'>
import { computed } from 'vue'
import { useLocale } from '../../../components/LotteryConfigProvider'

interface Props {
  result: string[]
}

defineOptions({ name: 'AppFiveDResult' })
const props = defineProps<Props>()

const { $$t } = useLocale()

const letters = ['A', 'B', 'C', 'D', 'E']

const total = computed(() => props.result.reduce((pre, cur) => {
  return pre + Number(cur)
}, 0))
</script>

<template>
  <div class="wrap">
    <div class="flex flex-col text-[13rem] font-[500] leading-[18rem] mr-[19.6rem] ">
      <span class="mb-[4rem]">{{ $$t('开奖') }}</span>
      <span>{{ $$t('结果') }}</span>
    </div>

    <div class="flex">
      <div class="flex">
        <div v-for="item, i in result" :key="i" class="flex flex-col items-center mr-[8rem] last-of-type:mr-0">
          <div class="ball">
            {{ item }}
          </div>
          <span class="mt-[1rem] leading-[20rem] five-d-text text-[14rem]">{{ letters[i] }}</span>
        </div>
      </div>
      <div class="h-[35rem] flex items-center five-d-text1 ml-[5rem] mr-[4.64rem] text-[13rem]">
        =
      </div>
      <div class="ball total">
        {{ total }}
      </div>
    </div>
  </div>
</template>
