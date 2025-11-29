<script setup lang="ts">
import { IconPhFooterDeposit, IconPhFooterHome, IconPhFooterMine, IconPhFooterPromo, IconPhFooterSports } from '@tg/icons'
import { useAppStore } from '@tg/stores'
import { EnumSportEndDomID } from '@tg/types'
import { getLang } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

interface FooterTab {
  icon: any
  name: string
  path: string
  login?: boolean
}

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const { t } = useI18n()

const { isLogin } = storeToRefs(appStore)

const footerMenu: FooterTab[] = [
  { icon: IconPhFooterHome, name: t('首页'), path: '/' },
  { icon: IconPhFooterPromo, name: t('优惠'), path: '/promotions' },
  { icon: IconPhFooterDeposit, name: t('存款'), path: '/wallet?tab=deposit', login: true },
  { icon: IconPhFooterSports, name: t('体育'), path: '/sports' },
  { icon: IconPhFooterMine, name: t('我的'), path: '/user', login: true },
]
const curRoute = computed(() => {
  const curPath = route.path
  for (const item of footerMenu) {
    if (curPath === item.path || (item.path !== '/' && curPath.startsWith(item.path))) {
      return item.name
    }
  }
  return ''
})
function goTarget(item: FooterTab) {
  if (item.login && !isLogin.value) {
    router.push('/login')
    return
  }
  router.push(item.path)
}
</script>

<template>
  <div
    class="px-[20rem] h-[65rem] app-footer  z-fixed text-[20rem] bg-[#FFF] border-t-[1rem] border-[#ebebeb] h5-fixed-bottom rounded-t-[16rem]"
  >
    <div
      v-for="item of footerMenu" :key="item.name" type="none"
      class="shrink-0 w-[50rem] text-[#6D7693] cursor-pointer" :class="{ 'app-footer-active': item.name === curRoute } " :style="{ width: getLang() === 'vi-VN' ? '60rem' : '50rem' }"
      @click="goTarget(item)"
    >
      <div class="center mb-[2rem]">
        <component
          :is="item.icon" class="text-[24rem]"
          :style="{ color: item.name === curRoute ? '#f23038' : '#9dabc8' }"
        />
      </div>
      <div class="text-center text-[12rem] leading-[17rem] font-[500]">
        {{ item.name }}
      </div>
    </div>
    <div :id="EnumSportEndDomID.H5_CART_END_DOM" class="h5-end-dom" />
  </div>
</template>

<style scoped lang="scss">
.app-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: var(--pc-max-width);
  max-width: var(--pc-max-width);
  padding: 0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  &-active {
    color: #f23038;
  }
}

.h5-end-dom {
  position: absolute;
  width: 20rem;
  left: 50%;
  top: -20rem;
  transform: translate(-50%, 0);
}
</style>
