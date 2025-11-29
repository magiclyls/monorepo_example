import AppResolveLocked from '~/components/AppResolveLocked.vue'

export function useDialogResolveLocked() {
  const {
    openDialog: openResolveLockedDialog,
    closeDialog: closeResolveLockedDialog,
  } = useDialog({
    // title: title.value,
    // icon: 'uni-set',
    title: '',
    icon: '',
    closeOnClickOverlay: false,
    default: data => h(AppResolveLocked, data),
  })

  return {
    openResolveLockedDialog,
    closeResolveLockedDialog,
  }
}
