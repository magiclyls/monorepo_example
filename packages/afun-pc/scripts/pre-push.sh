#!/bin/bash
set -e

# 获取本地分支名称
current_branch=$(git rev-parse --abbrev-ref HEAD)

# 如果是master和uat，则允许提交
if [[ $current_branch == "master" || $current_branch == "uat" || $current_branch == "dev" ]]; then
  exit 0
fi

# 可以提交的分支前缀列表 feature-|fix-|test-，如果不在列表中则不允许提交
branch_prefix_list=(feature- jira- test- dev-)
branch_prefix=$(echo ${branch_prefix_list[@]} | tr ' ' '|')

if [[ ! $current_branch =~ ^($branch_prefix) ]]; then
  echo "Error: 请在分支名前加上以下前缀之一：${branch_prefix_list[@]}"
  exit 1
fi

exit 0