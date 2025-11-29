<script setup lang='ts'>
const { t } = useI18n()
const { push } = useLocalRouter()
</script>

<template>
  <div class="min-h-[80vh] w-full flex items-center justify-center">
    <div class="flex flex-col items-center">
      <BaseImage class="w-[125px] mb-[16px] @md:text-[173px]" url="/png/icon/empty-sports.png" />
      <span class="text-tg-secondary-light mb-[16px] text-[18px] font-medium @md:text-[24px]">
        {{ t('sports_under_maintain') }}
      </span>
      <div class="text-tg-text-grey mb-[16px] text-center text-[14px] leading-[1.5] @md:text-[18px]">
        <span>{{ t('maintain_time') }}</span><br>
        <span>
          {{ application.timestampToTime(globalInitMap.sportsMaintainedStartTime ?? 0, getCurrentLanguageForFrontend()) }}
          {{ t('to') }}
          {{ application.timestampToTime(globalInitMap.sportsMaintainedEndTime ?? 0, getCurrentLanguageForFrontend()) }}
        </span>
      </div>
      <BaseButton size="sm" @click="push('/')">
        {{ t('back_to_home') }}
      </BaseButton>
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>

<route lang="yaml">
meta:
  layout: home
  </route>
