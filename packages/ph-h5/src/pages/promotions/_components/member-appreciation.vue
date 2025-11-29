<script lang="ts" setup>
import type { CurrencyCode, MemberAppreciationDetail } from '@tg/types'
import { ApiMemberPromoMemberAppreciationClaim, ApiMemberPromoMemberAppreciationDetail } from '@tg/apis'
import { PhBaseAmount, PhBaseButton, PhBaseImage, PhBaseRichArea } from '@tg/bccomponents'
import { IconChessGameshow } from '@tg/icons'
import { useAppStore, useCurrency } from '@tg/stores'
import { EventBusNames, languageConfig, SendFlutterAppMessage } from '@tg/types'
import { appEventBus, application, getCurrencyConfig, isFlutterApp, sendMsgToFlutterApp } from '@tg/utils'
import { getLang, getLangForBackend } from '@tg/vue-i18n'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, h, inject, onActivated, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppPromotionBaseRuleText from '~/components/AppPromotionBaseRuleText'
import { Message } from '~/utils'

defineOptions({ name: 'MemberAppreciation' })
const setTitle = inject('setTitle', (v: string) => {})
const { t } = useI18n()
// const { openNotify } = useNotify()
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const { userInfo } = storeToRefs(appStore)
let pid = route.query.pid?.toString() ?? ''
const preview = route.query.preview?.toString() ?? ''
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
// const { openLoginDialog } = useLoginDialog()
const { isLogin } = storeToRefs(useAppStore())
const dataConfig = ref()
const activeCurrency = computed(() => {
  // 虚拟币统一使用USDT
  const val = application.isVirtualCurrency(currentGlobalCurrencyMap.value.type) ? 'USDT' : currentGlobalCurrencyMap.value.type
  return getCurrencyConfig(isLogin.value ? val : languageConfig[getLang()].currency)
})

const activeCurrencyCode = computed(() => activeCurrency.value?.cur)

/** 当前活动页币种 */
const promoCurrencyCode = computed(() => dataConfig.value?.conf?.currency_id ?? activeCurrencyCode.value)

const receiveLoading = ref(false)

// const curDate1 = computed(() => dayjs.unix(dataConfig.value?.claim_day).format('YYYY/MM/DD'))
const userLanguage = ref(getLang())
const currentDollarZone = computed(() => dataConfig.value?.timezone)
const curDate = computed(() => dayjs.unix(dataConfig.value?.claim_day).tz(currentDollarZone.value).format('YYYY/MM/DD'))

/**
 *  状态1立即领取（活动可领取时间内）
 *  状态2已领取（活动可领取时间内，点击可领取后）
 *  状态3领取成功，审核中（活动可领取时间内，点击领取需要审核）
 *  状态4审核通过（后台审核通过）
 *  状态5审核拒绝（后台审核拒绝）
 *  状态6立即领取置灰（在活动时间内，但是没有到可领取时间）
 *  状态7审核拒绝后，还在活动时间里，按钮还是【立即领取
 */
const receiveState = ref()

const uid = computed(() => userInfo.value?.uid ?? '')

const imgUrl = computed(() => {
  const str = dataConfig.value?.img ?? ''
  try {
    return str[getLangForBackend() || 'zh-CN']
  }
  catch {}
  return ''
})
const descDetail = computed(() => {
  const temp = dataConfig.value?.detail ?? ''
  try {
    return temp[getLangForBackend() || 'zh-CN']
  }
  catch {}
  return ''
})
const maximumReward = computed(() => dataConfig.value?.maximum_reward ?? '')
const {
  runAsync: runAsyncBaseConfig,
} = useRequest(ApiMemberPromoMemberAppreciationDetail, {
  throttleInterval: 2000,
  onSuccess: (res: MemberAppreciationDetail) => {
    if (res) {
      dataConfig.value = res
      res.state = Number(res.claim_status)
      receiveState.value = res.state

      const tongue = res.lang || []

      if (!tongue.includes(getLangForBackend() || '')) {
        Message.error(t('当前语言不支持此活动'))
        goPromo()
      }
      // 活动已结束
      if (res.state === 9 && !preview) {
        Message.error(t('活动已结束'))
        goPromo()
      }
      // 活动未开始
      else if (res.state === 8 && !preview) {
        Message.error(
          h('div', { class: 'flex items-center gap-[4rem]' }, [
            h(IconChessGameshow, { class: 'text-white' }),
            h('span', { class: 'whitespace-nowrap' }, t('活动未开始请稍后再试')),
          ]),
        )
        goPromo()
      }
      // 活动已关闭
      else if (res.state === 10 && !preview) {
        Message.error(t('活动已关闭'))
        goPromo()
      }
    }
    else {
      Message.error(t('请联系在线客服'))
    }
  },
  onError: () => {
    goPromo()
  },
})

const {
  runAsync: runAsyncReceiveConfig,
} = useRequest(ApiMemberPromoMemberAppreciationClaim, {
  throttleInterval: 2000,
  onSuccess: (res) => {
    if (res) {
      if (Number(res) === 4) {
        receiveState.value = 12
        /* openNotify({
          icon: 'uni-record-warn',
          title: t('warm_tip'),
          message: t('cant_get_bonus'),
        }) */
      }
      else {
        receiveState.value = Number(res)
      }
    }
    else {
      Message.error(t('请联系在线客服'))
    }
  },
})
function openLoginDialog() {
  router.push('/login')
}
/**
 * 领取
 */
async function getBonus() {
  receiveLoading.value = true
  try {
    await runAsyncReceiveConfig({ pid, uid: uid.value, currency: activeCurrencyCode.value })
    receiveLoading.value = false
  }
  catch (error) {
    receiveLoading.value = false
  }
}

function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotions')
}

function getDetail(id: CurrencyCode) {
  runAsyncBaseConfig({ pid, uid: uid.value, currency: id })
}
function mqttRefresh() {
  setTimeout(() => {
    getDetail(promoCurrencyCode.value)
  }, 0)
}
onMounted(() => {
  appEventBus.on(EventBusNames.PROMO_NOTIFY_REFRESH, mqttRefresh)
})

onActivated(() => {
  pid = route.query.pid?.toString() ?? ''
})

onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.PROMO_NOTIFY_REFRESH, mqttRefresh)
})
watch(isLogin, (val) => {
  getDetail(promoCurrencyCode.value)
})

watchEffect(() => {
  let names = dataConfig.value?.name || '[]'
  try {
    names = JSON.parse(names)
  }
  catch (e) {

  }
  const name = names[userLanguage.value.replace('-', '_') as any]
  if (name)
    setTitle(name)
})
await application.allSettled([runAsyncBaseConfig({ pid, uid: uid.value, currency: activeCurrencyCode.value })])
</script>

<template>
  <div class="text-tg-text-lightgrey page-back-cash m-auto max-w-[650rem]">
    <div class="mb-[16rem] center" :class="{ ' mb-[16rem]': imgUrl }">
      <PhBaseImage v-if="imgUrl" class="set-radios" :url="imgUrl" is-network />
    </div>
    <div class="text-[#0D2245] theme-bg bg-[#fff] mb-[16rem] rounded-[4rem] p-[12rem] font-[500]">
      <div>
        <label class="mb-[12rem] flex items-center text-[14rem]">
          <PhBaseImage class="mr-[10rem] text-[22rem]" url="/ph-h5/png/appreciation-1.png" />
          {{ t('领取时间') }}</label>
        <div class="bg-[#F6F7F8]  text text-center text-[18rem]">
          {{ curDate }}
        </div>
      </div>
      <div>
        <label class="my-[12rem] flex items-center text-[14rem]">
          <PhBaseImage class="mr-[10rem] text-[22rem]" url="/ph-h5/png/appreciation-2.png" />
          {{ t('最大可能的奖励') }}</label>
        <div class="text bg-[#F6F7F8]  text-center text-[18rem]">
          <div class="center">
            <PhBaseAmount :amount="maximumReward" :currency-code="promoCurrencyCode" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="isLogin" class="mb-[16rem] flex flex-col items-center justify-center">
      <PhBaseButton
        v-if="receiveState === 1 || receiveState === 5 || receiveState === 7 || receiveState === 12"
        :loading="receiveLoading"
        class="w-[100%]" bg-style="secondary" size="md"
        @click="getBonus"
      >
        {{ t('立即领取') }}
      </PhBaseButton>
      <PhBaseButton
        v-else-if="receiveState === 2 || receiveState === 4"
        class="w-[100%] disabled-btn" :disabled="true" size="md"
      >
        {{ t('待领取') }}
      </PhBaseButton>
      <PhBaseButton
        v-else-if="receiveState === 3"
        :loading="receiveLoading"
        class="w-[100%] disabled-btn" :disabled="true" size="md"
        @click="getBonus"
      >
        {{ t('彩金待审核') }}
      </PhBaseButton>
      <PhBaseButton
        v-else-if="receiveState === 6 || receiveState === 11"
        class="w-[100%] disabled-btn" :disabled="true" size="md"
      >
        {{ t('立即领取') }}
      </PhBaseButton>
      <PhBaseButton
        v-else-if="receiveState === 8"
        class="w-[100%] disabled-btn" :disabled="true" size="md"
      >
        {{ t('活动已结束') }}
      </PhBaseButton>
    </div>
    <div v-else class="mb-[16rem] flex flex-col items-center justify-center">
      <PhBaseButton
        class="w-[100%] opacity-50" bg-style="secondary" size="md"
        @click.stop="openLoginDialog"
      >
        {{ t('登录后可领取彩金') }}
      </PhBaseButton>
    </div>
    <div class="mt-[16rem]">
      <div class="text-[#0D2245] text-[18rem] font-[500]">
        {{ t('活动规则说明') }}
      </div>
      <div class="my-[16rem]">
        <PhBaseRichArea v-if="dataConfig?.rule_type === 2" :content="descDetail" />
        <AppPromotionBaseRuleText
          v-else :currency-type="getCurrencyConfig(promoCurrencyCode)?.name"
          :is-login="isLogin"
          :amount="dataConfig?.prize_limit" :content="descDetail"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-back-cash {
  --tg-table-layout: fixed;
  --tg-table-th-padding-x: 8rem;
  --tg-table-td-padding-x: 8rem;
  --tg-table-th-word-wrap: break-word;
  --tg-table-th-white-space: normal;
  .theme-bg {
    > div {
      display: flex;
      flex-direction: column;
      > .text {
        padding: 12rem 0;
        border-radius: 4px;
        :deep(.app-amount) {
          justify-content: center;
          --tg-app-amount-font-size: 18rem;
          --tg-app-amount-font-weight: 600;
        }
      }
    }
  }
}
.set-radios {
  --tg-base-img-style-radius: 12rem;
}
</style>
