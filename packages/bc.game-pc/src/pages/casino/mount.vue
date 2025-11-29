<script lang="ts" setup>
import { BaseTabs } from '@tg/bccomponents'
import { ref } from 'vue'

const list = ref([
  { title: '全部', value: '1' },
  { title: 'BC原创', value: '2' },
  { title: '老虎机', value: '3' },
  { title: '真人娱乐城', value: '3' },
])

const list2 = ref([
  { title: '全部', value: '1' },
  { title: 'BC原创', value: '2' },
  { title: '老虎机', value: '3' },
  { title: '真人娱乐城', value: '3' },
  { title: '全部', value: '1' },
  { title: 'BC原创', value: '2' },
  { title: '老虎机', value: '3' },
  { title: '真人娱乐城', value: '3' },
  { title: '全部', value: '1' },
  { title: 'BC原创', value: '2' },
  { title: '老虎机', value: '3' },
  { title: '真人娱乐城', value: '3' },
  { title: '全部', value: '1' },
  { title: 'BC原创', value: '2' },
  { title: '老虎机', value: '3' },
  { title: '真人娱乐城', value: '3' },
  { title: '全部', value: '1' },
  { title: 'BC原创', value: '2' },
  { title: '老虎机', value: '3' },
  { title: '真人娱乐城', value: '3' },
])

const tabactive = ref(0)
</script>

<template>
  <div class="mine">
    <div>tabactive{{ tabactive }}</div>
    <h1>:type="9"</h1>
    <div class="ml-8 w-[220px]">
      <BaseTabs v-model:active="tabactive" :type="9" :list="list" />
    </div>
    <h1>:type="1"</h1>
    <div class="ml-8 max-w-100">
      <BaseTabs v-model:active="tabactive" :type="1" :list="list" />
    </div>
    <h1>:type="2"</h1>
    <div class="ml-8 max-w-100">
      <BaseTabs
        v-model:active="tabactive" :type="2" :list="list"
        :style="{ '--tabs-width': '100px', '--tabs-indicator-position': `${tabactive * 100}%` }"
      />
    </div>
    <h1>:type="3"</h1>
    <div class="ml-8">
      <BaseTabs v-model:active="tabactive" :type="3" :list="list2" style="scroll-padding-inline: 1rem;" />
    </div>
    <br>
    <br>
    <h2>----------------测试</h2>
  </div>
</template>

<style>
body {
  font-size: 0.875rem;
  line-height: 1.5;
  color: #171a1a;
}
.mine {
  width: 100%;
  height: 2000px;
  background-color: #f1f2f3;
}

/* 之前要加到配置  */
.hide-scroll {
  scrollbar-width: none;
}
</style>
