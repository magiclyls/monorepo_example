# PhBaseVerticalSwiper 组件

## 示例

<PhBaseVerticalSwiper :items="messages">
  <template #default="{ item }">
    <div class="flex items-center gap-2 text-[12rem] justify-between w-full">
      <div>
        <span class="mr-[2rem]">{{ item.icon }}</span>
        <span class="text-primary">{{ item.text }}</span>
      </div>
      <span class="text-[var(--text-brand)]">{{ item.value }}</span>
    </div>
  </template>
</PhBaseVerticalSwiper>

## Props

| 名称  | 类型 | 默认值 | 说明   |
| ----- | ---- | ------ | ------ |
| items | list | []     | `必填` |

## Slot

默认 内容

## Event

无
