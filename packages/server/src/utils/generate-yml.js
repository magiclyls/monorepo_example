const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

/**
 * 读取 JSON 文件并生成对应的 YML 语言文件
 * @param {string} inputPath - 输入 JSON 路径
 * @param {string} outputDir - 输出目录
 */
function generateYmlFiles(inputPath, outputDir) {
  if (!fs.existsSync(inputPath)) {
    console.error(`找不到输入文件: ${inputPath}`)
    return
  }

  const rawData = fs.readFileSync(inputPath, 'utf-8')
  const jsonData = JSON.parse(rawData)

  // 按语言分类
  const languageMap = {}

  for (const key of Object.keys(jsonData)) {
    const translations = jsonData[key]
    for (const lang of Object.keys(translations)) {
      if (!languageMap[lang]) languageMap[lang] = {}
      languageMap[lang][key] = translations[lang]
    }
  }

  // 确保输出目录存在
  fs.mkdirSync(outputDir, { recursive: true })

  // 写入每个语言的 yml 文件
  for (const lang of Object.keys(languageMap)) {
    const filePath = path.join(outputDir, `${lang}.yml`)
    const ymlString = yaml.dump(languageMap[lang], {
      lineWidth: -1,
      noRefs: true,
    })
    fs.writeFileSync(filePath, ymlString, 'utf-8')
    console.log(`✔ 生成 ${filePath}`)
  }

  console.log(`✅ 所有语言文件已输出到: ${path.resolve(outputDir)}`)
}

/**
 * 将 JSON 对象转换为 YML 文件并保存
 * @param {string} outputDir - 输出目录路径
 * @param {string} fileName - 文件名（可带或不带 .yml 后缀）
 * @param {Object} json - 一层结构的 JSON 对象
 */
function generateYmlFileJson(outputDir, fileName, json) {
  // 确保文件名以 .yml 结尾
  if (!fileName.endsWith('.yml')) {
    fileName += '.yml'
  }

  // 创建输出目录（如果不存在）
  fs.mkdirSync(outputDir, { recursive: true })

  // 将 JSON 对象转换为 YAML 字符串
  const ymlContent = yaml.dump(json, {
    noRefs: true,
    indent: 2,
    lineWidth: -1, // 不换行
  })

  // 构建完整文件路径
  const filePath = path.join(outputDir, fileName)

  // 写入文件
  fs.writeFileSync(filePath, ymlContent, 'utf8')
}

module.exports = {
  generateYmlFiles,
  generateYmlFileJson
}
