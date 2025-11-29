<script setup lang='ts'>
import type { HomeTemplate } from '~/utils/init'
import { IconUniFb, IconUniGoogle, IconUniLine, IconUniTwitch } from '@tg/icons'
import { ApiMemberThirdAuthUrl } from '@tg/apis'
import { getEnv } from '@tg/utils';

defineOptions({
  name: 'AppAuthLogin',
})

// 1:FB, 2:Google, 3:Twitch, 4:Line
enum AuthTypes {
  fb = 1,
  google = 2,
  twitch = 3,
  line = 4,
}

type AuthTypesKeys = keyof typeof AuthTypes
const closeDialog = inject('closeDialog', () => { })

const { VITE_SOCKET_PREFIX } = getEnv()

const { t } = useI18n()
const { openNotify } = useNotify()
const appStore = useAppStore()
const brandStore = useBrandStore()
const { brandThird } = storeToRefs(brandStore)
const { openThirdAuthFormDialog } = useDialogThirdAuthForm()

const spaceSize: Partial<Record<HomeTemplate, string>> = {
  2: '1',
  4: '1',
}
// const refreshAuthBus = useEventBus(REFRESH_AUTH_BUS)
const thirdAuth = computed(() => {
  const arr = []// 'fb', 'google', 'line', 'twitch'
  if (brandThird.value) {
    if (brandThird.value.FaceBook && +brandThird.value.FaceBook.state === 1)
      arr.push('fb')
    if (brandThird.value.Google && +brandThird.value.Google.state === 1)
      arr.push('google')
    if (brandThird.value.Twitch && +brandThird.value.Twitch.state === 1)
      arr.push('twitch')
    if (brandThird.value.Line && +brandThird.value.Line.state === 1)
      arr.push('line')
  }
  return arr
})

const ty = ref()
const state = ref(Math.random().toString(36).slice(-10))
const gWin = ref()

const topic = computed(() => `${VITE_SOCKET_PREFIX}/auth/${state.value}`)

const { run: runGetAuthUrl, loading: getAuthUrlLoading } = useRequest(ApiMemberThirdAuthUrl, {
  onSuccess: (data) => {
    setTimeout(() => {
      data && gWin.value?.location.replace(data)
    }, 0)
  },
})

async function goAuth(type: AuthTypesKeys) {
  if (gWin.value)
    gWin.value.close()

  gWin.value = window.open('', '_blank', 'popup=yes,width=600,height=600')
  ty.value = AuthTypes[type]
  runGetAuthUrl({ state: state.value, type, device_number: await application.getDeviceNumber() })
}

function dealMsg(data: any) {
  console.error('refreshAuthBus', data)
  closeDialog()
  if (data) {
    if (data.action === 'register') {
      setTimeout(() => {
        openThirdAuthFormDialog({ data: data.extra_data, ty: ty.value })
      }, 0)
    }

    else if (data.action === 'success') {
      appStore.setToken(data.extra_data)
      openNotify({
        title: t('tip_pop_up_reg_success_title'),
        type: 'success',
        message: `${t('tip_pop_up_reg_success_title')} ${data.member_name ?? '--'}!`,
      })
    }

    else if (data.action === 'error') {
      openNotify({ type: 'error', message: data.extra_data })
    }
  }
  setTimeout(() => {
    gWin.value?.close()
  }, 1500)
}

onMounted(() => {
  socketClient.addSubscribe(topic.value, { callback: thirdAuthCallback })
  appEventBus.on(EventBusNames.REFRESH_AUTH_BUS, dealMsg)

  brandStore.refreshAsyncBrandBaseDetail()
})

onBeforeUnmount(() => {
  socketClient.removeSubscribe(topic.value)
  appEventBus.off(EventBusNames.REFRESH_AUTH_BUS, dealMsg)
})
</script>

<template>
  <div v-if="thirdAuth.length" class="app-bottom">
    <div class="app-bottom-divider">
      <BaseDivider title-placement="center" spacing="8" :size="spaceSize[globalInitMap.currentTemplate] || '2'">
        <span>{{ t('just_login') }}</span>
      </BaseDivider>
    </div>
    <div
      class="app-bottom-icon"
      :style="{ 'grid-template-columns': thirdAuth.length === 4 ? 'repeat(4,1fr)' : `repeat(${thirdAuth.length},25%)` }"
    >
      <BaseButton v-if="thirdAuth.includes('fb')" :disabled="getAuthUrlLoading" class="item-svg third-btn" size="xs" @click="goAuth('fb')">
        <BaseImage url="/png/icon/uni-fb.png" width="16px" />
      </BaseButton>
      <BaseButton v-if="thirdAuth.includes('google')" :disabled="getAuthUrlLoading" class="item-svg third-btn" size="xs" @click="goAuth('google')">
        <BaseImage url="/png/icon/uni-google.png" width="16px" />
      </BaseButton>
      <BaseButton v-if="thirdAuth.includes('line')" :disabled="getAuthUrlLoading" class="item-svg third-btn" size="xs" @click="goAuth('line')">
        <BaseImage url="/png/icon/uni-line.png" width="16px" />
      </BaseButton>
      <BaseButton v-if="thirdAuth.includes('twitch')" :disabled="getAuthUrlLoading" class="item-svg third-btn" size="xs" @click="goAuth('twitch')">
        <BaseImage url="/png/icon/uni-twitch.png" width="16px" />
      </BaseButton>
    </div>
  </div>
</template>

<style lang='scss' scoped>
:root {
  --tg-third-btn-bg-color: #ffffff;
}
.app-bottom {
  font-size: var(--tg-font-size-default);
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  row-gap: 12px;
  &-divider {
    width: 100%;
    max-width: 200px;
    margin: 0 auto;
    span {
      color: var(--tg-text-lightgrey);
      height: 20px;
      line-height: 20px;
      display: inline-block;
    }
  }
  &-icon {
    gap: var(--tg-spacing-5);

    width: 100%;
    display: grid;
    // grid-template-columns: repeat(4,1fr);
    grid-auto-rows: auto;
    justify-content: center;
    --tg-icon-color: var(--tg-text-white) .item-svg {border-radius: var(--tg-radius-default) ; display: flex;
      justify-content: center; align-items: center; background: var(--tg-secondary-main) ;
      font-size: var(--tg-font-size-default) ;};
  }
}

.third-btn {
  @include webTheme('green') {
    background-color: #02432d;
  }
  @include webTheme('white') {
    border: none;
    background-color: #f5f5f5;
  }
}
</style>
