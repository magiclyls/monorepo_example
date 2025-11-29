<script lang="ts" setup>
import { BaseButton } from '@tg/bccomponents'
import { application } from '@tg/utils'

interface Props {
  type: 'casino' | 'sport'
  order: string
}
defineOptions({
  name: 'AppChatMsgOrder',
})
defineProps<Props>()
</script>
<!-- import { addUrlSearch, application, Message } from '@tg/utils' -->

<template>
  <BaseButton type="none" size="none">
    <span class="chat-msg-order">
      <span class="label">{{ type }}: #</span>
      <span class="order">{{ application.formatNumber(order) }}</span>
    </span>
  </BaseButton>
</template>

<style lang="scss" scoped>
button {
  height: auto;
  font-size: 14rem;
  color: #b1bad3;
  line-height: inherit;
}
.chat-msg-order {
  text-decoration: underline;
  .label {
    text-transform: capitalize;
  }
}
</style>
