<script lang="ts" setup>
import { IconUniClose } from '@tg/icons'
import { useNotLoginReloadDialog } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import AppLoading from '~/components/AppLoading.vue'
import AppDialogSiteAnnouncement from './AppDialogSiteAnnouncement.vue'
import AppDialogTurntableFirst from './AppDialogTurntableFirst.vue'
import AppDialogUnloginFirstRechargeBonus from './AppDialogUnloginFirstRechargeBonus.vue'
import AppDownLoadBottomDialog from './AppDownLoadBottomDialog.vue'
import AppDownLoadDialog from './AppDownLoadDialog.vue'

const notLoginReloadDialog = useNotLoginReloadDialog()
const { isShow, curName, turntableData, noticeList, popData } = storeToRefs(notLoginReloadDialog)

const isFullScreenRegister = true

watch(isShow, (val) => {
  if (val) {
    document.body.classList.add('lock-scroll')
  }
  else {
    document.body.classList.remove('lock-scroll')
  }
}, { immediate: true })
</script>

<template>
  <Teleport to="body">
    <div v-if="isShow && notLoginReloadDialog.isShowContent('DownloadBottom') && curName === 'DownloadBottom'" class="dialog2-background dialog3-background  z-[1001]" @click="notLoginReloadDialog.next">
      <div class="absolute bottom-[0] left-0  w-full flex flex-col" @click.stop>
        <AppDownLoadBottomDialog />
      </div>
    </div>
    <div v-if="isShow && curName !== 'DownloadBottom'" class="dialog2-background dialog3-background  z-[1001] flex items-center justify-center" @click="notLoginReloadDialog.next">
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
            <AppLoading />
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
            <AppLoading />
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
        <div class="h-0 flex flex-1 flex-col">
          <div class="flex-1">
            <AppDialogSiteAnnouncement :data="noticeList" @click-go="notLoginReloadDialog.next" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.bottom-enter-active,
.bottom-leave-active {
  transition: all 3s ease-out;
}
.bottom-enter-from,
.bottom-leave-to {
  transform: translate(-50%, 100%);
  opacity: 0.4;
}

.bg-color {
  background-color: #1a2c38;
  border-radius: 4px;
}

.gg-header {
  padding: 10px 12px;
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
  z-index: 9999;
  padding: 20.5px 16px 16px;
  padding-top: 20.5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  color: #b1bad3;
}

.dialog2-background {
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  max-width: var(--pc-max-width);
  width: 100%;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
}

.dialog3-background {
  // padding: 16px;
}
</style>
