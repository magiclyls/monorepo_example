<script setup lang="ts" name="AppTrxWinGoDetail">
import { ApiCpNav, ApiCpRecord } from '@tg/apis'
import { LotteryEmpty, LotteryPagination, LotteryTabs } from '@tg/bccomponents'
import { isFlutterApp } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRequest } from 'vue-request'
import { useTrxWinGoStore } from '../../../stores/useTrxWinGoStore'
import { isLogin as getLogin, isIFrame } from '../../../utils/tool'
import AppTrxWinGoDetailItem from '../_components/AppTrxWinGoDetailItem.vue'

const trxWinGoStore = useTrxWinGoStore()
const { trxWinGoTabArr } = storeToRefs(trxWinGoStore)
const curTab = ref<number>(trxWinGoTabArr.value.length > 0 ? trxWinGoTabArr.value[0].value : 5002)
const page = ref(1)
const total = ref(1)
const isLogin = ref(getLogin())
const { runAsync: runAsyncNav } = useRequest(() => ApiCpNav({ lottery_id: 1001 }))
const { runAsync: runAsyncRecord, data } = useRequest(params => ApiCpRecord(params), {
  ready: isLogin,
  onSuccess: (res) => {
    if (page.value === 1) {
      total.value = res.t === 0 ? 1 : res.t
    }
  },
})
const sourceData = computed(() => data.value?.d || [])

async function getNav() {
  const res = await runAsyncNav()
  const nav = res.map((item) => {
    return {
      label: item.lottery_name,
      value: item.lottery_id,
    }
  })
  curTab.value = nav[0].value
  trxWinGoStore.setTrxWinGoTabArr(nav)
}
async function init() {
  if (!isIFrame() && !isFlutterApp() && trxWinGoTabArr.value.length < 1) {
    await getNav()
  }
  if (isLogin.value) {
    await runAsyncRecord({ page: page.value, lottery_id: curTab.value })
  }
}
function onTabChange() {
  runAsyncRecord({ page: page.value, lottery_id: curTab.value })
}

watch(page, () => {
  runAsyncRecord({ page: page.value, lottery_id: curTab.value })
})

await init()
</script>

<template>
  <div class="detail">
    <div class="mb-[16rem] px-[11rem]">
      <LotteryTabs v-model="curTab" :tabs="trxWinGoTabArr" @update:model-value="onTabChange" />
    </div>
    <div v-if="isLogin && sourceData.length > 0" class="detail-bg rounded-[8rem] overflow-hidden mx-[12rem]">
      <div class="mx-[13rem]">
        <AppTrxWinGoDetailItem :data="sourceData" :is-clear="false" />
        <LotteryPagination :total="total" :cur-page="page" class="pagination" @last="page--" @next="page++" />
      </div>
    </div>
    <div v-if="!isLogin || sourceData.length < 1">
      <LotteryEmpty />
    </div>
  </div>
</template>
