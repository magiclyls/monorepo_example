<script setup lang="ts">
import { IconPhClose } from '@tg/icons'
import { provide, watch } from 'vue'

interface Props {
  modelValue: boolean
  position?: 'left' | 'bottom' | 'top'
  title?: string
  withBg?: boolean
  animation?: boolean
  rerender?: boolean
}

defineOptions({ name: 'AfunBasePopup' })
const props = withDefaults(defineProps<Props>(), {
  position: 'bottom',
  withBg: true,
  animation: true,
  rerender: false,
})
const emit = defineEmits(['update:modelValue', 'close'])

function close() {
  emit('update:modelValue', !props.modelValue)
  emit('close', !props.modelValue)
}

watch(() => props.modelValue, (val) => {
  if (val) {
    document.body.classList.add('lock-scroll')
  }
  else {
    document.body.classList.remove('lock-scroll')
  }
})

provide('closePopup', close)
</script>

<template>
  <Teleport to="body">
    <Transition :name="animation ? 'fixed' : ''">
      <div v-show="modelValue" class="popup-overlay-pc-wrapper">
        <div class="popup-overlay" :class="{ hide: !modelValue || !withBg }">
          <Transition :name="animation ? position : ''">
            <!-- 销毁重建 -->
            <template v-if="rerender">
              <div v-if="modelValue" :class="[position]" class="w-full h-full" @click.self="close">
                <slot name="header">
                  <div v-if="title" class="center relative bg-[#fff] pt-[12px] rounded-tl-[8px] rounded-tr-[8px] text-[#0D2245] pb-[10px] font-semibold rounded-[8px 8px 0 0]">
                    {{ title }}
                    <div class="absolute top-[50%] -translate-y-1/2 right-[12px] cursor-pointer" @click="close">
                      <IconPhClose class="text-[16px] text-[#9dabc8]" />
                    </div>
                  </div>
                </slot>
                <slot :close="close" />
              </div>
            </template>
            <template v-else>
              <div v-show="modelValue" :class="[position]" class="w-full h-full" @click.self="close">
                <slot name="header">
                  <div v-if="title" class="center relative bg-[#fff] pt-[12px] rounded-tl-[8px] rounded-tr-[8px] text-[#0D2245] pb-[10px] font-semibold rounded-[8px 8px 0 0]">
                    {{ title }}
                    <div class="absolute top-[50%] -translate-y-1/2 right-[12px] cursor-pointer" @click="close">
                      <IconPhClose class="text-[16px] text-[#9dabc8]" />
                    </div>
                  </div>
                </slot>
                <slot :close="close" />
              </div>
            </template>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

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
  transition: all ease-out 0.3s;
  &.hide {
    background-color: transparent;
  }
}

.bottom {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.top {
  display: flex;
  flex-direction: column;
}

.fixed-enter-active,
.fixed-leave-active {
  transition: all 0.3s ease-out;
}
.fixed-enter-from {
  opacity: 0;
}

.left-enter-active,
.left-leave-active {
  transition: transform 0.3s ease-out;
}
.left-enter-from,
.left-leave-to {
  transform: translate3d(-100%, 0, 0);
}

.bottom-enter-active,
.bottom-leave-active {
  transition: transform 0.3s ease-out;
}
.bottom-enter-from,
.bottom-leave-to {
  transform: translate3d(0%, 100%, 0);
}

.top-enter-active,
.top-leave-active {
  transition: transform 0.3s ease-out;
}
.top-enter-from,
.top-leave-to {
  transform: translate3d(0%, -100%, 0);
}
</style>
