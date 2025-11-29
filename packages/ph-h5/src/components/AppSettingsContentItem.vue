<script setup lang='ts'>
import { PhBaseButton } from '@tg/bccomponents'
import { computed, ref, watch } from 'vue'

interface Props {
  /** 标题 */
  title: string
  /** 是否展示徽章  */
  badge?: boolean
  /** 最后一行 */
  lastOne?: boolean
  /** 按钮loading状态 */
  btnLoading?: boolean
  /** 是否验证 */
  verified?: boolean
  /** 按钮文字 */
  btnText: string
  /** 依赖数据变化 disabled */
  dependsDisabled?: any[]
  showHr?: boolean
  /** 是否在倒计时 */
  isCounting?: boolean
  /** 是否展示提交按钮 */
  showSubmitBtn?: boolean
}
defineOptions({
  name: 'AppSettingsContentItem',
})
const props = withDefaults(defineProps<Props>(), {
  lastOne: false,
  verified: false,
  badge: false,
  showHr: true,
  showSubmitBtn: true,
})
const emit = defineEmits(['submit'])

const initDisabled = ref(Boolean(props.dependsDisabled !== undefined
  && props.dependsDisabled && props.dependsDisabled.length))
const dependsData = computed(() =>
  props.dependsDisabled ? [...props.dependsDisabled] : [])

const onSubmit = function () {
  emit('submit')
  setTimeout(() => {
    if (props.dependsDisabled && props.dependsDisabled.length)
      initDisabled.value = true
  }, 150)
}

watch(() => dependsData.value, (val, old) => {
  if (val.length && old.length) {
    for (let i = 0; i < val.length; i++) {
      if (val[i] !== old[i]) {
        if (initDisabled.value)
          initDisabled.value = false
        break
      }
    }
  }
})
</script>

<template>
  <div
    class="flex flex-col gap-[16rem]"
    :class="{ 'not-last-one': !lastOne }"
  >
    <div class="">
      <div class="">
        <span class="text-[18rem] font-semibold">{{ props.title }}</span>
        <span v-if="props.badge" class="badge ml-[0.5rem]">{{ $t('已验证') }}</span>
      </div>
      <div v-if="$slots['top-desc']" class="mt-[8rem] text-[14rem] font-medium text-[#6D7693]">
        <slot name="top-desc" />
      </div>
    </div>
    <slot />
    <div v-if="showSubmitBtn" class="flex items-center justify-between">
      <div class="">
        <slot name="btm-left" />
      </div>
      <div class="">
        <slot name="btm-right" />
        <PhBaseButton
          :loading="btnLoading"
          :disabled="props.verified || initDisabled || isCounting"
          @click="onSubmit"
        >
          {{ $t(btnText) }}
        </PhBaseButton>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>
