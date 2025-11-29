<script lang="ts" setup>
const { isLogin } = storeToRefs(useAppStore())
const { notificationsCount } = useNotificationState()
const { isMobile } = storeToRefs(useWindowStore())
const {
  rightIsExpand,
  openRightSidebar,
  currentRightSidebarContent,
  closeRightSidebar,
} = useRightSidebar()
const { leftIsExpand, closeLeftSidebar } = useLeftSidebar()
const { openMarqueeDetailDialog } = useDialogMarqueeDetail()

const getActiveShown = computed(() => {
  return (shown: string) => rightIsExpand.value
  && shown === currentRightSidebarContent.value
})

function goNotice() {
  if (isLogin.value) {
    getActiveShown.value(EnumRightSidebarContent.NOTIFICATION)
      ? closeRightSidebar()
      : openRightSidebar(EnumRightSidebarContent.NOTIFICATION)
    isMobile.value && leftIsExpand.value && closeLeftSidebar()
  }
}
</script>

<template>
  <div class="relative" @click="openMarqueeDetailDialog">
    <BaseImage with-theme class="w-[24px]" url="/png/home/msg.png" loading="eager" />
    <!-- <div v-if="notificationsCount?.notification_count" class="text-tg-text-white theme-text bg msg-dot absolute h-[14px] min-w-[14px] text-center text-[9px] font-normal leading-[14px]">
      {{ notificationsCount?.notification_count }}
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.msg-dot {
  background-color: #f34b39;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  left: 45%;
  bottom: 55%;
  &::after {
    position: absolute;
    content: '';
    background-image: linear-gradient(-65deg, rgba(255, 255, 255, 0) 50%, #f34b39 50%);
    width: 3px;
    height: 4px;
    left: 0;
    top: 100%;
  }
}
.theme-text{
  @include webTheme('white'){
    color: #FFFFFF;
  }
}
</style>
