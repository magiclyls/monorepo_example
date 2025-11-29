#!/bin/bash
set -e

# 判断当前是不是master分支，不是则退出
if [ $(git symbolic-ref --short -q HEAD) != "master" ]; then
  echo "当前分支不是master分支，退出"
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "当前分支有未提交的内容，退出"
  exit 1
fi


# 目标文件夹地址,前面内容使用
localProdDir="$HOME/Desktop/work/build-file/web-stake"
# 当前目录
currentDir=$(pwd)

echo "目标文件夹地址：$localProdDir"
echo "当前目录：$currentDir"

# 拉取master分支最新代码
git pull origin master

# 执行当前目录的language-encryption.js下面的 encryptAllFiles 方法
# node ./scripts/language-encryption.js encryptAllFiles

pnpm build:production

sleep 3
if [ -n "$(git status -s locales/zh-CN.yml)" ]
then
    echo "zh-CN.yml文件有修改，丢弃本地修改"
    git checkout locales/zh-CN.yml
fi

# 生成SW文件
# node ./scripts/runGenSw.js

# # 删除目标文件夹下的所有文件
rm -rf $localProdDir/*

# #复制当前目录下的dist文件夹的所有内容到目标文件夹
cp -r $currentDir/dist/* $localProdDir

cd $localProdDir

git add .
curDate=$(date "+%Y-%m-%d %H:%M:%S")
git commit -m "build: $curDate"
git push origin master
echo "构建完成"
