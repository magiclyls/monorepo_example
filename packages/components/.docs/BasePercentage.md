# BasePercentage 组件

<script setup>
import BasePercentage from '../src/BasePercentage.vue'
</script>

## Props

| 名称       | 类型     | 默认值 | 说明 |
| ---------- | -------- | ------ | ---- |
| total      | `number` | `0`    |
| percentage | `number` | `0`    |

## 示例

<BasePercentage :total="45" :percentage="39" />
<br>
<BasePercentage :total="80" :percentage="40" />
<br>
<BasePercentage :total="100" :percentage="25" />

```vue
<BasePercentage :total="45" :percentage="39" />
```

## Slot

无

## Event

无
