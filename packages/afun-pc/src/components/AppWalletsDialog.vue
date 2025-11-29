<!-- 钱包:存款首页 -->
<script setup lang='ts'>
import type { EnumCurrencyKey } from '@tg/types'

import AppWalletHome from '~/components/AppWalletHome.vue'
import AppWalletDepositDetailV3 from '~/components/AppWalletDepositDetailV3.vue'
import AppWalletDepositDetailSubmitV3 from '~/components/AppWalletDepositDetailSubmitV3.vue'
import AppWalletWithDrawBeBankV3 from '~/components/AppWalletWithDrawBeBankV3.vue'
import AppWalletChangeV3 from '~/components/AppWalletChangeV3.vue'

interface Props {
  activeTab?: string
  initCurrency?: EnumCurrencyKey
  depositTab?: string
}
defineOptions({
  name: 'AppWalletsDialog',
})

const props = withDefaults(defineProps<Props>(), {
  activeTab: 'deposit',
})
const promoStore = usePromoStore()

provide('WalletIndexProps', props)
</script>

<template>
  <BaseRouter
    :keep-alive="true"
    :routes="[
      {
        path: '/',
        component: AppWalletHome,
      },
      {
        path: '/deposit/detail',
        component: AppWalletDepositDetailV3,
      },
      {
        path: '/deposit/detail/submit',
        component: AppWalletDepositDetailSubmitV3,
      },
      {
        path: '/widthdraw/bebank',
        component: AppWalletWithDrawBeBankV3,
      },
      {
        path: '/walletchange',
        component: AppWalletChangeV3,
      },
    ]"
  />
</template>
