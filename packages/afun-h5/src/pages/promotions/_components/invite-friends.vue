<script lang="ts" setup>
import type { Column, CurrencyCode } from '@tg/types'
import { ApiMemberPromoInviteFriendsClaim, ApiMemberPromoInviteFriendsData, ApiMemberPromoInviteFriendsDetail } from '@tg/apis'
import { AfunBaseAmount, AfunBaseButton, AfunBaseCurrencyIcon, AfunBaseImage, AfunBaseRichArea, AfunBaseTable } from '@tg/bccomponents'
import { IconInviteFriendsShare, IconTabbarBet } from '@tg/icons'
import { useAppStore, useCurrency, useDialogStore } from '@tg/stores'
import { SendFlutterAppMessage } from '@tg/types'
import { application, getCurrencyConfig, isFlutterApp, sendMsgToFlutterApp } from '@tg/utils'
import { getLang, getLangForBackend } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, inject, ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppPromotionBaseRuleText from '~/components/AppPromotionBaseRuleText'
import { Message } from '~/utils'

defineOptions({
  name: 'KeepAlivePromotionInviteFriends',
})

const {
  showShareRegisterLinkDialog,
} = storeToRefs(useDialogStore())

const setTitle = inject('setTitle', (v: string) => {})
const { t } = useI18n()
// const { openNotify } = useNotify()
// const { openLoginDialog } = useLoginDialog()
const router = useRouter()
const route = useRoute()
const { isLogin } = storeToRefs(useAppStore())
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const userLanguage = ref(getLang())
// const { openShareRegisterLinkDialog } = useDialogShareRegisterLink()
// const { globalPageTitle } = useGlobalStatePageTitle()

const pid = computed(() => String(route.query.pid))
const preview = route.query.preview?.toString() ?? ''

const tableColumn: Column[] = [
  {
    title: t('类型'),
    dataIndex: 'type',
    align: 'center',
    width: '33%',
  },
  {
    title: t('条件'),
    dataIndex: 'condition',
    align: 'center',
    width: '33%',
  },
  {
    title: t('奖金'),
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
    if (!tongue.includes(getLangForBackend())) {
      Message.error(t('当前语言不支持此活动'))
      goPromo()
    }
    if (!data)
      return
    if (+data.apply_period === 2 && !preview) {
      Message.error(t('活动已结束'))
      goPromo()
    }
    try {
      activity_id.value = data.id
      imgUrl.value = JSON.parse(data.images)[userLanguage.value.replace('-', '_')]
      ruleText.value = JSON.parse(data.detail)[userLanguage.value.replace('-', '_')]
      rule_type.value = data.rule_type
      const config = JSON.parse(data.config)
      currencyCode.value = config.currencyConfig
      currencyIcon.value = getCurrencyConfig(config.currencyConfig).name
      const inviteFriendsBonusTypeInfo = config.inviteFriendsBonusTypeInfo[config.currencyConfig]
      tableData.value = [
        {
          type: t('累计存款'),
          condition: inviteFriendsBonusTypeInfo.accumulatedDepositCondition,
          bonus: inviteFriendsBonusTypeInfo.accumulatedDepositBonus,
        },
        {
          type: t('有效投注'),
          condition: inviteFriendsBonusTypeInfo.validBetCondition,
          bonus: inviteFriendsBonusTypeInfo.validBetBonus,
        },
        {
          type: t('单笔存款总奖金'),
          condition: inviteFriendsBonusTypeInfo.singleDepositCondition,
          bonus: inviteFriendsBonusTypeInfo.singleDepositBonus,
        },
      ]
      singleDepositTypeFixed.value = inviteFriendsBonusTypeInfo.singleDepositType === 'fixed'
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
    Message.success(t('领取成功'))
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
    router.replace('/promotions')
}
function openLoginDialog() {
  router.push('/login')
}

function openShareRegisterLinkDialog() {
  // router.push('/share-register-link')
  showShareRegisterLinkDialog.value = true
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
    setTitle(name)
})

await application.allSettled([runAsyncBaseConfig({ pid: pid.value, cur: getCurrencyConfig(currentGlobalCurrencyMap.value.type).cur })])
</script>

<template>
  <div class="invite-friends-active text-tg-text-lightgrey m-auto mt-[16px] max-w-[650px]">
    <div class="center" :class="{ ' mb-[24px]': imgUrl }">
      <AfunBaseImage v-if="imgUrl" class="set-radios" :url="imgUrl" is-network />
    </div>
    <div v-if="!isLogin" class="not-login-wrapper flex flex-col items-center justify-center rounded-[4px] px-[24px] pb-[37px] pt-[30px]">
      <div class="mb-[24px] text-[14px] font-[600]">
        {{ t('登录后查看更多内容') }}
      </div>
      <AfunBaseButton
        class="mt-[12px] w-[100%]" bg-style="secondary" size="md"
        @click="openLoginDialog"
      >
        {{ t('立即登录') }}
      </AfunBaseButton>
    </div>
    <div v-else>
      <div class="relative mb-[24px] overflow-hidden rounded-[4px]" @click="openShareRegisterLinkDialog()">
        <AfunBaseButton
          class="w-[100%]" style="--afun-base-button-font-weight:500;--afun-base-button-font-size:14px;--afun-base-button-padding-y:9px" bg-style="secondary" size="md"
        >
          {{ t('分享并邀请更多好友') }}
        </AfunBaseButton>
        <div class="invite-icon-wrapper absolute bottom-0 right-0 top-0 w-[50px] flex cursor-pointer items-center justify-center">
          <IconInviteFriendsShare class="text-[16px]" />
        </div>
      </div>
      <div class="login-wrapper relative flex flex-col items-center justify-center rounded-[4px] px-[24px] pb-[20px] pt-[20px]">
        <div class="text-[#fff] mb-[8px] text-[18px] font-[600]">
          {{ t('奖金') }}
        </div>
        <div class="mb-[24px]">
          <AfunBaseAmount
            :amount="userConfig?.claim_amount || '0'" reverse :currency-type="currencyIcon" class="text-[#fff]"
            style="--tg-app-amount-font-size:18px;--tg-app-currency-icon-size:18px;"
          />
        </div>
        <AfunBaseButton
          v-if="CanClaim"
          class="w-[100%]" bg-style="secondary" size="md" :loading="loadingClaim"
          @click.stop="getBonus"
        >
          {{ t('立即领取') }}
        </AfunBaseButton>
        <AfunBaseButton
          v-else
          class="w-[100%]" bg-style="grey" size="md" disabled
        >
          {{ t('立即领取') }}
        </AfunBaseButton>
        <div class="absolute right-[8px] top-[8px] cursor-pointer" @click="toDetailPage">
          <IconTabbarBet class="text-[14px] text-[#9DABC9]" />
        </div>
      </div>
    </div>
    <AfunBaseTable class="table-wrapper" :columns="tableColumn" last-first-padding :data-source="tableData">
      <template #bonus="{ record }">
        <div class="center">
          <span v-if="!singleDepositTypeFixed && record.type === t('单笔存款总奖金')" class="mr-[3px]">{{ record.bonus }}%</span>
          <AfunBaseCurrencyIcon v-if="!singleDepositTypeFixed && record.type === t('单笔存款总奖金')" :currency-type="currencyIcon" />
          <AfunBaseAmount v-else :amount="record.bonus" :currency-type="currencyIcon" />
        </div>
      </template>
    </AfunBaseTable>
    <div v-if="baseConfig" class="mt-[16px]">
      <div class="text-[#fff] text-[18px] font-[600]">
        {{ t('活动规则说明') }}
      </div>
      <div class="mt-[16px]">
        <AfunBaseRichArea v-if="rule_type === 2" :content="ruleText" />
        <AppPromotionBaseRuleText
          v-else
          amount="0" :content="ruleText" replace-type="1" :is-login="isLogin" :currency-type="currencyIcon"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-login-wrapper {
  background-color: #213744;
}
.login-wrapper {
  background-color: #213744;
}
.set-radios {
  --tg-base-img-style-radius: 12px;
}
.invite-icon-wrapper {
  color: #fff;
  background-color: #00c701;
  padding: 9px 15px;
}
.invite-friends-active {
  --tg-table-odd-background: #213743;
  --tg-table-th-color: #b1bad3;
  --tg-table-td-color: #b1bad3;
  --afun-base-amount-font-size: 14px;
  --afun-app-currency-icon-size: 14px;
  --afun-base-button-font-size: 14px;
  --afun-table-th-color: #b1bad3;
}
</style>

<style lang="scss">
.dialog-wrapper {
  --afun-base-dialog-background-color: #1a2c38;
  --afun-base-dialog-share-background-color: #2f4553;
  --afun-base-dialog-share-text-color: #fff;
}
</style>
