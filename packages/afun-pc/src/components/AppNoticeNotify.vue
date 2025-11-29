<script lang="ts" setup>
import { IconUniDelete2, IconUniClose } from '@tg/icons'
import { ApiMemberNoticeList, ApiMemberNoticeReadInsert, ApiMemberNotifications, ApiMemberNotificationsDelete, ApiMemberNotificationsRead, ApiMemberNotificationsReadAll, ApiMemberStationInfoDetailDelete, ApiMemberStationInfoDetailUpdateAllState, ApiMemberStationInfoDetailUpdateState, ApiMemberStationInfoList } from '@tg/apis'

import BaseList from './BaseList.vue'

interface Props {
  mode: string
}
defineOptions({
  name: 'AppNoticeNotify',
})
const props = withDefaults(defineProps<Props>(), {
  mode: '',
})

const emit = defineEmits(['reState'])

enum EnumPage { tz, znx, gg, pmd, fk }
const pageCurrent = ref(1)
const pageSize = 10
let startX = 0
let endX = 0
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
  }, t('confirm_delete_site_message', { name: props.mode === EnumPage[1] ? t('site_message') : t('notification') })),
})
// 存款详情
const { openDepositDetailDialog } = useDialogDepositDetail(t('notification'))
// 通知
// const { openMessageDialog: openNotificationDialog } = useDialogMessage(t('notification'))
// 公告
const { openNoticeDialog } = useDialogNotice()
// 站内信
const { openMessageDialog: openMessageZnxDialog } = useDialogMessage()
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
// 站内信列表
const {
  list: stationInfoList,
  runAsync: runAsyncMemberStationInfoList,
  loading: memberStationListLoading,
  total: stationTotal,
  next: nextStation,
  loadMore: loadMoreStation,
  resetPage: resetStationPage,
} = useList(ApiMemberStationInfoList, {
  debounceInterval: 500,
  debounceOptions: {
    leading: true,
    trailing: false,
  },
  onSuccess(res, p) {
    getCurrentTotal.value = Number(mul(pageCurrent.value, pageSize))
  },
}, { page_size: pageSize, page: pageCurrent.value })
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
  if (props.mode === EnumPage[0])
    return notifyTotal.value
  else if (props.mode === EnumPage[1])
    return stationTotal.value
  else if (props.mode === EnumPage[2])
    return noticeTotal.value
  else
    return 0
})

const isLoading = computed(() => {
  if (props.mode === EnumPage[0])
    return memberNoticeListLoading.value
  else if (props.mode === EnumPage[1])
    return memberStationListLoading.value
  else if (props.mode === EnumPage[2])
    return memberNotifyListLoading.value
  else
    return false
})

// 标记已读（ 站内信 ）
const {
  run: runStationInfoDetailUpdateState,
} = useRequest(ApiMemberStationInfoDetailUpdateState, {
  onSuccess(data, params) {
    for (let i = 0; i < stationInfoList.value?.length; i++) {
      const item = stationInfoList.value[i]
      if (item.id === params[0].id) {
        item.state = 1
        break
      }
    }
    // stationInfoList.value?.forEach(item => {
    //   if (item.id === params[0].id) {
    //     item && (item.state = 1)
    //   }
    // })
    // stationInfoList.value = [...(stationInfoList.value ?? [])]
    emit('reState')
  },
})
// 全部已读（ 站内信 ）
const {
  run: runMemberUpdateAllState,
} = useRequest(ApiMemberStationInfoDetailUpdateAllState, {
  onSuccess() {
    stationInfoList.value?.forEach((item) => {
      item.state = 1
    })
    // stationInfoList.value = [...(stationInfoList.value ?? [])]
    emit('reState')
  },
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
// 标记已读（ 公告 ）
const {
  run: runNoticeReadInsert,
} = useRequest(ApiMemberNoticeReadInsert, {
  onSuccess(data, params) {
    for (let i = 0; i < noticeList.value?.length; i++) {
      const item = noticeList.value[i]
      if (item.id === params[0].id) {
        item.is_read = 1
        break
      }
    }
    // const item = noticeList.value?.find(item => item.id === params[0].id)
    // item && (item.is_read = 1)
    // noticeList.value = [...(noticeList.value ?? [])]
    emit('reState')
  },
})
// 删除站内信
const {
  runAsync: runAsyncZnxDelete,
} = useRequest(ApiMemberStationInfoDetailDelete, {
  onSuccess() {
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
  return props.mode === EnumPage[0] || props.mode === EnumPage[1]
})
const getList: ComputedRef<any[] | undefined> = computed(() => {
  switch (props.mode) {
    case EnumPage[0]: return memberNotifications.value
    case EnumPage[1]: return stationInfoList.value
    case EnumPage[2]:
    case EnumPage[3]: return noticeList.value
    default: return []
  }
})
// const getIcon = computed(() => {
//   switch (props.mode) {
//     case EnumPage[0]: return 'navbar-wallet'
//     case EnumPage[1]: return 'uni-notice-znx'
//     case EnumPage[2]:return 'uni-notice-gg'
//     case EnumPage[3]: return 'uni-notice-pmd'
//     default: return ''
//   }
// })

function getIcon(state: number, is_read?: number) {
  switch (props.mode) {
    case EnumPage[0]:
      if (state === 1)
        return 'navbar-wallet'
      else if (state === 2)
        return 'uni-warning'
      else
        return ''
    case EnumPage[1]:
      if (getState(state))
        return 'uni-notice-znx'
      else
        return 'uni-notice-yznx'

    case EnumPage[2]:
      if (getState(is_read ?? 0))
        return 'uni-notice-gg'
      else
        return 'uni-notice-ygg'
    case EnumPage[3]: return 'uni-notice-pmd'
    default: return ''
  }
}
async function handleLoad() {
  pageCurrent.value = pageCurrent.value + 1
  switch (props.mode) {
    case EnumPage[0]:
      loadMoreNotify()
      break
    case EnumPage[1]:
      loadMoreStation()
      break
    case EnumPage[2]:
      loadMoreNotice()
      break
  }
}

function openDialogDetail(item: any) {
  switch (props.mode) {
    case EnumPage[0]:
      item.is_read === 1 && runNotificationsRead({ id: item.id })
      return openDepositDetailDialog(item.content)
    case EnumPage[1]:
      item.state === 2 && runStationInfoDetailUpdateState({ id: item.id })
      openMessageZnxDialog({ ...item })
      return
    case EnumPage[2]:
      item.is_read === 2 && runNoticeReadInsert({ id: item.id })
      return openNoticeDialog(item)
    // case EnumPage[3]: return openMessagePmdDialog(item)
  }
}
function pageInit(ty?: any) {
  if (ty === 'station' && props.mode === EnumPage[1]) {
    setTimeout(() => {
      runAsyncMemberStationInfoList({ page: pageCurrent.value, page_size: pageSize })
    }, 5000)
    return
  }

  if (ty === 'notice' && props.mode === EnumPage[2]) {
    setTimeout(() => {
      runAsyncMemberNoticeList({ types: '1', location: 'notification', page: pageCurrent.value, page_size: pageSize })
    }, 5000)
    return
  }

  switch (props.mode) {
    case EnumPage[0]: return runAsyncMemberNotifications({ page: pageCurrent.value, page_size: pageSize })
    case EnumPage[1]: return runAsyncMemberStationInfoList({ page: pageCurrent.value, page_size: pageSize })
    case EnumPage[2]: return runAsyncMemberNoticeList({ types: '1', location: 'notification', page: pageCurrent.value, page_size: pageSize })
    case EnumPage[3]: return runAsyncMemberNoticeList({ types: '2', page: pageCurrent.value, page_size: pageSize })
  }
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
  switch (props.mode) {
    case EnumPage[0]: return runNotificationsReadAll()
    case EnumPage[1]: return runMemberUpdateAllState()
  }
}
function getState(state: number) {
  switch (props.mode) {
    case EnumPage[0]: return state === 1
    case EnumPage[1]: return state === 2
    case EnumPage[2]: return state === 2
  }
}
function getAmount(item: { title: string, content: { finally_amount: string, pay_amount: string } }) {
  const isSuccess = item.title.includes('success')
  return isSuccess ? item.content.finally_amount : (item.content.pay_amount ?? item.content.finally_amount)
}
// 删除通知，站内信-h5
function deleteZnx(id: string, index: number) {
  switch (props.mode) {
    case EnumPage[0]:
      runAsyncNotificationsDelete({ id }).then(() => {
        memberNotifications.value?.splice(index, 1)
        // memberNotifications.value = [...(memberNotifications.value ?? [])]
      })
      return
    case EnumPage[1]:
      runAsyncZnxDelete({ id }).then(() => {
        stationInfoList.value?.splice(index, 1)
        // stationInfoList.value = [...(stationInfoList.value ?? [])]
      })
  }
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
    return (props.mode === EnumPage[0] && !title.includes('process')) || props.mode === EnumPage[1]
}
// 滑动开始
function touchStart(e: any) {
  touchStartY = baseListRef.value?.getScrollY()
  // e.preventDefault()
  // 记录初始位置 通知，站内信有此功能
  if ([EnumPage[0], EnumPage[1]].includes(props.mode))
    startX = e.touches[0].clientX
}
// 滑动结束
function touchEnd(e: any) {
  if (Math.abs(touchStartY - baseListRef.value?.getScrollY()) > 10)
    return
  // e.preventDefault()
  // 当前滑动的父级元素parentElement
  if ([EnumPage[0], EnumPage[1]].includes(props.mode)) {
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
  resetNotifyPage()
  resetStationPage()
  if (ty === 'station' && props.mode === EnumPage[1]) {
    pageInit(ty)
  }
  else if (ty === 'notice' && props.mode === EnumPage[2]) {
    pageInit(ty)
  }
  else {
    if (props.mode === EnumPage[0])
      pageInit()
  }
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
  resetNotifyPage()
  resetStationPage()
  pageInit()
})

watch(() => props.mode, (val) => {
  const list = document.querySelector('.scroll-y.base-list.app-notice-notify')
  if (list)
    list.scrollTop = 0
  pageCurrent.value = 1
  resetNoticePage()
  resetNotifyPage()
  resetStationPage()
  pageInit()
})

await application.allSettled(
  [
    pageInit() as Promise<any>,
    runAsyncMemberStationInfoList({ page: 1, page_size: pageSize }),
    runAsyncMemberNoticeList({ types: '1', location: 'notification', page: 1, page_size: pageSize }),
  ],
)
</script>

<template>
  <BaseList
    v-if="getList && getList.length > 0"
    ref="baseListRef"
    :finished="getCurrentTotal >= pageTotal" :loading="isLoading"
    :need-stop="false"
    class="app-notice-notify"
    @load="handleLoad"
  >
    <!-- :finished="getList.length >= pageTotal" -->
    <div class="notice-scroll">
      <div v-if="isStateAll" class="contain-top">
        <BaseButton type="text" size="none" @click="updateAllState">
          {{ t('mark_all_read') }}
        </BaseButton>
      </div>
      <div
        v-for="item, index of getList.slice(0, getCurrentTotal)" :key="item.id"
        class="contain-item relative cursor-pointer" @click="openDialogDetail(item)"
      >
        <div class="w-[100%] flex" @touchstart.capture="touchStart" @touchend.capture="touchEnd">
          <div class="center item-left">
            <AppCurrencyIcon v-if="!getIcon(item.content.state)" :currency-type="item.content.currency_name" />
            <component v-else :is="getIcon(item.content?.state ?? item.state, item.is_read)" />
          </div>
          <div class="over-ellipsis item-right right-radius">
            <div class="right-state">
              <div class="over-ellipsis content-text">
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
            <div v-if="mode === EnumPage[0]" class="content-text over-ellipsis">
              <div class="c-block">
                {{ t('amount') }}
                <AppAmount
                  style="display: inline-block" :amount="getAmount(item)"
                  :currency-type="item.content.currency_name"
                />
              </div>
            </div>
            <!-- 站内信 -->
            <template v-else-if="mode === EnumPage[1]">
              <div class="content-text over-ellipsis">
                {{ item.content[getCurrentLanguageForBackend()] }}
              </div>
            </template>
            <!-- 公告 -->
            <div v-else-if="mode === EnumPage[2]" class="content-text over-ellipsis">
              {{ getPlainTextFromHtml(item.content[getCurrentLanguageForBackend()]) }}
            </div>
            <!-- 跑马灯 -->
            <!-- <div v-else class="content-text" v-html="item.content[getCurrentLanguageForBackend()]" /> -->
          </div>
          <!-- h5滑动删除按钮 -->
          <div
            v-if="showDel(item.state ?? item.is_read, item.title) && isMobile"
            class="center delete-btn w-[0] duration-200" @click.stop="deleteZnx(item.id, index)"
          >
            <BaseButton type="text">
              <IconUniDelete2 class="text-[34px]" style="--tg-icon-color: var(--tg-text-white)" />
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
  color: var(--tg-text-lightgrey);

  .contain-top {
    font-size: var(--tg-font-size-default);
    font-weight: 500;
    margin: 4px 0;
    text-align: right;
    span:hover {
      cursor: pointer;
    }
    button {
      color: var(--tg-text-white);
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
      .content-text {
        line-height: 1.43;
        color: var(--app-notice-notify-item-time-color);
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
  color: var(--tg-text-lightgrey);
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
