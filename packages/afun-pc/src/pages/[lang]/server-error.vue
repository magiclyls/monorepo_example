<script setup lang='ts'>
import { IconKefu } from '@tg/icons'

// const { openService, serviceState } = useService()
// const { isMobile } = storeToRefs(useWindowStore())

// const style = computed(() => {
//   if (serviceState.value && isMobile.value) {
//     return {
//       position: 'fixed',
//       top: '0',
//       left: '0',
//       width: '100%',
//       height: '100%',
//     }
//   }
//   else {
//     return {

//     }
//   }
// })
</script>

<template>
  <Teleport to="body">
    <!-- <AppService v-model="serviceState" :style="style" class="limit-ip-service" /> -->
  </Teleport>
  <div class="fullscreen bg w-full flex content-center items-center justify-center">
    <div class="flex flex-col items-center justify-center @md:flex-row">
      <div class="imgwh">
        <BaseImage width="100%" height="100%" url="/png/limitip/server-error.png" />
      </div>
      <div class="w-[260.92px] flex flex-col items-center justify-center @md:w-[788px] @md:items-start">
        <div class="mb-[10px] @md:mb-[22px]">
          <div class="text-tg-text-white text-center text-4xl font-semibold @md:text-start @md:text-[66px]">
            网络异常,请稍后再试。
          </div>
        </div>
        <div class="mb-[10px] @md:mb-[22px]">
          <div class="text-tg-text-white text-center text-sm font-medium @md:text-left @md:text-[30px] @md:leading-[10px]">
            Network abnormality, please try again later.
          </div>
        </div>
        <!-- <div class="mt-[20px]">
          <div class="bgblue h-[50px] flex flex-row cursor-pointer items-center justify-center rounded-[10px] px-[16px] @md:h-[71px]" @click="openService({ isFootBar: false, needDeal: false })">
            <div class="mr-[5px] h-[24px] w-[24px] @md:h-[36px] @md:w-[36px]">
              <IconKefu class="text-[24px] @md:text-[36px]" />
            </div>
            <div class="text-xl font-medium text-tg-text-white @md:text-[28px]">
              {{ t('connect_service') }}
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.fullscreen {
  height: 100vh;
    // height: 100dvh;
}
.bgblue{
  background-color: var(--tg-sub-blue);
}

@media screen and (max-width: 768px) {
    .imgwh {
        width: 160px;
        height: 160px;
        margin-bottom: 40px
    }
    .bg {
    background: url(/png/limitip/background-limit-h5.svg) no-repeat fixed bottom;
    background-size: cover;
  }
}
@media screen and (min-width: 769px) {
    .imgwh{
        width: 450px;
        height: 450px;
        margin-right: 84px;
    }
    .bg {
    background: url(/png/limitip/background-limit-pc.svg) no-repeat fixed bottom;
    background-size: cover;
  }
}
</style>
