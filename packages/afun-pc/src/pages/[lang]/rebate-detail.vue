<script lang="ts" setup>
import { ApiMemberTieredRebateSumConfig, ApiMemberVipRebateTieredConfig } from '@tg/apis'

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
  name: 'Rebatedetail',
})

const route = useRoute()
const appStore = useAppStore()
const { currentGlobalCurrency, isLogin } = storeToRefs(appStore)
const { isUnified, name, value, isUnifiedSum } = route.query as any

const { t } = useI18n()
const { rebateTypeArr, customPlatformName, customFormat } = useRebateData()

const unifiedSum = isUnifiedSum === 'true'
const lableOptionVal = ref(value)
const lableOptionList = ref<typeof rebateTypeArr>([])
const nameOptionVal = ref(decodeURIComponent(name))
const nameOptionList = ref<INameList[]>([])
const tableSource = ref<tableSourceType[]>([])
const currentGlobalCurrency2 = computed(() => {
  if (isLogin.value) {
    return currentGlobalCurrency.value
  }
  else {
    return languageConfig[getCurrentLanguageForFrontend()]?.currency
      ?? (getCurrentLanguageForFrontend() === 'pt-BR' ? 'BRL' : 'USDT')
  }
})
const globalCurrencyCode = computed(() => currencyConfig[currentGlobalCurrency2.value]?.cur)
const columns = computed<Column[]>(() => [
  {
    title: '',
    dataIndex: 'label',
    align: 'center',
    mb: 14,
    headerSlot: 'headerLabel',
    headerTextColor: 'var(--tg-text-white)',
    thPaddingX: '0px',
    width: 90,
    color: 'var(--tg-table-text-color)',
  },
  !unifiedSum && {
    title: '',
    dataIndex: 'name',
    align: 'center',
    mb: 14,
    headerSlot: 'headerName',
    headerTextColor: 'var(--tg-text-white)',
    color: 'var(--tg-table-text-color)',
  },
  {
    title: t('accumulated_bet'),
    mb: 14,
    dataIndex: 'valid_bet_amount',
    headerTextColor: 'var(--tg-text-white)',
    align: 'center',
    slot: 'valid_bet_amount',
    color: 'var(--tg-table-text-color)',
    // color: 'var(--tg-table-amount-color)',
  },
  {
    title: t('rebate_rate'),
    dataIndex: 'rebate_ratio',
    headerTextColor: 'var(--tg-text-white)',
    mb: 14,
    align: 'center',
    slot: 'rebate_ratio',
    visible: true,
    color: 'var(--tg-table-text-color)',
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
const showCurrencyCode = computed(() => getCurrencyConfigByCode((currencyCode.value as any)).name)
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
    <div class="text-tg-text-white my-[20px] text-[18px] font-semibold">
      {{ t('rebate_rate') }}
    </div>
    <div @touchstart.stop @touchmove.stop>
      <div class="theme-table flex flex-1 flex-col pt-0" @touchstart.stop @touchmove.stop>
        <BaseTable
          :columns="columns" :data-source="tableSource ?? []" :show-out-load="true" :loading="loadTieredRebateConfig || loadTieredRebateSumConfig"
          style="--tg-table-th-padding-x:4px; --tg-table-th-padding-bottom: 16px;--tg-table-td-padding-x: 4px"
        >
          <template #headerLabel>
            <div class="min-w-[86px]">
              <BaseSelect
                v-model="lableOptionVal"
                class="theme-select" :options="lableOptionList" over-ellipsis popper lable-justify="center"
                style="--tg-base-select-style-padding-y:10px;   --tg-base-select-popper-style-padding-x:4px"
              />
            </div>
          </template>
          <template #headerName>
            <div class="min-w-[86px]">
              <BaseSelect
                v-model="nameOptionVal"
                class="theme-select" popper :options="nameOptionList" over-ellipsis lable-justify="center"
                style="--tg-base-select-style-padding-y:10px;   --tg-base-select-popper-style-padding-x:4px"
              />
            </div>
          </template>
          <template #valid_bet_amount="{ record }">
            <div class="center">
              <span class="mr-[4px]">{{ record.valid_bet_amount }}</span>
              <AppCurrencyIcon style="--tg-app-currency-icon-size:14px" :currency-type="showCurrencyCode" />
            </div>
          </template>
          <template #rebate_ratio="{ record, index }">
            <div class="center">
              <div class="relative">
                <span>  {{ record.rebate_ratio }}</span>
                <div
                  v-if="index + 1 == record.now_level"
                  class="now-level absolute left-[50%] top-[-20px] translate-x-[-50%] rounded-[12px] bg-[#f00000] px-[8px] text-[10px] font-semibold"
                >
                  <span class="relative z-10">{{ t('current') }}</span>
                </div>
              </div>
            </div>
          </template>
        </BaseTable>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.now-level {
  color: var(--tg-text-white);
  @include webTheme('white') {
    color: #fff;
  }

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
.theme-table {
  @include webTheme('white') {
    --tg-table-th-color: #111111;
    --tg-table-td-font-weight: 500;
    --tg-app-amount-font-weight: 500;
    --tg-table-odd-background: #f5f5f5;
    --tg-base-select-popper-bg-color: #f5f5f5;
    --tg-icon-color: #555;
  }
  @include webTheme('green') {
    --tg-table-even-background: #076237;
    --tg-table-odd-background: #055434;
    --tg-table-text-color: #3cb389;
  }
}
.theme-select {
  @include webTheme('green') {
    --tg-body-bg: #02432d;
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
  </route>
