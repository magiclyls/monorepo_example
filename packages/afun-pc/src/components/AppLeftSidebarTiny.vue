<script setup lang='ts' name="app-left-sidebar-tiny">
import { IconUniMenu } from '@tg/icons'

// 有右侧聊天投注的中间区域：672 1124
// 正常时候的中间区域：638 1160
// 右侧：992 （320/370）
// 左侧：消失 / 768 - 1200 fixed（占位 60）/ 正常占位
interface Props {
  isSwitching?: boolean
  switchTo?: 'big' | 'small' | ''
}
defineOptions({
  name: 'AppLeftSidebarTiny',
})
defineProps<Props>()

const { t } = useI18n()
const { triggerLeftSidebar, navButtons } = useLeftSidebar()
const menuStore = useMenuStore()
const router = useLocalRouter()
const route = useRoute()

const routeMap = ref({
  casino: '/casino',
  sports: `/sports/${getSportsPlatId()}`,
  affiliate: '/affiliate/invitation-link'
})
function push(title: keyof typeof routeMap.value) {
  Local.remove(STORAGE_MENU_EXPAND_DOMID)
  menuStore.setSideBigActiveMenu('')
  router.push(routeMap.value[title])
}
</script>

<template>
  <!-- 头部菜单或搜索栏 -->
  <div class="tg-app-left-sidebar-tiny">
    <div class="sidebar-tiny-top">
      <div class="header is-small">
        <Transition name="menu-fade">
          <template v-if="!isSwitching">
            <div class="button center">
              <BaseButton
                style="--tg-base-button-font-size:16px;"
                type="text" @click="triggerLeftSidebar"
              >
                <IconUniMenu />
              </BaseButton>
            </div>
          </template>
        </Transition>
        <div v-if="!isSwitching" class="game-type">
          <div
            v-for="n in [{title: 'affiliate'}, ...navButtons]" :key="n.title"
            :class="[n.title, { active: route.name?.toString().includes(n.title) }]"
            @click="push(n.title)"
          >
            <span>{{ t(n.title) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="content hide-scrollbar" :class="{ 'scroll-y': !isSwitching }">
      <AppSidebarSmall v-show="!isSwitching" :is-switching="isSwitching" />
    </div>
  </div>
</template>

<style lang='scss' scoped>
.tg-app-left-sidebar-tiny {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  height: 100%;
}
// .sidebar-tiny-top {
//   height: var(--tg-sidebar-top-height-lg);
// }
.content {
  flex: 1;
}

.search {
  margin: var(--tg-spacing-16);
  width: auto;
  font-size: var(--tg-font-size-default);
}

.tips {
  display: flex;
  align-items: center;

  span {
    margin-right: var(--tg-spacing-8);
  }

  &:active {
    transform: scale(0.96);
  }
}

.popper-option {
  cursor: pointer;
  padding: var(--tg-spacing-button-padding-vertical-xs) var(--tg-spacing-button-padding-horizontal-xs);

  &:hover {
    // background-color: var(--tg-text-lightgrey);
  }
}

.scrollable-content {
  display: flex;
  flex-direction: column;
  gap: var(--tg-spacing-button-padding-vertical-xs);
  scrollbar-gutter: stable;
  padding: 0 2px 0 var(--tg-spacing-button-padding-vertical-xs);
}

.header {
  display: flex;
  padding: 0 var(--tg-spacing-16) 0 0;
  touch-action: none;
  // box-shadow: var(--tg-box-shadow-lg);
  box-shadow: var(--tg-header-shadow);

  .button {
    font-size: var(--tg-font-size-base);
    min-width: 60px;
    height: 60px;
  }

  .game-type {
    display: flex;
    align-items: center;
    width: 100%;
    color: var(--tg-text-white);
    font-size: var(--tg-font-size-default);
    > *:not(:first-child) {
      margin-left: var(--tg-spacing-8);
    }

    .casino,
    .sports, .affiliate {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      background-size: cover;
      background-repeat: no-repeat;
      min-height: var(--tg-spacing-36);
      cursor: pointer;
      border-radius: var(--tg-radius-default);
      

      &:active {
        span {
          transform: scale(0.96);
        }
      }
    }

    .sports {
      @include getBackgroundImage('/left-side-bar/sports_bg_small');

      &:hover {
        @include getBackgroundImage('/left-side-bar/sports_bg_active_small');
      }
    }

    .casino{
      @include getBackgroundImage('/left-side-bar/casino_bg_small');

      &:hover {
        @include getBackgroundImage('/left-side-bar/casino_bg_active_small');
      }
    }

    .affiliate {
      background-image: url('/afun-pc/img/menu/menu-affiliate-icon.png'), linear-gradient(90deg, rgba(36, 238, 137, 0.35) 0%, rgba(36, 238, 137, 0.02) 100%);
      background-size: 40px auto, 100% 100%;
      background-position: 0 5px, 0 0;
    }

    .casino.active {
      @include getBackgroundImage('/left-side-bar/casino_bg_active_small');
    }

    .sports.active {
      @include getBackgroundImage('/left-side-bar/sports_bg_active_small');
    }
  }
}

.is-small {
  flex-direction: column;
  padding: 0 0 var(--tg-spacing-12);
  box-shadow: none;

  .button {
    // box-shadow: var(--tg-box-shadow-lg);
    box-shadow: var(--tg-header-shadow);
  }

  .game-type {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: var(--tg-spacing-16) 0 0;
    > *:not(:first-child) {
      margin-left: 0;
      margin-top: var(--tg-spacing-12);
    }
    span {
      display: none;
    }

    .casino,
    .sports, .affiliate {
      width: 44px;
      height: 44px;
      flex: unset;
    }
  }
}
</style>
