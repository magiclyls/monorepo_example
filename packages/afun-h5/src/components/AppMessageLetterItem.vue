<script setup lang='ts'>
import { AfunBaseImage } from '@tg/bccomponents'
import { IconUniArrowRight, IconUniDelete } from '@tg/icons'
import { timeToFromNow } from '@tg/vue-i18n'
import { onMounted, ref } from 'vue'

interface Props {
  data: {
    id: string
    title: string
    msg: string
    created_at: number
    read: boolean
  }
}

defineOptions({ name: 'AppMessageLetterItem' })
const props = defineProps<Props>()
const emit = defineEmits(['delete'])
const msgRef = ref<HTMLElement>()
const isOverThreeLines = ref(false)
const rightRef = ref()
const showDelete = ref(false)

onMounted(() => {
  // 檢測文字是否超過三行
  if (msgRef.value) {
    const clientHeight = msgRef.value.clientHeight
    const scrollHeight = msgRef.value.scrollHeight
    isOverThreeLines.value = scrollHeight > clientHeight
  }
})

function onClickDelete() {
  emit('delete', props.data)
}

onMounted(() => {
  let startX = 0
  let startY = 0

  rightRef.value.addEventListener('touchstart', (e: any) => {
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
  })

  rightRef.value.addEventListener('touchend', (e: any) => {
    const dx = e.changedTouches[0].clientX - startX
    const dy = e.changedTouches[0].clientY - startY
    if (Math.abs(dx) > Math.abs(dy)) {
      // 向右
      if (dx > 0) {
        showDelete.value = false
      }
      // 向左
      if (dx < 0 && props.data.read) {
        showDelete.value = true
      }
    }
  })
})
</script>

<template>
  <div class="flex w-full h-[62rem] rounded-[4px] overflow-hidden">
    <div class="flex-none h-full flex items-center text-[20rem] justify-center bg-[#213743] w-[62rem]">
      <AfunBaseImage v-if="data.read" class="w-[20rem] h-[20rem]" url="/m/afun-h5/png/uni-mail1.png" />
      <AfunBaseImage v-else class="w-[20rem] h-[20rem]" url="/m/afun-h5/png/uni-mail.png" />
    </div>
    <div ref="rightRef" class="flex grow h-full bg-[#2F4553] items-center " style="max-width: calc(100% - 62rem);">
      <div class="w-full h-full flex items-center">
        <div class="flex flex-col overflow-hidden w-full">
          <div class="px-[12rem] mb-[2rem] flex text-[14rem] font-[500] leading-[20rem] items-center justify-between">
            <div class="overflow-hidden whitespace-nowrap text-ellipsis max-w-[80%] text-[#fff]">
              <span>{{ data.title }}</span>
            </div>
            <span class="flex-none flex items-center ml-[8rem] text-[#B1BAD3] font-[400] text-[12rem]">
              <span
                v-show="!data.read"
                class="inline-block w-[6rem] h-[6rem] bg-[#24EE89] rounded-[50%] mr-[4rem]"
              />
              {{ timeToFromNow(data.created_at) }}
              <IconUniArrowRight class="text-[14px] text-[#B1BAD3] ml-[6rem]" />
            </span>
          </div>
          <div
            class="px-[12rem] leading-[20rem] w-full text-[#B1BAD3] overflow-hidden whitespace-nowrap text-ellipsis"
          >
            <span>{{ data.msg }}</span>
          </div>
        </div>
        <div
          :class="showDelete ? 'w-[70rem]' : 'w-0'"
          class="duration-[0.35s] h-full text-[26rem] bg-[#F23038] flex flex-none items-center justify-center overflow-hidden"
          @click.stop="onClickDelete"
        >
          <IconUniDelete class="text-white" />
        </div>
      </div>
    </div>
  </div>
</template>
