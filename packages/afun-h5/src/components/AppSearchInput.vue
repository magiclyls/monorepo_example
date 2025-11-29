<script setup lang="ts">
import { IconCloseIcon, IconUniSearch } from '@tg/icons'
import { nextTick, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  fake?: boolean
  modelValue?: string
  autoFocus?: boolean
  showClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fake: false,
  autoFocus: false,
  showClose: false,
})
const emit = defineEmits(['close', 'update:modelValue', 'onclick', 'enter', 'onfocus'])
const { t } = useI18n()

const inputEl = ref()
const isComposing = ref<boolean>(false)
function onInput(e: Event) {
  // ⚠️ 中文输入法中不触发
  if (!isComposing.value) {
    emit('update:modelValue', (e.target as any).value)
  }
}

function onCompositionEnd(e: Event) {
  // 输入法结束，上屏文字
  isComposing.value = false
  emit('update:modelValue', (e.target as any).value)
}

onMounted(() => {
  nextTick(() => {
    props.autoFocus && inputEl.value && inputEl.value.focus()
  })
})
</script>

<template>
  <div
    v-if="fake"
    class="relative mt-[12px] px-[12px] flex items-center h-[42px] cursor-pointer border border-[#2F4553] rounded-[4px]"
    @click="emit('onclick')"
  >
    <IconUniSearch class="text-[16px] text-[#8493a0]" />
    <div class="flex text-[16px] items-center text-[#566771] font-[600] flex-1 border-none pl-[8px]">
      {{ t('搜索游戏') }}
    </div>
  </div>
  <div
    v-else
    class="relative flex h-[42px] rounded-[4px]"
  >
    <input
      ref="inputEl" :value="modelValue" autocomplete="off" name="search"
      class="rounded-[4px] font-[600] text-[16px] text-[#fff] h-full w-full flex-1 outline-none border-[1px] border-solid border-[#2F4553] focus:border-[#557086] pl-[34px]"
      type="text"
      :placeholder="t('搜索游戏')"
      @compositionstart="isComposing = true"
      @compositionend="onCompositionEnd"
      @input="onInput" @keyup.enter="emit('enter')" @focus="emit('onfocus')"
    >
    <div class="absolute left-[10px] top-[14px]">
      <IconUniSearch class="text-[16px] text-[#567086]" />
    </div>
    <div
      v-if="modelValue && modelValue.length > 0 || showClose"
      class="absolute right-0 px-[14px] center h-full top-[0px] font-[600] text-[#B1BAD3] text-[10px] cursor-pointer"
      @click="emit('close')"
    >
      <IconCloseIcon />
    </div>
  </div>
</template>

<style scoped>
  input::placeholder {
  color: #566771; /* 设置想要的颜色 */
  opacity: 1; /* 有些浏览器默认会降低透明度 */
}

/* 针对不同浏览器兼容写法（一般现在不需要都写）*/
input::-webkit-input-placeholder {
  color: #566771;
}
input:-ms-input-placeholder {
  color: #566771;
}
input::-ms-input-placeholder {
  color: #566771;
}
</style>
