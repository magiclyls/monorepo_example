import type { GlobalInitMap } from '@tg/types'
import { reactive } from 'vue'

/** 全局初始化数据 */
const globalInitMap = reactive<GlobalInitMap>({
  isSportsMaintained: null,
  sportsMaintainedStartTime: null,
  sportsMaintainedEndTime: null,
  defaultRedirect: 'casino',
  allBrandInfo: null,
  currentTemplate: 1,
  isOpenRegisterDialog: false,
  isOpenLoginDialog: false,
  isOpenDownLoadDialog: false,
  currentTheme: '',
  isOpenDownLoadDialogBottom: false,
  isPcRenderH5: false,
})

export {
  globalInitMap,
}
