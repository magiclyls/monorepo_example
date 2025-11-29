# BaseTabs 组件

基础的tabs组件

<script setup>
import BaseTabs from "../src//BaseTabs.vue";
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

const active = ref(0)
</script>

## 示例

 <div>
   <div>active{{ active }}</div>
    <h1>:type="9"</h1>
    <div class="ml-8 w-[220px]">
      <BaseTabs v-model:active="active" :type="9" :list="list" />
    </div>
    <h1>:type="1"</h1>
    <div class="ml-8 max-w-100">
      <BaseTabs v-model:active="active" :type="1" :list="list" />
    </div>
    <h1>:type="2"</h1>
    <div class="ml-8 max-w-100">
      <BaseTabs
        v-model:active="active" :type="2" :list="list"
        :style="{ '--tabs-width': '100px', '--tabs-indicator-position': `${active * 100}%` }"
      />
    </div>
    <h1>:type="3"</h1>
    <div class="ml-8">
      <BaseTabs v-model:active="active" :type="3" :list="list2" style="scroll-padding-inline: 1rem;" />
    </div>
    </div>

## 基础用法

```vue
const list = ref([
  { title: '全部', value: '1' },
  { title: 'BC原创', value: '2' },
  { title: '老虎机', value: '3' },
  { title: '真人娱乐城', value: '3' },
])
const active = ref(0)

<BaseTabs v-model:active="active" :type="1" :list="list" />
```

## 属性

| 属性名           | 说明              | 类型                                           | 默认值 |
| ---------------- | ----------------- | ---------------------------------------------- | ------ |
| `type`           | `类型`            | `number`                                       | `1`    |
| `v-model:active` | `当前激活的index` | `number`                                       | `-`    |
| `list`           | `tab数组`         | `Array<{ title: string, [key: string]: any }>` | `-`    |

## 事件

| 事件名          | 说明        | 回调参数          |
| --------------- | ----------- | ----------------- |
| `update:active` | `index改变` | `当前激活的index` |

## 插槽

无
