# BaseAmount 组件

基础BaseAmount组件

<script setup>
import BaseAmount from "../src//BaseAmount.vue";

</script>

## 示例

 <div>
    <BaseAmount cur="USDT" amount="100" icon-position="back" color="var(--color-brand)" style="--tg-base-amount-width:2rem;--tg-base-amount-fontSize:2rem;--tg-base-amount-margin:2rem;" />
    <BaseAmount cur="USDT" :with-crypto-unit="false" amount="1000" icon-position="back" color="red"  />
    <BaseAmount cur="JPY" :with-crypto-unit="false" amount="10000" icon-position="front" />
  </div>

## 基础用法

```vue
    <BaseAmount cur="USDT" amount="100" icon-position="back" color="var(--color-brand)" style="--tg-base-amount-width:2rem;--tg-base-amount-fontSize:2rem;--tg-base-amount-margin:2rem;" />

    <BaseAmount cur="USDT" :with-crypto-unit="false" amount="1000" icon-position="back" color="red"  />

    <BaseAmount cur="JPY" :with-crypto-unit="false" amount="10000" icon-position="front"  />
```

## 属性

| 属性名           | 说明                 | 类型                 | 默认值    |
| ---------------- | -------------------- | -------------------- | --------- |
| `cur`            | `货币值`             | `EnumCurrencyKey`    | `-`       |
| `amount`         | `金额`               | `number 或者 string` | `-`       |
| `color`          | `颜色`               | `string`             | `inherit` |
| `withCryptoUnit` | `加密货币是否要单位` | `boolean`            | `true`    |
| `iconPosition`   | `图标位置`           | `front 或者 back`    | `back`    |
| `icon`           | `是否展示图标`       | `boolean`            | `true`    |

## 事件

无

## 插槽

无
