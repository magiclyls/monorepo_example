<script setup lang="ts" name="AppWinGoDetail">
import { ApiCpNav, ApiCpRecord } from '@tg/apis'
import { LotteryEmpty, LotteryPagination, LotteryTabs } from '@tg/bccomponents'
import { computed, ref, watch } from 'vue'
import { useRequest } from 'vue-request'
import { isLogin as getLogin } from '../../../utils/tool'
import AppMyHistoryList from '../_components/AppMyHistoryList.vue'

const curTab = ref<number>(3001)
const page = ref(1)
const total = ref(1)
const isLogin = ref(getLogin())
const k3TabArr = ref()
const { runAsync: runAsyncNav } = useRequest(() => ApiCpNav({ lottery_id: 3002 }))
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
  k3TabArr.value = nav
  curTab.value = nav[0].value
}
async function init() {
  await getNav()
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
  <div>
    <div class="mb-[16rem] px-[11rem]">
      <LotteryTabs v-if="k3TabArr" v-model="curTab" :tabs="k3TabArr" @update:model-value="onTabChange" />
    </div>
    <div v-if="isLogin && sourceData.length > 0" class="rounded-[8rem] overflow-hidden mx-[12rem] k3-history-detail">
      <div class="mx-[13rem]">
        <AppMyHistoryList :data="sourceData" />
        <LotteryPagination :total="total" :cur-page="page" class="k3-history-detail-border border-t-[1rem]" @last="page--" @next="page++" />
      </div>
    </div>
    <div v-if="!isLogin || sourceData.length < 1">
      <LotteryEmpty />
    </div>
  </div>
</template>
