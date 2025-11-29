## 在终端执行 chmod +x scripts/\*.sh

## 不要自己安装任何 三方 npm 包和本地包，需要安装请通知 akun

## 路由跳转 （尽量使用 BaseRouterLink 来进行跳转）

```vue
import { useLocalRouter, BaseRouterLink } from '@tg/shared-router'
```

## components项目下面的组件，不是自己的不要去改，不满足需求联系akun

## 项目使用 pnpm 作为包管理工具

## 安装依赖 `pnpm install`

## 启动项目 `pnpm dev` 根据对应提示访问

## 访问组件库 `pnpm vitepress`

## 所有的css变量都已经写在config.css里面了，写组件的时候要注意使用变量

## 公共组件全部放在 `components` 项目下

### 路由

所有的路由配置都 mount 负责，要添加新路由就给 mount。路由页面必须有一个根组件用来继承类名
路由replace和push 要用这个方法 import { useLocalRouter } from '@tg/shared-router'

### 关于全局数据

为了避免产生太多重复的代码，
stores、
http
utils
vite.config.js
.eslintrc
文件和文件夹 代码全部由akun维护，如果需要添加或者修改，可以直接通知修改，或者直接提供代码给akun。

### 组件

基础组件都使用 `Base` 开头，如 `BaseButton、BaseInput` 等。
业务组件都使用 `App` 开头，如 `AppHeader、AppFooter` 等。
组件写好后全部在 `/components/index.vue` 下把demo写上，复制功能加上。
给组件把README.md写上，方便后续使用。

```js
// vue文件，必须添加名称（名称和文件名称一样）
defineOptions({
  name: '文件名称',
})
```

### Pages文件夹

pages 下面所有的文件夹和文件都使用中横线 `-` 连接，如 `home-page`。

### Class 命名

统一使用中横线 `-` 连接，如 `app-header`。 不要出现下划线 `_` 和驼峰命名法。

### 组件内部:root 命名规范

使用 --tg-组件名称-style-xxxx 这样命名

### 关于网络请求

```js
// 统一使用vue-request, 全局已经将manual设置成了true，所以需要手动调用，要使用runAsync，不能使用run
await application.allSettled([run1(), run2()])
```

### script setup 代码顺序，编写hooks的方法，每类之间空一行，保证代码优美

```js
// 类型定义(interface, type)

// 即使封装了很多hooks，也避免不了组件内代码乱
// 有很多组件内部的逻辑为了方便阅读，也需要封装成hooks，
// 如果不想将hooks放在composables文件夹中，可以在当前位置写hooks函数
function useTest() {
  const a = ref(1)

  const changeA = () => {
    a.value = 2
  }

  return {
    a,
    changeA,
  }
}

// props

// 外部hooks
const roter = useRouter()
const test = useTest()

// data

// computed

// methods

// watch, watchEffect

// mounted

// …生命周期

// 初始化需要执行的函数，比如网络请求 init()之类的
```

### 关于KeepAlive名称

```js
// 统一使用 KeepAlive开头+组件名称，如
defineOptions({
  name: 'KeepAliveCasino',
})
```

### 不要出现any类型

### 多语言

安装依赖 `pip3 install --user pyyaml pandas openpyxl`

#### 新增多语言

将多语言添加到根目录的 lang.yml 文件中，如：

```yml
test: 测试
```

然后终端执行 `pnpm add:lang` 会自动添加到 `src/locales` 下的所有语言文件中。

#### 翻译内容

由于新增的多语言全是中文。所以需要`翻译内容`，步骤如下

1. 跟目录新建 `locales_get_unconverted_fields` 文件夹
2. 项目目录执行 `sh ./scripts/runZhFieldsToExcel.sh` 会将除了中文的其他语言翻译内容导出到 `locales_get_unconverted_fields` 文件夹下成为`excel`文件
3. 然后将`excel`文件发给翻译人员翻译，翻译完成后，将翻译内容替换到`locales_get_unconverted_fields` 文件夹下的`excel`文件
4. 项目目录执行`sh ./scripts/runUpdateLang.sh` 会将翻译好的`excel`文件按照key更新到`src/locales` 下的所有语言文件中
5. 完成翻译
