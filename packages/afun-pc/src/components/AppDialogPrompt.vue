<script setup lang='ts'>
interface Props {
  data: {
    withdraw_count: number
    withdraw_fee_rate: string
    withdraw_setting_count: number
  }
}
defineOptions({
  name: 'AppDialogPrompt',
})
const props = withDefaults(defineProps<Props>(), {
})
const withdrawSettingCount = ref(props.data.withdraw_setting_count)
const withdrawFeeRate = ref(props.data.withdraw_fee_rate)
const { t } = useI18n()
</script>

<template>
  <div class="text-tg-text-lightgrey bg-tg-secondary-dark border-tg-text-lightgrey mx-[16px] mb-[16px] border-[2px] rounded-[4px] border-dashed p-[16px] text-[14px] font-medium leading-[19.6px]">
    {{ t('draw_with_limit_notice', { drawcount: withdrawSettingCount, feerate: withdrawFeeRate }) }}
  </div>
</template>

<style lang='scss' scoped>
</style>
