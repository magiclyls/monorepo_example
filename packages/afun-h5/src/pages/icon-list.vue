<script setup lang='ts'>
import { useClipboard } from '@vueuse/core'

defineOptions({ name: 'AppIconList' })

const { copy } = useClipboard()

function copyIcon(id: string) {
  copy(`<component :is="${id}" />`)
  console.log('🚸🚸🚸 ~ copyIcon ~ 复制成功:', id)
}
</script>

<template>
  <ul class="flex flex-wrap m0 p0">
    <!--    <li v-for="id in ids" :key="id" class="text-[50px]"> -->
    <!--      <div -->
    <!--        alt="复制组件" title="复制组件" class="flex items-center p-[5px] justify-center cursor-pointer" -->
    <!--        @click="() => copyIcon(id.slice(5))" -->
    <!--      > -->
    <!--        <component :is="id.slice(5)" /> -->
    <!--        <span>{{ id.slice(5) }}</span> -->
    <!--      </div> -->
    <!--    </li> -->
  </ul>
</template>

<style lang='scss' scoped>

</style>
