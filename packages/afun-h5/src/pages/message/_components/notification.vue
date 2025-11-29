<script setup lang='ts'>
import type { INotificationInfoItem } from '@tg/types'
import { ApiMemberNotifications, ApiMemberNotificationsDelete, ApiMemberNotificationsRead } from '@tg/apis'
import { AfunBaseEmpty, AfunBaseImage, BaseList } from '@tg/bccomponents'
import { useMessageList, useNotificationState } from '@tg/hooks'
import { EventBusNames } from '@tg/types'
import { appEventBus, application } from '@tg/utils'
import { computed, onActivated, onBeforeUnmount, onDeactivated } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppMessageNotificationItem from '~/components/AppMessageNotificationItem.vue'

// 通知
defineOptions({ name: 'Notification' })
const emit = defineEmits(['reState'])
const { runNotificationsCount } = useNotificationState()
const { t } = useI18n()
const { list, total, page, getFormattedList, setList } = useMessageList()
const formattedList = getFormattedList(t)
const pageSize = 10

const { run, runAsync, loading } = useRequest(ApiMemberNotifications, {
  onSuccess(res) {
    if (res?.d) {
      const processedData = res.d.map((item: INotificationInfoItem) => ({
        ...item,
        originalTitle: item.title,
      }))
      setList(processedData, page.value === 1)
      if (page.value === 1) {
        total.value = res.t
      }
    }
  },
})

// 标记已读（ 通知 ）
const {
  run: runNoticeReadInsert,
} = useRequest(ApiMemberNotificationsRead, {
  onSuccess(data, params) {
    for (let i = 0; i < list.value?.length; i++) {
      const item = list.value[i]
      if (item.id === params[0].id) {
        item.is_read = 1
        break
      }
    }
    emit('reState')
  },
})

// 删除通知
const {
  runAsync: runAsyncZnxDelete,
} = useRequest(ApiMemberNotificationsDelete, {
  onSuccess() {
    emit('reState')
  },
})

const params = computed(() => {
  return {
    types: '1',
    location: 'notification',
    page: page.value,
    page_size: pageSize,
  }
})

function loadMore() {
  page.value = page.value + 1
  run(params.value)
}

function reset() {
  page.value = 1
}

function openDialogDetail(item: INotificationInfoItem) {
  item.is_read === 1 && runNoticeReadInsert({ id: item.id })
}

function refreshData(ty?: string) {
  runNotificationsCount()
  if (ty === 'station_read')
    return
  if (ty === 'notice') {
    reset()
    run(params.value)
  }
}

// 删除
async function deleteZnx(item: INotificationInfoItem) {
  if (item.is_read === 1) {
    await runNoticeReadInsert({ id: item.id })
  }
  runAsyncZnxDelete({ id: item.id }).then(() => {
    const index = list.value.findIndex(a => a.id === item.id)
    if (index > -1) {
      list.value.splice(index, 1)
    }
  })
}

onActivated(() => {
  appEventBus.on(EventBusNames.REFRESH_NOTICE_NOTIFY, refreshData)
  reset()
  run(params.value)
})

onDeactivated(() => {
  appEventBus.off(EventBusNames.REFRESH_NOTICE_NOTIFY, refreshData)
})
onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.REFRESH_NOTICE_NOTIFY, refreshData)
})

await application.allSettled([runAsync(params.value)])
</script>

<template>
  <div class="mt-[16px]">
    <BaseList
      v-if="list && list.length > 0" :finished="list.length > 0 ? list.length >= total : false"
      :loading="loading" :need-stop="false" class="app-notice-notify" @load="loadMore"
    >
      <AppMessageNotificationItem
        v-for="item of formattedList" :key="item.id" :data="item" class="mb-[16px]"
        @ready="openDialogDetail" @delete="deleteZnx"
      />
    </BaseList>
    <AfunBaseEmpty v-else class="mt-[16px]">
      <template #icon>
        <AfunBaseImage class="w-[96px] mt-[120px]" url="/m/afun-h5/png/notice_empty.png" />
      </template>
    </AfunBaseEmpty>
  </div>
</template>

<style lang='scss' scoped>

</style>
