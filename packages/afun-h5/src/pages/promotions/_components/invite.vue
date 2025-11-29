<script setup lang='ts'>
import type { CurrencyCode, IPromotionInviteConfig } from '@tg/types'
import { ApiMemberAgencyBonusApply, ApiMemberAgencyConfig, ApiMemberAgencyValidMemberCount } from '@tg/apis'
import { AfunBaseButton, AfunBaseDialog, AfunBaseImage, AfunBaseRichArea } from '@tg/bccomponents'
import { useBoolean, useRedirect } from '@tg/hooks'
import { IconUniArrowRight, IconUniArrowRightSmall, IconUniGroup } from '@tg/icons'
import { useAppStore, useCurrency } from '@tg/stores'
import { EventBusNames, SendFlutterAppMessage } from '@tg/types'
import {
  appEventBus,
  application,
  getCurrencyConfig,
  isFlutterApp,
  sendMsgToFlutterApp,

  toFixed,
} from '@tg/utils'
import { getLang, getLangForBackend, timeToFormatFullTimeByBoss } from '@tg/vue-i18n'
import { useBrowserLocation } from '@vueuse/core'
import dayjs from 'dayjs'
import { throttle } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, inject, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppApplicationSharing from '~/components/AppApplicationSharing.vue'
import AppCopyLine from '~/components/AppCopyLine.vue'
import AppDialogPromoInviteDetail from '~/components/AppDialogPromoInviteDetail.vue'
import AppLoading from '~/components/AppLoading.vue'
import AppPromotionBaseRuleText from '~/components/AppPromotionBaseRuleText'
import { Message } from '~/utils'

defineOptions({
  name: 'PromotionInvite',
})

interface BoxType {
  ppl: number
  bonus: string
  last?: boolean
  hidden?: boolean
  isPending?: boolean
  boxUrl: string
  isCanApply: boolean
  isReceived?: boolean
}

const setTitle = inject('setTitle', (v: string) => { })

const { t } = useI18n()
const currencyStore = useCurrency()
const isMobile = ref(true)
const userLanguage = ref(getLang())
const location = useBrowserLocation()
const { isLogin } = storeToRefs(useAppStore())
const { currencyList } = storeToRefs(currencyStore)
const { bool: isShowInviteDetail } = useBoolean(false)
const { jumpToUrl } = useRedirect()
const lang = getLangForBackend()
const route = useRoute()
const router = useRouter()
let pid = route.query.pid ? route.query.pid.toString() : ''
const preview = route.query.preview?.toString() ?? ''
const { bool: isApplying } = useBoolean(false)
const { bool: isPageLoading, setBool: setIsPageLoading } = useBoolean(true)

// 有效人数接口
const { data: validMemberCountData, runAsync: runAsyncValidMember } = useRequest(ApiMemberAgencyValidMemberCount, {
  onSuccess() {
    if (isApplying.value) {
      runApiApply()
      isApplying.value = false
    }
  },
})
// 配置接口
const configData = ref<IPromotionInviteConfig>()
const configCurrency = ref<CurrencyCode>('701')
const configCurrencyType = computed(() => getCurrencyConfig(configCurrency.value ?? '701').name)

const { runAsync: runGetConfig, loading: configLoading, data: configRes } = useRequest(ApiMemberAgencyConfig, {
  debounceInterval: 1000,
  debounceOptions: {
    leading: true,
    trailing: false,
  },
  onSuccess(res) {
    let tongue = res.lang || '[]'

    try {
      tongue = JSON.parse(tongue)
    }
    catch (e) {

    }

    if (!tongue.includes(getLangForBackend())) {
      Message.error(t('当前语言不支持此活动'))
      goPromo()
    }
    if (res && +res.state !== 1 && !preview) {
      Message.error(t('活动已结束'))
      goPromo()
      return
    }
    // 检查是否支持当前请求的货币
    if (!res.sup) {
      Message.error(t('当前选择的货币不支持此活动'))
    }
    // 首次拿数据
    if (!configData.value) {
      configData.value = res

      configCurrency.value = res.currency_id
      isLogin.value && runAsyncValidMember({ pid, currency_id: configCurrency.value, noNotify: true })
      return
    }
    // 如果返回的数据与选择的货币一致
    if (res.currency_id === configCurrency.value || res.currency_id === configCurrency.value) {
      configData.value = res
      configCurrency.value = res.currency_id
      isLogin.value && runAsyncValidMember({ pid, currency_id: configCurrency.value, noNotify: true })
    }
  },
  onError(err) {
    const obj = JSON.parse(err.message)
    if (obj.data === 'refresh' && !preview) {
      Message.error(t('活动已结束'))
      goPromo()
    }
    else {
      goPromo()
    }
  },
  onBefore() {
    setIsPageLoading(true)
  },
  onAfter() {
    setIsPageLoading(false)
  },
})

const configParams = computed(() => ({ pid, currency_id: configCurrency.value, noNotify: true }))
/** 每行箱子个数 */
const rowCount = computed(() => {
  if (configData.value?.bonus_tpl === '2')
    return 4
  return isMobile.value ? 3 : 4
})
// 领取接口
const { run: runApply, loading: applyLoading } = useRequest(ApiMemberAgencyBonusApply, {
  onSuccess(data) {
    pid = route.query.pid ? route.query.pid.toString() : ''
    configParams.value.pid = pid
    // 如果是审核中，就提示
    if (+data.state === 1)
      Message.error(t('提交成功'))
    else
      Message.success(t('领取成功'))

    runGetConfig({ ...configParams.value, currency_id: configCurrency.value! })
    currencyStore.initCurrencyList()
  },
})

const inviteUrl = computed(() => configData.value ? `${location.value.origin}${configData.value.link_url}` : '')
// 有效推广人数
const validManCount = computed(() => validMemberCountData.value ? validMemberCountData.value.valid_member_count : 0)
// 已领取奖励的人数
const receivedMemberCount = computed(() => validMemberCountData.value ? validMemberCountData.value.received_member_count : 0)
const firstDepositAmount = computed(() => configData.value ? toFixed(configData.value.first_deposit_amount) : '')
const totalDepositAmount = computed(() => configData.value ? toFixed(configData.value.total_deposit_amount) : '')
const totalBetAmount = computed(() => configData.value ? toFixed(configData.value.total_bet_amount) : '')
const totalDepositTimes = computed(() => configData.value ? configData.value.total_deposit_times : '')
const totalDepositDays = computed(() => configData.value ? configData.value.total_deposit_days : '')
const startTime = computed(() => configData.value ? configData.value.start_at : 0)
const endTime = computed(() => configData.value ? configData.value.end_at : 0)
const promoStarted = computed(() => dayjs().isAfter(timeToFormatFullTimeByBoss(startTime.value)))
const showCurrencyType = computed(() => configData.value ? getCurrencyConfig(configData.value.currency_id).name : 'USDT')
// 玩法规则
const ruleHtml = computed(() => configData.value ? configData.value.detail : '')
// 是否富文本
const isRichText = computed(() => configData.value ? configData.value.rule_type.toString() === '2' : false)
// 是否显示宝箱奖金
const showBoxAmount = computed(() => configData.value ? configData.value.show_amount === '1' : false)
// 是否展示一件领取按钮
const hideApplyBtn = computed(() => {
  if (configData.value)

    return configData.value.bonus_type === '2' || configData.value.automatic === '1'

  return true
})
// 是否显示底部按钮
const isShowBtn = computed(() => configData.value ? configData.value.button === 1 : false)
// 底部按钮文字
const btnText = computed(() => configData.value && isShowBtn ? JSON.parse(configData.value.button_text)[lang] : '')
// 宝箱 或 红包
const imgType = computed(() => {
  if (configData.value) {
    switch (configData.value.bonus_tpl) {
      case '1':
        return 'red'
      case '2':
        return 'box'
      case '3':
        return 'gold'
      case '4':
        return 'progress'

      default:
        return 'box'
    }
  }
  return 'box'
})
const imgWidth = computed(() => {
  if (imgType.value === 'box')
    return isMobile.value ? '57px' : '105.51px'
  else if (imgType.value === 'gold')
    return isMobile.value ? '82px' : '105.51px'
  return isMobile.value ? '77px' : '105.51px'
})
const pendingImgWidth = computed(() => {
  if (imgType.value === 'gold')
    return isMobile.value ? '82px' : '105.51px'
  return isMobile.value ? '78.18px' : '105.51px'
})
const isProgressType = computed(() => imgType.value === 'progress')
/** 箱子数据 */
const boxes = computed(() => {
  if (configData.value && configData.value.settings) {
    if (validMemberCountData.value && validMemberCountData.value.record) {
      return configData.value.settings.map((a, i) => {
        /** 审核中 */
        const isPending = validMemberCountData.value?.record.find(a => a.lvl === i + 1)?.state === 1
        /** 已领取 */
        const isReceived = validMemberCountData.value?.record.find(a => a.lvl === i + 1)?.state === 3
        /** 箱子图片 */
        const boxUrl = `/m/afun-h5/png/promo-invite-${imgType.value}${imgType.value === 'gold' ? (showBoxAmount.value ? '-yes' : '-yes') : ''}${isReceived || isPending ? `-open${configData.value?.show_amount}` : validManCount.value >= a.ppl ? '' : '-disabled'}.png`
        /** 当前可领取 */
        const isCanApply = validManCount.value >= a.ppl && !isReceived && !isPending

        return {
          ...a,
          isPending,
          boxUrl,
          isReceived,
          isCanApply,
        }
      })
    }

    return configData.value.settings.map((a) => {
      /** 箱子图片 */
      const boxUrl = `/m/afun-h5/png/promo-invite-${imgType.value}${imgType.value === 'gold' ? (showBoxAmount.value ? '-yes' : '-yes') : ''}${validManCount.value >= a.ppl ? '' : '-disabled'}.png`
      /** 当前可领取 */
      const isCanApply = validManCount.value >= a.ppl
      return {
        ...a,
        boxUrl,
        isCanApply,
      }
    })
  }

  return []
})
/** 是否有可领取的箱子 */
const bonusAvailable = computed(() => {
  if (boxes.value.length > 0)
    return boxes.value.some(a => a.isCanApply)

  return false
})
/** 箱子列表 */
const boxList = computed(() => {
  const arr: BoxType[][] = []
  let row: BoxType[] = []
  for (let i = 0; i < boxes.value.length; i++) {
    if (row.length < rowCount.value)
      row.push(boxes.value[i])

    if (row.length === rowCount.value || i === boxes.value.length - 1) {
      row[row.length - 1].last = true
      if (row.length < rowCount.value) {
        const times = rowCount.value - row.length
        for (let ii = 0; ii < times; ii++)
          row.push({ ppl: 0, bonus: '', last: false, hidden: true, boxUrl: '', isCanApply: false })
      }

      arr.push(row)
      row = []
    }
  }
  return arr
})

function runApiApply() {
  runApply(pid, configCurrency.value!)
}
function apply() {
  isApplying.value = true
  runAsyncValidMember({ pid, currency_id: configCurrency.value!, noNotify: true })
}

function langNotify(str: string) {
  Message.info(str)
}

const notifyLangThrottle = throttle(langNotify, 5 * 1000, { leading: true, trailing: false })

function onBoxClick(box: BoxType) {
  if (!promoStarted.value) {
    return notifyLangThrottle(t('活动未开始请稍后再试'))
  }
  if (!box.isCanApply) {
    if (isFlutterApp())
      sendMsgToFlutterApp(SendFlutterAppMessage.PROMO_NORMAL_TIPS_1)

    return notifyLangThrottle(t('您当前未满足领取条件'))
  }

  if (!hideApplyBtn.value && !box.isPending && box.isCanApply && !applyLoading.value && isLogin.value)
    apply()
}

function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotions')
}

function goAff() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.USER_AFFILIATE)
  else
    router.push('/affiliate')
}

function mqttRefresh() {
  pid = route.query.pid ? route.query.pid.toString() : ''
  configParams.value.pid = pid
  runGetConfig(configParams.value)
}

const inviteDetailDialogProps = ref<any>()
function openDialogInviteDetail(data: any) {
  inviteDetailDialogProps.value = { data }
  isShowInviteDetail.value = true
}

watchEffect(() => {
  let names = configRes.value?.name || '[]'
  try {
    names = JSON.parse(names)
  }
  catch (e) {

  }
  const name = names[userLanguage.value.replace('-', '_') as any]
  if (name)
    setTitle(name)
})

watch(isLogin, (a) => {
  if (a)
    runGetConfig(configParams.value)
})
watch(currencyList, () => {
  if (route.fullPath.includes('/promotions/promotion/invite'))
    runGetConfig(configParams.value)
})
onMounted(() => {
  appEventBus.on(EventBusNames.PROMO_NOTIFY_REFRESH, mqttRefresh)
})

onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.PROMO_NOTIFY_REFRESH, mqttRefresh)
})

await application.allSettled([runGetConfig(configParams.value)])
</script>

<template>
  <div class="invite-active w-full flex flex-col">
    <AppLoading v-if="isPageLoading || !configRes" />
    <template v-else>
      <div class="order-2 center">
        <AfunBaseImage class="set-radios" is-network :url="configData?.image" />
      </div>
      <!-- 推广链接 -->
      <div class="bg-[#0F212E] order-4 mb-[11px] mt-[16px] w-full rounded-[4px] px-[14px] pb-[16px] pt-[13px]">
        <div class="mb-[11px] w-full flex items-center justify-between">
          <span class="text-[#fff] text-[14px] font-semibold leading-[20px]">{{ t('推广链接') }}</span>
          <AfunBaseButton
            v-if="!hideApplyBtn && isLogin && bonusAvailable"
            style="--afun-base-button-font-size:12px;--afun-base-button-padding-y:2px;--afun-base-button-padding-x:6px;--afun-base-button-border-radius:4px;"
            ase-button @click="apply"
          >
            {{ t('一键领取') }}
          </AfunBaseButton>
        </div>
        <AppCopyLine
          :msg="inviteUrl"
          style="--tg-app-copy-line-input-background-color:#2f4553;--tg-app-copy-line-button-box-background-color:#2f4553;--tg-app-copy-line-input-border-color:#2f4553;"
          class="theme-copy mb-[16px]"
        />
        <div class="mb-[7px] w-full flex items-center justify-between">
          <span class="text-[#fff] text-[14px] font-semibold">{{ t('快捷分享') }}</span>
          <AfunBaseButton class="theme-more text-[#b1bad3]" type="none" @click="goAff">
            <span class="leading-[20px]">{{ t('更多') }}</span>
            <IconUniArrowRight class="theme-arrow" />
          </AfunBaseButton>
        </div>
        <AppApplicationSharing
          round class="text-[#b1bad3]" width="30px" :share-text="inviteUrl"
          style="--tg-app-share-size: 11px;--social:#fff"
        />
        <div class="theme-line my-[16px] h-[2px] w-full" />
        <div class="mb-[2px] w-full flex items-center justify-between">
          <span class="text-[#b1bad3] text-[14px] font-semibold">
            {{ t('有效推广人数', { num: validManCount }) }}
            <span class="text-[#b1bad3]">{{ validManCount }}</span>
            {{ t('人') }}
          </span>
          <AfunBaseButton
            class="theme-detail text-[#b1bad3]" type="none"
            @click="openDialogInviteDetail({ pid, currencyId: configCurrency })"
          >
            <span class="leading-[20px]">{{ t('详情') }}</span>
          </AfunBaseButton>
        </div>
      </div>

      <!-- 箱子 -->
      <div
        v-if="!isProgressType"
        class="bg-[#0F212E] boxes-outer order-5 mb-[16px] w-full flex flex-col rounded-[4px] px-[14px] pb-[49px] pt-[23px] mobile-tpl"
        :class="[`bonus-tpl-${imgType}`]"
      >
        <!-- row -->
        <template v-for="row, rowI in boxList" :key="rowI">
          <div
            class="relative w-full flex items-end" :class="[
              row.length < rowCount ? 'justify-start' : 'justify-between',
            ]"
          >
            <template v-for="b, boxI in row" :key="`${b.ppl}${b.bonus}`">
              <!-- box -->
              <div
                class="relative min-w-[65px] flex flex-col cursor-pointer items-center justify-end" :class="[
                  b.hidden && 'invisible h-0',
                  b.isReceived && 'item-received',
                  b.isPending && 'item-pending',
                  b.isCanApply ? 'can-apply' : '',
                  showBoxAmount ? 'box-show-amount' : 'box-no-show-amount',
                  imgType === 'box' && 'min-h-[54px] ',
                  imgType === 'red' && 'min-h-[74px]',
                  imgType === 'gold' && 'min-h-[60px]',
                ]" @click="onBoxClick(b)"
              >
                <AfunBaseImage :width="imgWidth" :url="b.boxUrl" />
                <!-- 人数 -->
                <span
                  :class="[
                    imgType === 'red' ? 'bottom-[1px] text-[12px] leading-[0.8]' : 'bottom-[7.7px] w-[10ch]  text-[12px] ',
                    b.isReceived && 'is-received',
                    b.isPending && 'is-pending',
                    `people-txt-${userLanguage}`,
                  ]"
                  class="theme-man-count people-txt absolute left-[50%] h-[2em] w-full inline-flex flex-wrap translate-x-[-50%] items-center justify-center gap-[3px] text-center font-[600]"
                >
                  <template v-if="userLanguage === 'pt-BR'">
                    <span class="">Promoção</span><span class="nums">{{ b.ppl }}</span><span class="">{{ t('人') }}</span>
                  </template>
                  <template v-else>
                    <span class="nums">{{ b.ppl }}</span><span class="text-[#fff]">{{ t('人') }}</span>
                  </template>
                </span>
                <!-- 奖金 -->
                <span
                  v-if="showBoxAmount"
                  class="text-[#b1bad3] bonus-txt bonus-show absolute bottom-[-17px] left-[50%] flex translate-x-[-50%] items-center text-[12px] font-[600] "
                >
                  {{ b.bonus && toFixed(b.bonus, 2) }}
                </span>
                <span
                  v-if="!showBoxAmount && (b.isReceived || b.isPending)"
                  class="bonus-txt bonus-not-show absolute bottom-[35px] left-[50%] flex translate-x-[-50%] items-center text-[12px] font-[600] text-[#752D10] "
                >
                  {{ b.bonus && toFixed(b.bonus, 2) }}
                </span>
                <!-- 审核中 -->
                <div v-if="b.isPending" class="absolute bottom-0 w-full">
                  <AfunBaseImage :width="pendingImgWidth" url="/afun-h5/svg/promotion-invite-pending.svg" />
                  <span
                    class="text-[#fff] absolute top-[3px] inline-block w-full text-center text-[12px] font-[600] "
                  >
                    {{ t('审核中') }}
                  </span>
                </div>
              </div>
              <!-- 箭头 -->
              <div
                v-if="boxI !== rowCount - 1" :class="[b.hidden || b.last ? 'invisible' : '']"
                class="flex grow items-center justify-center"
              >
                <div
                  class="theme-icon absolute top-[50%] flex grow translate-y-[-50%] items-center justify-center text-[16px] "
                >
                  <IconUniArrowRightSmall :class="[imgType === 'box' ? 'text-[8px] ' : 'text-[14px] ']" />
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>

      <!-- 推广规则 -->
      <div
        class="bg-[#0F212E] invite-rules order-6 mb-[16px] w-full flex flex-col rounded-[4px] px-[14px] py-[18px]"
      >
        <h6 class="text-[#fff] text-[14px] font-semibold leading-[20px]">
          {{ t('有效推广人数') }}？{{
            t(`满足条件${configData?.condition_type}`) }}
        </h6>
        <div
          v-if="+firstDepositAmount > 0"
          class="theme-bg w-full flex flex-col gap-[2px] rounded-[4px] px-[8px] py-[10px] leading-[20px]"
        >
          <div class="text-[#fff] text-[14px] font-semibold">
            {{ t('下级账号首充') }}
          </div>
          <div class="text-[#b1bad3] flex items-center text-[14px] font-[600]">
            <span class="mr-4">{{ firstDepositAmount }}</span>
            <span>{{ t('或以上') }}</span>
          </div>
        </div>
        <div
          v-if="+totalDepositAmount > 0"
          class="theme-bg w-full flex flex-col gap-[2px] rounded-[4px] px-[8px] py-[10px] leading-[20px]"
        >
          <div class="text-[#fff] text-[14px] font-semibold">
            {{ t('下级累计充值') }}
          </div>
          <div class="text-[#b1bad3] flex items-center text-[14px] font-[600]">
            <span class="mr-4">{{ totalDepositAmount }}</span>
            <span>{{ t('或以上') }}</span>
          </div>
        </div>
        <div
          v-if="+totalBetAmount > 0"
          class="theme-bg w-full flex flex-col gap-[2px] rounded-[4px] px-[8px] py-[10px] leading-[20px]"
        >
          <div class="text-[#fff] text-[14px] font-semibold">
            {{ t('下级累计投注') }}
          </div>
          <div class="text-[#b1bad3] flex items-center text-[14px] font-[600]">
            <span class="mr-4">{{ totalBetAmount }}</span>
            <span>{{ t('或以上') }}</span>
          </div>
        </div>
        <div
          v-if="+totalDepositTimes > 0"
          class="theme-bg w-full flex flex-col gap-[2px] rounded-[4px] px-[8px] py-[10px] leading-[20px]"
        >
          <div class="text-[#fff] text-[14px] font-semibold">
            {{ t('下级累计充值次数') }}
          </div>
          <div class="text-[#b1bad3] flex items-center text-[14px] font-[600]">
            <span>{{ t('次或以上', { count: totalDepositTimes }) }}</span>
          </div>
        </div>
        <div
          v-if="+totalDepositDays > 0"
          class="theme-bg w-full flex flex-col gap-[2px] rounded-[4px] px-[8px] py-[10px] leading-[20px]"
        >
          <div class="text-[#fff] text-[14px] font-semibold">
            {{ t('下级累计充值天数') }}
          </div>
          <div class="text-[#b1bad3] flex items-center text-[14px] font-[600]">
            <span>{{ t('天或以上', { count: totalDepositDays }) }}</span>
          </div>
        </div>
      </div>

      <!-- 玩法规则 -->
      <div v-if="ruleHtml" class="order-7 w-full bg-[#0F212E] rounded px-[14px] py-[18px]">
        <div class="mb-[15px] text-[20px] font-semibold ">
          {{ t('条款与条件') }}
        </div>
        <AfunBaseRichArea v-if="isRichText" :content="ruleHtml" />
        <AppPromotionBaseRuleText
          v-else :amount="boxes[boxes.length - 1].bonus" :is-login="isLogin" :currency-type="configCurrencyType"
          :content="ruleHtml"
        />
        <div class="mt-[16px] flex flex-col items-center">
          <AfunBaseButton
            v-if="isShowBtn"
            @click="jumpToUrl({ type: configData ? +configData?.button_type : 0, jumpUrl: configData ? configData.button_redirect : '' })"
          >
            {{ btnText }}
          </AfunBaseButton>
        </div>
      </div>
    </template>

    <AfunBaseDialog v-if="isShowInviteDetail" v-model="isShowInviteDetail" :title="t('邀请详情')" :icon="IconUniGroup">
      <AppDialogPromoInviteDetail v-bind="inviteDetailDialogProps" />
    </AfunBaseDialog>
  </div>
</template>

<style lang="scss" scoped>
.theme-copy {
  --app-copyline-font-size: 15px;
  --app-copyline-color: #b1bad3;
  --app-copyline-button-padding: 11px;
  --tg-app-copy-line-input-expanded-py: 6.5px;
}

.theme-line {
  background-color: #2f4553;
}

.theme-man-count {
  color: #fff;
}

.theme-bg {
  background-color: #213743;
}

.bonus-tpl-red {
  .people-txt {
    bottom: -38px;
  }

  .bonus-txt {
    color: white;
    bottom: 10px;
  }

  .item-pending {
    .bonus-txt {
      color: #752d10;
      bottom: 49px;
    }
  }

  &.pc-tpl {
    .bonus-not-show {
      bottom: 51px;
      color: #752d10;
    }
  }

  &.mobile-tpl {
    .people-txt {
      bottom: -32px;
    }

    .bonus-txt {
      bottom: 7px;
    }

    .item-pending {
      .bonus-txt {
        bottom: 36px;
      }
    }

    .item-received {
      .bonus-not-show {
        bottom: 33px;
        color: #752d10;
      }
    }
  }
}

.bonus-tpl-box {
  .people-txt {
    bottom: -38px;
  }

  .bonus-txt {
    color: white;
    bottom: 8px;
    text-shadow:
      0 0 2px #555,
      0 0 2px #555,
      0 0 2px #555,
      0 0 2px #555,
      0 0 2px #555,
      0 0 2px #555,
      0 0 2px #555,
      0 0 2px #555,
      0 0 2px #555,
      0 0 2px #555;
  }

  .bonus-not-show {
    bottom: 51px;
  }

  &.mobile-tpl {
    .people-txt {
      bottom: -30px;
    }

    .bonus-not-show {
      bottom: 26px;
    }

    .item-pending.box-show-amount {
      .bonus-txt {
        bottom: 26px;
      }
    }

    .people-txt-pt-BR {
      font-size: 11px;
    }
  }

  &.pc-tpl {
    .item-pending.box-show-amount {
      .bonus-txt {
        bottom: 51px;
      }
    }
  }

  .row-arrow {
    margin-bottom: 30px;
  }

  .people-txt {
    font-weight: bold;
    color: #b1bad3;
    display: flex;
    gap: 4px;

    .nums {
      color: #f88d22;
      vertical-align: middle;
    }
  }

  .can-apply,
  .item-pending,
  .item-received {
    .bonus-txt {
      text-shadow:
        0 0 2px #cd0d0b,
        0 0 2px #cd0d0b,
        0 0 2px #cd0d0b,
        0 0 2px #cd0d0b,
        0 0 2px #cd0d0b,
        0 0 2px #cd0d0b,
        0 0 2px #cd0d0b,
        0 0 2px #cd0d0b,
        0 0 2px #cd0d0b,
        0 0 2px #cd0d0b;
    }
  }
}

.bonus-tpl-gold {
  .people-txt {
    bottom: -32px;
  }

  .bonus-show {
    bottom: 4px;
  }

  .bonus-txt {
    bottom: 4px;
    color: white;
  }

  .row-arrow {
    margin-bottom: 10px;
    margin-top: 35px;
  }

  .row-arrow.row-arrow-no-show-amount {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .item-pending,
  .item-received {
    .bonus-not-show {
      color: #fff;
    }
  }

  &.pc-tpl {
    .bonus-not-show {
      bottom: 7px;
    }

    .item-pending {
      .bonus-not-show {
        color: #fff;
      }
    }

    .people-txt {
      bottom: -36px;
    }
  }

  &.mobile-tpl {
    .bonus-not-show {
      bottom: 45.5px;
    }

    .people-txt {
      bottom: -32px;
    }

    .item-pending {
      .bonus-not-show {
        color: #fff;
      }
    }
  }
}

.people-txt-pt-BR {
  gap: 1px !important;

  .nums {
    margin-left: 2px;
  }
}

.nums {
  color: #ff8a00 !important;
}
</style>

<style lang="scss" scoped>
.boxes-outer {
  &.mobile-tpl {
    > * {
      margin-bottom: 59px;
    }

    > :last-child {
      margin-bottom: 0;
    }
  }

  &.pc-tpl {
    > * {
      margin-bottom: 70px;
    }

    > :last-child {
      margin-bottom: 0;
    }
  }
}

.invite-rules {
  > * {
    margin-bottom: 12px;
  }

  > :last-child {
    margin-bottom: 0;
  }
}

.set-radios {
  --tg-base-img-style-radius: 12px;
}
.invite-active {
  --tg-app-copyline-color: #fff;
  --afun-base-button-font-size: 14px;
}
</style>

<style>
.theme-copy .tg-icon-container {
  color: #fff;
}
</style>
