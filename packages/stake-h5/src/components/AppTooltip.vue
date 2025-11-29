<script setup lang="ts">
import { IconLotCopy } from '@tg/icons'

interface Props {
  /** 提示文本 */
  text?: string
  /** 触发图标icon */
  iconName?: string
  /** 是否自动隐藏 */
  autoHide?: boolean
  /** 自动隐藏毫秒数 */
  hideTimeout?: number
  /** 触发文本 */
  content?: string
  /** 弹出类名 */
  popperClazz?: string
  placement?:string
}
defineOptions({
  name: 'AppTooltip',
})
const props = withDefaults(defineProps<Props>(), {
  autoHide: true,
  hideTimeout: 2000,
  placement:'top'
})

const { bool: toolShown, setFalse: setToolFalse } = useBoolean(false)

let timer: NodeJS.Timeout | null = null

function closeTool() {
  if (props.autoHide) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      setToolFalse()
    }, props.hideTimeout)
  }
}

function clearHide() {
  timer && clearTimeout(timer)
  timer = null
}
</script>

<template>
  <VTooltip
    v-model:shown="toolShown"
    :placement="placement"
    :triggers="['click','hover']"
    v-bind="$attrs"
    :popper-class="[popperClazz]"
    @show="closeTool"
    @hide="clearHide"
  >
    <div class="center">
      <slot name="content">
        <component v-if="iconName" :is="iconName ?? ''" />
        <span v-if="content">{{ content }}</span>
      </slot>
    </div>
    <template #popper>
      <div class="tiny-menu-item-title">
        <slot name="popper">
          {{ text }}
        </slot>
      </div>
    </template>
  </VTooltip>
</template>

<style lang="scss" scoped></style>
