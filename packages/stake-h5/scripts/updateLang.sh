#!/bin/bash
set -e

sh ./scripts/clone_or_pull_lang.sh

python3 locales/jsonToYmal.py
