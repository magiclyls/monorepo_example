<script setup lang="ts">
import { BaseIcon } from '@tg/bccomponents'
import { useLocalRouter } from '@tg/shared-router'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface Props {
  icon: string
  path?: string
  title: string
  subMenu?: boolean
  subMenuIsOpen?: boolean
  exact?: boolean
}

defineOptions({
  name: 'LayoutMenuItem',
})
const props = withDefaults(defineProps<Props>(), {
  subMenu: false,
  exact: false,
})

const emit = defineEmits(['update:subMenuIsOpen', 'onClick'])

const Route = useRoute()
const router = useLocalRouter()

const active = computed(() => {
  if (!props.path)
    return false
  if (props.exact) {
    return `/${Route.fullPath.split('/')[2]}` === props.path
  }
  else {
    return Route.fullPath.includes(props.path)
  }
})

function onClickItem() {
  if (props.path) {
    router.push(props.path)
  }
  if (props.subMenuIsOpen === false) {
    emit('update:subMenuIsOpen', !props.subMenuIsOpen)
  }
  emit('onClick')
}

function onClickRrrow() {
  emit('update:subMenuIsOpen', !props.subMenuIsOpen)
  emit('onClick')
}
</script>

<template>
  <div class="menu-item overflow-hidden relative flex w-full cursor-pointer items-center overflow-hidden rounded-lg px-3 h-11 sm:mt-1 sm:h-10 sm:p-0 select-none" :class="{ 'active': active, 'sub-menu': subMenu, 'sub-menu-open': subMenuIsOpen }">
    <div class="flex-1 flex items-center" @click="onClickItem">
      <div class="flex-none center sm:size-10">
        <BaseIcon :name="icon" class="text-[1.5rem]" />
      </div>
      <span class="font-semibold text-nowrap">{{ title }}</span>
    </div>
    <div v-if="subMenu" class="ml-auto flex items-center justify-center rounded-lg size-6 p-0 sm:mr-1.5 -rotate-90 transition ease-out bg-[#464f50]" :class="{ 'rotate-90': subMenuIsOpen }" @click.self="onClickRrrow">
      <BaseIcon name="arrow" class="text-[1.5rem]" />
    </div>
  </div>
</template>

<style lang="scss">
.menu-item {
  background-color: #323738;
  &:hover {
    background: linear-gradient(90deg, #23ee8833, #23ee8800), rgba(255, 255, 255, 0.05);
    --tg-base-icon-color: #fff;
  }
  &.active {
    background: linear-gradient(90deg, #23ee8833, #23ee8800), rgba(255, 255, 255, 0.05);
    --tg-base-icon-color: var(--color-brand);
    span {
      color: var(--color-brand);
    }
  }
  &.sub-menu {
    background-color: #323738;
    &.sub-menu-open {
      background-color: #3d4142;
    }
  }
}
</style>
