<script setup lang="ts" name="AppUserBalance">
import { ApiMemberDetail } from '@tg/apis'
import { LotteryButton, LotteryCurrencyIcon } from '@tg/bccomponents'
import { IconLotBack, IconLotRefresh } from '@tg/icons'
import { useCurrency } from '@tg/stores'
import { type EnumCurrencyKey, SendFlutterAppMessage } from '@tg/types'
import { getEnv, getParamsQuery, isFlutterApp, sendMsgToFlutterApp, socketClient } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, onActivated, ref } from 'vue'
import { useRequest } from 'vue-request'
import { getCurrencySelectComponent, type ProjectType } from '../hooks/useCurrencyComponentConfig'
import { useLogin } from '../hooks/useLogin'
import { isLogin as getLogin, isIFrame, postMsgToParent } from '../utils/tool'
import { useLocale } from './LotteryConfigProvider'

interface Props {
  project?: ProjectType
}

const props = withDefaults(defineProps<Props>(), {
  project: 'ph-h5',
})

const { VITE_SOCKET_PREFIX } = getEnv()
const currencyStore = useCurrency()
const { currentGlobalCurrencyMap } = storeToRefs(currencyStore)
const { login } = useLogin(null)
const isLogin = ref(getLogin())
const { runAsync: updateUserInfo } = useRequest(ApiMemberDetail, {
  ready: isLogin,
  manual: true,
})
const { $$t } = useLocale()

function setCurrency() {
  if (isFlutterApp())
    return

  if (isIFrame()) {
    const cy: EnumCurrencyKey = getParamsQuery('cy')
    currencyStore.setLocalCurrentGlobalCurrency(cy)
    currencyStore.initCurrencyList()
  }
}

function refreshBalance() {
  currencyStore.initCurrencyList()
}

async function subscribeBalance() {
  const res = await updateUserInfo()
  socketClient.addSubscribe(`${VITE_SOCKET_PREFIX}/balance/${res.uid}`, { callback: refreshBalance })
}

function onChange(currency: any) {
  if (isFlutterApp()) {
    sendMsgToFlutterApp(SendFlutterAppMessage.CURRENCY_CHANGE, currency.name)
    currencyStore.setLocalCurrentGlobalCurrency(currency.name)
    currencyStore.initCurrencyList()
    return
  }
  if (isIFrame()) {
    postMsgToParent('currency', currency.name)
    currencyStore.setLocalCurrentGlobalCurrency(currency.name)
    currencyStore.initCurrencyList()
    return
  }
  currencyStore.setLocalCurrentGlobalCurrency(currency.name)
  currencyStore.initCurrencyList()
}

// 根据项目选择对应的货币选择组件
const CurrencySelectComponent = computed(() => {
  return getCurrencySelectComponent(props.project)
})

onActivated(() => {
  isLogin.value = getLogin()
})

setCurrency()

Promise.allSettled([isLogin.value && await subscribeBalance()])
</script>

<template>
  <div>
    <div class="lottery-user-balance-bg rounded-[8rem] p-[16rem] flex flex-col">
      <h1 class="mb-auto text-[14rem] text-[500]">
        {{ $$t('账户余额') }}
      </h1>
      <h2 v-if="isLogin" class="flex">
        <div class="mr-auto center">
          <LotteryCurrencyIcon :currency-type="(currentGlobalCurrencyMap?.name as EnumCurrencyKey)" />
          <span class="mx-[6rem] text-[18rem] font-[600]">
            {{ currentGlobalCurrencyMap?.balance ?? '0.00' }}
          </span>
          <span class="center lottery-user-balance-text1 text-[16rem]" @click="refreshBalance">
            <IconLotRefresh />
          </span>
        </div>
        <component :is="CurrencySelectComponent" :t="$$t" :show-setting="true" :currency="currentGlobalCurrencyMap?.cur" @choose="onChange">
          <div class="lottery-user-balance-text1">
            <IconLotBack class="-rotate-90" />
          </div>
        </component>
      </h2>
      <h2 v-else>
        <div class="text-[18rem] mt-[8rem] mb-[16rem] font-[600]">
          {{ '0.00' }}
        </div>
        <LotteryButton class="w-full h-[44rem]" @click="login">
          {{ $$t('立即登录') }}
        </LotteryButton>
      </h2>
    </div>
  </div>
</template>
