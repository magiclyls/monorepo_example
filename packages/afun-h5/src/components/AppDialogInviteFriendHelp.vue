<script setup lang="ts">
import { ApiMemberAgencyMyPromotion, ApiMemberTurntablePhone } from '@tg/apis'
import { AfunBaseButton, AfunBaseImage } from '@tg/bccomponents'
import { useAppStore } from '@tg/stores'
import { application, isSafari } from '@tg/utils'
import { useBrowserLocation } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import AppApplicationSharing from './AppApplicationSharing.vue'
import AppCopyLine from './AppCopyLine.vue'

interface Props {
  pid?: string
}
interface PhoneData {
  phone: string
  used: boolean
}
defineOptions({
  name: 'AppDialogInviteFriendHelp',
})
const props = withDefaults(defineProps<Props>(), {
  pid: '',
})

const router = useRouter()
const { t } = useI18n()
const location = useBrowserLocation()
const { isLogin } = storeToRefs(useAppStore())
const phoneList = ref<PhoneData[]>([])
const usedPhoneIndex = ref(-1)

const { data: proData, runAsync: runAsyncGetMyPro } = useRequest(ApiMemberAgencyMyPromotion)
const { data: phoneData, runAsync: runAsyncTurntablePhone } = useRequest(ApiMemberTurntablePhone, {
  onSuccess(res) {
    phoneList.value = res.map((a) => {
      return {
        phone: a,
        used: false,
      }
    })

    // 调试用数据
    // phoneList.value = [
    //   { phone: '123', used: false },
    //   { phone: '123', used: false },
    //   { phone: '123', used: false },
    //   { phone: '123', used: false },
    //   { phone: '123', used: true },
    //   { phone: '123', used: true },
    //   { phone: '123', used: false },
    //   { phone: '123', used: false },
    //   { phone: '123', used: false },
    // ]
  },
})

const qrUrl = computed(() => `${location.value.origin}${proData.value?.link_url ?? ''}`)

function openLink(type: number) {
  switch (type) {
    case 1:
      router.push(`https://wa.me/${giveMeAPhoneNumber()}?text=${qrUrl.value}`)
      return
    case 2:
      window.location.href = isSafari ? `sms:/open?addresses=${phoneData.value?.join(',')}&body=${qrUrl.value}` : `sms:${phoneData.value?.join(',')}?body=${qrUrl.value}`
  }
}
function giveMeAPhoneNumber() {
  const index = phoneList.value.findIndex(a => !a.used)

  if (index > -1) {
    phoneList.value[index].used = true
    return phoneList.value[index].phone
  }
  else {
    if (usedPhoneIndex.value === phoneList.value.length - 1)
      usedPhoneIndex.value = -1

    usedPhoneIndex.value = usedPhoneIndex.value + 1
    return phoneList.value[usedPhoneIndex.value].phone
  }
}

if (isLogin.value) {
  await application.allSettled([
    runAsyncGetMyPro(),
    runAsyncTurntablePhone(props.pid),
  ])
}
</script>

<template>
  <div class="components-root flex flex-col p-[16px]">
    <!-- <div class="text-[18px] font-500">
      {{ t('邀请好友帮忙提款') }}
    </div> -->
    <div class="share">
      <AppApplicationSharing round :share-text="qrUrl" />
    </div>
    <AppCopyLine class="theme-copy" :msg="qrUrl" />
    <template v-if="phoneList?.length">
      <div class="theme-text">
        <div class="theme-title text-tg-secondary-light mb-[6px]">
          {{ t('向随机玩家发送邀请') }}
        </div>
        <div class="theme-phone grid grid-cols-3 flex-wrap items-center gap-[6px] rounded-[4px] py-[7px]">
          <div
            v-for="item, in phoneList" :key="item.phone" class="text-center text-[12px] leading-[1.4]"
            :class="[item.used ? 'text-tg-text-lightgrey' : 'text-tg-text-white']"
          >
            {{ item.phone }}
          </div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-[10px]">
        <AfunBaseButton class="theme-whats" bg-style="secondary" custom-padding style="--tg-base-button-padding-y: 8px" @click="openLink(1)">
          <div class="flex flex-1 items-center">
            <AfunBaseImage class="w-[28px]" url="/m/afun-h5/png/uni-whatsapp.png" />
            <span class="flex-1">WhatsApp</span>
          </div>
        </AfunBaseButton>
        <AfunBaseButton class="theme-msg" bg-style="primary" custom-padding style="--tg-base-button-padding-y: 8px" @click="openLink(2)">
          <div class="flex flex-1 items-center">
            <AfunBaseImage class="w-[28px]" url="/m/afun-h5/png/uni-short-msg.png" />
            <span class="flex-1">{{ t('发送短信') }}</span>
          </div>
        </AfunBaseButton>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.components-root {
  > *:not(:first-child) {
    margin-top: 16px;
  }
  .theme-text {
    color: var(--tg-text-lightgrey);
  }
  .theme-title {
    color: var(--tg-secondary-light);
  }
  .theme-phone {
    background-color: var(--tg-secondary-main);
  }
}
</style>
