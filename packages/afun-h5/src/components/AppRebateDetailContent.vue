<script lang="ts" setup>
import type { Column } from '@tg/types'
import { ApiMemberTieredRebateSumConfig, ApiMemberVipRebateTieredConfig } from '@tg/apis'
import { AfunBaseCurrencyIcon, AfunBaseSelect, AfunBaseTable } from '@tg/bccomponents'
import { useRebateData } from '@tg/hooks'
import { useAppStore, useCurrency } from '@tg/stores'
import { languageConfig } from '@tg/types'
import { application, getCurrencyConfig } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute } from 'vue-router'

interface INameList {
  label: string
  value: string
}
interface tableSourceType {
  label: string
  name: string
  valid_bet_amount: string
  rebate_ratio: string
  now_level: string
}
defineOptions({
  name: 'AppRebateDetailContent',
})

const route = useRoute()
const appStore = useAppStore()
const { isLogin } = storeToRefs(appStore)
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const { isUnified, name, value, isUnifiedSum } = route.query as any

const { t } = useI18n()
const { rebateTypeArr, customPlatformName, customFormat } = useRebateData()

const unifiedSum = isUnifiedSum === 'true'
const lableOptionVal = ref(value)
const lableOptionList = ref<typeof rebateTypeArr>([])
const nameOptionVal = ref(decodeURIComponent(name))
const nameOptionList = ref<INameList[]>([])
const tableSource = ref<tableSourceType[]>([])

const globalCurrencyCode = computed(() => {
  if (isLogin.value) {
    return currentGlobalCurrencyMap.value.cur
  }
  else {
    return getCurrencyConfig(languageConfig[getLang()].currency).cur
      ?? (getLang() === 'pt-BR' ? getCurrencyConfig('BRL').cur : getCurrencyConfig('USDT'))
  }
})
const columns = computed<Column[]>(() => [
  {
    title: '',
    dataIndex: 'label',
    align: 'center',
    mb: 14,
    headerSlot: 'headerLabel',
    thPaddingX: '0px',
    width: 90,
  },
  !unifiedSum && {
    title: '',
    dataIndex: 'name',
    align: 'center',
    mb: 14,
    headerSlot: 'headerName',
  },
  {
    title: t('累计投注'),
    mb: 14,
    dataIndex: 'valid_bet_amount',
    align: 'center',
    slot: 'valid_bet_amount',
  },
  {
    title: t('返水比例'),
    dataIndex: 'rebate_ratio',
    mb: 14,
    align: 'center',
    slot: 'rebate_ratio',
    visible: true,
  },
].filter(Boolean) as Column[])

/**  梯级详情返水接口传的货币 */
const showCurrency = computed(() => {
  if (isUnified === 'true')
    return '0'
  else
    return globalCurrencyCode.value
})
/** 接口返回的展示货币 */
const currencyCode = ref<string>('')
const showCurrencyCode = computed(() => getCurrencyConfig((currencyCode.value as any)).name)
const { runAsync: runVipRebateTieredConfig, data: VipRebateTieredConfigData, loading: loadTieredRebateConfig } = useRequest(ApiMemberVipRebateTieredConfig)
const { runAsync: runVipRebateTieredSumConfig, data: VipRebateTieredSumConfigData, loading: loadTieredRebateSumConfig } = useRequest(ApiMemberTieredRebateSumConfig)

function setAllData(chageName: boolean) {
  const VipRebateData = VipRebateTieredConfigData.value || VipRebateTieredSumConfigData.value
  if (!VipRebateData)
    return
  const data = VipRebateData
  currencyCode.value = data.currency_id

  lableOptionList.value = data.menu.map((id: string) => rebateTypeArr.find(a => id === a.value)).filter(Boolean) as typeof rebateTypeArr
  if (unifiedSum) {
    const nowType = rebateTypeArr.find(a => lableOptionVal.value === a.value)!.label
    const source = data.data.map((item: Record<string, any>) => {
      const rebate_ratio = customFormat(item.r, 3)
      return {
        label: nowType,
        name: '',
        valid_bet_amount: `≥ ${item.vba}+`,
        rebate_ratio,
        now_level: data.vblv as string,
      }
    })
    tableSource.value = source
  }
  else {
    let nameIndex = -1 // 当前平台名字index
    const newName = data.name.map((item: string) => customPlatformName(item))
    if (chageName)
      nameOptionVal.value = newName[0]
    else
      nameOptionVal.value = customPlatformName(nameOptionVal.value)

    // 原始的平台名字
    let originName = ''
    nameOptionList.value = newName.map((item: string, index: number) => {
      if (item === nameOptionVal.value) {
        nameIndex = index
        originName = data.name[index]
      }
      return {
        label: item,
        value: item,
      }
    })
    const nowType = rebateTypeArr.find(a => lableOptionVal.value === a.value)!.label
    const source = data.data.map((item: Record<string, any>) => {
      const rebate_ratio = customFormat(item.r[nameIndex], 3)
      return {
        label: nowType,
        name: nameOptionVal.value,
        valid_bet_amount: `≥ ${item.vba}+`,
        rebate_ratio,
        now_level: (data.vblv as Record<string, any>)?.[originName],
      }
    })
    tableSource.value = source
  }
}

/** 初始化数据 */
async function getData(chageName: boolean) {
  if (unifiedSum)
    await runVipRebateTieredSumConfig({ game_type: lableOptionVal.value, currency_id: showCurrency.value })
  else
    await runVipRebateTieredConfig({ game_type: lableOptionVal.value, currency_id: showCurrency.value })
  setAllData(chageName)
}

watch(lableOptionVal, () => getData(true))
watch(nameOptionVal, () => setAllData(false))
watch(isLogin, () => getData(false))
watch(showCurrency, () => getData(false))

await application.allSettled([getData(false)])
</script>

<template>
  <div>
    <div @touchstart.stop @touchmove.stop>
      <div class="flex flex-1 flex-col" @touchstart.stop @touchmove.stop>
        <AfunBaseTable
          :columns="columns" :data-source="tableSource ?? []" :show-out-load="true"
          :loading="loadTieredRebateConfig || loadTieredRebateSumConfig"
          style="--afun-table-th-padding-x:4px; --afun-table-th-padding-bottom: 16px;--afun-table-td-padding-x: 4px;--afun-table-th-color: #B1BAD3;"
        >
          <template #headerLabel>
            <div class="min-w-[86px]">
              <AfunBaseSelect v-model="lableOptionVal" :options="lableOptionList" />
            </div>
          </template>
          <template #headerName>
            <div class="min-w-[86px]">
              <AfunBaseSelect v-model="nameOptionVal" :options="nameOptionList" />
            </div>
          </template>
          <template #valid_bet_amount="{ record }">
            <div class="flex items-center justify-center">
              <span class="mr-[4px]">{{ record.valid_bet_amount }}</span>
              <AfunBaseCurrencyIcon :currency-type="showCurrencyCode" />
            </div>
          </template>
          <template #rebate_ratio="{ record, index }">
            <div class="flex items-center justify-center">
              <div class="relative">
                <span> {{ record.rebate_ratio }}</span>
                <div
                  v-if="index + 1 === record.now_level"
                  class="now-level absolute left-[50%] top-[-20px] translate-x-[-50%] rounded-[12px] bg-[#f00000] px-[8px] text-[10px] font-semibold"
                >
                  <span class="relative z-[10]">{{ t('当前') }}</span>
                </div>
              </div>
            </div>
          </template>
        </AfunBaseTable>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.now-level {
  color: #fff;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -5px;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 12px solid #f00000;
  }
}
</style>
