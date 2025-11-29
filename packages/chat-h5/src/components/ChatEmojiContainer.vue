<script setup lang="ts">
import { IconChatClose } from '@tg/icons'
import { useLocale } from '../components/ChatConfigProvider'

defineOptions({
  name: 'ChatEmojiContainer',
})
const props = withDefaults(defineProps<{
  modelValue?: boolean
}>(), {
  modelValue: false,
})
const emit = defineEmits<{
  (e: 'select', emoji: string): void
  (e: 'update:modelValue', value: boolean): void
}>()
const { $$t } = useLocale()
const emojis = [
  // 表情類
  '😀',
  '😃',
  '😄',
  '😁',
  '😆',
  '😅',
  '🤣',
  '😂',
  '🙂',
  '🙃',
  '😉',
  '😊',
  '😇',
  '🥰',
  '😍',
  '🤩',
  '😘',
  '😗',
  '😚',
  '😙',
  '😋',
  '😛',
  '😜',
  '🤪',
  '😝',
  '🤑',
  '🤗',
  '🤭',
  '🤫',
  '🤔',
  '🤐',
  '🤨',
  '😐',
  '😑',
  '😶',
  '😏',
  '😒',
  '🙄',
  '😬',
  '🤥',
  '😌',
  '😔',
  '😪',
  '🤤',
  '😴',
  '😷',
  '🤒',
  '🤕',
  '🤢',
  '🤮',
  '🤧',
  '🥵',
  '🥶',
  '😵',
  '🤯',
  '🤠',
  '🥳',
  '😎',
  '🤓',
  '🧐',
  '😕',
  '😟',
  '🙁',
  '☹️',
  '😮',
  '😯',
  '😲',
  '😳',
  '🥺',
  '😦',
  '😧',
  '😨',
  '😰',
  '😥',
  '😢',
  '😭',
  '😱',
  '😖',
  '😣',
  '😞',
  '😓',
  '😩',
  '😫',
  '🥱',
  '😤',
  '😡',
  '😠',
  '🤬',
  '😈',
  '👿',
  // 手勢類
  '👋',
  '🤚',
  '🖐️',
  '✋',
  '🖖',
  '👌',
  '🤏',
  '✌️',
  '🤞',
  '🤟',
  '🤘',
  '🤙',
  '👈',
  '👉',
  '👆',
  '🖕',
  '👇',
  '☝️',
  '👍',
  '👎',
  '✊',
  '👊',
  '🤛',
  '🤜',
  '👏',
  '🙌',
  '👐',
  '🤲',
  '🤝',
  '🙏',
  '✍️',
  '💪',
  '🦵',
  '🦶',
  '👂',
  '🦻',
  '👃',
  // 愛心類
  '❤️',
  '🧡',
  '💛',
  '💚',
  '💙',
  '💜',
  '🖤',
  '🤍',
  '🤎',
  '💔',
  '❣️',
  '💕',
  '💞',
  '💓',
  '💗',
  '💖',
  '💘',
  '💝',
  '💟',
  // 符號類
  '✅',
  '❌',
  '✔️',
  '💯',
  '💢',
  '💥',
  '💫',
  '💦',
  '💨',
  '🕳️',
  '💣',
  '💬',
  '💭',
  '💤',
  '🔥',
  '⭐',
  '🌟',
  '✨',
  '⚡',
  '☄️',
  // 自然類
  '☀️',
  '🌤️',
  '⛅',
  '🌥️',
  '☁️',
  '🌦️',
  '🌧️',
  '⛈️',
  '🌩️',
  '☔',
  '❄️',
  '☃️',
  '⛄',
  '🌬️',
  '💧',
  '🌊',
  '🌫️',
  '🌪️',
  '🌈',
  '🌙',
  '⭐',
  '🌟',
  '🌍',
  '🌎',
  '🌏',
  '🪐',
  // 慶祝與活動類
  '🎉',
  '🎊',
  '🎈',
  '🎁',
  '🎀',
  '🏆',
  '🥇',
  '🥈',
  '🥉',
  '🎖️',
  '🏅',
  '🎗️',
  '🎫',
  '🎟️',
  '🎪',
  '🎭',
  '🎨',
  '🎬',
  '🎤',
  '🎧',
  '🎼',
  '🎹',
  '🥁',
  '🎷',
  '🎺',
  '🎸',
  '🪕',
  '🎻',
  '🎲',
  '🎯',
  '🎳',
  '🎮',
  '🎰',

]

function onSelect(emoji: string) {
  emit('select', emoji)
  close()
}

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Transition name="emoji-slide">
    <div v-if="props.modelValue" class="emoji-panel">
      <header class="emoji-header">
        <span>{{ $$t('表情符号') }}</span>
        <IconChatClose class="emoji-close" @click="close" />
      </header>
      <div class="chat-emoji-container">
        <button
          v-for="emoji in emojis"
          :key="emoji"
          type="button"
          class="emoji-item"
          @click="onSelect(emoji)"
        >
          {{ emoji }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.emoji-panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 131px;
  width: 100%;
  background: #213743;
  overflow: hidden;
  padding-bottom: env(safe-area-inset-bottom, 12px);
  z-index: 11;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.5);
}

.emoji-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 14px;
  color: #fff;
}

.emoji-close {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}

.chat-emoji-container {
  height: 224px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 16px;
  margin: 0 25px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(217, 217, 217, 0.2);
    border-radius: 999px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

.emoji-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 6px;
  font-size: 22px;
  background: #213743;
  color: inherit;
  cursor: pointer;
  transition: background 0.15s ease;
  cursor: pointer;
  &:hover {
    background: #d9d9d9;
  }
}

.emoji-slide-enter-active,
.emoji-slide-leave-active {
  transition:
    transform 0.18s ease,
    opacity 0.18s ease;
}

.emoji-slide-enter-from,
.emoji-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
