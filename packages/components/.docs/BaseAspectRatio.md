# BaseAspectRatio 组件

# 宽高比 优先使用aspect-ratio，不支持则使用padding-top

<script setup>
import BaseAspectRatio from '../src/BaseAspectRatio.vue'
import BaseButton from '../src/BaseButton.vue'
</script>

## Props

| 名称  | 类型     | 默认值 | 说明 |
| ----- | -------- | ------ | ---- |
| ratio | `string` | `1:1`  |
| width | `string` | `100%` |

## 示例

<BaseAspectRatio ratio="1/2" width="20%" style="background-color: #4391e7;">
    <BaseButton>
        1/2
    </BaseButton>
</BaseAspectRatio>

```vue
<BaseAspectRatio ratio="1/2" width="20%" />
```

## Slot

默认 内容

## Event

无
