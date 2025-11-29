<script lang="ts" setup>
import { IconUniArrowDown } from '@tg/icons'
const { t } = useI18n()
usePageTitle({ prefix: t('transaction_record') })

const tab = ref('real_coin')
const label = ref(t('today'))
const date = ref<string[]>([])
const showPicker = ref(false)
const transaction_tab = ref<'deposit' | 'withdraw' | 'other'>('deposit')
const stateVal = ref('0')

const tabs = reactive([
  { label: t('deposit'), value: 'deposit' },
  { label: t('menu_title_settings_withdrawals'), value: 'withdraw' },
  { label: t('surveys_multiselect_other_option_value'), value: 'other' },
])
const emptyText = computed(() => {
  if(tab.value === 'byte_coin' && transaction_tab.value === 'deposit'){
    return t('finance_deposit_empty_text')
  }else if(tab.value === 'real_coin' && transaction_tab.value === 'deposit'){
    return t('empty_official_deposit')
  }else if(tab.value === 'byte_coin' && transaction_tab.value === 'withdraw'){
    return t('finance_withdraw_empty_text')
  }else if(tab.value === 'real_coin' && transaction_tab.value === 'withdraw'){
    return t('empty_official_withdraw')
  }else {
    return t('finance_other_empty_text')
  }
})

const downloadText = computed(() => {
  if(transaction_tab.value === 'deposit'){
    return t('finance_deposit_download_text')
  }else if(transaction_tab.value === 'withdraw'){
    return t('finance_withdraw_download_text')
  }else {
    return ''
  }
})

const initDate = () => {
  const st = dayjs(new Date()).startOf('day')
  const et = dayjs(new Date()).endOf('day')
  const temp = [
    st.format('YYYY-MM-DD'),
    et.format('YYYY-MM-DD'),
  ]
  date.value = temp
}

onMounted(() => {
  initDate()
  Local.set(STORAGE_BACK_URL, '/transactions')
})

onBeforeUnmount(() => {
  Local.remove(STORAGE_BACK_URL)
})
</script>

<template>
  <section class="tg-deposits-record-page">
    <div class="flex justify-between">
      <BaseTab 
        v-model="transaction_tab" 
        class="record-tab" 
        :list="tabs" 
        :center="false" 
        need-scroll-at-init
        scroll-inline="center"
        shape="square"
        style="
          --tg-tab-style-active-bg: #24EE89;
          --tg-tab-style-box-padding:0;
          --tg-tab-active-text-color: #05080a"
        />
      <div class="px-[16px] py-[13px] bg-[#1A2C38] hover:bg-[#071824] rounded-[4px] cursor-pointer text-[14px] font-[600] gap-[8px] flex items-center" @click="showPicker = true">
        <span>{{ label }}</span>
        <IconUniArrowDown />
      </div>
    </div>
    <BaseDialog :title="t('transaction_record')" :show="showPicker" :showIcon="false" @close="showPicker = false">
      <BaseDateRangePicker
        v-model="date"
        v-model:label="label"
        :initStartDate="date[0]"
        :initEndDate="date[1]"
        class="w-full"
        :is-utc="false"
        show-tab
        @confirm="showPicker = false"
      />
    </BaseDialog>
    <Suspense timeout="0">
        <div class="content w-full">
          <AppTabRecord
            :date="date"
            v-model:tab-value="tab" v-model:state="stateVal" :content-type="transaction_tab"
            :empty-text="emptyText" :download-text="downloadText"
          />
          <AppRecordFilter v-model="stateVal" />
        </div>
        <template #fallback>
          <div class="flex items-center justify-center min-h-[200rem]">
            <BaseLoading />
          </div>
        </template>
    </Suspense>
    
  </section>
</template>

<style scoped>
  .content{
    background-color: var(--tg-primary-main);
    border-radius: 0.5rem;
    border: 1px solid var(--tg-secondary-main);
    padding: 24px;
    margin-top: 24px;
  }
</style>

<route lang="yaml">
meta:
  layout: center
</route>
