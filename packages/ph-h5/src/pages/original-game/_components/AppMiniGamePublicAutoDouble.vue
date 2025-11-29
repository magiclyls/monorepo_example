<script setup lang='ts'>
import { useBoolean } from '@tg/hooks'
import { IconUniPersent } from '@tg/icons'
import { scientificToString } from '@tg/utils'
import { computed, inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'

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
    class=" bg-[#EBEBEB] w-full inline-flex gap-[2rem] rounded-[4rem]"
    :class="[_disabled ? 'theme-opacity cursor-not-allowed' : '']"
  >
    <div class="flex p-[2rem]">
      <div
        class="whitespace-nowrap rounded-[4rem] p-[12rem] text-[12rem] font-semibold leading-[1.15] duration-[0.25s]"
        :class="[_disabled ? 'cursor-not-allowed' : 'cursor-pointer', isReset ? 'theme-bg  theme-text' : 'theme-text hover:bg-[#ebebeb] hover:text-[#0D2245] text-[#0D2245]']"
        @click="reset"
      >
        {{ t('重置') }}
      </div>
      <div
        class="whitespace-nowrap rounded-[4rem] p-[12rem] text-[12rem] font-semibold leading-[1.15] duration-[0.25s]"
        :class="[_disabled ? 'cursor-not-allowed' : 'cursor-pointer', !isReset ? 'theme-bg  theme-text' : 'theme-text  hover:bg-[#ebebeb] hover:text-[#0D2245]']"
        @click="add"
      >
        {{ t('增加') }}
      </div>
    </div>
    <div class="relative w-full inline-flex text-[14rem] ">
      <input
        :value="modelValue" type="number" inputmode="decimal" min="0" :disabled="isReset"
        class="theme-bg theme-input leading[1.5] w-full rounded-[4rem] py-[8rem] pl-[7rem] pr-[28rem] text-[14rem] font-semibold duration-[0.25s]"
        :class="[isReset ? 'cursor-not-allowed theme-opacity' : 'cursor-text']" @input="onInput"
      >
      <div class="absolute top-[50%] right-[12rem] translate-y-[-50%] flex items-center">
        <IconUniPersent class="theme-icon" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-input {
  border: 2rem solid #ebebeb;
}

.theme-bg {
  background-color: #fff;
}

.theme-text {
  color: #0d2245;
}

.theme-opacity {
  opacity: 0.5;
}

.theme-icon {
}
</style>
