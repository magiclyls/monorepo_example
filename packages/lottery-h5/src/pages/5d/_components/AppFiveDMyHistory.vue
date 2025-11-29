<script setup lang="ts">
import { ApiCpRecord } from '@tg/apis'
import { LotteryEmpty, LotteryPagination } from '@tg/bccomponents'
import { IconLotBack } from '@tg/icons'
import { application } from '@tg/utils'
import { computed, ref } from 'vue'
import { useRequest } from 'vue-request'
import { useLocale } from '../../../components/LotteryConfigProvider'
import { useLocalRouter } from '../../../hooks/useLocalRouter'
import { isLogin as getLogin } from '../../../utils/tool'
import AppFiveDMyHistoryItem from './AppFiveDMyHistoryItem.vue'

interface Props {
  currentTab: number
}

defineOptions({ name: 'AppFiveDMyHistory' })
const props = defineProps<Props>()

const { $$t } = useLocale()
const { push } = useLocalRouter()

const page = ref(1)
const total = ref(1)
const isLogin = ref(getLogin())

const { run, runAsync, data } = useRequest(() => ApiCpRecord({ page: page.value, lottery_id: props.currentTab }), {
  onSuccess: (res) => {
    if (page.value === 1) {
      total.value = res.t === 0 ? 1 : res.t
    }
  },
})

const sourceData = computed(() => {
  if (data.value && data.value.d && data.value.d.length > 0) {
    return data.value.d
  }
  return []
})

function refresh() {
  if (isLogin.value) {
    page.value = 1
    run()
  }
}
function last() {
  page.value = page.value - 1
  run()
}
function next() {
  page.value = page.value + 1
  run()
}

defineExpose({ refresh })

if (isLogin.value)
  await application.allSettled([runAsync()])
</script>

<template>
  <div>
    <div class="w-full five-d-bg p-[12rem] rounded-[8rem]">
      <div class="w-full text-right flex justify-end">
        <div
          class="detail-bg px-[7rem] h-[30rem] rounded-[6rem] center cursor-pointer"
          @click="push('/5d/detail')"
        >
          <span class="mr-[4rem] text-[12rem]">{{ $$t('详情') }}</span>
          <div class="detail-bg size-[15rem] text-[20rem] rounded-[100rem] center">
            <IconLotBack class="rotate-180 scale-50" />
          </div>
        </div>
      </div>
      <div v-if="sourceData.length === 0" class="w-full">
        <LotteryEmpty />
      </div>
      <div v-else>
        <AppFiveDMyHistoryItem v-for="item of sourceData" :key="item.id" :data="item" />
      </div>
    </div>
    <LotteryPagination :total="total" :cur-page="page" class="mt-[16rem]" @last="last" @next="next" />
  </div>
</template>
