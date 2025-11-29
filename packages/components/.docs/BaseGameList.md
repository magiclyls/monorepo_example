# BaseGameList Component

`BaseGameList` 组件需配合BaseGameItem业务组件，游戏列表组件

## Props

| 参数   | 说明       | 类型     | 必填 | 默认值 |
| ------ | ---------- | -------- | ---- | ------ |
| `row`  | `行数`     | `number` | `否` | `1`    |
| `xGap` | `横向间距` | `number` | `否` | `8`    |
| `yGap` | `纵向间距` | `number` | `否` | `0`    |

## 示例

<script setup>
import BaseGameList from '../src/BaseGameList.vue';
import BaseGameItem from '../src/BaseGameItem.vue'
</script>
<BaseGameList :row="1" :cardHeight="200" :xGap="8">
    <BaseGameItem bgImage="/game.png" v-for="item in 3">
    <template #bottom-right>
        <div class="price">￥99</div>
    </template>
    <template #hover-content>
        <div class="flex-center">自定义内容</div>
    </template>
  </BaseGameItem>
</BaseGameList>
