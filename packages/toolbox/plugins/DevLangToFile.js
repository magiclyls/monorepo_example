import { spawn } from 'node:child_process'
// plugins/vite-plugin-run-on-file-change.js
import path from 'node:path'

/**
 * @param {object} options
 * @param {string} options.watchFile - 要监听的文件路径（相对于项目根目录）
 * @param {string} options.command - 要执行的命令（如 'pnpm' 或 'npm'）
 * @param {string[]} [options.args] - 命令的参数（如 ['run', 'build']）
 * @returns {import('vite').Plugin}
 */
function runOnFileChangePlugin(options) {
  const { watchFile, command, args = [] } = options

  return {
    name: 'vite-plugin-run-on-file-change',
    apply: 'serve', // 仅在 dev 模式下启用
    configureServer(server) {
      const fileToWatch = path.resolve(process.cwd(), watchFile)

      server.watcher.add(fileToWatch)

      server.watcher.on('change', (changedPath) => {
        if (path.resolve(changedPath) === fileToWatch) {
          console.log(`[plugin] File changed: ${watchFile}, running: ${command} ${args.join(' ')}`)

          const child = spawn(command, args, {
            stdio: 'inherit',
            shell: true, // 允许执行带空格/路径的命令
          })

          child.on('exit', (code) => {
            console.log(`[plugin] Script exited with code ${code}`)
          })
        }
      })
    },
  }
}

export default runOnFileChangePlugin
