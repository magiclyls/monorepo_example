<script setup lang="ts">
import { AfunBaseImage } from '@tg/bccomponents'
import { allEmojis } from '@tg/stores'

import { computed } from 'vue'
import AppChatMsgAt from './AppChatMsgAt.vue'

interface Props {
  msg: string
  goBottom2?: () => void
}
defineOptions({
  name: 'AppChatMsgRender',
})
const { msg } = defineProps<Props>()

const atUserReg = /@[a-z0-9]{3,14}/g
const emojiReg = /%:[a-z]+:%/g

const splitByEmojiMsg = computed(() => msg.split(emojiReg))
const matchedEmojis = computed(() => msg.match(emojiReg) ?? [])
// const matchedAtUsers = computed(() => msg.match(atUserReg))

const msgHtml = computed(() => {
  const temp = []
  for (let i = 0; i < splitByEmojiMsg.value.length; i++) {
    const matchedAtUsersInner = splitByEmojiMsg.value[i].match(atUserReg)
    if (matchedAtUsersInner && matchedAtUsersInner.length) {
      const splitByAtUserMsgInner = splitByEmojiMsg.value[i].split(atUserReg)
      for (let j = 0; j < splitByAtUserMsgInner.length; j++) {
        temp.push({ content: splitByAtUserMsgInner[j], type: 'text' })
        if (j < matchedAtUsersInner.length)
          temp.push({ type: 'AppChatMsgAt', content: { name: matchedAtUsersInner[j] } as any })
      }
    }
    else {
      temp.push({ content: splitByEmojiMsg.value[i], type: 'text' })
    }
    if (
      matchedEmojis.value
      && matchedEmojis.value.length
      && i <= matchedEmojis.value?.length - 1) {
      const idx = allEmojis.map(m => `%:${m.split('.')[0]}:%`).findIndex(ele => ele === matchedEmojis.value[i])
      if (idx !== -1)
        temp.push({ type: 'AfunBaseImage', content: { alt: matchedEmojis.value[i], url: `/afun-h5/webp/emoji/${allEmojis[idx]}`, class: 'emoji' } as any })
      else
        temp.push({ content: matchedEmojis.value[i], type: 'text' })
    }
  }
  return temp
})
</script>

<template>
  <span>
    <template v-for="item in msgHtml" :key="item">
      <template v-if="item.type === 'AppChatMsgAt'">
        <AppChatMsgAt :user="item.content" />
      </template>
      <template v-else-if="item.type === 'AfunBaseImage'">
        <AfunBaseImage v-bind="item.content" style="--tg-base-img-max-height: 20px" @load-img="goBottom2" />
      </template>
      <template v-else>{{ item.content }}</template>
    </template>
  </span>
</template>

<style lang="scss" scoped>
  span {
  -webkit-text-size-adjust: 100%;

  color: #0d2245;

  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
</style>
