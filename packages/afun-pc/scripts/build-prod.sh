#!/bin/bash
set -e

projectName=$1
userName=$2

if [ -z "$projectName" ]; then
  echo "请输入参数 a01, 生产"
  exit 1
fi

if [ "$projectName" = "a01" ]; then
  # 判断当前是不是release分支，不是则退出
  if [ $(git symbolic-ref --short -q HEAD) != "release" ]; then
    echo "当前分支不是release分支，退出"
    exit 1
  fi
else
  # 判断当前是不是master分支，不是则退出
  if [ $(git symbolic-ref --short -q HEAD) != "master" ]; then
    echo "当前分支不是master分支，退出"
    exit 1
  fi
fi


if [ -n "$(git status --porcelain)" ]; then
  echo "当前分支有未提交的内容，退出"
  exit 1
fi


# 目标文件夹地址,前面内容使用
if [ "$userName" = "vay" ]; then
  localProdDir="/Volumes/Snipaste-2.10.4/sg/build-file/web-stake"
else
  localProdDir="$HOME/Desktop/work/stake"
fi

# 当前目录
currentDir=$(pwd)

echo "目标文件夹地址：$localProdDir"
echo "当前目录：$currentDir"

# 拉取master分支最新代码
if [ "$projectName" = "a01" ]; then
  git pull origin release
else
  git pull origin master
fi

# 执行当前目录的language-encryption.js下面的 encryptAllFiles 方法
# node ./scripts/language-encryption.js encryptAllFiles

echo "开始更新语言包..."
pnpm updateLang

echo "更新完成"


pnpm build:production

sleep 3
if [ -n "$(git status -s locales/zh-CN.yml)" ]
then
    echo "zh-CN.yml文件有修改，丢弃本地修改"
    git checkout locales/zh-CN.yml
fi

# 生成SW文件
# node ./scripts/runGenSw.js

cd $localProdDir

# 切换web-stake项目
if [ "$projectName" = "a01" ]; then
  git checkout release
else
  git checkout master
fi

# # 删除目标文件夹下的所有文件
rm -rf $localProdDir/*

echo "开始拉取打包项目的最新代码"
if [ "$projectName" = "a01" ]; then
  git pull origin release --no-rebase
else
  git pull origin master --no-rebase
fi

# #复制当前目录下的dist文件夹的所有内容到目标文件夹
cp -r $currentDir/dist/* $localProdDir

cd $localProdDir

git add .
curDate=$(date "+%Y-%m-%d %H:%M:%S")
git commit -m "build: $curDate"
if [ "$projectName" = "a01" ]; then
  git push origin release
else
  git push origin master
fi
echo "构建完成"
