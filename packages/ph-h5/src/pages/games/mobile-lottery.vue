<script lang="ts" setup>
import { LotteryWinGo } from '@tg/lottery-h5/core'
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const LOTTERYURL = 'https://lottery.a79163.com/'
const router = useRouter()
const { isLogin } = storeToRefs(useAppStore())
const appStore = useAppStore()

const mobileGameUrl = computed(() => isLogin.value ? `${LOTTERYURL}?t=${appStore.getToken()}` : LOTTERYURL)
onMounted(() => {
  if (!isLogin.value) {
    window.addEventListener('message', (e) => {
      const { auth } = e.data
      if (auth === 'xxxxxxxxxxxxxxlotteryxxxxxxxxxxx') {
        router.push('/login')
      }
    })
  }
})
</script>

<template>
  <div class="h-full">
    <div class="mobile-lottery w-full">
      <LotteryWinGo />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mobile-lottery {
  iframe {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100%;
    border: none;
    z-index: 99;
  }
}
</style>
