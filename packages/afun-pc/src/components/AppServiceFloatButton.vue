<script setup lang='ts'>
defineOptions({
  name: 'AppServiceFloatButton',
})
const { t } = useI18n()
const { openService } = useService()
const { theme } = storeToRefs(useAppStore())
const { rightWidth, isMobile, bodyWidth, width } = storeToRefs(useWindowStore())
const { rightIsExpand } = useRightSidebar()
const { leftIsExpand } = useLeftSidebar()

// 有皮肤的情况下基础宽度
const _baseWidth = ref(0)

const right = computed(() => {
  return rightIsExpand.value ? `${+rightWidth.value.split('px')[0] + 16}px` : '16px'
})
const left = computed(() => {
  if (isMobile.value) {
    if (isShowServiceFloatSites())
      return _baseWidth.value - 68

    return ((window.innerWidth - bodyWidth.value) / 2) + 10
  }
  return undefined
})
const _style = computed(() => {
  if (isMobile.value) {
    return {
      left: `${left.value}px`,
      bottom: '85px',
    }
  }
  return {
    right: 0,
    bottom: '8px',
    transform: `translate(-${right.value})`,
  }
})

function onClickHandler() {
  openService({ isFootBar: false, needDeal: true })
}

watch(bodyWidth, (a) => {
  if (theme.value === '')
    _baseWidth.value = window.innerWidth
  else
    _baseWidth.value = window.innerWidth - ((window.innerWidth - a) / 2)
}, { immediate: true })
watch(width, (newWidth) => {
  if (theme.value === '')
    _baseWidth.value = newWidth
  else
    _baseWidth.value = newWidth - ((newWidth - bodyWidth.value) / 2)
}, { immediate: true })
</script>

<template>
  <div
    v-show="isMobile && isShowServiceFloatSites() ? (!rightIsExpand && !leftIsExpand) : true"
    class="fixed z-[100] duration-[0.25s]"
    :style="_style"
  >
    <VTooltip :triggers="['hover']">
      <div class="flex cursor-pointer items-center text-[56px]" @click="onClickHandler">
        <BaseImage url="/png/icon/uni-kefu2.png" class="w-[56px]" />
      </div>

      <template #popper>
        <div class="tiny-menu-item-title">
          {{ t('home_left_sidebar_online_support') }}
        </div>
      </template>
    </VTooltip>
  </div>
</template>

<style lang='scss' scoped>
.cus-btn {
  --tg-icon-color: var(--tg-text-white);
  &:hover {
    --tg-base-icon-color: var(--tg-text-white);
  }
}
</style>
