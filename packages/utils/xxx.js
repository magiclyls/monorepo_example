import fs from 'node:fs'
import path from 'node:path'
// save as get-exports.ts
import { Project, SyntaxKind } from 'ts-morph'

// 当前目录
const ROOT_DIR = path.resolve('./')

// 初始化项目（不依赖 tsconfig.json）
const project = new Project()

// 添加当前目录下所有 ts 文件（排除 node_modules）
const sourceFiles = project.addSourceFilesAtPaths(`${ROOT_DIR}/**/*.ts`)
const exportsList = []

sourceFiles.forEach((file) => {
  file.getExportedDeclarations().forEach((decls, name) => {
    decls.forEach((decl) => {
      const kind = decl.getKind()
      if (
        kind === SyntaxKind.FunctionDeclaration
        || kind === SyntaxKind.VariableDeclaration
        || kind === SyntaxKind.ClassDeclaration
        || kind === SyntaxKind.EnumDeclaration
        || kind === SyntaxKind.InterfaceDeclaration
        || kind === SyntaxKind.TypeAliasDeclaration
      ) {
        exportsList.push(name)
      }
    })
  })
})

const uniqueArr = [...new Set(exportsList)]

// 保存到文件
fs.writeFileSync(path.join(ROOT_DIR, 'exported-names.json'), JSON.stringify(uniqueArr, null, 2))
console.log('Exported names saved to exported-names.json')
