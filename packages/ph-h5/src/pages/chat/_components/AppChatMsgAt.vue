<script lang="ts" setup>
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'

interface Props {
  user: {
    name: string // 包含 @
    id?: string
    [k: string]: any
  }
}
defineOptions({
  name: 'AppChatMsgAt',
})
defineProps<Props>()

const { userInfo } = storeToRefs(useAppStore())
// const { openStatisticsDialog } = useStatisticsDialog()
function openStatisticsDialog(username: string) {
}
</script>

<template>
  <!-- :href="`?name=${user.name}&id=${user.id}&modal=user`" -->
  <span
    class="chat-msg-at" :class="{ 'your-self': userInfo && userInfo.username === user.name.slice(1) }"
    @click="openStatisticsDialog(user.name.slice(1))"
  >
    <a>
      <span>{{ user.name }}</span>
    </a>
  </span>
</template>

<style lang="scss" scoped>
  .chat-msg-at {
  --tg-text-lightgrey: #b1bad3;
  --tg-secondary-dark: #f5f5f5;
  --tg-text-white: #111111;
  --tg-text-purple: #484848;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 2eem;
  font-size: 14rem;
  font-weight: 600;
  padding: 0 4rem;
  white-space: nowrap;
  color: #b1bad3;
  background: #0f212e;
  line-height: inherit;

  a {
    color: #b1bad3;
    transition: color 0.2s;
  }

  a:hover {
    color: #fff;
  }

  &.your-self {
    background: var(--tg-text-purple);
  }
}
</style>
