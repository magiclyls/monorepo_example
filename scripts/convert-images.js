import fs from 'node:fs'
import path from 'node:path'
import pLimit from 'p-limit'
import sharp from 'sharp'

// ----------------------
// 配置
// ----------------------
const limit = pLimit(5) // 最大并发数

// CLI 参数支持
const inputDir = process.argv[2] || './png'
const outputWebpDir = process.argv[3] || './webp'
const outputAvifDir = process.argv[4] || './avif'

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}
async function convertImage(inputPath, relativePath) {
  const webpOutput = path.join(outputWebpDir, relativePath).replace(/\.png$/i, '.webp')
  const avifOutput = path.join(outputAvifDir, relativePath).replace(/\.png$/i, '.avif')

  ensureDirSync(path.dirname(webpOutput))
  ensureDirSync(path.dirname(avifOutput))

  const tasks = []

  if (!fs.existsSync(webpOutput)) {
    tasks.push(limit(() =>
      sharp(inputPath)
        .webp({ quality: 90 })
        .toFile(webpOutput)
        .then(() => console.log('✅ WebP:', webpOutput))
        .catch(err => console.error('❌ WebP failed:', inputPath, err)),
    ))
  }
  else {
    console.log('⏩ 跳过 WebP:', webpOutput)
  }

  if (!fs.existsSync(avifOutput)) {
    tasks.push(limit(() =>
      sharp(inputPath)
        .avif({ quality: 50 })
        .toFile(avifOutput)
        .then(() => console.log('✅ AVIF:', avifOutput))
        .catch(err => console.error('❌ AVIF failed:', inputPath, err)),
    ))
  }
  else {
    console.log('⏩ 跳过 AVIF:', avifOutput)
  }

  return tasks
}

function walkAndConvert(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let tasks = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.join(base, entry.name)

    if (entry.isDirectory()) {
      tasks = tasks.concat(walkAndConvert(fullPath, relativePath))
    }
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
      tasks = tasks.concat(convertImage(fullPath, relativePath))
    }
  }

  return tasks
}

async function main() {
  console.log('📂 输入目录:', inputDir)
  console.log('📁 WebP输出目录:', outputWebpDir)
  console.log('📁 AVIF输出目录:', outputAvifDir)

  const tasks = walkAndConvert(inputDir)
  await Promise.all(tasks)

  console.log('🎉 所有图片转换完成')
}

main()
