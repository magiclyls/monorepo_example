<script lang="ts" setup>
import AppFeedbackChat from './AppFeedbackChat.vue'
import AppFeedback from './AppFeedback.vue'
import { IconUniClose, IconUniNotice } from '@tg/icons'
import { getEnv } from '@tg/utils';


defineOptions({
  name: 'AppNotice',
})
const { VITE_SOCKET_PREFIX } = getEnv()
const noticeTopic = `${VITE_SOCKET_PREFIX}/common`

enum EnumPage { tz, znx, gg, pmd, fk }
const { showFeedbackChat } = storeToRefs(useChatStore())
const { userLanguage } = storeToRefs(useLanguageStore())
const { closeRightSidebar } = useRightSidebar()
const { t } = useI18n()
const { notificationsCount, runNotificationsCount } = useNotificationState()
const { lockScroll } = useScrollPrevent()

const { isMobile } = storeToRefs(useWindowStore())

const A = defineAsyncComponent(() => import('./AppNoticeTz.vue'))
const B = defineAsyncComponent(() => import('./AppNoticeZnx.vue'))
const C = defineAsyncComponent(() => import('./AppNoticeGg.vue'))
const tab = ref(EnumPage[0])
const tabList = computed(() => [
  { label: t('notification'), value: EnumPage[0], dotTip: notificationsCount.value?.notification_count },
  { label: t('site_message'), value: EnumPage[1], dotTip: notificationsCount.value?.station_count },
  { label: t('notice'), value: EnumPage[2], dotTip: notificationsCount.value?.notice_count },
  // { label: t('marquee'), value: EnumPage[3] },
  { label: t('reward_feedback'), value: EnumPage[4], dotTip: notificationsCount.value?.reward_count },
])

const getComponent = computed(() => {
  switch (tab.value) {
    case EnumPage[0]: return A
    case EnumPage[1]: return B
    case EnumPage[2]: return C
    // case EnumPage[3]: return D
    case EnumPage[4]: return showFeedbackChat.value ? AppFeedbackChat : AppFeedback
  }
})

onMounted(() => {
  runNotificationsCount()
  setTimeout(() => {
    socketClient.addSubscribe(noticeTopic, { callback: commonCallback })
  }, 5000)

  setTimeout(() => {
    const allScrollyEl = document.querySelectorAll('.app-notice .scroll-y')
    lockScroll(allScrollyEl)
  }, 300)
})

onUnmounted(() => {
  socketClient.removeSubscribe(noticeTopic)
})
</script>

<template>
  <div class="app-notice app-right-side-bar-notice">
    <div class="notice-head">
      <div class="center head-title">
        <IconUniNotice class="title-icon" />
        <span>{{ t('message_center') }}</span>
      </div>
      <BaseButton v-if="isMobile" type="text" @click="closeRightSidebar">
        <IconUniClose />
      </BaseButton>
      <VTooltip v-else placement="bottom" :triggers="['hover']">
        <div class="item hoverable">
          <BaseButton type="text" @click="closeRightSidebar">
            <IconUniClose />
          </BaseButton>
        </div>
        <template #popper>
          <div class="tiny-menu-item-title">
            {{ t('chat_close_side') }}
          </div>
        </template>
      </VTooltip>
    </div>
    <div class="notice-tab-wrap tab-box" :class="[`notice-tab-${userLanguage}`]">
      <BaseTab
        v-model="tab"
        :list="tabList"
        :center="false"
        need-scroll-into-view full
        @change="runNotificationsCount"
      />
    </div>
    <div class="notice-content">
      <keep-alive>
        <Suspense timeout="0">
          <component :is="getComponent" :mode="tab" :finished-txt-show-over-height="true" @re-state="runNotificationsCount" />
          <template #fallback>
            <div class="center dialog-loading-height">
              <BaseLoading />
            </div>
          </template>
        </Suspense>
      </keep-alive>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media only screen and (min-width: 350px) and (max-width: 601px) {
  :deep(.tab-box.notice-tab-zh-CN .base-tab .scroll-x) {
    overflow-x: visible;
    overflow-y: visible;
  }
}
@media only screen and (min-width: 1280px)  {
  :deep(.tab-box.notice-tab-zh-CN .base-tab .scroll-x) {
    overflow-x: visible;
    overflow-y: visible;
  }
}
.app-notice {
  // --tg-tab-style-color: var(--tg-text-lightgrey);
  // --tg-tab-style-line-active-text-color: var(--tg-text-white);
  height: 100%;
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  .notice-head{
    height: var(--tg-header-height);
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--tg-secondary-dark);
    position: relative;
    box-shadow: var(--tg-header-shadow);
    flex-shrink: 0;
    touch-action: none;
    @include webTheme('white'){
      background: #fff;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.08);
    }
    .head-title{
      color:var(--tg-text-white);
      display: inline-flex;
      padding: var(--tg-spacing-8) var(--tg-spacing-16);
      font-size: var(--tg-font-size-default);
      > span {
        font-weight: var(--tg-font-weight-semibold);
      }
      .title-icon{
        font-size: var(--tg-font-size-base);
        margin-right: var(--tg-spacing-8);
        color: var(--tg-text-white);
        @include webTheme('green') {
            color: var(--tg-svg-default-color);
        }
      }
    }
    .close-btn{
      &:hover{
        --tg-icon-color:var(--tg-text-white);
      }
      .close-icon{
        font-size: var(--tg-font-size-xs);
      }
    }
    .hoverable {
      padding: var(--tg-spacing-1) var(--tg-spacing-1);
      border-radius: 50%;
      transition: var(--tg-transition);
      background-color: transparent;
      &:hover {
        background-color: var(--tg-secondary-deepdark);
        --tg-icon-color: var(--tg-text-white);
        @include webTheme('white'){
          background-color: #c1c1c1;
        }
      }
    }
  }
  .tab-box{
    background: var(--tg-primary-light);
    padding: var(--tg-spacing-24) var(--tg-spacing-16) 0;
    // --tg-tab-style-wrap-bg-color: #0F212E;
    --tg-tab-style-inner-padding-x: var(--tg-spacing-16);
    @include webTheme('white'){
      --tg-tab-style-color:#111111;
      --tg-tab-style-wrap-bg-color:#F5F5F5;
    }
  }
  .notice-content{
    width: 100%;
    display: flex;
    flex: 1;
    // justify-content: center;
    flex-direction: column;
    overflow: hidden;
    background: var(--tg-primary-light);
  }
}
.notice-tab-wrap{
  @include webTheme('green'){
    --tg-tab-style-active-bg:var(--tg-body-bg);
    --tg-tab-style-wrap-bg-color:var(--tg-primary-main);
    --tg-text-green-sub:var(--tw-ring-offset-color);
  }
}
</style>
