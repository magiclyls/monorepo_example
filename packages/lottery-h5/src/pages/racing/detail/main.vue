<script setup lang="ts" name="AppWinGoDetail">
import { ApiCpNav, ApiCpRecord } from '@tg/apis'
import { LotteryEmpty, LotteryPagination, LotteryTabs } from '@tg/bccomponents'
import { isFlutterApp } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRequest } from 'vue-request'
import { useRaceStore } from '../../../stores/useRaceStore'
import { isLogin as getLogin, isIFrame } from '../../../utils/tool'
import AppRacingDetailItem from '../_components/AppRacingDetailItem.vue'

const raceStore = useRaceStore()
const { raceTabArr } = storeToRefs(raceStore)
const curTab = ref<number>(raceTabArr.value.length > 0 ? raceTabArr.value[0].value : 2001)
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
  raceStore.setRaceTabArr(nav)
}
async function init() {
  if (!isIFrame() && !isFlutterApp() && raceTabArr.value.length < 1) {
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
      <LotteryTabs v-model="curTab" :tabs="raceTabArr" @update:model-value="onTabChange" />
    </div>
    <div v-if="isLogin && sourceData.length > 0" class="detail-bg rounded-[8rem] overflow-hidden mx-[12rem]">
      <div class="mx-[13rem]">
        <AppRacingDetailItem :data="sourceData" :is-clear="false" />
        <LotteryPagination :total="total" :cur-page="page" class="pagination " @last="page--" @next="page++" />
      </div>
    </div>
    <div v-if="!isLogin || sourceData.length < 1">
      <LotteryEmpty />
    </div>
  </div>
</template>
