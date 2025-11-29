#!/bin/bash
set -e

# 远程Lang 地址
REMOTE_LANG_URL="git@git.sh9h.com:sg-lang/json.git"
# 多语言文件夹
LANG_DIR="./packages/ph-h5/locales"

# 打印当前目录
echo "当前目录: $(pwd)"

cd $LANG_DIR

if [ -d "json" ]; then
  cd json
  git pull origin main
  cd ..
else
  git clone $REMOTE_LANG_URL
fi

if [ ! -d "json" ]; then
  echo "拉取多语言文件失败，请检查网络或者权限"
  exit 1
fi
