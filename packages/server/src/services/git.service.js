const { exec } = require('node:child_process')
const os = require('node:os')
const util = require('node:util')
const fsExtra = require('fs-extra')
const path = require('node:path')

const execAsync = util.promisify(exec)

const langGitRepoPath = `${os.homedir()}/tg-git-tmp/json`

const gitConfig = {
  url: 'git@git.sh9h.com:sg-lang/json.git',
}


/**
 * 执行 git 命令，打印结果
 */
async function runGitCommand({ command, config, description }) {
  console.log(`\n💬 ${description}...`)
  try {
    const { stdout, stderr } = await execAsync(command, config)
    if (stdout) console.log(stdout.trim())
    if (stderr) console.error(stderr.trim())
    return true
  } catch (error) {
    console.error(`❌ 错误：${description}`, error.message)
    console.error(error.message)
    throw new Error(error.message)
  }
}

/**
 * 多语言Git仓库是否存在
 */
function langGitExist() {
  console.log('是否存在', langGitRepoPath)
  return fsExtra.pathExistsSync(`${langGitRepoPath}`)
}

function getGitPath() {
  return langGitRepoPath
}

async function initLangGit() {
  const command = `git clone ${gitConfig.url} ${langGitRepoPath}`
  await runGitCommand({
    command,
    description: "初始化语言仓库"
  })
}

/**
 * 返回传入目录的所有文件夹名称
 * @param {string} dirPath - 要读取的目录路径
 * @returns {Promise<string[]>} - 返回文件夹名称数组
 */
async function getDirList(dirPath) {
  const entries = await fsExtra.readdir(dirPath)

  const dirList = []

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry)
    const stat = await fsExtra.stat(fullPath)
    if (stat.isDirectory()) {
      dirList.push(entry)
    }
  }

  return dirList
}


/**
 * 模拟 git pull 合并
 */
async function tryGitPull(remote = 'origin', branch = 'main') {
  const remoteBranch = `${remote}/${branch}`

  // 确保当前是目标分支
  const { stdout: currentBranch } = await execAsync('git rev-parse --abbrev-ref HEAD', { cwd: getGitPath() })
  if (currentBranch.trim() !== branch) {
    throw new Error(`当前不在 '${branch}' 分支，请切换后再执行。`)
  }

  console.log(`\n🚀 pull ${remoteBranch} 到本地 ${branch} 分支`)

  try {

    console.log('当前分支', currentBranch)

    // 尝试合并（不提交、不 fast-forward）
    await runGitCommand({
      command: `git pull origin ${branch} --no-rebase`,
      config: { cwd: getGitPath() },
    })

    console.log('✅ 没有冲突，合并成功')
  } catch (error) {
    console.error('❌ Pull 错误！', error.message)
    throw new Error(`Pull 错误: ${error.message}`)
  }
}

async function gitAddCommit(args) {
  const {
    remote = 'origin',
    branch = 'main',
    user = ''
  } = args || {}

  try {
    await runGitCommand({
      command: `git add .`,
      config: { cwd: getGitPath() },
    })

    // 先检测是否有变更
    const statusResult = await execAsync('git status --porcelain', { cwd: getGitPath() })
    if (!statusResult.stdout.trim()) {
      console.log('没有变更需要提交，跳过提交')
      return
    }

    await runGitCommand({
      command: `git commit -m "update-${user}"`,
      config: { cwd: getGitPath() },
      description: `提交`,
    })
  } catch (error) {
    console.log('GItAdd', error.message)
    throw new Error('git 添加报错')
  }
}


/**
 * 推送代码
 */
async function tryGitPush(args) {
  const {
    remote = 'origin',
    branch = 'main',
    user = ''
  } = args || {}

  const remoteBranch = `${remote}/${branch}`

  // 确保当前是目标分支
  const { stdout: currentBranch } = await execAsync('git rev-parse --abbrev-ref HEAD', { cwd: getGitPath() })
  if (currentBranch.trim() !== branch) {
    throw new Error(`当前不在 '${branch}' 分支，请切换后再执行。`)
  }

  try {

    await gitAddCommit({remote, branch, user})

    await runGitCommand({
      command: `git push`,
      config: { cwd: getGitPath() },
    })

    console.log("✅ 推送成功")
  } catch (error) {
    console.error('❌ Push 错误！', error)
    throw new Error(`Push 错误: ${error.message}`)
  }
}

/**
 * 获取当前分支
 * @return {Promise<string>}
 */
function getCurrentBranch() {
  return new Promise((resolve, reject) => {
    exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
      if (err) {
        return reject(err)
      }
      resolve(stdout.trim())
    })
  })
}

/**
 * 创建分支
 * @return {boolean}
 */
function createBranch(branchName) {
  return new Promise((resolve, reject) => {
    exec(`git checkout -b ${branchName}`, (err, stdout, stderr) => {
      if (err) {
        return reject(err)
      }
      resolve(stdout.trim())
    })
  })
}

module.exports = {
  langGitExist,
  getGitPath,
  initLangGit,
  getDirList,
  tryGitPull,
  tryGitPush,
  gitAddCommit,
  getCurrentBranch,
  createBranch
}
