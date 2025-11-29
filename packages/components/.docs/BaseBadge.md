# BaseBadge 组件

##

<script setup>
import BaseBadge from '../src/BaseBadge.vue'
</script>

  <BaseBadge :value="5">
    <button>消息</button>
  </BaseBadge>
<br/>
<br/>
<br/>
  <BaseBadge :value="200" :max="99" >
    <button>通知</button>
  </BaseBadge>
<br/>
<br/>
<br/>

  <BaseBadge dot >
    <button>好友请求</button>
  </BaseBadge>

## 示例

```vue
// value：要显示的数字或文本内容。
// max：可选，显示数字的最大值，超过该值时显示为 ${max}+。
// dot：可选，布尔值，是否以小红点的形式显示，无需具体数字。
// type：可选，徽标的类型，用于设置不同的样式。

  <BaseBadge :value="5">
    <button>消息</button>
  </BaseBadge>

  <BaseBadge :value="200" :max="99">
    <button>通知</button>
  </BaseBadge>

  <BaseBadge dot>
    <button>好友请求</button>
  </BaseBadge>
```

## Slot

无

## Event

无
