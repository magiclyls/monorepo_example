<script setup lang="ts">
defineOptions({
  name: 'AppGlobalAutoRefresh',
})

const IDLE_TIME = 10 * 60 * 1000
let idleTimer: ReturnType<typeof setTimeout> | null = null
let lastActivityTime = Date.now()
const router = useLocalRouter()
const route = useRoute()

function resetIdleTimer() {
  lastActivityTime = Date.now()
  if (idleTimer) {
    clearTimeout(idleTimer)
    idleTimer = null
  }

  idleTimer = setTimeout(() => {
    handleIdleTimeout()
  }, IDLE_TIME)
}

async function handleIdleTimeout() {
  // location.reload()
}

function setupActivityListeners() {
  const events = [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click',
  ]

  events.forEach(event => {
    document.addEventListener(event, resetIdleTimer, { passive: true })
  })
}

function removeActivityListeners() {
  const events = [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click',
  ]

  events.forEach(event => {
    document.removeEventListener(event, resetIdleTimer)
  })
}

onMounted(() => {
  resetIdleTimer()
  setupActivityListeners()

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (idleTimer) {
        clearTimeout(idleTimer)
        idleTimer = null
      }
    } else {
      const elapsed = Date.now() - lastActivityTime
      if (elapsed >= IDLE_TIME) {
        handleIdleTimeout()
      } else {
        resetIdleTimer()
      }
    }
  })
})

onUnmounted(() => {
  if (idleTimer) {
    clearTimeout(idleTimer)
    idleTimer = null
  }

  removeActivityListeners()
})
</script>

<template>
  <div class="hidden" />
</template>

<style scoped lang="scss">
.hidden {
  display: none;
}
</style>

