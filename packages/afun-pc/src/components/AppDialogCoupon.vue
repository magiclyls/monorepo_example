<script setup lang='ts'>
import { ApiMemberExchangeClaim } from '@tg/apis'

defineOptions({ name: 'AppDialogCoupon' })

const { t } = useI18n()
const { currentGlobalCurrency } = storeToRefs(useAppStore())
const closeDialog = inject('closeDialog', () => {})

const globalCurrencyCode = computed(() => currencyConfig[currentGlobalCurrency.value]?.cur ?? '701')

const { value: coupon, errorMessage, validate: valiCoupon, setErrors } = useField<'string'>('coupon', (v) => {
  if (!couponReg.test(v))
    return t('coupon_invalid')
  return ''
})

const { run: runGetClaim, loading } = useRequest(ApiMemberExchangeClaim, {
  onSuccess(res) {
    // 领取成功
    if (res.state === 1)
      closeDialog()

    // 兑换码已领取
    if (res.state === 3)
      setErrors(t('coupon_received'))

    // 兑换码无效
    if ([2, 4, 5].includes(res.state))
      setErrors(t('coupon_invalid'))
  },
})

async function submit() {
  await valiCoupon()

  if (!errorMessage.value)
    runGetClaim({ code: coupon.value, curr_id: globalCurrencyCode.value })
}
</script>

<template>
  <div class="grid grid-cols-[100%] gap-y-[12px] px-[16px] pb-[32px] pt-[16px]">
    <div class="text-center text-[18px] font-semibold leading-[25px]">
      {{ t('menu-coupon') }}
    </div>
    <BaseInput v-model="coupon" :msg="errorMessage" :max="8" msg-after-touched :placeholder="t('input_coupon_pls')" />
    <BaseButton :loading="loading" bg-style="primary" class="h-[44px]" @click="submit">
      {{ t('submit') }}
    </BaseButton>
  </div>
</template>

<style lang='scss' scoped>

</style>
