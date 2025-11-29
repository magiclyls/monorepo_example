<script setup lang='ts'>
import { useElementBounding, useIntersectionObserver, useScroll } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  finished: boolean
  loading: boolean
  finishedTxtShowOverHeight?: boolean
  needStop?: boolean
  hideLoading?: boolean
  showNoMore?: boolean
}
defineOptions({
  name: 'BaseList',
})
const props = withDefaults(defineProps<Props>(), { needStop: true, showNoMore: true })
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
const moreText = computed(() => props.finished ? t('没有更多了') : t('加载中'))
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
  <div ref="BaseListRef" class="scroll-y base-list hide-scroll-bar" :class="{ 'over-page': overHeight }">
    <div ref="innerRef">
      <slot />
    </div>
    <div v-if="!showNoMore && moreText === t('没有更多了')" class="h-[12rem]" />
    <div v-show="(finished && finishedTxtShowOverHeight) ? overHeight : true" v-else ref="target" class="more">
      {{ moreText }}
    </div>
  </div>
</template>

<style lang='scss' scoped>
.base-list {
  width: 100%;
  height: 100%;

  .more {
    padding: 13rem 16rem;
    font-size: 12rem;
    color: #b1bad3;
    text-align: center;
    line-height: 1.5;
  }
}
</style>
