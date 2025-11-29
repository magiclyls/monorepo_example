<script setup lang='ts'>
import type { Column, CurrencyCode } from '@tg/types'
import { ApiMemberAgencyValidMemberDetail } from '@tg/apis'
import { AfunBaseInput, AfunBasePagination, AfunBaseSelect, AfunBaseTable } from '@tg/bccomponents'
import { useDebouncedRef, useList, useSelect } from '@tg/hooks'
import { useAppStore } from '@tg/stores'
import { application } from '@tg/utils'
import { timeToFormatFullTimeByBoss } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Message } from '~/utils'
import AppLoading from './AppLoading.vue'
import AppTooltip from './AppTooltip.vue'

interface Props {
  data: { pid: string, currencyId: CurrencyCode }
}
defineOptions({
  name: 'AppDialogPromoInviteDetail',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const { push } = useRouter()

const columns: Column[] = [
  {
    title: t('玩家'),
    align: 'center',
    dataIndex: 'username',
    slot: 'username',
  },
  {
    title: t('时间'),
    align: 'center',
    dataIndex: 'registered_at',
    slot: 'registered_at',
  },
  {
    title: t('状态'),
    align: 'center',
    dataIndex: 'state',
    slot: 'status',
  },
]

const { list: stateOptions, selected: state, valueToLabel } = useSelect([
  { label: t('全部'), value: 0 },
  { label: t('有效'), value: 1 },
  { label: t('无效'), value: 2 },
])
const username = useDebouncedRef({ value: '', delay: 1000, afterTrigger: goSearch })
const { data, loading, runAsync, prev, next, page, total } = useList(ApiMemberAgencyValidMemberDetail, {
  onError(err) {
    const obj = JSON.parse(err.message)
    if (obj.data === 'refresh') {
      Message.error(t('活动已结束'))
      push('/promotion')
      closeDialog()
    }
  },
}, { page_size: 10 })

const params = computed(() => ({
  pid: props.data.pid,
  username: username.value,
  state: state.value as 0 | 1 | 2,
  currency_id: props.data.currencyId,
  noNotify: true,
}))

const dataList = computed(() => {
  // 调试数据
  // return [
  //   { username: 'string', state: 1, registered_at: 123123 },
  //   { username: 'string', state: 2, registered_at: 123123 },
  //   { username: 'string', state: 1, registered_at: 123123 },
  //   { username: 'string', state: 2, registered_at: 123123 },
  // ]
  return data.value?.d ?? []
})

function goSearch() {
  if (isLogin.value)
    runAsync(params.value)
}

goSearch()
</script>

<template>
  <div class="p-[16px]" @touchstart.stop @touchmove.stop>
    <div class="search-box grid grid-cols-2 gap-[11px]">
      <AfunBaseSelect v-model="state" class="h-[40px] w-full" popper :options="stateOptions" @change="goSearch" />
      <AfunBaseInput v-model="username" search :place-holder="t('搜索账号')" style="--afun-base-input-padding-y:9px;" class="input-box" />
    </div>
    <AppLoading v-show="loading" :full-screen="false" class="mb-[16px]" :height="219" />
    <AfunBaseTable v-show="!loading" class="theme-table mb-[16px]" :columns="columns" :data-source="dataList">
      <template #username="{ record }">
        <div class="flex items-center justify-center">
          <span
            class="mr-[4px] inline-block max-w-[12ch] overflow-hidden text-ellipsis whitespace-nowrap font-semibold"
          >{{
            record.username }}</span>
          <AppTooltip :text="t('成功复制')" @click="application.copy(record.username)">
            <template #content>
              <div class="flex items-center">
                <BaseIcon name="uni-doc" />
              </div>
            </template>
          </AppTooltip>
        </div>
      </template>
      <template #registered_at="{ record }">
        {{ timeToFormatFullTimeByBoss(record.registered_at) }}
      </template>
      <template #status="{ record }">
        <span class="theme-text" :class="record.state === 1 ? 'text-[#24EE89]' : ''">
          {{ valueToLabel(record.state) }}
        </span>
      </template>
    </AfunBaseTable>
    <AfunBasePagination :total="total" :page="page" :page-size="10" @previous="prev" @next="next" />
  </div>
</template>

<style lang='scss' scoped>
.theme-option {
  text-align: center;
}

.theme-text {
  font-weight: 600;
}

.input-box {
  --tg-base-search-border-width: 0;
}

.search-box {
}

.theme-table {
}
</style>
