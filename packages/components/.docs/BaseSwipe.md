# BaseMenu 组件

<script setup>
import BaseSwipe from '../src/BaseSwipe.vue'

</script>

## BaseMenu

<BaseSwipe
      :images="[
        'https://d2utx4nptvgikt.cloudfront.net/banner/zh-CN/1728130906658.webp',
        'https://d2utx4nptvgikt.cloudfront.net/banner/zh-CN/1728130868750.webp',
      ]"
      height="400px"
      :autoplay="true"
      :delay="5000"
      :loop="true"
      :navigation="true"
      :pagination="true"
    />

## 组件属性（Props）

```vue
interface Props {
  items?: []// 图片数组数据
  images?: string[] // 图片数组
  autoplay?: boolean // 是否自动播放
  delay?: number // 自动播放间隔
  loop?: boolean // 是否循环播放
  navigation?: boolean // 是否显示左右箭头
  pagination?: boolean // 是否显示分页指示器
}
```

## 示例

```vue
    <BaseSwipe
      :images="[
        'https://d2utx4nptvgikt.cloudfront.net/webp/banner/bg/bg_1.webp',
        'https://d2utx4nptvgikt.cloudfront.net/banner/zh-CN/1728130868750.webp',
      ]"
      height="400px"
      :autoplay="true"
      :delay="5000"
      :loop="true"
      :navigation="true"
      :pagination="true"
    />
```

## Slot

无

## Event

无
