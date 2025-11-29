<script lang="ts" setup>
import { ApiAgencyCommissionModelsList, ApiAgencyCommissionScale } from '@tg/apis'
import { IconEmpty1 } from '@tg/icons';

interface Props {
  clazz?: string
  selectType: string
}

const props = defineProps<Props>()
const { t } = useI18n()
const route = useRoute()
const { selectType } = toRefs(props)
// const { list: scaleList } = useScaleData()
// const { selected: tab, list: tabList } = useSelect(scaleList)
const { isZhcn } = storeToRefs(useLanguageStore())

const tab = ref('')
const { cond_direct, cond_team } = storeToRefs(useAffiliate())
const { isMobile } = storeToRefs(useWindowStore())
const data = ref()

const tabList = ref<{ label: string, value: string, icon: string, activeIcon?: string }[]>([])

const { bonus_currency } = storeToRefs(useAffiliate())

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

const columns = computed<Column[]>(() => [
  {
    title: t('class'),
    dataIndex: 'lvl',
    align: isMobile.value ? 'center' : 'center',
    slot: 'level',
    skeWidth: '50px',
    color: 'var(--tg-table-text-color)',
    // width: 'min-content',
    width: isMobile.value ? '33%' : '33%',
  },
  {
    title: t('effective_bet'),
    dataIndex: 'amt',
    align: 'center',
    slot: 'effective_bat',
    color: 'var(--tg-table-amount-color)',
    // width: isMobile.value ? '34%' : '34%',
  },
  {
    title: t('menu_title_commission_rate'),
    dataIndex: 'rate',
    align: isMobile.value ? 'center' : 'center',
    slot: 'rebate_ratio',
    skeWidth: '100px',
    // width: isMobile.value ? '33%' : '33%',
  },
])

const loading = ref(true)

// // 监听 selectType 变化，更新 tabList

const dataList = computed(() => {
  const currentSelected = tab.value
  let selectData = []
  if (selectType.value == 'cond_direct')
    selectData = cond_direct.value ? JSON.parse(cond_direct.value) : []
  if (selectType.value == 'cond_team')
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

const isTutorial = computed(() => {
  return route.path.includes('/affiliate/invitation-link')
})

const showBaseTab = computed(() => {
  return tabList.value.length > 1
})

async function getData() {
  loading.value = true
  return new Promise((resolve) => {
    runAsyncModelsList().then(() => {
      let selectData = []
      console.log('modelsList.value', modelsList.value)
      if (selectType.value == 'cond_direct')
        selectData = cond_direct.value ? JSON.parse(cond_direct.value) : []
      if (selectType.value == 'cond_team')
        selectData = cond_team.value ? JSON.parse(cond_team.value) : []
      console.log(selectData, 'selectData')
      ApiAgencyCommissionScale().then((res) => {
        data.value = res
        const filteredList = modelsList.value?.filter((item) => {
          const target = selectData.find((citem: any) => citem.ty == item.id)
          return target?.lvl && (Array.isArray(target?.lvl) && target?.lvl.length > 0)
        })

        if (filteredList?.length)
          tab.value = filteredList[0].id

        tabList.value = filteredList?.map((a, _i) => {
          const target = selectData.find((item: any) => item.ty == a.id)
          // console.log('target', insertActiveBeforeLastDot(target.ico[0]))
          return {
            label: a.name,
            value: a.id,
            icon: target.ico[0],
            activeIcon: target.ico[0],
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
function insertActiveBeforeLastDot(str: string) {
  const lastDotIndex = str.lastIndexOf('.')
  if (lastDotIndex === -1)
    return str // 没有点就不处理

  return `${str.slice(0, lastDotIndex)}_active${str.slice(lastDotIndex)}`
}

await application.allSettled([getData()])
</script>

<template>
  <div v-if="loading || modelsListLoading">
    <AppLoading />
  </div>
  <div v-else class="all-data-page" :class="[{ 'pc-mode': !isMobile }]">
    <div v-if="tabList.length && modelsList?.[0]?.id?.split(',')?.length !== 6" class="table-filter">
      <BaseSquareTab v-if="(isMobile || isTutorial)" v-model="tab" :use-flex="true" with-theme has-active-icon
        :list="tabList ?? []"
        style="--tg-base-square-tab-mobile-gap: 35px;--base-square-tab-brightness:1;--base-tab-brightness:1;" :style="[{
          '--tg-base-square-tab-mobile-justify': tabList.length === 1 ? 'flex-start' : 'space-around',
          'padding': tabList.length === 1 ? '0 48px' : '0 16px',

        }, isZhcn ? '--tg-base-square-tab-font-weight:500;' : '--tg-base-square-tab-font-weight:600;']
          " class="base-tab custom-tab h-[50px]" />
      <BaseTab v-else v-model="tab" with-theme active style="--tg-tab-style-color: var(--tg-text-lightgrey);
        --base-tab-brightness:1;
        --tg-base-tab-appimage-height:16px;
        --tg-base-tab-appimage-width:16px;
        --tg-base-tab-active-tab-scale:1;
        --tg-tab-style-active-bg:#213743;
        " :style="isZhcn ? '--tg-base-tab-font-weight:500;' : '--tg-base-tab-font-weight:600;'" :list="tabList ?? []"
        :center="false" use-cloud-img class="base-tab h-[54px]" :class="[{ 'pc-mode': !isMobile }]" />
    </div>
    <BaseTable v-if="dataList.length" class="page-all-data page-commission-rate" :class="[props.clazz]"
      :columns="columns" :data-source="dataList" :skeleton-row="5"
      :style="isZhcn ? '--tg-table-td-font-weight:500;' : ''">
      <template #level="{ index }">
        <!-- <div class="text-center" :style="{ width: `${t('class').length}ch` }"> -->
        {{ index + 1 }}
        <!-- </div> -->
      </template>

      <template #th-effective_bat>
        <div class="center" style="margin-left: 3px">
          <AppCurrencyIcon :currency-type="getCurrencyConfigByCode(bonus_currency)?.name" />
        </div>
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
    </BaseTable>
    <div v-else class="empty">
      <BaseEmpty :description="t('data_empty')" icon="empty-1">
        <template #icon>
          <BaseImage class="w-[80px]" url="/png/icon/empty-1.png" />
        </template>
      </BaseEmpty>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.all-data-page {
  --tg-badge-size: 10px;
  --tg-base-select-style-color: var(--tg-text-lightgrey);
  --tg-base-select-style-padding-y: var(--tg-spacing-8);
  --tg-base-select-style-padding-right: var(--tg-spacing-28);
  --tg-tab-style-wrap-bg-color: var(--tg-primary-main);
  --tg-base-square-tab-padding-y: 7px;
  --tg-base-square-tab-padding-top: 9px;
  --tg-base-square-tab-dot-width: 14px;
  --tg-table-even-background: initial;

  @include webTheme('green') {
    --tg-spacing-4: 0px;
  }

  @include webTheme('white') {
    --tg-base-square-tab-name-color: #111111;
  }
}

.empty {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hint {
  color: var(--tg-text-grey-lighter);
  margin-top: 4px;
}

.page-all-data {
  @include webTheme('green') {
    --tg-table-odd-background: #0e6746;
    --tg-table-even-background: var(--tg-body-bg);
  }

  @include webTheme('new-default') {
    --tg-table-even-background: initial;
  }

  @include webTheme('white') {
    --tg-table-odd-background: #f5f5f5;
    --tg-table-even-background: #ffffff;
  }

  --tg-app-amount-font-size: var(--tg-font-size-xs);
  --tg-app-amount-font-weight: var(--tg-font-weight-normal);

  .flex-colum {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--tg-spacing-4);
  }
}

.grey-rate {
  @include webTheme('white') {
    --tg-table-odd-background: #ffffff;
    --tg-table-even-background: transparent;
  }
}

.white-rate {
  @include webTheme('white') {
    --tg-table-odd-background: #f5f5f5;
    --tg-table-even-background: transparent;
  }

  @include webTheme('green') {
    --tg-table-odd-background: #055434;
    --tg-table-even-background: transparent;
  }
}

.table-filter {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--tg-spacing-16);
  font-size: var(--tg-font-size-xs);

  @include webTheme('green') {
    --tg-base-square-tab-bg-green: #055434;
    // --tg-text-lightgrey: var(--tg-text-white)
    --tg-icon-color: #fff;
    --tg-text-green-sub: #fff;
    --tg-text-white: #ffefb0;
    --icon-color: #ffefb0;
    --tg-base-square-tab-name-color-active: #f6d14a;
    --tg-base-square-tab-name-color: #5ecea6;
  }

  @include webTheme('greenblack') {
    --tg-base-square-tab-bg: var(--tg-secondary-grey);
  }

  .base-tab {
    @include webTheme('white') {
      background: #f5f5f5;
    }
  }
}

.text-color {
  @include webTheme('green') {
    color: var(--tg-text-green-main);
  }
}

.custom-tab {
  :deep(.app-sports-tab) {
    .scroll-x {
      overflow-x: auto !important;

      &::-webkit-scrollbar {
        display: none !important;
      }

      -ms-overflow-style: none !important;
      scrollbar-width: none !important;
    }

    .tab-wrap {
      min-width: 100% !important;
      white-space: nowrap !important;

      &.tab-flex {
        .tab {
          min-width: max-content !important;
        }
      }

      .name {
        overflow: visible !important;
        text-overflow: clip !important;
        width: auto !important;
        min-width: max-content !important;
      }

      .tab {
        &.is-mobile {
          width: 100% !important;
          justify-content: flex-start !important;
          overflow-x: auto !important;

          &::-webkit-scrollbar {
            display: none !important;
          }

          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      }
    }
  }
}

:deep(.tab-wrap.use-flex .tab) {
  flex: none;
}

.table-filter .base-tab.pc-mode {
  width: 100%;
  height: 54px;
  background: #213743;
  border-radius: 4px;
  min-height: 60px;
  display: flex;
  align-items: flex-start;
  gap: 40px;
  padding: 0;

  :deep(.tab-wrap) {
    border-radius: 0px;
    background: #213743;
    padding: 0;
    margin: 0;
    height: 54px;
  }

  :deep(.tab) {
    position: relative;
    border-radius: 0px;
    color: #bfc9d1;
    font-size: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding-top: 24px;
    background: transparent;
    transition: color 0.2s;
    font-size: 12px;

    .icon {
      position: relative;
      margin-bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &.active .icon::before {
      content: '';
      position: absolute;
      top: -11px;
      left: 50%;
      transform: translateX(-50%);
      width: 14px;
      height: 7px;
      background: #3673da;
      border-radius: 0 0 3px 3px;
      z-index: 1;
    }
  }
}

.pc-mode {
  .table-filter {
    margin-bottom: 0px;

    :deep(.base-tab) {
      align-items: center;

      .tab {
        padding: 10px 15px;

        .content {
          .icon {
            margin: 0;

            .base-image {
              width: 16px;
              height: 16px;
            }
          }

          flex-direction: column;
          gap: 4px;

          .content-label {
            color: #b1bad3;
          }
        }

        &.active .icon::before {
          background: #3673da;
        }

        &.active {
          .text {
            color: #ffffff;
          }
        }
      }
    }
  }
}
</style>
