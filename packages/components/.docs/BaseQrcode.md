# BaseQrcode 组件

<script setup>
import BaseQrcode from '../src/BaseQrcode.vue'

console.log(111,BaseQrcode)
</script>

## 示例

<BaseQrcode value="ABCD1234567890123456789012345678WXYZ" />

```vue
<BaseQrcode value="ABCD1234567890123456789012345678WXYZ" />
```

## 组件属性（Props）

| 属性      | 类型                       | 默认值    | 描述                                         |
| --------- | -------------------------- | --------- | -------------------------------------------- |
| `value`   | `string`                   | 必填      | 需要编码的文本或 URL。                       |
| `size`    | `number`                   | `128`     | 二维码的尺寸（单位：像素）。                 |
| `level`   | `'L' \| 'M' \| 'Q' \| 'H'` | `'M'`     | 误校正级别（更高的值允许更多的损坏容忍度）。 |
| `bgColor` | `string`                   | `#ffffff` | 二维码的背景颜色。                           |
| `fgColor` | `string`                   | `#000000` | 二维码的前景颜色。                           |

## Slot

无

## Event

无
