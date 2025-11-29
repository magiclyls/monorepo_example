<script setup lang='ts'>
import type { IMemberNoticeItem } from '@tg/types'
import { ApiMemberNoticeList, ApiMemberNoticeReadInsert } from '@tg/apis'
import { AfunBaseEmpty, AfunBaseImage, BaseList } from '@tg/bccomponents'
import { useMessageList, useNotificationState } from '@tg/hooks'
import { EventBusNames } from '@tg/types'
import { appEventBus, application } from '@tg/utils'
import { computed, onActivated, onBeforeUnmount, onDeactivated } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import AppMessageAnnouncementItem from '~/components/AppMessageAnnouncementItem.vue'

// 公告
defineOptions({ name: 'Announcement' })
const emit = defineEmits(['reState'])
const { runNotificationsCount } = useNotificationState()
const { t } = useI18n()
const router = useRouter()
const { list, total, page, getFormattedList, setList } = useMessageList()
const formattedList = getFormattedList(t)
const pageSize = 10

const { run, runAsync, loading } = useRequest(ApiMemberNoticeList, {
  onSuccess(res) {
    if (res?.d) {
      setList(res.d, page.value === 1)
      if (page.value === 1) {
        total.value = res.t
      }
    }
    emit('reState')
  },
})

// 标记已读（ 公告 ）
const {
  run: runNoticeReadInsert,
} = useRequest(ApiMemberNoticeReadInsert, {
  onSuccess(data, params) {
    for (let i = 0; i < list.value?.length; i++) {
      const item = list.value[i]
      if (item.id === params[0].id) {
        item.read = true
        break
      }
    }
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

function openDetail(item: IMemberNoticeItem) {
  item.read === false && runNoticeReadInsert({ id: item.id })
  router.push({
    path: '/message/message-detail',
    query: {
      created_at: item.start_time ?? item.created_at,
      content: item.content,
      image_url: item.image_url,
    },
  })
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
      <AppMessageAnnouncementItem
        v-for="item of formattedList" :key="item.id" :data="item" class="mb-[16px]" @click="openDetail(item)"
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
