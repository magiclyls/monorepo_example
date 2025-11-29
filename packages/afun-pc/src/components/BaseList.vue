<script setup lang='ts'>
interface Props {
  finished: boolean
  loading: boolean
  finishedTxtShowOverHeight?: boolean
  needStop?: boolean
}
defineOptions({
  name: 'BaseList',
})
const props = withDefaults(defineProps<Props>(), { needStop: true })
const emit = defineEmits(['load'])

const { t } = useI18n()

const BaseListRef = ref(null)
const target = ref(null)
const innerRef = ref(null)
const { y: baseListScrollY } = useScroll(BaseListRef, { behavior: 'smooth' })

const isVisible = ref(false)
const count = ref(0)

const { height } = useElementBounding(BaseListRef)
const { height: innerHeight } = useElementBounding(innerRef)

const { stop, isSupported } = useIntersectionObserver(
  target,
  ([{ isIntersecting }], observerElement) => {
    if (isSupported.value) {
      isVisible.value = isIntersecting || false
      if (isIntersecting && !props.finished && !props.loading) {
        emit('load')
      }
      else if (isIntersecting && !props.finished && props.loading) {
        count.value = count.value + 1
      }
      else if (isIntersecting && props.finished) {
        if (props.needStop)
          stop()
      }
    }
  },
)
const moreText = computed(() => props.finished ? t('no_more') : t('loading_label'))
const overHeight = computed(() => innerHeight.value > height.value)

defineExpose({
  getScrollY: () => baseListScrollY.value,
})

watch(() => props.loading, (val, old) => {
  if (!val && old) {
    if (isVisible.value) {
      if (count.value > 0) {
        console.log('9999999999 watch props.loading ======== ', val, old)
        count.value = 0
        emit('load')
      }
    }
  }
})
</script>

<template>
  <div ref="BaseListRef" class="scroll-y base-list" :class="{ 'over-page': overHeight }">
    <div ref="innerRef">
      <slot />
    </div>
    <!-- :style="{ color: finished ? 'red' : 'white' }" -->
    <div v-show="(finished && finishedTxtShowOverHeight) ? overHeight : true" ref="target" class="more">
      {{ moreText }}
    </div>
  </div>
</template>

<style lang='scss' scoped>
.base-list {
  width: 100%;
  height: 100%;

  .more {
    padding: var(--tg-spacing-button-padding-vertical-sm) var(--tg-spacing-button-padding-horizontal-sm);
    font-size: var(--tg-font-size-xs);
    color: var(--tg-text-lightgrey);
    text-align: center;
    line-height: 1.5;
  }
}
</style>
