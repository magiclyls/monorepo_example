# BaseCurrencyIcon 组件

基础BaseCurrencyIcon组件

<script setup>
import BaseCurrencyIcon from "../src//BaseCurrencyIcon.vue";
</script>

## 示例

 <div class="flex gap-4">
    <BaseCurrencyIcon cur="USDT" />
    <BaseCurrencyIcon cur="JPY" style="--tg-base-currency-icon-width: 2rem;" />
  </div>

## 基础用法

```vue
<BaseCurrencyIcon cur="USDT"  />

<BaseCurrencyIcon cur="JPY" style="--tg-base-currency-icon-width: 2rem;" />
```

## 属性

| 属性名 | 说明     | 类型              | 默认值 |
| ------ | -------- | ----------------- | ------ |
| `cur`  | `货币值` | `EnumCurrencyKey` | `-`    |

## 事件

无

## 插槽

无
