# BaseCollapseItem 基础折叠面板项

基础折叠面板的子项组件，用于展示可折叠/展开的内容区域。

## 属性

| 属性名     | 说明             | 类型                                              | 默认值     |
| ---------- | ---------------- | ------------------------------------------------- | ---------- |
| `title`    | `折叠面板的标题` | `string`                                          | -          |
| `position` | `位置`           | `'first'` \| `'middle'` \| `'last'` \| `'single'` | `'single'` |

## 插槽

| 插槽名    | 说明                 |
| --------- | -------------------- |
| `default` | `折叠面板的内容`     |
| `extra`   | `图标左侧的额外内容` |

## 事件

| 事件名   | 说明                      | 回调参数                |
| -------- | ------------------------- | ----------------------- |
| `change` | `展开/折叠状态改变时触发` | `(isExpanded: boolean)` |

## 示例

<script setup>
  import BaseCollapseItem from "../src/BaseCollapseItem.vue";
</script>

<!-- 单独使用的例子 -->
<BaseCollapseItem title="单独面板" position="single">
<template #extra>
    <span>额外信息</span>
</template>
<div>这是单独使用的折叠面板内容</div>
</BaseCollapseItem>

<!-- 留出一些间距 -->
<div style="height: 16px"></div>

<!-- 组合使用的例子 -->
<div class="collapse-group">
<BaseCollapseItem title="第一项" position="first">
    <template #extra>
    <span>附加信息1</span>
    </template>
    <div>第一个面板的内容</div>
</BaseCollapseItem>

<BaseCollapseItem title="第二项" position="middle">
    <template #extra>
    <span>附加信息2</span>
    </template>
    <div>第二个面板的内容</div>
</BaseCollapseItem>

<BaseCollapseItem title="第三项" position="last">
    <template #extra>
    <span>附加信息3</span>
    </template>
    <div>第三个面板的内容</div>
</BaseCollapseItem>
</div>

### 基础用法

```vue
<script setup>
import BaseCollapseItem from '../src/BaseCollapseItem.vue'
</script>

<template>
  <!-- 单独使用的例子 -->
  <BaseCollapseItem title="单独面板" position="single">
    <template #extra>
      <span>额外信息</span>
    </template>
    <div>这是单独使用的折叠面板内容</div>
  </BaseCollapseItem>

  <!-- 留出一些间距 -->
  <div style="height: 16px" />

  <!-- 组合使用的例子 -->
  <div class="collapse-group">
    <BaseCollapseItem title="第一项" position="first">
      <template #extra>
        <span>附加信息1</span>
      </template>
      <div>第一个面板的内容</div>
    </BaseCollapseItem>

    <BaseCollapseItem title="第二项" position="middle">
      <template #extra>
        <span>附加信息2</span>
      </template>
      <div>第二个面板的内容</div>
    </BaseCollapseItem>

    <BaseCollapseItem title="第三项" position="last">
      <template #extra>
        <span>附加信息3</span>
      </template>
      <div>第三个面板的内容</div>
    </BaseCollapseItem>
  </div>
</template>

<style>
.collapse-group {
  /* 可以自定义组内所有面板的圆角大小 */
  --collapse-radius: 8px;
}
</style>
```
