<script setup lang="ts">
import type { Column, TaskBonusItem, TaskInnerDetail } from '@tg/types'
import { ApiJobTaskDetail } from '@tg/apis'
import { PhBaseAmount, PhBaseTable } from '@tg/bccomponents'
import { getLangForBackend } from '@tg/vue-i18n'
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppPageLayout from '~/components/AppPageLayout.vue'
import AppTaskSelect from '~/components/AppTaskSelect.vue'

defineOptions({
  name: 'TaskInnerD',
})
// 存款

const { t } = useI18n()
const currentLang = getLangForBackend() || 'en_US'

const path = window.location.search
const search = new URLSearchParams(path)
const id = search.get('id') || ''
const ty = search.get('ty') || ''

const taskTypeOption = ref<{ label: string, value: string }[]>([])
const allData = ref<Record<string, any>>({})
const curTaskType = ref<string>(ty)
const curTask = ref<string>(id)
const dataSource = ref<TaskBonusItem[]>([])
const selectLabelMap = new Map([
  ['4', t('累积存款')],
  ['8', t('钱包/虚拟币')],
  ['5', t('有效投注')],
])
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
    title: t('累计存款'),
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
  <AppPageLayout :title="t('任务详情')">
    <PhBaseTable
      :columns="columns" :data-source="tableData" :show-out-load="true" :loading="isDetailLoading"
      :loading-full-screen="false"
      style="
        --tg-table-th-padding-bottom:16px;
        --tg-table-th-padding-x:9px;
        --tg-table-td-padding-x:12px;
        --tg-table-td-padding-x:9px;
        --tg-table-th-color: #0D2245;
        --tg-table-th-font-weight: 500;
        --tg-table-td-font-weight: 500;
      "
    >
      <template #taskType>
        <div class="min-w-[86rem] ">
          <div v-if="taskTypeOption.length < 2" class="center h-[40rem]  w-full task-detail-box shrink-0 whitespace-nowrap px-[6rem]">
            {{ taskTypeOption?.[0]?.label }}
          </div>
          <template v-else>
            <AppTaskSelect
              v-model="curTaskType"
              :options="taskTypeOption"
              style="--ph-base-select-padding: 0 6rem;--ph-base-select-background-color:#fff"
              @update:model-value="onTypeChange"
            />
          </template>
        </div>
      </template>
      <template #task>
        <div class="min-w-[86rem]">
          <div v-if="taskOption.length < 2" class="center h-[40rem] task-detail-box w-full shrink-0 whitespace-nowrap px-[6rem]">
            {{ taskOption?.[0]?.label }}
          </div>
          <template v-else>
            <AppTaskSelect
              v-model="curTask"
              style="--ph-base-select-padding: 0 6rem;--ph-base-select-background-color:#fff"
              :options="taskOption"
            />
          </template>
        </div>
      </template>
      <template #amount="{ record }">
        <div class="center">
          <PhBaseAmount :amount="record.amount" :currency-code="record.currency_id" :no-format="false" />
        </div>
      </template>
      <template #award="{ record }">
        <template v-if="record.bonus_type === 1">
          <div class="center">
            <PhBaseAmount :amount="record.award" :currency-code="record.currency_id" :no-format="false" />
          </div>
        </template>
        <template v-else>
          <div class="center">
            {{ record.award }}%
          </div>
        </template>
      </template>
    </PhBaseTable>
  </AppPageLayout>
</template>

<style scoped>
.task-detail-box {
  background-color: #fff;
  border-radius: 4rem;
  border: 1rem solid #ebebeb;
}
</style>
