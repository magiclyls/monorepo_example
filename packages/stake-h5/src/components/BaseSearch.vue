<script setup lang='ts'>
import { IconUniClose, IconUniSearch } from '@tg/icons'

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
    <div class="content-box" :class="{ 'pl-[10px]': $slots.left }">
      <IconUniSearch v-if="searchIcon" class="search-icon" />
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
  --tg-base-search-style-bg: var(--tg-secondary-dark);
  --tg-base-search-icon-size: var(--tg-font-size-lg);
  --tg-base-search-border-width: var(--tg-border-width-sm);
  --tg-base-search-base-padding-x: 16px;
  --tg-base-input-line-height: 1.5;
  --tg-base-input-white-style-bg: var(--tg-text-white);
  --tg-base-search-icon-color: #d8d8d8;
  --tg-base-search-icon-border-color: #d8d8d8;
  --tg-base-search-placeholder-color: var(--tg-text-placeholder);
}

[theme="white"] {
  --tg-base-search-style-bg: #F5F5F5;
  --tg-base-input-white-style-bg: #F5F5F5;
  --tg-base-search-placeholder-color:#d8d8d8;
}
[theme="green"] {
  --tg-base-search-style-bg: #055434;
  --tg-base-input-white-style-bg: #fff;
  --tg-base-search-input-grey-border:#C1C1C1;
  --tg-search-input-text-color:#3CB389 ;
  --tg-search-icon-color: #197B5980;
  --tg-search-icon-color-grey:#B1BAD3;
  --tg-search-placeholder-text-color:#3CB389;
  --tg-search-text-color-grey:#555555
}
</style>

<style lang='scss' scoped>
.search-icon.app-svg-icon {
   color: var(--tg-text-placeholder);
   @include webTheme('green'){
    color:var(--tg-search-icon-color);
   }
   @include webTheme('white'){
    /* color: #d8d8d8; */
    color: var(--tg-base-search-icon-color);
   }
}

.base-search {
  border-width: var(--tg-base-search-border-width);
  border-style: solid;
  border-color: var(--tg-border-color-main);
  background-color: var(--tg-base-search-style-bg);
  display: flex;
  align-items: stretch;
  position: relative;
  color: var(--tg-text-white);
  cursor: text;
  @include webTheme('white'){
    border-color:var(--tg-base-search-icon-border-color);
  }
  &.basePadding {
    padding-left: var(--tg-base-search-base-padding-x);
    padding-right: var(--tg-base-search-base-padding-x);
  }

  &.shadow {
    box-shadow: var(--tg-box-shadow);
    @include webTheme('white'){
      box-shadow: none;
    }
    @include webTheme('green'){
      box-shadow: none;
    }
  }

  &:hover:not(.whiteStyle) {
    border-color: var(--tg-border-color-deep-grey);
    @include webTheme('white'){
      border-color: #c1c1c1;
    }
    @include webTheme('green'){
      border-color: #5ECEA6;
    }
  }

  .left-box {
    border-right-width: var(--tg-border-width-sm);
    border-right-style: solid;
    border-right-color: var(--tg-secondary-main);
    padding-right: var(--tg-spacing-5);
    display: flex;
    align-items: center;
    @include webTheme('white'){
      border-right-color: #e3e3e3;
    }
  }

  .clear-icon {
    padding-top: 2px;
    font-size: var(--tg-font-size-default);
    position: absolute;
    right: var(--tg-spacing-17);
    cursor: pointer;
    &:hover {
      --tg-icon-color: var(--tg-text-white);
    }

    &.whiteStyle {
      --tg-icon-color: var(--tg-secondary-main);
      cursor: default;
    }
    .app-svg-icon {
      @include webTheme('green'){
        color:  var(--tg-text-white);
      }
    }
  }

  .content-box {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: var(--tg-font-size-lg);

    .search-icon {
      font-size: var(--tg-base-search-icon-size);
    }
  }

  input {
    width: 85%;
    border: none;
    outline: none;
    background-color: transparent;
    padding: var(--tg-spacing-input-padding-vertical) var(--tg-spacing-input-padding-horizontal);
    font-size: var(--tg-font-size-default);
    line-height: var(--tg-base-input-line-height);
    color: var(--tg-text-white);
    font-weight: var(--tg-font-weight-semibold);
    cursor: text;
    @include webTheme('green'){
      color: #5ECEA6;
    }
    &::placeholder {
      color: var(--tg-base-search-placeholder-color);
      font-weight: var(--tg-font-weight-semibold);

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
  border-color: var(--tg-border-color-deep-grey);
  @include webTheme('white'){
    border-color: #c1c1c1;
  }
  @include webTheme('green'){
    border-color: #5ECEA6;
  }
  .left-box {
    @include webTheme('green'){
      border-right-color: #5ECEA6;
    }
  }
}

.whiteStyle {
  background-color: var(--tg-base-input-white-style-bg);
  color: var(--tg-text-secondary-main);
  border-color: var(--tg-border-color-grey);

  .search-icon.app-svg-icon {
    color: var(--tg-text-grey-light);
  }

  input {
    color: var(--tg-secondary-main);
    @include webTheme('green'){
        color:var(--tg-search-input-text-color);
      }

    &::placeholder {
      color: var(--tg-secondary-main);
      font-weight: var(--tg-font-weight-semibold);
      opacity: 0.8;
      @include webTheme('green'){
        color:var(--tg-search-placeholder-text-color);
      }
    }
  }
}

.square {
  border-radius: var(--tg-radius-default);
}

.round {
  border-radius: 100px;
  @include webTheme('white'){
    border-radius: 6px;
  }
  @include webTheme('green'){
    border-radius: 6px;
  }
  @include webTheme('greenblack'){
    border-radius: 6px;
  }
}

[theme="greenblack"]{
  .base-search{
    border:none;
  }
}
</style>
