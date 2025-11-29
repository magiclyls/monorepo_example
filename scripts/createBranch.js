import chalk from 'chalk'
import { execa } from 'execa'
import inquirer from 'inquirer'

export async function createBranch() {
  const values = await inquirer.prompt([
    {
      type: 'list',
      name: 'branchType',
      message: '请选择要创建的分支类型',
      choices: ['新功能(feature)', 'JIRA单(jira)', '测试(test)'],
    },
    {
      type: 'input',
      name: 'featureName',
      message: '请输入新功能名称',
      when: answers => answers.branchType === '新功能(feature)',
    },
    {
      type: 'input',
      name: 'jiraId',
      message: '请输入JIRA单号',
      when: answers => answers.branchType === 'JIRA单(jira)',
    },
    {
      type: 'list',
      name: 'creator',
      message: '请选择创建者',
      choices: ['jose', 'roger', 'mount', 'peter', 'frank', 'amu', 'ryan'],
    },
  ])

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const date = now.getDate()
  const yearStr = year.toString()
  const monthStr = month < 10 ? `0${month}` : month.toString()
  const dateStr = date < 10 ? `0${date}` : date.toString()
  const today = `${yearStr}${monthStr}${dateStr}`

  // feature-功能名称-日期-姓名
  // jira-JIRA单号-日期-姓名
  // test-日期-姓名
  let branchName = ''
  if (values.branchType === '新功能(feature)')
    branchName = `feature-${values.featureName}-${today}-${values.creator}`
  else if (values.branchType === 'JIRA单(jira)')
    branchName = `jira-${values.jiraId}-${today}-${values.creator}`
  else
    branchName = `test-${today}-${values.creator}`

  console.log(`创建分支：${branchName}`)

  await execa('git', ['checkout', '-b', branchName])
}

export async function checkLocalStatus() {
  const { stdout: status } = await execa('git', ['status', '--porcelain'])
  if (status) {
    console.log(chalk.red('本地有未提交的修改，请先提交修改后再执行此命令'))
    return
  }

  const { stdout } = await execa('git', ['branch', '--show-current'])
  if (stdout !== 'master') {
    console.log(chalk.red('当前分支不是master分支，请切换到master分支后再执行此命令'))
    // 本地没有未提交内容，提示是否切换到master分支并拉取最新代码
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: '是否切换到master分支并拉取最新代码？',
      },
    ])

    if (confirm) {
      await execa('git', ['checkout', 'master'])
      await execa('git', ['pull'])

      createBranch()
    }
  }
  else {
    await execa('git', ['pull'])
    createBranch()
  }
}

checkLocalStatus()
