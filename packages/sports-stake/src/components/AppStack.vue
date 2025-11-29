<script setup lang='ts'>
import { SSBaseButton } from '@tg/bccomponents'
import { scrollToTop } from '@tg/utils'
import { computed } from 'vue'

interface Props {
  paginationData: {
    pageSize: number // 每页大小
    page: number // 当前页
    total: number // 总数
  }
  scroll?: boolean
}
defineOptions({
  name: 'AppStack',
})
const props = withDefaults(defineProps<Props>(), {
  paginationData() {
    return {
      pageSize: 10,
      page: 1,
      total: 0,
    }
  },
})
const emit = defineEmits(['previous', 'next'])

const maxPage = computed(() => {
  return Math.ceil(props.paginationData.total / props.paginationData.pageSize)
})

const toPrevious = function () {
  if (props.paginationData.total === 0 || props.paginationData.page === 1)
    return
  emit('previous')
  if (props.scroll)
    scrollToTop()
}
const toNext = function () {
  if (props.paginationData.total === 0 || props.paginationData.page === maxPage.value)
    return
  emit('next')
  if (props.scroll)
    scrollToTop()
}
</script>

<template>
  <div class="app-pagination">
    <SSBaseButton
      type="text" size="none" class="pagination-previous mr-24" :disabled="props.paginationData.total === 0
        || props.paginationData.page === 1" :class="{
        'no-data': props.paginationData.total === 0
          || props.paginationData.page === 1,
      }" @click="toPrevious"
    >
      {{ $t('上一页') }}
    </SSBaseButton>
    <SSBaseButton
      type="text" size="none" class="pagination-next" :disabled="props.paginationData.total === 0
        || props.paginationData.page === maxPage" :class="{
        'no-data': props.paginationData.total === 0
          || props.paginationData.page === maxPage,
      }" @click="toNext"
    >
      {{ $t('下一页') }}
    </SSBaseButton>
  </div>
</template>

<style lang='scss' scoped>
.app-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14rem;
}
</style>
