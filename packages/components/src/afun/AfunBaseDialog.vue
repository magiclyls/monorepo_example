<script setup lang="ts">
import type { Component, Ref } from 'vue'
import { IconUniClose3 } from '@tg/icons'
import { provide } from 'vue'
import AfunBaseLoading from './AfunBaseLoading.vue'

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

defineOptions({ name: 'AfunBaseDialog' })
const props = withDefaults(defineProps<Props>(), {
  showLoad: true,
  showClose: true,
  showHeader: true,
  teleport: 'body',
  position: 'center',
})
const emit = defineEmits(['update:modelValue', 'clickTitle'])

function close() {
  emit('update:modelValue', !props.modelValue)
}
function onTitleClick() {
  emit('clickTitle')
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
                    <div class="flex items-center" @click="onTitleClick">
                      <slot name="icon">
                        <component
                          :is="icon" v-if="icon" class="flex-none"
                          :style="{
                            color: 'var(--afun-base-dialog-icon-color)',
                            fontSize: 'var(--afun-base-dialog-icon-size)',
                            marginRight: 'var(--afun-base-dialog-header-icon-mr)',
                          }"
                        />
                      </slot>
                      <span>{{ title }}</span>
                    </div>
                  </slot>
                  <div v-if="showClose" class="close" @click.stop="close">
                    <IconUniClose3 style="color: var(--afun-base-dialog-close-color);" />
                  </div>
                </div>
                <div class="scroll-contain scroll-y max-h-[500px] hide-scroll-bar">
                  <div class="modal-content">
                    <Suspense timeout="0">
                      <slot />
                      <template #fallback>
                        <div v-if="showLoad" class="flex items-center justify-center min-h-[200px]">
                          <AfunBaseLoading />
                        </div>
                      </template>
                    </Suspense>
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
  --afun-base-dialog-max-height: calc(100% - 4em);
  --afun-base-dialog-background-color: #1a2c38;
  --afun-base-dialog-border-color: transparent;
  --afun-base-dialog-content-text-color: #fff;
  --afun-base-dialog-header-background-color: transparent;
  --afun-base-dialog-header-height: auto;
  --afun-base-dialog-header-padding-top: 16px;
  --afun-base-dialog-close-top: 20.5px;
  --afun-base-dialog-icon-color: #9dabc8;
  --afun-base-dialog-icon-size: 16px;
  --afun-base-dialog-width: 100%;
  --afun-base-dialog-position: fixed;
  --afun-base-dialog-border-top-radius: 4px;
  --afun-base-dialog-border-bottom-radius: 4px;
  --afun-base-dialog-header-font-weight: 600;
  --afun-base-dialog-header-font-size: 18px;
  --afun-base-dialog-header-icon-mr: 8px;
  --afun-base-dialog-close-color: #b1bad3;
  --afun-base-dialog-header-color: #fff;
  --afun-base-dialog-paddingx: 12px;
}
</style>

<style lang='scss' scoped>
.dialog-wrapper {
  width: var(--afun-base-dialog-width);
  height: auto;
  max-height: var(--afun-base-dialog-max-height);
  // border: 1px solid var(--afun-base-dialog-border-color);
  border-radius: var(--afun-base-dialog-border-top-radius) var(--afun-base-dialog-border-top-radius)
    var(--afun-base-dialog-border-bottom-radius) var(--afun-base-dialog-border-bottom-radius);
  overflow: hidden;
  background-color: var(--afun-base-dialog-background-color);
}
.header {
  background-color: var(--afun-base-dialog-header-background-color);
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 16px;
  color: var(--afun-base-dialog-header-color);
  font-size: var(--afun-base-dialog-header-font-size);
  font-weight: var(--afun-base-dialog-header-font-weight);
  line-height: 25px;
  padding-top: var(--afun-base-dialog-header-padding-top);
  height: var(--afun-base-dialog-header-height);
  .close {
    position: absolute;
    right: 16px;
    top: var(--afun-base-dialog-close-top);
    display: flex;
    align-items: center;
    z-index: 10;
    color: var(--afun-base-dialog-close-color);
  }
}
.modal-content {
  display: flex;
  flex-direction: column;
  position: relative;
  color: var(--afun-base-dialog-content-text-color);
}
.scroll-contain {
  overscroll-behavior: contain;
}
.popup-overlay-pc-wrapper {
  position: var(--afun-base-dialog-position);
  inset: 0;
  max-width: var(--pc-max-width);
  width: 100%;
  left: 50%;
  transform: translate(-50%, 0);
  overflow: hidden;
  z-index: 999;
}

.popup-overlay {
  padding: 0 var(--afun-base-dialog-paddingx);
  position: var(--afun-base-dialog-position);
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
