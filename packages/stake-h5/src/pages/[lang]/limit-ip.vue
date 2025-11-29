<script setup lang='ts'>
import { IconKefu } from '@tg/icons'
const { t } = useI18n()
const { openService, serviceState } = useService()
const { ipAddress, country_name, country_capital, city } = useIpApi()
const limitType = ref(window.limitType)
const { isMobile } = storeToRefs(useWindowStore())

const style = computed(() => {
  if (serviceState.value && isMobile.value) {
    return {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
    }
  }
  else {
    return {

    }
  }
})

function imgUrl() {
  return limitType.value === 'ip' ? '/png/limitip/earth-pc.png' : '/png/limitip/earth2-pc.png'
}
</script>

<template>
  <Teleport to="body">
    <AppService v-model="serviceState" :style="style" class="limit-ip-service" />
  </Teleport>
  <div class="bg fullscreen w-full flex content-center items-center justify-center">
    <div class="flex flex-col items-center justify-center @md:flex-row">
      <div class="imgwh">
        <BaseImage width="100%" height="100%" :url="imgUrl()" />
      </div>
      <div class="w-[260.92px] flex flex-col items-center justify-center @md:w-[788px] @md:items-start">
        <div class="mb-[10px] @md:mb-[22px]">
          <div class="text-tg-text-white text-center text-4xl font-semibold @md:text-start @md:text-[66px]">
            {{ limitType === 'ip' ? t('limit_ip') : t('limit_area') }}
          </div>
          <div class="text-tg-text-white text-center text-[16.99px] font-semibold @md:mt-[6px] @md:text-3xl">
            {{ limitType === 'ip' ? 'IP Restriction' : 'Regional restrictions' }}
          </div>
        </div>
        <div v-if="limitType === 'ip'" class="mb-[10px] @md:mb-[22px]">
          <div class="text-center text-sm font-medium text-sky-500 @md:text-2xl">
            IP {{ ipAddress }} {{ country_name }}
          </div>
        </div>
        <div class="mb-[10px] @md:mb-[22px]">
          <div class="text-tg-text-white text-center text-sm font-medium @md:text-2xl">
            {{ limitType === 'ip' ? t('your_ip_not_in_service') : t('your_area_not_in_service') }}
          </div>
        </div>
        <div class="mb-[10px] @md:mb-[22px]">
          <div class="text-tg-text-white text-center text-sm font-medium @md:text-left @md:text-2xl">
            {{ limitType === 'ip' ? 'Your IP not within our service area. Please change to a different IP. We apologize for any inconvenience this may cause.' : 'Your area is not within our service area. We apologize for any inconvenience this may cause.' }}
          </div>
        </div>
        <div class="mt-[20px]">
          <div class="bgblue h-[50px] flex flex-row cursor-pointer items-center justify-center rounded-[10px] px-[16px] @md:h-[71px]" @click="openService({ isFootBar: false, needDeal: false })">
            <div class="mr-[5px] h-[24px] w-[24px] @md:h-[36px] @md:w-[36px]">
              <IconKefu class="text-[24px] @md:text-[36px]"  />
            </div>
            <div class="text-tg-text-white text-xl font-medium @md:text-[28px]">
              {{ t('connect_service') }}
            </div>
          </div>
        </div>
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
