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
      <div v-for="item, index in list" :key="item.game_id" class="flex bg-[#fff] px-[6rem] py-[8rem] rounded-[6rem]">
        <div class="w-[106rem]">
          <AppCasinoGameItem ref="childRef" :key="item.name" :data="item" />
        </div>
        <div class="ml-[10rem] flex-1">
          <div class="flex justify-between items-center font-[500] h-[25rem] mb-[12rem]">
            <div class="text-[18rem] text-[#0D2245]">
              {{ item.name }}
            </div>
            <div class="text-[16rem] text-[#fff] center px-[16rem]  rounded-[24rem] bg-[linear-gradient(339deg,#F23038_11.3%,#FF7474_82.78%)]" @click="go(item.game_id, index)">
              <span class="mr-[6rem] cursor-pointer">GO</span>
              <IconPaginationArrowRight class="text-[12rem]" />
            </div>
          </div>
          <div class="relative flex">
            <span class="absolute top-[3rem] w-[2rem] h-[12rem] rounded-[6rem] bg-[#F23038]" />
            <span class="text-[12rem] text-[#6D7693] indent-[8rem]">{{ textMap[item.game_id] }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
