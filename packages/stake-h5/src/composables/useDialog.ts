import BaseDialog from '~/components/BaseDialog.vue'
import AppEmptyDiv from '~/components/AppEmptyDiv.vue'
import { install } from '~/modules'

interface DialogOptions {
  insert?: boolean
  id?: string
  title?: string
  icon?: string
  iconRight?: string
  closeIcon?: string
  maxWidth?: number
  showButtons?: boolean
  transparent?: boolean
  showClose?: boolean
  closeOnClickOverlay?: boolean
  noMoreToday?: boolean
  height?: number | string
  maxHeight?: number | string
  showLoad?: boolean
  modalContentScrollY?: boolean
  hasPadding?: boolean
  clazz?: string
  backgroundColor?: string
  /** 是否预加载弹窗 */
  isPreload?: boolean
  preloadName?: string
  statistics?: boolean
  closeIconStyle?: string
  /** 层级 */
  zIndex?: number | string
  /** 允许多个弹窗Allow multiple popups */
  allowMultipleDialog?: boolean
  onCancel?: () => void
  onConfirm?: () => void
  onBeforeDialogClose?: () => void
  onDialogClose?: () => void
  default?: (params?: any) => Component
  bottomSlot?: () => Component
}

export function useDialog({
  insert,
  id,
  title,
  closeIcon,
  closeIconStyle,
  icon, iconRight, modalContentScrollY, clazz, statistics,
  backgroundColor, zIndex, allowMultipleDialog,
  default: defaultSlot, maxWidth, showButtons, transparent, onCancel, onConfirm, onDialogClose, height, showLoad, maxHeight,
  showClose, closeOnClickOverlay, noMoreToday, bottomSlot, hasPadding, onBeforeDialogClose, isPreload, preloadName,
}: DialogOptions) {
  const isOpen = ref(false)
  const app = ref()
  const div = ref()
  let dialogList = document.querySelector('.tg-dialog-list')
  if (!dialogList) {
    dialogList = document.createElement('div')
    dialogList.className = 'tg-dialog-list'
    document.body.appendChild(dialogList)
  }
  const { includesId, addDialogId, removeDialogId } = useDialogState()
  const { isMobile } = storeToRefs(useWindowStore())
  const { removeTgDialogListWrapOnFullScreen } = useGlobalStateLoginRegisterDialogOpen()

  /**
   * 需要满屏的登陆注册
   * 白、绿、新stake、默认模板移动端
   */
  const fadeInClassName = computed(() => {
    return ['white', 'green'].includes(globalInitMap.currentTheme) || isMobile.value ? 'preload-fadein-fullScreen' : 'preload-fadein'
  })
  const fadeOutClassName = computed(() => {
    return ['white', 'green'].includes(globalInitMap.currentTheme) || isMobile.value ? 'preload-fadeout-fullScreen' : 'preload-fadeout'
  })

  const openDialog = (params?: any) => {
    if (params && params.is_first_load) {
      console.log('first load')
    }
    else {
      if (isPreload && id) {
        document.querySelector(`#parent_${id}`)?.classList?.add(fadeInClassName.value)
        document.querySelector(`#parent_${id}`)?.classList?.remove(fadeOutClassName.value)
      }
    }
    if (window.limitType)
      return

    if (id) {
      if (includesId(id))
        return
      else
        addDialogId(id)
    }

    if (isOpen.value && !allowMultipleDialog)
      return
    div.value = document.createElement('div')
    if (isPreload && id)
      div.value.classList.add('preload-dialog')

    if (id)
      div.value.id = `parent_${id}`

    if (insert)
      dialogList.hasChildNodes() ? dialogList.insertBefore(div.value, dialogList.firstChild) : dialogList.appendChild(div.value)
    else
      dialogList.appendChild(div.value)

    app.value = createApp(h(BaseDialog, {
      id,
      title: params && params.local_dialog_title ? params.title : title,
      icon,
      iconRight,
      closeIcon,
      closeIconStyle,
      maxWidth: maxWidth || params?.maxWidth || 500,
      height: height || params?.height || 0,
      showLoad: showLoad ?? true,
      maxHeight: maxHeight || params?.maxHeight,
      showButtons,
      show: false,
      funcCall: true,
      transparent,
      showClose: params && params.showClose !== undefined ? params.showClose : showClose,
      noMoreToday,
      modalContentScrollY,
      hasPadding: hasPadding || params?.hasPadding,
      clazz,
      backgroundColor,
      zIndex,
      statistics,
      preload: preloadName,
      closeOnClickOverlay: params && params.closeOnClickOverlay !== undefined
        ? params.closeOnClickOverlay
        : closeOnClickOverlay,
      onBeforeClose: () => {
        onBeforeDialogClose && onBeforeDialogClose()
      },
      onClose: () => {
        closeDialog()
        onDialogClose && onDialogClose()
      },
      onCancel: () => {
        onCancel && onCancel()
        closeDialog()
      },
      onConfirm: () => {
        onConfirm && onConfirm()
        closeDialog()
      },
      onDialogBeforeUnmount: () => {
        if (isPreload && id) {
          document.querySelector(`#parent_${id}`)?.classList?.add(fadeOutClassName.value)
          document.querySelector(`#parent_${id}`)?.classList?.remove(fadeInClassName.value)
          document.body.classList.remove('all-style-disabled')
          return
        }

        if (id)
          removeDialogId(id)

        isOpen.value = false
      },
    }, {
      default: () => defaultSlot ? defaultSlot(params) : undefined,
      bottom: bottomSlot ? () => bottomSlot() : () => h(AppEmptyDiv),
    }))
    install(app.value)
    app.value.mount(div.value)
    isOpen.value = true
  }

  function closeDialog() {
    if (isPreload && id) {
      document.querySelector(`#parent_${id}`)?.classList?.add(fadeOutClassName.value)
      document.querySelector(`#parent_${id}`)?.classList?.remove('preload-fadein-fullScreen')
      document.querySelector(`#parent_${id}`)?.classList?.remove('preload-fadein')
      setTimeout(() => {
        document.querySelector(`#parent_${id}`)?.classList?.remove(fadeOutClassName.value)
      }, 200)
      document.body.classList.remove('all-style-disabled')

      removeTgDialogListWrapOnFullScreen()
      return
    }

    if (app.value) {
      app.value.unmount()
      app.value = null
    }
    if (div.value) {
      div.value.remove()
      div.value = null
    }
    isOpen.value = false
    if (id)
      removeDialogId(id)
  }

  // if (isPreload && id)
  //   openDialog({ is_first_load: true })

  return {
    openDialog,
    closeDialog,
  }
}
