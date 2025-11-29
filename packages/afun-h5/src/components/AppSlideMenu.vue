<script setup lang="ts">
import type { EnumSportsOddsType, Menu } from '@tg/types'
import { AfunBaseImage } from '@tg/bccomponents'
import { IconAffiliate, IconChatStarBronze, IconDownload, IconInfo, IconMenuLanguage, IconPhFooterPromo, IconRecent, IconUserKefu, IconVip } from '@tg/icons'
import { useAppStore, useCasinoStore, useDownloadStore, useSportsStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AppAccordion from './AppAccordion.vue'
import AppLanguageSelector from './AppLanguageSelector.vue'

defineOptions({
  name: 'AppSideMenu',
})
const { t } = useI18n()
const route = useRoute()
const appStore = useAppStore()
const { isLogin } = storeToRefs(appStore)
const downloadStore = useDownloadStore()
const { casinoSidebar: casinoGame, isSidebarHasProvider, casinoGameProvider } = storeToRefs(useCasinoStore())
const sportsStore = useSportsStore()
const { AllOddsTypes, sidebarData, sportsOddsType } = storeToRefs(sportsStore)

const sideMenuRef = ref<HTMLElement | null>(null)

/** casino */
const casinoGameList = computed(() => {
  const casinoMenu: Menu = [
    {
      icon: IconChatStarBronze,
      title: t('收藏夹'),
      path: '/favourites',
    },
    {
      icon: IconRecent,
      title: t('近期游戏记录'),
      path: '/recent',
    },
  ]
  const list = casinoMenu.concat(casinoGame.value)
  // if (isSidebarHasProvider.value) {
  //   list = list.concat(casinoGameProvider.value)
  // }
  return list
})

const otherMenus = ref<Menu>([
  {
    title: 'Other',
    icon: '',
    expand: true,
    children: [
      {
        icon: IconPhFooterPromo,
        title: t('优惠活动'),
        path: '/promotions',
        hot: true,
      },
      {
        icon: IconAffiliate,
        title: t('联盟计划'),
        path: '/affiliate',
      },
      {
        icon: IconVip,
        title: t('VIP俱乐部'),
        path: '/vip',
      },
      // {
      //   icon: IconKyc,
      //   title: t('KYC'),
      //   path: '/affiliate',
      // },
      {
        icon: IconUserKefu,
        title: t('官方客服'),
        path: '/service',
      },
      {
        icon: IconInfo,
        title: t('关于我们'),
        path: '/policies/about-us',
      },
      {
        icon: IconDownload,
        title: t('APP下载'),
        path: '',
        callBack: () => downloadStore.downLoad(1),
      },
    ],
  },
])

/** 体育项目 */
const sportGameList = computed(() => {
  if (sidebarData.value && sidebarData.value.all) {
    const list = sidebarData.value.all.map((item) => {
      return {
        title: item.sn,
        path: `/sports/${item.si}?nav=${JSON.stringify({ si: item.si, sn: item.sn })}`,
        icon: item.spic,
        useCloudImg: true,
        noneImageReplace: true,
      }
    })
    return [
      ...list,
      {
        title: t('赔率设置'),
        path: '',
        icon: IconMenuLanguage,
        useCloudImg: false,
        isOdds: true,
        children: AllOddsTypes.value,
        tailTitle: t(sportsOddsType.value),
        change: (val: EnumSportsOddsType) => {
          sportsStore.setSportsOddsType(val)
        },
      },
    ]
  }
  return []
})
</script>

<template>
  <div ref="sideMenuRef" class="menu-root hide-scroll-bar">
    <AppLanguageSelector />
    <div class="mt-[12px] mb-[16px] flex gap-[8px] text-[#45260D] font-[590] text-[12px] justify-center">
      <RouterLink :to="isLogin ? '/wallet?tab=deposit' : '/login'" class="deposit-item flex-1 flex rounded-[8px] items-center h-[40px] justify-center gap-[4px]">
        <AfunBaseImage class="h-[32px] w-[32px]" url="/m/afun-h5/png/deposit.png" />
        <span class="text-center">{{ t('存款') }}</span>
      </RouterLink>
      <RouterLink :to="isLogin ? '/wallet?tab=withdraw' : '/login'" class="withdraw-item flex flex-1 rounded-[8px] items-center h-[40px] justify-center gap-[4px]">
        <AfunBaseImage class="h-[32px] w-[32px]" url="/m/afun-h5/png/withdraw.png" />
        <span class="text-center">{{ t('提款') }}</span>
      </RouterLink>
    </div>
    <AppAccordion v-if="!route.path.includes('sports')" :list="[{ title: t('娱乐城'), children: casinoGameList, icon: '', expand: true }]" />
    <AppAccordion v-if="route.path.includes('sports') || route.path.includes('promotions')" :list="[{ title: t('体育'), children: sportGameList, icon: '', expand: true }]" />
    <AppAccordion :list="otherMenus" :collapse="false" />
  </div>
</template>

<style lang="scss" scoped>
.menu-root {
  width: 312px;
  height: 100%;
  border-right: 1px solid #ebebeb;
  background: #fff;
  overflow: hidden scroll;
  font-size: 14px;
  padding: 12px;
}

.deposit-item {
  background: linear-gradient(95deg, #ffecd2 2.01%, #fde3be 98.44%);
}

.withdraw-item {
  background: linear-gradient(95deg, #d1f1fd 2.01%, #bfddfc 98.44%);
}
</style>
