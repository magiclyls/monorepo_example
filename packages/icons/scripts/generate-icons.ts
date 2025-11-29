import fs from 'node:fs'
import path from 'node:path'
import { compileTemplate } from '@vue/compiler-sfc'
import fg from 'fast-glob'
import prettier from 'prettier'

async function generateIcons() {
  // 路径定义
  const SVG_DIR = path.resolve(__dirname, '../svg')
  const COMPONENTS_DIR = path.resolve(__dirname, '../components')
  const INDEX_FILE = path.resolve(__dirname, '../index.ts')

  // 清空 components 目录
  fs.rmSync(COMPONENTS_DIR, { recursive: true, force: true })
  fs.mkdirSync(COMPONENTS_DIR, { recursive: true })

  // 获取所有 svg 文件
  const files = fg.sync('*.svg', { cwd: SVG_DIR })

  const exportList: string[] = []

  for (const file of files) {
    const svgPath = path.join(SVG_DIR, file)
    const svgContent = fs.readFileSync(svgPath, 'utf-8')

    // 生成组件名，如 IconHome
    const baseName = path.basename(file, '.svg')
    const componentName = `Icon${capitalize(camelCase(baseName))}`
    const vueFile = path.join(COMPONENTS_DIR, `${componentName}.vue`)

    // 插入 fill="currentColor" 到 <svg>
    let optimizedSvg = svgContent
      .replace(/<\?xml[^>]*\?>/gi, '')
      .replace(/[\uFEFF\u200B-\u200D\u202A-\u202E]/g, '')
      .replace(/\s+id="[^"]*"/g, '')
      .replace(
        /<svg\b([^>]*)>/,
        (match, attrs) => {
          if (/fill=/.test(attrs))
            return `<svg ${attrs}>`
          return `<svg ${attrs} fill="currentColor">`
        },
      )

    // 移除内部标签上的 fill 属性
    optimizedSvg = optimizedSvg.replace(/fill="(?!none")[^"]*"/gi, '')

    // 包装为 Vue 组件
    const vueCode = `
        <script lang="ts" setup>
          defineOptions({
            name: '${componentName}'
          })
        </script>

        <template>
          <i class="tg-icon-container">
            ${optimizedSvg}
          </i>
        </template>

        <style scoped>
          .tg-icon-container {
            height: 1em;
            width: 1em;
            line-height: 1em;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            position: relative;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
          }

          .tg-icon-container svg {
            width: 1em;
            height: 1em;
            fill: currentColor;
          }
        </style>
        `

    // 编译验证合法性
    compileTemplate({
      id: componentName,
      source: `<template>${optimizedSvg}</template>`,
      filename: file,
    })

    const formattedVueCode = await prettier.format(vueCode, {
      parser: 'vue',
      singleQuote: true,
      semi: false,
    })

    // 写入组件文件
    fs.writeFileSync(vueFile, formattedVueCode, 'utf-8')

    // 添加到 index.ts 导出
    exportList.push(`export { default as ${componentName} } from './components/${componentName}.vue'`)
  }

  // 生成 index.ts 文件
  fs.writeFileSync(INDEX_FILE, `${exportList.join('\n')}\n`)
}

generateIcons()

// 工具函数
function camelCase(str: string): string {
  return str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
}
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
