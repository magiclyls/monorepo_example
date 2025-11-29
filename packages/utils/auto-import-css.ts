import type { Plugin } from 'vite'
// plugins/vite-plugin-env-css.ts
import fs from 'node:fs'
import path, { dirname, resolve } from 'node:path'

interface AutoImportCssPluginOptions {
  projectName: string
}

export function VitePluginAutoCss(options: AutoImportCssPluginOptions): Plugin {
  const { projectName } = options

  return {
    name: 'vite-plugin-env-css',
    enforce: 'pre',

    transform(code: string, cleanId: string) {
      if (!cleanId.endsWith('.vue'))
        return null

      const filename = path.basename(cleanId, '.vue')
      const dir = path.dirname(cleanId)
      const cssFileName = `${filename}.${projectName}.css`
      const globalCssFileName = `${filename}.${projectName}.global.css`
      const cssFile = path.join(dir, cssFileName)
      const globalCssFile = path.join(dir, globalCssFileName)

      let result = code

      // scoped 样式
      if (fs.existsSync(cssFile) && !code.includes(`<style scoped src="./${cssFileName}`)) {
        // 使用当前文件目录和css文件名来拼接绝对路径
        const currentDir = dirname(cleanId)
        const _file = resolve(currentDir, cssFileName)
        this.addWatchFile(_file)
        result += `\n<style scoped src="./${cssFileName}"></style>\n`
      }

      // global 样式
      if (fs.existsSync(globalCssFile) && !code.includes(`<style src="./${globalCssFileName}`)) {
        // 使用当前文件目录和css文件名来拼接绝对路径
        const currentDir = dirname(cleanId)
        const _file = resolve(currentDir, globalCssFileName)
        this.addWatchFile(_file)
        result += `\n<style src="./${globalCssFileName}"></style>\n`
      }

      return result
    },
  }
}
