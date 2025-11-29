
# 禁用的  **⚠️** **⚠️** 

## CSS 属性
```css
display: flex;
/* 不能在flex布局中使用 gap。 grid布局可以使用 */
gap: 10px; 
```

## vueuse 函数
```js
// 禁止使用 vueuse 的 createGlobalState，如果需要全局状态，使用 pinia
```

## Pinia
`pinia` 用于管理全局状态。为了保持 store 之间的解耦性和简洁性，设定以下规则：
- `app.ts` 作为顶层 store，包含应用的全局状态。
- 其他 store（例如 `user.ts`, `casino.ts`, `sports.ts`）可以直接使用 `app.ts` 中的状态和方法。
- 各个 store 之间禁止相互引用，以保持模块独立性，避免依赖循环或复杂的耦合关系。


## 不要过度封装组件
### AppEmailVerify
这个组件将手机验证和邮箱验证都验证耦合在一起，里面通过各种v-if判断来显示各种状态，我想改手机号的bug很容易就把邮箱的内容给改了

### AppGameSearch
1，这个组件将首页搜索，厂商搜索，场馆搜索，类别搜索都耦合在一起，通过props和query来获取各种参数(cid,vid,ty)
2，通过各种if来修改接口参数，厂商页面的搜索修改好了，场馆搜索出问题了
3，这种UI一模一样，接口不一样的不应该封装成一个组件，应该封装一个UI搜索组件，然后提供事件给外面调用

### AppBetData
大家自己去看这个组件有什么问题，完全改不动


`不要过度封装组件，不要过度封装组件，不要过度封装组件   应该hook，还是组件，还是不封装，写之前多考虑一下，考虑人家维护是不是会很痛苦`


## 严禁通过key去刷新组件，除了for循环，不要用key
### category -> AppCasinoGameTypeGameList


## 表单相关
### 表单组件提供对应的事件（onInput, onChange等）
### 开发业务中，一些表单事件，点击事件，尤其是会触发请求的，不要通过监听v-model的值来进行事件处理，要通过回调事件来


## 关于业务接口数据处理
所有网络请求放在路由组件里面，比如 `/zh/casino` 这个页面的的数据请求都放在 `casino/index.vue`     
弹窗组件，看情况尽量放在最上面的组件里面
AppBetData,AppHeader,LeftSilderBar这类组件，业务相关的，放在自己独立业务组件的顶层
