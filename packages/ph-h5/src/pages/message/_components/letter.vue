<script setup lang='ts'>
import type { IMemberStationInfoItem } from '@tg/types'
import {
  ApiMemberStationInfoDetailDelete,
  ApiMemberStationInfoDetailUpdateAllState,
  ApiMemberStationInfoDetailUpdateState,
  ApiMemberStationInfoList,
} from '@tg/apis'
import { BaseList, PhBaseDialog, PhBaseEmpty } from '@tg/bccomponents'
import { useNotificationState } from '@tg/hooks'
import { IconNotice } from '@tg/icons'
import { EventBusNames } from '@tg/types'
import { appEventBus, application } from '@tg/utils'
import { computed, onActivated, onBeforeUnmount, onDeactivated, ref, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppMessageLetterItem from '~/components/AppMessageLetterItem.vue'

// 站内信
defineOptions({ name: 'Letter' })
const emit = defineEmits(['reState'])

const { runNotificationsCount } = useNotificationState()
const { t } = useI18n()

const showDetail = ref(false)
const showDetailId = ref('')
const page = ref(1)
const pageSize = 10
// 数据
const list = ref<IMemberStationInfoItem[]>([])
// 总数
const total = ref(0)

const params = computed(() => {
  return {
    page: page.value,
    page_size: pageSize,
  }
})
const { run, runAsync, loading } = useRequest(ApiMemberStationInfoList, {
  onSuccess(res) {
    if (res.d) {
      if (page.value === 1) {
        total.value = res.t
        list.value = res.d
      }
      else {
        list.value = [...toRaw(list.value ?? []), ...res.d]
      }
    }
  },
})

const _list = computed(() => list.value.map((a) => {
  return {
    ...a,
    title: getTitle(a.title),
  }
}))
const showingDetailObj = computed(() => _list.value.find(a => a.id === showDetailId.value))

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

// 全部已读（ 站内信 ）
const {
  run: runMemberUpdateAllState,
} = useRequest(ApiMemberStationInfoDetailUpdateAllState, {
  onSuccess() {
    list.value?.forEach((item) => {
      item.read = true
    })
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

function loadMore() {
  page.value = page.value + 1
  run(params.value)
}

function reset() {
  page.value = 1
}

function openDialogDetail(item: any) {
  showDetail.value = true
  showDetailId.value = item.id
  !item.read && runStationInfoDetailUpdateState({ id: item.id })
}

function getTitle(title: string) {
  switch (title) {
    case 'withdraw_success':
      return t('提款成功')
    case 'withdraw_fail':
      return t('提款失败')
    case 'deposit_success':
      return t('存款成功')
    case 'deposit_fail':
      return t('存款失败')
    case 'deposit_in_process':
      return t('存款进行中')
    case 'withdraw_in_process':
      return t('提款进行中')
    default:
      return title
  }
}

// 删除
function deleteZnx(id: string) {
  runAsyncZnxDelete({ id }).then(() => {
    const index = list.value.findIndex(a => a.id === id)
    if (index > -1) {
      list.value?.splice(index, 1)
    }
  })
}

function refreshData(ty?: any) {
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
  <div>
    <BaseList
      v-if="list && list.length > 0" :finished="list.length > 0 ? list.length >= total : false"
      :loading="loading" :need-stop="false" class="app-notice-notify" @load="loadMore"
    >
      <div class="text-[#0D2245]">
        <div class="text-right my-[16rem] pr-[4rem]">
          <span class="cursor-pointer text-[14rem] font-[500] leading-[20rem]" @click="runMemberUpdateAllState">{{ t('标记全部为已读') }}</span>
        </div>

        <AppMessageLetterItem
          v-for="item of _list" :key="item.id" :data="item" class="mb-[16rem]"
          @click="openDialogDetail(item)" @delete="deleteZnx"
        >
          {{ item }}
        </AppMessageLetterItem>
      </div>
    </BaseList>
    <PhBaseEmpty v-else class="mt-[16rem]" />

    <PhBaseDialog
      v-if="list && list.length > 0" v-model="showDetail" :title="t('站内信')" :icon="IconNotice"
      style="--ph-base-dialog-border-color: #ebebeb;
            --ph-base-dialog-header-height: 39rem;
            --ph-base-dialog-header-padding-top: 0;
            --ph-base-dialog-close-top: 10rem;
            --ph-base-dialog-icon-size: 18rem;
            --ph-base-dialog-header-font-size: 14rem;
            --ph-base-dialog-header-font-weight: 400;
            --ph-base-dialog-header-color: #6d7693;
            --ph-base-dialog-icon-color: #f23038;
            --ph-base-dialog-close-color: #9DABC8;
            --ph-base-dialog-header-background-color: #f6f7f8;"
    >
      <div class="w-full pt-[9rem] min-h-[284rem]">
        <div class="text-[20rem] font-[500] leading-[28rem] text-center mb-[9rem]">
          {{ showingDetailObj?.title }}
        </div>
        <div class="text-[#6D7693] px-[16rem] pb-[32rem] text[14rem] font-[500]" style="line-height: normal;">
          {{ showingDetailObj?.msg }}
        </div>
      </div>
    </PhBaseDialog>
  </div>
</template>
