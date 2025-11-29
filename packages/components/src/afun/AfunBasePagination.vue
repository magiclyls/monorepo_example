<script setup lang='ts'>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  page: number
  pageSize: number
  total: number
}

defineOptions({ name: 'AfunBasePagination' })

const props = defineProps<Props>()
const emit = defineEmits(['previous', 'next'])

const { t } = useI18n()

const maxPage = computed(() => {
  return Math.ceil(props.total / props.pageSize)
})
const disabledPre = computed(() => props.total === 0 || props.page === 1)
const disabledNext = computed(() => props.total === 0 || props.page === maxPage.value)

function previous() {
  if (disabledPre.value)
    return
  emit('previous')
}
function next() {
  if (disabledNext.value)
    return
  emit('next')
}
</script>

<template>
  <div class="w-full flex items-center justify-center">
    <div class="btn mr-[20px]" :class="{ active: !disabledPre }" @click="previous">
      {{ t('上一页') }}
    </div>
    <div class="btn" :class="{ active: !disabledNext }" @click="next">
      {{ t('下一页') }}
    </div>
  </div>
</template>

<style lang='scss' scoped>
.btn {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  line-height: 20px;
  opacity: 0.35;
  user-select: none;

  &.active {
    cursor: pointer;
    opacity: 1;
  }
}
</style>
