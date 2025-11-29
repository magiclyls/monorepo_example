<script setup lang="ts">
import Menu from './menu.vue'
import MenuItem from './menuItem.vue'
import SubMenu from './subMenu.vue'
import ThmemTabs from './themeTabs.vue'

defineOptions({
  name: 'LayoutSidebar',
})

const casinoItems = [
  {
    icon: 'affiliate',
    path: '/casino',
    title: '赌场',
    exact: true,
  },
  {
    icon: 'affiliate',
    path: '/casino?tab=brand',
    title: 'BC原创',
  },
  {
    icon: 'affiliate',
    path: '/casino?tab=picks',
    title: '首选',
  },
  {
    icon: 'affiliate',
    path: '/casino?tab=slots',
    title: '老虎机',
  },
  {
    icon: 'affiliate',
    path: '/casino?tab=live',
    title: '真人娱乐场',
  },
  {
    icon: 'affiliate',
    path: '/casino?tab=hot',
    title: '热门游戏',
  },
  {
    icon: 'affiliate',
    path: '/casino?tab=feature-buy-in',
    title: '购买回合奖励',
  },
  {
    icon: 'affiliate',
    path: '/casino?tab=new',
    title: '最新发布',
  },
  {
    icon: 'affiliate',
    path: '/bingo',
    title: '宾果',
  },
  {
    icon: 'affiliate',
    path: '/casino?table-game',
    title: '棋牌游戏',
  },
  {
    icon: 'affiliate',
    path: '/casino?tab=game-shows',
    title: '游戏项目',
  },
  {
    icon: 'affiliate',
    path: '/casino?tab=provider',
    title: '供应商',
  },
  {
    icon: 'affiliate',
    path: '/casino?tab=themes',
    title: '主题',
  },
]

const sportsItems = [
  {
    icon: 'affiliate',
    path: '/sports',
    title: '体育',
    exact: true,
  },
  {
    icon: 'affiliate',
    path: '/sports?bt-path=%2Fsoccer-1',
    title: '足球',
  },
  {
    icon: 'affiliate',
    path: '/sports?bt-path=%2Ftennis-5',
    title: '网球',
  },
  {
    icon: 'affiliate',
    path: '/sports?bt-path=%2Fbasketball-2',
    title: '篮球',
  },
  {
    icon: 'affiliate',
    path: '/sports?bt-path=%2Fcricket-21',
    title: '板球',
  },
  {
    icon: 'affiliate',
    path: '/sports?bt-path=%2Ffifa-300',
    title: '国际足球协会',
  },
  {
    icon: 'affiliate',
    path: '/sports?bt-path=%2Famerican-football-16',
    title: '美式橄榄球',
  },
  {
    icon: 'affiliate',
    path: '/sports?bt-path=%2Fice-hockey-4',
    title: '冰上曲棍球',
  },
  {
    icon: 'affiliate',
    path: '/sports?bt-path=%2Fbaseball-3',
    title: '棒球',
  },
  {
    icon: 'affiliate',
    path: '/sports?bt-path=%2Fhandball-6',
    title: '手球',
  },
  {
    icon: 'affiliate',
    path: '/sports?bt-path=%2F赛马',
    title: '赛马',
  },
]

const promotionItems = [
  {
    icon: 'affiliate',
    path: '/promotions/promotion',
    title: '促销',
  },
  {
    icon: 'affiliate',
    path: '/promotions/weekly-raffle',
    title: '每周抽奖',
  },
]
const bonusItems = [
  {
    icon: 'affiliate',
    path: '/vip-detail',
    title: 'VIP俱乐部',
  },
  {
    icon: 'affiliate',
    path: '/bonus-welcome',
    title: '奖金',
  },
  {
    icon: 'affiliate',
    path: '/affiliate-exhibition',
    title: '联盟计划',
  },
  {
    icon: 'affiliate',
    path: '/help/provably-fair',
    title: '合理公平',
  },
]

const kefuItems = {
  icon: 'affiliate',
  title: '线上客服',
}

const langItems = {
  zh: {
    icon: 'affiliate',
    title: '简体中文',
  },
}

const curItems = {
  JPY: {
    icon: 'affiliate',
    title: 'JPY',
  },
}

function openKefu() {
  alert('我是对话')
}
</script>

<template>
  <div class="sidebar">
    <div class="w-full absolute left-0 top-0 h-full  overflow-y-auto transition-all duration-200" style="scrollbar-width: none; -ms-overflow-style: none;">
    <Menu>
      <SubMenu :list="casinoItems" />
      <SubMenu :list="sportsItems" />
      <SubMenu :list="promotionItems" />
      <div class="bg-[#323738] relative w-full rounded-lg my-3 px-0 pb-2 pt-1 sm:my-2 sm:py-1">
        <MenuItem v-for="item in bonusItems" v-bind="item" :key="item.path" />
      </div>
      <MenuItem v-bind="kefuItems" @on-click="openKefu" />
      <MenuItem v-bind="langItems.zh" sub-menu @on-click="openKefu" />
      <MenuItem v-bind="curItems.JPY" sub-menu @on-click="openKefu" />
      <div class="download relative flex cursor-pointer flex-col rounded-lg bg-layer4 px-4 mt-3 gap-y-1 py-2" style="background-image: radial-gradient(168.34% 80.85% at 88.3% 100%, rgba(35, 238, 136, 0.15) 0%, rgba(35, 238, 136, 0) 100%);">
        <h3 class="text-base font-extrabold text-white">
          应用
        </h3><p class="text-sm text-[#b3bec1] max-w-52 text-wrap">
         透过独家功能解锁特点
       </p><img class="absolute top-0 right-3 w-18" src="https://87.com/assets/pwa-oG16MQOp.png">
      </div>
      <ThmemTabs class="thmem-tabs" />
  </Menu>
  </div>
  </div>
</template>

<style lang="scss">
.sidebar {
  position: fixed;
  width: 15rem;
  left: 0px;
  top: 3.75rem;
  bottom: 0px;
  z-index: 100;
  transition: 0.2s;
  background-color: #2a2d2e;
}
.side-fold .sidebar {
  width: 4.5rem;
  .download {
    display: none;
  }
  .thmem-tabs {
    display: none;
  }
}
</style>
