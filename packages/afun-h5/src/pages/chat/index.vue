<script lang="ts" setup>
import { inject } from 'vue'
import Appchat from './_components/AppChat.vue'

defineOptions({ name: 'Chat' })

const setTitle = inject('setTitle', (v: string) => { })
setTitle('chat_room')
</script>

<template>
  <section class="scroll-y tg-chat-page">
    <Appchat />
  </section>
</template>

<style lang="scss" scoped>
  .tg-chat-page {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
