<script lang="ts" setup>
import {
  IconUniClose,
  IconUniDelete2,
  IconNavbarWallet,
  IconUniWarning
} from '@tg/icons'
import { ApiMemberNotifications, ApiMemberNotificationsDelete, ApiMemberNotificationsRead, ApiMemberNotificationsReadAll } from '@tg/apis'

import BaseList from './BaseList.vue'

defineOptions({
  name: 'AppNoticeTz',
})

const emit = defineEmits(['reState'])

const pageCurrent = ref(1)
const pageSize = 10
let startX = 0
let endX = 0
let stopClick = false
let deleteRow: (string | number)[] = []
let touchStartY = 0

const { runNotificationsCount } = useNotificationState()
const { t } = useI18n()
const baseListRef = ref<typeof BaseList>()
const { isMobile } = storeToRefs(useWindowStore())
const { openDialog, closeDialog } = useDialog({
  title: t('title_hint'),
  icon: 'uni-hint',
  showButtons: true,
  onConfirm() {
    closeDialog()
    deleteZnx(deleteRow[0].toString(), deleteRow[1] as number)
  },
  default: () => h('div', {
    style: {
      padding: '17px 16px 33px',
    },
  }, t('confirm_delete_site_message', { name: t('notification') })),
})
// 存款详情
const { openDepositDetailDialog } = useDialogDepositDetail(t('notification'))
const getCurrentTotal = ref(0)
// computed(() => {
//   return Number(mul(pageCurrent.value, pageSize))
// })
// 跑马灯
// const { openMessageDialog: openMessagePmdDialog } = useDialogMessage(t('marquee'))
// const { bool: loading, setBool: setLoadingBool } = useBoolean(false)
// 通知列表
const memberNotifications = ref<any[]>([])
const {
  // list: memberNotifications,
  runAsync: runAsyncMemberNotifications,
  loading: memberNotifyListLoading,
  total: notifyTotal,
  next: nextNotify,
  loadMore: loadMoreNotify,
  resetPage: resetNotifyPage,
} = useList(ApiMemberNotifications, {
  debounceInterval: 500,
  debounceOptions: {
    leading: true,
    trailing: false,
  },
  onSuccess(res) {
    if (res !== null && res && res.d) {
      const data = res.d
      data.forEach((item) => {
        item.content = JSON.parse(item.payload)
      })
      if (pageCurrent.value > 1)
        memberNotifications.value = memberNotifications.value.concat(data)
      else
        memberNotifications.value = data
    }
    getCurrentTotal.value = Number(mul(pageCurrent.value, pageSize))
  },
}, { page_size: pageSize, page: pageCurrent.value })
const pageTotal = computed(() => {
  return notifyTotal.value
})

const isLoading = computed(() => {
  return memberNotifyListLoading.value
})

// 标记已读（ 通知 ）
const {
  run: runNotificationsRead,
} = useRequest(ApiMemberNotificationsRead, {
  onSuccess(data, params) {
    for (let i = 0; i < memberNotifications.value?.length; i++) {
      const item = memberNotifications.value[i]
      if (item.id === params[0].id) {
        item.is_read = 2
        break
      }
    }
    // const item = memberNotifications.value?.find(item => item.id === params[0].id)
    // item && (item.is_read = 2)
    // memberNotifications.value = [...(memberNotifications.value ?? [])]
    emit('reState')
  },
})
// 全部已读（ 通知 ）
const {
  run: runNotificationsReadAll,
} = useRequest(ApiMemberNotificationsReadAll, {
  onSuccess() {
    memberNotifications.value?.forEach((item) => {
      item.is_read = 2
    })
    // memberNotifications.value = [...(memberNotifications.value ?? [])]
    emit('reState')
  },
})

// 删除通知
const {
  runAsync: runAsyncNotificationsDelete,
} = useRequest(ApiMemberNotificationsDelete, {
  onSuccess() {
    emit('reState')
  },
})
const isStateAll = computed(() => {
  return true
})
const getList: ComputedRef<any[] | undefined> = computed(() => {
  return memberNotifications.value
})

function getIcon(state: number, is_read?: number) {
  if (state === 1)
    return IconNavbarWallet
  else if (state === 2)
    return IconUniWarning
  else
    return ''
}
async function handleLoad() {
  if (getCurrentTotal.value >= pageTotal.value)
    return
  pageCurrent.value = pageCurrent.value + 1
  loadMoreNotify()
}

function openDialogDetail(item: any) {
  item.is_read === 1 && runNotificationsRead({ id: item.id })
  return openDepositDetailDialog(item.content)
}
function pageInit(ty?: any) {
  return runAsyncMemberNotifications({ page: pageCurrent.value, page_size: pageSize })
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
function updateAllState() {
  return runNotificationsReadAll()
}
function getState(state: number) {
  return state === 1
}
function getAmount(item: { title: string, content: { finally_amount: string, pay_amount: string } }) {
  const isSuccess = item.title.includes('success')
  return isSuccess ? item.content.finally_amount : (item.content.pay_amount ?? item.content.finally_amount)
}
// 删除通知，站内信-h5
function deleteZnx(id: string, index: number) {
  runAsyncNotificationsDelete({ id }).then(() => {
    memberNotifications.value?.splice(index, 1)
    // memberNotifications.value = [...(memberNotifications.value ?? [])]
  })
}
// 删除通知，站内信确认弹框-pc
function deleteOpenZnx(id: string, index: number) {
  openDialog()
  deleteRow = [id, index]
}
// 是否显示 删除按钮
function showDel(state: number, title: string) {
  // 通知显示删除条件 && state === 2
  if (getState(state)) // 未读不能删除
    return false
  else
    return !title.includes('process')
}
// 滑动开始
function touchStart(e: any) {
  touchStartY = baseListRef.value?.getScrollY()
  // e.preventDefault()
  // 记录初始位置 通知，站内信有此功能
  startX = e.touches[0].clientX
}
// pc h5
function mouseDown(e: any) {
  startX = e.clientX
}

// 滑动结束
function touchEnd(e: any) {
  if (Math.abs(touchStartY - baseListRef.value?.getScrollY()) > 10)
    return
  // e.preventDefault()
  // 当前滑动的父级元素parentElement
  const target = e.currentTarget
  // 记录结束位置
  endX = e.changedTouches[0].clientX
  // 左滑大于30距离删除出现
  if (startX - endX > 30)
    target.children[2]?.classList.add('w-[70px]')

  // 右滑
  if (startX - endX < -30)
    target.children[2]?.classList.remove('w-[70px]')

  startX = 0
  endX = 0
}
// pc h5
function mouseUp(e: any) {
  const target = e.currentTarget
  endX = e.clientX

  // 左滑大于30距离删除出现
  if (startX - endX > 30) {
    stopClick = true
    target.children[2]?.classList.add('w-[70px]')
  }
  else if (startX - endX < -30) {
    stopClick = true
    target.children[2]?.classList.remove('w-[70px]')
  }
  else {
    stopClick = false
  }

  startX = 0
  endX = 0
}
function touchClick(e: any) {
  if (stopClick)
    e.stopPropagation()
}

function refreshData(ty?: any) {
  runNotificationsCount()
  if (ty === 'station_read')
    return
  const list = document.querySelector('.scroll-y.base-list.app-notice-notify')
  if (list)
    list.scrollTop = 0
  pageCurrent.value = 1
  resetNotifyPage()
  pageInit()
}

onMounted(() => {
  appEventBus.on(EventBusNames.REFRESH_NOTICE_NOTIFY, refreshData)
})

onActivated(() => {
  const list = document.querySelector('.scroll-y.base-list.app-notice-notify')
  if (list)
    list.scrollTop = 0
  pageCurrent.value = 1
  resetNotifyPage()
  pageInit()
})

await application.allSettled(
  [
    runAsyncMemberNotifications({ page: 1, page_size: pageSize }),
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
      <div v-if="isStateAll" class="notice-read-button contain-top">
        <BaseButton type="text" size="none" @click="updateAllState">
          {{ t('mark_all_read') }}
        </BaseButton>
      </div>
      <div
        v-for="item, index of getList.slice(0, getCurrentTotal)" :key="item.id"
        class="contain-item relative cursor-pointer" @click="openDialogDetail(item)"
      >
        <div class="w-[100%] flex" @touchstart.capture="touchStart" @touchend.capture="touchEnd" @click="touchClick" @mousedown="mouseDown" @mouseup="mouseUp">
          <div class="center item-left">
            <AppCurrencyIcon v-if="!getIcon(item.content.state)" :currency-type="item.content.currency_name" />
            <component v-else :is="getIcon(item.content?.state ?? item.state, item.is_read)" />
          </div>
          <div class="over-ellipsis item-right right-radius">
            <div class="right-state">
              <div class="over-ellipsis content-title">
                {{ getTitle(item.title) || item.title[getCurrentLanguageForBackend()] || item.title }}
              </div>
              <BaseBadge
                v-if="getState(item.state ?? item.is_read)" class="state-text" :max="99999" status="success"
                :text="timeToFromNow(item.start_time ?? item.created_at ?? item.timestamp)"
              />
              <span v-else class="state-text">
                {{ timeToFromNow(item.start_time ?? item.created_at ?? item.timestamp) }}
              </span>
            </div>
            <!-- 通知 -->
            <div class="over-ellipsis content-text">
              <div class="c-block">
                {{ t('amount') }}
                <AppAmount
                  style="display: inline-block" :amount="getAmount(item)"
                  :currency-type="item.content.currency_name"
                />
              </div>
            </div>
          </div>
          <!-- h5滑动删除按钮 -->
          <div
            v-if="showDel(item.state ?? item.is_read, item.title) && isMobile"
            class="center delete-btn w-[0] duration-200" @click.stop="deleteZnx(item.id, index)"
          >
            <BaseButton type="text">
              <IconUniDelete2 class="text-[34px]" style="--tg-icon-color: white;" />
            </BaseButton>
          </div>
          <!-- pc删除'X' -->
          <div v-if="showDel(item.state ?? item.is_read, item.title) && !isMobile" class="absolute right-0 top-0">
            <BaseButton
              custom-padding style="--tg-base-button-padding-y: 2px;--tg-base-button-padding-x: 2px"
              type="text" @click.stop="deleteOpenZnx(item.id, index)"
            >
              <IconUniClose style="font-size:16px;" class="red-close-icon" />
            </BaseButton>
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
        <div class="empty-text2">
          {{ t('tip_show_action') }}
        </div>
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
.red-close-icon {
  --tg-icon-color: #df0022;
  @include webTheme('white') {
    --tg-icon-color: #484848;
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
    .item-left {
      width: 62px;
      height: 100%;
      flex-shrink: 0;
      font-size: var(--tg-font-size-lg);
      --tg-icon-color: var(--tg-primary-success);
      --tg-app-currency-icon-size: 20px;
      background: var(--app-notice-notify-item-left-bg);
      @include webTheme('white') {
        background: #f2ca5c;
        --tg-icon-color: #00a501;
      }
      @include webTheme('green') {
        background: #02432d;
        --tg-icon-color: #5ecea6;
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
      }
      @include webTheme('green') {
        background: #055434;
      }
      > * {
        margin-bottom: 6px;
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
  @include webTheme('green') {
    .notice-read-button {
      --tg-base-button-text-default-color: var(--tw-ring-offset-color);
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
    @include webTheme('white') {
      color: #555;
    }
  }
  .empty-text2 {
    @include webTheme('white') {
      font-weight: 600;
    }
  }
}
</style>
