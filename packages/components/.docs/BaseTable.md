# BaseTable 组件

<script setup>
import BaseTable from '../src/BaseTable.vue'
import { useBoolean } from '@tg/hooks'
import { ref, onMounted } from 'vue'
const { bool: loading, setFalse } = useBoolean(true)
const columns = ref([
  {
    title: '赛事',
    width: 100,
    dataIndex: 'name',
    slot: 'name',
    align: 'left',
  },
  {
    title: '玩家',
    width: 100,
    dataIndex: 'age',
    align: 'center',
  },
  {
    title: '时间',
    width: 100,
    dataIndex: 'job',
    slot: 'job',
    align: 'center',
  },
  {
    title: '赔率',
    width: 100,
    dataIndex: 'sex',
    align: 'center',
  },
  {
    title: '地址',
    width: 100,
    dataIndex: 'address',
    align: 'right',
  },
])
const tableData = ref([])
onMounted(() => {
  setTimeout(() => {
    tableData.value = [
      {
        name: 'Stephen',
        age: 30,
        job: 'player',
        sex: '男',
        address: 'CaliforniaCaliforniaCaliforniaCaliforniaCaliforniaCalifornia',
      },
      {
        name: 'Leo',
        age: 36,
        job: 'actor',
        sex: '男',
        address: 'LA',
      },
      {
        name: 'Mr.Dear',
        age: 23,
        job: 'boy',
        sex: '男',
        address: 'Beijing',
      },
      {
        name: 'superman',
        age: 32,
        job: 'boy',
        sex: '男',
        address: 'US',
      },
    ]
    setFalse()
  }, 0)
})
</script>

## Props

| 名称             | 类型      | 默认值  | 说明                                                                                            |
| ---------------- | --------- | ------- | ----------------------------------------------------------------------------------------------- |
| columns          | `columns` | `[]`    | `columns类型：title: 'string',width: number,dataIndex: 'string',slot: 'string',align: 'string'` |
| tableData        | `Array`   | `[]`    | `表格数据 //可选项`                                                                             |
| loading          | `boolean` | `true`  | `加载 //可选项`                                                                                 |
| showEmpty        | `boolean` | `true`  | `数据为空是否显示空状态 //可选项`                                                               |
| skeletonRow      | `number`  | `10`    | `骨架屏行数 //可选项`                                                                           |
| skeletonWidth    | `number`  | `30`    | `骨架屏随机宽度最小值 //可选项`                                                                 |
| skeletonMinWidth | `number`  | `50`    | `加载 //可选项`                                                                                 |
| showOutLoad      | `boolean` | `false` | `显示整个loading //可选项`                                                                      |

## 示例

<BaseTable
      :columns="columns"
      :data-source="tableData"
      :loading="loading"
    >
<template #name="record">
hello {{ record.name }}
</template>
<template #job="{ job }">
hi {{ job }}
</template>
</BaseTable>

```vue
<BaseTable
      :columns="columns"
      :data-source="tableData"
      :loading="loading"
    >
    <template #name="record">
        hello {{ record.name }}
    </template>
    <template #job="{ job }">
        hi {{ job }}
    </template>
</BaseTable>
```

## Slot

无

## Event

无
