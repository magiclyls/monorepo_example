const fs = require('fs-extra')
const path = require('path')
const imgService = require('../services/img.service')
const pLimit = require('p-limit').default

const limit = pLimit(5)

const limit2 = pLimit(6)

async function readFoldersOnlyToAntd(dirPath, baseKey = '') {
  const stats = await fs.stat(dirPath)
  const name = path.basename(dirPath)
  const key = baseKey ? `${baseKey}/${name}` : name

  if (!stats.isDirectory()) {
    // 跳过文件
    return null
  }

  const names = await fs.readdir(dirPath)
  const children = []

  for (const childName of names) {
    const childPath = path.join(dirPath, childName)
    const childNode = await readFoldersOnlyToAntd(childPath, key)
    if (childNode) {
      children.push(childNode)
    }
  }

  return {
    title: name,
    key,
    children,
  }
}

async function readFoldersOnlyToAntdFile(dirPath) {
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true })

  const tree = await Promise.all(
    entries
      .filter((entry) => entry.name !== '.DS_Store') // 排除 .DS_Store
      .map(limit(async (entry) => {
        const fullPath = path.join(dirPath, entry.name)
        const isDirectory = entry.isDirectory()

        const node = {
          title: entry.name,
          key: fullPath,
          isLeaf: !isDirectory,
        }

        if (isDirectory) {
          node.children = await readFoldersOnlyToAntdFile(fullPath)
        }

        return node
      })),
  )

  return tree
}

async function imageList(req, res) {
  // 获取query参数
  const { file } = req.query
  try {
    const publicDir = __dirname.split('packages')[0] + 'public'
    const treeData = await (file ? readFoldersOnlyToAntdFile(publicDir) : readFoldersOnlyToAntd(publicDir))
    res.success(treeData)
  } catch (err) {
    res.fail(err.message)
  }
}

async function imageConvert(req, res) {
  try {
    const proDir = __dirname.split('packages')[0]
    const reqDir = req.body?.dir

    if (!reqDir) {
      res.fail('请传入 dir')
      return
    }

    if (!reqDir.endsWith('png')) {
      res.fail('选择 png 目录')
      return
    }

    const inputDir = proDir + reqDir
    const outputWebpDir = proDir + reqDir.replace('png', 'webp')
    const outputAvifDir = proDir + reqDir.replace('png', 'avif')
    await imgService.start(inputDir, outputWebpDir, outputAvifDir)
    res.success("转换成功")
  } catch (err) {
    console.error('imgError', err.message)
    res.fail(err.message)
  }
}

async function imageDelete(req, res) {
  const { file, dirName } = req.body

  if (!dirName) return res.fail('请传入 dirName')
  if (!file) return res.fail('请传入 file 名称')

  const publicDir = path.resolve(__dirname, `../../../../public/${dirName}`)

  if (!fs.pathExistsSync(publicDir)) {
    return res.fail(`${dirName} 不存在`)
  }

  const tasks = []

  // 递归遍历目录，找到所有匹配文件并加入任务队列
  async function traverseDir(dir) {
    const items = await fs.readdir(dir)
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = await fs.stat(fullPath)
      if (stat.isFile()) {
        if (path.parse(item).name.toLowerCase() === file.toLowerCase()) {
          // 用 limit 包裹删除任务，控制并发
          tasks.push(limit2(() => fs.remove(fullPath).then(() => {
            console.log(`✅ 删除成功: ${fullPath}`)
          }).catch(err => {
            console.error(`❌ 删除失败: ${fullPath}`, err.message)
          })))
        }
      } else if (stat.isDirectory()) {
        await traverseDir(fullPath) // 递归子目录
      }
    }
  }

  try {
    await traverseDir(publicDir)

    if (tasks.length === 0) {
      return res.fail(`未找到文件: ${file}`)
    }

    // 执行所有删除任务
    await Promise.all(tasks)

    return res.success("删除成功")
  } catch (err) {
    console.error('❗ imageDelete 全局错误', err.message)
    return res.fail(err.message)
  }
}

module.exports = {
  imageList,
  imageConvert,
  imageDelete
}
