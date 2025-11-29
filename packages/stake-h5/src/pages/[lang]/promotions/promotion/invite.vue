<script setup lang='ts'>
import { IconUniClose , IconArrowDown, IconUniArrowRight ,IconUniArrowRightSmall} from '@tg/icons'
import type { IPromotionInviteConfig } from '@tg/types'
import type { CurrencyCode } from '~/composables/useCurrencyData'
import { ApiMemberAgencyBonusApply, ApiMemberAgencyConfig, ApiMemberAgencyValidMemberCount } from '@tg/apis'

defineOptions({
  name: 'KeepAlivePromotionInvite',
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
interface ProgressType extends BoxType {
  title: string
  bonusAverage: string
  completePercent: string
}
const { t } = useI18n()
const appStore = useAppStore()
const { isMobile } = storeToRefs(useWindowStore())
const { userLanguage } = storeToRefs(useLanguageStore())
const location = useBrowserLocation()
const { openNotify } = useNotify()
const { isLogin, currentGlobalCurrency, balanceData } = storeToRefs(useAppStore())
const { openDialogInviteDetail } = useDialogPromoInviteDetail()
const { jumpToUrl } = useRedirect()
const lang = getCurrentLanguageForBackend()
const route = useRoute()
const router = useLocalRouter()
let pid = route.query.pid ? route.query.pid.toString() : ''
const preview = route.query.preview?.toString() ?? ''
const { bool: isApplying } = useBoolean(false)
const { bool: isPageLoading, setBool: setIsPageLoading } = useBoolean(true)
const { globalPageTitle } = useGlobalStatePageTitle()

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
const configCurrencyType = computed(() => getCurrencyConfigByCode(configCurrency.value ?? '701').name)

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

    if (!tongue.includes(getCurrentLanguageForBackend())) {
      openNotify({
        type: 'error',
        code: 'false',
        message: t('lang_not_support_promo'),
      })
      goPromo()
    }
    if (res && +res.state !== 1 && !preview) {
      openNotify({
        type: 'error',
        code: 'false',
        message: t('promo_end'),
      })
      goPromo()
      return
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
      openNotify({
        type: 'error',
        code: 'false',
        message: t('promo_end'),
      })
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
      usePromoNotifications({ payload: JSON.stringify({ type: '5' }) })

    runGetConfig({ ...configParams.value, currency_id: configCurrency.value! })
    appStore.getBalanceData()
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
const showCurrencyType = computed(() => configData.value ? getCurrencyConfigByCode(configData.value.currency_id).name : 'USDT')
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
        const boxUrl = `/png/promotions/${imgType.value}${imgType.value === 'gold' ? (showBoxAmount.value ? '_yes' : '_yes') : ''}${isReceived || isPending ? `_open${configData.value?.show_amount}` : validManCount.value >= a.ppl ? '' : '_disabled'}.png`
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
      const boxUrl = `/png/promotions/${imgType.value}${imgType.value === 'gold' ? (showBoxAmount.value ? '_yes' : '_yes') : ''}${validManCount.value >= a.ppl ? '' : '_disabled'}.png`
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

function langNotify(data: any) {
  openNotify(data)
}

const notifyLangThrottle = throttle(langNotify, 5 * 1000, { leading: true, trailing: false })

function onBoxClick(box: BoxType) {
  if (!promoStarted.value) {
    return notifyLangThrottle({
      icon: 'chess-gameshow',
      iconColor: '--tg-text-alltheme-green',
      title: t('warm_tip'),
      message: t('activity_not_start'),
    })
    // return openNotify({
    //   icon: 'chess-gameshow',
    //   iconColor: '--tg-text-alltheme-green',
    //   title: t('warm_tip'),
    //   message: t('activity_not_start'),
    // })
  }
  if (!box.isCanApply) {
    if (isFlutterApp())
      sendMsgToFlutterApp(SendFlutterAppMessage.PROMO_NORMAL_TIPS_1)

    return notifyLangThrottle({
      icon: 'uni-record-warn',
      title: t('warm_tip'),
      message: t('cant_get_bonus'),
    })
    // return openNotify({
    //   icon: 'uni-record-warn',
    //   title: t('warm_tip'),
    //   message: t('cant_get_bonus'),
    // })
  }

  if (!hideApplyBtn.value && !box.isPending && box.isCanApply && !applyLoading.value && isLogin.value)
    apply()
}

function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotion')
}

function goAff() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.USER_AFFILIATE)
  else
    router.push('/affiliate/invitation-link')
}

function mqttRefresh() {
  pid = route.query.pid ? route.query.pid.toString() : ''
  configParams.value.pid = pid
  runGetConfig(configParams.value)
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
    globalPageTitle.value = name
})

watch(isLogin, (a) => {
  if (a)
    runGetConfig(configParams.value)
})
watch(balanceData, () => {
  if (route.fullPath.includes('/promotion/invite'))
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
  <div class="mx-auto max-w-[650px] w-full flex flex-col pb-[16px] pt-[20px] @md:pt-[3px]2">
    <AppLoading v-if="isPageLoading || !configRes /* || (configRes && configRes.state !== 1) */" full-screen />
    <template v-else>
      <!-- <div v-if="isMobile" class="back order-1 box-content h-[16px] flex items-center justify-end py-[16px] leading-[16px]">
      <BaseButton type="text" size="none" @click="goPromo">
        <IconUniClose  />
      </BaseButton>
    </div> -->
      <div class="order-2 flex items-center justify-center">
        <BaseImage class="" is-network :url="configData?.image" />
      </div>
      <!-- <div class="text-tg-text-lightgrey my-[29px] text-[12px] font-medium @md:text-[14px]">
      {{ timeToCustomizeFormat(startTime, 'YYYY/MM/DD') }} - {{ timeToCustomizeFormat(endTime, 'YYYY/MM/DD') }}
    </div> -->
      <!-- 推广链接 -->
      <div class="bg-tg-secondary-dark order-4 mb-[16px] mt-[16px] w-full rounded-[4px] px-[14px] pb-[16px] pt-[13px]">
        <div class="mb-[6px] w-full flex items-center justify-between">
          <span class="text-tg-text-white text-[14px] font-semibold leading-[20px]">{{ t('my_link') }}</span>
          <BaseButton
            v-if="!hideApplyBtn && isLogin && bonusAvailable" custom-padding bg-style="secondary" style="
          --tg-base-button-font-size:12px;
          --tg-base-button-padding-y:5.5px;
          --tg-base-button-padding-x:11.5px;
          " @click="apply"
          >
            {{ t('promo_get_it_with_one_click') }}
          </BaseButton>
        </div>
        <AppCopyLine :msg="inviteUrl" class="theme-copy mb-[16px]" />
        <div class="mb-[7px] w-full flex items-center justify-between">
          <span class="text-tg-text-white text-[14px] font-semibold">{{ t('promo_quick_share') }}</span>
          <BaseButton class="theme-more" type="text" size="none" @click="goAff">
            <span class="leading-[20px]">{{ t('more') }}</span>
            <IconUniArrowRight class="theme-arrow"  />
          </BaseButton>
        </div>
        <AppApplicationSharing round class="text-tg-text-lightgrey" width="30px" :share-text="inviteUrl" style="--tg-app-share-size: 11px;" />
        <div class="theme-line my-[16px] h-[2px] w-full" />
        <div class="mb-[2px] w-full flex items-center justify-between">
          <span class="text-tg-text-lightgrey text-[14px] font-semibold">{{ t('promo_effective_promotion_number', {
            num:
              validManCount,
          }) }}</span>
          <BaseButton class="theme-detail" type="text" size="none" @click="openDialogInviteDetail({ pid, currencyId: configCurrency })">
            <span class="leading-[20px]">{{ t('detail') }}</span>
          </BaseButton>
        </div>
      </div>

      <!-- 箱子 -->
      <div
        v-if="!isProgressType"
        class="bg-tg-secondary-dark boxes-outer order-5 mb-[16px] w-full flex flex-col rounded-[4px] px-[14px] pb-[49px] pt-[23px]"
        :class="[`bonus-tpl-${imgType}`, isMobile ? 'mobile-tpl' : 'pc-tpl']"
      >
        <!-- row -->
        <template v-for="row, rowI in boxList" :key="rowI">
          <div
            class="relative w-full flex items-end" :class="[
              row.length < rowCount ? 'justify-start' : 'justify-between',
            ]"
          >
            <!-- imgType !== 'box' && rowI % 2 !== 0 ? 'flex-row-reverse' : '', -->
            <template v-for="b, boxI in row" :key="`${b.ppl}${b.bonus}`">
              <!-- box -->
              <div
                class="relative min-w-[65px] flex flex-col cursor-pointer items-center justify-end"
                :class="[
                  b.hidden && 'invisible h-[0px]',
                  b.isReceived && 'item-received',
                  b.isPending && 'item-pending',
                  b.isCanApply ? 'can-apply' : '',
                  showBoxAmount ? 'box-show-amount' : 'box-no-show-amount',
                  imgType === 'box' && 'min-h-[54px] @md:min-h-[100px]',
                  imgType === 'red' && 'min-h-[74px] @md:min-h-[101px]',
                  imgType === 'gold' && 'min-h-[60px] @md:min-h-[78px]',
                ]"
                @click="onBoxClick(b)"
              >
                <BaseImage
                  :width="imgWidth" :url="b.boxUrl"
                />
                <!-- 人数 -->
                <span
                  :class="[
                    imgType === 'red' ? 'bottom-[1px] text-[12px] leading-[0.8] @md:text-[15px]' : '@md:leading-[11px] bottom-[7.7px] w-[10ch] @md:bottom-[7px] text-[12px] @md:text-[14px]',
                    b.isReceived && 'is-received',
                    b.isPending && 'is-pending',
                    `people-txt-${userLanguage}`,
                  ]"
                  class="theme-man-count people-txt absolute left-[50%] h-[2em] w-full inline-flex flex-wrap translate-x-[-50%] items-center justify-center gap-[3px] text-center font-semibold"
                >
                  <template v-if="userLanguage === 'pt-BR'">
                    <span class="">Promoção</span><span class="num">{{ b.ppl }}</span><span class="">{{ t('people') }}</span>
                  </template>
                  <template v-else>
                    <span class="num">{{ b.ppl }}</span><span class="">{{ t('people') }}</span>
                  </template>
                </span>
                <!-- 奖金 -->
                <span
                  v-if="showBoxAmount"
                  class="text-tg-text-lightgrey bonus-txt bonus-show absolute bottom-[-17px] left-[50%] flex translate-x-[-50%] items-center text-[12px] font-semibold @md:bottom-[-24px] @md:text-[19px]"
                >
                  {{ b.bonus && toFixed(b.bonus, 2) }}
                <!-- <AppCurrencyIcon
                  v-if="imgType !== 'box'" class="mx-[3px]"
                  :currency-type="showCurrencyType"
                  :style="isMobile ? '--tg-app-currency-icon-size:14px;' : ''"
                /> -->
                </span>
                <span
                  v-if="!showBoxAmount && (b.isReceived || b.isPending)"
                  class="bonus-txt bonus-not-show absolute bottom-[35px] left-[50%] flex translate-x-[-50%] items-center text-[12px] font-semibold text-[#752D10] @md:bottom-[45px] @md:text-[15px]"
                >
                  {{ b.bonus && toFixed(b.bonus, 2) }}
                <!-- <AppCurrencyIcon
                  v-if="imgType !== 'box'" class="mx-[3px]"
                  :currency-type="showCurrencyType"
                  :style="isMobile ? '--tg-app-currency-icon-size:10px;' : ''"
                /> -->
                </span>
                <!-- 审核中 -->
                <div v-if="b.isPending" class="absolute bottom-0 w-full">
                  <BaseImage :width="pendingImgWidth" url="/img/promotion/invite_pending.svg" />
                  <span
                    class="text-tg-text-white absolute top-[3px] inline-block w-full text-center text-[12px] font-semibold @md:top-[7px] @md:text-[14px]"
                  >
                    {{ t('promo_invite_pending') }}
                  </span>
                </div>
              </div>
              <!-- 箭头 -->
              <div
                v-if="boxI !== rowCount - 1" :class="[b.hidden || b.last ? 'invisible' : '']"
                class="flex grow items-center justify-center"
              >
                <div
                  class="theme-icon absolute top-[50%] flex grow translate-y-[-50%] items-center justify-center text-[16px] @md:text-[24px]"
                >
                  <!-- <template v-if="imgType === 'box'"> -->
                  <IconUniArrowRightSmall class="" :class="[imgType === 'box' ? 'text-[8px] @md:text-[12px]' : 'text-[14px] @md:text-[14px]']"  />
                <!-- </template> -->
                <!-- <template v-else>
                  <IconUniArrowRight v-if="rowI % 2 === 0" " />
                  <IconUniArrowLeft v-else />
                </template> -->
                </div>
              </div>
            </template>
          </div>
        <!-- 第二行的箭头 -->
        <!-- <IconArrowDown v-if="imgType !== 'box'" /> -->
        <!-- <div
          v-if="rowI !== boxList.length - 1" class="row-arrow mb-[19px] mt-[25px] flex @md:mb-[35px] @md:mt-[45px]"
          :class="[rowI % 2 !== 0 ? '' : 'flex-row-reverse', showBoxAmount ? '' : 'row-arrow-no-show-amount']"
        >
          <div
            :class="[isMobile ? 'w-[78.18px]' : 'w-[105.51px]']"
            class="flex items-center justify-center text-[16px] @md:text-[24px]"
          />
        </div> -->
        </template>
      </div>

      <!-- 推广规则 -->
      <div
        class="bg-tg-secondary-dark invite-rules order-6 mb-[16px] w-full flex flex-col rounded-[4px] px-[14px] py-[18px]"
      >
        <h6 class="text-tg-text-white text-[14px] font-semibold leading-[20px]">
          {{ t('invite_what_is_good') }}{{ t('question_mark') }}{{
            t(`promo_invite_how_to_good${configData?.condition_type}`) }}
        </h6>
        <div
          v-if="+firstDepositAmount > 0"
          class="theme-bg w-full flex flex-col gap-[2px] rounded-[4px] px-[8px] py-[10px] leading-[20px]"
        >
          <div class="text-tg-text-white text-[14px] font-semibold">
            {{ t('promo_invite_rule5') }}
          </div>
          <div class="text-tg-text-lightgrey flex items-center text-[14px] font-medium">
            <span class="mr-[4px]">{{ firstDepositAmount }}</span>
            <!-- <AppCurrencyIcon class="mx-[3px]" :currency-type="showCurrencyType" show-name /> -->
            <span>{{ t('promo_or_more') }}</span>
          </div>
        </div>
        <div
          v-if="+totalDepositAmount > 0"
          class="theme-bg w-full flex flex-col gap-[2px] rounded-[4px] px-[8px] py-[10px] leading-[20px]"
        >
          <div class="text-tg-text-white text-[14px] font-semibold">
            {{ t('promo_invite_rule1') }}
          </div>
          <div class="text-tg-text-lightgrey flex items-center text-[14px] font-medium">
            <span class="mr-[4px]">{{ totalDepositAmount }}</span>
            <!-- <AppCurrencyIcon class="mx-[3px]" :currency-type="showCurrencyType" show-name /> -->
            <span>{{ t('promo_or_more') }}</span>
          </div>
        </div>
        <div
          v-if="+totalBetAmount > 0"
          class="theme-bg w-full flex flex-col gap-[2px] rounded-[4px] px-[8px] py-[10px] leading-[20px]"
        >
          <div class="text-tg-text-white text-[14px] font-semibold">
            {{ t('promo_invite_rule2') }}
          </div>
          <div class="text-tg-text-lightgrey flex items-center text-[14px] font-medium">
            <span class="mr-[4px]">{{ totalBetAmount }}</span>
            <!-- <AppCurrencyIcon class="mx-[3px]" :currency-type="showCurrencyType" show-name /> -->
            <span>{{ t('promo_or_more') }}</span>
          </div>
        </div>
        <div
          v-if="+totalDepositTimes > 0"
          class="theme-bg w-full flex flex-col gap-[2px] rounded-[4px] px-[8px] py-[10px] leading-[20px]"
        >
          <div class="text-tg-text-white text-[14px] font-semibold">
            {{ t('promo_invite_rule3') }}
          </div>
          <div class="text-tg-text-lightgrey flex items-center text-[14px] font-medium">
            <span>{{ t('promo_times_or_more', { count: totalDepositTimes }) }}</span>
          </div>
        </div>
        <div
          v-if="+totalDepositDays > 0"
          class="theme-bg w-full flex flex-col gap-[2px] rounded-[4px] px-[8px] py-[10px] leading-[20px]"
        >
          <div class="text-tg-text-white text-[14px] font-semibold">
            {{ t('promo_invite_rule4') }}
          </div>
          <div class="text-tg-text-lightgrey flex items-center text-[14px] font-medium">
            <span>{{ t('promo_day_or_more', { count: totalDepositDays }) }}</span>
          </div>
        </div>
      </div>

      <!-- 玩法规则 -->
      <div v-if="ruleHtml" class="bg-tg-secondary-dark text-tg-secondary-light order-7 w-full rounded px-[14px] py-[18px]">
        <div class="text-tg-text-white mb-[15px] text-[20px] font-semibold @md:text-[28px]">
          {{ t('terms_conditions') }}
        </div>
        <BaseRichArea v-if="isRichText" :content="ruleHtml" />
        <AppPromotionBaseRuleText
          v-else :amount="boxes[boxes.length - 1].bonus" :currency-type="configCurrencyType"
          :content="ruleHtml"
        />
        <div class="mt-[16px] flex flex-col items-center">
          <BaseButton
            v-if="isShowBtn" bg-style="secondary" size="lg"
            @click="jumpToUrl({ type: configData ? +configData?.button_type : 0, jumpUrl: configData ? configData.button_redirect : '' })"
          >
            {{ btnText }}
          </BaseButton>
        </div>
      </div>
    </template>
    <img src="/stake/webp/promotions/box_open1.webp" style="display:none;width:0;height:0;">
    <img src="/stake/webp/promotions/box_open2.webp" style="display:none;width:0;height:0;">
    <img src="/stake/webp/promotions/red_open1.webp" style="display:none;width:0;height:0;">
    <img src="/stake/webp/promotions/red_open2.webp" style="display:none;width:0;height:0;">
  </div>
</template>

<style lang='scss' scoped>
.theme-detail {
  @include webTheme('green') {
    --tg-base-button-text-default-color: #fff;
  }
}
.theme-more {
  @include webTheme('green') {
    --tg-base-button-text-default-color: #5ecea6;
  }
}
.theme-copy {
  --app-copyline-font-size: 15px;
  --app-copyline-color: var(--tg-text-lightgrey);
  --app-copyline-button-padding: 11px;
  --tg-app-copy-line-input-expanded-py: 6.5px;
  @include webTheme('white') {
    --tg-app-copy-line-input-background-color: #e8e8e8;
    --tg-app-copy-line-input-border-color: #e8e8e8;
    --tg-app-copy-line-input-wrap-box-shadow: none;
    --tg-app-copy-line-button-box-background-color: #e8e8e8;
    --app-copyline-color: #111;
  }
  @include webTheme('green') {
    --tg-app-copy-line-input-background-color: #02432d;
    --tg-app-copy-line-input-border-color: #02432d;
    --tg-app-copy-line-input-wrap-box-shadow: none;
    --tg-app-copy-line-button-box-background-color: #02432d;
    --app-copyline-color: #fff;
  }
}
.theme-arrow {
  @include webTheme('white') {
    --tg-icon-color: #555;
  }
}
.theme-icon {
  @include webTheme('white') {
    --tg-icon-color: #9e9dab;
  }
  @include webTheme('green') {
    --tg-icon-color: #3cb389;
  }
}
.theme-line {
  background-color: var(--tg-secondary-main);
  @include webTheme('white') {
    background-color: #c1c1c1;
  }
  @include webTheme('green') {
    background-color: #197b59;
  }
}
.theme-man-count {
  color: var(--tg-text-white);
  @include webTheme('white') {
    color: #555;
  }
  @include webTheme('green') {
    color: #3cb389;
  }
}
.theme-bg {
  background-color: var(--tg-secondary-grey);
  @include webTheme('white') {
    background-color: #e3e3e3;
  }
  @include webTheme('green') {
    background-color: #02432d;
  }
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
    color: var(--tg-text-lightgrey);
    display: flex;
    gap: 4px;

    .num {
      color: #ff8a00;
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
    .box-show-amount {
    }
    .box-no-show-amount {
    }
  }
  &.mobile-tpl {
    .bonus-not-show {
      bottom: 45.5px;
    }
    .people-txt {
      bottom: -32px;
    }
    .box-show-amount {
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
  .num {
    margin-left: 2px;
  }
}
.num {
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
</style>

<route lang="yaml">
meta:
  layout: home
</route>
