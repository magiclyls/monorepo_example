<script setup lang="ts">
import * as Icons from '@tg/icons'
import { computed, ref } from 'vue'

const copiedName = ref<string | null>(null)
const keyword = ref('')
const iconColor = ref('#000000') // 默认图标颜色

const iconEntries = Object.entries(Icons)

const filteredIcons = computed(() =>
  iconEntries.filter(([name]) =>
    name.toLowerCase().includes(keyword.value.toLowerCase()),
  ),
)

const gridStyle = computed(() => ({
  color: iconColor.value,
}))

function copy(name: string) {
  navigator.clipboard.writeText(name)
  copiedName.value = name
  setTimeout(() => (copiedName.value = null), 1000)
}
</script>

<template>
  <div class="p-6 bg-white min-h-screen">
    <h1 class="text-3xl font-bold text-[#555555]">
      图标预览
    </h1>

    <div class="sticky top-0 z-10 bg-white pt-4 pb-1">
      <div class="flex flex-wrap gap-4 items-center mb-2">
        <input
          v-model="keyword"
          placeholder="搜索图标名（支持模糊匹配）"
          class="px-4 py-2 w-full max-w-md border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#555555]"
        >
      </div>
      <!-- 图标颜色选择器 -->
      <div class="flex items-center gap-2 mb-4">
        <label for="color-picker" class="text-sm text-gray-600">图标颜色:</label>
        <input
          id="color-picker"
          v-model="iconColor"
          type="color"
          class="w-8 h-8 p-0 border-none cursor-pointer"
        >
      </div>
    </div>

    <!-- 图标网格 -->
    <div class="grid grid-cols-6 gap-4" :style="gridStyle">
      <div
        v-for="[name, Comp] in filteredIcons"
        :key="name"
        class="group flex flex-col text-[26px] items-center justify-center p-4 bg-white border border-gray-200 rounded cursor-pointer transition duration-200 hover:bg-blue-600 hover:text-white"
        @click="copy(name)"
      >
        <component
          :is="Comp"
          class="text-[32px] mb-2 transition-all group-hover:text-white"
        />
        <div
          class="text-sm truncate max-w-[80%] text-gray-700 group-hover:text-white"
        >
          {{ copiedName === name ? '已复制' : name }}
        </div>
      </div>
    </div>
  </div>
</template>
