<script setup lang='ts'>
import { ApiMemberThirdAuthUrl } from '@tg/apis'
import { BaseDivider, PhBaseImage } from '@tg/bccomponents'

import { useAppStore, useBrandStore } from '@tg/stores'
import { EventBusNames } from '@tg/types'
import { appEventBus, application, getEnv, socketClient, thirdAuthCallback } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'

defineOptions({
  name: 'AppThirdLogin',
})

// 1:FB, 2:Google, 3:Twitch, 4:Line
enum AuthTypes {
  fb = 1,
  google = 2,
  twitch = 3,
  line = 4,
}

type AuthTypesKeys = keyof typeof AuthTypes

const { VITE_SOCKET_PREFIX } = getEnv()

const { t } = useI18n()
const appStore = useAppStore()
const brandStore = useBrandStore()
const { brandThird } = storeToRefs(brandStore)

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
  // closeDialog()
  if (data) {
    if (data.action === 'register') {
      setTimeout(() => {
        // openThirdAuthFormDialog({ data: data.extra_data, ty: ty.value })
        // const { id, email, name } = data.extra
        // i18nNavigateTo({path:'/login/third',query:{e:email,i:id,name:name,ty:ty.value}})
      }, 0)
    }

    else if (data.action === 'success') {
      appStore.setToken(data.extra_data)
      // message.success( `${t('tip_pop_up_reg_success_title')} ${data.member_name ?? '--'}!`)
    }

    else if (data.action === 'error') {
      // message.error(data.extra_data )
    }
  }
  setTimeout(() => {
    gWin.value?.close()
  }, 1500)
}

onMounted(() => {
  socketClient.addSubscribe(topic.value, { callback: thirdAuthCallback })
  appEventBus.on(EventBusNames.REFRESH_AUTH_BUS, dealMsg)
})

onBeforeUnmount(() => {
  socketClient.removeSubscribe(topic.value)
  appEventBus.off(EventBusNames.REFRESH_AUTH_BUS, dealMsg)
})

application.allSettled(
  [brandStore.refreshAsyncBrandBaseDetail()],
)
</script>

<template>
  <div v-if="thirdAuth.length" class="app-bottom">
    <div class="text-black h-[18.4rem] mb-[24rem]">
      <BaseDivider
        title-placement="center" size="1"
      >
        <span class="text-[16rem] font-[500] text-[#0D2245] leading-[18.4rem]">or</span>
      </BaseDivider>
    </div>
    <div class="center">
      <div
        class="app-bottom-icon"
        :style="{
          gridTemplateColumns: `repeat(${thirdAuth.length}, 36px)`,
          justifyContent: 'space-between',
        }"
      >
        <div
          v-if="thirdAuth.includes('fb')" :disabled="getAuthUrlLoading" class="item-svg third-btn"
          @click="goAuth('fb')"
        >
          <PhBaseImage url="/ph-h5/png/third-fb.png" width="36rem" />
        </div>
        <div
          v-if="thirdAuth.includes('google')" :disabled="getAuthUrlLoading"
          class="item-svg third-btn" @click="goAuth('google')"
        >
          <PhBaseImage url="/ph-h5/png/third-google.png" width="36rem" />
        </div>
        <div
          v-if="thirdAuth.includes('line')" :disabled="getAuthUrlLoading" class="item-svg third-btn"
          @click="goAuth('line')"
        >
          <PhBaseImage url="/ph-h5/png/third-line.png" width="36rem" />
        </div>
        <div
          v-if="thirdAuth.includes('twitch')" :disabled="getAuthUrlLoading"
          class="item-svg third-btn" @click="goAuth('twitch')"
        >
          <PhBaseImage url="/ph-h5/png/third-twitch.png" width="36rem" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.app-bottom {
  font-size: 14rem;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));

  &-divider {
    width: 100%;
    margin: 0 auto;

    span {
      color: inherit;
      height: 20rem;
      line-height: 20rem;
      display: inline-block;
    }
  }

  &-icon {
    gap: 4rem;
    width: 216rem;
    display: grid;
    // grid-template-columns: repeat(4,1fr);
    grid-auto-rows: auto;
    justify-content: center;
    justify-items: center;

    .item-svg {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 36rem;
      width: 36rem;
      flex-shrink: 0;
      cursor: pointer;
    }
  }
}
</style>
