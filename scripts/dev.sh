#!/bin/bash
set -e

npx simple-git-hooks

echo "请选择执行环境："
echo "1. pc"
echo "2. h5"

read -p "请输入数字：" env

if [ $env == 1 ]; then
  echo "执行pc环境"
  pnpm -r --filter=@tg/bc.game-pc run dev
elif [ $env == 2 ]; then
  pnpm -r --filter=@tg/bc.game-h5 run dev
  echo "执行h5环境"
else
  echo "输入错误"
fi
