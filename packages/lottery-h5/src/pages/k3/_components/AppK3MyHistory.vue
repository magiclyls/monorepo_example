<script setup lang="ts" name="AppK3MyHistory">
import type { Ref } from 'vue'
import { ApiCpRecord } from '@tg/apis'
import { LotteryEmpty, LotteryPagination } from '@tg/bccomponents'
import { IconLotBack } from '@tg/icons'

import { EventBusNames } from '@tg/types'
import {
  appEventBus,
} from '@tg/utils'
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRequest } from 'vue-request'

import { useLocale } from '../../../components/LotteryConfigProvider'
import { useLocalRouter } from '../../../hooks/useLocalRouter'
import { isLogin as getLogin } from '../../../utils/tool'
import AppMyHistoryList from './AppMyHistoryList.vue'

const { $$t } = useLocale()
const currentTab = inject<Ref<number>>('currentTab', ref(1001))
const { push } = useLocalRouter()
const page = ref(1)
const total = ref(1)

const isLogin = ref(getLogin())

const { runAsync: runAsyncRecord, data } = useRequest(() => ApiCpRecord({ page: page.value, lottery_id: currentTab.value }), {
  ready: isLogin,
  onSuccess: (res) => {
    if (page.value === 1) {
      total.value = res.t === 0 ? 1 : res.t
    }
  },
})

const sourceData = computed(() => data.value?.d || [])

function refresh() {
  if (page.value !== 1) {
    page.value = 1
    return
  }
  runAsyncRecord()
  // clickedMap.value.clear()
}

watch(currentTab, () => {
  refresh()
})
watch(page, () => {
  runAsyncRecord()
})
onMounted(() => {
  appEventBus.on(EventBusNames.LOTTERY_K3_HISTORY, refresh)
  if (isLogin.value) {
    runAsyncRecord()
  }
})
onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.LOTTERY_K3_HISTORY, refresh)
})
</script>

<template>
  <div class="k3">
    <div class="w-full k3-bg p-[12rem] rounded-[8rem]">
      <div class="w-full text-right flex justify-end" @click="push('/k3/detail')">
        <div class="w-[68rem] h-[30rem] border-[1rem] detail-btn rounded-[6rem] center cursor-pointer">
          <span class="mr-[6rem]">{{ $$t('详情') }}</span>
          <div class="size-[15rem] text-[#6D7693] text-[20rem] rounded-[100rem] border-[1rem] border-[#6D7693] center">
            <IconLotBack class="rotate-180 scale-50" />
          </div>
        </div>
      </div>
      <div v-if="isLogin">
        <AppMyHistoryList :data="sourceData" />
      </div>
      <div v-if="!isLogin || sourceData.length < 1" class="w-full">
        <LotteryEmpty />
      </div>
    </div>
    <LotteryPagination :total="total" :cur-page="page" class="mt-[16rem]" @last="page--" @next="page++" />
  </div>
</template>

<style scoped lang="scss">

</style>
