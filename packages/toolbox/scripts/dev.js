import { spawn } from 'node:child_process'
// import inquirer from 'inquirer'

const processes = []

function startProcess(command, args, name) {
  const proc = spawn(command, args, { stdio: 'inherit', shell: true })
  processes.push(proc)

  proc.on('close', (code) => {
    console.log(`${name} exited with code ${code}`)
  })
}

startProcess('vite')
startProcess('node', ['./lang-work/json-server.js'])
startProcess('node', ['./lang-work/json-to-file.js'])

process.on('SIGINT', () => {
  console.log(`收到 SIGINT。 正在退出 ${country.toUpperCase()} 进程...`)
  processes.forEach(proc => proc.kill())
  process.exit()
})
