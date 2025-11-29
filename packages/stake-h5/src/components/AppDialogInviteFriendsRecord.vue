<script setup lang='ts'>
import { ApiMemberPromoInviteFriendsBetList, ApiMemberPromoInviteFriendsDepositList } from '@tg/apis'

defineOptions({ name: 'AppDialogShareRegisterLink' })

const props = withDefaults(defineProps<Props>(), {

})
interface Props {
  type: 1 | 2
  id: string
  activityId: string
  cur: string
}

const { t } = useI18n()
const route = useRoute()

const tableColumnheader1: Column[] = [
  {
    title: t('Accumulated_deposit'),
    dataIndex: 'total_deposit',
    align: 'center',
    width: '33%',
  },
  {
    title: t('total_deposit_bonus'),
    dataIndex: 'total_deposit_bonus',
    align: 'center',
    width: '33%',
  },
  {
    title: t('single_deposit_total_bonus'),
    dataIndex: 'deposit_bonus',
    align: 'center',
    slot: 'deposit_bonus',
    width: '33%',
  },
]
const tableColumnheader2: Column[] = [
  {
    title: t('total_valid_bet_amount'),
    dataIndex: 'total_valid_bet_amount',
    align: 'center',
    width: '50%',
  },
  {
    title: t('total_bonus'),
    dataIndex: 'total_bonus_amount',
    align: 'center',
    width: '50%',
  },
]
const tableColumnheader = props.type === 1 ? tableColumnheader1 : tableColumnheader2

const tableColumn1: Column[] = [
  {
    title: t('stroke_count'),
    dataIndex: 'number',
    align: 'center',
    width: '33%',
  },
  {
    title: t('single_deposit_amount'),
    dataIndex: 'deposit_amount',
    align: 'center',
    width: '33%',
  },
  {
    title: t('single_deposit_bonus'),
    dataIndex: 'bonus_amount',
    align: 'center',
    slot: 'deposit_bonus',
    width: '33%',
  },
]
const tableColumn2: Column[] = [
  {
    title: t('game_platform'),
    dataIndex: 'game_platform',
    align: 'center',
    width: '33%',
  },
  {
    title: t('Valid_bets'),
    dataIndex: 'valid_bet_amount',
    align: 'center',
    width: '33%',
  },
  {
    title: t('Bonus'),
    dataIndex: 'bonus_amount',
    align: 'center',
    slot: 'deposit_bonus',
    width: '33%',
  },
]
const tableColumn = props.type === 1 ? tableColumn1 : tableColumn2

const tableDataheader = ref<Record<string, any>[]>([])
const tableData = ref<Record<string, any>[]>([])

const { data: DepositList, runAsync: runDepositListAsync, loading: loading1 } = useRequest(ApiMemberPromoInviteFriendsDepositList, {
  onSuccess(data) {
    if (!data)
      return
    tableData.value = data.d
    tableDataheader.value = data.total
  },
})

const { data: BetList, runAsync: runBetListAsync, loading: loading2 } = useRequest(ApiMemberPromoInviteFriendsBetList, {
  onSuccess(data) {
    if (!data)
      return
    tableData.value = data.d
    tableDataheader.value = data.total
  },
})

const currentPage = ref(1)
const isShowPagination = computed(() => Number(DepositList.value?.t) / 6 > 1 || Number(BetList.value?.t) / 6 > 1)
const totalList = computed(() => Number(DepositList.value?.t) || Number(BetList.value?.t))

const ListParams = computed(() => {
  const tem = {
    page: currentPage.value,
    page_size: 6,
    id: props.id,
    activity_id: route.query.activity_id?.toString() ?? '',
  }
  return tem
})
async function getData() {
  if (props.type === 1)
    await runDepositListAsync(ListParams.value)
  else
    await runBetListAsync(ListParams.value)
}
watch([currentPage], () => {
  getData()
})

await application.allSettled([getData()])
</script>

<template>
  <div class="p-[16px]">
    <div class="text-tg-text-white mb-[14px] text-left text-[16px] font-medium leading-[25px]">
      {{ type === 1 ? t('deposit_bonus2') : t('bet_bonus') }}
    </div>
    <BaseTable class="table-wrapper" :columns="tableColumnheader" last-first-padding :data-source="tableDataheader" />
    <div class="line" />
    <BaseTable class="table-wrapper" :columns="tableColumn" last-first-padding :data-source="tableData" :loading="loading1 || loading2" />
    <AppInviteFriendsPagination v-if="isShowPagination" v-model:current-page="currentPage" class="mt-[20px]" :size="6" :total="totalList" />
  </div>
</template>

<style lang='scss' scoped>
.line {
  margin-top: 20px;
  height: 1px;
  background: #2f4553;
  margin-bottom: 14px;
  @include webTheme('white') {
    background-color: #fff;
  }
  @include webTheme('green') {
    background-color: #197b59;
  }
}

.table-wrapper {
  --tg-table-tr-last-first-padding: 3px;
  --tg-table-th-padding-x: 3px;
  --tg-table-td-padding-x: 3px;
  @include webTheme('white') {
    --tg-table-odd-background: #fff;
    --tg-table-even-background: #f5f5f5;
  }
  @include webTheme('green') {
    --tg-table-odd-background: #076237;
  }
}
</style>
