<script setup lang="ts">
import { IconLotCopy } from '@tg/icons'
import { Message } from '~/utils'

interface Props {
  /** 提示文本 */
  text?: string
}
defineOptions({
  name: 'AppTooltip',
})
const props = withDefaults(defineProps<Props>(), {
})

function tip() {
  if (props.text)
    Message.success(props.text)
}
</script>

<template>
  <div class="center" @click="tip">
    <slot name="content">
      <IconLotCopy class="tipicon" />
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.tipicon {
  font-size: 18rem;
  color: #9dabc8;
}
</style>
