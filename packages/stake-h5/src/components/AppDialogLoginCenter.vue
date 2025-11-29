<script setup lang='ts'>
defineOptions({
  name: 'AppDialogLoginCenter',
})

const { t } = useI18n()
const { isMobile } = storeToRefs(useWindowStore())
const { theme } = storeToRefs(useAppStore())

/**
 * 要改应用模板需要同时改useDialogLogin.ts
 */
const isFullScreenLogin = computed(() => ['white', 'green'].includes(theme.value))
</script>

<template>
  <AppLoginFullScreenWithBanner v-if="isMobile || isFullScreenLogin" />
  <div v-else class="flex flex-col p-[16px] pb-[32px] pt-[20px]">
    <h6 class="text-tg-text-white pb-[10px] text-center text-[18px] font-semibold leading-[25px]">
      {{ t('pop_up_login_label') }}
    </h6>
    <AppLoginV2 class="my-[12px]" />
    <AppAuthLogin />
  </div>
  <!-- <AppNewLoginPcOnly  /> -->
</template>
