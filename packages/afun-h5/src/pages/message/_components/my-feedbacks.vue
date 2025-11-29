<script setup lang='ts'>
import { ApiExchangeRateFromTo, ApiMemberFeedbackBonusAll, ApiMemberFeedbackList, ApiMemberFeedbackUpdate } from '@tg/apis'
import { AfunBaseButton, AfunBaseDialog, AfunBaseEmpty, AfunBaseImage } from '@tg/bccomponents'
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
const emit = defineEmits(['reState'])
const { showFeedbackChat } = storeToRefs(useChatStore())
const chatStore = useChatStore()
const showClaim = ref(false)
const activeCurrency = ref()
const { t } = useI18n()
const rate = ref('0')
const { userInfo } = storeToRefs(useAppStore())

const { runAsync: runFeedbackList, data: feedbackList } = useRequest(ApiMemberFeedbackList)
const { runAsync: getTotalBonus, data: totalBonus } = useRequest(ApiMemberFeedbackBonusAll, {
  onSuccess: () => {
    emit('reState')
  },
})

const { runAsync: runGetReateFromTo } = useRequest(ApiExchangeRateFromTo, {
  onSuccess(res, params) {
    const code = params[0].from
    rate.value = scientificToString(toFixed(res[code], 8))
  },
})

const { runAsync: runUpdateFeedback } = useRequest(ApiMemberFeedbackUpdate, {
  onSuccess: () => {
    emit('reState')
    getData()
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
      <div class="mb-[16px] text-[14px] font-[600] flex items-center">
        <span>{{ t('待领取奖金') }}</span>
        <span class="text-[#F23038] mr-[6px]">{{ totalBonus }}</span>
        <AfunBaseImage class="mr-[4px] w-[14px]" url="/m/afun-h5/png/coin-usdt.png" />
        <AfunBaseButton :disabled="isDisabled" class="h-[26px] ml-[18px]" style="--afun-base-button-border-radius: 50px; --afun-base-button-font-size: 14px; --afun-base-button-primary-background-color: #24EE89;--afun-base-button-border-radius: 50px;" @click="openTotalBonus">
          {{ $t('领取') }}
        </AfunBaseButton>
      </div>
      <AfunBaseEmpty v-if="(feedbackList?.d?.length === 0 || !feedbackList?.d) && !isDataLoading" />
      <template v-for="item in feedbackList?.d || []" v-else :key="item.id">
        <AppFeedBackItem :id="item.id" :state="item.state" :content="item.description" :unread-count="item.newest_m" :time="item.created_at" @click="feedbackItemClick(item)" />
      </template>
    </template>

    <AfunBaseDialog v-if="showClaim" v-model="showClaim" :title="t('领取奖金')">
      <template #icon>
        <AfunBaseImage class="w-[11px] h-[14px] mr-[8px] shrink-0" url="afun-h5/svg/feedback-claim.svg" />
      </template>
      <AppFeedBackReceiveBonusDialog :total-bonus="totalBonus" @claim-success="getTotalBonus" />
    </AfunBaseDialog>
  </div>
  <div v-else />
</template>

<style lang='scss' scoped>

</style>
