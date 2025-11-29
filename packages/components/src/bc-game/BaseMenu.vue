<script lang="ts" setup>
import { ref } from 'vue'

interface Item {
  title: string
  path: string
}

interface Props {
  items: Array<Item> // 指定数组元素的类型为 Item
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [{ title: '存款', path: '/components' }, { title: '提款', path: '/' }],
})

const activeIndex = ref<number | null>(0)

function setActive(index: number) {
  activeIndex.value = index
}
</script>

<template>
  <ul class="sublist">
    <li
      v-for="(item, index) in props.items" :key="index" :class="{ active: index === activeIndex }"
      @click="setActive(index)"
    >
      {{ item.title }}
    </li>
  </ul>
</template>

<style scoped>
  .sublist {
  list-style-type: none;
  padding: 0;
}

.sublist li {
  padding: 8px;
  cursor: pointer;
  border-left: 2px solid rgba(0, 0, 0, 0);
}

.sublist li.active {
  border-left: 2px solid var(--color-brand) !important;
}
</style>
