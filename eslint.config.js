import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  rules: {
    'node/prefer-global/process': 'off',
    'no-console': 'off',
  },
  ignores: [
    'node_modules',
    '**/.vscode/**',
    '**/dist/**',
  ],
})
