import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export const rootDir = dirname(fileURLToPath(import.meta.url))

export const webConfig = {
  // ph-h5 对应的 dev.sh 里面的数字
  3: {
    iconsDir: `${rootDir.replace('/scripts', '')}/packages/ph-h5/src/icons`,
  },
}
