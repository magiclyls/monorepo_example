<script setup lang="ts">
import { PhBaseSelect } from '@tg/bccomponents'
import { IconPaginationArrowLeft, IconPaginationArrowRight } from '@tg/icons'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  currentPage: number
  pageSize: number
  total: number
  pageSizeOptions?: IOption[]
}>()

const emits = defineEmits(['update:currentPage', 'update:pageSize'])

const { t } = useI18n()

interface IOption {
  label: string
  value: any
  [key: string]: any
}

const page = computed({
  get: () => props.currentPage,
  set: val => emits('update:currentPage', val),
})

const localPageSize = ref(props.pageSize)

watch(localPageSize, (val) => {
  emits('update:pageSize', val)
  // 改变 pageSize 后重置页码为 1
  emits('update:currentPage', 1)
})

const pageSizeOptions = computed(() => props.pageSizeOptions || [
  { label: `25条/每页`, value: 25 },
  { label: `50条/每页`, value: 50 },
  { label: `75条/每页`, value: 75 },
])

const totalPages = computed(() => {
  return Math.ceil(props.total / localPageSize.value) || 1
})

function prevPage() {
  if (page.value > 1)
    page.value--
}

function nextPage() {
  if (page.value < totalPages.value)
    page.value++
}
</script>

<template>
  <div class="flex items-center gap-[6rem] text-[#0D2245] text-[14rem] font-[600]">
    <!-- 当前页 / 总页数 -->
    <span>{{ page }}/{{ totalPages }}{{ t('页') }}</span>

    <!-- 上一页按钮 -->
    <button
      class="w-[36rem] h-[36rem] flex items-center justify-center border rounded-[4rem] border-[#EBEBEB]"
      :disabled="page <= 1"
      @click="prevPage"
    >
      <span class="text-[12rem]" :style="[page <= 1 ? 'color: #c1c9dc' : '']">
        <IconPaginationArrowLeft />
      </span>
    </button>

    <!-- 下一页按钮 -->
    <button
      class="w-[36rem] h-[36rem] flex items-center justify-center border rounded-[4rem] border-[#EBEBEB]"
      :disabled="page >= totalPages"
      @click="nextPage"
    >
      <span class="text-[12rem]" :style="[page >= totalPages ? 'color: #c1c9dc' : '']">
        <IconPaginationArrowRight />
      </span>
    </button>

    <!-- 每页条数选择 -->
    <PhBaseSelect v-model="localPageSize" :options="pageSizeOptions" style="--ph-base-select-background-color: #fff; --ph-base-select-height: 36rem">
      <template #label="{ data, isMenuShown }">
        <div
          class="w-full h-[36rem] leading-[36rem] px-[8rem] text-[14rem] font-[600] rounded-[6rem] border-solid border-[1rem] border-[#EBEBEB] pr-[28rem] bg-[#EBEBEB]"
          :class="isMenuShown ? 'border-[#F23038]' : ''"
        >
          <span>{{ data?.label }}</span>
        </div>
      </template>
    </PhBaseSelect>
  </div>
</template>
