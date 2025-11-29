export const useGlobalStateWalletState = createGlobalState(() => {
  // 钱包弹窗是否打开
  const {
    bool: isWalletDialogOpen,
    setTrue: setIsWalletDialogOpenTrue,
    setFalse: setIsWalletDialogOpenFalse,
  } = useBoolean(false)

  // 是否有待触发的PWA弹窗
  const {
    bool: isHaveWaitingPWADialog,
    setTrue: setIsHaveWaitingPWADialogTrue,
    setFalse: setIsHaveWaitingPWADialogFalse,
  } = useBoolean(false)

  // 是否有待触发的登陆PWA弹窗
  const {
    bool: isHaveWaitingLoginPWADialog,
    setTrue: setIsHaveWaitingLoginPWADialogTrue,
    setFalse: setIsHaveWaitingLoginPWADialogFalse,
  } = useBoolean(false)

  return {
    isWalletDialogOpen,
    setIsWalletDialogOpenTrue,
    setIsWalletDialogOpenFalse,
    isHaveWaitingPWADialog,
    setIsHaveWaitingPWADialogTrue,
    setIsHaveWaitingPWADialogFalse,
    isHaveWaitingLoginPWADialog,
    setIsHaveWaitingLoginPWADialogTrue,
    setIsHaveWaitingLoginPWADialogFalse,
  }
})
