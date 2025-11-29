<script lang="ts" setup>
import { ApiFinanceRecordOtherSelect } from '@tg/apis'

const { t } = useI18n()
usePageTitle({ prefix: t('transaction_other') })

const tabList: Ref<{
  label: string
  value: string
}[]> = ref([{
  label: t('finance_other_tab_all'),
  value: '',
}])
const {
  runAsync: runRecordOtherSelect,
  // data: recordOtherSelect,
} = useRequest(ApiFinanceRecordOtherSelect, {
  onSuccess(data) {
    tabList.value = tabList.value.concat(data.map((item) => {
      return { label: item.name, value: item.id }
    }))
  },
})
onMounted(() => {
  Local.set(STORAGE_BACK_URL, '/transactions')
})

onBeforeUnmount(() => {
  Local.remove(STORAGE_BACK_URL)
})
await application.allSettled(
  [
    runRecordOtherSelect(),
  ],
)
</script>

<template>
  <section class="tg-transactions-other-record-page">
    <AppTabRecord
      :tabs="tabList"
      content-type="other"
      :empty-text="$t('finance_other_empty_text')"
    />
  </section>
</template>

<style lang="scss" scoped>

</style>

<route lang="yaml">
meta:
  depth: 1
</route>
