<script setup lang="ts">
import { IconPaginationArrowRight } from '@tg/icons'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppCasinoGameItem from '~/components/AppCasinoGameItem.vue'

interface Props {
  list: Array<any>
}

withDefaults(defineProps<Props>(), {})
const { t } = useI18n()
const childRef = ref()

const textMap: any = {
  1002: t('WinGo说明'),
  2002: t('Racing说明'),
  3002: t('K3说明'),
  4002: t('5D说明'),
  5002: t('TrxWinGo说明'),
}

function go(game_id: string, index: number) {
  // const lotteryType = String(game_id)[0]
  // router.push(`${lotteryMap.get(Number(lotteryType))}?type=${lotteryType}` || '/')
  childRef.value[index].gameStart()
}
</script>

<template>
  <div>
    <div class="grid gap-x-[var(--ph-game-gap-x)] gap-y-[var(--ph-game-gap-y)] grid-cols-1">
      <div v-for="item, index in list" :key="item.game_id" class="flex bg-[#233846] px-[6px] py-[8px] rounded-[6px]">
        <div class="w-[106px]">
          <AppCasinoGameItem ref="childRef" :key="item.name" :data="item" :online-count="false" />
        </div>
        <div class="ml-[10px] flex-1">
          <div class="flex justify-between items-center font-[600] h-[25px] mb-[12px]">
            <div class="text-[18px] text-[#fff]">
              {{ item.name }}
            </div>
            <div class="text-[16px] center px-[16px]  rounded-[24px] bg-[#24EE89] text-[#071824]" @click="go(item.game_id, index)">
              <span class="mr-[6px] cursor-pointer">GO</span>
              <IconPaginationArrowRight class="text-[12px]" />
            </div>
          </div>
          <div class="relative flex">
            <span class="absolute top-[3px] w-[2px] h-[12px] rounded-[6px] bg-[#1475E1]" />
            <span class="text-[12px] text-[#B1BAD3] indent-[8px]">{{ textMap[item.game_id] }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
