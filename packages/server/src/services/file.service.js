const fsExtra = require("fs-extra");

/**
 * 读取指定文件内容
 * @param {string} dirPath - 要读取的目录路径
 */
async function readFile(dirPath) {
  try {
    return await fsExtra.readFile(dirPath, 'utf-8')
  } catch (error) {
    throw new Error(error.message)
  }
}

/**
 * 写入内容到指定文件
 * @param {string} dirPath - 要写入的目录
 * @param {string} content - 写入的内容
 */
async function writeFile(dirPath, content) {
  try {
    await fsExtra.outputFile(dirPath, content)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = {
  readFile,
  writeFile,
}

