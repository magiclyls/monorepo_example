#!/bin/bash
set -e

if [ -n "$(git status -s)" ]
then
    echo "本地有未提交的代码，请先提交代码"
    exit 1
fi

if [ "$(git branch --show-current)" != "dev" ]
then
    echo "当前分支不是dev分支，请切换到dev分支"
    exit 1
fi

if [ "$(git branch --show-current)" == "master" ]
then
    echo "当前分支为master分支，不能直接发布，请切换到dev分支"
    exit 1
fi

git pull origin dev --no-rebase

# 服务器地址
serverDir="/home/rocky/sg/html/member"
# 服务器ip
serverIp="43.198.7.164"
# fat 服务器ip
fatServerIp="43.198.40.130"
# 服务器用户名
serverUser="rocky"

env=$1

if [ ! -n "$env" ]
then
    env="test"
fi

if [ $env != "test" ] && [ $env != "prod" & ] && [ $env != "fat" ]
then
    echo "环境参数错误，请重新输入 [test, prod, fat]"
    read env
fi

# 执行当前目录的language-encryption.js下面的 encryptAllFiles 方法
# node ./scripts/language-encryption.js encryptAllFiles

echo "当前环境为：$env"
echo "开始构建..."
if [ $env == "test" ]
then
    pnpm build:test
fi

if [ $env == "prod" ]
then
    pnpm build:prod
fi

if [ $env == "fat" ]
then
    pnpm build:fat
fi

echo "构建完成"

# 生成SW文件
node ./scripts/runGenSw.js

# echo "开始删除服务器文件..."
ssh $serverUser@$serverIp "sudo rm -rf $serverDir/*"
# echo "删除完成"

echo "开始上传..."

if [ $env == "test" ]
then
    rsync -avz ./dist/* $serverUser@$serverIp:$serverDir
fi

if [ $env == "prod" ]
then
    rsync -avz ./dist/* $serverUser@$serverIp:$serverDir
fi

if [ $env == "fat" ]
then
    rsync -avz ./dist/* $serverUser@$fatServerIp:$serverDir
fi
echo "上传完成"

sleep 3
if [ -n "$(git status -s locales/zh-CN.yml)" ]
then
    echo "zh-CN.yml文件有修改，丢弃本地修改"
    git checkout locales/zh-CN.yml
fi

