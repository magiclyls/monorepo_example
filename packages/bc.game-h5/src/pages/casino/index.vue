<script setup lang="ts">
import { BaseGameItem, BaseGameList, BaseTabs } from '@tg/bccomponents'
import { ref } from 'vue'

const list = ref([
  { title: '全部', value: '1' },
  { title: 'BC原创', value: '2' },
  { title: '老虎机', value: '3' },
  { title: '真人娱乐城', value: '3' },
])
const active = ref(0)
</script>

<template>
  <div class="d">
    appbanner
    AppGameSearch

    <BaseTabs v-model:active="active" :type="3" :list="list" />
    <BaseGameList>
      <BaseGameItem
        bg-image="https://bc.imgix.net/game/image/d927716dbf.png?_v=4&auto=format&dpr=1&w=200"
      />
      <BaseGameItem
        bg-image="https://bc.imgix.net/game/image/d927716dbf.png?_v=4&auto=format&dpr=1&w=200"
      />
      <BaseGameItem
        bg-image="https://bc.imgix.net/game/image/d927716dbf.png?_v=4&auto=format&dpr=1&w=200"
      />
      <BaseGameItem
        bg-image="https://bc.imgix.net/game/image/d927716dbf.png?_v=4&auto=format&dpr=1&w=200"
      />
    </BaseGameList>
  </div>
</template>

<style lang="scss" scoped>
</style>
