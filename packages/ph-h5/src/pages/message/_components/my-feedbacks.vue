<script setup lang='ts'>
import { ApiExchangeRateFromTo, ApiMemberFeedbackBonusAll, ApiMemberFeedbackList, ApiMemberFeedbackUpdate } from '@tg/apis'
import { PhBaseButton, PhBaseDialog, PhBaseEmpty, PhBaseImage } from '@tg/bccomponents'
import { useAppStore, useChatStore } from '@tg/stores'
import { scientificToString, toFixed } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, onActivated, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppFeedBackItem from '~/components/AppFeedBackItem.vue'
import AppFeedBackReceiveBonusDialog from '~/components/AppFeedBackReceiveBonusDialog.vue'
import AppLoading from '~/components/AppLoading.vue'

defineOptions({ name: 'MyFeedbacks' })
const { showFeedbackChat } = storeToRefs(useChatStore())
const chatStore = useChatStore()
const showClaim = ref(false)
const activeCurrency = ref()
const { t } = useI18n()
const rate = ref('0')
const { userInfo } = storeToRefs(useAppStore())

const { runAsync: runFeedbackList, data: feedbackList } = useRequest(ApiMemberFeedbackList)
const { runAsync: getTotalBonus, data: totalBonus } = useRequest(ApiMemberFeedbackBonusAll)

const { runAsync: runGetReateFromTo } = useRequest(ApiExchangeRateFromTo, {
  onSuccess(res, params) {
    const code = params[0].from
    rate.value = scientificToString(toFixed(res[code], 8))
  },
})

const { runAsync: runUpdateFeedback } = useRequest(ApiMemberFeedbackUpdate, {
  onAfter: () => {
    // runNotificationsCount()
  },
})

const isDataLoading = ref(false)

const isDisabled = computed(() => {
  return !totalBonus.value || !(+totalBonus.value > 0) || (userInfo.value && +userInfo.value.bonus_state !== 1)
})

function feedbackItemClick(item: any) {
  if (item.newest_m > 0)
    runUpdateFeedback({ id: item.id })

  chatStore.setFeedbackItem({ ...item, feed_id: item.id })
  chatStore.setFeedbackChatTrue()
}

function openTotalBonus() {
  showClaim.value = true
}

function getData() {
  isDataLoading.value = true
  const arr = [runFeedbackList(), getTotalBonus()]
  Promise.allSettled(arr).finally(() => {
    isDataLoading.value = false
  })
}

watch(activeCurrency, (a) => {
  if (a)
    runGetReateFromTo({ from: '706', to: a.cur })
})

onMounted(() => {
  getData()
})

onActivated(() => {
  getData()
})
</script>

<template>
  <div v-if="!showFeedbackChat">
    <div v-if="isDataLoading">
      <AppLoading :height="200" />
    </div>
    <template v-else>
      <div class="mb-[16rem] text-[14rem] font-[600] flex items-center">
        <span>{{ t('待领取奖金') }}</span>
        <span class="text-[#F23038] mr-[6rem]">{{ totalBonus }}</span>
        <PhBaseImage class="mr-[4rem] w-[14rem]" url="/ph-h5/png/coin-usdt.png" />
        <PhBaseButton :disabled="isDisabled" class="h-[26rem] ml-[18rem]" style="--ph-base-button-border-radius: 50rem; --ph-base-button-font-size: 14rem" @click="openTotalBonus">
          {{ $t('领取') }}
        </PhBaseButton>
      </div>
      <PhBaseEmpty v-if="(feedbackList?.d?.length === 0 || !feedbackList?.d) && !isDataLoading" />
      <template v-for="item in feedbackList?.d || []" v-else :key="item.id">
        <AppFeedBackItem :id="item.id" :state="item.state" :content="item.description" :unread-count="item.newest_m" :time="item.created_at" @click="feedbackItemClick(item)" />
      </template>
    </template>

    <PhBaseDialog v-if="showClaim" v-model="showClaim" :title="t('领取奖金')">
      <template #icon>
        <PhBaseImage class="w-[11rem] h-[14rem] mr-[8rem] shrink-0" url="ph-h5/svg/feedback-claim.svg" />
      </template>
      <AppFeedBackReceiveBonusDialog :total-bonus="totalBonus" @claim-success="getTotalBonus" />
    </PhBaseDialog>
  </div>
  <div v-else />
</template>

<style lang='scss' scoped>

</style>
