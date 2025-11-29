<script setup lang='ts'>
import type { MenuItem } from '@tg/types'
import { IconChessAffiliate } from '@tg/icons'
import { useAffiliate, useAppStore, useCasinoStore, useDownloadStore } from '@tg/stores'
import { useBrowserLocation, useClipboard } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useApiMenuData } from '~/hooks/useApiMenuData'
import { useLeftSidebar } from '~/hooks/useLeftSidebar'
import { useSportsStore } from '~/stores/sports'
import { Message } from '~/utils'
import AppAccordionMenu from './AppAccordionMenu.vue'
import AppStakeMenuItem from './AppStakeMenuItem.vue'

interface Props {
  currentType: string
  isSwitching?: boolean
}
defineOptions({
  name: 'AppSidebarBig',
})
const props = defineProps<Props>()

const emit = defineEmits(['reset'])

const {
  casinoMenu,
  casinoGameList,
  staticMenu1,
  staticMenu2,
  menuItemClick,
} = useApiMenuData()

const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const { isSidebarHasProvider, casinoGameProvider } = storeToRefs(useCasinoStore())
const { beforePage, selectedCasinoTab } = useLeftSidebar()
const sportStore = useSportsStore()
const location = useBrowserLocation()
const { link_url } = storeToRefs(useAffiliate())
const {
  sportOddType,
  sportsMenu,
  sportHotGames,
  sportGameList,
  isSportsLoginSusses,
} = storeToRefs(sportStore)

const innerRef = ref()
const timeStamp = ref(0)
const router = useRouter()
const { copy } = useClipboard()
const downloadStore = useDownloadStore()

const isCasino = computed(() => beforePage.value === ('/'))
const isSports = computed(() => beforePage.value.includes('sports'))
const isGameTypeCasino = computed(() => props.currentType === '1')
const isGameTypeSports = computed(() => props.currentType === '2')
const qrUrl = computed(() => `${location.value.origin}${link_url.value ?? ''}`)

function handleClickItem(item: MenuItem) {
  if (item.domId === 'game') {
    emit('reset')
  }

  if (item.domId === 'game' && selectedCasinoTab.value === 'game') {
    selectedCasinoTab.value = ''
  }
  else {
    selectedCasinoTab.value = item.domId! as 'game' | 'favorite' | 'recent'
  }
  if ((item.token && !isLogin.value) || (item.sptToken && !isSportsLoginSusses.value)) {
    router.push('/login')
    return
  }

  menuItemClick(item)
}
function closeMenu(t: any) {
  timeStamp.value = t
}

function handleAffiliateClick() {
  menuItemClick({
    title: t('affiliate'),
    path: '/affiliate',
    icon: IconChessAffiliate,
    domId: '',
  })
}

function handleCopy() {
  if (!isLogin.value) {
    router.push('/login')
    return
  }
  copy(qrUrl.value || '').then(() => {
    Message.success(t('成功复制'))
  })
}
</script>

<template>
  <div class="big-warp">
    <div
      ref="innerRef"
      class="scroll-y scroll-contain inner-content is-full-screen"
      data-ismobile
      :class="{ 'game-padding': isCasino || isSports }"
      @touchstart.stop @touchmove.stop
    >
      <div v-if="!isSports">
        <div class="affiliate" @click="handleAffiliateClick">
          <div class="t1">
            {{ t('邀请并赚钱') }}
          </div>
          <div class="t2">
            {{ t('邀请好友赚取佣金') }}
          </div>
          <button class="btn" @click.stop="handleCopy">
            {{ t('复制链接') }}
          </button>
        </div>
        <div class="tabs-menu">
          <div
            v-for="item, i in casinoMenu" :key="i"
            class="tabs-content"
            :class="{ active: selectedCasinoTab === item.domId && isGameTypeCasino }"
            @click="() => handleClickItem(item)"
          >
            <component
              :is="item.icon" class="m-[4px] text-[16px]" :style="{
                color: selectedCasinoTab === item.domId ? '#fff' : '#B1BAD3',
              }"
            />
            <span>{{ item.title }}</span>
          </div>
        </div>
      </div>
      <!-- Casino -->
      <template v-if="isGameTypeCasino">
        <div v-if="selectedCasinoTab === 'game'" class="menu-box">
          <div
            v-for="item, i in casinoGameList"
            :key="i"
            @click="() => handleClickItem(item)"
          >
            <AppStakeMenuItem :menu-item="item" />
          </div>
        </div>
        <div v-if="isSidebarHasProvider" class="menu-box">
          <div
            v-for="item, i in casinoGameProvider"
            :key="i"
            @click="() => handleClickItem(item)"
          >
            <AppStakeMenuItem :menu-item="item" />
          </div>
        </div>
      </template>

      <!-- Sports -->
      <template v-if="isGameTypeSports">
        <div class="menu-box">
          <div
            v-for="item, i in sportsMenu"
            :key="i"
            @click="() => handleClickItem(item)"
          >
            <AppStakeMenuItem :menu-item="item" />
          </div>
        </div>
        <div class="menu-box">
          <div class="menu text-[14px]">
            {{ t('顶级体育项目') }}
          </div>
          <div class="content-line" />
          <div v-for="item, i in sportHotGames" :key="i">
            <AppAccordionMenu
              :menu-item="item"
              :time-stamp="timeStamp"
              @close-other-menu="closeMenu"
            />
          </div>
        </div>
        <div class="menu-box">
          <div v-for="item, i in sportGameList" :key="i">
            <AppAccordionMenu
              :menu-item="item"
              :time-stamp="timeStamp"
              @close-other-menu="closeMenu"
            />
          </div>
        </div>
        <div class="menu-box">
          <div v-for="item, i in sportOddType" :key="i">
            <AppAccordionMenu
              :menu-item="item"
              :time-stamp="timeStamp"
              @close-other-menu="closeMenu"
            />
          </div>
        </div>
      </template>

      <!-- 个人中心 -->
      <div class="menu-box">
        <div v-for="item, i in staticMenu1" :key="i">
          <AppAccordionMenu
            :menu-item="item"
            :time-stamp="timeStamp"
            @close-other-menu="closeMenu"
          />
        </div>
      </div>

      <div class="menu-box">
        <div class="app-download" @click="downloadStore.downLoad(1)">
          <div class="title">
            {{ t('下载APP') }}
          </div>
          <div class="sub-title">
            {{ t('领取专属奖励') }}
          </div>
        </div>
        <div v-for="item, i in staticMenu2" :key="i">
          <AppAccordionMenu
            :menu-item="item"
            :time-stamp="timeStamp"
            @close-other-menu="closeMenu"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.big-warp {
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  padding: 0;
  color: #fff;
  font-size: 14px;
  height: 100%;
}

.inner-content {
  padding: 0;
  display: flex;
  flex-direction: column;
  > * {
    margin-bottom: 16px;
  }
  > :last-child {
    margin-bottom: 0;
  }

  .menu-box {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    max-width: 100%;
    background-color: #1a2c38;
    border-radius: 4px;
    overflow: hidden;

    .menu {
      display: flex;
      align-items: center;
      height: 45px;
      padding: 0 16px;
      font-weight: 600;

      span {
        padding-left: 6px;
      }
    }

    .content-line {
      background: var(--tg-secondary-main);
      height: 2px;
      width: 100%;
    }
  }
  .tabs-menu {
    display: flex;
    flex-direction: row;
    gap: 8px;
    background-color: unset;
    & > div {
      flex: 1;
      height: 60px;
      display: flex;
      border-radius: 4px;
      background: #1a2c38;
      justify-content: center;
      align-items: center;
      gap: 2px;
      flex-direction: column;
      font-weight: 500;
      &.active {
        color: #fff;
        background-color: #2f4553;
      }
    }
  }

  .affiliate {
    width: 100%;
    height: 90px;
    border-radius: 8px;
    background:
      url('/afun-h5/png/menu-affiliate-icon.png'),
      linear-gradient(90deg, rgba(36, 238, 137, 0.35) 0%, rgba(36, 238, 137, 0.02) 100%);
    background-size:
      90px auto,
      100% 100%;
    background-position:
      100% 100%,
      0 0;
    background-repeat: no-repeat;
    padding: 5px 90px 9px 17px;
    margin-bottom: 16px;
    cursor: pointer;
    .t1 {
      font-size: 14px;
      font-weight: 400;
      line-height: 24px;
      white-space: nowrap;
    }
    .t2 {
      font-size: 14px;
      font-weight: 800;
      line-height: 24px;
      white-space: nowrap;
    }
    .btn {
      height: 22px;
      padding: 0 17px;
      border-radius: 99px;
      border: 1px solid #24ee89;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      margin-top: 6px;
      font-size: 12px;
      background-color: #1a2c38;
    }
  }

  .app-download {
    border-radius: 8px;
    background:
      url('/afun-h5/png/menu-download-icon.png'),
      linear-gradient(90deg, rgba(36, 238, 137, 0.35) 0%, rgba(36, 238, 137, 0.02) 100%);
    background-size:
      83px auto,
      100% 100%;
    background-position:
      95% 95%,
      0 0;
    background-repeat: no-repeat;
    padding: 17px 80px 20px 10px;
    display: flex;
    flex-direction: column;
    height: 80px;
    margin: 8px;
    margin-bottom: 0;
    cursor: pointer;
    .title {
      margin-bottom: 8px;
      font-size: 16px;
      font-weight: 700;
      line-height: 20px;
    }
    .sub-title {
      font-size: 14px;
      font-weight: 600;
      line-height: normal;
    }
  }
}

.is-full-screen {
  padding-top: 0;
}
</style>
