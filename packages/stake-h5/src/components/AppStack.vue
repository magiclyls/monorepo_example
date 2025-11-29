<script setup lang='ts'>
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
    scrollMainContentToTop()
}
const toNext = function () {
  if (props.paginationData.total === 0 || props.paginationData.page === maxPage.value)
    return
  emit('next')
  if (props.scroll)
    scrollMainContentToTop()
}
</script>

<template>
  <div class="app-pagination">
    <BaseButton
      type="text" size="none" class="pagination-previous mr-[24px]" :disabled="props.paginationData.total === 0
        || props.paginationData.page === 1" :class="{
        'no-data': props.paginationData.total === 0
          || props.paginationData.page === 1,
      }" @click="toPrevious"
    >
      {{ $t('h5_header_menu_my_bets_sports_empty_previous_page') }}
    </BaseButton>
    <BaseButton
      type="text" size="none" class="pagination-next" :disabled="props.paginationData.total === 0
        || props.paginationData.page === maxPage" :class="{
        'no-data': props.paginationData.total === 0
          || props.paginationData.page === maxPage,
      }" @click="toNext"
    >
      {{ $t('page_next') }}
    </BaseButton>
  </div>
</template>

<style lang='scss' scoped>
.app-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--tg-font-size-default);

  @include webTheme('green') {
    --tg-base-button-text-default-color: #fff;
  }
}
.no-data {
    @include webTheme('green') {
      --tg-base-button-text-default-color: var(--tg-text-lightgrey);
    }
  }
</style>
