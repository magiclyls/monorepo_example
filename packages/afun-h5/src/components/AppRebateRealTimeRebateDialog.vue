<script lang="ts" setup>
import type { Column, CurrencyCode } from '@tg/types'
import { ApiMemberRebateApply, ApiMemberRebateDetail, ApiMemberRebateSum } from '@tg/apis'
import { AfunBaseAmount, AfunBaseButton, AfunBaseCurrencyIcon, AfunBaseTable } from '@tg/bccomponents'
import { useRebateData } from '@tg/hooks'
import { IconUniClose3, IconUniRebate, IconUniRebateDetail } from '@tg/icons'
import { useVipStore } from '@tg/stores'
import { EventBusNames } from '@tg/types'
import { appEventBus, application, getCurrencyConfig } from '@tg/utils'
import { timeToFormatDiffOnChinese } from '@tg/vue-i18n'
import { isArray } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { Message } from '~/utils'

defineOptions({
  name: 'AppRealTimeRebateListDialog',
})

const props = defineProps<Props>()

interface Props {
}

const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()

const { rebateType } = useRebateData()
const { rebateAutomatic } = storeToRefs(useVipStore())

const { runAsync: runAsyncRebateSum, loading: loadingRebateSum, data: rebateSum } = useRequest(ApiMemberRebateSum)
const { runAsync: runAsyncRebateApply, loading: loadingRebateApply } = useRequest(ApiMemberRebateApply)
const { data: rebateDetail, runAsync: runGetData, loading: loadingRebateDetail } = useRequest(ApiMemberRebateDetail)

const page = ref(1)
const detailCurrencyId = ref<CurrencyCode>()
const detailGameType = ref<number>()

// 返水
const columns = computed<Column[]>(() => [
  {
    title: t('币种'),
    dataIndex: 'level',
    align: 'center',
    slot: 'currency',
  },
  {
    title: t('类型'),
    dataIndex: 'game_type',
    align: 'center',
    slot: 'game_type',
    color: 'var(--afun-table-text-color)',
  },
  {
    title: t('投注'),
    dataIndex: 'valid_bet_amount',
    align: 'center',
    slot: 'valid_bet_amount',
    color: 'var(--afun-table-text-color)',
  },
  {
    title: t('金额'),
    dataIndex: 'rebate_amount',
    align: 'center',
    slot: 'rebate_amount',
  },
])
// 详情
const dataResource = computed(() => rebateDetail.value?.map(r => ({ ...r, time: r.date })) ?? [])
const columnsDetail = computed<Column[]>(() => [
  {
    title: t('时间'),
    dataIndex: 'time',
    align: 'center',
    slot: 'created_at',
    color: 'var(--afun-table-text-color)',
  },
  {
    title: t('平台'),
    dataIndex: 'platform_name',
    align: 'center',
    slot: 'platform_name',
    color: 'var(--afun-table-text-color)',
  },
  {
    title: t('投注'),
    dataIndex: 'valid_bet_amount',
    align: 'center',
    slot: 'valid_bet_amount',
    color: 'var(--afun-table-text-color)',
  },
  {
    title: t('金额'),
    dataIndex: 'rebate_amount',
    align: 'center',
    slot: 'rebate_amount',
  },
])

function rowClicked(data: any) {
  detailCurrencyId.value = data.currency_id
  detailGameType.value = data.game_type
  page.value = 2

  if (detailCurrencyId.value && detailGameType.value)
    runGetData({ currency_id: detailCurrencyId.value, game_type: detailGameType.value })
}

function applyRebate() {
  if (rebateSum.value?.length) {
    runAsyncRebateApply().then((res) => {
      rebateSum.value = []
      appEventBus.emit(EventBusNames.GET_TIIMEREBATE_SUCCESS)
      if (res && res.length && isArray(res)) {
        close()
        Message.success(t('返水成功'))
      }
      else {
        Message.success(t('返水成功'))
      }
    })
  }
  else {
    Message.error(t('返水失败'))
  }
}

function getPlatName(name: string, id: string) {
  if (name && name.length && id && id.length) {
    if (name.toLowerCase() === 'casino games' || id[0] === '8')
      return t('小游戏')
    else if (name.toLowerCase() === 'im' || name.toLowerCase() === 'inplay matrix' || id[0] === '4')
      return t('体育')
  }
  return name
}

function close() {
  closeDialog()
}

await application.allSettled([runAsyncRebateSum()])
</script>

<template>
  <div class="p-[16px] pt-0 flex flex-col" @touchstart.stop @touchmove.stop>
    <template v-if="page === 1">
      <div class="flex items-center justify-between mb-[16px]">
        <h2 class="flex items-center">
          <IconUniRebate class="text-[16px] text-[#9DABC8]" />
          <span class="text-[#fff] text-[18px] leading-[25px] font-[600] ml-[8px]">{{ rebateAutomatic && +rebateAutomatic.automatic === 3 ? t('实时返水') : t('返水') }}</span>
        </h2>
        <div class="text-[18px] flex items-center cursor-pointer text-[#9DABC8]" @click.stop="close">
          <IconUniClose3 />
        </div>
      </div>
      <div class="scroll-y" @touchstart.stop @touchmove.stop>
        <div>
          <AfunBaseTable
            class="theme-table"
            :columns="columns" :data-source="rebateSum ?? []" :loading="loadingRebateSum" :show-out-load="true"
            style="--afun-table-th-height:48px;--afun-table-td-height:48px;--afun-table-odd-background:#213743;"
            @row-click="rowClicked"
          >
            <template #currency="{ record: { currency_id } }">
              <div class="flex items-center justify-center">
                <AfunBaseCurrencyIcon :currency-type="getCurrencyConfig(currency_id)?.name" />
              </div>
            </template>
            <template #game_type="{ record: { game_type } }">
              {{ rebateType[game_type]?.label ?? game_type }}
            </template>
            <template #valid_bet_amount="{ record: { valid_bet_amount, currency_id } }">
              <div class="flex items-center justify-center">
                <AfunBaseAmount :amount="valid_bet_amount" :currency-code="currency_id" :show-icon="false" />
              </div>
            </template>
            <template #rebate_amount="{ record: { rebate_amount, currency_id } }">
              <div class="flex items-center justify-center">
                <AfunBaseAmount show-color :amount="rebate_amount" :currency-code="currency_id" :show-icon="false" />
              </div>
            </template>
          </AfunBaseTable>
        </div>
      </div>
      <AfunBaseButton
        :disabled="!(rebateSum && rebateSum.length) || loadingRebateSum"
        :loading="loadingRebateApply" class="w-full mt-[16px] h-[52px]" @click="applyRebate"
      >
        {{ t('一键返水') }}
      </AfunBaseButton>
    </template>
    <template v-else-if="page === 2">
      <div class="flex flex-col" @touchstart.stop @touchmove.stop>
        <div class="flex items-center justify-between mb-[16px]">
          <h2 class="flex items-center">
            <IconUniRebateDetail class="text-[16px] text-[#9DABC8]" />
            <span class="text-[#0D2245] text-[18px] leading-[25px] font-[600] mx-[8px]">{{ t('详情') }}</span>
            <AfunBaseCurrencyIcon v-if="detailCurrencyId" style="--ph-app-currency-icon-size:16px;" :currency-type="getCurrencyConfig(detailCurrencyId)?.name" />
          </h2>
          <div class="text-[18px] flex items-center cursor-pointer text-[#9DABC8]" @click.stop="close">
            <IconUniClose3 />
          </div>
        </div>
        <div class="scroll-y flex flex-1 flex-col" @touchstart.stop @touchmove.stop>
          <div>
            <AfunBaseTable
              :columns="columnsDetail" :data-source="dataResource" :loading="loadingRebateDetail"
              style="--afun-table-th-height:48px;--afun-table-td-height:48px;--afun-table-odd-background:#F6F7F8;--afun-table-td-padding-x:10px;"
              :show-out-load="true" class="theme-table"
            >
              <template #platform_name="{ record: { platform_name, platform_id } }">
                <div>
                  {{ getPlatName(`${platform_name}`, `${platform_id}`) }}
                </div>
              </template>
              <template #created_at="{ record: { time } }">
                <div v-if="time">
                  {{ timeToFormatDiffOnChinese(new Date(time).getTime(), 'MM/DD') }}
                </div>
              </template>
              <template #valid_bet_amount="{ record: { valid_bet_amount, currency_id } }">
                <div class="center">
                  <AfunBaseAmount :amount="valid_bet_amount" :currency-code="currency_id" :show-icon="false" />
                </div>
              </template>
              <template #rebate_amount="{ record: { rebate_amount, currency_id } }">
                <div class="center">
                  <AfunBaseAmount :amount="rebate_amount" :currency-code="currency_id" :show-icon="false" />
                </div>
              </template>
            </AfunBaseTable>
          </div>
        </div>
        <AfunBaseButton class="w-full mt-[16px] h-[52px]" @click="page = 1">
          {{ t('返回') }}
        </AfunBaseButton>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>

</style>
