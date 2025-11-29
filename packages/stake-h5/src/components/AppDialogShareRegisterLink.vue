<script setup lang='ts'>
import { ApiMemberAgencyMyPromotion } from '@tg/apis'

defineOptions({ name: 'AppDialogShareRegisterLink' })

const props = withDefaults(defineProps<Props>(), {
  common: true,
})
interface Props {
  common: boolean
}
console.log('AppDialogShareRegisterLink', props)

const { t } = useI18n()
const location = useBrowserLocation()
const { data: proData, runAsync } = useRequest(ApiMemberAgencyMyPromotion)

const qrUrl = computed(() => `${location.value.origin}${proData.value?.link_url ?? ''}`)

await application.allSettled([runAsync()])
</script>

<template>
  <div v-if="common" class="p-[16px]">
    <div class="mb-[16px] text-center text-[16px] font-medium leading-[25px]">
      {{ t('share_reg_link') }}
    </div>
    <div class="text-tg-text-lightgrey mb-[8px] text-[12px] leading-[17px]">
      {{ t('share_via_social_media') }}
    </div>
    <AppApplicationSharing :share-text="qrUrl" width="38px" round />
    <div class="text-tg-text-lightgrey mb-[5px] mt-[20px] text-[12px]">
      {{ t('my_link') }}
    </div>
    <AppCopyLine :msg="qrUrl" class="theme-copy" />
  </div>
  <!-- 友情好友样式 -->
  <div v-else class="p-[16px]">
    <div class="mb-[16px] text-[16px] font-medium leading-[25px]">
      {{ t('my_sharing') }}
    </div>
    <AppApplicationSharing :share-text="qrUrl" width="38px" round />
    <AppCopyLine :msg="qrUrl" class="theme-copy mt-[16px]" />
  </div>
</template>

<style lang='scss' scoped>
.theme-copy {
  --app-copyline-font-size: 12px;
  --app-copyline-color: var(--tg-text-lightgrey);
  --app-copyline-button-padding: 11px;
  --tg-app-copy-line-input-expanded-py: 6.5px;
  @include webTheme('white') {
    --tg-app-copy-line-input-background-color: #e8e8e8;
    --tg-app-copy-line-input-border-color: #e8e8e8;
    --tg-app-copy-line-input-wrap-box-shadow: none;
    --tg-app-copy-line-button-box-background-color: #e8e8e8;
    --app-copyline-color: #111;
    --tg-icon-color: #555;
  }
  @include webTheme('green') {
    --tg-app-copy-line-input-background-color: #02432d;
    --tg-app-copy-line-input-border-color: #02432d;
    --tg-app-copy-line-input-wrap-box-shadow: none;
    --tg-app-copy-line-button-box-background-color: #02432d;
    --app-copyline-color: #fff;
  }
}
</style>
