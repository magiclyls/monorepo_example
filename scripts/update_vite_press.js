import { readFileSync, writeFileSync } from 'node:fs'
import { webConfig } from './config.js'

function update() {
  if (process.argv[2] === '3') {
    // 当前目录 + /packages/components/.docs/.vitepress/config.ts
    const currenPath = `${process.cwd()}/packages/components/.docs/.vitepress/config.ts`
    // 读取文件内容
    const code = readFileSync(currenPath, 'utf-8')

    const newCode = code.replace(
      /iconDirs:\s*\[.*?\],/,
      `iconDirs: ['${webConfig[process.argv[2]].iconsDir}'],`,
    )

    // 写回
    writeFileSync(currenPath, newCode)
  }
}

update()
