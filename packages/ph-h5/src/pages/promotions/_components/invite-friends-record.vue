<script lang="ts" setup>
import type { Column, CurrencyCode } from '@tg/types'
import { ApiMemberPromoInviteFriendsList } from '@tg/apis'
import { PhBaseAmount, PhBaseDialog, PhBaseTable } from '@tg/bccomponents'
import { application, getCurrencyConfig } from '@tg/utils'
import dayjs from 'dayjs'
import { computed, inject, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute } from 'vue-router'
import AppDialogInviteFriendsRecord from '~/components/AppDialogInviteFriendsRecord.vue'
import AppInviteFriendsPagination from '~/components/AppInviteFriendsPagination.vue'

defineOptions({
  name: 'KeepAlivePromotionInviteFriendsRecord',
})
const { t } = useI18n()
const route = useRoute()

// const { openInviteFriendsRecordDialog } = useDialogInviteFriendsRecord()
const activity_id = String(route.query.activity_id)
const cur = String(route.query.cur) as CurrencyCode
const curBtnRef = ref(null)
const btnContainer = ref(null)
const setTitle = inject('setTitle', (v: string) => {})
setTitle(t('邀请注册'))
const tableColumn: Column[] = [
  {
    title: t('会员账号'),
    dataIndex: 'username',
    align: 'center',
    width: '25%',
    slot: 'username',
  },
  {
    title: t('注册时间'),
    dataIndex: 'reg_at',
    align: 'center',
    slot: 'reg_at',
    width: '25%',
  },
  {
    title: t('存款奖金'),
    dataIndex: 'all_deposit_bonus',
    align: 'center',
    slot: 'all_deposit_bonus',
    width: '25%',
  },
  {
    title: t('投注奖金'),
    dataIndex: 'bet_bonus',
    align: 'center',
    slot: 'bet_bonus',
    width: '25%',
  },
]
const daysArr = [t('全部'), t('今天'), t('过去7天'), t('过去30天')]
const activeDaysIndex = ref(0)
const currentPage = ref(1)
const tableData = ref<Record<string, any>[]>([])
const currencyIcon = ref(getCurrencyConfig(cur).name)
const showDialog = ref(false)
const id = ref('')
const type = ref<1 | 2>(1)

function changeDaysType(index: number) {
  if (curBtnRef.value && btnContainer.value) {
    const target: HTMLElement = curBtnRef.value[index]
    const container: HTMLElement = btnContainer.value

    const targetLeft = target.offsetLeft
    const targetWidth = target.offsetWidth
    const containerWidth = container.offsetWidth
    const scrollLeft = targetLeft + targetWidth / 2 - containerWidth / 2

    container.scrollTo({
      left: scrollLeft,
      behavior: 'smooth',
    })
  }
  activeDaysIndex.value = index
}

const ListParams = computed(() => {
  const tem = {
    page: currentPage.value,
    page_size: 10,
    activity_id,
    cur,
    time_type: activeDaysIndex.value,
  }
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
    <!-- <div class="text-[#0D2245] my-[20rem] text-[18rem] font-[500]">
      {{ t('邀请注册') }}
    </div> -->
    <div ref="btnContainer" class="mb-[12rem] scroll-x hide-scroll-bar grid auto-cols-max grid-flow-col gap-[8rem]">
      <span
        v-for="item, index in daysArr"
        ref="curBtnRef" :key="index"
        class="text-[#0D2245] days flex cursor-pointer items-center justify-center rounded-[4rem] px-[15rem] py-[10rem] text-center text-[14rem]"
        :class="{ active: activeDaysIndex === index }"
        @click="changeDaysType(index)"
      >
        {{ item }}
      </span>
    </div>
    <div class="text-tg-text-lightgrey mb-[6rem] text-center text-[12rem] text-[#6D7693] font-[500]">
      {{ t('系统目前仅支持查看最近30天的贡献记录') }}
    </div>
    <div class="table-container">
      <PhBaseTable class="table-wrapper min-h-[583rem]" :columns="tableColumn" last-first-padding :data-source="tableData" :loading="loading">
        <template #username="{ record }">
          <div class="max-w-[100rem] center">
            <span class="w-full break-all text-wrap">{{ record.username }}</span>
          </div>
        </template>
        <template #reg_at="{ record }">
          <div class="center">
            {{ dayjs(record.reg_at * 1000).format('MM-DD HH:mm') }}
          </div>
        </template>
        <template #all_deposit_bonus="{ record }">
          <div class="center" @click="showDialog = true; id = record.id; type = 1">
            <PhBaseAmount class="amount" :amount="record.all_deposit_bonus || '0.00'" :currency-type="currencyIcon" :show-icon="false" />
          </div>
        </template>
        <template #bet_bonus="{ record }">
          <div class="center" @click="showDialog = true; id = record.id; type = 2">
            <PhBaseAmount class="amount" :amount="record.bet_bonus || '0.00'" :currency-type="currencyIcon" :show-icon="false" />
          </div>
        </template>
      </PhBaseTable>
    </div>
    <AppInviteFriendsPagination v-if="isShowPagination" v-model:current-page="currentPage" class="mb-[30rem]" :total="totalList" :size="10" />

    <div v-else-if="Number(listData?.t)" class="tips-bottom mb-[30rem]">
      {{ t('已经到底了') }}
    </div>
  </div>
  <PhBaseDialog v-model="showDialog" :title="type === 1 ? t('存款奖金') : t('投注奖金')">
    <AppDialogInviteFriendsRecord :id="id" :type="type" :activity-id="activity_id" :cur="cur" />
  </PhBaseDialog>
</template>

<style lang="scss" scoped>
/* 确保滚动条完全隐藏 */
.hide-scroll-bar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.hide-scroll-bar::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.hide-scroll-bar::-webkit-scrollbar-track {
  display: none;
}

.hide-scroll-bar::-webkit-scrollbar-thumb {
  display: none;
}
.days {
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ebebeb;

  color: #0d2245;
  font-family: 'PingFang SC';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  &.active {
    color: #fff;
    background: #f23038;
  }
}

.tips-bottom {
  font-size: 14rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #6d7693;
  margin-top: 20rem;
}

.amount {
  color: #f23038;
  text-decoration: underline;
}
.table-container {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table-wrapper {
  --tg-table-tr-last-first-padding: 4rem;
  --tg-table-th-padding-x: 4rem;
  --tg-table-td-padding-x: 4rem;
  min-width: 100%;
}
</style>
