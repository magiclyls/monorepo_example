<script setup lang="ts">
import type { TaskBonusItem, TaskInnerDetail } from '@tg/types'

import { ApiJobTaskDetail } from '@tg/apis'

interface Props {
  id: string
  ty: string
}
defineOptions({
  name: 'TaskInnerD',
})
// 存款
const props = defineProps<Props>()

const { t } = useI18n()
const { isMobile } = storeToRefs(useWindowStore())
const { globalPageTitle } = useGlobalStatePageTitle()
globalPageTitle.value = t('task_detail')
const currentLang = getCurrentLanguageForBackend()

const path = window.location.search
const search = new URLSearchParams(path)
const id = search.get('id') || props.id || ''
const ty = search.get('ty') || props.ty || ''

const taskTypeOption = ref<{ label: string, value: string }[]>([])
const allData = ref<Record<string, any>>({})
const curTaskType = ref<string>(ty)
const curTask = ref<string>(id)
const dataSource = ref<TaskBonusItem[]>([])
const selectLabelMap = new Map([
  ['4', t('accumulation_deposit')],
  ['8', t('wallet_or_cryptocurrency')],
  ['5', t('Valid_bets')],
])
const columns: Column[] = [
  {
    title: '',
    dataIndex: 'typeName',
    align: 'center',
    mb: 14,
    headerSlot: 'taskType',
    thPaddingX: '0px',
    headerTextColor: 'var(--tg-text-white)',
  },
  {
    title: '',
    dataIndex: 'name',
    align: 'center',
    mb: 14,
    headerSlot: 'task',
    headerTextColor: 'var(--tg-text-white)',
  },
  {
    title: t('Accumulated_deposit'),
    mb: 14,
    dataIndex: 'amount',
    align: 'center',
    slot: 'amount',
    headerTextColor: 'var(--tg-text-white)',
  },
  {
    title: t('bonus_label'),
    dataIndex: 'award',
    mb: 14,
    align: 'center',
    slot: 'award',
    headerTextColor: 'var(--tg-text-white)',
  },
]

const { runAsync: getDetail, loading: isDetailLoading } = useRequest(ApiJobTaskDetail, {
  onSuccess: (res) => {
    dealDeposit(res)
  },
})
const taskOption = computed(() => {
  const curTask = allData.value[curTaskType.value]

  return curTask && curTask.length > 0
    ? curTask.map((item: { names: string, id: any }) => {
        const names = JSON.parse(item.names)
        const curName = names[currentLang]
        return {
          label: curName,
          value: item.id,
        }
      })
    : []
})
const tableData = computed(() => {
  return dataSource.value.map((item) => {
    const names = JSON.parse(item.names)
    const typeName = selectLabelMap.get(curTaskType.value)
    return {
      ...item,
      typeName,
      name: names[currentLang],
    }
  })
})

function onTypeChange() {
  nextTick(() => {
    curTask.value = taskOption.value[0].value
  })
}

function dealDeposit(param: TaskInnerDetail) {
  const { bonus: list, selector } = param
  dataSource.value = list
  allData.value = selector
  taskTypeOption.value = Object.keys(selector).map(key => ({ label: selectLabelMap.get(String(key)) ?? '', value: String(key) }))
}

watch(curTask, () => {
  getDetail({ id: curTask.value })
}, { immediate: true })
</script>

<template>
  <div :class="[isMobile ? 'pt-[16px]' : 'px-[16px] pb-[16px]']">
    <BaseTable
      :columns="columns" :data-source="tableData" :show-out-load="true" :loading="isDetailLoading"
      :loading-full-screen="false"
      style="--tg-table-th-padding-bottom:16px;--tg-table-th-padding-x:9px;--tg-table-td-padding-x:12px;--tg-table-td-padding-x:9px"
    >
      <template #taskType>
        <div :class="[isMobile ? 'min-w-[86px]' : 'min-w-[109px]']" @click="() => { console.log(tableData, 'tableData') }">
          <div v-if="taskTypeOption.length < 2" class="center text-tg-text-white h-[40px] w-full shrink-0 whitespace-nowrap rounded bg-[#0F212E] px-[6px]">
            {{ taskTypeOption?.[0]?.label }}
          </div>
          <template v-else>
            <BaseSelect
              v-model="curTaskType"
              :options="taskTypeOption"
              over-ellipsis popper lable-justify="center"
              style="--tg-base-select-style-padding-y:10px; --tg-base-select-popper-style-padding-x:6px ;--tg-spacing-8:4px;--tg-base-select-popper-style-padding-y:11px"
              @update:model-value="onTypeChange"
            />
          </template>
        </div>
      </template>
      <template #task>
        <div :class="[isMobile ? 'min-w-[86px]' : 'min-w-[109px]']">
          <div v-if="taskOption.length < 2" class="center text-tg-text-white h-[40px] w-full shrink-0 whitespace-nowrap rounded bg-[#0F212E] px-[6px]">
            {{ taskOption?.[0]?.label }}
          </div>
          <template v-else>
            <BaseSelect
              v-model="curTask"
              :options="taskOption" over-ellipsis popper lable-justify="center"
              style="--tg-base-select-style-padding-y:10px;   --tg-base-select-popper-style-padding-x:6px;--tg-spacing-8:4px;--tg-base-select-popper-style-padding-y:11px"
            />
          </template>
        </div>
      </template>
      <template #amount="{ record }">
        <div class="center">
          <AppAmount :amount="record.amount" :currency-code="record.currency_id" :no-format="false" />
        </div>
      </template>
      <template #award="{ record }">
        <template v-if="record.bonus_type == 1">
          <div class="center">
            <AppAmount :amount="record.award" :currency-code="record.currency_id" :no-format="false" />
          </div>
        </template>
        <template v-else>
          <div class="center">
            {{ record.award }}%
          </div>
        </template>
      </template>
    </BaseTable>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
