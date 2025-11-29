# PhBaseProgress 组件

## 示例

<PhBaseProgress
  width="100%" :value="Number('50.2')" :show-info="false" :stroke-width="8"
  stroke-color="var(--bg-layer-3)"
/>

## Props

| 名称            | 类型    | 默认值 | 说明   |
| --------------- | ------- | ------ | ------ |
| value           | number  | 0      | `必填` |
| max             | number  | 0      | `可选` |
| min             | number  | 0      | `可选` |
| barColor        | string  | ''     | `可选` |
| backgroundColor | string  | ''     | `可选` |
| height          | string  | ''     | `可选` |
| showPercentage  | boolean | true   | `可选` |

## Slot

默认 内容

## Event

无
