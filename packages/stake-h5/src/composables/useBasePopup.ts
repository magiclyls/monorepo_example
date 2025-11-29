import BasePopup from '~/components/BasePopup.vue'
import AppEmptyDiv from '~/components/AppEmptyDiv.vue'
import { install } from '~/modules'

interface DialogOptions {
  onDialogClose?: () => void
  default?: (params?: any) => Component
}

export function useBasePopup({
  onDialogClose,
  default: defaultSlot,
}: DialogOptions) {
  let div: any = null
  let app: any = null

  function openDialog(params?: any) {
    div = document.createElement('div')
    document.body.appendChild(div)

    app = createApp(h(BasePopup, {
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
