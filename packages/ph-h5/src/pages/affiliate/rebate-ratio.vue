<script lang="ts" setup>
import type { Column } from '@tg/types'
import type { DefineComponent } from 'vue'
import { ApiAgencyCommissionModelsList, ApiAgencyCommissionScale } from '@tg/apis'
import { PhBaseCurrencyIcon, PhBaseTable, PhBaseTabs } from '@tg/bccomponents'
import { IconChessLiveCasino, IconChessOriginalGame2, IconChessSlotMachineNew, IconSptSoccer, IconTabbarGame, IconTabbarLottery, IconUniFishing } from '@tg/icons'
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
    color: 'var(--tg-table-text-color)',
    // width: 'min-content',
    width: '33%',
  },
  {
    title: t('有效投注'),
    dataIndex: 'amt',
    align: 'center',
    slot: 'effective_bat',
    color: 'var(--tg-table-amount-color)',
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
  1: IconChessLiveCasino,
  2: IconUniFishing,
  3: IconChessSlotMachineNew,
  4: IconSptSoccer,
  5: IconTabbarGame,
  6: IconSptSoccer,
  7: IconTabbarLottery,
  8: IconChessOriginalGame2,
}

const activeIcon = {
  1: '/ph-h5/png/rebate-chess.png',
  2: '/ph-h5/png/rebate-fish.png',
  3: '/ph-h5/png/rebate-slot.png',
  4: '/ph-h5/png/rebate-sports.png',
  5: '/ph-h5/png/rebate-casino.png',
  6: '/ph-h5/png/rebate-sports.png',
  7: '/ph-h5/png/rebate-lottery.png',
  8: '/ph-h5/png/rebate-plinko.png',
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
    <PhBaseTabs v-if="types.length > 1" v-model="selectType" :list="types" :type="8" class="my-[16rem]" />
    <PhBaseTabs v-if="tabList.length" v-model="tab" :list="tabList" :type="7" class="my-[16rem]" use-cloud-img />
    <PhBaseTable
      :class="dataList.length === 0 ? 'min-h-300' : ''"
      style="--tg-table-th-height:48rem;--tg-table-td-height:48rem;--tg-table-td-font-weight:500;" :loading="loading"
      :columns="columns" :data-source="dataList" show-out-load
    >
      <template #th-effective_bat>
        <PhBaseCurrencyIcon :currency-type="getCurrencyConfig(bonus_currency)?.name" class="w-[14rem] h-[14rem]" />
      </template>
      <template #rebate_ratio="{ record }">
        <span style="color: var(--tg-table-text-color);">
          {{ Number(record.rate).toFixed(2) }}%
        </span>
      </template>
      <template #effective_bat="{ record }">
        <span class="text-color">
          {{ record.amt <= 0 ? `${toFixed(0)}+` : `${toFixed(record.amt)}+` }} </span>
      </template>
    </PhBaseTable>
  </div>
</template>
