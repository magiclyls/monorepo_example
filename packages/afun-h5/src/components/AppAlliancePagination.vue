<script setup lang="ts">
import { AfunBaseSelect } from '@tg/bccomponents'
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
  <div class="flex items-center gap-[6px] text-[#0D2245] text-[14px] font-[600]">
    <!-- 当前页 / 总页数 -->
    <span>{{ page }}/{{ totalPages }}{{ t('页') }}</span>

    <!-- 上一页按钮 -->
    <button
      class="w-[36px] h-[36px] flex items-center justify-center border rounded-[4px] border-[#EBEBEB]"
      :disabled="page <= 1"
      @click="prevPage"
    >
      <span class="text-[12px]" :style="[page <= 1 ? 'color: #c1c9dc' : '']">
        <IconPaginationArrowLeft />
      </span>
    </button>

    <!-- 下一页按钮 -->
    <button
      class="w-[36px] h-[36px] flex items-center justify-center border rounded-[4px] border-[#EBEBEB]"
      :disabled="page >= totalPages"
      @click="nextPage"
    >
      <span class="text-[12px]" :style="[page >= totalPages ? 'color: #c1c9dc' : '']">
        <IconPaginationArrowRight />
      </span>
    </button>

    <!-- 每页条数选择 -->
    <AfunBaseSelect v-model="localPageSize" :options="pageSizeOptions" style="--afun-base-select-background-color: #fff; --afun-base-select-height: 36px">
      <template #label="{ data, isMenuShown }">
        <div
          class="w-full h-[36px] leading-[36px] px-[8px] text-[14px] font-[600] rounded-[6px] border-solid border-[1px] border-[#EBEBEB] pr-[28px] bg-[#EBEBEB]"
          :class="isMenuShown ? 'border-[#F23038]' : ''"
        >
          <span>{{ data?.label }}</span>
        </div>
      </template>
    </AfunBaseSelect>
  </div>
</template>
