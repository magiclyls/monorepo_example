<script setup lang='ts'>
import { SSBaseSkeleton } from '@tg/bccomponents'
import { computed } from 'vue'

defineOptions({
  name: 'AppSportsMarketInfoZhcnSkeleton',
})
const props = defineProps<{ num: number, si?: string | number }>()

const isFootBall = computed(() => props.si && +props.si === 1)
</script>

<template>
  <div
    v-for="item, in num" :key="item"
    class="border-b-[var(--ss-secondaryAccordion-show-more-border-color)] flex flex-col border-solid p-[10rem] pr-[4rem] pt-[4rem] text-[14rem] font-semibold"
    :class="item === num ? '' : 'border-b-[2rem]'"
  >
    <div class="mb-[5rem] flex justify-between">
      <!-- 左 -->
      <div class="flex flex-col leading-[20rem]">
        <!-- 状态 -->
        <div class="mb-[5rem] flex items-center">
          <SSBaseSkeleton animated="ani-opacity" width="100rem" height="18rem" />
        </div>
        <!-- 主队名 -->
        <div class="mb-[5rem] h-[42rem] flex items-center gap-[7rem] ">
          <SSBaseSkeleton animated="ani-opacity" width="70rem" height="18rem" />
        </div>
        <!-- 客队名 -->
        <div class="mb-[5rem] h-[42rem] flex items-center gap-[7rem] ">
          <SSBaseSkeleton animated="ani-opacity" width="70rem" height="18rem" />
        </div>
        <div class="h-[42rem] flex items-center gap-[2rem]">
          <SSBaseSkeleton animated="ani-opacity" width="22rem" height="16rem" />
        </div>
      </div>
      <!-- 右 -->
      <div class="max-w-full flex overflow-x-scroll">
        <div class="mr-[5rem] flex flex-col items-center ">
          <div class="mb-[3rem] h-[20rem] w-[49rem] flex items-center justify-center">
            <SSBaseSkeleton animated="ani-opacity" width="30rem" height="12rem" />
          </div>
          <div class="mt-[5rem] flex flex-col">
            <div
              v-for="i, idx in 2" :key="i"
              class="bg-[var(--ss-spt-market-info-zhcn-skeleton-bg1)] h-[47rem] min-w-[56rem] flex flex-col items-center justify-center rounded-[4rem] "
              :class="[idx > 0 ? 'mt-5 ' : '']"
            >
              <SSBaseSkeleton class="mb-[4rem]" animated="ani-opacity" width="30rem" height="12rem" />
              <SSBaseSkeleton animated="ani-opacity" width="20rem" height="12rem" />
            </div>
          </div>
          <div class="mt-[5rem] h-[42rem] w-[49rem] flex-shrink-0" />
        </div>
        <div class="mr-[5rem] flex flex-col items-center ">
          <div class="mb-[3rem] h-[20rem] w-[49rem] flex items-center justify-center ">
            <SSBaseSkeleton animated="ani-opacity" width="30rem" height="12rem" />
          </div>
          <div class="mt-[5rem] flex flex-col ">
            <div
              v-for="i, idx in 2" :key="i"
              class="bg-[var(--ss-spt-market-info-zhcn-skeleton-bg1)] h-[47rem] min-w-[56rem] flex flex-col items-center justify-center rounded-[4rem] "
              :class="[idx > 0 ? 'mt-[5rem] ' : '']"
            >
              <SSBaseSkeleton class="mb-[4rem]" animated="ani-opacity" width="30rem" height="12rem" />
              <SSBaseSkeleton animated="ani-opacity" width="20rem" height="12rem" />
            </div>
          </div>
          <div class="mt-[5rem] h-[42rem] w-[49rem] flex-shrink-0" />
        </div>
        <div class="flex flex-col items-center gap-[5rem]">
          <div class="mb-[3rem] h-[20rem] w-[49rem] flex items-center justify-center">
            <SSBaseSkeleton animated="ani-opacity" width="30rem" height="12rem" />
          </div>
          <div class="flex flex-col">
            <div
              v-for="i, idx in (isFootBall ? 3 : 2)" :key="i"
              class="bg-[var(--ss-spt-market-info-zhcn-skeleton-bg1)] min-w-[56rem] flex flex-col items-center justify-center rounded-[4rem] "
              :class="[isFootBall ? 'h-[30rem]' : 'h-[47rem]',
                       idx > 0 ? 'mt-[5rem] ' : '',
              ]"
            >
              <SSBaseSkeleton animated="ani-opacity" width="30rem" height="12rem" />
              <SSBaseSkeleton
                v-if="!isFootBall" class="mt-[4rem]" animated="ani-opacity" width="20rem"
                height="12rem"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row-gap-10-right flex">
      <div
        v-for="i in 3" :key="i"
        class="bg-[var(--ss-spt-market-info-zhcn-skeleton-bg1)] h-[42rem] w-[49rem] flex flex-col items-center justify-center gap-[4rem] rounded-[4rem] "
      >
        <SSBaseSkeleton animated="ani-opacity" width="20rem" height="12rem" />
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --ss-spt-market-info-zhcn-skeleton-bg1: #f6f7f8;
}
</style>

<style lang='scss' scoped>
.row-gap-10-right {
  > *:not(:last-child) {
    margin-right: 10rem;
  }
}
</style>
