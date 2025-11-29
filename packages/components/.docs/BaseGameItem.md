# BaseGameItem 组件

<script setup>
import BaseGameItem from '../src/BaseGameItem.vue'
</script>

BaseGameItem 是一个基础的游戏卡片组件，支持自定义背景图片和尺寸，并提供右下角插槽和悬浮蒙层插槽。

## 基础属性

| 属性名          | 类型               | 默认值                    | 说明                    |
| --------------- | ------------------ | ------------------------- | ----------------------- |
| `bgImage`       | `string`           | `必填项`                  | `背景图片URL`           |
| `size`          | `[string, string]` | `[9.0625rem, 12.0625rem]` | `卡片尺寸 [宽度, 高度]` |
| `showHoverMask` | `boolean`          | `true`                    | `是否显示悬浮蒙层`      |

## 插槽

| 插槽名          | 说明                   |
| --------------- | ---------------------- |
| `bottom-right`  | `右下角内容插槽`       |
| `hover-content` | `悬浮时的蒙层内容插槽` |

## 示例

<BaseGameItem bgImage="/game.png" showHoverMask>
  <template #bottom-right>
    <div class="price">￥99</div>
  </template>
  <template #hover-content>
    <div style="height: 100%;display: flex; align-items: center; justify-content: center;">自定义内容</div>
  </template>
</BaseGameItem>

## 使用示例

```vue
<BaseGameItem bgImage="/path/to/image.jpg" :size="['200px', '300px']" showHoverMask>
    <template #bottom-right>
        <div class="price">￥99</div>
    </template>
    <template #hover-content>
        <div class="flex-center">自定义内容</div>
    </template>
</BaseGameItem>
```
