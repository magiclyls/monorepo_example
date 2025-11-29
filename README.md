

## 📦 项目基础

- **Node版本：**
  ```
  v20.19.2
  ```

- **终端执行脚本：**
  ```bash
  chmod +x scripts/*.sh
  ```
- **禁止私自安装三方 npm 包和本地包**

  > 需要安装请联系 **Tim**

- **项目使用 pnpm 作为包管理工具**
  ```bash
  pnpm install       # 安装依赖
  pnpm dev           # 启动项目（根据提示访问）
  pnpm vitepress     # 访问组件库
  ```

---

## 🧱 公共组件规范

- **组件统一放在** `components` **项目下**
- 非本人维护组件 **禁止随意修改**，如有需求请联系 **组件开发人员**，如果组件开发人员已经离职，就联系 **Tim**
- 目录结构
  ```
  tg-Frontend/packages/components/
  ├── ph-h5   # 菲律宾H5
  │   ├── PhBaseXxx.vue
  ├── lottery  # 彩票项目公共组件
  |   ├── LotteryBaseXxx.vue
  ├── bc-game  # bc项目（暂停）
  |   ├── BaseXxx.vue
  ```
---

<details>
<summary>🖼 图片生成规范（generateImg 脚本使用说明）</summary>

### 📁 目录结构
将原始图片放在对应项目的png目录。在跟目录执行`generateImg`命令，根据命令选择

```
tg-Frontend/public/独立的项目名称(ph-h5)/
├── png/   # 所有原始 PNG 图像
│   ├── icon-home.png
│   ├── btn-start.png
│   └── flag/
│       ├── cn.png
│       └── us.png
├── webp/  # 自动生成的 webp 图片（结构保持一致）
├── avif/  # 自动生成的 avif 图片（结构保持一致）
```

### 🧾 命名规范

- 文件名使用中横线（**kebab-case**）
- 禁止使用 驼峰、下划线、大写

✅ 正确示例：

- `icon-user.png`
- `btn-start.png`

❌ 错误示例：

- `iconUser.png`
- `btn_start.PNG`
- `BgHeader.png`

### 🗂 分类建议

- **不要创建子文件夹**，统一放在 `png/`
- 可使用前缀进行逻辑分类：
  - `home-tab-1.png`
  - `home-tab-2.png`

📌 例外：如国旗等大量图片，允许放入独立目录（如 `flag/`）

</details>

---

<details>
<summary>🧩 全局代码管理</summary>

- 公共模块如 `stores/`、`http/`、`utils/`、`vite.config.js`、`.eslintrc` 等 **全部由 Tim 维护**
- 需要修改请联系 Tim 或提供修改代码

</details>

---

<details>
<summary>🧱 组件开发规范</summary>

### ✅ 命名约定

- 基础组件：以 `Base` 开头，如 `BaseButton`, `BaseInput`
- 业务组件：以 `App` 开头，如 `AppHeader`, `AppFooter`

### 📘 编写要求

- 写好组件后，必须：

  - 在 `/components/index.vue` 中写上 Demo
  - 实现复制功能
  - 撰写 `README.md` 方便后续使用

- 所有 Vue 文件需添加 `defineOptions` 并设定组件名：

  ```ts
  defineOptions({
    name: '组件文件名',
  })
  ```

</details>

---

<details>
<summary>🗂 Pages 文件命名规范</summary>

- 所有文件和文件夹使用中横线（`kebab-case`）
- 示例：`home-page`、`login-page`

- Pages里面的路由如果要封装自己页面的组件，使用`_components`作为文件名称

</details>

---

<details>
<summary>🎨 CSS 与 Class 命名</summary>

- 所有 `class` 使用中横线命名，如 `app-header`
- 禁止使用下划线 `_` 或驼峰命名法
- 所有 CSS 变量已写入 `config.css`，编写组件时请使用变量

### `:root` 中命名规范：

```css
--tg-组件名称-style-属性名
```

✅ 示例：

```css
--tg-button-style-radius
--tg-card-style-padding
```

</details>

---

<details>
<summary>🧠 组件内代码书写顺序</summary>

```ts
// 类型定义 (interface, type)

// 内部 hooks（可以就地写 useXXX 函数）
function useTest() {
  const a = ref(1)
  const changeA = () => (a.value = 2)
  return { a, changeA }
}

// props

// 外部 hooks
const router = useRouter()
const test = useTest()

// data

// computed

// methods

// watch / watchEffect

// mounted / 其他生命周期

// 初始化函数（如 init() 网络请求）
```

</details>

---

<details>
<summary>🧷 KeepAlive 命名规范</summary>

所有使用 KeepAlive 缓存的页面组件，命名必须为：

```ts
defineOptions({
  name: 'KeepAlive+组件名' // 示例：KeepAliveCasino
})
```

</details>

---

<details>
<summary>⛔️ TypeScript 类型规范</summary>

- 严禁使用 `any` 类型
- 请定义具体类型或使用 `unknown` + 类型收缩

</details>

---

<details>
<summary>⛔️ Git 管理</summary>

- 使用 `createBranch` 创建分支
- 不要动 `锁定文件`

</details>
