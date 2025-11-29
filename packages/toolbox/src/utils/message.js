// utils/message.js
let messageApi = null

export const setMessageApi = (api) => {
  messageApi = api
}

export const message = {
  success(content, duration) {
    messageApi?.success({ content, duration })
  },
  error(content, duration) {
    messageApi?.error({ content, duration })
  },
  info(content, duration) {
    messageApi?.info({ content, duration })
  },
  warning(content, duration) {
    messageApi?.warning({ content, duration })
  },
  loading(content, duration) {
    messageApi?.loading({ content, duration })
  },
}
