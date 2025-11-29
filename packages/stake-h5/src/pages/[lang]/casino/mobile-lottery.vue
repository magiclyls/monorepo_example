<script lang="ts" setup>
const router = useLocalRouter()
const appStore = useAppStore()
const { isLogin } = storeToRefs(useAppStore())
const { openLoginDialog } = useLoginDialog()
const targetMap = new Map([
  ['1', ''],
  ['2', 'racing'],
  ['3', 'k3'],
  ['4', '5d'],
  ['5', 'trx-win-go'],
])
const type = getParamsQuery('type') as string
const { getLotteryUrl } = useLotteryUrl()

const LOTTERYURL = `${getLotteryUrl()}/${targetMap.get(type)}?type=${type}&lang=${getCurrentLanguageForFrontend()}`
const currency = appStore.currentGlobalCurrency
const mobileGameUrl = computed(() => isLogin.value ? `${LOTTERYURL}&t=${appStore.getToken()}&cy=${currency}` : LOTTERYURL)

onMounted(() => {
  window.addEventListener('message', (e) => {
    const { auth, type } = e.data
    if (auth === 'xxxxxxxxxxxxxxlotteryxxxxxxxxxxx') {
      if (type === 'login') {
        new Promise<void>((resolve) => {
          router.push('/casino')
          resolve()
        }).then(() => {
          openLoginDialog()
        })
      }
      if (type === 'exit') {
        console.log('exit')
        router.push('/casino')
      }
      if (type === 'currency') {
        console.log('已经切换到currency', e.data.cy)
        appStore.changeGlobalCurrency(e.data.cy)
      }
    }
  })
})
</script>

<template>
  <div class="h-full">
    <div class="loading-box h-full flex flex-col items-center justify-center">
      <BaseLoading />
    </div>
    <div v-show="mobileGameUrl " class="mobile-lottery w-full">
      <iframe
        :src="mobileGameUrl"
        frameborder="0"
        allowfullscreen
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loading-box {
  height: 100%;
  height: 100vh;
  height: 100dvh;
}
.mobile-lottery {
  iframe {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100%;
    height: 100vh;
    height: 100dvh;
    border: none;
    z-index: 99;
  }

}
</style>

<route lang="yaml">
name: casino-mobile-lottery
meta:
  layout: not-dom
  needScrollingXHidden: true
</route>
