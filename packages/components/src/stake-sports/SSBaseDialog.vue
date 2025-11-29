<script setup lang="ts">
import type { Ref } from 'vue'
import { IconUniClose3 } from '@tg/icons'
import { provide } from 'vue'
import SSBaseLoading from './SSBaseLoading.vue'

interface Props {
  modelValue: boolean
  icon?: string
  title?: string
  showLoad?: boolean
  showClose?: boolean
  showHeader?: boolean
  position?: 'center' | 'start' | 'end'
  teleport?: string | Ref
}

defineOptions({ name: 'SSBaseDialog' })
const props = withDefaults(defineProps<Props>(), {
  showLoad: true,
  showClose: true,
  showHeader: true,
  teleport: 'body',
  position: 'center',
})
const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', !props.modelValue)
}

provide('closeDialog', close)
</script>

<template>
  <Teleport :to="teleport">
    <!-- 兼容pc动画再套一个盒子 -->
    <Transition name="fixed">
      <div v-show="modelValue" class="popup-overlay-pc-wrapper" v-bind="$attrs">
        <div class="popup-overlay">
          <Transition :name="position">
            <div v-show="modelValue" class="w-full h-full flex justify-center items-center" :style="{ alignItems: `flex-${position}` }" @click.self="close">
              <slot name="dialog">
                <div class="dialog-wrapper">
                  <div v-if="showHeader" class="header">
                    <slot name="header">
                      <h2 class="flex items-center">
                        <slot name="icon">
                          <component
                            :is="icon" v-if="icon" class="mr-[8rem] flex-none"
                            :style="{ color: '--ss-base-dialog-icon-color', fontSize: '--ss-base-dialog-icon-size' }"
                          />
                        </slot>
                        <span>{{ title }}</span>
                      </h2>
                    </slot>
                    <div v-if="showClose" class="close" @click.stop="close">
                      <IconUniClose3 />
                    </div>
                  </div>
                  <div class="scroll-contain scroll-y max-h-[500rem]">
                    <div class="modal-content">
                      <Suspense timeout="0">
                        <slot />
                        <template #fallback>
                          <div v-if="showLoad" class="flex items-center justify-center min-h-[200rem]">
                            <SSBaseLoading />
                          </div>
                        </template>
                      </Suspense>
                    </div>
                  </div>
                </div>
              </slot>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
:root {
  --ss-base-dialog-max-height: calc(100% - 4em);
  --ss-base-dialog-background-color: #fff;
  --ss-base-dialog-border-color: transparent;
  --ss-base-dialog-content-text-color: #0d2245;
  --ss-base-dialog-header-background-color: transparent;
  --ss-base-dialog-header-height: auto;
  --ss-base-dialog-header-padding-top: 16rem;
  --ss-base-dialog-close-top: 20.5rem;
  --ss-base-dialog-icon-color: var(--ss-base-icon-color);
  --ss-base-dialog-icon-size: 16rem;
  --ss-base-dialog-width: 345rem;
  --ss-base-dialog-position: fixed;
  --ss-base-dialog-border-top-radius: 4rem;
  --ss-base-dialog-border-bottom-radius: 4rem;
  --ss-base-dialog-header-text-color: #0d2245;
}
</style>

<style lang='scss' scoped>
.dialog-wrapper {
  width: var(--ss-base-dialog-width);
  height: auto;
  max-height: var(--ss-base-dialog-max-height);
  border: 1px solid var(--ss-base-dialog-border-color);
  border-radius: var(--ss-base-dialog-border-top-radius) var(--ss-base-dialog-border-top-radius)
    var(--ss-base-dialog-border-bottom-radius) var(--ss-base-dialog-border-bottom-radius);
  overflow: hidden;
  background-color: var(--ss-base-dialog-background-color);
}
.header {
  background-color: var(--ss-base-dialog-header-background-color);
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 16rem;
  color: var(--ss-base-dialog-header-text-color);
  font-size: 18rem;
  font-weight: 600;
  line-height: 25rem;
  padding-top: var(--ss-base-dialog-header-padding-top);
  height: var(--ss-base-dialog-header-height);
  .close {
    position: absolute;
    right: 16rem;
    top: var(--ss-base-dialog-close-top);
    display: flex;
    align-items: center;
    z-index: 10;
  }
}
.modal-content {
  display: flex;
  flex-direction: column;
  position: relative;
  color: var(--ss-base-dialog-content-text-color);
}
.scroll-contain {
  overscroll-behavior: contain;
}
.popup-overlay-pc-wrapper {
  position: var(--ss-base-dialog-position);
  inset: 0;
  max-width: var(--pc-max-width);
  width: 100%;
  left: 50%;
  transform: translate(-50%, 0);
  overflow: hidden;
  z-index: 999;
}

.popup-overlay {
  position: var(--ss-base-dialog-position);
  inset: 0;
  touch-action: pan-x;
  background-color: #0009;
  visibility: visible;
  max-width: var(--pc-max-width);
  width: 100%;
  left: 50%;
  transform: translate(-50%, 0);
}

.fixed-enter-active,
.fixed-leave-active {
  transition: all 100ms;
}

.center-enter-active,
.center-leave-active {
  transition: transform 100ms linear;
}

.center-enter-from,
.center-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

.start-enter-active,
.start-leave-active {
  transition:
    opacity 100ms ease,
    transform 100ms ease;
}

.start-enter-from,
.start-leave-to {
  opacity: 0;
  transform: translateY(-10px); /* 初始位置略高 */
}

.start-enter-to,
.start-leave-from {
  opacity: 1;
  transform: translateY(0); /* 回到正常位置 */
}
</style>
