<script lang="ts" setup>
import type { CurrencyCode } from '~/composables/useCurrencyData'

import { ApiMemberPromoInviteFriendsList } from '@tg/apis'

defineOptions({
  name: 'KeepAlivePromotionInviteFriendsRecord',
})

const { t } = useI18n()
const route = useRoute()
const { openInviteFriendsRecordDialog } = useDialogInviteFriendsRecord()

const activity_id = String(route.query.activity_id)
const cur = String(route.query.cur) as CurrencyCode

const tableColumn: Column[] = [
  {
    title: t('VIP_account'),
    dataIndex: 'username',
    align: 'center',
    width: '25%',
    slot: 'username',
  },
  {
    title: t('register_time'),
    dataIndex: 'reg_at',
    align: 'center',
    slot: 'reg_at',
    width: '25%',
  },
  {
    title: t('deposit_bonus2'),
    dataIndex: 'all_deposit_bonus',
    align: 'center',
    slot: 'all_deposit_bonus',
    width: '25%',
  },
  {
    title: t('bet_bonus'),
    dataIndex: 'bet_bonus',
    align: 'center',
    slot: 'bet_bonus',
    width: '25%',
  },
]
const daysArr = [t('finance_other_tab_all'), t('today2'), t('last_seven_days'), t('last_thirty_days')]
const activeDaysIndex = ref(0)
const currentPage = ref(1)
const tableData = ref<Record<string, any>[]>([])
const currencyIcon = ref(getCurrencyConfigByCode(cur).name)

const ListParams = computed(() => {
  const tem = {
    page: currentPage.value,
    page_size: 10,
    activity_id,
    cur,
    time_type: activeDaysIndex.value,
  }
  // const today = getTodayTimeRange()
  // 过去7天
  // const weekstart = dayjs().subtract(6, 'day').startOf('day')
  // const monthstart = dayjs().subtract(30, 'day').startOf('day')

  // switch (activeDaysIndex.value) {
  //   case 0:
  //     tem.start_time = '2024-04-19 00:00:00'
  //     tem.end_time = '2026-04-19 00:00:00'
  //     break
  //   case 1:
  //     tem.start_time = dayjs(today.start * 1000).format('YYYY-MM-DD HH:mm:ss')
  //     tem.end_time = dayjs(today.end * 1000).format('YYYY-MM-DD HH:mm:ss')
  //     break
  //   case 2:
  //     tem.start_time = dayjs(weekstart).format('YYYY-MM-DD HH:mm:ss')
  //     tem.end_time = dayjs(today.end * 1000).format('YYYY-MM-DD HH:mm:ss')
  //     break
  //   case 3:
  //     tem.start_time = dayjs(monthstart).format('YYYY-MM-DD HH:mm:ss')
  //     tem.end_time = dayjs(today.end * 1000).format('YYYY-MM-DD HH:mm:ss')
  //     break
  //   default:
  //     break
  // }
  return tem
})
/** 获取邀请记录  */
const { runAsync: runAsyncListData, data: listData, loading } = useRequest(ApiMemberPromoInviteFriendsList, {
  onSuccess(data) {
    if (!data)
      return
    tableData.value = data.d
  },
})
const totalList = computed(() => Number(listData.value?.t))
const isShowPagination = computed(() => Number(listData.value?.t) / 10 > 1)

watch([activeDaysIndex, currentPage], () => {
  runAsyncListData(ListParams.value)
})

await application.allSettled([runAsyncListData(ListParams.value)])
</script>

<template>
  <div>
    <div class="text-tg-text-white my-[20px] text-[18px] font-semibold">
      {{ t('invite_registration') }}
    </div>
    <div class="mb-[12px] flex">
      <span
        v-for="item, index in daysArr" :key="index"
        class="text-tg-text-white days mr-[8px] flex cursor-pointer items-center justify-center rounded-[4px] px-[15px] py-[10px] text-center text-[14px]"
        :class="{ active: activeDaysIndex === index }"
        @click="activeDaysIndex = index"
      >
        {{ item }}
      </span>
    </div>
    <div class="text-tg-text-lightgrey mb-[6px] text-center text-[12px] font-semibold">
      {{ t('invite_friends_record_tips') }}
    </div>
    <BaseTable class="table-wrapper min-h-[583px]" :columns="tableColumn" last-first-padding :data-source="tableData" :loading="loading">
      <template #username="{ record }">
        <div class="max-w-[100px] flex items-center justify-center">
          <span class="w-full break-all text-wrap">{{ record.username }}</span>
        </div>
      </template>
      <template #reg_at="{ record }">
        <div class="flex items-center justify-center">
          {{ dayjs(record.reg_at * 1000).format('MM-DD HH:mm') }}
        </div>
      </template>
      <template #all_deposit_bonus="{ record }">
        <div class="flex items-center justify-center" @click="openInviteFriendsRecordDialog({ type: 1, activityId: activity_id, id: record.id, cur })">
          <AppAmount class="amount" :amount="record.all_deposit_bonus || '0.00'" :currency-type="currencyIcon" :show-icon="false" />
        </div>
      </template>
      <template #bet_bonus="{ record }">
        <div class="flex items-center justify-center" @click="openInviteFriendsRecordDialog({ type: 2, activityId: activity_id, id: record.id, cur })">
          <AppAmount class="amount" :amount="record.bet_bonus || '0.00'" :currency-type="currencyIcon" :show-icon="false" />
        </div>
      </template>
    </BaseTable>
    <AppInviteFriendsPagination v-if="isShowPagination" v-model:current-page="currentPage" class="mb-[30px]" :total="totalList" />
    <div v-else-if="Number(listData?.t)" class="tips-bottom mb-[30px]">
      {{ t('reached_the_bottom') }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.days {
  background-color: #0f212e;
  &.active {
    background: #2f4554;
    @include webTheme('white') {
      background-color: #cbcbcb;
    }
    @include webTheme('green') {
      background-color: #3b795b;
    }
  }
  @include webTheme('white') {
    background-color: #f5f5f5;
  }
  @include webTheme('green') {
    background-color: #02432d;
  }
}

.tips-bottom {
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #b1bad3;
  margin-top: 20px;
}

.amount {
  color: #00e701;
  text-decoration: underline;
  @include webTheme('white') {
    color: #ffaa09;
  }
  @include webTheme('green') {
    color: #f6d14a;
  }
}
.table-wrapper {
  --tg-table-tr-last-first-padding: 4px;
  --tg-table-th-padding-x: 4px;
  --tg-table-td-padding-x: 4px;
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
