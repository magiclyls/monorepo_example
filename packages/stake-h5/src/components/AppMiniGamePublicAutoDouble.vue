<script setup lang='ts'>
import { IconUniPersent } from '@tg/icons'

/** 上一局输或赢 下一句加倍组件 */
interface Props {
  modelValue: string
  disabled?: boolean
}
defineOptions({
  name: 'AppMiniGamePublicAutoDouble',
})
const props = withDefaults(defineProps<Props>(), {
  disabled: undefined,
})
const emit = defineEmits(['update:modelValue', 'input'])
const formDisabled = inject('formDisabled', ref(false))

const { t } = useI18n()
const { bool: isReset, toggle: toggleReset } = useBoolean(true)

const _disabled = computed(() => props.disabled ?? formDisabled.value)
// 保存输入的金额
const _value = ref('0')

function reset() {
  if (_disabled.value)
    return
  if (!isReset.value)
    toggleReset()
  emit('update:modelValue', '0')
}
function add() {
  if (_disabled.value)
    return
  if (isReset.value)
    toggleReset()
  emit('update:modelValue', _value.value)
}
function onInput(e: any) {
  const v = e.target.value

  _value.value = scientificToString(v)
  emit('input', scientificToString(v))
  emit('update:modelValue', scientificToString(v))
}
</script>

<template>
  <div
    class="theme-shadow bg-tg-secondary w-full inline-flex rounded-[4px]"
    :class="[_disabled ? 'theme-opacity cursor-not-allowed' : '']"
  >
    <div class="flex p-[2px]">
      <div
        class="whitespace-nowrap rounded-[4px] p-[12px] text-[12px] font-semibold leading-[1] duration-[0.25s]"
        :class="[_disabled ? 'cursor-not-allowed' : 'cursor-pointer', isReset ? 'theme-bg theme-shadow theme-text' : 'hover:bg-[var(--app-mini-game-public-auto-double-bg-hover)] hover:text-tg-text-white text-tg-text-white']"
        @click="reset"
      >
        {{ t('mini_reset') }}
      </div>
      <div
        class="whitespace-nowrap rounded-[4px] p-[12px] text-[12px] font-semibold leading-[1] duration-[0.25s]"
        :class="[_disabled ? 'cursor-not-allowed' : 'cursor-pointer', !isReset ? 'theme-bg theme-shadow theme-text' : 'text-tg-text-white  hover:bg-[var(--app-mini-game-public-auto-double-bg-hover)] hover:text-tg-text-white']"
        @click="add"
      >
        {{ t('mini_add') }}
      </div>
    </div>
    <div class="relative w-full inline-flex text-[16px] @md:max-w-full">
      <input
        :value="modelValue" type="number" inputmode="decimal" min="0" :disabled="isReset"
        class="theme-bg theme-input text-tg-text-white border-tg-secondary hover:border-[var(--tg-border-color-deep-grey)] focus:border-[var(--tg-border-color-deep-grey)] w-full border-[2px] rounded-[4px] border-solid py-[7px] pl-[7px] pr-[28px] text-[14px] font-semibold duration-[0.25s]"
        :class="[isReset ? 'cursor-not-allowed theme-opacity' : 'cursor-text']"
        @input="onInput"
      >
      <IconUniPersent class="theme-icon absolute right-[12px] top-[50%] translate-y-[-50%]" />
    </div>
  </div>
</template>

<style>
:root {
  --app-mini-game-public-auto-double-bg-hover: var(-tg-text-grey);
}

[theme="greenblack"] {
  --app-mini-game-public-auto-double-bg-hover: #1F9A75;
}
[theme="white"] {
  --tg-secondary-main:#FFFFFF
}
</style>

<style lang="scss" scoped>
.tg-icon-container {
  position: absolute;
}
.theme-input{
  @include webTheme('white'){
    border-width: 1px;
    --tg-border-color-deep-grey:#F2CA5C;
  }
}
.theme-bg{
  background-color: var(--tg-secondary-dark);
  @include webTheme('white'){
    background-color: #E8E8E8;
  }
  @include webTheme('green'){
    background-color: #02432D;
    border-width: 1px;
  }
}
.theme-text{
  color: var(--tg-text-lightgrey);
  @include webTheme('white'){
    color: #111;
  }
}
.theme-opacity{
  opacity: 0.5;
  @include webTheme('white'){
    opacity: 1;
  }
}
.theme-shadow{
  box-shadow: var(--tg-box-shadow);
  @include webTheme('white'){
    box-shadow: none;
  }
}
.theme-icon{
  @include webTheme('white'){
   --tg-icon-color:#555;
  }
}
</style>
