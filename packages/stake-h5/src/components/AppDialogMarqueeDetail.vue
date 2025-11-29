<script setup lang='ts'>
import { IconUniNoticeGgCurrent, IconUniNoticeZnx, IconHeaderBack } from '@tg/icons'
defineOptions({ name: 'AppDialogMarqueeDetail' })

const { marqueeData } = storeToRefs(useNoticeStore())
const { t } = useI18n()
const { bool: isShowContent, setFalse: setShowContentFalse } = useBoolean(false)
const currentIndex = ref(0)

const currentContent = computed(() => marqueeData.value[currentIndex.value].content_lang)
const currentTitle = computed(() => marqueeData.value[currentIndex.value].title_lang)

function openContent(i: number) {
  isShowContent.value = true
  currentIndex.value = i
}
</script>

<template>
  <div class="theme-bg pt-[16px]">
    <template v-if="!isShowContent">
      <div class="mb-[14px] flex items-center px-[12px] text-[18px] leading-[24px]">
        <IconUniNoticeGgCurrent />
        <span class="ml-[8px]">{{ t('notice') }}</span>
      </div>
      <div class="w-full flex flex-col px-[12px] pb-[14px]">
        <div v-for="item, i in marqueeData" :key="item.id" class="item-wrap" @click="openContent(i)">
          <div class="theme-icon">
            <IconUniNoticeZnx />
          </div>
          <div class="right">
            <span class="text">{{ item.title_lang }}</span>
            <div class="text theme-text">
              {{ item.content_lang }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="mb-[14px] flex items-center px-[12px] text-[18px]">
        <div class="h-[24px] flex cursor-pointer items-center pr-[8px]" @click="setShowContentFalse">
          <IconHeaderBack />
        </div>
        <span>{{ t('notice') }}</span>
      </div>
      <div class="w-full px-[16px] pb-[36px] leading-normal">
        <div class="mb-[9px] text-center text-[20px] font-semibold">
          {{ currentTitle }}
        </div>
        <span class="theme-text">
          {{ currentContent }}
        </span>
      </div>
    </template>
  </div>
</template>

<style lang='scss' scoped>
.theme-bg {
  @include webTheme('green') {
    background-color: #076237;
    border-radius: 4px;
  }

  @include webTheme('white') {
    background-color: #fff;
    border-radius: 4px;
  }
}

.item-wrap {
  width: 100%;
  display: flex;
  margin-bottom: 12px;
  cursor: pointer;

  &:last-child {
    margin-bottom: 0;
  }
}

.right {
  flex: 1;
  line-height: 20px;
  background-color: #2F4553;
  padding: 0 14px;
  font-weight: 500;
  border-radius: 0px 4px 4px 0px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  justify-content: center;

  @include webTheme('white') {
    background-color: #F5F5F5;
  }

  @include webTheme('green') {
    background-color: #055434;
  }

  .text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.theme-text {
  color: #B1BAD3;

  @include webTheme('white') {
    color: #555;
  }

  @include webTheme('green') {
    color: #3CB389;
  }
}

.theme-icon {
  border-radius: 4px 0px 0px 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 62px;
  height: 70px;
  font-size: 20px;
  flex-shrink: 0;
  background-color: #213743;

  @include webTheme('white') {
    background-color: #F2CA5C;
  }

  @include webTheme('green') {
    background-color: #02432D;
  }
}
</style>
