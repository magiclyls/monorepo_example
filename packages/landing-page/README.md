# Landing Page 项目

## 📋 项目简介

Landing Page 主要用于展示不同品牌的落地页面，包括新葡京（x02）和威尼斯人（v03）两个站点。

## 🚀 快速开始

### 环境要求

- Node.js >= 20.19.2
- pnpm >= 8.6.7

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

项目将在 `http://localhost:9583` 启动

## 🏢 站点配置

项目支持多站点配置，目前支持以下站点：

### x02 - 新葡京

- 站点名称: 新葡京
- 主域名: https://x78671.com:51886
- 客服链接: https://a18111.com#/?business_id=150&access_key=C8B3111B9F0467651D4EB62DA14D1439

### v03 - 威尼斯人

- 站点名称: 威尼斯人
- 主域名: https://v97719.com:14126
- 客服链接: https://a18111.com/#/?business_id=151&access_key=702B2981D231BD216A8A7E98C397285D

## 🔧 配置说明

### 打包说明

静态图片域名配置为：https://d1wt0fm02xbmbm.cloudfront.net

### 环境变量

项目使用环境变量进行配置，主要变量包括：

- `VITE_HTTP_BASEURL`: API 基础地址
- `VITE_SITE`: 站点类型 (x02/v03)
- `VITE_ENABLE_ANALYTICS`: 是否启用统计脚本,默认为false
- `VITE_DROP_CONSOLE`: 是否移除 console 日志

## 📦 依赖说明

### 其他依赖

- `@better-scroll/core`: 滚动组件
- `web-pingjs`: 网络延迟检测

## 🌍 国际化

项目支持多语言，使用 Vue I18n 进行国际化配置：

- 默认语言: 中文 (zh-CN)
- 语言文件位置: `locales/` 目录

## 📝 注意事项

- 禁止私自安装第三方 npm 包，需要安装请联系 Tim
- 所有组件必须添加 `defineOptions` 并设定组件名
- 使用 kebab-case 命名文件和文件夹
- 严禁使用 `any` 类型，请定义具体类型
- 遵循项目的 CSS 和 Class 命名规范
