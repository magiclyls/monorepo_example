<script lang="ts" setup>
import { PhBaseDialog, PhBaseImage } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

interface Props {
  message: {
    images?: string
    description?: string
    content: string
    created_at: number
    feed_id: string
    uid: string
    id: string
  }

}
defineOptions({
  name: 'AppFeedbackChatMsg',
})
const props = defineProps<Props>()

const { userInfo } = storeToRefs(useAppStore())

const { bool: showFixedImage, setTrue: setFITrue } = useBoolean(false)

const curImage = ref('')

const isOwn = computed(() => props.message.uid === userInfo.value?.uid)

const messageImages = computed(() =>
  props.message.images && props.message.images.length ? JSON.parse(props.message.images) : [])

function seeImage(s: string) {
  curImage.value = s
  setFITrue()
}
</script>

<template>
  <div class="app-feedback-chat-msg" :class="{ 'is-own': isOwn }">
    <div class="content" :class="{ 'is-own': isOwn }">
      <div
        v-if="!isOwn"
        class="text-[#6D7693]"
      >
        {{ $t('官方客服') }}
      </div>
      <slot>
        <div
          class="text-[14rem] font-[500] text-[#0D2245] bg-[#fff] rounded-[8rem] p-[12rem]"
        >
          <span>{{ message.content }}</span>
          <div v-if="messageImages.length" class="flex gap-[8rem] flex-wrap mt-[8rem]">
            <div v-for="item in messageImages" :key="item" class="w-[72rem] h-[72rem] bg-[#EBEBEB] rounded-[4rem]">
              <PhBaseImage
                class="size-full"
                :url="item"
                is-network
                @click="seeImage(item)"
              />
            </div>
          </div>
        </div>
      </slot>
    </div>
  </div>
  <PhBaseDialog v-model="showFixedImage" show-close>
    <PhBaseImage is-network :url="curImage" />
  </PhBaseDialog>
</template>

<style lang="scss" scoped>
.app-feedback-chat-msg {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 8rem;
  &.is-own {
    flex-direction: row-reverse;
  }
  .avatar {
    width: 32rem;
    height: 32rem;
    border-radius: 50%;
    overflow: hidden;
  }
  .content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: 80%;
    &.is-own {
      flex-direction: row-reverse;
    }
    .name {
      font-size: 12rem;
      font-weight: 600;
      color: var(--tg-text-grey-secondary);
      margin-bottom: 4rem;
    }
    .message {
      .message-images {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: 2%;
        > * {
          cursor: pointer;
          width: 76px;
          margin-top: 8px;
          aspect-ratio: 1/1;
        }
        // &.images-num-1 > * {
        //   width: 100%;
        // }
        // &.images-num-2 > * {
        //   width: 48%;
        // }
        // &.images-num-more-than-3 > * {
        //   width: 32%;
        // }
      }
    }
  }
}
</style>
