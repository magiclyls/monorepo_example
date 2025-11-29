<script lang="ts" setup>
import type { CurrencyCode } from '~/composables/useCurrencyData'
import { IconInviteFriendsShare ,IconTabbarBet} from '@tg/icons'

import { ApiMemberPromoInviteFriendsClaim, ApiMemberPromoInviteFriendsData, ApiMemberPromoInviteFriendsDetail } from '@tg/apis'

defineOptions({
  name: 'KeepAlivePromotionInviteFriends',
})

const { t } = useI18n()
const { openNotify } = useNotify()
const { openLoginDialog } = useLoginDialog()
const router = useLocalRouter()
const route = useRoute()
const { isLogin, currentGlobalCurrency } = storeToRefs(useAppStore())
const { userLanguage } = storeToRefs(useLanguageStore())
const { openShareRegisterLinkDialog } = useDialogShareRegisterLink()
const { globalPageTitle } = useGlobalStatePageTitle()

const pid = computed(() => String(route.query.pid))
const preview = route.query.preview?.toString() ?? ''

const tableColumn: Column[] = [
  {
    title: t('label_type'),
    dataIndex: 'type',
    align: 'center',
    width: '33%',
  },
  {
    title: t('invite_friends_condition'),
    dataIndex: 'condition',
    align: 'center',
    width: '33%',
  },
  {
    title: t('Bonus'),
    dataIndex: 'bonus',
    align: 'center',
    slot: 'bonus',
    width: '33%',
  },
]

const activity_id = ref('')
const imgUrl = ref('')
const currencyIcon = ref<any>('')
const currencyCode = ref<any>('')
const tableData = ref<Record<string, any>[]>([])
const ruleText = ref('')
const rule_type = ref(1)
const singleDepositTypeFixed = ref(false)
/** 获取config活动配置  */
const { runAsync: runAsyncBaseConfig, data: baseConfig } = useRequest(ApiMemberPromoInviteFriendsDetail, {
  onSuccess: (data) => {
    let tongue = data.lang || '[]'
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
    if (!data)
      return
    if (+data.apply_period === 2 && !preview) {
      openNotify({
        type: 'error',
        code: 'false',
        message: t('promo_end'),
      })
      goPromo()
    }
    try {
      activity_id.value = data.id
      imgUrl.value = JSON.parse(data.images)[userLanguage.value.replace('-', '_')]
      ruleText.value = JSON.parse(data.detail)[userLanguage.value.replace('-', '_')]
      rule_type.value = data.rule_type
      const config = JSON.parse(data.config)
      currencyCode.value = config.currencyConfig
      currencyIcon.value = getCurrencyConfigByCode(config.currencyConfig).name
      const inviteFriendsBonusTypeInfo = config.inviteFriendsBonusTypeInfo[config.currencyConfig]
      tableData.value = [
        {
          type: t('Accumulated_deposit'),
          condition: inviteFriendsBonusTypeInfo.accumulatedDepositCondition,
          bonus: inviteFriendsBonusTypeInfo.accumulatedDepositBonus,
        },
        {
          type: t('Valid_bets'),
          condition: inviteFriendsBonusTypeInfo.validBetCondition,
          bonus: inviteFriendsBonusTypeInfo.validBetBonus,
        },
        {
          type: t('single_deposit'),
          condition: inviteFriendsBonusTypeInfo.singleDepositCondition,
          bonus: inviteFriendsBonusTypeInfo.singleDepositBonus,
        },
      ]
      singleDepositTypeFixed.value = inviteFriendsBonusTypeInfo.singleDepositType === 'fixed'
      console.log('tableData.value', config, tableData.value)
    }
    catch (error) {}
  },
})

/** 用户奖金数据  */
const { runAsync: runAsyncUserConfig, data: userConfig } = useRequest(ApiMemberPromoInviteFriendsData)
/** 获取奖金  */
const { runAsync: runAsyncUserClaim } = useRequest(ApiMemberPromoInviteFriendsClaim)
/** 是否可以领取奖金  */
const CanClaim = computed(() => Number(userConfig.value?.claim_amount) > 0)

const loadingClaim = ref(false)
async function getBonus() {
  loadingClaim.value = true
  try {
    await runAsyncUserClaim({ activity_id: activity_id.value, cur: currencyCode.value as CurrencyCode })
    // openNotify({
    //   type: 'success',
    //   title: t('warm_tip'),
    //   message: t('receive_success'),
    // })
    loadingClaim.value = false
    await runAsyncUserConfig({ activity_id: activity_id.value, cur: currencyCode.value as CurrencyCode })
  }
  catch (error) {
    loadingClaim.value = false
  }
}

function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotion')
}

function toDetailPage() {
  router.push(`/promotions/promotion/invite-friends-record?activity_id=${activity_id.value}&cur=${currencyCode.value}`)
}

watch([isLogin, baseConfig], () => {
  if (!baseConfig.value || !isLogin.value)
    return
  runAsyncUserConfig({ activity_id: activity_id.value, cur: currencyCode.value as CurrencyCode })
})

watchEffect(() => {
  let names = baseConfig.value?.name || '[]'
  try {
    names = JSON.parse(names)
  }
  catch (e) {

  }
  const name = names[userLanguage.value.replace('-', '_') as any]
  if (name)
    globalPageTitle.value = name
})
await application.allSettled([runAsyncBaseConfig({ pid: pid.value, cur: currencyConfig[currentGlobalCurrency.value].cur })])
</script>

<template>
  <div class="text-tg-text-lightgrey m-auto mt-[16px] max-w-[650px]">
    <div class="flex items-center justify-center" :class="{ ' mb-[24px]': imgUrl }">
      <BaseImage v-if="imgUrl" class="" :url="imgUrl" is-network />
    </div>
    <div v-if="!isLogin" class="not-login-wrapper flex flex-col items-center justify-center rounded-[4px] px-[24px] pb-[37px] pt-[3px]0">
      <div class="mb-[24px] text-[14px] font-semibold">
        {{ t('login_view_more') }}
      </div>
      <BaseButton
        class="mt-[12px] w-[100%]" bg-style="primary" size="md"
        @click="openLoginDialog"
      >
        {{ t('login_now') }}
      </BaseButton>
    </div>
    <div v-else class="">
      <div class="relative mb-[24px] overflow-hidden rounded-[4px]" @click="openShareRegisterLinkDialog({ common: false })">
        <BaseButton
          class="w-[100%]" bg-style="primary" size="md"
        >
          {{ t('invite_friends_share_text') }}
        </BaseButton>
        <div class="invite-icon-wrapper absolute bottom-0 right-0 top-0 w-[50px] flex cursor-pointer items-center justify-center">
          <IconInviteFriendsShare class="text-[16px]" />
        </div>
      </div>
      <div class="login-wrapper relative flex flex-col items-center justify-center rounded-[4px] px-[24px] pb-[20px] pt-[20px]">
        <div class="text-tg-text-white mb-[8px] text-[18px] font-semibold">
          {{ t('Bonus') }}
        </div>
        <div class="mb-[24px]">
          <AppAmount
            :amount="userConfig?.claim_amount || '0'" reverse :currency-type="currencyIcon" class="text-tg-text-white"
            style="--tg-app-amount-font-size:18px;--tg-app-currency-icon-size:18px;"
          />
        </div>
        <BaseButton
          v-if="CanClaim"
          class="w-[100%]" bg-style="primary" size="md" :loading="loadingClaim"
          @click.stop="getBonus"
        >
          {{ t('vip_right_now') }}
        </BaseButton>
        <BaseButton
          v-else
          class="w-[100%]" bg-style="grey" size="md" disabled
        >
          {{ t('vip_right_now') }}
        </BaseButton>
        <div class="absolute right-[8px] top-[8px] cursor-pointer" @click="toDetailPage">
          <IconTabbarBet class="text-[14px]" />
        </div>
      </div>
    </div>
    <BaseTable class="table-wrapper" :columns="tableColumn" last-first-padding :data-source="tableData">
      <template #bonus="{ record }">
        <div class="flex items-center justify-center">
          <span v-if="!singleDepositTypeFixed && record.type === t('single_deposit')" class="mr-[3px]">{{ record.bonus }}%</span>
          <AppCurrencyIcon v-if="!singleDepositTypeFixed && record.type === t('single_deposit')" :currency-type="currencyIcon" />
          <AppAmount v-else :amount="record.bonus" :currency-type="currencyIcon" />
        </div>
      </template>
    </BaseTable>
    <div v-if="baseConfig" class="mt-[16px]">
      <div class="text-tg-text-white text-xl font-semibold">
        {{ t('activity_rule_desc') }}
      </div>
      <div class="my-[16px]">
        <BaseRichArea v-if="rule_type === 2" :content="ruleText" />
        <AppPromotionBaseRuleText
          v-else
          amount="" :content="ruleText" replace-type="1" :currency-type="currencyIcon"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.date {
  @include webTheme('green') {
    color: #3cb389;
  }
}

.table-wrapper {
  @include webTheme('white') {
    --tg-table-th-color: #555;
  }
}

.not-login-wrapper {
  background-color: #213744;
  @include webTheme('white') {
    background-color: #f5f5f5;
  }
  @include webTheme('green') {
    background-color: #055434;
  }
}

.login-wrapper {
  background-color: #213744;
  @include webTheme('white') {
    background-color: #f5f5f5;
  }
  @include webTheme('green') {
    background-color: #055434;
  }
}

.invite-icon-wrapper {
  background-color: #00c701;
  @include webTheme('white') {
    background-color: #e6b632;
  }
  @include webTheme('green') {
    background-color: #eca30c;
  }
}

.theme-amount {
  @include webTheme('greenblack') {
    color: var(--tg-primary-active);
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
