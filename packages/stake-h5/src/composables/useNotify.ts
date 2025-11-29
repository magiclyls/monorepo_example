import BaseNotify from '~/components/BaseNotify.vue'
import { install } from '~/modules'

export type notifyType =
'set' | 'user' | 'email' | 'error' | 'success' | 'insurance' | 'statistics' | 'phone' | 'wallet' | 'auto' | 'info' | 'chat'

function getUuid() {
  const temp_url = URL.createObjectURL(new Blob())
  const uuid = temp_url.toString()
  URL.revokeObjectURL(temp_url)
  return uuid.substring(uuid.lastIndexOf('/') + 1)
}

const OnlyOne: any = {

}

export function useNotify({
  showClose,
  onClose,
  onNotifyClick,
}:
{ onClose?: () => void; onNotifyClick?: () => void; showClose?: boolean } = {}) {
  const app = ref<any>({})
  const box = ref<any>({})
  const notificationList = document.querySelector('.tg-notification-list')

  const closeNotify = (uuid: string, code?: string) => {
    if (app.value[uuid] && box.value[uuid]) {
      const notify = app.value[uuid]
      notify.unmount()
      const div = box.value[uuid]
      div.remove()
      delete app.value[uuid]
      delete box.value[uuid]
      onClose && onClose()
      if (code && OnlyOne[code])
        delete OnlyOne[code]
    }
  }

  /** 关闭所有通知，确保只存在最新的一条 */
  const closeAllNotify = () => {
    Object.keys(app.value).forEach(uuid => closeNotify(uuid))
  }

  const openNotify = ({
    code,
    type,
    icon,
    iconColor,
    title,
    clazz,
    message,
    default: defaultSlot,
  }:
  {
    code?: string
    type?: notifyType
    icon?: string
    iconColor?: string
    clazz?: string
    title?: string | (() => Component)
    message?: string | (() => Component)
    default?: () => Component }) => {
    closeAllNotify()

    if (code) {
      if (OnlyOne[code])
        return
      else
        OnlyOne[code] = true
    }
    if (notificationList) {
      const uuid = getUuid()
      box.value[uuid] = document.createElement('div')
      notificationList.appendChild(box.value[uuid])
      app.value[uuid] = (createApp(h(BaseNotify, {
        title: typeof title === 'string' ? title : undefined,
        message: typeof message === 'string' ? message : undefined,
        type,
        icon,
        iconColor,
        showClose,
        clazz,
        funcCall: uuid,
        onClose: (uuid: string) => {
          closeNotify(uuid, code)
        },
        onNotifyClick: () => {
          onNotifyClick && onNotifyClick()
        },
      }, {
        default: () => defaultSlot !== void 0 ? defaultSlot() : null,
        title: () => {
          return title === void 0 ? null : (typeof title === 'string' ? null : title())
        },
        message: () => {
          return message === void 0 ? null : (typeof message === 'string' ? null : message())
        },
      })))
      install(app.value[uuid])
      app.value[uuid].mount(box.value[uuid])
    }
  }

  return {
    openNotify,
    closeNotify,
  }
}
