<script setup lang='ts'>
import type { Column } from '@tg/types'
import { IconUniClose } from '@tg/icons'
import { ApiAgencyCommissionDetailPop } from '@tg/apis'

defineOptions({ name: 'AppDialogPlayerCommission' })

const props = withDefaults(defineProps<Props>(), {

})

const closeDialog = inject('closeDialog', () => { })
const { bonus_currency } = storeToRefs(useAffiliate())

const { t } = useI18n()
interface Props {
  username: string
  id: string
}
const tableColumn: Column[] = [
  {
    title: t('label_type'),
    dataIndex: 'model_name',
    align: 'center',
    slot: 'type',
  },
  {
    title: t('hilo_bet'),
    dataIndex: 'valid_bet_amount',
    align: 'center',
    slot: 'valid_bet_amount',
  },
  {
    title: t('commission'),
    dataIndex: 'commission_amount',
    align: 'center',
    slot: 'commission_amount',
  },
]

const { list, page, page_size, loading, total, runAsync, resetPage } = useList(ApiAgencyCommissionDetailPop, {}, { page_size: 5, isWatchPageOrPageSize: false })
const params = computed(() => {
  return {
    id: props.id,
    page_size: page_size.value,
    page: page.value,
  }
})

watch(params, () => {
  runAsync(params.value)
}, { immediate: true })
</script>

<template>
  <div>
    <div class="header">
      <h2>
        {{ username }}
      </h2>
      <a class="close ml-[12px]" @click.stop="closeDialog">
        <IconUniClose />
      </a>
    </div>
    <BaseLoading v-if="loading" class="h-[50vh]" />
    <BaseTable
      v-else
      :columns="tableColumn" :data-source="list"
    >
      <template #valid_bet_amount="{ record }">
        <div class="center">
          <AppAmount :amount="record.valid_bet_amount" :currency-type="getCurrencyConfigByCode(bonus_currency)?.name" />
        </div>
      </template>
      <template #commission_amount="{ record }">
        <div class="center">
          <AppAmount :amount="record.commission_amount" :currency-type="getCurrencyConfigByCode(bonus_currency)?.name" />
        </div>
      </template>
    </BaseTable>

    <AppStackPage
      v-if="total > page_size"
      class="my-[16px] px-[12px]" :pagination-data="{
        pageSize: page_size,
        page,
        total,
      }" @previous="() => page-- " @next="() => page++" @size-change="(pageSize) => page_size = pageSize"
    />
  </div>
</template>

<style lang='scss' scoped>
   .header {
  padding: var(--tg-spacing-10) var(--tg-spacing-12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--tg-font-size-lg);
  touch-action: none;
  &.statistics {
    padding: 20px var(--tg-spacing-12) 12px;
  }
  > *:not(:first-child) {
    margin-left: var(--tg-spacing-12);
  }
  h2 {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    // gap: var(--tg-spacing-8);
    font-size: var(--tg-font-size-base);
    line-height: 24px;
    > span {
      font-weight: var(--tg-font-weight-semibold);
      margin-right: var(--tg-spacing-8);
    }
    > svg {
      margin-right: var(--tg-spacing-8);
    }
  }
  @include webTheme('white') {
    --tg-icon-color: #555555;
  }
}

.close {
  cursor: pointer;
  font-size: var(--tg-font-size-base);
  display: flex;
  position: relative;
  z-index: var(--tg-z-index-top);

  &:hover {
    --tg-icon-color: var(--tg-text-white);
  }
}
</style>
