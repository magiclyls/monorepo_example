<script setup lang='ts'>
import type { INoticeItem } from '@tg/types'
import { ApiMemberNoticeReadInsert } from '@tg/apis'
import { PhBaseImage } from '@tg/bccomponents'
import { useDialogSiteAnnouncementList } from '@tg/hooks'
import { IconNotice } from '@tg/icons'
import { useAppStore } from '@tg/stores'
import { getLangForBackend } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRequest } from 'vue-request'

defineOptions({
  name: 'AppDialogSiteAnnouncement',
})
const props = defineProps<Props>()

interface Props {
  data: INoticeItem[]
}
const { isLogin } = storeToRefs(useAppStore())
const lang = getLangForBackend() as string
const { setCurrentNoticeId } = useDialogSiteAnnouncementList()

const tab = ref(props.data[0].id)

const tabList = computed(() => {
  return props.data.map((a) => {
    return { ...a, label: a.title[lang], value: a.id }
  })
})
const currentNotice = computed(() => tabList.value.find(a => a.id === tab.value))
const isText = computed(() => currentNotice.value?.pop_up_type === 1)
const isImg = computed(() => currentNotice.value?.pop_up_type === 2)
const textContent = computed(() => currentNotice.value?.content[lang] || currentNotice.value?.content.default || '')
const imgUrl = computed(() => currentNotice.value?.image_url[lang] ?? '')

const { run: runNoticeRead } = useRequest(() => ApiMemberNoticeReadInsert({ id: tab.value }))

function onTabChange($event: MouseEvent, v: string) {
  tab.value = v
  setCurrentNoticeId(v)
  if (isLogin.value && currentNotice.value?.is_read === 2) {
    runNoticeRead()
  }
  scrollIntoView($event.target)
}

function scrollIntoView(ele: any) {
  if (!ele)
    return
  ele.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center',
  })
}

onMounted(() => {
  setCurrentNoticeId(tab.value)
  if (isLogin.value && currentNotice.value?.is_read === 2)
    runNoticeRead()
})
</script>

<template>
  <div class="flex flex-col rounded-[4rem] border border-solid border-[#fff] overflow-hidden">
    <div class="fade-bg bg-[#F6F7F8] relative overflow-hidden pl-[32rem] pr-[10rem]">
      <div class="center absolute bottom-0 left-0 top-0 w-[32rem]">
        <IconNotice class="text-[12rem] text-[#F23038]" />
      </div>
      <div class="flex py-[8rem] items-center font-[400] overflow-scroll hide-scroll-bar">
        <div v-for="item, index in tabList" :key="index" :class="{ active: tab === item.id }" class="title" @click="onTabChange($event, item.id)">
          {{ item.title[lang] }}
        </div>
      </div>
    </div>
    <div class="bg-[#ffffff] relative w-full pt-[78.125%]">
      <div
        class="scroll-y absolute left-0 top-0 h-full w-full"
      >
        <!-- 文字 -->
        <div v-if="isText" class="text-[14rem] text-[#6D7693] p-[10rem] leading-[1.5]" v-html="textContent" />
        <!-- 图片 -->
        <PhBaseImage v-if="isImg" :key="imgUrl" loading="eager" class="h-full w-full rounded-[4rem] overflow-hidden" fit="fill" :url="imgUrl" is-network />
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.fade-bg {
  position: relative;
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 54rem;
    background-color: rgba(27, 44, 55, 0.9);
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 100px;
    z-index: -1;
  }
}
.title {
  flex-shrink: 0;
  line-height: 18rem;
  max-height: 36rem;
  max-width: 88rem;
  overflow: hidden;
  word-break: break-all;
  margin-right: 8rem;
  color: #6d7693;
  &.active {
    color: #f23038;
  }
}
</style>
