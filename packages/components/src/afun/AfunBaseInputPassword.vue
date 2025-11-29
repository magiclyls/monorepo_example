<script setup lang='ts'>
import { useBoolean } from '@tg/hooks'
import { IconUniError } from '@tg/icons'
import { computed, ref } from 'vue'

interface Props {
  /** 密码 */
  modelValue: string
  /** 宽度是否auto */
  widthAuto?: boolean
  /** 错误提示 */
  msg?: string
  /** 是否密文 */
  isCipherText?: boolean
  /** 是否禁用 */
  disabled?: boolean
  msgAfterTouched?: boolean
  split?: boolean // true一个个隔开的样式暂未用到，等用到这种样式的设计补全再加上
}
defineOptions({
  name: 'AfunBaseInputPassword',
})
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  widthAuto: false,
  isCipherText: true,
  disabled: false,
  split: false,
})
const emit = defineEmits(['update:modelValue', 'blur'])

const {
  bool: isTouched,
  setTrue: setTouchTrue,
  setFalse: setTouchFalse,
} = useBoolean(false)

const inputValue = ref(props.modelValue)
const inputRef = ref<HTMLElement>()
/** 光标位置 */
const textLength = ref<number | null>(null)
/** 已输入字符 */
const entered = ref<number>(0)

const inputValueList = computed(() => {
  return props.modelValue.split('')
})
const error = computed(() => {
  if (props.msgAfterTouched)
    return isTouched.value && !!props.msg
  return !!props.msg
})

const onFocus = function () {
  inputRef.value?.focus()
  textLength.value = props.modelValue.length
}
const onBlur = function (event: any) {
  textLength.value = null
  !!event.target.value && setTouchTrue()
  emit('blur')
}
const changeText = function (e: any) {
  const value = e.target.value.replace(/\D/g, '')
  inputValue.value = value
  textLength.value = value.length
  entered.value = value.length
  entered.value >= 6 && inputRef.value?.blur()
  emit('update:modelValue', value)
}

defineExpose({ setTouchTrue, setTouchFalse, setFocus: onFocus })
</script>

<template>
  <div class="base-input-password">
    <input
      ref="inputRef" v-model="inputValue" type="password" maxlength="6" :disabled="disabled" inputmode="numeric"
      @input="changeText" @blur="onBlur" @paste.prevent
    >
    <ul
      class="password-wrap"
      :class="{
        'active-bg': textLength !== null && !disabled,
        'split-style': split,
      }"
      @click="onFocus"
    >
      <div v-for="item in 6" :key="item" class="flex grow">
        <li
          :class="{
            active: textLength === (item - 1) && !disabled,
            show: entered > (item - 1) && props.isCipherText && !disabled,

          }"
        >
          <span v-if="!props.isCipherText">{{ inputValueList[(item - 1)] }}</span>
          <i />
          <b />
        </li>
        <div
          class="h-full w-[1px] bg-[transparent] split-border" :class="[
            item < 6 ? 'show' : 'none',
            {
              active: textLength !== null && !disabled,
            },
          ]"
        />
      </div>
    </ul>
    <div v-show="error" class="mt-[4px] flex items-center text-[12px] text-[#FF4D4F]  font-[600]">
      <IconUniError class="text-[14px] text-[#ff4d4f]" />
      <span class="ml-[4px] text-[12px]">
        {{ msg }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-input-password {
  position: relative;
  input {
    position: absolute;
    opacity: 0;
    z-index: -1;
    left: -1000px;
  }
  .password-wrap {
    display: flex;
    width: 100%;
    background-color: #0f212e;
    border: 2px #2f4553 solid;
    border-radius: 4px;
    &.active-bg {
      border-color: #f23038;
    }
    li {
      position: relative;
      flex: 1;
      height: 40px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 8px;
        height: 8px;
        background-color: #fff;
        border-radius: 100%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        visibility: hidden;
      }

      &.show {
        i {
          visibility: visible;
        }
      }
      &.active {
        b {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 1px;
          height: 60%;
          background-color: #0d2245;
          -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          animation: 1s cursor-flicker infinite;
          -webkit-animation: 1s cursor-flicker infinite;
        }
      }
      @keyframes cursor-flicker {
        0% {
          opacity: 0;
        }

        50% {
          opacity: 1;
        }

        100% {
          opacity: 0;
        }
      }
    }
    .split-border {
      &.show {
        background-color: #2f4553;
      }
      &.active {
        background-color: #f23038;
      }
      &.none {
        background: none;
      }
    }
    &.split-style {
      // 待需要，设计补全再加
    }
  }
}
</style>
