// convert-yml-to-json.js
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'

const localesDir = path.resolve('../locales')

// 读取 locales 文件夹
fs.readdirSync(localesDir).forEach((file) => {
  if (file.endsWith('.yml') || file.endsWith('.yaml')) {
    const filePath = path.join(localesDir, file)
    const content = fs.readFileSync(filePath, 'utf8')

    try {
      // 解析 YML
      const data = yaml.load(content)

      // 生成 JSON 文件名
      const jsonFile = file.replace(/\.ya?ml$/, '.json')
      const jsonPath = path.join(localesDir, jsonFile)

      // 写入 JSON 文件（缩进 2 格）
      fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8')

      console.log(`✅ Converted: ${file} -> ${jsonFile}`)
    }
    catch (e) {
      console.error(`❌ Failed to convert ${file}:`, e)
    }
  }
})
