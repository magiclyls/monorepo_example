<script setup lang="ts">
import { IconPhClose } from '@tg/icons'
import { provide, watch } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
}

defineOptions({ name: 'SSBasePopup' })
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', !props.modelValue)
}

watch(() => props.modelValue, (val) => {
  if (val) {
    document.body.classList.add('lock-scroll')
  }
  else {
    document.body.classList.remove('lock-scroll')
  }
}, { immediate: true })

provide('closePopup', close)
</script>

<template>
  <Teleport to="body">
    <!-- 兼容pc动画再套一个盒子 -->
    <Transition name="fixed">
      <div v-show="modelValue" class="popup-overlay-pc-wrapper">
        <div class="popup-overlay" :class="{ hide: !modelValue }">
          <Transition name="bottom">
            <div v-show="modelValue" class="w-full h-full bottom" @click.self="close">
              <slot name="header">
                <div v-if="title" class="center relative bg-[var(--ss-base-popup-bg1)] pt-[12rem] rounded-tl-[8px] rounded-tr-[8px] text-[var(--ss-base-popup-color1)] pb-[10rem] font-semibold rounded-[8rem 8rem 0 0]">
                  {{ title }}
                  <div class="absolute top-[50%] -translate-y-1/2 right-[12rem] cursor-pointer" @click="close">
                    <IconPhClose class="text-[16rem] text-[var(--ss-base-popup-color2)]" />
                  </div>
                </div>
              </slot>
              <slot />
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
:root {
  --ss-base-popup-bg1: #fff;
  --ss-base-popup-color1: #0d2245;
  --ss-base-popup-color2: #9dabc8;
}
</style>

<style lang="scss" scoped>
.popup-overlay-pc-wrapper {
  position: fixed;
  inset: 0;
  max-width: var(--pc-max-width);
  width: 100%;
  left: 50%;
  transform: translate(-50%, 0);
  overflow: hidden;
  z-index: 999;
}
.popup-overlay {
  width: 100%;
  height: 100%;
  touch-action: pan-x;
  background-color: #0009;
  visibility: visible;
  &.hide {
    background-color: transparent;
  }
}
.fixed-enter-active,
.fixed-leave-active {
  transition: all 100ms;
}

.bottom {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.bottom-enter-active,
.bottom-leave-active {
  transition: transform 100ms linear;
}
.bottom-enter-from,
.bottom-leave-to {
  transform: translate3d(0%, 100%, 0);
}
</style>
