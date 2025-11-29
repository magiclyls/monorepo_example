<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  currentPage?: number // 当前页码
  pageSize?: number // 每页数据量
  total: number // 总数据量
  loading?: boolean
  expand?: boolean // 是否展开
}
defineOptions({
  name: 'BaseShowMore',
})
const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  pageSize: 10,
  total: 0,
  loading: false,
  expand: true,
})
const emit = defineEmits(['update:currentPage', 'update:expand'])

const { currentPage, pageSize, total } = toRefs(props)

const hasMore = computed<boolean>(() => total.value > pageSize.value)
const loadDone = computed<boolean>(() => currentPage.value === Math.ceil(total.value / pageSize.value))

function onShowAllClick() {
  if (loadDone.value)
    emit('update:expand', true)
  else
    emit('update:currentPage', currentPage.value + 1)
}
function onHideALlClick() {
  emit('update:expand', false)
}
</script>

<template>
  <div v-if="hasMore">
    <BaseLoading v-if="loading" class="mt-[6px]" />
    <template v-else>
      <div v-if="loadDone && props.expand" class="cursor-pointer text-center text-[14px] leading-[24px]" @click="onHideALlClick()">
        {{ $t('hide_all') }}
      </div>
      <div v-else class="mb-[6px] mt-[4px] cursor-pointer text-center text-[14px]" @click="onShowAllClick()">
        {{ $t('show_more') }}
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>

</style>
