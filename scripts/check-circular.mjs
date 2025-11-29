import { glob } from 'glob'
// scripts/check-circular.mjs
import madge from 'madge'

const patterns = [
  'packages/*/src', // monorepo 所有子包的 src
]

const ignorePattern = /node_modules|dist|\.d\.ts$/ // 忽略 node_modules、dist、声明文件

// 找出所有源码路径
const srcPaths = await glob(patterns, { absolute: true })

let hasCircular = false

for (const path of srcPaths) {
  console.log(`\n📦 检查: ${path}`)

  const result = await madge(path, {
    fileExtensions: ['ts', 'vue', 'js'],
    excludeRegExp: [ignorePattern],
    tsConfig: './tsconfig.json', // 如果有 ts
  })

  const circular = result.circular()

  if (circular.length) {
    hasCircular = true
    console.log(`❌ 发现 ${circular.length} 个循环依赖:`)
    circular.forEach((chain, i) => {
      console.log(`  ${i + 1}) ${chain.join(' → ')}`)
    })
  }
  else {
    console.log('✅ 无循环依赖')
  }
}

if (hasCircular) {
  process.exit(1) // CI 中发现循环依赖就让构建失败
}
