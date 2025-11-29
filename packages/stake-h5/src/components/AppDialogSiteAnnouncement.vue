<script setup lang='ts'>
import type { INoticeItem } from '@tg/types'
import { IconNotice } from '@tg/icons'
import { ApiMemberNoticeReadInsert } from '@tg/apis'

interface Props {
  data: INoticeItem[]
}
defineOptions({
  name: 'AppDialogSiteAnnouncement',
})
const props = defineProps<Props>()

const { isLogin } = storeToRefs(useAppStore())
const lang = getCurrentLanguageForBackend()
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

function onTabChange(v: string) {
  setCurrentNoticeId(v)
  if (isLogin.value && currentNotice.value?.is_read === 2)
    runNoticeRead()
}

onMounted(() => {
  setCurrentNoticeId(tab.value)
  if (isLogin.value && currentNotice.value?.is_read === 2)
    runNoticeRead()
})
</script>

<template>
  <div class="flex flex-col">
    <div class="fade-bg relative overflow-hidden rounded-t pl-[32px] pr-[10px]">
      <div class="center tab-bg absolute bottom-0 left-0 top-0 w-[32px]">
        <IconNotice class="text-[12px]" />
      </div>
      <BaseTab v-model="tab" :move-center="true" shape="square" :list="tabList" :center="false" @change="onTabChange" />
    </div>
    <div class="content-bg relative w-full rounded-b pt-[78.125%]">
      <div
        class="scroll-y absolute left-0 top-0 h-full w-full p-[1px]"
      >
        <!-- 文字 -->
        <div v-if="isText" class="content-text text-tg-secondary-light p-[10px] leading-[1.5]" v-html="textContent" />
        <!-- 图片 -->
        <BaseImage
          v-if="isImg"
          :key="imgUrl"
          style="
            --tg-base-img-style-radius: 4px
          "
          loading="eager"
          class="h-full w-full" fit="fill" :url="imgUrl" is-network
        />
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
    height: 54px;
    background-color: rgba(27, 44, 55, 0.9);
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 100px;
    z-index: -1;
  }
  --tg-radius-default: 0;
  --tg-tab-style-active-bg: rgba(27, 44, 55, 0.9);
  --tg-font-weight-semibold: 400;
  --tg-tab-style-color: #b1bad3;
  --tg-tab-style-wrap-bg-color: rgba(27, 44, 55, 0.9);
  @include webTheme('white') {
    --tg-tab-style-color: rgba(17, 17, 17, 0.8);
    background-color: rgba(255, 255, 255, 1);
    --tg-tab-style-wrap-bg-color: rgba(255, 255, 255, 0.9);
    --tg-tab-active-text-color: #f2ca5c;
  }
  @include webTheme('green') {
    --tg-tab-style-wrap-bg-color: transparent;
    --tg-tab-style-active-bg: transparent;
    --tg-tab-active-text-color: #f6d14a;
    --tg-icon-color: #f6d14a;
    --tg-tab-style-color: #3cb389;
  }

  :deep(.tab) {
    padding: 0;
    overflow: hidden;
  }
  :deep(.base-tab-wrap .tab-wrap .tab-padding-box) {
    padding: 0;
  }
  :deep(.base-tab-wrap .tab) {
    @include webTheme('greenblack') {
      color: var(--tg-text-lightgrey);
    }
    @include webTheme('green') {
      // color: #e4e4e4;
    }
  }
  :deep(.app-svg-icon) {
    @include webTheme('greenblack') {
      color: var(--tg-border-color-deep-grey);
    }
  }
  :deep(.base-tab-wrap .tab-wrap) {
    @include webTheme('greenblack') {
      background-color: transparent;
    }
  }
  :deep(.base-tab-wrap .tab.active) {
    @include webTheme('greenblack') {
      background-color: transparent;
    }
    @include webTheme('white') {
      background-color: transparent;
    }
    .text {
      @include webTheme('greenblack') {
        --tg-tab-active-text-color: var(--tg-border-color-deep-grey);
      }
      @include webTheme('white') {
        --tg-tab-active-text-color: #f2ca5c;
      }
    }
  }
  :deep(.base-tab-wrap .tab:hover:not(.disabled):not(.is-mobile)) {
    @include webTheme('greenblack') {
      background-color: transparent;
    }
    @include webTheme('white') {
      background-color: transparent;
    }
    .text {
      @include webTheme('greenblack') {
        --tg-tab-active-text-color: var(--tg-border-color-deep-grey);
      }
      @include webTheme('white') {
        --tg-tab-active-text-color: #f2ca5c;
      }
    }
  }
  :deep(.tab .content) {
    padding: 8px 0 8px 0;
  }
  :deep(.tab:active .content) {
    transform: scale(1);
  }
  :deep(.tab .content .content-label) {
    line-height: 18px;
    max-height: 36px;
    overflow: hidden;
    word-break: break-all;
  }
  :deep(.base-tab-wrap .tab .content > *) {
    margin-right: 0;
  }
  :deep(.tab-padding-box) {
    margin-right: 8px;
  }
}
.content-bg {
  background-color: var(--tg-secondary-dark);
  @include webTheme('greenblack') {
    background-color: var(--tg-primary-main);
  }
  @include webTheme('white') {
    background-color: #f5f5f5;
  }
}
.tab-bg {
  @include webTheme('white') {
    background-color: white;
    --tg-icon-color: #f2ca5c;
  }
}
.content-text {
  @include webTheme('white') {
    color: #555;
  }
  @include webTheme('green') {
    color: #3cb389;
  }
}
</style>
