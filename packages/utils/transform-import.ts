import type { Plugin } from 'vite'
import { parse } from '@babel/parser'
import MagicString from 'magic-string'

export interface AutoImportsOptions {
  packages: string[] // 需要展开的包
}

export function VitePluginAutoImports(options: AutoImportsOptions): Plugin {
  const { packages } = options
  let isBuild = false

  return {
    name: 'vite-plugin-auto-imports',
    enforce: 'pre',

    configResolved(config) {
      isBuild = config.command === 'build'
    },

    transform(code: string, id: string) {
      if (isBuild)
        return null

      if (!/\.(vue|ts|tsx|js|jsx)$/.test(id))
        return null

      // Vue 文件
      if (id.endsWith('.vue')) {
        const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>/gi
        let changed = false

        const newCode = code.replace(scriptRegex, (full, attrs, content) => {
          const replaced = transformScriptContent(content, packages)
          if (replaced != null) {
            changed = true
            return `<script${attrs}>\n${replaced}\n</script>`
          }
          return full
        })

        if (changed) {
          return { code: newCode, map: null }
        }
        return null
      }

      // 普通 JS/TS
      if (/\.(ts|tsx|js|jsx)$/.test(id)) {
        const replaced = transformScriptContent(code, packages)
        if (replaced != null)
          return { code: replaced, map: null }
      }

      return null
    },
  }
}

function transformScriptContent(src: string, packages: string[]): string | null {
  const ast = parse(src, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  })

  const ms = new MagicString(src)
  let didReplace = false

  for (const node of (ast as any).program.body) {
    if (node.type === 'ImportDeclaration' && node.source) {
      const pkgName = node.source.value
      if (packages.includes(pkgName)) {
        const specifiers = node.specifiers || []
        const newImportLines: string[] = []

        for (const s of specifiers) {
          if (s.type === 'ImportSpecifier') {
            const importedName = s.imported?.name
            const localName = s.local?.name || importedName
            if (importedName) {
              let importValue = `import ${localName} from '${pkgName}/components/${importedName}.vue'`

              if (pkgName.includes('@tg/bccomponents')) {
                if ([
                  'BaseDatePicker',
                  'BaseIcon',
                  'BaseImage',
                  'BaseList',
                  'BaseScrollPicker',
                  'BaseDialog',
                  'BasePageDialog',
                ].includes(localName)) {
                  importValue = `import ${localName} from '${pkgName}/src/${importedName}.vue'`
                }
                else if ([
                  'BaseProxyClick',
                  'BasePullRefresh',
                  'BaseKeepAlive',
                  'BaseI18nT',
                ].includes(localName)) {
                  importValue = `import ${localName} from '${pkgName}/src/${importedName}'`
                }
                else if (localName.startsWith('Base')) {
                  importValue = `import ${localName} from '${pkgName}/src/bc-game/${importedName}.vue'`
                }
                else if (localName.startsWith('Ph')) {
                  importValue = `import ${localName} from '${pkgName}/src/ph/${importedName}.vue'`
                }
                else if (localName.startsWith('SS')) {
                  importValue = `import ${localName} from '${pkgName}/src/stake-sports/${importedName}.vue'`
                }
                else if (localName.startsWith('Lottery')) {
                  importValue = `import ${localName} from '${pkgName}/src/lottery/${importedName}.vue'`
                }
                else if (localName.startsWith('Chat')) {
                  importValue = `import ${localName} from '${pkgName}/src/chat/${importedName}.vue'`
                }
                else {
                  return null
                }
              }

              newImportLines.push(importValue)
            }
          }
        }

        if (newImportLines.length > 0) {
          ms.overwrite(node.start, node.end, newImportLines.join('\n'))
          didReplace = true
        }
      }
    }
  }

  return didReplace ? ms.toString() : null
}
