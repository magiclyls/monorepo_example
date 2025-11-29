<script setup lang="ts">
import type { Column, TaskBonusItem, TaskInnerDetail } from '@tg/types'
import { ApiJobTaskDetail } from '@tg/apis'
import { AfunBaseAmount, AfunBaseTable } from '@tg/bccomponents'
import { getLangForBackend } from '@tg/vue-i18n'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppPageLayout from '~/components/AppPageLayout.vue'
import AppTaskSelect from '~/components/AppTaskSelect.vue'

defineOptions({
  name: 'TaskInnerB',
})
// 投注
const { t } = useI18n()

const currentLang = getLangForBackend() || 'en_US'

const path = window.location.search
const search = new URLSearchParams(path)
const id = search.get('id') || ''

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
  },
  {
    title: '',
    dataIndex: 'name',
    align: 'center',
    mb: 14,
    headerSlot: 'task',
  },
  {
    title: t('有效投注'),
    mb: 14,
    dataIndex: 'amount',
    align: 'center',
    slot: 'amount',
  },
  {
    title: t('奖励'),
    dataIndex: 'award',
    mb: 14,
    align: 'center',
    slot: 'award',
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
    curPlatName.value = target?.support_platform === 'all' ? t('全部场馆') : target?.support_platform

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
  <AppPageLayout :title="t('任务详情')">
    <AfunBaseTable
      :columns="columns" :data-source="tableData" :show-out-load="true" :loading="isDetailLoading"
      :loading-full-screen="false"
      style="--afun-table-th-padding-bottom:16px;--afun-table-th-padding-x:9px;--afun-table-td-padding-x:12px;--afun-table-td-padding-x:9px;"
    >
      <template #taskType>
        <div class="min-w-[86px] ">
          <div v-if="taskOption.length < 2" class="center h-[40px] task-detail-box  w-full shrink-0 whitespace-nowrap px-[6px]">
            {{ taskOption?.[0]?.label }}
          </div>
          <template v-else>
            <AppTaskSelect
              v-model="curTaskId"
              :options="taskOption"
              style="--afun-base-select-padding: 0 6px;"
              @update:model-value="onTypeChange"
            />
          </template>
        </div>
      </template>
      <template #task>
        <div class="min-w-[86px] ">
          <div class="center h-[40px] w-full shrink-0 task-detail-box whitespace-nowrap px-[6px]">
            {{ curPlatName }}
          </div>
        </div>
      </template>
      <template #amount="{ record }">
        <div class="center">
          <AfunBaseAmount class="task-amount" :amount="record.amount" :currency-code="record.currency_id" :no-format="false" />
        </div>
      </template>
      <template #award="{ record }">
        <template v-if="record.bonus_type === 1">
          <div class="center">
            <AfunBaseAmount class="task-amount" :amount="record.award" :currency-code="record.currency_id" :no-format="false" />
          </div>
        </template>
        <template v-else>
          <div class="center">
            {{ record.award }}%
          </div>
        </template>
      </template>
    </AfunBaseTable>
  </AppPageLayout>
</template>

<style scoped>
.task-detail-box {
  background-color: #0f212e;
  border-radius: 4px;
}
.task-amount {
  --afun-base-amount-font-size: 14px;
}
</style>
