<script setup lang="ts">
import { computed, ref } from 'vue'
import MenuItem from './menuItem.vue'

interface Props {
  list: Array<{
    icon: string
    path: string
    title: string
    exact?: boolean
  }>
}

defineOptions({
  name: 'LayoutSubMenu',
})

const props = withDefaults(defineProps<Props>(), {

})

const subMenuIsOpen = ref(false)

const styleComputed = computed(() => {
  const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)

  return {
    transition: 'height 0.25s ease-out',
    height: subMenuIsOpen.value ? `${(props.list.length - 1) * rootFontSize * 2.75}px` : '0',
  }
})
</script>

<template>
  <div class="bg-[#323738] rounded-lg">
    <MenuItem v-bind="list[0]" v-model:sub-menu-is-open="subMenuIsOpen" sub-menu />
    <div class="overflow-hidden bg-[#333738] rounded-lg" :class="{ open: list && subMenuIsOpen }" :style="styleComputed">
      <MenuItem v-for="item, index in list" v-show="index !== 0" v-bind="item" :key="item.path" />
    </div>
  </div>
</template>
