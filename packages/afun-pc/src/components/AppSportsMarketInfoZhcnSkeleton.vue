<script setup lang='ts'>
defineOptions({
  name: 'AppSportsMarketInfoZhcnSkeleton',
})
const props = defineProps<{ num: number; si?: string | number }>()

const { isMobile } = storeToRefs(useWindowStore())

const isFootBall = computed(() => props.si && +props.si === 1)
</script>

<template>
  <div
    v-for="item, in num" :key="item"
    class="text-tg-text-white border-b-tg-secondary flex flex-col border-solid p-[10px] pr-[4px] pt-[4px] text-[14px] font-semibold @md:px-[16px]"
    :class="item === num ? '' : 'border-b-2'"
  >
    <div class="mb-[5px] flex justify-between">
      <!-- 左 -->
      <div class="flex flex-col leading-[20px]">
        <!-- 状态 -->
        <div class="mb-[5px] flex items-center">
          <BaseSkeleton animated="ani-opacity" :width="isMobile ? '100px' : '130px'" height="18px" />
        </div>
        <!-- 主队名 -->
        <div class="mb-[5px] h-[42px] flex items-center gap-[7px] @md:gap-[6px]">
          <BaseSkeleton animated="ani-opacity" :width="isMobile ? '70px' : '100px'" height="18px" />
        </div>
        <!-- 客队名 -->
        <div class="mb-[5px] h-[42px] flex items-center gap-[7px] @md:gap-[6px]">
          <BaseSkeleton animated="ani-opacity" :width="isMobile ? '70px' : '100px'" height="18px" />
        </div>
        <div class="h-[42px] flex items-center gap-[2px]">
          <BaseSkeleton animated="ani-opacity" width="22px" height="16px" />
        </div>
      </div>
      <!-- 右 -->
      <div class="max-w-full flex overflow-x-scroll">
        <div class="mr-[5px] flex flex-col items-center @md:mr-[4px]">
          <div class="mb-[3px] h-[20px] w-[49px] flex items-center justify-center">
            <BaseSkeleton animated="ani-opacity" :width="isMobile ? '30px' : '60px'" height="12px" />
          </div>
          <div class="mt-[5px] flex flex-col">
            <div
              v-for="i, idx in 2" :key="i"
              class="bg-tg-secondary-dark h-[47px] min-w-[56px] flex flex-col items-center justify-center rounded-[4px] @md:h-[47px] @md:min-w-[200px]"
              :class="[idx > 0 ? 'mt-[5px] @md:mt-[4px]' : '']"
            >
              <BaseSkeleton class="mb-[4px]" animated="ani-opacity" :width="isMobile ? '30px' : '60px'" height="12px" />
              <BaseSkeleton animated="ani-opacity" :width="isMobile ? '20px' : '30px'" height="12px" />
            </div>
          </div>
          <div class="mt-[5px] h-[42px] w-[49px] flex-shrink-0" />
        </div>
        <div class="mr-[5px] flex flex-col items-center @md:mr-[4px]">
          <div class="mb-[3px] h-[20px] w-[49px] flex items-center justify-center @md:mb-[3px]">
            <BaseSkeleton animated="ani-opacity" :width="isMobile ? '30px' : '60px'" height="12px" />
          </div>
          <div class="mt-[5px] flex flex-col @md:mb-0">
            <div
              v-for="i, idx in 2" :key="i"
              class="bg-tg-secondary-dark h-[47px] min-w-[56px] flex flex-col items-center justify-center rounded-[4px] @md:h-[47px] @md:min-w-[200px]"
              :class="[idx > 0 ? 'mt-[5px] @md:mt-[4px]' : '']"
            >
              <BaseSkeleton class="mb-[4px]" animated="ani-opacity" :width="isMobile ? '30px' : '60px'" height="12px" />
              <BaseSkeleton animated="ani-opacity" :width="isMobile ? '20px' : '30px'" height="12px" />
            </div>
          </div>
          <div class="mt-[5px] h-[42px] w-[49px] flex-shrink-0" />
        </div>
        <div class="flex flex-col items-center gap-[5px]">
          <div class="mb-[3px] h-[20px] w-[49px] flex items-center justify-center">
            <BaseSkeleton animated="ani-opacity" :width="isMobile ? '30px' : '60px'" height="12px" />
          </div>
          <div class="flex flex-col">
            <div
              v-for="i, idx in (isFootBall ? 3 : 2)" :key="i"
              class="bg-tg-secondary-dark min-w-[56px] flex flex-col items-center justify-center rounded-[4px] @md:min-w-[200px]"
              :class="[
                isMobile && isFootBall ? 'h-[30px]' : 'h-[30px]', isFootBall ? '@md:h-[30px]' : '@md:h-[30px]',
                idx > 0 ? 'mt-[5px] @md:mt-[4px]' : '',
              ]"
            >
              <BaseSkeleton animated="ani-opacity" :width="isMobile ? '30px' : '60px'" height="12px" />
              <BaseSkeleton v-if="!isFootBall" class="mt-[4px]" animated="ani-opacity" :width="isMobile ? '20px' : '30px'" height="12px" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row-gap-10-right flex">
      <div
        v-for="i in 3" :key="i"
        class="bg-tg-secondary-dark h-[42px] w-[49px] flex flex-col items-center justify-center gap-[4px] rounded-[4px] @md:w-[80px]"
      >
        <BaseSkeleton animated="ani-opacity" :width="isMobile ? '20px' : '30px'" height="12px" />
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.row-gap-10-right {
  >*:not(:last-child) {
    margin-right: 10px;
  }
}
</style>
