#!/bin/bash
set -e

# 项目目录
projectDir=$1

# 本地文件地址
localDir=$2
branchValue=release

echo "📁 切换目录到: $projectDir"
cd "$projectDir"

echo "🔨 开始构建项目..."
pnpm run build:production

cd "$localDir"

# 判断是不是 release 分支
if [ "$(git branch --show-current)" != "$branchValue" ]; then
  echo "当前分支不是 $branchValue 分支，部署失败！" >&2
  exit 1
fi

rm -rf *
git pull origin "$branchValue"
rm -rf *

# 复制构建文件到本地目录
cp -r "$projectDir/dist"/* .

# 当前时间
currentTime=$(date "+%Y-%m-%d %H:%M:%S")
git add .
git commit -m "a01 更新时间: $currentTime"
git push origin "$branchValue"


echo "✅ 部署完成！"
