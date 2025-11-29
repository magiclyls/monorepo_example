<script setup lang="ts">
import { computed } from 'vue'
import { useChatToastStore } from '../utils/chatToast'

defineOptions({
  name: 'ChatToast',
})
const { toasts } = useChatToastStore()
const toastList = computed(() => toasts.value)
</script>

<template>
  <teleport to="body">
    <transition-group name="chat-toast" tag="div" class="chat-toast-container">
      <div
        v-for="toast in toastList"
        :key="toast.id"
        class="chat-toast-item"
        :data-type="toast.type"
      >
        <span class="chat-toast-text">{{ toast.message }}</span>
      </div>
    </transition-group>
  </teleport>
</template>

<style scoped>
.chat-toast-container {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 9999;
  pointer-events: none;
}

.chat-toast-item {
  min-width: 160px;
  max-width: 320px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
  pointer-events: auto;
}

/* .chat-toast-item[data-type='error'] {
  background: rgba(220, 53, 69, 0.88);
}

.chat-toast-item[data-type='success'] {
  background: rgba(25, 135, 84, 0.88);
} */

.chat-toast-text {
  display: inline-block;
  word-break: break-word;
}

.chat-toast-enter-active,
.chat-toast-leave-active {
  transition: all 0.2s ease;
}

.chat-toast-enter-from,
.chat-toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px);
}
</style>
