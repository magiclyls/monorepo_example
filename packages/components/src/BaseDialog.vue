<script setup lang="ts">
import { useDialogStore } from '@tg/stores'
import { computed, onUnmounted, watch } from 'vue'
import BaseIcon from './BaseIcon.vue'

interface Props {
  modelValue: boolean
  title?: string
  appendToBody?: boolean
  closeOnClickModal?: boolean
  showClose?: boolean
  showBack?: boolean
  loading?: boolean
  loadingSize?: number
  showHeader?: boolean
  dialogStyle?: object
  // name用于自动查找store里面的set方法
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  appendToBody: true,
  closeOnClickModal: true,
  showClose: true,
  showBack: false,
  loading: false,
  loadingSize: 30,
  showHeader: true,
  dialogStyle: () => ({
    width: '30rem',
    top: '15vh',
  }),
})
const emit = defineEmits(['update:modelValue', 'close', 'back'])
const dialogStore = useDialogStore()
/** 获取对应弹窗变量的set函数 */
const setterName = `set${props.name?.charAt(0).toUpperCase()}${props.name?.slice(1)}`

// 添加 watch 来监听 modelValue 的变化
watch(() => props.modelValue, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  }
  else {
    document.body.style.overflow = ''
  }
})

// 组件卸载时确保恢复滚动
onUnmounted(() => {
  document.body.style.overflow = ''
})

const computedDialogStyle = computed(() => ({
  width: '30rem',
  top: '15vh',
  ...props.dialogStyle,
}))

const loadingStyle = computed(() => ({
  width: `${props.loadingSize}px`,
  height: `${props.loadingSize}px`,
  borderWidth: `${Math.max(3, props.loadingSize / 5)}px`,
}))

function handleClose() {
  if (props.name) {
    (dialogStore as any)[setterName](false)
  }
  else {
    emit('update:modelValue', false)
    emit('close')
  }
}

function handleWrapperClick() {
  if (props.closeOnClickModal) {
    handleClose()
  }
}

function handleBack() {
  emit('back')
}
</script>

<template>
  <teleport to="body" :disabled="!appendToBody">
    <transition name="dialog-wrapper-fade">
      <div v-show="modelValue" class="yl-dialog__wrapper" @click="handleWrapperClick">
        <transition name="dialog-fade">
          <div v-show="modelValue" class="yl-dialog" :style="computedDialogStyle" @click.stop>
            <div v-if="showHeader" class="yl-dialog__header">
              <template v-if="showBack">
                <button class="yl-dialog__headerbtn yl-dialog__backbtn" @click="handleBack">
                  <BaseIcon name="left" style="font-size: 0.6rem" />
                </button>
              </template>
              <div class="yl-dialog__header-left" :class="{ 'no-back': !showBack }">
                <slot name="header-left" />
              </div>
              <slot name="header">
                <span class="yl-dialog__title">{{ title }}</span>
              </slot>
              <div class="yl-dialog__header-right" :class="{ 'no-close': !showClose }">
                <slot name="header-right" />
              </div>
              <template v-if="showClose">
                <button class="yl-dialog__headerbtn" @click="handleClose">
                  <BaseIcon name="x" style="font-size: 0.5rem;" />
                </button>
              </template>
            </div>

            <div class="yl-dialog__body">
              <div v-if="loading" class="yl-dialog__loading">
                <div class="yl-dialog__loading-spinner" :style="loadingStyle" />
              </div>
              <slot />
            </div>

            <div v-if="$slots.footer" class="yl-dialog__footer">
              <slot name="footer" />
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<style>
:root {
  --dialog-header-bg: #232626;
  --dialog-body-bg: #232626;
  --dialog-body-padding: 1rem;
  --dialog-body-min-height: auto;
}
</style>

<style scoped>
.yl-dialog__wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  z-index: 2000;
  background-color: rgba(0, 0, 0, 0.5);
}
.yl-dialog {
  position: relative;
  margin: 0 auto 3.125rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
}

.yl-dialog__header {
  height: 3.5rem;
  padding: 0 0.75rem;
  border-radius: 0.5rem 0.5rem 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--dialog-header-bg);
}

.yl-dialog__title {
  line-height: 1.5rem;
  font-size: 1rem;
  color: #fff;
  font-weight: 700;
}

.yl-dialog__headerbtn {
  position: absolute;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  background: #464f50;
  border: none;
  border-radius: 0.5rem;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.yl-dialog__backbtn {
  left: 0.75rem;
}

.yl-dialog__headerbtn:last-child {
  right: 0.75rem;
}

.yl-dialog__close,
.yl-dialog__back {
  font-size: 0.875rem;
  color: #909399;
}

.yl-dialog__close {
  display: inline-block;
}

.yl-dialog__back {
  display: inline-block;
}

.yl-dialog__headerbtn:hover {
  background: #363b3d;
}

.yl-dialog__headerbtn:hover .yl-dialog__close,
.yl-dialog__headerbtn:hover .yl-dialog__back {
  color: #ffffff;
}

.yl-dialog__body {
  padding: var(--dialog-body-padding);
  color: #606266;
  font-size: 0.875rem;
  word-break: break-all;
  position: relative;
  background-color: var(--dialog-body-bg);
  border-radius: 0 0 0.5rem 0.5rem;
  min-height: var(--dialog-body-min-height);
}

.yl-dialog__loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.yl-dialog__loading-spinner {
  border-style: solid;
  border-color: #27563e;
  border-radius: 50%;
  border-bottom-color: #24ee89;
  animation: dialog-spin 1s linear infinite;
}

@keyframes dialog-spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.yl-dialog__footer {
  padding: 0.625rem 1.25rem 1.25rem;
  text-align: right;
  box-sizing: border-box;
}

/* 外层包装动画 */
.dialog-wrapper-fade-enter-active {
  transition: opacity 0.2s ease;
}
.dialog-wrapper-fade-leave-active {
  transition: opacity 0.2s ease;
}
.dialog-wrapper-fade-enter-from,
.dialog-wrapper-fade-leave-to {
  opacity: 0;
}

/* 对话框本身动画 */
.dialog-fade-enter-active {
  transition: all 0.2s ease;
}
.dialog-fade-leave-active {
  transition: all 0.2s ease;
}
.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.yl-dialog__header-left {
  position: absolute;
  left: 3rem;
}

.yl-dialog__header-left.no-back {
  left: 0.75rem;
}

.yl-dialog__header-right {
  position: absolute;
  right: 3rem;
}

.yl-dialog__header-right.no-close {
  right: 0.75rem;
}
</style>
