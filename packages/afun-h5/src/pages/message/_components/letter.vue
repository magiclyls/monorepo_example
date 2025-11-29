<script setup lang='ts'>
import type { IMemberStationInfoItem } from '@tg/types'
import {
  ApiMemberStationInfoDetailDelete,
  ApiMemberStationInfoDetailUpdateState,
  ApiMemberStationInfoList,
} from '@tg/apis'
import { AfunBaseEmpty, AfunBaseImage, BaseList } from '@tg/bccomponents'
import { useMessageList, useNotificationState } from '@tg/hooks'
import { EventBusNames } from '@tg/types'
import { appEventBus, application } from '@tg/utils'
import { computed, onActivated, onBeforeUnmount, onDeactivated } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import AppMessageLetterItem from '~/components/AppMessageLetterItem.vue'

// 站内信
defineOptions({ name: 'Letter' })
const emit = defineEmits(['reState'])
const { runNotificationsCount } = useNotificationState()
const { t } = useI18n()
const router = useRouter()
const { list, total, page, getFormattedList, setList } = useMessageList()
const formattedList = getFormattedList(t)
const pageSize = 10

const params = computed(() => {
  return {
    page: page.value,
    page_size: pageSize,
  }
})

const { run, runAsync, loading } = useRequest(ApiMemberStationInfoList, {
  onSuccess(res) {
    if (res?.d) {
      setList(res.d, page.value === 1)
      if (page.value === 1) {
        total.value = res.t
      }
    }
  },
})

// 标记已读（ 站内信 ）
const {
  run: runStationInfoDetailUpdateState,
} = useRequest(ApiMemberStationInfoDetailUpdateState, {
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

// // 全部已读（ 站内信 ）
// const {
//   run: runMemberUpdateAllState,
// } = useRequest(ApiMemberStationInfoDetailUpdateAllState, {
//   onSuccess() {
//     list.value?.forEach((item) => {
//       item.read = true
//     })
//     emit('reState')
//   },
// })

// 删除站内信
const {
  runAsync: runAsyncZnxDelete,
} = useRequest(ApiMemberStationInfoDetailDelete, {
  onSuccess() {
    emit('reState')
  },
})

function loadMore() {
  page.value = page.value + 1
  run(params.value)
}

function reset() {
  page.value = 1
}

function openDetail(item: IMemberStationInfoItem) {
  item.read === false && runStationInfoDetailUpdateState({ id: item.id })
  router.push({
    path: '/message/message-detail',
    query: {
      created_at: item.created_at,
      content: item.msg,
    },
  })
}

// 删除
async function deleteZnx(item: IMemberStationInfoItem) {
  // 如果未讀，先標記為已讀
  if (item.read === false) {
    await runStationInfoDetailUpdateState({ id: item.id })
  }

  // 再執行刪除
  runAsyncZnxDelete({ id: item.id }).then(() => {
    const index = list.value.findIndex(a => a.id === item.id)
    if (index > -1) {
      list.value?.splice(index, 1)
    }
  })
}

function refreshData(ty?: string) {
  runNotificationsCount()
  if (ty === 'station_read')
    return

  if (ty === 'station') {
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
      <div class="text-[#0D2245]">
        <AppMessageLetterItem
          v-for="item of formattedList" :key="item.id" :data="item" class="mb-[16px]" @delete="deleteZnx" @click="openDetail(item)"
        />
      </div>
    </BaseList>
    <AfunBaseEmpty v-else class="mt-[16px]">
      <template #icon>
        <AfunBaseImage class="w-[96px] mt-[120px]" url="/m/afun-h5/png/notice_empty.png" />
      </template>
    </AfunBaseEmpty>
  </div>
</template>
