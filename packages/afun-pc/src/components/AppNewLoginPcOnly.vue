<script setup lang='ts'>
defineOptions({ name: 'AppNewLoginPcOnly' })
const { t } = useI18n()
</script>

<template>
  <div class="min-h-[450px] w-[733px] flex overflow-hidden">
    <div class="w-[351px]">
      <BaseImage url="/png/home/login_green_bg2_pc.png" loading="eager" />
    </div>
    <div class="grow px-[16px] pt-[22px]">
      <h6 class="text-tg-text-white mb-[12px] text-[18px] font-semibold leading-[22px]">
        {{ t('pop_up_login_label') }}
      </h6>
      <AppLoginV2 class="my-[12px]" />
      <AppAuthLogin />
    </div>
  </div>
</template>
