<script setup lang="ts">
import { useDialogStore } from '@tg/stores'
import { computed, h, onBeforeUnmount, useSlots, watch } from 'vue'
import BaseIcon from './BaseIcon.vue'
import BaseLoading from './BaseLoading.vue'

interface Props {
  // name用于传入关闭的set方法
  name?: string
  title?: string
  show?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  showClose?: boolean
  size?: Array<string | number>
  showLoad?: boolean
  showHeader?: boolean
  bgColor?: string
  noPadding?: boolean
  closeCb?: () => void
}
const props = withDefaults(defineProps<Props>(), {
  title: '标题',
  icon: '',
  iconPosition: 'left',
  show: true,
  showClose: false,
  showLoad: false,
  showHeader: true,
  noPadding: false,
  closeCb: () => {},
})
const emit = defineEmits(['update:show', 'beforeUnmount'])
const slots = useSlots()
const dialogStore = useDialogStore()

const dialogStyles = computed(() => {
  const _width = !props.size || !props.size[0]
    ? '21rem'
    : typeof props.size[0] === 'number'
      ? `${props.size[0]}rem`
      : String(props.size[0])

  const _height = !props.size || !props.size[1]
    ? '10rem'
    : typeof props.size[1] === 'number'
      ? `${props.size[1]}rem`
      : String(props.size[1])

  const _bgColor = props.bgColor || '#242626'

  return {
    '--bc-dialog-container-width': _width,
    '--bc-dialog-container-height': _height,
    '--bc-dialog-container-bg': _bgColor,
  }
})

function setClassName(name: string) {
  return `bc-dialog-${name}`
}

function renderHeader(params: { name: string }) {
  if (!props.showHeader) {
    return null
  }
  const titleVNode = slots.title?.() ?? props.title
  const iconVNode = props.icon ? h(BaseIcon, { name: params.name }) : null

  const headerTitle = props.iconPosition === 'left'
    ? [iconVNode, h('div', { class: [setClassName('header'), 'text-center text-base'] }, titleVNode)]
    : [h('div', { class: [setClassName('header'), 'text-base'] }, titleVNode), iconVNode]

  const headerVNode = props.showClose
    ? [h('div', { class: 'flex justify-between items-center' }, [headerTitle, h('div', { onClick: () => close(), class: 'cursor-pointer' }, [h(BaseIcon, { name: 'uni-close', class: 'text-xl ' })])])]
    : headerTitle

  return headerVNode
}
function renderContent() {
  const contentVNode = slots.default?.()
  return contentVNode
}

function close(cb?: () => void) {
  if (props.name) {
    (dialogStore as any)[props.name](false)
  }
  else {
    emit('update:show', false)
  }
  cb && cb()
}

onBeforeUnmount(() => {
  emit('beforeUnmount')
})
watch(
  () => props.show,
  (val) => {
    if (val) {
      document.body.style.overflow = 'hidden'
    }
    else {
      document.body.style.overflow = ''
      // document.querySelector('.app-global-dialog')?.classList.add('close')
    }
  },
)
// 需要改，需要加找jose。。。。。
</script>

<template>
  <div :class="[setClassName('wrapper')]">
    <div :class="[setClassName('container'), { noPadding }]" :style="dialogStyles">
      <renderHeader :name="props.icon" />
      <Suspense timeout="0">
        <renderContent />
        <template #fallback>
          <div v-if="showLoad" class="center dialog-loading-height">
            <BaseLoading />
          </div>
        </template>
      </Suspense>
    </div>
  </div>
</template>

<style>
:root {
  --bc-dialog-container-width: 21rem;
  --bc-dialog-container-height: 10rem;
  --bc-dialog-container-bg: #242626;
  --bc-dialog-container-radius: 0.25rem;
  --bc-dialog-container-padding: 1rem;
}
</style>

<style scoped lang="scss">
.bc-dialog-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 102;
  min-height: calc(100% + 1px);
}
.bc-dialog-container {
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  max-width: var(--bc-dialog-container-width);
  max-height: var(--bc-dialog-container-height);
  background-color: var(--bc-dialog-container-bg);
  border-radius: var(--bc-dialog-container-radius);
  padding: var(--bc-dialog-container-padding);
}
.noPadding {
  padding: 0;
}
</style>
