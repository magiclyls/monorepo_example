<script setup lang="ts">
const renderValue = ref(1)
const data = ref({
  game: '',
  uid: '',
  id: '',
})

function message(event: MessageEvent) {
  console.log('event:', event.data)
  if (event.data && typeof event.data === 'string' && event.data.includes('xxxxxxxxxxxxxx')) {
    try {
      console.log('Message received from parent:', event.data)
      data.value = JSON.parse(event.data)
      renderValue.value++
    }
    catch (error) {
      console.error('error:', error)
    }
  }
}

onMounted(() => {
  window.addEventListener('message', message)
})

onUnmounted(() => {
  window.removeEventListener('message', message)
})
</script>

<template>
  <div class="scroll-y max-h-[650px]">
    <template v-if="data.game">
      <AppDialogBetSlipOriginalGame :key="renderValue" :data="data" />
    </template>
  </div>
</template>
