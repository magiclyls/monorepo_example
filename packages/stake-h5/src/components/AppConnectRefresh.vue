<script setup lang="ts">
const TIMEOUT = 120000
const STORAGE_KEY = 'hidden_start_time'
const { t } = useI18n()
const showRefreshModal = ref(false)
const refreshTimer = ref<number | null>(null)
const dotsRef = ref<(HTMLSpanElement | null)[]>(Array(3).fill(null)) // 固定长度数组
const hasAppPwaClass = ref(false)
const appStore = useAppStore()

// 类型安全的 ref 赋值方法
function setDotRef(index: number) {
  return (el: unknown) => {
    dotsRef.value[index] = el as HTMLSpanElement
  }
}

function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

function handleVisibilityChange() {
  if (document.hidden) {
    localStorage.setItem(STORAGE_KEY, Date.now().toString())
  }
  else {
    const hiddenStart = Number(localStorage.getItem(STORAGE_KEY) || 0)

    const duration = Date.now() - hiddenStart
    if (duration >= TIMEOUT) {
      showRefreshModal.value = true
      startCountdown()
    }
    else {
      localStorage.removeItem(STORAGE_KEY)
      showRefreshModal.value = false
    }
  }
}

function startCountdown() {
  showRefreshModal.value = true
  setTimeout(performRefresh, 1000)
  setTimeout(() => showRefreshModal.value = false, 5000)
}

async function performRefresh() {
  if (refreshTimer.value)
    clearTimeout(refreshTimer.value)
  dotsRef.value[2]?.removeEventListener('animationend', performRefresh)

  localStorage.removeItem(STORAGE_KEY)
  try {
    await appStore.updateAllContractList({ level: '018' })
    await appStore.runGetVipConfig()
    await appStore.runGetMemberVipBonusRecord()
  }
  catch (error) {
    console.error('刷新失败:', error)
  }
  finally {
    showRefreshModal.value = false
  }
}

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

watch(showRefreshModal, () => {
  hasAppPwaClass.value = document.getElementsByClassName('app-pwa-define').length > 0
})

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  performRefresh()
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="showRefreshModal && isMobileDevice()"
      class="content"
      :style="{ top: hasAppPwaClass ? '202px' : '156px' }"
    >
      {{ t('connect_refresh') }}
      <span class="dots">
        <span
          v-for="i in 3"
          :key="i"
          :ref="setDotRef(i - 1)"
          class="dot"
        >.</span>
      </span>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
@keyframes popIn {
  0% {
    opacity: 0;
    transform: translateX(-50%) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
}

.dots {
  display: inline-block;
  margin-left: 4px;
  width: 24px;

  .dot {
    opacity: 0;
    animation: dotAppear 0.3s forwards;

    &:nth-child(1) { animation-delay: 0.5s; }
    &:nth-child(2) { animation-delay: 1.5s; }
    &:nth-child(3) {
      animation-delay: 2.5s;
      animation-fill-mode: forwards;
    }
  }
}

@keyframes dotAppear {
  0% {
    opacity: 0;
    transform: translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.content {
  position: fixed;
  font-size: 14px;
  left: 50%;
  transform: translateX(-50%);
  top: 20vh;
  width: 262px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(28,29,31,0.9);
  color: var(--tg-text-white);
  border-radius: 4.09px;
  z-index: 99999;
  animation: popIn 0.1s ease-out forwards;

  @include webTheme('green'){
    background-color: rgba(2,67,45,0.9);
  }
  @include webTheme('greenblack') {
    background-color:rgba(47,63,74,0.9);
  }

  @include webTheme('white') {
    background-color: rgba(255,255,255,0.9);
  }
}
</style>
