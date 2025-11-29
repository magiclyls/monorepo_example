<script setup lang='ts'>
import {IconBcChecked} from '@tg/icons';

interface Props {
  modelValue: boolean
  /** label可以用slot，可以用h函数，可以用string */
  label?: () => ReturnType<typeof h> | string
  msg?: string
  /** v-model:showMsg */
  showMsg?: boolean
}
defineOptions({
  name: 'BaseBcGameCheckBox',
})
const props = defineProps<Props>()
const emits = defineEmits(['update:modelValue', 'change', 'update:showMsg'])

const pop = ref(null)
const isCheck = computed(() => props.modelValue)
const msg = computed(() => props.msg || '')
const isShow = computed(() => {
  if (props.msg && props.showMsg)
    return true

  return false
})

function onClick() {
  emits('update:modelValue', !isCheck.value)
  emits('change', !isCheck.value)
}
function close() {
  emits('update:showMsg', false)
}
onClickOutside(pop, () => close())
</script>

<template>
  <div class="BaseBcGameCheckbox base-check-box relative flex items-center">
    <button type="button" class="checkbox mr-[6px] btn" @click="onClick">
      <div class="checkbox-ico relative" :aria-selected=" isCheck ? true : null ">
        <IconBcChecked v-if="isCheck" name="bc-checked" class="icon-size absolute left-0 top-0 h-full w-full text-center" />
      </div>
    </button>
    <div v-if="isShow" ref="pop" class="text-tg-text-white pop-bg absolute left-0 top-[22px] z-10 rounded-lg p-[8px] text-[12px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
      <span>{{ msg }}</span>
    </div>
    <div class="checkbox-label">
      <slot name="label">
        <template v-if="typeof label === 'function'">
          <component :is="label()" />
        </template>
        <template v-else-if="typeof label === 'string'">
          {{ label }}
        </template>
      </slot>
    </div>
  </div>
</template>

<style>
:root{
    --bc-base-checkbox-fontsize: var(--tg-font-size-default);
  --bc-base-checkbox-width: 16px;
  --bc-base-checkbox-height: 16px;
  --bc-base-checkbox-border-width: var(--tg-border-width-sm);
  --bc-base-checkbox-border-width-active: calc(var(--bc-base-checkbox-height)/2);
  --bc-base-checkbox-border-radius: var(--tg-radius-xs);
  --bc-base-checkbox-border-color: #24EE89;
  --bc-base-checkbox-pop-bg-color: rgb(58 65 66);
}
</style>

<style lang="scss" scoped>
.BaseBcGameCheckbox{
    font-size: var(--bc-base-checkbox-fontsize);
    button{
        background: none;
        -webkit-appearance: button;
    }
    .btn{
        &:active{
            transform: scale(1.3);
            filter: brightness(1.05);
        }
    }
    .icon-size{
        --bc-base-checkbox-icon-fontsize: var(--bc-base-checkbox-width);
        font-size: var(--bc-base-checkbox-icon-fontsize);
    }
    .checkbox-ico{
        width: var(--bc-base-checkbox-width);
        height: var(--bc-base-checkbox-height);

        &::before{
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: var(--bc-base-checkbox-border-radius);
            transition: all .15s;
            border: var(--bc-base-checkbox-border-width) solid #e4eaf019;
        }
        &[aria-selected]::before{
            border-color: rgb(36 238 137);
            border-width: var(--bc-base-checkbox-border-width-active)
        }
    }
    .pop-bg{
      background-color: var(--bc-base-checkbox-pop-bg-color);
      &::after{
        content:'';
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 8px solid var(--bc-base-checkbox-pop-bg-color);
        position: absolute;
        top: -5px;
        left: 2px;
      }
    }
}
</style>
