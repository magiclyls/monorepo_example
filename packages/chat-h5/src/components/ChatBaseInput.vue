<script setup lang="ts">
import { BaseImage } from '@tg/bccomponents'
import { computed, nextTick, ref } from 'vue'
import { useLocale } from '../components/ChatConfigProvider'

defineOptions({
  name: 'ChatBaseInput',
})
const props = withDefaults(defineProps<{
  modelValue?: boolean
  text?: string
  isH5?: boolean
  disabled?: boolean
}>(), {
  modelValue: false,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:text', value: string): void
  (e: 'enter'): void
}>()

const textProxy = computed({
  get: () => props.text ?? '',
  set: value => emit('update:text', value),
})
const inputRef = ref<HTMLInputElement | null>(null)
const { $$t } = useLocale()
function toggleEmoji(next: boolean) {
  if (next === props.modelValue)
    return
  emit('update:modelValue', next)
}

function appendEmoji(emoji: string) {
  textProxy.value = `${textProxy.value}${emoji}`
  nextTick(() => inputRef.value?.focus())
}

function onEnter() {
  emit('enter')
}

defineExpose({
  appendEmoji,
})
</script>

<template>
  <div class="w-full">
    <div class="h-[42px] bg-[#12212D] border border-[#304554] rounded-[4px] border-[2px] flex items-center justify-between shadow-[0_2px_4px_0_rgba(0,0,0,0.25)]">
      <input
        ref="inputRef"
        v-model="textProxy"
        class="w-full h-full input"
        type="text"
        :placeholder="$$t('输入您的消息')"
        :disabled="disabled"
        @keydown.enter.prevent="onEnter"
      >
      <BaseImage
        v-if="!props.modelValue"
        :url="props.isH5 ? '/m/chat-h5/png/chat-emoji.png' : '/chat-h5/png/chat-emoji.png'"
        class="w-[16px] h-[16px] mr-[12px] cursor-pointer"
        @click="!disabled && toggleEmoji(true)"
      />
      <BaseImage
        v-else
        :url="props.isH5 ? '/m/chat-h5/png/chat-keyboard.png' : '/chat-h5/png/chat-keyboard.png'"
        class="w-[16px] h-[16px] mr-[12px] cursor-pointer"
        @click="toggleEmoji(false)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input {
  font-weight: 600;
  font-size: 14px;
  padding: 0 12px;
  color: #fff;
}
</style>
