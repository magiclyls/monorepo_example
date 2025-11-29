#!/bin/bash
set -e

pwd=$(pwd)
targetUrl=$pwd/src/styles/theme.css

if [ ! -f $targetUrl ]; then
  echo "文件不存在"
  exit 1
fi

perl -i -pe 's/[A-Z]/\L$&/g' $targetUrl
