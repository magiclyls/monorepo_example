# PhBaseTabs 组件

基础的tabs组件

<script setup>
import BaseTabs from "../src/PhBaseTabs.vue";
import { ref } from 'vue'

const list = ref([
  { title: '全部', value: '1' },
  { title: 'BC原创', value: '2' },
  { title: '老虎机', value: '3' },
  { title: '真人娱乐城', value: '3' },
])

const list2 = ref(
 [{"ty":-1,"cid":"all","platform_id":"all","name":"大厅","icon":"/images/CATE/lobby.webp","background":"","useCloudImg":true,"label":"大厅","value":"-1&all"},{"ty":5,"cid":"2","platform_id":"2","name":"老虎机","icon":"/images/CATE/slot.webp","background":"/images/CATE/slot_background.webp","useCloudImg":true,"label":"老虎机","value":"5&2"},{"ty":5,"cid":"3","platform_id":"3","name":"娱乐场","icon":"/images/CATE/live.webp","background":"/images/CATE/live_background.webp","useCloudImg":true,"label":"娱乐场","value":"5&3"},{"ty":5,"cid":"4","platform_id":"4","name":"游戏节目","icon":"/images/CATE/game.webp","background":"/images/CATE/game_background.webp","useCloudImg":true,"label":"游戏节目","value":"5&4"},{"ty":5,"cid":"6","platform_id":"6","name":"小游戏","icon":"/images/CATE/original.webp","background":"/images/CATE/game_background.webp","useCloudImg":true,"label":"小游戏","value":"5&6"},{"ty":2,"cid":"110","platform_id":"110","name":"TP视讯","icon":"/platform/tp_nav.webp","background":"/platform/plat_background.png","useCloudImg":true,"label":"TP视讯","value":"2&110"},{"ty":2,"cid":"214","platform_id":"214","name":"TP捕鱼","icon":"/platform/tp_nav.webp","background":"/platform/plat_background.png","useCloudImg":true,"label":"TP捕鱼","value":"2&214"},{"ty":2,"cid":"303","platform_id":"303","name":"PP老虎机","icon":"/platform/pp_nav.webp","background":"/platform/plat_background.png","useCloudImg":true,"label":"PP老虎机","value":"2&303"},{"ty":2,"cid":"323","platform_id":"323","name":"TP老虎机","icon":"/platform/tp_nav.webp","background":"/platform/plat_background.png","useCloudImg":true,"label":"TP老虎机","value":"2&323"}]
)

const active = ref(0)
</script>

## 示例

 <div>
    <h1>basetab</h1>
    <div class="ml-8">
      <BaseTabs v-model:active="active"  :list="list2"  />
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

<BaseTabs v-model:active="active"  :list="list" />
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
