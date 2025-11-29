<script lang="ts" setup>
import { ApiMemberRebateApply, ApiMemberRebateSum } from '@tg/apis'

import AppAmountNotify from './AppAmountNotify.vue'
import { IconUniBonus, IconUniClose } from '@tg/icons'

defineOptions({
  name: 'AppRealTimeRebateListDialog',
})

const props = defineProps<Props>()

interface Props {
}

const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { openNotify } = useNotify()
const customRouter = useCustomRouter()

const { rebateType } = useRebateData()
const { runAsync: runAsyncRebateSum, loading: loadingRebateSum, data: rebateSum } = useRequest(ApiMemberRebateSum)
const { runAsync: runAsyncRebateApply, loading: loadingRebateApply } = useRequest(ApiMemberRebateApply)
const { rebateAutomatic } = useVipInfo()

const columns = computed<Column[]>(() => [
  {
    title: t('currency_type'),
    dataIndex: 'level',
    align: 'center',
    slot: 'currency',
  },
  {
    title: t('label_type'),
    dataIndex: 'game_type',
    align: 'center',
    slot: 'game_type',
    color: 'var(--tg-table-text-color)',
  },
  {
    title: t('menu_title_settings_bets'),
    dataIndex: 'valid_bet_amount',
    align: 'center',
    slot: 'valid_bet_amount',
    color: 'var(--tg-table-text-color)',
    // isAmount: true,
  },
  {
    title: t('amount'),
    dataIndex: 'rebate_amount',
    align: 'center',
    slot: 'rebate_amount',
    // isAmount: true,
  },
])

function rowClicked(data: any) {
  customRouter.push('/real-time-rebate-detail', { currency_id: data.currency_id, game_type: data.game_type })
}

// openNotify({
//   title: t('rebate_success_label'),
//   iconColor: '--tg-primary-success',
//   clazz: 'rebate-notify',
//   message: () => {
//     return h(AppAmountNotify, {
//       data: [
//         { currency: '701', amount: '222.22' },
//         { currency: '701', amount: '222.22' },
//         { currency: '701', amount: '222.22' },
//         { currency: '701', amount: '222.22' },

//       ],
//     })
//   },
//   icon: 'uni-rebatereal',
// })
function applyRebate() {
  if (rebateSum.value?.length) {
    runAsyncRebateApply().then((res) => {
      rebateSum.value = []
      appEventBus.emit(EventBusNames.GET_TIIMEREBATE_SUCCESS)
      if (res && res.length && isArray(res)) {
        close()
        openNotify({
          title: t('rebate_success_label'),
          iconColor: '--tg-primary-success',
          clazz: 'rebate-notify',
          message: () => {
            return h(AppAmountNotify, {
              data: res.map(d => ({ currency: d.currency_id, amount: d.rebate_amount })),
            })
          },
          icon: 'uni-rebatereal',
        })
      }
      else {
        openNotify({
          title: t('rebate_success_label'),
          iconColor: '--tg-primary-success',
          message: t('rebate_success_notify'),
          icon: 'uni-rebatereal',
        })
      }
    })
  }
  else {
    openNotify({
      type: 'error',
      title: t('rebate_fail_label'),
      message: t('vip_no_gift_available'),
    })
  }
}

function close() {
  closeDialog()
}

await application.allSettled([runAsyncRebateSum()])
</script>

<template>
  <div class="app-realtime-rebate h-full flex flex-col" @touchstart.stop @touchmove.stop>
    <div class="tg-base-dialog-header">
      <h2>
        <IconUniBonus />
        <span>{{ rebateAutomatic && +rebateAutomatic.automatic === 3 ? t('real_time_rebate') : t('vip_water_back') }}</span>
      </h2>
      <a class="close" @click.stop="close">
        <IconUniClose />
      </a>
    </div>
    <div class="scroll-y flex flex-1 flex-col p-[16px] pt-0" @touchstart.stop @touchmove.stop>
      <div>
        <BaseTable
          class="theme-table"
          :columns="columns" :data-source="rebateSum ?? []" :loading="loadingRebateSum" :show-out-load="true"
          @row-click="rowClicked"
        >
          <template #currency="{ record: { currency_id } }">
            <div class="center">
              <AppCurrencyIcon :currency-type="getCurrencyConfigByCode(currency_id)?.name" />
            </div>
          </template>
          <template #game_type="{ record: { game_type } }">
            {{ rebateType[game_type]?.label ?? game_type }}
          </template>
          <template #valid_bet_amount="{ record: { valid_bet_amount, currency_id } }">
            <div class="center">
              <AppAmount class="theme-amount1" :amount="valid_bet_amount" :currency-code="currency_id" :show-icon="false" />
            </div>
          </template>
          <template #rebate_amount="{ record: { rebate_amount, currency_id } }">
            <div class="center">
              <AppAmount class="theme-amount2" :amount="rebate_amount" :currency-code="currency_id" :show-icon="false" />
            </div>
          </template>
        </BaseTable>
      </div>
    </div>
    <div class="p-[16px] pt-0" style="--tg-base-button-font-size:var(--tg-font-size-base)">
      <BaseButton :disabled="!(rebateSum && rebateSum.length) || loadingRebateSum" class="w-full" :loading="loadingRebateApply" bg-style="secondary" size="xl" @click="applyRebate">
        {{ t('one_key_rebate') }}
      </BaseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-realtime-rebate {
  --tg-empty-padding: 40px;
  --tg-app-amount-font-weight: 400;
  // --tg-app-amount-green-color: var(--tg-primary-fail);
}
.theme-amount1 {
  @include webTheme('green') {
    color: var(--tg-text-yellow-light);
  }
  @include webTheme('greenblack') {
    color: var(--tg-table-amount-color);
  }
  @include webTheme('white') {
    color: #484848;
  }
}
.theme-table {
  @include webTheme('white') {
    --tg-table-th-color: #111111;
    --tg-table-td-font-weight: 500;
    --tg-app-amount-font-weight: 500;
    --tg-table-even-background: #f5f5f5;
    --tg-table-odd-background: #fff;
  }
  @include webTheme('green') {
    --tg-table-even-background: #055434;
    --tg-table-odd-background: #076237;
    --tg-table-th-background: #055434;
    --tg-table-amount-color: #3cb389;
    --tg-table-text-color: #3cb389;
  }
}
.theme-amount2 {
  color: green;
  @include webTheme('green') {
    color: var(--tg-text-yellow-light);
  }
  @include webTheme('greenblack') {
    color: var(--tg-table-amount-color);
  }
  @include webTheme('white') {
    color: #ffaa09;
  }
}
</style>
