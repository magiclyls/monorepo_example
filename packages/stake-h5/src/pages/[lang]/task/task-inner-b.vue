<script setup lang="ts">
import type { TaskBonusItem, TaskInnerDetail } from '@tg/types'

import { ApiJobTaskDetail } from '@tg/apis'

interface Props {
  id: string
}
defineOptions({
  name: 'TaskInnerB',
})
// 投注
const props = defineProps<Props>()
const { t } = useI18n()

const { isMobile } = storeToRefs(useWindowStore())
const { globalPageTitle } = useGlobalStatePageTitle()
globalPageTitle.value = t('task_detail')
const currentLang = getCurrentLanguageForBackend()

const path = window.location.search
const search = new URLSearchParams(path)
const id = search.get('id') || props.id || ''

const taskOption = ref<{ label: string, value: string }[]>([])
const allData = ref<Record<string, any>>({})
const curTaskId = ref(id)
const curPlatName = ref<string>('')
const dataSource = ref<TaskBonusItem[]>([])

const { runAsync: getDetail, loading: isDetailLoading } = useRequest(ApiJobTaskDetail, {
  onSuccess: (res) => {
    dealBet(res)
  },
})

const tableData = computed(() => {
  return dataSource.value.map((item) => {
    const target = taskOption.value.find(i => i.value === curTaskId.value)
    return {
      ...item,
      typeName: target?.label,
      name: curPlatName.value,
    }
  })
})
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
    title: t('Valid_bets'),
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
function onTypeChange() {
  getDetail({ id: curTaskId.value })
}
function dealBet(param: TaskInnerDetail) {
  const { bonus: list, bet_selector } = param
  dataSource.value = list
  allData.value = bet_selector
  const target = bet_selector.find(item => item.id === curTaskId.value)
  if (target)
    curPlatName.value = target?.support_platform === 'all' ? t('all_plat') : target?.support_platform

  taskOption.value = bet_selector.map((item) => {
    const names = JSON.parse(item.names)
    return {
      label: names[currentLang],
      value: item.id,
    }
  })
}

getDetail({ id: curTaskId.value })
</script>

<template>
  <div :class="[isMobile ? 'pt-[16px]' : 'px-[16px] pb-[16px]']">
    <BaseTable
      :columns="columns" :data-source="tableData" :show-out-load="true" :loading="isDetailLoading"
      :loading-full-screen="false"
      style="--tg-table-th-padding-bottom:16px;--tg-table-th-padding-x:9px;--tg-table-td-padding-x:12px;--tg-table-td-padding-x:9px;"
    >
      <template #taskType>
        <div :class="[isMobile ? 'min-w-[86px]' : 'min-w-[109px]']">
          <div v-if="taskOption.length < 2" class="center text-tg-text-white h-[40px] w-full shrink-0 whitespace-nowrap rounded bg-[#0F212E] px-[6px]">
            {{ taskOption?.[0]?.label }}
          </div>
          <template v-else>
            <BaseSelect
              v-model="curTaskId"
              :options="taskOption"
              popper over-ellipsis lable-justify="center"
              style="--tg-base-select-style-padding-y:10px; --tg-base-select-popper-style-padding-x:6px ;--tg-spacing-8:4px;--tg-base-select-popper-style-padding-y:11px"
              @update:model-value="onTypeChange"
            />
          </template>
        </div>
      </template>
      <template #task>
        <div :class="[isMobile ? 'min-w-[86px]' : 'min-w-[109px]']">
          <div class="center text-tg-text-white h-[40px] w-full shrink-0 whitespace-nowrap rounded bg-[#0F212E] px-[6px]">
            {{ curPlatName }}
          </div>
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
