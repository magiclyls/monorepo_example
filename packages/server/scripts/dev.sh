#!/bin/bash
set -e

# 项目目录
projectDir=$1
# 服务器对应的目录
serverDir=$2
remoteUser=rocky
remoteHost=18.163.143.231
remotePath=/home/rocky/sg/html/$serverDir

# 检查参数
if [ -z "$projectDir" ] || [ -z "$serverDir" ]; then
  echo "❌ 用法: $0 <projectDir> <serverDir>"
  exit 1
fi

echo "📁 切换目录到: $projectDir"
cd "$projectDir"

echo "🔨 开始构建项目..."
pnpm run build

echo "🧹 清空服务器目录: $remotePath"
ssh "$remoteUser@$remoteHost" "rm -rf $remotePath/*"

echo "🚀 正在同步文件到服务器: $remotePath"
rsync -avz ./dist/ "$remoteUser@$remoteHost:$remotePath"

# 如果是 stake-h5，额外部署到 member 目录
if [ "$serverDir" = "stake-h5" ]; then
  memberPath=/home/rocky/sg/html/member
  echo "🧹 清空服务器目录: $memberPath"
  ssh "$remoteUser@$remoteHost" "rm -rf $memberPath/*"

  echo "🚀 正在同步文件到服务器: $memberPath"
  rsync -avz ./dist/ "$remoteUser@$remoteHost:$memberPath"
fi

# 如果是 lottery-h5，额外部署到 lottery 目录
if [ "$serverDir" = "lottery-h5" ]; then
  memberPath=/home/rocky/sg/html/lottery
  echo "🧹 清空服务器目录: $memberPath"
  ssh "$remoteUser@$remoteHost" "rm -rf $memberPath/*"

  echo "🚀 正在同步文件到服务器: $memberPath"
  rsync -avz ./dist/ "$remoteUser@$remoteHost:$memberPath"
fi

echo "✅ 部署完成！"
