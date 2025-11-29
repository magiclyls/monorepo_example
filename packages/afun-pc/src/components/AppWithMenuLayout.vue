<script lang="ts" setup>
import {
  IconUniClose,
  IconChessAffiliate,
  IconUniPolicies,
  IconUniScales,
  IconUniChecklist,
  IconSptSecure,
  IconUniSet,
  IconTabbarBet,
  IconUniArrowDown,
  IconUniArrowLeft
} from '@tg/icons'

interface Props {
  menuData: any[]
  tab: string
  // 是返水中心
  isRebateCenter?: boolean
  // 是vip中心
  isVipCenter?: boolean
}

defineOptions({
  name: 'AppWithMenuLayout',
})
const props = defineProps<Props>()

const router = useLocalRouter()
const route = useRoute()

const { appContentWidth, isMobile } = storeToRefs(useWindowStore())
const { isLogin, theme, isVipUpgradeBonusOpen, isAllVipBonusClosed, isMemberHaveVipBonusRecord } = storeToRefs(useAppStore())
const { bool: isPopShow, setTrue: setPTrue, setFalse: setPFalse } = useBoolean(false)

const path = computed(() => {
  return `/${route.path.split('/').slice(2).join('/')}`
})

const icon = computed<Component>(() => {
  if (route.meta.withMenuIcon === 'IconChessAffiliate')
    return IconChessAffiliate
  else if (route.meta.withMenuIcon === 'IconUniPolicies')
    return IconUniPolicies
  else if (route.meta.withMenuIcon === 'IconUniScales')
    return IconUniScales
  else if (route.meta.withMenuIcon === 'IconUniChecklist')
    return IconUniChecklist
  else if (route.meta.withMenuIcon === 'IconSptSecure')
    return IconSptSecure
  else if (route.meta.withMenuIcon === 'IconUniSet')
    return IconUniSet
  else if (route.meta.withMenuIcon === 'IconTabbarBet')
    return IconTabbarBet
  return IconUniSet
})
const withMenuMobileType = computed(() => route.meta.withMenuMobileType)
const noBg = computed(() => path.value.includes('/vip') || path.value.includes('/rebate-center')
  || (isMobile.value ? path.value.includes('/affiliate') : false))
const getGapBig = computed(() => {
  if (props.isVipCenter && (props.tab === 'vipBonus' || props.tab === 'daySalary') && isMobile.value)
    return ''

  return 'gap-big'
})

/** 展示VIP info bar的路径 */
const isShowVipInfoBar = computed(() => {
  if (isLogin.value) {
    if (props.isVipCenter)
      return true
    return isMobile.value ? props.tab === 'rebate' : true
  }

  return false
})
/** 某些情况不显示标题 */
const isShowTitle = computed(() => {
  if (!isLogin.value)
    return true
  else if (['green', 'white'].includes(theme.value))
    return false
  else if (isMobile.value && ['new-default'].includes(theme.value))
    return false
  return true
})
// VIP页面H5所有奖金关闭、晋级奖金关闭、没有领取记录的时候隐藏tab
const isVipPageAndAllBonusCloseAndNoRecord = computed(() => {
  return props.isVipCenter && !isVipUpgradeBonusOpen.value && isAllVipBonusClosed.value && !isMemberHaveVipBonusRecord.value
})

const activeMenu = ref(props.menuData.filter((m: any) => m.value === props.tab)[0])
const curMenuTab = ref(activeMenu.value?.value)

function togglePop() {
  if (isPopShow.value)
    setPFalse()
  else
    setPTrue()
}
function goBack() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.CASINO_HOME)
  else
    router.push('/casino')
}
function goPage(item: any, hide: any) {
  if (item.path) {
    activeMenu.value = item
    if (item.isR)
      router.replace(item.path)
    else
      router.push(item.path)
  }
  hide && hide()
  setPFalse()
}

function backIfLocal() {
  const backurl = Local.get(STORAGE_BACK_URL)?.value as any
  if (backurl)
    return router.replace(backurl)
  router.back()
}

watch(() => props.tab, (a) => {
  activeMenu.value = props.menuData.filter((m: any) => m.value === a)[0]
  curMenuTab.value = a
})
</script>

<template>
  <section class="with-menu-container mobile-menu-container">
    <div class="layout-spacing" :class="{ 'more-than-800': appContentWidth > 800 }">
      <div>
        <div class="stack y-center direction-vertical x-stretch padding-none"
          :class="[appContentWidth > 800 ? 'gap-larger' : 'gap-big']">
          <div class="wrap-flex" :class="{ 'pt-[24px]': isShowTitle }">
            <div class="stack y-center padding-none top direction-horizontal" :class="[
              appContentWidth > 800
                ? 'x-space-between stretch gap-medium'
                : 'x-space-between stretch gap-medium',
            ]">
              <div v-if="isShowTitle" class="stack y-center direction-horizontal title x-flex-start">
                <component :is="icon" />
                <span>
                  {{
                    route.meta.withMenuTitle
                      ? $t(route.meta.withMenuTitle) : ''
                  }}
                </span>
              </div>
              <div v-if="!isMobile" class="close" @click="goBack">
                <BaseButton type="text" size="none">
                  <IconUniClose />
                </BaseButton>
              </div>
            </div>
          </div>
          <template v-if="path === '/transactions' || path === '/settings'">
            <BaseMenu class="settran user-setting-menu" :data="menuData" />
          </template>
          <template v-else>
            <AppVipInfoBar2 v-if="isShowVipInfoBar" :vip-tab="tab" />
            <div class="stack padding-none direction-horizontal content-outer" :class="[
              appContentWidth > 800
                ? 'direction-horizontal x-flex-start y-flex-start gap-larger'
                : 'direction-vertical x-stretch y-center', getGapBig,
              { 'only-one-column': menuData.length <= 1 },
            ]">
              <!-- H5的返水中心页面不需要展示路由tab -->
              <div v-if="!(isMobile && isRebateCenter) && menuData.length > 1" class="left">
                <template v-if="appContentWidth > 800">
                  <AppRebateBaseMenu :active-tab="tab" :data="menuData" />
                </template>
                <template v-else>
                  <div v-if="withMenuMobileType === 'tabs'" class="agent-plan-tab menu-tabs"
                    :class="{ 'is-vip': isVipCenter }">
                    <BaseTab v-model="curMenuTab" :center="false" :list="menuData" :full="isVipCenter" />
                  </div>
                  <div v-else class="stack y-center x-flex-start gap-small menu-btn" :class="[appContentWidth > 800
                    ? 'padding-none direction-horizontal'
                    : 'padding-none direction-horizontal']">
                    <BaseButton class="setting-menu-button" size="md" @click="backIfLocal">
                      <IconUniArrowLeft class="arrow-left" />
                    </BaseButton>
                    <VDropdown :distance="10">
                      <BaseButton size="sm" class="setting-down" @click="togglePop">
                        <div class="btn-txt">
                          <span>{{ activeMenu.title }}</span>
                          <div class="icon" :class="{ up: isPopShow }">
                            <IconUniArrowDown />
                          </div>
                        </div>
                      </BaseButton>
                      <template #popper="{ hide }">
                        <ul class="select-pop-menu pop-menu">
                          <template v-for="mi in menuData" :key="mi.path">
                            <li :class="{ active: activeMenu.path === mi.path }" @click="goPage(mi, hide)">
                              {{ mi.title }}
                            </li>
                          </template>
                        </ul>
                      </template>
                    </VDropdown>
                    <div id="tgWithMenuRight" class="drop-down-record" />
                  </div>
                </template>
              </div>
              <div class="right" :class="{ 'is-vip': isVipCenter, isMobile }">
                <div class="user-setting-container content-container" :class="{
                  'is-vip': isVipCenter,
                  'no-bg': noBg,
                  'is-vip-receive': isVipCenter && tab === 'receive',
                  'is-vip-rebate': isRebateCenter,
                  'is-affiliate-bonus': path.includes('/affiliate/'),
                }">
                  <slot />
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.settran {
  --tg-base-menu-item-active-bg: transparent;
  --tg-base-menu-item-hover-active-bg: transparent;
}

.menu-tabs {
  display: flex;

  &.is-vip {
    @include webTheme('white') {
      margin-bottom: 6px;
    }

    @include webTheme('green') {
      margin-bottom: 6px;
    }
  }

  >div {
    flex: 1;
    width: 0;
  }

  @include webTheme('white') {
    --tg-tab-style-color: #111111;
    --tg-tab-style-wrap-bg-color: #F5F5F5;
  }
}

.pop-menu {
  min-width: 66px;
  padding: var(--tg-spacing-4) 0;
  font-size: var(--tg-font-size-default);
  color: var(--tg-secondary-main);
  font-weight: var(--tg-font-weight-semibold);

  li {
    cursor: pointer;
    padding: var(--tg-spacing-button-padding-vertical-xs) var(--tg-spacing-button-padding-horizontal-xs);
    color: var(--tg-popper-color-default);

    &.active {
      color: var(--tg-text-blue);

      @include webTheme('green') {
        color: #5ECEA6;
      }

      @include webTheme('white') {
        color: #F2CA5C;
      }
    }

    &:hover {
      background-color: var(--tg-text-grey-light);
      color: var(--tg-primary-main);

      @include webTheme('white') {
        background-color: #F2CA5C;
        color: #111111;
      }
    }
  }
}

.layout-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #{rgba($color: var(--tg-color-black-rgb), $alpha: 0.1)};
  z-index: var(--tg-z-index-10);
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap-flex {
  width: 100%;
  display: grid;
  place-items: flex-start;
}

.btn-txt {
  display: inline-flex;
  align-items: center;
  position: relative;
  gap: var(--tg-spacing-8);
  font-size: var(--tg-font-size-default);

  @include webTheme('white') {
    color: #111111;
  }

  .icon {
    // transition: all 200ms ease;
    display: flex;
    align-items: center;
    justify-content: center;

    @include webTheme('green') {
      --tg-icon-color: var(--tg-popper-hover-color-default);
    }

  }

  .up {
    transform: rotate(180deg);
  }
}

.with-menu-container {
  .layout-spacing {
    padding-bottom: var(--tg-spacing-32);

    .top {
      color: var(--tg-text-white);

      .title {
        font-size: var(--tg-font-size-md);
        font-weight: var(--tg-font-weight-semibold);
        line-height: 1.5;
        padding: 0;
        gap: var(--tg-spacing-8);

        @include webTheme('green') {
          --tg-icon-color: var(--tg-secondary-light);
        }
      }

      .close {
        cursor: pointer;
        display: flex;
        align-items: center;

        .app-svg-icon {
          font-size: var(--tg-font-size-default);
        }
      }
    }

    &.more-than-800 {
      .content-outer {
        grid-template-columns: auto 1fr;

        &.only-one-column {
          grid-template-columns: 1fr;
        }
      }
    }

    .content-outer {
      align-items: stretch;

      .menu-btn {
        .app-svg-icon.arrow-left {
          font-size: var(--tg-font-size-default);

          @include webTheme('green') {
            color: #fff;
          }
        }

        --tg-base-button-style-bg: var(--tg-secondary-dark);
        --tg-base-button-style-bg-hover: var(--tg-secondary-deepdark);
      }

      .left {}

      .right {
        position: relative;
        border-radius: var(--tg-radius-md);
        overflow: hidden;

        &.isMobile {
          border-radius: 0;
        }

        &.is-vip {
          // border-radius: 0;
        }

        &.loading {
          .content-container {
            opacity: 0.3;
          }
        }

        .content-container {
          color: var(--tg-text-lightgrey);
          background: var(--tg-secondary-dark);
          padding: var(--tg-spacing-12);
          overflow: hidden;
          position: relative;
          border-radius: var(--tg-radius-md);
          min-height: 100%;

          @include webTheme('white') {
            color: #111;
          }

          &.isMobile {
            border-radius: 0;
          }

          &.is-vip {
            // border-radius: 0;
          }

          &.no-bg {
            background: initial;
            padding: 0;
          }

          &.is-vip-rebate {
            border-radius: 0;
          }

          &.is-affiliate-bonus {
            @include webTheme('white') {
              background-color: transparent;
            }
          }
        }
      }
    }
  }
}

#tgWithMenuRight {
  >:first-child {
    display: none;
  }

  >:last-child {
    display: block;
  }
}

.mobile-menu-container {
  @include webTheme('white') {
    --tg-secondary-dark: #F5F5F5;

    .layout-spacing .content-outer .right .content-container {
      background-color: #F5F5F5;
      border-radius: var(--tg-radius-lg);

      &.is-vip-receive {
        border-radius: 4px;
        background-color: transparent;
      }

      &.is-vip-rebate {
        background-color: transparent;
        border-radius: 0;
      }

      .is-vip-rebate-loading {
        background-color: #F5F5F5;
      }
    }

    .user-setting-menu {
      --tg-tab-active-bar: var(--tg-white-primary-active-bg);
      --tg-base-menu-item-active-bg: var(--tg-secondary-grey);
    }

    .drop-down-record {
      --tg-base-select-popper-label-hover-bg-color: #f5f5f5;
    }
  }

  @include webTheme('green') {
    --tg-base-button-style-bg: #02432D;
    --tg-secondary-dark: #02432D;
    --tg-popper-hover-color-default: #5ECEA6;

    .layout-spacing .content-outer .right .content-container {
      border-radius: var(--tg-radius-default);
    }

    .user-setting-menu {
      --tg-tab-active-bar: var(--tg-tab-item-active);
      --tg-base-menu-item-active-bg: #02432D;
      --tg-secondary-dark: var(--tg-sport-grey-deep);
    }

    .setting-down {
      --tg-icon-color: #5ECEA6;
      --tg-base-button-color: #fff;
    }

    .drop-down-record {
      --tg-body-bg: #02432D;
      --tg-base-select-popper-label-hover-bg-color: #02432D;
    }
  }
}

.agent-plan-tab {
  @include webTheme('green') {
    --tg-tab-style-wrap-bg-color: var(--tg-primary-main);
    --tg-text-green-sub: var(--tw-ring-offset-color);
    --tg-tab-active-text-color: var(--tw-ring-offset-color);
  }
}
</style>

<route lang="yaml">
</route>
