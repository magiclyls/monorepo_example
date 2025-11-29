const { exec } = require('child_process')
const chokidar = require('chokidar')
const path = require('path')

// 要监听的文件夹
const watchDir = path.resolve(__dirname, '../svg')
const eslintDir = path.resolve(__dirname, '../')

// 初始化监听器
const watcher = chokidar.watch(watchDir, {
  persistent: true,
  ignoreInitial: true, // 是否忽略刚启动时扫描已有文件事件
})

// 监听事件
watcher
  .on('add', path => {
    console.log(`文件新增: ${path}`)
    runCommand('add', path)
  })
  .on('change', path => {
    console.log(`文件修改: ${path}`)
    runCommand('change', path)
  })
  .on('unlink', path => {
    console.log(`文件删除: ${path}`)
    runCommand('unlink', path)
  })

console.log(`开始监听 ${watchDir}`)

let timer = null

function runCommand(event, filePath) {
  clearTimeout(timer)
  timer = setTimeout(() => {
    const cmd = 'pnpm run generate-and-fix'
    console.log(`执行命令: ${cmd}`)
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行命令错误: ${error.message}`)
        return
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`)
      }
      console.log(`命令输出:\n${stdout}`)
    })
  }, 1000) // 200ms 延迟，可自行调整
}
