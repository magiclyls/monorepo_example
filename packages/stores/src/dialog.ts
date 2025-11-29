import { useBoolean } from '@tg/hooks'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useDialogStore = defineStore('dialog', () => {
  const { bool: isAnimating, setBool: setIsAnimating } = useBoolean(false)
  const { bool: isOpenLogin, setBool: setIsOpenLogin } = useBoolean(false)
  const { bool: isOpenRegister, setBool: setIsOpenRegister } = useBoolean(false)
  const { bool: isOpenResetPassword, setBool: setIsOpenResetPassword } = useBoolean(false)
  const { bool: rechargeOpen, setBool: setRechargeOpen } = useBoolean(false)
  const { bool: withdrawOpen, setBool: setWithdrawOpen } = useBoolean(false)
  const { bool: globalSearchOpen, setBool: setGlobalSearchOpen } = useBoolean(false)
  const { bool: isCloseAllDialog, setBool: setIsCloseAllDialog } = useBoolean(true)

  function openDialog(v: string) {
    if (isAnimating.value) {
      return
    }
    if (v === 'isOpenLogin') {
      setIsOpenLogin(true)
    }
    if (v === 'isOpenResetPassword') {
      setIsOpenResetPassword(true)
    }
  }
  return {
    /** 动画状态 */
    isAnimating,
    /** 登录弹框 */
    isOpenLogin,
    /** 注册弹框 */
    isOpenRegister,
    /** 重置密码弹框 */
    isOpenResetPassword,
    /** 是否关闭所有弹框 */
    isCloseAllDialog,
    /** 充值弹框 */
    rechargeOpen,
    /** 提现弹框 */
    withdrawOpen,
    /** 全局搜索弹框 */
    globalSearchOpen,
    /** 设置动画状态 */
    setIsAnimating,
    /** 设置登录弹框开启状态 */
    setIsOpenLogin,
    /** 设置注册弹框开启状态 */
    setIsOpenRegister,
    /** 设置重置密码弹框开启状态 */
    setIsOpenResetPassword,
    /** 设置充值弹框开启状态 */
    setRechargeOpen,
    /** 设置提现弹框开启状态 */
    setWithdrawOpen,
    /** 设置全局搜索弹框开启状态 */
    setGlobalSearchOpen,
    /** 设置关闭所有弹框状态 */
    setIsCloseAllDialog,
    /** 打开指定弹框 */
    openDialog,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useDialogStore, import.meta.hot))
