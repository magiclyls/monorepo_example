<script setup lang="ts" name="AppNotice">
import { ref } from 'vue'

interface Msg {
  label: string
  id: number
}
const msg = ref<Msg[]>([])

function addMsg(value: Msg) {
  msg.value.push(value)
  setTimeout(() => {
    msg.value.shift()
  }, 2000)
}
defineExpose({ addMsg })
</script>

<template>
  <div class="fixed z-[300] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] max-w-[80%]">
    <TransitionGroup name="fade">
      <p v-for="item of msg" :key="item.id" class="px-[20rem] break-words mt-[6rem] py-[5rem] bg-[rgba(17,17,17,.7)] text-white rounded-[5rem] text-[13rem]">
        {{ item.label }}
      </p>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
