# 使用 `useDialog2` 进行弹框管理
当使用`useDialog2`时，有弹框开启时候，会自动禁用页面滚动，关闭弹框时候会自动恢复滚动。

## 导入组件

要开始使用弹框，需要先导入组件并使用 `useDialog2` 钩子：

```javascript
import TestAbc from '~/components/TestAbc.vue';

const { open, close } = useDialog2(TestAbc);

export default {
  setup() {
    return () => <div>
      <button onClick={open}>打开弹框</button>
      {/* open函数的参数是会传递给组件的props */}
      <button onClick={open({a: 1, b: 2})}>带参数打开弹框</button>
      <button onClick={close}>关闭弹框</button>
    </div>;
  },
};
```

## 组件要求
所有用于弹框的组件必须使用 `defineOptions` 配置 `name` 属性。此配置对于以下功能至关重要：

- 管理弹框的状态。
- 在需要时关闭弹框。    

`name` 属性是有效管理弹框实例所必需的。
```javascript
// TestAbc.vue
export default {
  setup() {
    defineOptions({
      name: 'TestAbc',
    });
  },
};
```


## 注入的方法
当你将组件传入 `useDialog2` 时，它会自动注入一个 `closeDialog` 方法。该方法允许组件内部关闭当前弹框，为组件提供了管理自身状态的简便方式。
``` javascript
// TestAbc.vue
export default {
  setup(props) {
    const { closeDialog } = props
  },
};
```

## 弹框 Store 全局管理
为了管理多个弹框，`useDialog2Store()` 提供了几个有用的方法：

`dialogNames`   
此方法用于获取所有当前打开的弹框名称列表，帮助跟踪当前活跃的弹框。

`removeDialog()`   
使用此方法可以通过传入名称来关闭特定的弹框。如果未提供名称，则默认关闭最后一个打开的弹框。

`removeAllDialog()`    
此方法设计用于一次性关闭所有打开的弹框，在需要重置状态或批量关闭弹框的情况下非常有用。

## 使用示例
以下是如何使用这些方法的示例：
```javascript
const {
  dialogNames,
  removeDialog,
  removeAllDialog,
} = useDialog2Store();

// 关闭特定弹框
removeDialog('TestAbc');

// 关闭最后一个打开的弹框
removeDialog();

// 关闭所有弹框
removeAllDialog();
```