<script setup lang="ts">
import { IconUniWhatsapp, IconUniShortMsg } from '@tg/icons'
import { ApiMemberAgencyMyPromotion, ApiMemberTurntablePhone } from '@tg/apis'

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

const router = useLocalRouter()
const location = useBrowserLocation()

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

await application.allSettled(
  [runAsyncGetMyPro(), runAsyncTurntablePhone(props.pid)],
)
</script>

<template>
  <div class="components-root flex flex-col p-[16px]">
    <div class="text-[18px] font-500">
      {{ $t('invite_friends_help_withdrawals') }}
    </div>
    <div class="share">
      <AppApplicationSharing round :share-text="qrUrl" />
    </div>
    <AppCopyLine class="theme-copy" :msg="qrUrl" />
    <template v-if="phoneList?.length">
      <div class="theme-text">
        <div class="theme-title text-tg-secondary-light mb-[6px]">
          {{ $t('send_invitations_random_players') }}
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
        <BaseButton class="theme-whats" bg-style="secondary" custom-padding style="--tg-base-button-padding-y: 8px" @click="openLink(1)">
          <div class="flex flex-1 items-center">
            <IconUniWhatsapp class="text-[28px]" />
            <span class="flex-1">WhatsApp</span>
          </div>
        </BaseButton>
        <BaseButton class="theme-msg" bg-style="primary" custom-padding style="--tg-base-button-padding-y: 8px" @click="openLink(2)">
          <div class="flex flex-1 items-center">
            <IconUniShortMsg class="text-[28px]" />
            <span class="flex-1">{{ $t('sending_text_message') }}</span>
          </div>
        </BaseButton>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.components-root {
  @include webTheme('white') {
    background: #fff;
  }
  > *:not(:first-child) {
    margin-top: 16px;
  }
  .theme-text {
    color: var(--tg-text-lightgrey);
    @include webTheme('white') {
      color: #111;
      font-weight: 500;
    }
    @include webTheme('green') {
      color: #fff;
      --tg-text-lightgrey: #ffffff80;
    }
  }
  .theme-title {
    color: var(--tg-secondary-light);
    @include webTheme('green') {
      color: #ffffffcc;
    }
  }
  .theme-copy {
    @include webTheme('white') {
      --tg-app-copy-line-input-background-color: #e8e8e8;
      --tg-app-copy-line-input-border-color: #e8e8e8;
      --tg-app-copy-line-input-wrap-box-shadow: none;
      --tg-app-copy-line-button-box-background-color: #e8e8e8;
    }
    @include webTheme('green') {
      --tg-app-copy-line-input-background-color: #02432d;
      --tg-app-copy-line-input-border-color: #02432d;
      --tg-app-copy-line-input-wrap-box-shadow: none;
      --tg-app-copy-line-button-box-background-color: #02432d;
      --app-copyline-color: #fff;
    }
  }
  .theme-phone {
    background-color: var(--tg-secondary-main);
    @include webTheme('white') {
      background: #e8e8e8;
      box-shadow:
        0px 1px 2px 0px rgba(0, 0, 0, 0.12),
        0px 1px 3px 0px rgba(0, 0, 0, 0.2);
    }
  }
  .theme-whats {
    @include webTheme('white') {
      --tg-base-button-style-bg-special: #00e701;
    }
    @include webTheme('green') {
      --tg-base-button-secondary-bg: #00e701;
    }
  }
  .theme-msg {
    @include webTheme('green') {
      background-color: #1475e1;
      color: #fff;
    }
  }
}
</style>
