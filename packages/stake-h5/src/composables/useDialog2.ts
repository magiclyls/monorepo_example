import type { App, Component } from 'vue'
import BaseDialog2 from '~/components/BaseDialog2.vue'
import { install } from '~/modules'

interface dialogItem {
  name: string
  close: () => void
}

const baseZIndex = 1000

export const useDialog2Store = createGlobalState(() => {
  const dialogNames = ref<dialogItem[]>([])

  /**
   * 添加对话框
   * @param item
   */
  const addItem = (item: dialogItem) => {
    dialogNames.value.push(item)

    lockBodyScroll(true)
  }

  /**
   * 移除对话框数据
   * @param name 对话框名称
   */
  const removeItem = (name: string) => {
    const index = dialogNames.value.findIndex(item => item.name === name)
    if (index !== -1)
      dialogNames.value.splice(index, 1)

    if (dialogNames.value.length === 0)
      lockBodyScroll(false)
  }

  /**
   * 关闭对话框，如果没有传入name，则关闭最后一个对话框
   * @param name
   */
  const removeDialog = (name?: string) => {
    if (dialogNames.value.length === 0) {
      console.error('没有对话框可以关闭')
      return
    }

    if (!name) {
      const lastDialog = dialogNames.value.pop()
      if (lastDialog)
        lastDialog.close()
    }
    else {
      const index = dialogNames.value.findIndex(item => item.name === name)
      if (index !== -1) {
        dialogNames.value[index].close()
        console.log(`关闭了name为${name}的对话框`)
        console.log(dialogNames.value)
      }
      else {
        console.error(`没有找到name为${name}的对话框`)
      }
    }
  }

  /**
   * 关闭所有对话框
   */
  const removeAllDialog = () => {
    console.log('关闭所有对话框', dialogNames.value)
    const closeAll = dialogNames.value.map(item => item.close)
    dialogNames.value = []
    closeAll.forEach(item => item())
  }

  return {
    dialogNames,
    addItem,
    removeDialog,
    removeItem,
    removeAllDialog,
  }
})

export function useDialog2(component: Component) {
  const { addItem, removeItem, dialogNames } = useDialog2Store()
  const { bool: isOpen, setTrue: setOpenTrue, setFalse: setOpenFalse } = useBoolean(false)
  /** 组件名称 */
  const componentName = component.name
  /** 是否存在name属性 */
  const isExistName = !!componentName
  const dialog = document.createElement('div')
  dialog.className = 'fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center dialog2-background'
  dialog.style.zIndex = String(baseZIndex + dialogNames.value.length)

  let dialogApp: App<Element> | null = null

  /** 关闭对话框 */
  const close = () => {
    if (isOpen.value === false || isExistName === false)
      return

    setOpenFalse()
    removeItem(componentName)
    dialogApp?.unmount()
    document.body.removeChild(dialog)
  }

  /**
   * 打开对话框
   * @param props 传递给对话框组件的props
   */
  const open = (props: Record<string, any>) => {
    if (window.limitType)
      return
    if (isOpen.value === true || isExistName === false)
      return

    if (dialogNames.value.find(item => item.name === componentName)) {
      console.error('已经打开过该对话框')
      return
    }

    dialogApp = createApp(h(BaseDialog2, null, {
      default: () => h(component, {
        ...props,
        closeDialog: close,
      }),
    }))

    // 设置对话框id，可以使用 removeDialog 方法关闭指定对话框
    dialog.id = componentName

    setOpenTrue()
    install(dialogApp)
    addItem({ name: component.name, close })
    dialogApp.mount(dialog)
    document.body.appendChild(dialog)
  }

  function handleDialogClick(e: MouseEvent) {
    if (e.target === dialog)
      close()
  }

  onMounted(() => {
    if (!isExistName)
      console.error('使用useDialog2时，组件必须有name属性, 使用 defineOptions({ name: "xxx" }) 配置')

    dialog.addEventListener('click', handleDialogClick)
  })

  onUnmounted(() => {
    dialog.removeEventListener('click', handleDialogClick)
  })

  return {
    open,
    close,
  }
}
