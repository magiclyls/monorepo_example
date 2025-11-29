<script lang="ts" setup>
import { IconUniNoticeGgCurrent } from '@tg/icons'
import { ApiMemberNoticeList, ApiMemberNoticeReadInsert } from '@tg/apis'

import BaseList from './BaseList.vue'

defineOptions({
  name: 'AppNoticeGg',
})

const emit = defineEmits(['reState'])

const pageCurrent = ref(1)
const pageSize = 10

const { runNotificationsCount } = useNotificationState()
const { t } = useI18n()
const baseListRef = ref<typeof BaseList>()
// 公告
const { openNoticeDialog } = useDialogNotice()
// 站内信
const getCurrentTotal = ref(0)
// computed(() => {
//   return Number(mul(pageCurrent.value, pageSize))
// })
// 跑马灯
// const { openMessageDialog: openMessagePmdDialog } = useDialogMessage(t('marquee'))
// const { bool: loading, setBool: setLoadingBool } = useBoolean(false)
// 公告&跑马灯列表
const {
  list: noticeList,
  runAsync: runAsyncMemberNoticeList,
  loading: memberNoticeListLoading,
  total: noticeTotal,
  loadMore: loadMoreNotice,
  resetPage: resetNoticePage,
} = useList(ApiMemberNoticeList, {
  debounceInterval: 500,
  debounceOptions: {
    leading: true,
    trailing: false,
  },
  onSuccess(res) {
    getCurrentTotal.value = Number(mul(pageCurrent.value, pageSize))
  },
}, { page_size: pageSize, page: pageCurrent.value })

const pageTotal = computed(() => {
  return noticeTotal.value
})

const isLoading = computed(() => {
  return memberNoticeListLoading.value
})

// 标记已读（ 公告 ）
const {
  run: runNoticeReadInsert,
} = useRequest(ApiMemberNoticeReadInsert, {
  onSuccess(data, params) {
    for (let i = 0; i < noticeList.value?.length; i++) {
      const item = noticeList.value[i]
      if (item.id === params[0].id) {
        item.read = true
        break
      }
    }
    // const item = noticeList.value?.find(item => item.id === params[0].id)
    // item && (item.is_read = 1)
    // noticeList.value = [...(noticeList.value ?? [])]
    emit('reState')
  },
})

const getList: ComputedRef<any[] | undefined> = computed(() => {
  return noticeList.value
})

function getIcon(read: boolean) {
  return 'uni-notice-gg-current'// read ? 'uni-notice-ygg' : 'uni-notice-gg'
}
async function handleLoad() {
  if (getCurrentTotal.value >= pageTotal.value)
    return
  pageCurrent.value = pageCurrent.value + 1
  loadMoreNotice()
}

function openDialogDetail(item: any) {
  item.read === false && runNoticeReadInsert({ id: item.id })
  return openNoticeDialog(item)
}

function pageInit(ty?: any) {
  if (ty === 'notice') {
    setTimeout(() => {
      runAsyncMemberNoticeList({ types: '1', location: 'notification', page: pageCurrent.value, page_size: pageSize })
    }, 5000)
    return
  }

  return runAsyncMemberNoticeList({ types: '1', location: 'notification', page: pageCurrent.value, page_size: pageSize })
}
function getTitle(title: string, flag?: boolean) {
  switch (title) {
    case 'withdraw_success': return flag ? t('withdraw_success_received') : t('withdraw_success')
    case 'withdraw_fail': return t('withdraw_fail')
    case 'deposit_success': return flag ? t('deposit_success_received') : t('deposit_success')
    case 'deposit_fail': return t('deposit_fail')
    case 'deposit_in_process': return flag ? t('deposit_in_process_now') : t('deposit_in_process')
    case 'withdraw_in_process': return flag ? t('withdraw_in_process_now') : t('withdraw_in_process')
    default: return false
  }
}
function getState(state: number) {
  return state === 2
}
// 滑动开始
function touchStart(e: any) {
}
// 滑动结束
function touchEnd(e: any) {
}

function refreshData(ty?: any) {
  runNotificationsCount()
  if (ty === 'station_read')
    return
  const list = document.querySelector('.scroll-y.base-list.app-notice-notify')
  if (list)
    list.scrollTop = 0
  pageCurrent.value = 1
  resetNoticePage()
  if (ty === 'notice')
    pageInit(ty)
}

onMounted(() => {
  appEventBus.on(EventBusNames.REFRESH_NOTICE_NOTIFY, refreshData)
})

onActivated(() => {
  const list = document.querySelector('.scroll-y.base-list.app-notice-notify')
  if (list)
    list.scrollTop = 0
  pageCurrent.value = 1
  resetNoticePage()
  pageInit()
})

await application.allSettled(
  [
    runAsyncMemberNoticeList({ types: '1', location: 'notification', page: 1, page_size: pageSize }),
  ],
)
</script>

<template>
  <BaseList
    v-if="getList && getList.length > 0"
    ref="baseListRef"
    :finished="getCurrentTotal > 0 ? getCurrentTotal >= pageTotal : false" :loading="isLoading"
    :need-stop="false"
    class="app-notice-notify"
    @load="handleLoad"
  >
    <!-- :finished="getList.length >= pageTotal" -->
    <div class="notice-scroll">
      <div
        v-for="item of getList.slice(0, getCurrentTotal)" :key="item.id"
        class="contain-item relative cursor-pointer" @click="openDialogDetail(item)"
      >
        <div class="w-[100%] flex" @touchstart.capture="touchStart" @touchend.capture="touchEnd">
          <div class="center item-left">
            <!-- <AppCurrencyIcon v-if="!getIcon(item.content.state)" :currency-type="item.content.currency_name" /> -->
            <IconUniNoticeGgCurrent :class="item.read ? 'gg-icon' : 'un-gg-icon'" />
          </div>
          <div class="over-ellipsis item-right right-radius">
            <div class="right-state">
              <div class="over-ellipsis">
                {{ getTitle(item.title) || item.title }}
              </div>
              <BaseBadge
                v-if="!item.read" class="state-text" :max="99999" status="success"
                :text="timeToFromNow(item.start_time ?? item.created_at ?? item.timestamp)"
              />
              <span v-else class="state-text">
                {{ timeToFromNow(item.start_time ?? item.created_at ?? item.timestamp) }}
              </span>
            </div>
            <!-- 公告 -->
            <div class="over-ellipsis content-text">
              {{ getPlainTextFromHtml(item.content) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseList>
  <div v-else class="empty-notice">
    <BaseEmpty>
      <template #icon>
        <BaseImage width="62px" height="62px" with-theme url="/png/icon/notice_empty.png" />
      </template>
      <template #description>
        <div class="empty-text">
          {{ t('empty_notify') }}
        </div>
        <div>{{ t('tip_show_action') }}</div>
      </template>
    </BaseEmpty>
  </div>
</template>

<style>
:root {
  --app-notice-notify-item-left-bg: var(--tg-secondary-grey);
  --app-notice-notify-item-time-color: var(--tg-text-lightgrey);
}

[theme='white'] {
  --app-notice-notify-item-left-bg: #454545;
  --app-notice-notify-item-time-color: #484848;
}
</style>

<style lang="scss" scoped>
.un-gg-icon {
  color: #1fff20;
  @include webTheme('white') {
    color: #111;
  }
  @include webTheme('green') {
    color: #1fff20;
  }
}
.gg-icon {
  color: #111;
  @include webTheme('white') {
    color: #555;
  }
  @include webTheme('green') {
    color: #3cb389;
  }
}

.c-block {
  > div {
    display: inline-block;
  }
  &.c-amount {
    > div {
      margin-right: 4px;
    }
  }
}
.notice-scroll {
  display: flex;
  flex-direction: column;
  padding: 12px 16px 0;
  gap: 12px;
  color: var(--tg-secondary-light);

  .contain-top {
    font-size: var(--tg-font-size-default);
    font-weight: 500;
    margin: 4px 0;
    text-align: right;
    span:hover {
      cursor: pointer;
    }
  }
  .state-text {
    color: var(--app-notice-notify-item-time-color);
    font-size: var(--tg-font-size-xs);
    font-weight: var(--tg-font-weight-normal);
  }
  .contain-item {
    display: flex;
    height: 70px;
    width: 100%;
    overflow: hidden;
    border-radius: var(--tg-radius-default);
    box-shadow: var(--tg-box-shadow);
    @include webTheme('white') {
      box-shadow: none;
    }
    .item-left {
      width: 62px;
      height: 100%;
      flex-shrink: 0;
      font-size: var(--tg-font-size-lg);
      // --tg-icon-color: var(--tg-primary-success);
      --tg-app-currency-icon-size: 20px;
      background: var(--app-notice-notify-item-left-bg);
      --tg-icon-color: #b1bad3;
      @include webTheme('white') {
        background: #f2ca5c;
      }
      @include webTheme('green') {
        background: #02432d;
      }
    }

    .item-right {
      display: flex;
      flex: 1;
      // gap: 6px;
      min-height: 100%;
      padding: 12px 12px;
      font-size: var(--tg-font-size-default);
      flex-direction: column;
      justify-content: space-between;
      background: var(--tg-secondary-main);
      @include webTheme('white') {
        background: #f5f5f5;
        padding: 14px 14px;
      }
      @include webTheme('green') {
        background: #055434;
      }
      > * {
        margin-bottom: 6px;
        @include webTheme('white') {
          margin-bottom: 2px;
        }
      }
      > :last-child {
        margin-bottom: 0;
      }
      .right-state {
        width: 100%;
        display: flex;
        color: var(--tg-text-white);
        font-size: var(--tg-font-size-default);
        font-weight: 500;
        justify-content: space-between;
        align-items: center;
        .state-text {
          flex: 1;
          text-align: right;
        }
      }
      .content-title {
        line-height: 1.43;
      }
      .content-text {
        line-height: 1.43;
        @include webTheme('white') {
          color: #555;
        }
        @include webTheme('green') {
          color: #3cb389;
        }
      }
    }
    .delete-btn {
      height: 100%;
      overflow: hidden;
      // width: 70px;
      background-color: #df0022;
    }
  }
}

.empty-notice {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: var(--tg-secondary-light);
  font-size: var(--tg-font-size-default);
  @include webTheme('green') {
    --tg-text-lightgrey: var(--tg-text-green-main);
  }

  .empty-text {
    color: var(--tg-text-white);
    font-weight: var(--tg-font-weight-semibold);
    margin: 36px auto 8px;
    @include webTheme('green') {
      color: var(--tg-text-green-main);
    }
  }
}
</style>
