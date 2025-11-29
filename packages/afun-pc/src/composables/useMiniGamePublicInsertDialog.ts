import AppMiniGamePublicInsertDialog from '~/components/AppMiniGamePublicInsertDialog.vue'
import AppEmptyDiv from '~/components/AppEmptyDiv.vue'
import { install } from '~/modules'

interface DialogOptions {
  title: string
  icon: string
  onDialogClose?: () => void
  default?: (params?: any) => Component
}

export function useMiniGamePublicInsertDialog({
  title,
  icon,
  onDialogClose,
  default: defaultSlot,
}: DialogOptions) {
  let div: any = null
  let app: any = null

  function openDialog(params?: any) {
    div = document.createElement('div')
    document.body.appendChild(div)

    app = createApp(h(AppMiniGamePublicInsertDialog, {
      title,
      icon,
      onClose: () => {
        closeDialog()
        onDialogClose && onDialogClose()
      },
    },
    {
      default: defaultSlot ? () => defaultSlot(params) : () => h(AppEmptyDiv),
    }))

    install(app)
    app.mount(div)
  }

  function closeDialog() {
    if (app) {
      app.unmount()
      app = null
    }
    if (div) {
      div.remove()
      div = null
    }
  }

  return {
    openDialog,
    closeDialog,
  }
}
