import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  rules: {
    'node/prefer-global/process': 'off',
    'no-console': 'off',
    '@typescript-eslint/prefer-literal-enum-member': 'off',
    'unused-imports/no-unused-vars': 'off',
    'regexp/no-unused-capturing-group': 'off',
    'vue/return-in-computed-property': 'off',
    'vue/no-unused-vars': 'off',
    'vue/no-unused-refs': 'off',
    'no-unused-vars': 'off',
  },
  ignores: [
    'node_modules',
    '**/.vscode/**',
    '**/dist/**',
    'packages/**/plugins/*.ts',
    'packages/**/scripts/*.js',
    '*.md',
    'packages/toolbox',
    'packages/server',
    'public/stake/**/*.js',
    'public/afun-pc/**/*.js',
    'packages/stake-h5',
    'packages/afun-pc',
  ],
})
