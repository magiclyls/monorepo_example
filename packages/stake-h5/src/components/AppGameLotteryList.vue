<script setup lang="ts">
import { IconPaginationArrowRight } from '@tg/icons'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import BaseGameItem from '~/components/BaseGameItem.vue'


interface Props {
  list: Array<any>
}

const props = withDefaults(defineProps<Props>(), {})
const router = useRouter()
const { t } = useI18n()
const childRef = ref()

const lotteryMap = new Map([
  [1, '/lottery/win-go'],
  [2, '/lottery/racing'],
  [3, '/lottery/k3'],
  [4, '/lottery/5d'],
  [5, '/lottery/trx-win-go'],
])

const textMap: any = {
  1002: t('WinGo_description'),
  2002: t('Racing_description'),
  3002: t('K3_description'),
  4002: t('5D_description'),
  5002: t('TrxWinGo_description'),
}

function go(game_id: string, index: number) {
  // const lotteryType = String(game_id)[0]
  // router.push(`${lotteryMap.get(Number(lotteryType))}?type=${lotteryType}` || '/')
  childRef.value[index].gameStart()
}
</script>

<template>
  <div>
    <div class="grid grid-cols-1 gap-x-[var(--sg-game-gap-x)] gap-y-[var(--sg-game-gap-y)]">
      <div v-for="item, index in list" :key="item.game_id" class="flex rounded-[6px] bg-[#0F212E] px-[6px] py-[8px]">
        <div class="w-[106px]">
          <BaseGameItem ref="childRef" :game-info="item" :show-man-count="false" />
        </div>
        <div class="ml-[10px] flex-1">
          <div class="mb-[12px] h-[25px] flex items-center justify-between font-[500]">
            <div class="text-[18px] text-[#fff]">
              {{ item.name }}
            </div>
            <div class="center h-[25px] rounded-[24px] bg-[#00E701] px-[16px] text-[16px] text-[#071824]" @click="go(item.game_id, index)">
              <span class="mr-[6px] cursor-pointer">GO</span>
              <IconPaginationArrowRight class="text-[12px]"  style="--tg-icon-color:#071824" />
            </div>
          </div>
          <div class="relative flex">
            <span class="absolute top-[3px] h-[12px] w-[2px] rounded-[6px] bg-[#1475E1]" />
            <span class="indent-[8px] text-[12px] leading-[1.5] text-[#B1BAD3]">{{ textMap[item.game_id] }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
