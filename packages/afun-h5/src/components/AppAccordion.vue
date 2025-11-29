<script setup lang="ts">
import type { Menu, MenuItem } from '@tg/types'
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppMenuItem from './AppMenuItem.vue'

defineOptions({
  name: 'AppAccordion',
})
const props = defineProps<Props>()
const emit = defineEmits(['cb'])
const router = useRouter()
interface Props {
  list: Menu
  groupTitle?: string
  current?: string
}
const openIndex = ref<number | null>(null)
const openChildIndex = ref<number | null>(null)
const { currentPath } = storeToRefs(useAppStore())
function toggle(item: MenuItem, index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
function toggleChild(item: MenuItem, index: number) {
  openChildIndex.value = openChildIndex.value === index ? null : index
}
function pushMenu(item: any) {
  if (item.icon === 'menu-sign-out') {
    emit('cb')
    return
  }
  if (item.path) {
    router.push(`${item.path}`)
  }
}

watch(props, () => {
  props.list.forEach((item, index) => {
    if (item.expand) {
      openIndex.value = index
    }
  })
}, { immediate: true })
</script>

<template>
  <div>
    <template v-for="(menu, index) in list" :key="index">
      <AppMenuItem v-if="menu.children?.length" :menu-item="menu" :active="openIndex === index" first-level @click="toggle(menu, index)" />
      <AppMenuItem v-else :menu-item="menu" @click="pushMenu(menu)" />
      <transition v-if="menu.children?.length" name="accordion">
        <div v-show="openIndex === index || menu.hideArrow">
          <template v-for="(child, i) in menu.children" :key="i">
            <AppMenuItem v-if="child.children?.length" :menu-item="child" :active="openChildIndex === index || menu.expand" @click="toggleChild(child, index)" />
            <AppMenuItem v-else :menu-item="child" :is-current-path="currentPath === child.title" @click="pushMenu(child)" />
            <transition v-if="child.children?.length" name="accordion">
              <div v-show="openChildIndex === index || child.expand">
                <template v-for="(ch, j) in child.children" :key="j">
                  <AppMenuItem :menu-item="ch" :value="child.value" :is-odds="child.isOdds" :is-odds-selected="child.tailTitle === ch.title" @click="child.change ? child.change(ch.value) : pushMenu(ch)" />
                </template>
              </div>
            </transition>
          </template>
        </div>
      </transition>
    </template>
  </div>
</template>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
}
.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
.accordion-enter-to,
.accordion-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
