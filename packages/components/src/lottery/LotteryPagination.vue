<script setup lang="ts" name="LotteryPagination">
import { IconLotPageBack } from '@tg/icons'
import { computed } from 'vue'

interface Props {
  total: number
  curPage: number
  project?: string
}
const props = withDefaults(defineProps<Props>(), {
  project: 'ph-h5',
})
const emits = defineEmits(['last', 'next'])
const totalPage = computed(() => Math.ceil(props.total / 10))
</script>

<template>
  <div class="page-bg w-full center text-[12rem] h-[70rem]">
    <div
      class="size-[36rem] text-[26rem] center rounded-[5rem] cursor-pointer pagination-btn"
      :class="{ 'pagination-btn-disabled': curPage === 1 }"
      @click="emits('last')"
    >
      <IconLotPageBack />
    </div>
    <div class="min-w-[80rem] text-center font-[500]">
      {{ `${curPage}/${totalPage}` }}
    </div>
    <div
      class="size-[36rem] center rounded-[5rem] text-[26rem] cursor-pointer pagination-btn"
      :class="{ 'pagination-btn-disabled': curPage === totalPage }"
      @click="emits('next')"
    >
      <IconLotPageBack class="rotate-180" />
    </div>
  </div>
</template>
