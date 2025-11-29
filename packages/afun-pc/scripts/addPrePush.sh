#!/bin/bash
set -e

# 复制当前目录下的 pre-push.sh 文件到 .git/hooks 目录下
cp ./scripts/pre-push.sh ./.git/hooks/pre-push

chmod +x ./.git/hooks/pre-push