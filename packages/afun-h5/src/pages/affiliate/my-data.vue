<script lang="ts" setup>
import { ApiMyData } from '@tg/apis'
import { AfunBaseCurrencyIcon } from '@tg/bccomponents'
import { useAffiliate, useAppStore } from '@tg/stores'
import { application, getCurrencyConfig } from '@tg/utils'
import { getDaIntervalMap } from '@tg/vue-i18n'
import { throttle } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import BaseDatePicker from '~/components/BaseDatePicker.vue'

const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const { bonus_currency, mode } = storeToRefs(useAffiliate())
const { startTime, endTime } = getDaIntervalMap(new Date().getTime(), 30)
const date = ref([])

const { data: proData, loading: loadMyData, runAsync: runAsyncGetMyPro } = useRequest(ApiMyData, {
  ready: isLogin,
})

interface Item {
  label: string
  value: string
  price?: boolean
  after?: string
}

const today = computed<Item[][]>(() => mode.value === 1
  ? [
      [
        {
          label: t('总佣金'),
          value: `${proData.value?.commission_amount_total || '0.00'}`,
          price: true,
        },
      ],
      [
        {
          label: t('直属投注'),
          value: proData.value?.valid_bet_amount_direct || '0.00',
          after: `/${proData.value?.valid_bet_cnt_direct || 0} ${t('人')}`,
          price: true,
        },
      ],
      [
        {
          label: t('注册人数'),
          value: (proData.value?.reg_cnt_total || '0') + t('人'),

        },
      ],
      [
        {
          label: t('首次存款总额'),
          value: proData.value?.first_deposit_amt_total || '0.00',
          after: `/${proData.value?.first_cnt_total || 0} ${t('人')}`,
          price: true,
        },
      ],
      [
        {
          label: t('存款总额'),
          value: proData.value?.deposit_amt_total || '0.00',
          after: `/${proData.value?.deposit_cnt_total || 0} ${t('人')}`,
          price: true,
        },
      ],
    ]
  : [
      [
        {
          label: t('总佣金'),
          value: `${proData.value?.commission_amount_total || '0.00'}`,
          price: true,
        },
        {
          label: t('直属佣金'),
          value: `${proData.value?.commission_amount_direct || '0.00'}`,
          price: true,
        },
        {
          label: t('团队佣金'),
          value: `${proData.value?.commission_amount_other || '0.00'}`,
          price: true,
        },
      ],
      [
        {
          label: t('总投注'),
          value: proData.value?.valid_bet_amount_total || '0.00',
          after: `/${proData.value?.valid_bet_cnt_total || 0} ${t('人')}`,
          price: true,
        },
        {
          label: t('直属投注'),
          value: proData.value?.valid_bet_amount_direct || '0.00',
          after: `/${proData.value?.valid_bet_cnt_direct || 0} ${t('人')}`,
          price: true,
        },
        {
          label: t('团队投注'),
          value: proData.value?.valid_bet_amount_other || '0.00',
          after: `/${proData.value?.valid_bet_cnt_other || 0} ${t('人')}`,
          price: true,
        },
      ],
      [
        {
          label: t('总注册'),
          value: `${proData.value?.reg_cnt_total || 0} ${t('人')}`,

        },
        {
          label: t('直属注册'),
          value: `${proData.value?.reg_cnt_direct || 0} ${t('人')}`,

        },
        {
          label: t('团队注册'),
          value: `${proData.value?.reg_cnt_other || 0} ${t('人')}`,
        },
      ],
      [
        {
          label: t('首次存款总额'),
          value: proData.value?.first_deposit_amt_total || '0.00',
          after: `/${proData.value?.first_cnt_total || 0} ${t('人')}`,
          price: true,
        },
        {
          label: t('直属首次存款'),
          value: proData.value?.first_deposit_amt_direct || '0.00',
          after: `/${proData.value?.first_cnt_direct || 0} ${t('人')}`,
          price: true,
        },
        {
          label: t('团队首次存款'),
          value: proData.value?.first_deposit_amt_other || '0.00',
          after: `/${proData.value?.first_cnt_other || 0} ${t('人')}`,
          price: true,
        },
      ],
      [
        {
          label: t('存款总额'),
          value: proData.value?.deposit_amt_total || '0.00',
          after: `/${proData.value?.deposit_cnt_total || 0} ${t('人')}`,
          price: true,
        },
        {
          label: t('直属存款'),
          value: proData.value?.deposit_amt_direct || '0.00',
          after: `/${proData.value?.deposit_cnt_direct || 0} ${t('人')}`,
          price: true,
        },
        {
          label: t('团队存款'),
          value: proData.value?.deposit_amt_other || '0.00',
          after: `/${proData.value?.deposit_cnt_other || 0} ${t('人')}`,
          price: true,
        },
      ],

    ])

const runFn = throttle(async () => {
  await application.allSettled(
    [runAsyncGetMyPro({
      start_time: date.value[0],
      end_time: date.value[1],
    })],
  )
}, 500, { leading: true, trailing: false })

watch(date, () => {
  if (isLogin.value)
    runFn()
}, {
  deep: true,
})
</script>

<template>
  <div class="tg-affiliate-retention promotion-info-box">
    <div class="retention-item">
      <div class="search-line">
        <BaseDatePicker
          v-model="date"
          class="my-affiliate-picker"
          :min="startTime"
          :max="endTime"
          :is-utc="false"
          show-tab
        />
      </div>
      <div class="mt-[8px]">
        <div v-for="(item, index) in today" :key="index" class="my-data-item rounded-[6px] overflow-hidden flex flex-col gap-[1px]">
          <div v-for="(citem, cindex) in item" :key="cindex">
            <div class="px-[16px] py-[19px] flex justify-between items-center bg-[#213743]">
              <span class="text-[#B1BAD3] text-[14px] font-[600]">{{ citem.label }} </span>
              <div class="h-16 flex items-center">
                <BaseSkeleton v-if="loadMyData" height="14px" animated="ani-opacity" />
                <div v-else class="flex flex-row flex-wrap gap-x-4 font-semibold justify-end">
                  <div v-if="citem.price" class="flex items-center gap-[4px] text-[#fff] text-[14px] font-[600]">
                    <AfunBaseCurrencyIcon :currency-type="getCurrencyConfig(bonus_currency)?.name" />
                    <span>{{ citem.value }}</span>
                  </div>
                  <span v-else>
                    {{ citem.value }}
                  </span>
                  <span v-if="citem.after">
                    {{ citem.after }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.my-data-item {
  margin-bottom: 8px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
