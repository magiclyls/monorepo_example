<script setup lang='ts'>
import type { Column } from '@tg/types'
import { ApiMemberPromoInviteFriendsBetList, ApiMemberPromoInviteFriendsDepositList } from '@tg/apis'
import { PhBaseTable } from '@tg/bccomponents'
import { application } from '@tg/utils'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute } from 'vue-router'
import AppInviteFriendsPagination from '~/components/AppInviteFriendsPagination.vue'

defineOptions({ name: 'AppDialogInviteFriendsRecord' })

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
    title: t('累计存款'),
    dataIndex: 'total_deposit',
    align: 'center',
    width: '33%',
  },
  {
    title: t('累计存款奖金'),
    dataIndex: 'total_deposit_bonus',
    align: 'center',
    width: '33%',
  },
  {
    title: t('单笔存款总奖金'),
    dataIndex: 'deposit_bonus',
    align: 'center',
    slot: 'deposit_bonus',
    width: '33%',
  },
]
const tableColumnheader2: Column[] = [
  {
    title: t('总有效投注'),
    dataIndex: 'total_valid_bet_amount',
    align: 'center',
    width: '50%',
  },
  {
    title: t('总奖金'),
    dataIndex: 'total_bonus_amount',
    align: 'center',
    width: '50%',
  },
]
const tableColumnheader = props.type === 1 ? tableColumnheader1 : tableColumnheader2

const tableColumn1: Column[] = [
  {
    title: t('笔数'),
    dataIndex: 'number',
    align: 'center',
    width: '33%',
  },
  {
    title: t('单笔存款金额'),
    dataIndex: 'deposit_amount',
    align: 'center',
    width: '33%',
  },
  {
    title: t('单笔存款奖金'),
    dataIndex: 'bonus_amount',
    align: 'center',
    slot: 'deposit_bonus',
    width: '33%',
  },
]
const tableColumn2: Column[] = [
  {
    title: t('游戏平台'),
    dataIndex: 'game_platform',
    align: 'center',
    width: '33%',
  },
  {
    title: t('有效投注'),
    dataIndex: 'valid_bet_amount',
    align: 'center',
    width: '33%',
  },
  {
    title: t('奖金'),
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
  <div class="p-[16rem]">
    <PhBaseTable class="table-wrapper" :columns="tableColumnheader" last-first-padding :data-source="tableDataheader" />
    <div class="line" />
    <PhBaseTable class="table-wrapper" :columns="tableColumn" last-first-padding :data-source="tableData" :loading="loading1 || loading2" />
    <AppInviteFriendsPagination v-if="isShowPagination" v-model:current-page="currentPage" class="mt-[20rem]" :size="6" :total="totalList" />
  </div>
</template>

<style lang='scss' scoped>
.line {
  margin-top: 20rem;
  height: 1rem;
  background: #2f4553;
  margin-bottom: 14rem;
}

.table-wrapper {
  --tg-table-tr-last-first-padding: 3rem;
  --tg-table-th-padding-x: 3rem;
  --tg-table-td-padding-x: 3rem;
}
</style>
