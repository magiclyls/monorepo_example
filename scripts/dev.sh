#!/bin/bash
set -e

npx simple-git-hooks

# 启动两个服务，保存它们的 PID
pnpm -r --filter=@tg/server dev &
PID_SERVER=$!

pnpm -r --filter=@tg/toolbox dev &
PID_TOOLBOX=$!

pnpm -r --filter=@tg/icons watch-svg &
PID_ICONS=$!

sleep 2

open http://localhost:9001

# 定义退出时要做的事情
function cleanup {
  echo "Stopping services..."
  kill $PID_SERVER
  kill $PID_TOOLBOX
 kill $PID_ICONS
  exit 0
}

# 捕获 Ctrl+C 信号
trap cleanup SIGINT SIGTERM

# 等待两个后台进程结束
wait $PID_SERVER
wait $PID_TOOLBOX
wait $PID_ICONS


#echo "请选择执行环境："
#echo "1. bc-game-pc"
#echo "2. bc-game-h5"
#echo "3. ph-h5"
#echo "4. lottery-h5"
#
#read -p "请输入数字：" env
#
#node "./scripts/update_vite_press.js" $env
#
#sh "./scripts/vitepress.sh" &
#pid1=$!
#
#pid2="xx"
#
#if [ $env == 1 ]; then
#  echo "执行pc环境"
#  pnpm -r --filter=@tg/bc.game-pc run dev &
#  pid2=$!
#elif [ $env == 2 ]; then
#  pnpm -r --filter=@tg/bc.game-h5 run dev &
#  pid2=$!
#  echo "执行h5环境"
#elif [ $env == 3 ]; then
#  pnpm -r --filter=@tg/ph-h5 run dev &
#  pid2=$!
#  echo "执行ph-h5环境"
#elif [ $env == 4 ]; then
#  pnpm -r --filter=@tg/lottery-h5 run dev &
#  pid2=$!
#  echo "执行彩票环境"
#else
#  echo "输入错误"
#fi
#
#
## 捕获 Ctrl+C 信号，转发给两个服务
#trap "echo '收到退出信号，停止服务...'; kill $pid1 $pid2; exit 0" SIGINT SIGTERM
#
## 等待两个服务都退出
#wait $pid1
#wait $pid2


