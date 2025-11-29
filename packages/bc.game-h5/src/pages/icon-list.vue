<script setup lang='ts'>
import { BaseIcon } from '@tg/bccomponents'
import { useClipboard } from '@vueuse/core'
import ids from 'virtual:svg-icons-names'

defineOptions({ name: 'AppIconList' })

const { copy } = useClipboard()

function copyIcon(id: string) {
  copy(`<BaseIcon name="${id}" />`)
  console.log('🚸🚸🚸 ~ copyIcon ~ 复制成功:', id)
}
</script>

<template>
  <ul class="flex flex-wrap m0 p0">
    <li v-for="id in ids" :key="id" class="text-[50px]">
      <div
        alt="复制组件" title="复制组件" class="flex items-center p-[5px] justify-center cursor-pointer"
        @click="() => copyIcon(id.slice(5))"
      >
        <BaseIcon :name="id.slice(5)" />
      </div>
    </li>
  </ul>
</template>

<style lang='scss' scoped>

</style>
