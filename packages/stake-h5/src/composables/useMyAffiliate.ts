export function useMyAffiliate() {
  const router = useLocalRouter()
  const { isLogin } = storeToRefs(useAppStore())
  const { openRegisterDialog } = useRegisterDialog()

  onMounted(() => {
    const parentUid = router.currentRoute.value.query.u
    const parentC = router.currentRoute.value.query.c
    if (((parentUid && parentUid.length) || (parentC && parentC.length)) && !isLogin.value)
      openRegisterDialog()
  })
}
