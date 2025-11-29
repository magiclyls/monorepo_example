<script lang="ts" setup>
const { t } = useI18n()
usePageTitle({ prefix: t('transaction_deposit') })

const tab = ref('real_coin')
const stateVal = ref('0')

onMounted(() => {
  Local.set(STORAGE_BACK_URL, '/transactions')
})

onBeforeUnmount(() => {
  Local.remove(STORAGE_BACK_URL)
})
</script>

<template>
  <section class="tg-deposits-record-page">
    <AppTabRecord
      v-model:tab-value="tab" v-model:state="stateVal" content-type="deposit"
      :empty-text="tab === 'byte_coin' ? $t('finance_deposit_empty_text') : $t('empty_official_deposit')" :download-text="$t('finance_deposit_download_text')"
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
