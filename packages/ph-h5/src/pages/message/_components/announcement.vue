<script setup lang='ts'>
import type { IMemberNoticeItem } from '@tg/types'
import { ApiMemberNoticeList, ApiMemberNoticeReadInsert } from '@tg/apis'
import { BaseList, PhBaseDialog, PhBaseEmpty, PhBaseImage } from '@tg/bccomponents'
import { useNotificationState } from '@tg/hooks'
import { IconUniNotice1 } from '@tg/icons'
import { EventBusNames } from '@tg/types'
import { appEventBus, application } from '@tg/utils'
import { computed, onActivated, onBeforeUnmount, onDeactivated, ref, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppMessageAnnouncementItem from '~/components/AppMessageAnnouncementItem.vue'

// 公告
defineOptions({ name: 'Announcement' })
const emit = defineEmits(['reState'])

const { runNotificationsCount } = useNotificationState()
const { t } = useI18n()

const showDetail = ref(false)
const showDetailId = ref('')
const page = ref(1)
const pageSize = 10
// 数据
const list = ref<IMemberNoticeItem[]>([])
// 总数
const total = ref(0)
const { run, runAsync, loading } = useRequest(ApiMemberNoticeList, {
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

const _list = computed(() => list.value.map((a) => {
  return {
    ...a,
    title: getTitle(a.title),
  }
}))

const params = computed(() => {
  return {
    types: '1',
    location: 'notification',
    page: page.value,
    page_size: pageSize,
  }
})

const showingDetailObj = computed(() => _list.value.find(a => a.id === showDetailId.value))

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
  item.read === false && runNoticeReadInsert({ id: item.id })
}

function refreshData(ty?: any) {
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
  <div class="mt-[16rem]">
    <BaseList
      v-if="list && list.length > 0" :finished="list.length > 0 ? list.length >= total : false"
      :loading="loading" :need-stop="false" class="app-notice-notify" @load="loadMore"
    >
      <AppMessageAnnouncementItem
        v-for="item of _list" :key="item.id" :data="item" class="mb-[16rem]"
        @click="openDialogDetail(item)"
      >
        {{ item }}
      </AppMessageAnnouncementItem>
    </BaseList>
    <PhBaseEmpty v-else />

    <PhBaseDialog
      v-if="list && list.length > 0" v-model="showDetail" :title="t('公告')" :icon="IconUniNotice1"
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
      <div class="w-full  min-h-[284rem]">
        <template v-if="showingDetailObj?.pop_up_type === 1">
          <div class="text-[20rem] font-[500] leading-[28rem] text-center my-[9rem]">
            {{ showingDetailObj?.title }}
          </div>
          <div class="text-[#6D7693] px-[16rem] pb-[32rem] text[14rem] font-[500]" style="line-height: normal;" v-html="showingDetailObj.content" />
        </template>
        <!-- 图片 -->
        <div v-if="showingDetailObj?.pop_up_type === 2" style="--tg-base-img-style-radius: 0 0 4px 4px">
          <PhBaseImage
            class="h-full w-full" :url="showingDetailObj.image_url"
            is-network
          />
        </div>
      </div>
    </PhBaseDialog>
  </div>
</template>

<style lang='scss' scoped>

</style>
