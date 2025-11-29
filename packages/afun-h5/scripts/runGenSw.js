import fs from 'node:fs'
import path from 'node:path'
import chalk from 'chalk'

let code = fs.readFileSync(path.resolve(process.cwd(), './public/sw.js'), 'utf-8')
// const sep = path.sep // 适配不同系统的分隔符

const cssFiles = fs.readdirSync(path.resolve(process.cwd(), './dist/css'))
const newCssFiles = cssFiles.map(item => `/css/${item}`)
const jsFiles = fs.readdirSync(path.resolve(process.cwd(), './dist/js'))
const newJsFiles = jsFiles.map(item => `/js/${item}`)

const urlsToCache = [...newCssFiles, ...newJsFiles].map(item => `'${item}'`)

const now = new Date()
const year = now.getFullYear()
const month = now.getMonth() + 1
const day = now.getDate()
const hours = now.getHours()
const minutes = now.getMinutes()
const seconds = now.getSeconds()
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

code = code.replace('时间占位符不能删除和移动', `${year}-${month}-${day} ${hours}:${minutes}:${seconds}   ${timeZone}`)
code = code.replace('//CACHE_NAME占位符不能删除和移动', `const CACHE_NAME = '${Math.random().toString(16).slice(2)}'`)
code = code.replace('//urlsToCache占位符不能删除和移动', `const urlsToCache = [${urlsToCache}]`)

fs.writeFile(path.resolve(process.cwd(), './dist/sw.js'), code, (err) => {
  if (err)
    return console.log(err)
  console.log(`Write--- ${chalk.green('serviceWorker')} --complete 💪🤗🤗.`)
})
