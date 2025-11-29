<script lang="ts" setup>
import { ApiMemberRebateAutomatic, ApiMemberTieredRebateSumValidBet, ApiMemberTieredRebateValidBet, ApiMemberVipRebateVIPConfig } from '@tg/apis'
import { IconRebateRightArrow, IconEmpty1 } from '@tg/icons'

interface SourceItemType {
  v: string
  r: string[]
  vba: string
}
const appStore = useAppStore()
const router = useLocalRouter()
const { currentGlobalCurrency, isLogin } = storeToRefs(appStore)
const { t } = useI18n()
const { isMobile } = storeToRefs(useWindowStore())
const { rebateTypeArr, customPlatformName, customFormat } = useRebateData()
const { isZeroShowOther } = useVipInfo() // 检查是否为各种0值
const { openRebateDetailDialog } = useDialogRebatedetail()

/** 获取返水配置 */
const { runAsync: runAsyncRebateAutomatic, data: rebateAutomatic } = useRequest(ApiMemberRebateAutomatic)
/** VIP返水模式 */
const { runAsync: runVipRebateVIPConfig } = useRequest(ApiMemberVipRebateVIPConfig)
/** 梯级返水数据 */
const tieredRebateValidBetData = ref()
/** 当前类型总的可领取金额 */
const tieredTotalRebate = ref('0')
/** 梯级返水模式  不是统一场馆 */
const { runAsync: runMemberTieredRebateValidBet } = useRequest(ApiMemberTieredRebateValidBet, {
  onSuccess: (data) => {
    tieredTotalRebate.value = '0'
    if (!data) {
      return tieredRebateValidBetData.value = data
    }
    else {
      tieredRebateValidBetData.value = data.map((item) => {
        const rebate_amount = customFormat(item.rebate_amount, 1)
        tieredTotalRebate.value = customFormat(add(+rebate_amount, +tieredTotalRebate.value), 1)
        const less_valid_bet_amount = customFormat(item.less_valid_bet_amount, 1)
        const valid_bet_amount = customFormat(item.valid_bet_amount, 1)
        const rate = customFormat(item.rate, 3)
        const next_rate = customFormat(item.next_rate, 3)
        const progressBar = `${+item.valid_bet_amount / +add(+item.less_valid_bet_amount, +item.valid_bet_amount) * 100}%`
        return { ...item, rebate_amount, less_valid_bet_amount, valid_bet_amount, progressBar, rate, next_rate }
      })
    }
  },
})
/** 梯级返水模式  统一场馆 */
const { runAsync: runMemberTieredRebateSumValidBet } = useRequest(ApiMemberTieredRebateSumValidBet, {
  onSuccess: (data) => {
    tieredTotalRebate.value = '0'
    if (!data) {
      return tieredRebateValidBetData.value = data
    }
    else {
      tieredRebateValidBetData.value = data.map((item) => {
        const rebate_amount = customFormat(item.rebate_amount, 1)
        tieredTotalRebate.value = customFormat(add(+rebate_amount, +tieredTotalRebate.value), 1)
        const less_valid_bet_amount = customFormat(item.less_valid_bet_amount, 1)
        const valid_bet_amount = customFormat(item.valid_bet_amount, 1)
        const rate = customFormat(item.rate, 3)
        const next_rate = customFormat(item.next_rate, 3)
        const progressBar = `${+item.valid_bet_amount / +add(+item.less_valid_bet_amount, +item.valid_bet_amount) * 100}%`
        // 场馆图标
        const game_type_icon = rebateTypeArr.find(a => item.game_type === a.value)?.icon
        return { ...item, rebate_amount, less_valid_bet_amount, valid_bet_amount, progressBar, rate, next_rate, game_type_icon }
      })
    }
  },
})
const APILoading = ref(false)
/** 当前类型的值 */
const tab = ref('')
const tabList = ref<typeof rebateTypeArr>([])
const columns = ref<Column[]>([])
const rebateConfig = ref<{ [t: string]: string }[]>([])
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
/** 是否梯级模式 */
const isTiered = computed(() => {
  if (rebateAutomatic.value)
    return +rebateAutomatic.value.mode === 2
  return false
})
/** 是否梯级只展示一种货币 */
const isUnified = computed(() => {
  if (rebateAutomatic.value)
    return +rebateAutomatic.value.unified === 1
  return false
})
/** 是否梯级展示统一场馆 */
const isUnifiedSum = computed(() => {
  if (rebateAutomatic.value)
    return +rebateAutomatic.value.unified_sum === 1
  return false
})

/** 设置VIP表格头 */
function setColumn(name: string[]) {
  columns.value = name.map((item, index) => {
    const title = customPlatformName(item)
    return { title, dataIndex: `rate${index}`, align: 'center', color: 'var(--tg-table-text-color)' }
  })
  columns.value.unshift({
    title: `${t('vip_club_rebate_table_header_vip_grade', { data: 'VIP' })}`,
    dataIndex: 'v',
    align: 'center',
    slot: 'level',
    skeWidth: '32px',
  })
}
/** 设置VIP表格的值 */
function setSource(data: { v: string, r: string[] }[]) {
  rebateConfig.value = data.map((item) => {
    const { v, r, vba } = item as SourceItemType
    const obj: { [t: string]: string } = {}
    obj.vba = isZeroShowOther(vba) ? vba : application.formatNumDecimal(vba, 2)
    obj.v = v
    for (const i in r)
      obj[`rate${i}`] = isZeroShowOther(r[i]) ? '-' : `${application.formatNumDecimal(r[i], 2, 1)}%`
    return obj
  })
}
/** 组装VIP所有数据 */
function setAllData(data: Record<string, any>) {
  const { data: _data, name } = data
  setColumn(name)
  setSource(_data)
}
/** 初始化数据 */
async function getData(showLoading = true) {
  if (showLoading)
    APILoading.value = true
  try {
    // const currency_id = supportedCur.includes(globalCurrencyCode.value) ? globalCurrencyCode.value : '706'
    const { gts, mode, unified_sum } = await runAsyncRebateAutomatic(globalCurrencyCode.value)
    // 如果是统一场馆不用tabs
    if (mode === '2' && unified_sum === '1') {
      await runMemberTieredRebateSumValidBet({ currency_id: globalCurrencyCode.value })
    }
    else {
      tabList.value = gts.split(',').map((id: string) => rebateTypeArr.find(a => id === a.value)).filter(Boolean) as typeof rebateTypeArr
      if (tab.value) {
        const res = tabList.value.find(item => tab.value === item.value)
        if (!res)
          tab.value = tabList.value[0].value
      }
      else {
        tab.value = tabList.value[0].value
      }
      if (!tab.value)
        return
      if (mode === '1') {
        const data = await runVipRebateVIPConfig({ game_type: tab.value, cur: '' })
        if (data)
          setAllData(data)
      }
      else if (mode === '2') {
        await runMemberTieredRebateValidBet({ game_type: tab.value, currency_id: globalCurrencyCode.value })
      }
    }
    APILoading.value = false
  }
  catch (error) {
    APILoading.value = false
  }
}

function toDetailPage(name: string, game_type: string) {
  if (isMobile.value)
    router.push(`/rebate-detail?value=${tab.value || game_type}&name=${encodeURIComponent(name)}&isUnified=${isUnified.value}&isUnifiedSum=${isUnifiedSum.value}`)
  else
    openRebateDetailDialog({ value: tab.value || game_type, name, isUnified: String(isUnified.value), isUnifiedSum: String(isUnifiedSum.value) })
}

watch([currentGlobalCurrency, tab], ([nvl1, nvl2], [ovl1, ovl2]) => {
  APILoading.value = true
  if (ovl2 && !isTiered.value) {
    runVipRebateVIPConfig({
      game_type: tab.value,
      cur: '',
    }).then((data) => {
      const { data: _data, name } = data
      setColumn(name)
      setSource(_data)
    }).finally(() => {
      APILoading.value = false
    })
  }
  else if (nvl1 !== ovl1 && isTiered.value) {
    getData()
  }
  else if (ovl2 && isTiered.value) {
    runMemberTieredRebateValidBet({ game_type: tab.value, currency_id: globalCurrencyCode.value }).finally(() => {
      APILoading.value = false
    })
  }
})

watch(isLogin, () => isTiered.value && getData())

onMounted(() => {
  appEventBus.on(EventBusNames.GET_TIIMEREBATE_SUCCESS, () => {
    isTiered.value && getData()
  })
})
onActivated(() => {
  isTiered.value && getData(false)
})

await application.allSettled([getData()])
</script>

<template>
  <div class="vip-rebate" :class="{ 'is-mobile': isMobile }">
    <div class="tabs">
      <div :style="{ marginBottom: !isMobile && !isTiered ? '16px' : 0 }">
        <span v-if="isTiered && !tabList.length" class="theme-now-receive text-[12px]">
          <span>{{ t('now_wait_receive') }}</span>
          <span class="theme-amount">&nbsp;{{ tieredTotalRebate }}</span>
        </span>
        <template v-if="isMobile && tabList.length">
          <div class="grid-box">
            <div class="text- flex-col">
              <div class="theme-title mb-[4px] flex items-center">
                <span class="type-select flex-1 text-[14px]">{{ t('type_select') }}</span>
                <span v-if="isTiered" class="theme-now-receive text-[12px]">{{ t('now_wait_receive') }}<span
                    class="theme-amount">&nbsp;{{ tieredTotalRebate }}</span></span>
              </div>
              <BaseSquareTab v-model="tab" class="theme-square" :list="tabList" :has-cloud-img="false" :style="{
                '--tg-base-square-tab-mobile-justify': tabList.length > 2 ? 'space-between' : 'flex-start',
              }" />
            </div>
          </div>
        </template>
        <template v-else-if="tabList.length">
          <BaseTab v-model="tab"
            style="--tg-tab-style-color:var(--tg-rebatetab-text-color);--tg-tab-style-wrap-bg-color: var(--tg-rebatetab-wrap-bg-color)"
            :list="tabList" with-icon :center="false" />
        </template>
      </div>
      <BaseTable v-if="!isTiered" :columns="columns" :data-source="rebateConfig" :loading="APILoading"
        :skeleton-width="20" show-out-load :out-load-height="isMobile ? 218 : 636">
        <template #level="{ record }">
          <div class="center">
            <BaseImage width="40px" :is-network="true" :url="`/images/vip/${record.v}.webp`" />
          </div>
        </template>
        <template #tiered="{ record }">
          <div class="center">
            <span>{{ record.v }}</span>
          </div>
        </template>
      </BaseTable>
      <div v-else>
        <template v-if="APILoading">
          <AppLoading />
        </template>
        <template v-else-if="tieredRebateValidBetData">
          <div v-for="item in tieredRebateValidBetData" :key="item.platform_id"
            class="theme-rebate-info flex flex-col cursor-pointer text-[12px]"
            @click="toDetailPage(item.platform_name, item.game_type)">
            <div
              class="theme-rebate-layer1 mt-[16px] h-[80px] flex items-center justify-between rounded-[6px] pl-[6px] pr-[4px]">
              <div class="flex flex-col">
                <div class="flex items-center">
                  <component v-if="item.game_type_icon" :is="item.game_type_icon" style="font-size: 30px;color: var(--tg-rebatetab-icon-color);"  />
                  <BaseImage v-else class="theme-icon-bg rounded-[4px] p-[4px]" height="24px" width="24px" fit="contain" :is-network="true" :url="`/images/rebate/${item.platform_id}.webp`" />
                  <div class="theme-main-text theme-font-weight ml-[4px]">
                    {{ t('effective_bet') }}<span class="ml-[4px] mr-[2px]"
                      style="color:var(--tg-rebatetab-text-white)">{{ item.valid_bet_amount }}</span>
                  </div>
                  <AppCurrencyIcon style="--tg-app-currency-icon-size:12px;"
                    :currency-type="getCurrencyConfigByCode((item.currency_id))?.name" />
                </div>
                <div
                  class="progress-bar relative my-[6px] h-[6px] w-[183px] overflow-hidden rounded-[16px] bg-[var(--tg-rebatetab-progress-bg)]"
                  :class="{ 'w-350': !isMobile }">
                  <div class="bar bg-tg-text-white absolute bottom-0 left-0 top-0"
                    :style="{ width: item.progressBar }" />
                </div>
                <div v-if="Number(item.less_valid_bet_amount) > 0" class="theme-font-weight flex text-[10px]">
                  {{ t('rebet') }} <span class="mx-[4px]" style="color:var(--tg-rebatetab-text-white)">{{
                    item.less_valid_bet_amount }}</span> {{ t('rebate_recieve1') }}
                  <span class="ml-[4px]" style="color:var(--tg-rebatetab-text-white)">{{ item.next_rate }}</span>
                </div>
                <div v-else class="h-[10px] w-[1px]" />
              </div>
              <div class="flex flex-col items-end">
                <div class="theme-main-text theme-font-weight mr-[20px] flex">
                  {{ t('rebate_rate') }} <span class="ml-[4px]" style="color:var(--tg-rebatetab-text-white)">{{
                    item.rate }}</span>
                </div>
                <div>
                  <IconRebateRightArrow style="font-size: 14px" />
                </div>
                <div class="theme-font-weight mr-[20px] flex">
                  {{ t('rebate_recieve2') }}<span class="amount ml-[4px]">{{ item.rebate_amount }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <BaseEmpty :description="t('data_empty')" icon="empty-1">
            <template #icon>
              <BaseImage class="w-[80px]" url="/png/icon/empty-1.png" />
            </template>
          </BaseEmpty>
        </template>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --tg-rebatetab-text-color: var(--tg-text-lightgrey);
  --tg-rebatetab-text-white: var(--tg-text-white);
  --tg-rebatetab-icon-color: var(--tg-svg-default-color);
  --tg-rebatetab-wrap-bg-color: var(--tg-secondary-deepdark);
  --tg-rebatetab-progress-bg: #3c4f59;
  --tg-rebatetab-game-icon-bg: transparent;
}

[theme='green'] {
  --tg-rebatetab-text-color: var(--tg-text-green-sub);
  --tg-rebatetab-wrap-bg-color: var(--tg-secondary-dark);
}

[theme='greenblack'] {
  --tg-rebatetab-text-white: var(--tg-text-greenblack-main);
  --tg-rebatetab-icon-color: var(--tg-text-greenblack-main);
  --tg-rebatetab-wrap-bg-color: var(--tg-secondary-deepdark);
}

[theme='white'] {
  --tg-rebatetab-wrap-bg-color: #ffffff;
  --tg-rebatetab-game-icon-bg: #00000040;
  --tg-rebatetab-text-white: #ffaa09;
}
</style>

<style lang="scss" scoped>
.theme-now-receive {
  color: var(--tg-text-white);

  @include webTheme('green') {
    color: #3cb389;
  }
}

.theme-title {
  color: var(--tg-text-white);

  @include webTheme('white') {
    padding: 3px 6px 0;
  }
}

.theme-square {
  @include webTheme('white') {
    --tg-base-square-tab-bg: #f5f5f5;
    --tg-base-square-tab-name-color: #111;
    --tg-icon-color: #111;
    --tg-base-square-tab-dot-bg-color: #f2ca5c;
    --tg-base-square-tab-name-color-active: #f2ca5c;
  }

  @include webTheme('green') {
    --tg-base-square-tab-bg: #02432d;
    --tg-base-square-tab-name-color-active: #f6d14a;
    --base-square-tab-brightness: 1;
  }
}

.theme-rebate-info {
  color: var(--vip-text-common-color);

  @include webTheme('green') {
    color: #3cb389;
  }

  .theme-rebate-layer1 {
    background-color: var(--tg-secondary-grey);

    @include webTheme('white') {
      background-color: #f5f5f5;
    }

    @include webTheme('green') {
      background-color: #055434;
    }
  }

  .theme-icon-bg {
    background-color: var(--tg-rebatetab-game-icon-bg);
  }

  .theme-main-text {
    @include webTheme('white') {
      color: #111;
    }
  }

  .theme-font-weight {
    @include webTheme('white') {
      font-weight: 600;
    }
  }
}

.vip-rebate {
  .theme-amount {
    @include webTheme('white') {
      color: #ffaa09;
    }

    @include webTheme('green') {
      color: #fff;
    }
  }

  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  // gap: var(--tg-spacing-14);
  >*:not(:last-child) {
    margin-bottom: var(--tg-spacing-14);
  }

  --tg-app-amount-font-size: var(--tg-font-size-xs);
  --tg-base-square-tab-bg: var(--tg-secondary-deepdark);
  --tg-base-square-tab-margin: 0;
  --tg-base-button-justify-content: space-around;
  --tg-app-dropdown-width: 100%;
  --tg-base-square-tab-dot-width: 14px;
  --tg-base-square-tab-padding-top: var(--tg-spacing-10);
  --tg-base-square-tab-padding-y: var(--tg-spacing-6);
  --tg-base-square-tab-font-weight: 500;

  .tabs {
    padding: var(--tg-spacing-12);
    background: var(--tg-secondary-dark);
    border-radius: var(--tg-radius-default);
    display: flex;
    flex-direction: column;

    @include webTheme('green') {
      --tg-table-even-background: #055434;
      --tg-table-odd-background: #076237;
      --tg-table-th-background: #055434;
      --tg-table-amount-color: #3cb389;
      --tg-table-text-color: #3cb389;
    }

    .grid-box {
      display: grid;
      grid-template-columns: auto;
      gap: var(--tg-spacing-12);
      align-items: center;
      --tg-app-select-currency-padding-x: 0;
      --tg-app-select-currency-padding-y: 18px;
    }

    .flex-column {
      display: flex;
      flex-direction: column;

      // gap: var(--tg-spacing-4);
      >*:not(:last-child) {
        margin-bottom: var(--tg-spacing-4);
      }

      color: var(--tg-text-lightgrey);

      >span {
        font-size: var(--tg-font-size-default);
        line-height: 1.4;
      }
    }
  }
}

.is-mobile {
  --tg-tab-style-wrap-bg-color: var(--tg-secondary-dark);
  --tg-base-square-tab-bg: var(--tg-secondary-dark);

  .tabs {
    position: relative;
    padding: 0;
    background: none;
    border: none !important;
  }
}

.progress-bar {
  @include webTheme('green') {
    background-color: #197b59;

    .bar {
      background-color: #1fff20;
    }
  }

  @include webTheme('greenblack') {
    background-color: #d9d9d926;

    .bar {
      background-color: var(--tg-primary-active);
    }
  }

  @include webTheme('white') {
    background-color: #c1c1c1;

    .bar {
      background-color: #f2ca5c;
    }
  }
}

.amount {
  color: var(--tg-text-white);

  @include webTheme('green') {
    color: #fff;
  }

  @include webTheme('white') {
    color: #ffaa09;
  }
}

.type-select {
  color: var(--tg-text-white);

  @include webTheme('green') {
    color: #fff;
  }
}

.bg-tg-secondary-grey {
  @include webTheme('green') {
    background-color: #055434;
  }
}
</style>
