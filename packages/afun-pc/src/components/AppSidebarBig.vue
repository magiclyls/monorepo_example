<script setup lang='ts'>
import { IconChessAffiliate } from '@tg/icons';
import { type MenuItem } from '~/composables/useApiMenuData'

defineOptions({
  name: 'AppSidebarBig',
})

const props = defineProps<{
  currentType: string
}>()

const {
  casinoMenu,
  casinoGameList,
  staticMenu1,
  staticMenu2,
  menuItemClick,
} = useApiMenuData()

const { t } = useI18n()
const route = useRoute()
const { isLogin } = storeToRefs(useAppStore())
const { isSidebarHasProvider, casinoGameProvider } = storeToRefs(useCasinoStore())
const { isSportsLoginSusses } = storeToRefs(useSportsStore())
const { selectedCasinoTab } = useLeftSidebar()
const {
  sportOddType,
  sportsMenu,
  sportHotGames,
  sportGameList,
} = storeToRefs(useSportsStore())

const location = useBrowserLocation()
const { link_url } = storeToRefs(useAffiliate())
const { runAsyncAffiliateCfg } = useAffiliate()

const innerRef = ref()
const timeStamp = ref(0)
const { openNotify } = useNotify()
const { openLoginDialog } = useLoginDialog()
const isCasino = computed(() => route.fullPath?.toString().includes('casino'))
const isSports = computed(() => route.fullPath?.toString().includes('sports'))

const isCasinoListVisible = computed(() => {
  return selectedCasinoTab.value === 'game' && casinoGameList.value.length > 0 && isCasino.value
})

// 2. 控制 staticMenu1 / staticMenu2 动画的 flag
const casinoMenuAnimating = ref(false)

// 3. 监听 casinoGameList 显示/隐藏，触发一次动画
watch(
  isCasinoListVisible,
  () => {
    // 先关再开，强行刷新 animation
    casinoMenuAnimating.value = false
    // 下一帧再打开，确保动画 class 被重新应用
    requestAnimationFrame(() => {
      casinoMenuAnimating.value = true
    })
  },
  { immediate: true }
)


function handleClickItem(item: MenuItem) {
  if ((item.token && !isLogin.value) || (item.sptToken && !isSportsLoginSusses.value)){
    openLoginDialog()
    return
  }
  if(selectedCasinoTab.value === 'game' && item.domId === 'game'){
    selectedCasinoTab.value = ''
  }else{
    selectedCasinoTab.value = item.domId as 'game' | 'recent' | 'favorite'
  }
  menuItemClick(item)
}

function handleAffiliateClick() {
  menuItemClick({
    title: t('affiliate'),
    path: '/affiliate/invitation-link',
    list: [],
    icon: IconChessAffiliate,
    domId: '',
  })
}

function handleDownloadClick() {
  menuItemClick({
    title: t('download_app'),
    path: '/download-plat',
    list: [],
    icon: IconChessAffiliate,
    domId: '',
  })
}
function closeMenu(t: any) {
  timeStamp.value = t
}

async function copy(){
  if(!isLogin.value){
    openLoginDialog()
    return
  }

  setTimeout(() => {
    const copyText = `${location.value.origin}${link_url.value}`
    application.copy(copyText)
    openNotify({
      type:'success',
      message:t('copy_success'),
    })
  }, 500)
}

onMounted(() => {
  const tempId = Local.get(STORAGE_MENU_EXPAND_DOMID)?.value ?? ''
  if (tempId) {
    const t = setTimeout(() => {
      innerRef.value.scrollTo({
        top: document.getElementById(tempId as string)!.offsetTop - 60,
        behavior: 'smooth',
      })
      clearTimeout(t)
    }, 500)
  }
})
onBeforeUnmount(() => {
  Local.remove(STORAGE_MENU_EXPAND_DOMID)
})
</script>

<template>
  <div class="big-warp">
    <div
      ref="innerRef"
      class="scroll-y scroll-contain inner-content hide-scrollbar"
      :class="{ 'game-padding': isCasino || isSports }"
      @touchstart.stop @touchmove.stop
    >
      <div v-if="!isSports">
        <div class="affiliate" @click="handleAffiliateClick">
          <div class="t1">{{ t('share_earn') }}</div>
          <div class="t2">{{t('share_earn_detail')}}</div>
          <div class="bars-bg"></div>
          <button class="btn" @click.stop="copy">{{t('copy_link')}}</button>
        </div>
        <div class="tabs-menu">
          <button class="tab-item" v-for="item, i in casinoMenu"
          :class="{'active': selectedCasinoTab === item.domId}"
          :key="i"
          @click="() => handleClickItem(item)">
            <component :is="item.icon" style="font-size: 18px;"
            class="icon"
            />
            <span>{{ item.title }}</span>
          </button>
        </div>
      </div>
      <!-- Casino -->

      <div  :class="{ 'slide-fade-enter-active': casinoMenuAnimating && !isCasinoListVisible, 'slide-enter-active': casinoMenuAnimating && isCasinoListVisible }">
        <div class="menu-box" v-if="isCasinoListVisible">
          <div
            v-for="item, i in casinoGameList"
            :key="i"
            @click="() => handleClickItem(item)"
          >
            <AppMenuItem :menu-item="item"/>
          </div>
        </div>
        <template v-if="isCasino">
          <div v-if="isSidebarHasProvider" class="menu-box" >
            <div
              v-for="item, i in casinoGameProvider"
              :key="i"
              @click="() => handleClickItem(item)"
            >
              <AppMenuItem :menu-item="item" />
            </div>
          </div>
        </template>

        <!-- Sports -->
        <template v-if="isSports">
          <div class="menu-box">
            <div
              v-for="item, i in sportsMenu"
              :key="i"
              @click="() => handleClickItem(item)"
            >
              <AppMenuItem :menu-item="item" />
            </div>
          </div>
          <div class="menu-box">
            <div class="menu">
              {{ t('top_sports_events') }}
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
          <div v-for="(item, i) in staticMenu1" :key="i">
            <AppAccordionMenu
              :menu-item="item"
              :time-stamp="timeStamp"
              @close-other-menu="closeMenu"
            />
          </div>
        </div>

        <div class="menu-box">
          <div class="app-download" @click="handleDownloadClick">
            <div class="title">{{ t('download_app') }}</div>
            <div class="sub-title">{{ t('download_get_bonus') }}</div>
          </div>
          <div v-for="(item, i) in staticMenu2" :key="i">
            <AppAccordionMenu
              :menu-item="item"
              :time-stamp="timeStamp"
              @close-other-menu="closeMenu"
            />
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<style lang='scss' scoped>

.slide-fade-enter-active {
  interpolate-size: allow-keywords;
  overflow: hidden;
  animation: slide-fade-in 0.2s ease-in-out;
}

.slide-enter-active {
  interpolate-size: allow-keywords;
  overflow: hidden;
  animation: slide-fade-in 0.4s ease-in-out;
}

@keyframes slide-fade-in {
  0% {
    height: 0;
  }

  100% {
    height: auto;
  }
}


@keyframes slide-in {
  0% {
    height: 0;
  }

  100% {
    height: auto;
  }
}

.big-warp {
  display: flex;
  // overflow: hidden;
  flex-direction: column;
  align-content: flex-start;
  padding: 0;
  color: var(--tg-text-white);
  font-size: var(--tg-font-size-default);
  height: 100%;
  @include webTheme('green') {
    --tg-primary-main:#076237;
    color: var(--tg-text-green-sub);
  }
}

.inner-content {
  padding: var(--tg-spacing-16);
  flex-direction: column;
  // gap: var(--tg-spacing-8);
  > * {
    margin-bottom: var(--tg-spacing-12);
  }
  >:last-child {
    margin-bottom: 0;
  }

  .menu-box {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    max-width: 100%;
    margin-bottom: var(--tg-spacing-12);
    background-color: var(--tg-primary-main);
    border-radius: var(--tg-radius-default);
    overflow: hidden;

    .menu {
      display: flex;
      align-items: center;
      height: 45px;
      padding: 0 16px;
      // cursor: pointer;
      font-weight: var(--tg-font-weight-semibold);
      @include webTheme('green') {
        color:white;
      }

      // &:hover, &.active {
      //   background-color: var(--tg-secondary-main);
      //   --tg-icon-color: var(--tg-text-white);
      // }

      span {
        padding-left: 6px;
      }
    }

    .content-line {
      background: var(--tg-secondary-main);
      height: 1px;
      width: 100%;
    }
  }
  .tabs-menu{
    flex-direction: row;
    display: flex;
    gap: 9px;
    .tab-item{
      width: 70px;
      height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 8px;
      background: #1A2C38;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.3s;
      span{
        line-height: 14px;
      }
      .icon{
        margin: 2px;
      }
      &.active{
        background: #2F4553;
        .icon{
          color:#fff
        }
      }
      &.disabled{
        color: #fff;
        cursor: not-allowed;
        .icon{
          color:#b1bad3
        }
      }
      &:hover{
        background: #2F4553;
        color: #fff;
        .icon{
          color: #fff;
        }
      }
    }
  }
  .affiliate{
    width: 100%;
    border-radius: 8px;
    background: url('/afun-pc/img/menu/menu-affiliate-icon.png'), linear-gradient(90deg, rgba(36, 238, 137, 0.35) 0%, rgba(36, 238, 137, 0.02) 100%);
    background-size: 100px auto, 100% 100%;
    background-position: 100% 100%, 0 0;
    background-repeat: no-repeat;
    padding: 10px 20px 14px 17px;
    margin-bottom: 12px;
    cursor: pointer;
    .t1{
      font-size: 16px;
      font-weight: 400;
      line-height: 20px;
      margin-bottom: 2px;
      line-height: 24px;
    }
    .t2{
      font-size: 16px;
      font-weight: 800;
      line-height: 24px;
    }
    .bars-bg{
      width: 75px;
      margin-top: 12px;
      height: 3px; /* 只是承载高度，用不到背景尺寸以外的区域 */
      background:
        linear-gradient(#fff,#fff) no-repeat,
        linear-gradient(#fff,#fff) no-repeat,
        linear-gradient(#fff,#fff) no-repeat,
        linear-gradient(#fff,#fff) no-repeat;
      /* 每条白块的大小（宽 高） */
      background-size:
        34px 3px, 15px 3px, 9px 3px, 5px 3px;
      /* 每条白块的位置（相对容器左上角） */
      background-position:
        0 0,  38px 0,  57px 0,  70px 0;
    }
    .btn{
      height: 30px;
      padding: 0 17px;
      border-radius: 99px;
      border: 1px solid #24EE89;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      margin-top: 25px;
    }
  }

  .app-download{
    border-radius: 8px;
    background: url('/afun-pc/img/menu/menu-download-icon.png'), linear-gradient(90deg, rgba(36, 238, 137, 0.35) 0%, rgba(36, 238, 137, 0.02) 100%);
    background-size: 83px auto, 100% 100%;
    background-position: 123px 4px, 0 0;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    height: 80px;
    margin: 8px;
    padding: 13px 80px 16px 10px;
    cursor: pointer;
    .title{
      margin-bottom: 7px;
      font-size: 12px;
      font-weight: 700;
      line-height: 20px;
    }
    .sub-title{
      font-size: 12px;
      font-weight: 600;
      line-height: normal;
    }
  }
}

.is-full-screen {
  padding-top: 0;
}
</style>
