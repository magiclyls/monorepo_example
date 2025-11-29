<script lang="ts" setup>
const { t } = useI18n()
usePageTitle({ prefix: t('transaction_withdraw') })

const tab = ref('real_w_coin')
const stateVal = ref('0')
const tabList = reactive([
  { label: t('currency_law_coin'), value: 'real_w_coin' },
  { label: t('currency_byte_coin'), value: 'byt_w_coin' },
])
onMounted(() => {
  Local.set(STORAGE_BACK_URL, '/transactions')
})

onBeforeUnmount(() => {
  Local.remove(STORAGE_BACK_URL)
})
</script>

<template>
  <section class="tg-withdrawals-record-page">
    <AppTabRecord
      v-model:tab-value="tab" v-model:state="stateVal" content-type="withdraw"  :empty-text="tab === 'byt_w_coin'
        ? $t('finance_withdraw_empty_text') : $t('empty_official_withdraw')"
      :download-text="$t('finance_withdraw_download_text')"
    />
    <AppRecordFilter v-model="stateVal" />
  </section>
</template>

<style lang="scss" scoped>

</style>

<route lang="yaml">
meta:
  depth: 1
</route>
