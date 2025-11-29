<script lang="ts" setup>
import { IconUniClose, IconCycleClose } from '@tg/icons'
const notLoginReloadDialog = useNotLoginReloadDialog()
const { isShow, curName, turntableData, noticeList, popData } = storeToRefs(notLoginReloadDialog)
const { isOpenCPFOnRegister } = storeToRefs(useBrandStore())
const { lockScroll } = useScrollPrevent()
const { theme } = storeToRefs(useAppStore())
const { isMobile } = storeToRefs(useWindowStore())

const isFullScreenRegister = computed(() => ['white', 'green'].includes(theme.value) || isMobile.value)

onMounted(() => {
  setTimeout(() => {
    const allScrollyEl = document.querySelectorAll('.dialog2-background.dialog3-background .scroll-y')
    lockScroll(allScrollyEl)
  }, 300)
})

watch(curName, (val) => {
  nextTick(() => {
    setTimeout(() => {
      const allScrollyEl = document.querySelectorAll('.dialog2-background.dialog3-background .scroll-y')
      lockScroll(allScrollyEl)
    }, 300)
  })
})

watch(isMobile, () => {
  if (!isMobile.value && notLoginReloadDialog.isShowContent('Download') && curName.value === 'Download')
    notLoginReloadDialog.next()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="download-bottom">
      <div v-if="isShow && notLoginReloadDialog.isShowContent('DownloadBottom') && curName === 'DownloadBottom' && isMobile" class="dialog2-background dialog3-background fixed bottom-[-600px] right-0 top-[-600px] z-[1001] flex items-center justify-center" @click="notLoginReloadDialog.next">
        <div class="absolute bottom-[600px] left-0 h-[140px] w-full flex flex-col" @click.stop>
          <AppDownLoadBottomDialog />
        </div>
      </div>
    </Transition>
    <div v-if="isShow && curName !== 'DownloadBottom'" class="dialog2-background dialog3-background fixed bottom-0 right-0 top-0 z-[1001] flex items-center justify-center" @click="notLoginReloadDialog.next">
      <div
        v-if="(notLoginReloadDialog.isShowContent('Register')) && (curName === 'Register')"
        class="scroll-y bg-color w-full"
        :class="[isFullScreenRegister ? 'h-full' : 'relative m-[16px] max-h-[90%] max-w-[500px] min-w-[200px]']"
        @click.stop
      >
        <!-- 根据配置显示登录或者注册 -->
        <Suspense timeout="0">
          <template #default>
            <AppDialogRegisterCenterV1 />
          </template>
          <template #fallback>
            <div class="center dialog-loading-height">
              <BaseLoading />
            </div>
          </template>
        </Suspense>

        <a class="close-only" @click.stop="notLoginReloadDialog.next">
          <IconUniClose />
        </a>
      </div>
      <div
        v-if="(notLoginReloadDialog.isShowContent('Login')) && (curName === 'Login')"
        class="bg-color scroll-y w-full"
        :class="[isFullScreenRegister ? 'h-full' : 'relative m-[16px] max-h-[90%] max-w-[500px] min-w-[200px]']"
        @click.stop
      >
        <AppDialogLoginCenter />

        <a class="close-only" @click.stop="notLoginReloadDialog.next">
          <IconUniClose />
        </a>
      </div>
      <div v-if="notLoginReloadDialog.isShowContent('Download') && curName === 'Download'" class="scroll-y m-[16px] max-h-[90%] max-w-[500px] min-w-[200px] w-full" @click.stop>
        <div class="text-tg-text-white">
          <AppDownLoadDialog />
        </div>
      </div>
      <div v-if="notLoginReloadDialog.isShowContent('Activity') && curName === 'Activity'" class="bg-color scroll-y m-[16px] max-h-[90%] max-w-[500px] min-w-[200px] w-full" @click.stop>
        <Suspense timeout="0">
          <template #default>
            <AppDialogTurntableFirst :data="turntableData?.data" :show-roll="turntableData?.showRoll" :state="turntableData?.state" :pid="turntableData?.pid" />
          </template>
          <template #fallback>
            <div class="center dialog-loading-height">
              <BaseLoading />
            </div>
          </template>
        </Suspense>
      </div>
      <div v-if="notLoginReloadDialog.isShowContent('ActivityDeposit') && curName === 'ActivityDeposit'" class="bg-color relative m-[16px] max-h-[90%] max-w-[500px] min-w-[200px] w-full overflow-y-hidden" @click.stop>
        <AppDialogUnloginFirstRechargeBonus :data="popData || {}" />
        <a class="close-only" @click.stop="notLoginReloadDialog.next">
          <IconUniClose />
        </a>
      </div>
      <div v-if="notLoginReloadDialog.isShowContent('Announcement') && curName === 'Announcement'" class="m-[16px] h-auto max-h-[80%] max-w-[500px] min-w-[200px] w-full flex flex-col" @click.stop>
        <div class="bg-color announcement-bg h-[0px] flex flex-1 flex-col">
          <div class="flex-1">
            <AppDialogSiteAnnouncement :data="noticeList" />
          </div>
        </div>
        <div class="flex justify-center pt-[10px] font-medium">
          <AppDialogNoMoreToday />
        </div>
        <div class="center mt-[20px] cursor-pointer" @click="notLoginReloadDialog.next">
          <BaseImage width="30px" height="30px" url="/png/casino/dialog-download-close.png" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style>
:root {
  --close-icon-color: var(--tg-icon-color);
}

[theme="white"] {
  --close-icon-color: #ffffff;
}
[theme="green"] {
  --tg-icon-color: #ffffff;
}
</style>

<style lang="scss" scoped>
.download-bottom-enter-active {
  transition: all 250ms ease-in-out;
}

.download-bottom-leave-active {
  transition: all 250ms ease-in-out;
}

.download-bottom-enter-from,
.download-bottom-leave-to {
  transform: translateY(140px);
  opacity: 0.4;
}
.bg-color {
  background-color: var(--tg-dialog_style-bg);
  border-radius: var(--tg-radius-default);
}

.gg-header {
  padding: var(--tg-spacing-10) var(--tg-spacing-12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  touch-action: none;
}

.close-only {
  display: flex;
  position: absolute;
  right: 0;
  top: 0;
  z-index: var(--tg-z-index-top);
  padding: 20.5px 16px 16px;
  padding-top: var(--tg-base-dialog-close-only-padding-top);
  font-size: var(--tg-font-size-base);
  cursor: pointer;
  transition: all 0.2s;
  color: var(--tg-text-lightgrey);
  &:hover {
    --tg-icon-color: var(--tg-text-white);
  }
}

.dialog3-background {
  // padding: 16px;
}

.announcement-bg {
  background-color: var(--tg-notice-bg-color);
  @include webTheme('green'){
    --tg-notice-bg-color:#02432D;
    border:1px solid #197B59;
  }
}
</style>
