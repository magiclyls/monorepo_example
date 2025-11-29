<script setup lang="ts">
import type { Component, Ref } from 'vue'
import { IconUniClose3 } from '@tg/icons'
import { provide } from 'vue'

interface Props {
  modelValue: boolean
  icon?: Component
  title?: string
  showLoad?: boolean
  showClose?: boolean
  showHeader?: boolean
  position?: 'center' | 'start' | 'end'
  teleport?: string | Ref
}

defineOptions({ name: 'BaseDialog' })
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
              <div class="dialog-wrapper">
                <div v-if="showHeader" class="header">
                  <slot name="header">
                    <div class="flex items-center">
                      <slot name="icon">
                        <component
                          :is="icon" v-if="icon" class="flex-none"
                          :style="{
                            color: 'var(--ph-base-dialog-icon-color)',
                            fontSize: 'var(--ph-base-dialog-icon-size)',
                            marginRight: 'var(--ph-base-dialog-header-icon-mr)',
                          }"
                        />
                      </slot>
                      <span>{{ title }}</span>
                    </div>
                  </slot>
                  <div v-if="showClose" class="close" @click.stop="close">
                    <IconUniClose3 style="color: var(--ph-base-dialog-close-color);" />
                  </div>
                </div>
                <div class="scroll-contain scroll-y max-h-[500rem] hide-scroll-bar">
                  <div class="modal-content">
                    <slot />
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
:root {
  --ph-base-dialog-max-height: calc(100% - 4em);
  --ph-base-dialog-background-color: #fff;
  --ph-base-dialog-border-color: transparent;
  --ph-base-dialog-content-text-color: #0d2245;
  --ph-base-dialog-header-background-color: transparent;
  --ph-base-dialog-header-height: auto;
  --ph-base-dialog-header-padding-top: 16rem;
  --ph-base-dialog-close-top: 20.5rem;
  --ph-base-dialog-icon-color: #9dabc8;
  --ph-base-dialog-icon-size: 16rem;
  --ph-base-dialog-width: 345rem;
  --ph-base-dialog-position: fixed;
  --ph-base-dialog-border-top-radius: 4rem;
  --ph-base-dialog-border-bottom-radius: 4rem;
  --ph-base-dialog-header-font-weight: 500;
  --ph-base-dialog-header-font-size: 18rem;
  --ph-base-dialog-header-icon-mr: 8rem;
  --ph-base-dialog-close-color: #0d2245;
  --ph-base-dialog-header-color: #0d2245;
}
</style>

<style lang='scss' scoped>
.dialog-wrapper {
  width: var(--ph-base-dialog-width);
  height: auto;
  max-height: var(--ph-base-dialog-max-height);
  border: 1px solid var(--ph-base-dialog-border-color);
  border-radius: var(--ph-base-dialog-border-top-radius) var(--ph-base-dialog-border-top-radius)
    var(--ph-base-dialog-border-bottom-radius) var(--ph-base-dialog-border-bottom-radius);
  overflow: hidden;
  background-color: var(--ph-base-dialog-background-color);
}
.header {
  background-color: var(--ph-base-dialog-header-background-color);
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 16rem;
  color: var(--ph-base-dialog-header-color);
  font-size: var(--ph-base-dialog-header-font-size);
  font-weight: var(--ph-base-dialog-header-font-weight);
  line-height: 25rem;
  padding-top: var(--ph-base-dialog-header-padding-top);
  height: var(--ph-base-dialog-header-height);
  .close {
    position: absolute;
    right: 16rem;
    top: var(--ph-base-dialog-close-top);
    display: flex;
    align-items: center;
    z-index: 10;
    color: var(--ph-base-dialog-close-color);
  }
}
.modal-content {
  display: flex;
  flex-direction: column;
  position: relative;
  color: var(--ph-base-dialog-content-text-color);
}
.scroll-contain {
  overscroll-behavior: contain;
}
.popup-overlay-pc-wrapper {
  position: var(--ph-base-dialog-position);
  inset: 0;
  max-width: var(--pc-max-width);
  width: 100%;
  left: 50%;
  transform: translate(-50%, 0);
  overflow: hidden;
  z-index: 999;
}

.popup-overlay {
  position: var(--ph-base-dialog-position);
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
