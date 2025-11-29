<script lang="ts" setup>
import type { ChatMessageInfo } from '@tg/types'
import { BaseSkeleton } from '@tg/bccomponents' // Assuming BaseSkeleton is a component for loading state

import { ref } from 'vue'
import AppChatMsgRender from './AppChatMsgRender.vue'

import AppChatUserTags from './AppChatUserTags.vue'

// 前面都补充一个空格
/**
 * 解析规则：
 * casino:连续数字
 * sport:连续数字
 * :emoji_name:
 * @user_name_规则(没有最小长度)
 * /指令空格
 */
interface Props {
  msgInfo?: ChatMessageInfo
  goBottom2?: () => void
}
defineOptions({
  name: 'AppChatMsgItem',
})
const props = withDefaults(defineProps<Props>(), {})

console.log('111 AppChatMsgItem ', props.msgInfo)

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}
const randomLoads = ref<any[]>([])
for (let i = 1; i <= getRandomInt(3) + 1; i++)
  randomLoads.value.push({ width: `${getRandomInt(50) + 50}%` })
</script>

<template>
  <section class="tg-chat-msg-item">
    <template v-if="msgInfo">
      <div v-if="msgInfo.type" class="header">
        <div v-if="msgInfo.type === 'tip'">
          <span>{{ $t('发送小费') }}</span>
        </div>
      </div>
      <div class="content">
        <p>
          <AppChatUserTags :user-info="msgInfo.user" />
          <AppChatMsgRender :msg="`:${msgInfo.msg}`" :go-bottom2="goBottom2" />
        </p>
      </div>
    </template>
    <div v-else class="loading">
      <BaseSkeleton
        v-for="i, idx in randomLoads" :key="idx" bg="#B1BAD3" height="16rem" :width="i.width"
        animated="ani-opacity"
      />
    </div>
  </section>
</template>

<style>
  .base-image.emoji {
  width: 24rem;
  display: inline-block;
  vertical-align: middle;
  height: auto;
  user-select: none;
  -webkit-user-select: none;
}
</style>

<style lang="scss" scoped>
  .tg-chat-msg-item {
  width: 100%;
  padding: 9rem 10rem;
  /* background: #F5F5F5; */
  color: #111111;
  border-radius: 4rem;
  background: var(--tg, #fff);

  .loading {
    display: flex;
    flex-direction: column;
  }

  .loading > * + * {
    margin-top: 8rem;
  }

  .content {
    p {
      -webkit-text-size-adjust: 100%;
      display: block;
      width: 100%;
      color: #fff;
      text-align: left;
      font-size: 14rem;
      font-weight: 400;
      /* line-height: 1.5; */
      word-break: break-word;

      font-size: 14rem;
      /* height: 14rem; */

      flex-shrink: 0;

      .emoji {
        width: 24rem;
        display: inline-block;
        vertical-align: middle;
        height: auto;
        user-select: none;
        -webkit-user-select: none;
      }
    }
  }
}
</style>
