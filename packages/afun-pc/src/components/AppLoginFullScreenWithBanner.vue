<script setup lang='ts'>
defineOptions({
  name: 'AppLoginFullScreenWithBanner',
})
const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col">
    <AppFullScreenLoginAndRegisterBanner class="mb-[6px]" />

    <h6 class="text-tg-text-white px-[20px] text-[20px] font-semibold leading-[25px]">
      {{ t('pop_up_login_label') }}
    </h6>
    <div class="px-[20px]">
      <AppLoginV2 class="my-[12px]" />
    </div>
    <div class="px-[40px]">
      <AppAuthLogin />
    </div>
  </div>
</template>

<style lang="scss">
.app-dialog-login-v2-h5 {
  --tg-base-dialog-close-only-padding-top: 22px;
  --tg-base-dialog-card-border-radius: 0px;
}
</style>
