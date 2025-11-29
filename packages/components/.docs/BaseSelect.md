# BaseSelect 组件

<script setup>
    import {ref} from 'vue'
import { BaseButton, BaseImage, BaseSelect,BaseIcon,BaseSwitch } from '../index.ts'
const options = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '1', value: 4 },
  { label: '2', value: 5 },
  { label: '3', value: 6 },
  { label: '1', value: 7 },
  { label: '2', value: 8 },
  { label: '3', value: 9 },
  { label: '1', value: 10 },
  { label: '2', value: 11 },
  { label: '3', value: 12 },
]
const v = ref(1)
const s = ref(true)
</script>

## Props

| 名称                    | 类型                                                  | 默认值       | 说明                     |
| ----------------------- | ----------------------------------------------------- | ------------ | ------------------------ |
| modelValue              | `any`                                                 | `undefined`  | 绑定的值                 |
| options                 | `{ label: string; value: any; disabled?: boolean }[]` | `[]`         | 选项列表                 |
| placement               | `'bottom' \| 'bottom-start'`                          | `'bottom'`   | 弹出层对齐方式           |
| popperStrategy          | `'fixed' \| 'absolute'`                               | `'absolute'` | 弹出层定位方式           |
| popperClass             | `string`                                              | `''`         | 自定义弹出层 class       |
| distance                | `number`                                              | `0`          | 弹出层与触发器之间的距离 |
| skidding                | `number`                                              | `0`          | 弹出层偏移量             |
| disabled                | `boolean`                                             | `false`      | 是否禁用                 |
| placeholder             | `string`                                              | `''`         | 选择框占位符             |
| popperSearch            | `boolean`                                             | `false`      | 是否开启搜索框           |
| popperSearchPlaceholder | `string`                                              | `''`         | 搜索框占位符             |
| emptyDescription        | `string`                                              | `''`         | 无选项时的描述           |
| popPrevent              | `boolean`                                             | `false`      | 是否阻止默认弹出行为     |
| popperMaxHeight         | `string`                                              | `'20rem'`    | 弹出层最大高度           |
| width                   | `string`                                              | `'25rem'`    | 选择框宽度               |

## Slot

| 名称           | 说明               |
| -------------- | ------------------ |
| `default`      | 触发器插槽         |
| `search-right` | 搜索框右侧额外按钮 |
| `select-item`  | 自定义选项 Item    |
| `footer`       | 底部信息           |

## Event

| 名称                | 说明                 |
| ------------------- | -------------------- |
| `update:modelValue` | 绑定值更新时触发     |
| `focus`             | 选择框获取焦点时触发 |
| `popperHide`        | 选择框关闭时触发     |
| `select`            | 选中某一项时触发     |

## 示例

#### 示例 1

```vue
 <BaseSelect v-model="v" :options="options" placement="bottom-start">
      <BaseButton>type1</BaseButton>
      <template #select-item="{ item, selectedOption }">
        <div
          :class="{
            'bg-layer4': item.value === selectedOption?.value,
          }" class="mb-1 flex cursor-pointer items-center rounded-lg px-2 py-3 !leading-5 fix-light-hover"
        >
          <BaseImage class="rounded-sm h-6 w-6" url="https://bcgame.im/coin/BCD.black.png" />
          <div class="ml-2">
            <div class="flex items-center text-base font-extrabold">
              {{ item.label }}
            </div>
          </div>
        </div>
      </template>
    </BaseSelect>
```

<BaseSelect v-model="v" :options="options" placement="bottom-start">
    <BaseButton>type1</BaseButton>
    <template #select-item="{ item, selectedOption }">
    <div
        :class="{
        'bg-layer4': item.value === selectedOption?.value,
        }" class="mb-1 flex cursor-pointer items-center rounded-lg px-2 py-3 !leading-5 fix-light-hover"
    >
        <BaseImage class="rounded-sm h-6 w-6" url="https://bcgame.im/coin/BCD.black.png" />
        <div class="ml-2">
        <div class="flex items-center text-base font-extrabold">
            {{ item.label }}
        </div>
        </div>
    </div>
    </template>
</BaseSelect>
#### 示例 2

```vue
   <BaseSelect v-model="v" :options="options" placement="bottom-start">
      <template #default="{ selectedOption }">
        <BaseButton>{{ selectedOption?.label }}</BaseButton>
      </template>
      <template #search-right>
        <BaseButton  style="margin-left: 16px;"><BaseIcon name="menu" /></BaseButton>
      </template>
      <template #select-item="{ item, selectedOption }">
        <div
          :class="{
            'bg-layer4': item.value === selectedOption?.value,
          }" class="mb-1 flex cursor-pointer items-center rounded-lg px-2 py-3 !leading-5 fix-light-hover"
        >
          <BaseImage class="rounded-sm h-6 w-6" url="https://bcgame.im/coin/BCD.black.png" />
          <div class="ml-2">
            <div class="flex items-center text-base font-extrabold">
              {{ item.label }}
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex  items-center justify-between border-safe-bottom p-4 sticky bottom-0 bg-layer3 ">
          <div class="flex cursor-pointer items-center text-secondary">
            <BaseIcon name="affiliate" /> 以貨幣顯示
          </div>
          <div class="flex items-center text-secondary">
            <BaseSwitch v-model="s"></BaseSwitch>
            <span class="ml-2">隱藏小尺寸</span>
          </div>
        </div>
      </template>
    </BaseSelect>
```

   <BaseSelect v-model="v" :options="options" placement="bottom-start">
      <template #default="{ selectedOption }">
        <BaseButton>{{ selectedOption?.label }}</BaseButton>
      </template>
      <template #search-right>
        <BaseButton  style="margin-left: 16px;"><BaseIcon name="menu" /></BaseButton>
      </template>
      <template #select-item="{ item, selectedOption }">
        <div
          :class="{
            'bg-layer4': item.value === selectedOption?.value,
          }" class="mb-1 flex cursor-pointer items-center rounded-lg px-2 py-3 !leading-5 fix-light-hover"
        >
          <BaseImage class="rounded-sm h-6 w-6" url="https://bcgame.im/coin/BCD.black.png" />
          <div class="ml-2">
            <div class="flex items-center text-base font-extrabold">
              {{ item.label }}
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex  items-center justify-between border-safe-bottom p-4 sticky bottom-0 bg-layer3 ">
          <div class="flex cursor-pointer items-center text-secondary">
            <BaseIcon name="affiliate" /> 以貨幣顯示
          </div>
          <div class="flex items-center text-secondary">
            <BaseSwitch v-model="s"></BaseSwitch>
            <span class="ml-2">隱藏小尺寸</span>
          </div>
        </div>
      </template>
    </BaseSelect>
