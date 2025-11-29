<script lang="ts" setup>
import { AfunBasePopup } from '@tg/bccomponents'
import { IconUniClose } from '@tg/icons'
import { useLoginReloadDialog } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import AppDialogLoginPwa from '~/components/AppDialogLoginPwa.vue'
import AppLoading from '~/components/AppLoading.vue'
import AppDialogFirstRechargeBonus from './AppDialogFirstRechargeBonus.vue'
import AppDialogSiteAnnouncement from './AppDialogSiteAnnouncement.vue'
import AppDialogTurntableFirst from './AppDialogTurntableFirst.vue'
import AppDialogUnloginFirstRechargeBonus from './AppDialogUnloginFirstRechargeBonus.vue'

const loginReloadDialog = useLoginReloadDialog()
const { isShow, curName, turntableData, noticeList, popData, unLoginPopData } = storeToRefs(loginReloadDialog)

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
  <!-- 登录pwa -->
  <AfunBasePopup :model-value="loginReloadDialog.isShowContent('LoginPwa') && curName === 'LoginPwa'" @close="loginReloadDialog.next">
    <AppDialogLoginPwa @close="loginReloadDialog.next" />
  </AfunBasePopup>
  <Teleport to="body">
    <div
      v-if="isShow && curName && curName !== 'LoginPwa'"
      class="dialog2-background dialog3-background  z-[1001] flex items-center justify-center"
      @click="loginReloadDialog.next"
    >
      <div
        v-if="loginReloadDialog.isShowContent('Activity') && curName === 'Activity'"
        class="scroll-y bg-color max-h-[90%] max-w-[500px] min-w-[200px] w-full" @click.stop
      >
        <Suspense timeout="0">
          <template #default>
            <AppDialogTurntableFirst
              :data="turntableData?.data" :show-roll="turntableData?.showRoll"
              :state="turntableData?.state" :pid="turntableData?.pid"
            />
          </template>
          <template #fallback>
            <AppLoading />
          </template>
        </Suspense>
      </div>
      <div
        v-if="loginReloadDialog.isShowContent('ActivityDeposit') && curName === 'ActivityDeposit'"
        class="outwraper relative"
      >
        <div class="bg-color scroll-y max-h-[90%] max-w-[500px] min-w-[200px] w-full rounded-xl" @click.stop>
          <AppDialogFirstRechargeBonus :data="popData || {}" />
        </div>
      </div>
      <div
        v-if="loginReloadDialog.isShowContent('firstRecharge') && curName === 'firstRecharge'"
        class="bg-color relative m-[16px] max-h-[90%] max-w-[500px] min-w-[200px] w-full overflow-y-hidden"
        @click.stop
      >
        <AppDialogUnloginFirstRechargeBonus :data="unLoginPopData || {}" deposit />
        <a class="close-only" @click.stop="loginReloadDialog.next">
          <IconUniClose />
        </a>
      </div>
      <div
        v-if="loginReloadDialog.isShowContent('Announcement') && curName === 'Announcement'"
        class="h-auto max-h-[80%] max-w-[500px] min-w-[200px] w-full flex flex-col" @click.stop
      >
        <div class="h-0 flex flex-1 flex-col">
          <div class="flex-1">
            <AppDialogSiteAnnouncement :data="noticeList" @click-go="loginReloadDialog.next" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
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
  padding: 16px;
}
</style>
