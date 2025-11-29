<script lang="ts" setup>
import { ApiMemberFrontLoginLogList } from '@tg/apis'
import { AfunBaseButton, AfunBaseEmpty, AfunBaseLoading, AfunBasePagination, AfunBaseTable } from '@tg/bccomponents'
import { useList } from '@tg/hooks'
import { timeToFromNow } from '@tg/vue-i18n'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppPageLayout from '~/components/AppPageLayout.vue'

interface Column {
  title?: string
  width?: number | string
  dataIndex: string
  slot?: string
  align?: 'left' | 'center' | 'right'
  color: string
}

defineOptions({ name: 'LoginRecord' })
const { t } = useI18n()

const popperShow = ref<boolean[]>([])
const popperShow2 = ref<boolean[]>([])
const columns: Column[] = [
  {
    title: t('浏览器'),
    dataIndex: 'browser',
    width: 150,
    align: 'center',
    slot: 'browser',
    color: '#6D7693',
  },
  {
    title: t('地区'),
    dataIndex: 'near',
    width: 150,
    align: 'center',
    slot: 'near',
    color: '#6D7693',
  },
  {
    title: t('IP'),
    dataIndex: 'addr',
    width: 150,
    align: 'center',
    color: '#6D7693',
  },
  {
    title: t('登入时间'),
    dataIndex: 'lastUsed',
    width: 150,
    align: 'center',
    color: '#6D7693',
  },
]
const {
  list: loginLogList,
  runAsync: loginLogRunAsync,
  loading,
  page,
  page_size,
  total,
  prev,
  next,
} = useList(ApiMemberFrontLoginLogList, {}, { page_size: 10 })

function handleShow(index: number) {
  setTimeout(() => {
    popperShow.value[index] = false
  }, 3000)
}

function handleShow2(index: number) {
  setTimeout(() => {
    popperShow2.value[index] = false
  }, 3000)
}

const tableData = computed(() => {
  if (loginLogList.value) {
    return loginLogList.value.map((item) => {
      const temp = {
        browser: item.browser,
        near: item.ipaddress,
        addr: item.loginip,
        lastUsed: item.created_at ? timeToFromNow(item.created_at) : '-',
      }
      return temp
    })
  }
  return []
})

onMounted(() => loginLogRunAsync())
</script>

<template>
  <AppPageLayout :title="t('登入日志')">
    <div class="bg-[#0F212E] rounded-[8px] p-[12px]">
      <div v-if="!loading && tableData.length > 0">
        <AfunBaseTable
          style="--afun-table-odd-background: #1A2C38;--afun-table-th-color: #B1BAD3; --afun-table-td-color: #fff"
          :columns="columns"
          :data-source="tableData"
        >
          <template #action="{ record }">
            <div class="slot-action">
              <AfunBaseButton
                type="text"
                size="xs"
                style="--afun-base-button-padding-x:7px;
            --afun-base-button-padding-y:8px;"
              >
                <span>
                  {{ record.action }}
                </span>
              </AfunBaseButton>
            </div>
          </template>
          <template #browser="{ record, index }">
            <VDropdown
              v-model:shown="popperShow[index]"
              :distance="6"
              @show="handleShow(index)"
            >
              <div>
                {{ record.browser.length > 20
                  ? (`${record.browser.slice(0, 20)}...`)
                  : record.browser }}
              </div>
              <template #popper>
                <div class="popper-text">
                  {{ record.browser }}
                </div>
              </template>
            </VDropdown>
          </template>
          <template #near="{ record, index }">
            <VDropdown
              v-model:shown="popperShow2[index]"
              :distance="6"
              @show="handleShow2(index)"
            >
              <div>
                {{ record.near.length > 20
                  ? (`${record.near.slice(0, 20)}...`)
                  : record.near }}
              </div>
              <template #popper>
                <div class="popper-text">
                  {{ record.near }}
                </div>
              </template>
            </VDropdown>
          </template>
        </AfunBaseTable>
        <AfunBasePagination
          class="mt-[18px] mb-[8px]"
          :page="page"
          :page-size="page_size"
          :total="total"
          @previous="prev"
          @next="next"
        />
      </div>
      <div v-else-if="loading" class="w-full h-[156px] flex items-center justify-center">
        <AfunBaseLoading />
      </div>
      <AfunBaseEmpty v-else img="/m/afun-h5/png/uni-table-empty.png" class=" h-[156px]" />
    </div>
  </AppPageLayout>
</template>
