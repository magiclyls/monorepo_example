<script setup lang='ts'>
import { useBoolean } from '@tg/hooks'
import { IconUniClose, IconUniSearch } from '@tg/icons'
import { ref } from 'vue'

interface Props {
  placeHolder?: string
  shape?: 'square' | 'round'
  modelValue: string
  clearable?: boolean
  whiteStyle?: boolean
  shadow?: boolean
  searchIcon?: boolean
  inputMode?: 'decimal' | 'email' | 'none' | 'numeric' | 'search' | 'tel' | 'text' | 'url'
  duration?: boolean
  type?: 'text' | 'password' | 'number' | 'email'
}
defineOptions({
  name: 'BaseSearch',
})
const props = withDefaults(defineProps<Props>(), {
  placeHolder: 'Search...',
  type: 'text',
  shape: 'round',
  shadow: true,
  searchIcon: true,
  inputMode: 'text',
  duration: true,
})
const emit = defineEmits(
  ['update:modelValue', 'input', 'search', 'focus', 'blur', 'clear', 'close'],
)

const { bool: isFocus, setTrue, setFalse } = useBoolean(false)
const inputRef = ref()

function onInput(event: any) {
  const v = event.target.value
  emit('update:modelValue', v)
  emit('input', v)
}
function onFocus() {
  setTrue()
  emit('focus')
}
function onBlur() {
  setFalse()
  emit('blur')
}
function onSearch() {
  emit('search')
}
function onClear() {
  emit('update:modelValue', '')
  emit('clear')
  if (!props.modelValue)
    emit('close')
}
function manualFocus() {
  inputRef.value.focus()
}
function manualBlur() {
  inputRef.value.blur()
}

defineExpose({ manualFocus, manualBlur })
</script>

<template>
  <div
    class="base-search"
    :class="[shape, { whiteStyle, 'active': isFocus, shadow, 'basePadding': $slots.left || searchIcon, 'duration-[0.25s]': duration }]"
  >
    <div v-show="$slots.left" class="left-box">
      <slot name="left" />
    </div>
    <div class="content-box" :class="{ 'pl-[10rem]': $slots.left }">
      <IconUniSearch v-if="searchIcon" class="text-[#b1bad3] text-[20px]" />
      <input
        ref="inputRef" :type="type" :value="modelValue" :placeholder="placeHolder" :inputMode="inputMode"
        @input="onInput" @keypress.enter="onSearch" @blur="onBlur" @focus="onFocus"
      >

      <div v-if="clearable" class="clear-icon" :class="{ whiteStyle }" @click="onClear">
        <IconUniClose />
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --tg-base-search-style-bg: #0f212e;
  --tg-base-search-icon-size: 20px;
  --tg-base-search-border-width: 2rem;
  --tg-base-search-base-padding-x: 16rem;
  --tg-base-input-line-height: 1.5;
  --tg-base-input-white-style-bg: #fff;
  --tg-base-search-icon-color: #d8d8d8;
  --tg-base-search-icon-border-color: #d8d8d8;
  --tg-base-search-placeholder-color: #566671;
}
</style>

<style lang='scss' scoped>
.base-search {
  border-width: var(--tg-base-search-border-width);
  border-style: solid;
  border-color: #2f4553;
  background-color: var(--tg-base-search-style-bg);
  display: flex;
  align-items: stretch;
  position: relative;
  color: #fff;
  cursor: text;
  &.basePadding {
    padding-left: var(--tg-base-search-base-padding-x);
    padding-right: var(--tg-base-search-base-padding-x);
  }

  &.shadow {
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.2),
      0 2px 4px -1px rgba(0, 0, 0, 0.122);
  }

  .left-box {
    border-right-width: 2rem;
    border-right-style: solid;
    border-right-color: #2f4553;
    padding-right: 5rem;
    display: flex;
    align-items: center;
  }

  .clear-icon {
    padding-top: 2px;
    font-size: 14px;
    position: absolute;
    right: 17rem;
    cursor: pointer;
    &:hover {
      --tg-icon-color: #fff;
    }

    &.whiteStyle {
      --tg-icon-color: #2f4553;
      cursor: default;
    }
  }

  .content-box {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 16px;

    .search-icon {
      font-size: var(--tg-base-search-icon-size);
    }
  }

  input {
    width: 85%;
    border: none;
    outline: none;
    background-color: transparent;
    padding: 8rem 10rem;
    font-size: 14px;
    line-height: 1.5;
    color: #fff;
    font-weight: 600;
    cursor: text;
    &::placeholder {
      color: var(--tg-base-search-placeholder-color);
      font-weight: 600;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      appearance: none;
      margin: 0;
    }
  }
}

.active {
  border-color: #557086;
}

.whiteStyle {
  background-color: var(--tg-base-input-white-style-bg);
  color: #2f4553;
  border-color: #d5dceb;

  .search-icon.app-svg-icon {
    color: #d5dceb;
  }

  input {
    color: #2f4553;

    &::placeholder {
      color: #2f4553;
      font-weight: 600;
      opacity: 0.8;
    }
  }
}

.square {
  border-radius: 4rem;
}

.round {
  border-radius: 100px;
}
</style>
