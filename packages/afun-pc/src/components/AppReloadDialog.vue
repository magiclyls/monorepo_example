<script lang="ts" setup>
import { IconUniClose } from '@tg/icons'

const loginReloadDialog = useLoginReloadDialog()
const { isShow, curName, turntableData, noticeList, popData, unLoginPopData } = storeToRefs(loginReloadDialog)

const { lockScroll } = useScrollPrevent()

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
</script>

<template>
  <Teleport to="body">
    <div v-if="isShow" class="dialog2-background dialog3-background fixed bottom-0 right-0 top-0 z-[1001] flex items-center justify-center" @click="loginReloadDialog.next">
      <div v-if="loginReloadDialog.isShowContent('Activity') && curName === 'Activity'" class="scroll-y bg-color max-h-[90%] max-w-[500px] min-w-[200px] w-full" @click.stop>
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
      <div v-if="loginReloadDialog.isShowContent('ActivityDeposit') && curName === 'ActivityDeposit'" class="outwraper relative">
        <div class="bg-color scroll-y max-h-[90%] max-w-[500px] min-w-[200px] w-full rounded-xl" @click.stop>
          <AppDialogFirstRechargeBonus :data="popData || {}" />
        </div>
      </div>
      <div v-if="loginReloadDialog.isShowContent('firstRecharge') && curName === 'firstRecharge'" class="bg-color relative m-[16px] max-h-[90%] max-w-[500px] min-w-[200px] w-full overflow-y-hidden" @click.stop>
        <AppDialogUnloginFirstRechargeBonus :data="unLoginPopData || {}" deposit />
        <a class="close-only" @click.stop="loginReloadDialog.next">
          <IconUniClose />
        </a>
      </div>
      <div v-if="loginReloadDialog.isShowContent('Announcement') && curName === 'Announcement'" class="h-auto max-h-[80%] max-w-[500px] min-w-[200px] w-full flex flex-col" @click.stop>
        <div class="bg-color announcement-bg h-[0px] flex flex-1 flex-col">
          <div class="flex-1">
            <AppDialogSiteAnnouncement :data="noticeList" />
          </div>
        </div>
        <div class="flex justify-center pt-[10px]">
          <AppDialogNoMoreToday />
        </div>
        <div class="center mt-[20px] cursor-pointer" @click="loginReloadDialog.next">
          <BaseImage width="30px" height="30px" url="/png/icon/cycle-close.png" />
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
</style>

<style lang="scss" scoped>
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
.close-win6{
  position: absolute;
  right: 0;
  top: -26px;
  font-size: 20px;
  @include webTheme('white') {
    background-color:#111;
    color: #111;
    border-radius: 20px;
  }
}
.dialog3-background {
  padding: 16px;
}

.announcement-bg {
  background-color: var(--tg-notice-bg-color);
  @include webTheme('green'){
    --tg-notice-bg-color:#02432D;
    border:1px solid #197B59;
  }
}
</style>
