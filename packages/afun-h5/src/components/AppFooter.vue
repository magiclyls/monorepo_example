<script setup lang="ts">
import { ApiMemberAgencyCheck } from '@tg/apis'
import { IconAfunHeaderMenu, IconPhFooterMine, IconSptBasketball, IconTabbarGame, IconUniPromo, IconUniShare } from '@tg/icons'
import { useAppStore } from '@tg/stores'
import { EnumSportEndDomID } from '@tg/types'
import { storeToRefs } from 'pinia'
import { computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import { useLeftSidebar } from '~/hooks/useLeftSidebar'
import { Message } from '~/utils'

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
const { setBeforePage } = useLeftSidebar()
const { currentPath } = storeToRefs(useAppStore())

const footerMenu: FooterTab[] = [
  { icon: IconAfunHeaderMenu, name: t('浏览'), path: '/menu' },
  { icon: IconTabbarGame, name: t('娱乐城'), path: '/' },
  { icon: IconSptBasketball, name: t('体育'), path: '/sports' },
  { icon: IconUniPromo, name: t('优惠'), path: '/promotions' },
  // { icon: IconUniShare, name: t('分享'), path: '/promotions/promotion/invite?pid=' },
  { icon: IconPhFooterMine, name: t('我的'), path: '/user', login: true },
]

// 娱乐城路由
const casinoRouters = ['/games', '/original-game', '/group', '/lottery']
const curRoute = computed(() => {
  const curPath = route.path
  for (const item of footerMenu) {
    if (curPath === item.path || (item.path !== '/' && curPath.startsWith(item.path))) {
      return item.name
    }
  }
  for (const item of casinoRouters) {
    if (curPath.startsWith(item)) {
      return t('娱乐城')
    }
  }
  return ''
})

const { runAsync: runAgencyCheck, data: memberAgencyCheckData } = useRequest(ApiMemberAgencyCheck, { manual: true })

// 分享
function onShareClickHandler() {
  if (route.fullPath.includes('/promotion/invite'))
    return
  if (memberAgencyCheckData.value) {
    if (memberAgencyCheckData.value.tips && +memberAgencyCheckData.value.tips === 0) {
      // 活动未开始
      Message.info(t('活动未开始请稍后再试'))
    }
    else if (memberAgencyCheckData.value.tips && +memberAgencyCheckData.value.tips === 1) {
      // 语言不支持此活动
      Message.info(t('当前语言不支持此活动'))
    }
    else if (memberAgencyCheckData.value.pid) {
      router.push(`/promotions/promotion/invite?pid=${memberAgencyCheckData.value.pid}`)
    }
  }
}

async function goTarget(item: FooterTab) {
  if (item.path === '/menu') {
    if (route.path === '/menu') {
      router.back()
      return
    }
    setBeforePage(route.fullPath)
  }
  if (item.name === t('分享')) {
    onShareClickHandler()
  }
  else if (item.login && !isLogin.value) {
    router.push('/login')
  }
  else {
    router.push(item.path)
  }
}
watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    currentPath.value = ''
  },
)
onMounted(() => {
  // runAgencyCheck({ currency_id: currentGlobalCurrencyMap.value.cur })
})
</script>

<template>
  <div
    class="px-[16px] h-[60px] app-footer  z-fixed text-[20px] bg-[#0F212E] border-[#ebebeb] h5-fixed-bottom"
  >
    <div
      v-for="item of footerMenu" :key="item.name" type="none"
      class="shrink-0 flex-1 h-[60px] flex flex-col justify-center text-[#fff] cursor-pointer" :class="{ 'app-footer-active': item.name === curRoute }"
      @click="goTarget(item)"
    >
      <div class="center mb-[6px]">
        <component
          :is="item.icon"
          v-if="item.icon !== IconUniShare" class="text-[20px] h-[20px]"
          :style="{ color: item.name === curRoute ? '#fff' : '#9dabc8' }"
        />
        <div
          v-else
          class="absolute left-[50%] top-[-18px] h-[55px] w-[55px] flex translate-x-[-50%] items-center justify-center border-[6px] border-[#0F212E] rounded-[100px] border-solid bg-[#2F4554] text-[23px] hover:bg-[#3F5564] transition-colors duration-200"
        >
          <IconUniShare class="text-[#B1BAD3] hover:text-white transition-colors duration-200" />
        </div>
      </div>
      <div
        class="text-center text-[13px] leading-[1] font-[600]"
        :class="{ 'mt-[27px]': item.icon === IconUniShare }"
      >
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
  box-sizing: content-box;
  padding: 0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);

  &-active {
    color: #fff;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      min-height: 4px;
      width: 60%;
      background-color: #24ee89;
    }
  }
}

.h5-end-dom {
  position: absolute;
  width: 20px;
  left: 50%;
  top: -20px;
  transform: translate(-50%, 0);
}
</style>
