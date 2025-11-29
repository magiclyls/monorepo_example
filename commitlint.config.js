import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'cz-git'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const packages = fs.readdirSync(path.resolve(__dirname, 'packages'))

const __SCOPE_CACHE_PATH = path.resolve(__dirname, './.git/scope-cache.json')

function setCacheScope(scope) {
  if (!scope)
    return
  if (!fs.existsSync(__SCOPE_CACHE_PATH)) {
    fs.writeFileSync(
      __SCOPE_CACHE_PATH,
      JSON.stringify([scope], null, 2),
      'utf8',
    )
  }
  else {
    const tmp = new Set(
      JSON.parse(fs.readFileSync(__SCOPE_CACHE_PATH, 'utf8')),
    )
    tmp.add(scope)
    fs.writeFileSync(
      __SCOPE_CACHE_PATH,
      JSON.stringify([...tmp], null, 2),
      'utf8',
    )
  }
}

function getCacheScope() {
  if (!fs.existsSync(__SCOPE_CACHE_PATH)) {
    return []
  }
  else {
    return JSON.parse(fs.readFileSync(__SCOPE_CACHE_PATH, 'utf8'))
  }
}

export default defineConfig({
  extends: ['@commitlint/config-conventional'],
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
    'scope-empty': [2, 'never'],
  },
  prompt: {
    alias: { fd: 'docs: fix typos' },
    messages: {
      type: '选择你要提交的类型 :',
      scope: '选择一个提交范围（可选）:',
      customScope: '请输入自定义的提交范围 :',
      subject: '填写简短精炼的变更描述 :\n',
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
      footerPrefixesSelect: '选择关联issue前缀（可选）:',
      customFooterPrefix: '输入自定义issue前缀 :',
      footer: '列举关联issue (可选) 例如: #31, #I3244 :\n',
      confirmCommit: '是否提交或修改commit ?',
    },
    types: [
      { value: 'feat', name: 'feat:     新增功能 | A new feature' },
      { value: 'fix', name: 'fix:      修复缺陷 | A bug fix' },
      { value: 'docs', name: 'docs:     文档更新 | Documentation only changes' },
      { value: 'style', name: 'style:    代码格式 | Changes that do not affect the meaning of the code' },
      { value: 'refactor', name: 'refactor: 代码重构 | A code change that neither fixes a bug nor adds a feature' },
      { value: 'perf', name: 'perf:     性能提升 | A code change that improves performance' },
      { value: 'test', name: 'test:     测试相关 | Adding missing tests or correcting existing tests' },
      { value: 'build', name: 'build:    构建相关 | Changes that affect the build system or external dependencies' },
      { value: 'ci', name: 'ci:       持续集成 | Changes to our CI configuration files and scripts' },
      { value: 'revert', name: 'revert:   回退代码 | Revert to a commit' },
      { value: 'chore', name: 'chore:    其他修改 | Other changes that do not modify src or test files' },
    ],
    useEmoji: false,
    emojiAlign: 'center',
    useAI: false,
    aiNumber: 1,
    themeColorCode: '',
    scopes: [...new Set([
      ...getCacheScope(),
      ...packages,
    ])],
    allowCustomScopes: true,
    allowEmptyScopes: false,
    customScopesAlign: 'bottom',
    customScopesAlias: 'custom',
    emptyScopesAlias: 'empty',
    upperCaseSubject: null,
    markBreakingChangeMode: false,
    allowBreakingChanges: ['feat', 'fix'],
    breaklineNumber: 100,
    breaklineChar: '|',
    skipQuestions: [],
    issuePrefixes: [
      // 如果使用 gitee 作为开发管理
      { value: 'link', name: 'link:     链接 ISSUES 进行中' },
      { value: 'closed', name: 'closed:   标记 ISSUES 已完成' },
    ],
    formatMessageCB: ({ defaultMessage, scope }) => {
      // eslint-disable-next-line no-control-regex
      setCacheScope(scope.replaceAll(/\x1B\[[0-9;]*[mG]/g, ''))
      return defaultMessage
    },
    customIssuePrefixAlign: 'top',
    emptyIssuePrefixAlias: 'skip',
    customIssuePrefixAlias: 'custom',
    allowCustomIssuePrefix: true,
    allowEmptyIssuePrefix: true,
    confirmColorize: true,
    scopeOverrides: undefined,
    defaultBody: '',
    defaultIssues: '',
    defaultScope: '',
    defaultSubject: '',
  },
})
