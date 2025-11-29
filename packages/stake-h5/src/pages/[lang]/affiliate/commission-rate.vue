<script lang="ts" setup>
import { ApiAgencyCommissionModelsList, ApiAgencyCommissionScale } from '@tg/apis'
import { IconEmpty1 } from '@tg/icons';

interface Props {
  clazz?: string
}
const props = defineProps<Props>()
const { t } = useI18n()
const route = useRoute()
// const { list: scaleList } = useScaleData()
// const { selected: tab, list: tabList } = useSelect(scaleList)

const tab = ref('')
const { isMobile } = storeToRefs(useWindowStore())
const data = ref()

const tabList = ref<{ label: string, value: string, icon: string }[]>([])

const {
  data: modelsList,
  runAsync: runAsyncModelsList,
} = useRequest(ApiAgencyCommissionModelsList, {
  onSuccess(data) {
    console.log('data', data)
    if (data)
      tab.value = data[0].id
  },
})

const columns = computed<Column[]>(() => [
  {
    title: t('class'),
    dataIndex: 'level',
    align: isMobile.value ? 'center' : 'center',
    slot: 'level',
    skeWidth: '50px',
    color: 'var(--tg-table-text-color)',
    // width: 'min-content',
    // width: isMobile.value ? '33%' : '33%',
  },
  {
    title: t('effective_bet'),
    dataIndex: 'effective_amount',
    align: 'center',
    slot: 'effective_bat',
    color: 'var(--tg-table-amount-color)',
    // width: isMobile.value ? '34%' : '34%',
  },
  {
    title: t('menu_title_commission_rate'),
    dataIndex: 'rebate_ratio',
    align: isMobile.value ? 'right' : 'center',
    slot: 'rebate_ratio',
    skeWidth: '100px',
    // width: isMobile.value ? '33%' : '33%',
  },
])

const list = computed(() => {
  const conf = data.value?.conf
  const currentSelected = tab.value
  console.log(currentSelected)
  if (!conf)
    return []
  const result = conf.reduce((acc, cur) => {
    const { levels, id } = cur
    // const modelIds = model_ids.split(',')
    if (id === currentSelected && Array.isArray(levels))
      acc.push(...levels)
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
  return new Promise((resolve) => {
    setTimeout(async () => {
      await runAsyncModelsList()
      ApiAgencyCommissionScale().then((res) => {
        data.value = res
        tabList.value = modelsList.value!.map((a, i) => {
          return {
            label: a.name,
            value: a.id,
            icon: res.conf[i].ico[0],
            useCloudImg: true,
          }
        })
        resolve(true)
      }).catch(() => {
        console.error('error')
        resolve(false)
      })
    })
  })
}

await application.allSettled([getData()])
</script>

<template>
  <div class="all-data-page">
    <div v-if="tabList.length > 1" class="table-filter">
      <BaseSquareTab v-if="(isMobile || isTutorial) && showBaseTab" v-model="tab" with-theme :list="tabList ?? []"
        style="--tg-base-square-tab-mobile-justify: flex-start;--tg-base-square-tab-mobile-gap: 35px;"
        class="base-tab" />
      <BaseTab v-else v-model="tab" style="--tg-tab-style-color: var(--tg-text-lightgrey);" with-theme active
        :list="tabList ?? []" :center="false" use-cloud-img class="base-tab" />
    </div>
    <BaseTable v-if="list.length" class="page-all-data page-commission-rate" :class="[props.clazz]" :columns="columns"
      :data-source="list" :skeleton-row="5">
      <template #level="{ index }">
        <!-- <div class="text-center" :style="{ width: `${t('class').length}ch` }"> -->
        {{ index + 1 }}
        <!-- </div> -->
      </template>

      <template #th-effective_bat>
        <div class="center" style="margin-left: 3px">
          <AppCurrencyIcon currency-type="USDT" />
        </div>
      </template>
      <template #rebate_ratio="{ record }">
        <span style="color: var(--tg-table-text-color);">
          {{ record.rebate_ratio }}%
        </span>
      </template>

      <template #effective_bat="{ record }">
        <span class="text-color">
          {{ record.effective_amount <= 0 ? `${toFixed(0)}+` : `${toFixed(record.effective_amount)}+` }} </span>
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
  --tg-base-square-tab-font-weight: var(--tg-font-weight-bold);
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
</style>
