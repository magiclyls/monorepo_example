<script lang="ts" setup>
import { IconPwaClose } from '@tg/icons'
defineOptions({
  name: 'AppPwa',
})

const emit = defineEmits(['close'])
const webSiteName = window.downloadStore.webSiteName
const iconUrl = window.downloadStore.iconUrl

const { t } = useI18n()
const origin = window.location.origin.split('//')[1]
</script>

<template>
  <!-- ios添加桌面 -->
  <teleport to="body">
    <Transition>
      <div
        class="fixed bottom-0 left-0 right-0 top-0 z-[9999] flex flex-col justify-end"
        style="background: rgba(0, 0, 0, .8)"
      >
        <div
          class="dialog-content text-[#5F6368 w-full flex flex-col justify-center rounded-tl-[15.3846px] rounded-tr-[15.3846px] bg-white px-[23.07px] pb-[30.7692px] pt-[26.9230px] text-[13.4615px] leading-[1.5] text-[#5F6368]"
        >
          <div class="w-full flex items-center justify-between">
            <span class="flex-1 text-[15.3846px] font-semibold text-black">{{ t('pwa_ios_install') }}</span>
            <div class="flex items-center text-[23.07px]" style="--tg-icon-color:#000" @click="emit('close')">
              <IconPwaClose />
            </div>
          </div>
          <div
            class="border-tg-text-grey-light my-[30.7692px] w-full flex items-center border rounded-[7.6923px] border-solid p-[19.2307px]"
          >
            <BaseImage class="mr-[17.3076px] w-[42.3px] rounded-[9.6153px]" :url="iconUrl" is-network />
            <div class="flex flex-col justify-center">
              <span class="mb-[5.7692px] font-bold">{{ webSiteName }}</span>
              <span class="text-[11.5385px] leading-[15.38px]">{{ origin }}</span>
            </div>
          </div>
          <div class="w-full flex items-center">
            <span class="mr-[13.4615px] font-bold text-black">1.</span>
            <span class="">{{ t('pwa_ios_click') }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg" style="stroke: #007aff; stroke-width: 32px;"
              class="mx-[7.6923px] w-[19.23px] rotate-[270deg]" viewBox="0 0 512 512"
            >
              <path
                d="M320 176v-40a40 40 0 00-40-40H88a40 40 0 00-40 40v240a40 40 0 0040 40h192a40 40 0 0040-40v-40M384 176l80 80-80 80M191 256h273"
                fill="none" stroke-linecap="round" stroke-linejoin="round" class="ionicon-stroke-width"
              />
            </svg>

            <span class="">{{ t('pwa_ios_toolbar') }}</span>
          </div>
          <div class="text-tsm my-[30.7692px] w-full flex items-center">
            <span class="mr-[13.4615px] font-bold text-black">2.</span>
            <span class="">{{ t('pwa_ios_selete') }}</span>
            <span class="border-tg-text-grey-light ml-[7.6923px] border rounded border-solid px-[3.8461px]">
              {{ t('pwa_ios_addhome') }}
            </span>
          </div>
          <div class="text-tsm w-full flex items-center">
            <span class="mr-[13.4615px] font-bold text-black">3.</span>
            <span class="">{{ t('pwa_ios_selete') }}</span>
            <BaseImage class="rouneded-[5.7692px] mx-[7.6923px] w-[23.7px]" :url="iconUrl" is-network />
            <span class="">{{ t('pwa_ios_screen') }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<style lang="scss" scoped>
.v-enter-active {
  transition: transform 0.2s ease;
}
.v-enter-from .dialog-content{
  transform: translate(0, 100%);
}
.dialog-content {
  transition: transform 0.2s ease;
}
</style>
