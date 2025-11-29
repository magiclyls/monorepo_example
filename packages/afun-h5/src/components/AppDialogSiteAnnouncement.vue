<script setup lang='ts'>
import type { INoticeItem } from '@tg/types'
import { ApiMemberNoticeReadInsert } from '@tg/apis'
import { AfunBaseButton, AfunBaseImage } from '@tg/bccomponents'
import { useDialogSiteAnnouncementList } from '@tg/hooks'
import { useAppStore, useCurrency } from '@tg/stores'
import { getBrandInfo } from '@tg/utils'
import { getLangForBackend } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'AppDialogSiteAnnouncement',
})
const props = defineProps<Props>()
const emit = defineEmits<{
  clickGo: [event: MouseEvent]
}>()
const { t } = useI18n()
const router = useRouter()
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

const BLogoImg = getBrandInfo('pc.pc_logo_white')
const SLogoImg = getBrandInfo('pc.pc_first_letter')
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const logoImg = computed(() => {
  if (currentGlobalCurrencyMap.value.balance.length > 18) {
    return SLogoImg
  }
  else {
    return BLogoImg
  }
})
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

function clickGo(event: MouseEvent) {
  emit('clickGo', event)
}

onMounted(() => {
  setCurrentNoticeId(tab.value)
  if (isLogin.value && currentNotice.value?.is_read === 2)
    runNoticeRead()
})
</script>

<template>
  <div class="flex flex-col rounded-[8px] overflow-hidden">
    <div class="bg-[rgba(15,33,46,0.90)] py-[30px] flex items-center justify-center">
      <AfunBaseImage is-network :url="logoImg" class="w-[200px]" />
    </div>
    <div class="fade-bg bg-[rgba(15,33,46,0.90)] relative overflow-hidden">
      <div class="flex items-end font-[400] overflow-scroll hide-scroll-bar w-full tab-parent">
        <div v-for="item, index in tabList" :key="index" :class="{ active: tab === item.id }" class="title" @click="onTabChange($event, item.id)">
          <div class="title-content">
            {{ item.title[lang] }}
          </div>
        </div>
      </div>
    </div>
    <div class="bg-[rgba(15,33,46,0.90)] relative w-full pt-[78.125%]">
      <div
        class="scroll-y absolute left-0 top-0 h-full w-full py-[10px] px-[10px]"
      >
        <!-- 文字 -->
        <div v-if="isText" class="text-[12px] font-[500] text-[#B1BAD3]  leading-[1.5]" v-html="textContent" />
        <!-- 图片 -->
        <AfunBaseImage v-if="isImg" :key="imgUrl" loading="eager" class="h-full w-full rounded-[4px] overflow-hidden" fit="fill" :url="imgUrl" is-network />
      </div>
    </div>
    <div class="bg-[#071824] px-[18px] py-[15px] flex items-center gap-auto gap-[30px]">
      <AfunBaseButton class="flex-1 h-[44px]" @click="clickGo">
        {{ t('前往') }}
      </AfunBaseButton>
      <AfunBaseButton
        class="flex-1 btn2 h-[44px] border border-solid border-[#2F4553]"
        style="--afun-base-button-default-background-color:#071824;" type="default" @click="clickGo"
      >
        {{ t('取消') }}
      </AfunBaseButton>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.fade-bg {
  position: relative;
  display: flex;
  align-items: center;
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 54px;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 100px;
    z-index: -1;
  }
}
.tab-parent {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: #2f4553;
  }
}
.title {
  flex-shrink: 0;
  line-height: 18px;
  font-size: 16px;
  max-width: 140px;
  overflow: hidden;
  word-break: break-all;
  color: #b1bad3;
  text-align: center;
  flex: 0 0 1;
  font-weight: 500;
  padding: 0 7px 10px 7px;
  cursor: pointer;
  position: relative;
  border-bottom: 1px solid transparent;
  text-align: left;
  z-index: 20;
  &.active {
    color: #fff;
    border-bottom: 1px solid #24ee89;
  }

  .title-content {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
