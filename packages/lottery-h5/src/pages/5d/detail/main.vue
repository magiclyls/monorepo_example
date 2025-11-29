<script setup lang='ts'>
import { ApiCpNav, ApiCpRecord } from '@tg/apis'
import { LotteryEmpty, LotteryPagination, LotteryTabs } from '@tg/bccomponents'
import { application } from '@tg/utils'
import { computed, ref } from 'vue'
import { useRequest } from 'vue-request'
import { isLogin as getLogin } from '../../../utils/tool'
import AppFiveDMyHistoryItem from '../_components/AppFiveDMyHistoryItem.vue'

defineOptions({ name: 'AppLottery5DDetailMain' })

const currentTab = ref(0)
const page = ref(1)
const total = ref(1)
const isLogin = ref(getLogin())

const { runAsync: runAsyncCpNav, data: cpNavData } = useRequest(() => ApiCpNav({ lottery_id: 4001 }), {
  onSuccess(res) {
    currentTab.value = res[0].lottery_id
  },
})

const { run: runGetCpRecord, runAsync: runAsyncGetCpRecord, data: cpRecordData } = useRequest(() => ApiCpRecord({ page: page.value, lottery_id: currentTab.value }), {
  onSuccess: (res) => {
    if (page.value === 1) {
      total.value = res.t === 0 ? 1 : res.t
    }
  },
})

// 彩种
const tabArr = computed(() => {
  if (cpNavData.value) {
    return cpNavData.value.map((a) => {
      return {
        label: a.lottery_name,
        value: a.lottery_id,
      }
    })
  }
  return []
})
const sourceData = computed(() => {
  if (cpRecordData.value && cpRecordData.value.d && cpRecordData.value.d.length > 0) {
    return cpRecordData.value.d
  }
  return []
})

function refresh() {
  if (isLogin.value) {
    page.value = 1
    runGetCpRecord()
  }
}
function last() {
  page.value = page.value - 1
  runGetCpRecord()
}
function next() {
  page.value = page.value + 1
  runGetCpRecord()
}

function init() {
  return new Promise<void>((resolve, reject) => {
    if (isLogin.value) {
      runAsyncCpNav().then(() => {
        runAsyncGetCpRecord().finally(() => {
          resolve()
        })
      })
    }
    else {
      runAsyncCpNav().finally(() => {
        resolve()
      })
    }
  })
}

await application.allSettled([init()])
</script>

<template>
  <div>
    <div class="mb-[16rem] px-[11rem]">
      <LotteryTabs v-model="currentTab" :tabs="tabArr" @change="refresh" />
    </div>
    <div class="px-[13rem] pb-[32rem]">
      <div v-if="sourceData.length === 0" class="w-full mb-[16rem]">
        <LotteryEmpty />
      </div>
      <template v-else>
        <div class="detail-bg px-[13rem] rounded-[8rem]">
          <AppFiveDMyHistoryItem v-for="item of sourceData" :key="item.id" :data="item" />
        </div>
        <div v-if="isLogin && sourceData.length > 0" class="line w-full h-[1rem]" />
      </template>
      <LotteryPagination :total="total" :cur-page="page" @last="last" @next="next" />
    </div>
  </div>
</template>

<style lang='scss' scoped></style>
