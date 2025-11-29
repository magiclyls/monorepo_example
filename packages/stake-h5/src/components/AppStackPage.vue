<script setup lang='ts'>
import { IconPageLeft, IconPageRight, IconPageDown } from '@tg/icons'

interface Props {
  paginationData: {
    pageSize: number // 每页大小
    page: number // 当前页
    total: number // 总数
  }
  scroll?: boolean
  pageOptions?: Array<any>
}
defineOptions({
  name: 'AppStack',
})
const props = withDefaults(defineProps<Props>(), {
  pageOptions() {
    return [5, 10, 20, 30]
  },
  paginationData() {
    return {
      pageSize: 10,
      page: 1,
      total: 0,
    }
  },
})

const emit = defineEmits(['previous', 'next', 'sizeChange'])
const { t } = useI18n()

const maxPage = computed(() => {
  return Math.ceil(props.paginationData.total / props.paginationData.pageSize)
})

const toPrevious = function () {
  if (props.paginationData.total === 0 || props.paginationData.page === 1)
    return
  emit('previous')
  if (props.scroll)
    scrollMainContentToTop()
}
const toNext = function () {
  if (props.paginationData.total === 0 || props.paginationData.page === maxPage.value)
    return
  emit('next')
  if (props.scroll)
    scrollMainContentToTop()
}

const sizeChange = function (event: any) {
  emit('sizeChange', Number(event.target.value))
  if (props.scroll)
    scrollMainContentToTop()
}
</script>

<template>
  <div class="flex items-center justify-end gap-[6px]">
    <div class="text-tg-text-white">
      {{ paginationData.page }}/{{ maxPage }}{{ t('page_label') }}
    </div>
    <div
      class="center h-[36px] w-[36px] border border-[#2F5366] rounded-[4px] border-solid"
      :class="{ disabled: paginationData.total === 0 || paginationData.page === 1 }" @click="toPrevious"
    >
      <IconPageLeft class="text-[12px]" name="page-left" />
    </div>
    <div
      class="center h-[36px] w-[36px] border border-[#2F5366] rounded-[4px] border-solid"
      :class="{ disabled: paginationData.total === 0 || paginationData.page === maxPage }" @click="toNext"
    >
      <IconPageRight class="text-[12px]" name="page-right" />
    </div>
    <div class="center text-tg-text-white h-[36px] rounded-[4px] bg-[#0F212E] px-[8px]">
      <select class="bg-transparent" :value="paginationData.pageSize" @change="sizeChange">
        <option v-for="size in [5, 10, 25, 50]" :key="size" :value="size">
          {{ size }}{{ t('page_sizer_label') }}
        </option>
      </select>
      <IconPageDown class="text-[14px]" name="page-down" />
    </div>
  </div>
</template>

<style lang='scss' scoped>
.disabled {
  opacity: .5;
}
</style>
