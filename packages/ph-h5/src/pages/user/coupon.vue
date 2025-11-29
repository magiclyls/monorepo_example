<script setup lang='ts'>
import { ApiMemberExchangeClaim } from '@tg/apis'
import { PhBaseButton, PhBaseInput } from '@tg/bccomponents'
import { useCurrency } from '@tg/stores'
import { couponReg } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppPageLayout from '~/components/AppPageLayout.vue'
import { Message } from '~/utils'

defineOptions({ name: 'AppUserCoupon' })

const { t } = useI18n()
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())

const { value: coupon, errorMessage, validate: valiCoupon, setErrors, setValue, resetField } = useField<string>('coupon', (v) => {
  if (!couponReg.test(v))
    return t('兑换码无效')
  return ''
})

const { run: runGetClaim, loading } = useRequest(ApiMemberExchangeClaim, {
  onSuccess(res) {
    // 领取成功
    if (res.state === 1) {
      resetField()
      Message.success(t('领取成功'))
    }

    // 兑换码已领取
    if (res.state === 3)
      setErrors(t('兑换码已领取'))

    // 兑换码无效
    if ([2, 4, 5].includes(res.state))
      setErrors(t('兑换码无效'))
  },
})

async function submit() {
  await valiCoupon()

  if (!errorMessage.value)
    runGetClaim({ code: coupon.value, curr_id: currentGlobalCurrencyMap.value.cur })
}
</script>

<template>
  <AppPageLayout :title="t('兑换码')">
    <div class="p-[12rem] w-full bg-[#fff] rounded-[8px] flex flex-col">
      <PhBaseInput v-model="coupon" msg-after-touched :max="8" :msg="errorMessage" name="" :placeholder="t('请输入兑换码')" />
      <PhBaseButton :loading="loading" class="mt-[16rem]" style="--ph-base-button-padding-y:10rem;" show-shadow @click="submit">
        {{ t('提交') }}
      </PhBaseButton>
    </div>
  </AppPageLayout>
</template>

<style lang='scss' scoped>

</style>
