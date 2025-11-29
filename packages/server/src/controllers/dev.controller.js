const { spawn, execSync } = require('node:child_process')
const path = require('node:path')
const {
  getPortStatus,
  stopPort
} = require("../services/port.service");
const util = require("node:util");
const fs = require('node:fs')
const kill = require('tree-kill');
const { hasUncommittedChanges } = require("./git.controller")
const fsPromises = fs.promises;
const os = require('node:os');
const gitService = require("../services/git.service");

const builds = new Map();

function getAllLocalIPs() {
  const interfaces = os.networkInterfaces()
  let result = ''

  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal && name === 'en0') {
        result = iface.address
      }
    }
  }

  return result
}

async function setExecutable(path) {
  try {
    await fsPromises.chmod(path, 0o755)  // 给文件添加执行权限（rwxr-xr-x）
    console.log(`✅ 权限设置成功: ${path}`)
  } catch (err) {
    console.error(`❌ 设置权限失败: ${err.message}`)
  }
}

// 终止构建任务
function stopBuildTar(id) {
  return new Promise((resolve, reject) => {
    const info = builds.get(id);
    if (!info || !info.childProcess) return false;

    kill(info.childProcess.pid, 'SIGTERM', (err) => {
      if (err) {
        console.error('杀进程失败', err);
        reject(err);
      } else {
        console.log(`构建任务 ${id} 已被终止`);
        resolve(`构建任务 ${id} 已被终止`);
        builds.set(id, { childProcess: null, status: 'terminated' });
      }
    });
  })
}

// 查询构建状态
function isBuilding(id) {
  const info = builds.get(id);
  return info && info.status === 'running';
}

async function build(req, res) {
  const { name: projectName, envi } = req?.body || {}
  if (envi !== 'dev') {
    if (!['tim111', 'roger', 'mount'].includes(req.user?.username)) {
      res.fail("构建失败")
      return
    }
  }

  if (isBuilding(projectName)) {
    res.fail(`构建任务 ${projectName} 已经在运行`)
    return
  }

  if (!projectName) {
    res.fail('请传入项目名称')
    return
  }

  if (await hasUncommittedChanges()) {
    res.fail('本地有未提交代码')
    return
  }


  const scriptPath = path.resolve(__dirname, `../../scripts/${envi}.sh`)
  const projectDir = path.resolve(__dirname, `../../../${projectName}`)

  if (!fs.existsSync(scriptPath)) {
    res.fail("scriptPath 文件不存在")
    return
  }

  if (!fs.existsSync(projectDir)) {
    res.fail("projectDir 文件不存在")
    return
  }

  if (envi === 'prod') {
    if (await gitService.getCurrentBranch() !== 'main') {
      res.fail("需要在 main 提交")
      return
    }

    const a01DistDir = path.resolve(__dirname, `../../../../build-prod-file-prod/${projectName}-dist`)

    await setExecutable(scriptPath)

    // 启动子进程
    const child = spawn(scriptPath, [projectDir, a01DistDir], {
      stdio: 'inherit',     // 继承父进程的输出（控制台同步输出）
      shell: true,           // 使用 shell 执行
      detached: true,
    })

    builds.set(projectName, { childProcess: child, status: 'running' });

    child.on('exit', (code) => {
      builds.set(projectName, { childProcess: null, status: `exited with code ${code}` });
    });

    child.on('close', (code) => {
      if (code === 0) {
        res.success("生产 构建完成")
      } else {
        res.fail(`❌ Shell 执行失败，退出码: ${code}`)
      }
    })

  }


  if (envi === 'a01') {
    if (await gitService.getCurrentBranch() !== 'release') {
      res.fail("需要在 release 提交")
      return
    }

    const a01DistDir = path.resolve(__dirname, `../../../../build-prod-file-a01/${projectName}-dist`)

    await setExecutable(scriptPath)

    // 启动子进程
    const child = spawn(scriptPath, [projectDir, a01DistDir], {
      stdio: 'inherit',     // 继承父进程的输出（控制台同步输出）
      shell: true,           // 使用 shell 执行
      detached: true,
    })

    builds.set(projectName, { childProcess: child, status: 'running' });

    child.on('exit', (code) => {
      builds.set(projectName, { childProcess: null, status: `exited with code ${code}` });
    });

    child.on('close', (code) => {
      if (code === 0) {
        res.success("A01 构建完成")
      } else {
        res.fail(`❌ Shell 执行失败，退出码: ${code}`)
      }
    })

  }


  if (envi === 'dev') {
    if (await gitService.getCurrentBranch() !== 'dev') {
      res.fail("需要在 dev 提交")
      return
    }

    await setExecutable(scriptPath)

    // 启动子进程
    const child = spawn(scriptPath, [projectDir, projectName], {
      stdio: 'inherit',     // 继承父进程的输出（控制台同步输出）
      shell: true,           // 使用 shell 执行
      detached: true,
    })

    builds.set(projectName, { childProcess: child, status: 'running' });

    child.on('exit', (code) => {
      builds.set(projectName, { childProcess: null, status: `exited with code ${code}` });
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Shell 执行成功')
        res.success("构建完成")
      } else {
        res.fail(`❌ Shell 执行失败，退出码: ${code}`)
      }
    })
  }
}

async function stopBuild(req, res) {
  const projectName = req?.body?.name

  if (!projectName) {
    res.fail('请传入项目名称')
    return
  }

  try {
    const buildStatus = isBuilding(projectName)
    if (!buildStatus) {
      res.fail(`${projectName} 已经是停止状态`)
      return
    }

    await stopBuildTar(projectName)

    res.success("成功停止")
  } catch (error) {
    console.log('stopBuild error', error.message)
    res.fail(error.message)
  }
}


async function startDev(req, res) {
  const { key, port } = req.body
  if (!key) return res.fail('请传入key')

  const pidFile = `/tmp/dev-${port || 3000}.pid`
  if (fs.existsSync(pidFile)) fs.unlinkSync(pidFile)

  try {
    const projectDir = path.resolve(__dirname, `../../../${key}`)
    if (fs.existsSync(pidFile)) {
      return res.fail(`端口 ${port || 3000} 已经有进程在运行`)
    }

    const cmd = key === 'components/.docs' ? 'docs:dev' : 'dev --host'
    const child = spawn('pnpm', ['run', cmd], {
      cwd: projectDir,
      detached: true,
      stdio: ['pipe', 'pipe', 'pipe'], // 关键：要拿到输出
      shell: true,
      env: {
        ...process.env,
        PORT: port || 3000,
        NODE_OPTIONS: '--max-old-space-size=8192',
      },
    })

    // 保存 pid
    fs.writeFileSync(pidFile, String(child.pid))
    child.unref()

    let responded = false
    const checkReady = (data) => {
      const str = data.toString()
      // 这里根据 vite 的输出特征匹配
      if (str.includes('http://localhost') && !responded) {
        responded = true
        res.success(`项目已启动，PID: ${child.pid}`)
      }
    }

    child.stdout.on('data', checkReady)
    child.stderr.on('data', (data) => {
      // 可以根据需要打印或处理错误输出
      console.error(data.toString())
    })

    child.on('exit', (code) => {
      if (!responded) res.fail(`进程提前退出，代码：${code}`)
    })
  } catch (error) {
    console.error('startDev error', error)
    res.fail(error.message)
  }
}


async function stopDev(req, res) {
  const { port } = req.body

  if (!port) {
    res.fail('请传入端口(port)')
    return
  }

  try {
    const pidFile = `/tmp/dev-${port}.pid`
    let pid = null

    // 1. 优先读取 pid 文件
    if (fs.existsSync(pidFile)) {
      pid = parseInt(fs.readFileSync(pidFile, 'utf8'), 10)
    }

    // 2. 如果没有 pid 文件 或 pid 无效，就回退到 lsof 查找
    if (!pid || Number.isNaN(pid)) {
      try {
        pid = execSync(`lsof -t -i:${port}`, { encoding: 'utf8' }).trim()
        pid = parseInt(pid, 10)
      } catch {
        res.fail(`未找到端口 ${port} 对应的进程`)
        return
      }
    }

    if (!pid) {
      res.fail(`未找到端口 ${port} 的进程`)
      return
    }

    // 3. 杀掉进程
    try {
      process.kill(pid, 'SIGTERM')
    } catch (e) {
      res.fail(`杀进程失败: ${e.message}`)
      return
    }

    // 4. 清理 pid 文件（如果有）
    if (fs.existsSync(pidFile)) {
      fs.unlinkSync(pidFile)
    }

    await util.promisify(setTimeout)(1000)
    res.success(`已关闭端口 ${port} 的进程 (PID: ${pid})`)
  } catch (error) {
    console.error('stopDev error', error.message)
    res.fail(error.message)
  }
}


async function getProjectStatus(req, res) {
  const projectMap = [
    {
      name: 'Stake H5',
      key: 'stake-h5',
      desc: '仿Stake（原sg-web响应式项目）',
      url: 'http://localhost:9631',
      port: 9631,
      isOpen: false,
      disabled: false,
      projectName: 'stake-h5',
      building: isBuilding('stake-h5'),
      areaNetworkIp: getAllLocalIPs(),
      link: [
        {
          title: '测试',
          url: 'https://a79163.com',
        },{
          title: 'A01',
          url: 'https://a01.uat.today',
        },{
          title: '生产',
          url: 'https://993.com',
        }
      ]
    },
    {
      name: '菲律宾 H5（queen）',
      key: 'ph-h5',
      desc: '模仿Queen',
      url: 'http://localhost:3333',
      port: 3333,
      isOpen: false,
      disabled: false,
      projectName: 'ph-h5',
      building: isBuilding('ph-h5'),
      areaNetworkIp: getAllLocalIPs(),
      link: [
        {
          title: '测试',
          url: 'https://ph.a79163.com',
        },{
          title: 'A01',
          url: 'https://a01.168pn.com',
        }
      ]
    },
    {
      name: '菲律宾 H5（afun）',
      key: 'afun-h5',
      desc: '布局基于queen，颜色基于stake',
      url: 'http://localhost:4738',
      port: 4738,
      isOpen: false,
      disabled: false,
      projectName: 'afun-h5',
      building: isBuilding('afun-h5'),
      areaNetworkIp: getAllLocalIPs(),
      link: [
        {
          title: '测试',
          url: 'https://afun.a79163.com',
        }
      ]
    },
    {
      name: '菲律宾 PC（afun）',
      key: 'afun-pc',
      desc: '基于stake-pc，"我的模块"是需要新设计',
      url: 'http://localhost:9820',
      port: 9820,
      isOpen: false,
      disabled: false,
      projectName: 'afun-pc',
      building: isBuilding('afun-pc'),
      areaNetworkIp: getAllLocalIPs(),
      link: [
        {
          title: '测试',
          url: 'https://afun.a79163.com',
        }
      ]
    },
    {
      name: '彩票 H5',
      key: 'lottery-h5',
      desc: '彩票项目前端 H5 页面',
      url: 'http://localhost:4444',
      port: 4444,
      isOpen: false,
      projectName: 'lottery-h5',
      building: isBuilding('lottery-h5'),
      areaNetworkIp: getAllLocalIPs(),
      link: [
        {
          title: '测试',
          url: 'https://lottery.a79163.com',
        }
      ]
    },
    {
      name: '客服聊天室',
      key: 'chat-h5',
      desc: '客服聊天页面，使用台湾同事Api',
      url: 'http://localhost:9801',
      port: 9801,
      isOpen: false,
      projectName: 'chat-h5',
      building: isBuilding('chat-h5'),
      areaNetworkIp: getAllLocalIPs(),
    },
    {
      name: '活动 Activity',
      key: 'activity',
      desc: '新增活动或者旧活动重构就在这里开发',
      url: '',
      isOpen: false,
      disabled: true,
      areaNetworkIp: getAllLocalIPs(),
    },
    {
      name: '体育 Stake',
      key: 'sports-stake',
      desc: '体育项目 Stake 前端',
      url: '',
      isOpen: false,
      disabled: true,
      areaNetworkIp: getAllLocalIPs(),
    },
    {
      name: '组件库',
      key: 'components/.docs',
      desc: '公司前端组件库项目',
      url: 'http://localhost:5173',
      port: 5173,
      isOpen: false,
      disabled: false,
      areaNetworkIp: getAllLocalIPs(),
    },
    {
      name: 'Icons',
      key: 'icons-preview',
      desc: '公司前端所有 Icons',
      url: 'http://localhost:5555',
      port: 5555,
      isOpen: false,
      disabled: false,
      areaNetworkIp: getAllLocalIPs(),
    },
    {
      name: 'Google Play',
      key: 'google-play',
      desc: '仿Google App下载页面',
      url: 'http://localhost:1748',
      port: 1748,
      isOpen: false,
      disabled: false,
      areaNetworkIp: getAllLocalIPs(),
    },
     {
      name: 'Landing Page',
      key: 'landing-page',
      desc: '落地页',
      url: 'http://localhost:9583',
      port: 9583,
      isOpen: false,
      disabled: false,
      areaNetworkIp: getAllLocalIPs(),
    },
  ]
  for (let i = 0; i < projectMap.length; i++) {
    if (projectMap[i].port) {
      const val = await getPortStatus(projectMap[i].port)
      projectMap[i].isOpen = val.isOpen
    }
  }

  res.success(projectMap)
}

module.exports = {
  startDev,
  stopDev,
  build,
  stopBuild,
  getProjectStatus
}
