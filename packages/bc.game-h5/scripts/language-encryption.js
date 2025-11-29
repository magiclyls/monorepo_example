import fs from 'node:fs'
import path from 'node:path'
import { Buffer } from 'node:buffer'
import yaml from 'js-yaml'

// Base64 编码和解码函数
const base64Encode = value => Buffer.from(value, 'utf8').toString('base64')
const base64Decode = value => Buffer.from(value, 'base64').toString('utf8')

function OPstring(str, processFunc) {
  const text = str.replace(/({[^}]+})|([^{}]+)/g, (match, p1, p2) => {
    if (p1) {
      // 如果匹配到的是 {xxx}，则保持不变
      return p1
    }
    else if (p2) {
      // 如果匹配到的是普通文本，则进行加密
      return processFunc(p2)
    }
    return match
  })

  // console.log(111, text)
  return text // 返回拼接后的字符串
}
// OPstring('您本周玩游戏将会获得最高{number}%返现', base64Encode)

// 加密数据
function encryptData(data) {
  // 遍历对象或数组的所有属性，并对值进行 Base64 加密
  for (const key in data) {
    if (typeof data[key] === 'object')
      encryptData(data[key])
    else if (typeof data[key] === 'string')
      data[key] = OPstring(data[key], base64Encode)
  }
}

// 解密数据
function decryptData(data) {
  // 遍历对象或数组的所有属性，并对值进行 Base64 解密
  for (const key in data) {
    if (typeof data[key] === 'object')
      decryptData(data[key])
    else if (typeof data[key] === 'string')
      data[key] = OPstring(data[key], base64Decode)
  }
}

// 遍历并处理 .yml 文件
async function processYamlFiles(dir, processFunc) {
  const files = await fs.promises.readdir(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = await fs.promises.stat(fullPath)
    if (stat.isDirectory()) {
      await processYamlFiles(fullPath, processFunc)
    }
    else if (path.extname(fullPath) === '.yml' || path.extname(fullPath) === '.yaml') {
      // 只处理中文文件
      if (fullPath.includes('zh-CN')) {
        let data = fs.readFileSync(fullPath, 'utf8')
        data = yaml.load(data)
        processFunc(data)
        await fs.promises.writeFile(fullPath, yaml.dump(data), 'utf8')
      }
    }
  }
}

// 导出加密
export async function encryptAllFiles(folderPath = './locales') {
  try {
    await processYamlFiles(folderPath, encryptData)
    console.log('加密完成')
    return true
  }
  catch (error) {
    console.error('加密出现错误', error)
    return false
  }
}
// 解密方法
export async function decryptAllFiles(folderPath = './locales') {
  try {
    await processYamlFiles(folderPath, decryptData)
    return true
  }
  catch (error) {
    console.error('解密出错:', error)
    return false
  }
}

// 如果直接运行脚本，则调用加密主函数
console.log(import.meta.url, `file://${process.argv[1]}`)
if (import.meta.url === `file://${process.argv[1]}`) {
  const targetDir = './locales' // 替换为你的目标文件夹路径或通过命令行参数传递
  encryptAllFiles(targetDir).then((result) => {
    // decryptAllFiles(targetDir).then(result => {
    console.log('进度完成:', result)
  })
}
