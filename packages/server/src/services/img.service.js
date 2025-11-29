// const fs = require('node:fs')
// const path = require('node:path')
// const pLimit = require('p-limit').default
// const sharp = require('sharp')
//
//
// // ----------------------
// // 配置
// // ----------------------
// const limit = pLimit(5) // 最大并发数
//
// function ensureDirSync(dirPath) {
//   if (!fs.existsSync(dirPath)) {
//     fs.mkdirSync(dirPath, { recursive: true })
//   }
// }
//
// async function convertImage(inputPath, relativePath, outputWebpDir, outputAvifDir) {
//   const webpOutput = path.join(outputWebpDir, relativePath).replace(/\.png$/i, '.webp')
//   const avifOutput = path.join(outputAvifDir, relativePath).replace(/\.png$/i, '.avif')
//
//   ensureDirSync(path.dirname(webpOutput))
//   ensureDirSync(path.dirname(avifOutput))
//
//   const tasks = []
//
//   if (!fs.existsSync(webpOutput)) {
//     tasks.push(limit(() =>
//       sharp(inputPath)
//         .webp({ quality: 90 })
//         .toFile(webpOutput)
//         .then(() => console.log('✅ WebP:', webpOutput))
//         .catch(err => console.error('❌ WebP failed:', inputPath, err))
//     ))
//   } else {
//     console.log('⏩ 跳过 WebP:', webpOutput)
//   }
//
//   if (!fs.existsSync(avifOutput)) {
//     tasks.push(limit(() =>
//       sharp(inputPath)
//         .avif({ quality: 50 })
//         .toFile(avifOutput)
//         .then(() => console.log('✅ AVIF:', avifOutput))
//         .catch(err => console.error('❌ AVIF failed:', inputPath, err))
//     ))
//   } else {
//     console.log('⏩ 跳过 AVIF:', avifOutput)
//   }
//
//   return tasks
// }
//
// function walkAndConvert(dir, base, outputWebpDir, outputAvifDir) {
//   const entries = fs.readdirSync(dir, { withFileTypes: true })
//   let tasks = []
//
//   for (const entry of entries) {
//     const fullPath = path.join(dir, entry.name)
//     const relativePath = path.join(base, entry.name)
//
//     if (entry.isDirectory()) {
//       tasks = tasks.concat(walkAndConvert(fullPath, relativePath, outputWebpDir, outputAvifDir))
//     } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
//       tasks = tasks.concat(convertImage(fullPath, relativePath, outputWebpDir, outputAvifDir))
//     }
//   }
//
//   return tasks.flat()
// }
//
// async function start(inputDir, outputWebpDir, outputAvifDir) {
//   console.log('📂 输入目录:', inputDir)
//   console.log('📁 WebP输出目录:', outputWebpDir)
//   console.log('📁 AVIF输出目录:', outputAvifDir)
//
//   if (!fs.existsSync(inputDir)) {
//     throw new Error(`inputDir 不存在: ${inputDir}`)
//   }
//
//   if (!outputWebpDir) {
//     throw new Error("请传入 Webp 输出目录")
//   }
//
//   if (!outputAvifDir) {
//     throw new Error("请传入 Avif 输出目录")
//   }
//
//   try {
//     const tasks = walkAndConvert(inputDir, '', outputWebpDir, outputAvifDir).flat()
//     console.log("🚀 ~ start ~ tasks: ", tasks);
//     await Promise.all(tasks)
//
//     console.log('🎉 所有图片转换完成')
//   } catch (e) {
//     console.log('eeee', e.message)
//     throw new Error(e.message)
//   }
// }
//
// module.exports = {
//   start
// }


const fs = require('node:fs')
const path = require('node:path')
const pLimit = require('p-limit').default
const sharp = require('sharp')

// ----------------------
// 配置
// ----------------------
const limit = pLimit(5) // 最大并发数

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

async function convertImage(inputPath, relativePath, outputWebpDir, outputAvifDir) {
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
        .catch(err => console.error('❌ WebP failed:', inputPath, err))
    ))
  } else {
    console.log('⏩ 跳过 WebP:', webpOutput)
  }

  if (!fs.existsSync(avifOutput)) {
    tasks.push(limit(() =>
      sharp(inputPath)
        .avif({ quality: 50 })
        .toFile(avifOutput)
        .then(() => console.log('✅ AVIF:', avifOutput))
        .catch(err => console.error('❌ AVIF failed:', inputPath, err))
    ))
  } else {
    console.log('⏩ 跳过 AVIF:', avifOutput)
  }

  return tasks
}

async function walkAndCollectTasks(dir, base, outputWebpDir, outputAvifDir, allTasks) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.join(base, entry.name)

    if (entry.isDirectory()) {
      await walkAndCollectTasks(fullPath, relativePath, outputWebpDir, outputAvifDir, allTasks)
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
      const tasks = await convertImage(fullPath, relativePath, outputWebpDir, outputAvifDir)
      allTasks.push(...tasks)
    }
  }
}


async function start(inputDir, outputWebpDir, outputAvifDir) {
  console.log('📂 输入目录:', inputDir)
  console.log('📁 WebP输出目录:', outputWebpDir)
  console.log('📁 AVIF输出目录:', outputAvifDir)

  if (!fs.existsSync(inputDir)) {
    throw new Error(`inputDir 不存在: ${inputDir}`)
  }

  if (!outputWebpDir) {
    throw new Error("请传入 Webp 输出目录")
  }

  if (!outputAvifDir) {
    throw new Error("请传入 Avif 输出目录")
  }

  try {
    const allTasks = []
    await walkAndCollectTasks(inputDir, '', outputWebpDir, outputAvifDir, allTasks)

    await Promise.all(allTasks)

    console.log('🎉 所有图片转换完成')
  } catch (e) {
    console.error('❌ 转换出错:', e)
    throw e
  }
}

module.exports = {
  start
}
