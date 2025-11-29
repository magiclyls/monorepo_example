<script lang="ts" setup>
import type { Column } from '@tg/types'
import type { DefineComponent } from 'vue'
import { ApiAgencyCommissionModelsList, ApiAgencyCommissionScale } from '@tg/apis'
import { AfunBaseCurrencyIcon, AfunBaseTable, AfunBaseTabs } from '@tg/bccomponents'
import { useAffiliate } from '@tg/stores'
import { getCurrencyConfig, toFixed } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'

const { t } = useI18n()
const { mode, type, cond_direct, cond_team, bonus_currency } = storeToRefs(useAffiliate())

const types = computed(() => {
  return !(type.value === 2 && (mode.value === 2 || mode.value === 3))
    ? [
        {
          label: t('团队佣金'),
          value: 'cond_team',
        },
      ]
    : [
        {
          label: t('直属佣金'),
          value: 'cond_direct',
        },
        {
          label: t('团队佣金'),
          value: 'cond_team',
        },
      ]
})
const tab = ref('')
const loading = ref(false)
const selectType = ref(types.value[0].value)
const data = ref()
const tabList = ref<{ label: string, value: string, icon: DefineComponent<any>, activeIcon?: string, useCloudImg: boolean }[]>([])

const {
  data: modelsList,
  runAsync: runAsyncModelsList,
  loading: modelsListLoading,
} = useRequest(ApiAgencyCommissionModelsList, {
  onSuccess(data) {
    console.log('datadatadatadatadata', data)
    if (data)
      tab.value = data[0].id
  },
})

const dataList = computed(() => {
  const currentSelected = tab.value
  let selectData = []
  if (selectType.value === 'cond_direct')
    selectData = cond_direct.value ? JSON.parse(cond_direct.value) : []
  if (selectType.value === 'cond_team')
    selectData = cond_team.value ? JSON.parse(cond_team.value) : []
  const result = selectData.reduce((acc: any[], cur: any) => {
    const { lvl, ty } = cur
    // const modelIds = model_ids.split(',')

    if (ty === currentSelected && Array.isArray(lvl))
      acc.push(...lvl)

    return acc
  }, [] as any[])
  return result
})

const columns = computed<Column[]>(() => [
  {
    title: t('级别'),
    dataIndex: 'lvl',
    align: 'center',
    slot: 'level',
    skeWidth: '50px',
    color: 'var(--afun-table-text-color)',
    // width: 'min-content',
    width: '33%',
  },
  {
    title: t('有效投注'),
    dataIndex: 'amt',
    align: 'center',
    slot: 'effective_bat',
    color: 'var(--afun-table-amount-color)',
  },
  {
    title: t('返佣比例'),
    dataIndex: 'rate',
    align: 'center',
    slot: 'rebate_ratio',
    skeWidth: '100px',
  },
])

const icon = {
  1: '/m/afun-h5/png/rebate-chess.png',
  2: '/m/afun-h5/png/rebate-fish.png',
  3: '/m/afun-h5/png/rebate-slot.png',
  4: '/m/afun-h5/png/rebate-sports.png',
  5: '/m/afun-h5/png/rebate-casino.png',
  6: '/m/afun-h5/png/rebate-sports.png',
  7: '/m/afun-h5/png/rebate-lottery.png',
  8: '/m/afun-h5/png/rebate-plinko.png',
}

const activeIcon = {
  1: '/m/afun-h5/png/rebate-chess1.png',
  2: '/m/afun-h5/png/rebate-fish1.png',
  3: '/m/afun-h5/png/rebate-slot1.png',
  4: '/m/afun-h5/png/rebate-sports1.png',
  5: '/m/afun-h5/png/rebate-casino1.png',
  6: '/m/afun-h5/png/rebate-sports1.png',
  7: '/m/afun-h5/png/rebate-lottery1.png',
  8: '/m/afun-h5/png/rebate-plinko1.png',
}

async function getData() {
  loading.value = true
  return new Promise((resolve) => {
    runAsyncModelsList().then(() => {
      let selectData = []
      console.log('modelsList.value', modelsList.value, cond_direct.value, cond_team.value)

      if (selectType.value === 'cond_direct')
        selectData = cond_direct.value ? JSON.parse(cond_direct.value) : []
      if (selectType.value === 'cond_team')
        selectData = cond_team.value ? JSON.parse(cond_team.value) : []
      console.log(selectData, 'selectData')
      ApiAgencyCommissionScale().then((res) => {
        data.value = res
        const filteredList = modelsList.value?.filter((item) => {
          const target = selectData.find((citem: any) => citem.ty === item.id)
          return target?.lvl && (Array.isArray(target?.lvl) && target?.lvl.length > 0)
        })
        console.log('filteredList', filteredList)
        if (filteredList?.length)
          tab.value = filteredList[0].id

        tabList.value = filteredList?.map((a, _i) => {
          const target = selectData.find((item: any) => item.ty === a.id)
          // console.log('target', insertActiveBeforeLastDot(target.ico[0]))
          return {
            label: a.name,
            value: a.id,
            icon: icon[a.id as keyof typeof icon],
            activeIcon: activeIcon[a.id as keyof typeof activeIcon],
            useCloudImg: true,
          }
        }) ?? []
        console.log('tabList.value', tabList.value)
        resolve(true)
        loading.value = false
      }).catch(() => {
        console.error('error')
        resolve(false)
        loading.value = false
      })
    })
  })
}

watch(selectType, () => getData())

onMounted(() => getData())
</script>

<template>
  <div>
    <AfunBaseTabs v-if="types.length > 1" v-model="selectType" :list="types" :type="8" class="my-[16px]" />
    <AfunBaseTabs v-if="tabList.length" v-model="tab" :list="tabList" :type="7" class="my-[16px]" />
    <AfunBaseTable
      :class="dataList.length === 0 ? 'min-h-300' : ''"
      style="--afun-table-th-height:48px;--afun-table-td-height:48px;--afun-table-td-font-weight:500;" :loading="loading"
      :columns="columns" :data-source="dataList" show-out-load
    >
      <template #th-effective_bat>
        <AfunBaseCurrencyIcon :currency-type="getCurrencyConfig(bonus_currency)?.name" class="w-[14px] h-[14px]" />
      </template>
      <template #rebate_ratio="{ record }">
        <span style="color: var(--afun-table-text-color);">
          {{ Number(record.rate).toFixed(2) }}%
        </span>
      </template>
      <template #effective_bat="{ record }">
        <span class="text-color">
          {{ record.amt <= 0 ? `${toFixed(0)}+` : `${toFixed(record.amt)}+` }} </span>
      </template>
    </AfunBaseTable>
  </div>
</template>
