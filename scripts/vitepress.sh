#!/bin/bash
set -e

cd packages/components/.docs

pnpm run docs:dev
