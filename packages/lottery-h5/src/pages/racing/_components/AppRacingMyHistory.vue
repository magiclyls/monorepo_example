<script setup lang="ts" name="AppRacingMyHistory">
import type { Ref } from 'vue'
import { ApiCpRecord } from '@tg/apis'
import { LotteryEmpty, LotteryPagination } from '@tg/bccomponents'
import { IconLotBack } from '@tg/icons'
import { computed, inject, onActivated, ref, watch } from 'vue'
import { useRequest } from 'vue-request'
import { useLocale } from '../../../components/LotteryConfigProvider'
import { useLocalRouter } from '../../../hooks/useLocalRouter'
import { isLogin as getLogin } from '../../../utils/tool'
import AppRacingDetailItem from './AppRacingDetailItem.vue'

const { $$t } = useLocale()
const { push } = useLocalRouter()
const currentTab = inject<Ref<number>>('currentTab', ref(2001))
const page = ref(1)
const total = ref(1)
const isLogin = ref(getLogin())
const isClear = ref(false)
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
  isClear.value = true
  if (page.value !== 1) {
    page.value = 1
    return
  }
  runAsyncRecord()
}

watch(page, () => {
  runAsyncRecord()
})
defineExpose({
  refresh,
})
onActivated(() => {
  isLogin.value = getLogin()
})

if (isLogin.value) {
  await runAsyncRecord()
}
</script>

<template>
  <div class="win-go">
    <div class="w-full win-go-bg p-[12rem] rounded-[8rem]">
      <div class="w-full text-right flex justify-end" @click="push('/racing/detail')">
        <div class="detail-btn w-[68rem] h-[30rem] rounded-[6rem] center cursor-pointer">
          <span class="mr-[6rem]">{{ $$t('详情') }}</span>
          <div class="detail-right size-[15rem] text-[20rem] rounded-[100rem] center">
            <IconLotBack class="rotate-180 scale-50" />
          </div>
        </div>
      </div>
      <div v-if="isLogin">
        <AppRacingDetailItem v-model:is-clear="isClear" :data="sourceData" />
      </div>
      <div v-if="!isLogin || sourceData.length < 1" class="w-full">
        <LotteryEmpty />
      </div>
    </div>
    <LotteryPagination :total="total" :cur-page="page" class="mt-[16rem]" @last="page--" @next="page++" />
  </div>
</template>
